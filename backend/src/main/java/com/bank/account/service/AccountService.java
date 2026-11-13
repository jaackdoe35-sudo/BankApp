package com.bank.account.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.notification.service.NotificationService;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.repo.LedgerEntryRepository;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountService {

    private static final String DEFAULT_CURRENCY = "USD";
    private static final BigDecimal NORTHSTAR_OPENING_BALANCE = new BigDecimal("5000000.00");
    private static final BigDecimal ADMIN_OPENING_BALANCE = new BigDecimal("1000000000000.00");

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final LedgerService ledgerService;
    private final EventPublisher eventPublisher;
    private final NotificationService notificationService;

    public AccountService(AccountRepository accountRepository,
                          LedgerEntryRepository ledgerEntryRepository,
                          LedgerService ledgerService,
                          EventPublisher eventPublisher,
                          NotificationService notificationService) {
        this.accountRepository = accountRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.ledgerService = ledgerService;
        this.eventPublisher = eventPublisher;
        this.notificationService = notificationService;
    }

    @Transactional
    public Account createAccount(UUID userId, AccountType type, String currency) {
        if (type == AccountType.SYSTEM) {
            throw new IllegalArgumentException("Cannot open a SYSTEM account");
        }
        String ccy = currency == null ? DEFAULT_CURRENCY : currency.toUpperCase();
        if (!DEFAULT_CURRENCY.equals(ccy)) {
            throw new IllegalArgumentException("Only USD accounts are supported");
        }
        Account account = new Account(generateAccountNumber(), userId, type, ccy);
        Account saved = accountRepository.save(account);

        // Every newly opened Northstar customer account receives one synthetic
        // opening credit, posted atomically through the balanced ledger.
        Account system = systemAccount(ccy);
        ledgerService.post(TransactionType.DEPOSIT, "Northstar synthetic opening balance",
                "northstar-opening:" + saved.getId(), List.of(
                        PostingLine.credit(saved.getId(), NORTHSTAR_OPENING_BALANCE),
                        PostingLine.debit(system.getId(), NORTHSTAR_OPENING_BALANCE)));
        DomainEvent opened = DomainEvent.of(EventActions.DEPOSIT, userId, userId,
                "ACCOUNT", saved.getId().toString(),
                "Your new " + saved.getType() + " account has been successfully opened with an opening balance of "
                        + formatUsd(NORTHSTAR_OPENING_BALANCE) + ".", true);
        notificationService.handle(opened);
        eventPublisher.publish(opened);
        return saved;
    }

    /** Creates the designated administrator's synthetic wallet exactly once. */
    @Transactional
    public Account getOrCreateAdminWallet(UUID adminUserId) {
        List<Account> existing = accountRepository.findByOwnerUserIdOrderByCreatedAtAsc(adminUserId);
        return existing.stream()
                .filter(a -> a.getType() == AccountType.CHECKING && "USD".equals(a.getCurrency()))
                .findFirst()
                .orElseGet(() -> {
                    Account wallet = accountRepository.save(
                            new Account(generateAccountNumber(), adminUserId, AccountType.CHECKING, DEFAULT_CURRENCY));
                    Account system = systemAccount(DEFAULT_CURRENCY);
                    ledgerService.post(TransactionType.DEPOSIT, "Northstar synthetic admin opening balance",
                            "northstar-admin-opening:" + adminUserId, List.of(
                                    PostingLine.credit(wallet.getId(), ADMIN_OPENING_BALANCE),
                                    PostingLine.debit(system.getId(), ADMIN_OPENING_BALANCE)));
                    DomainEvent opened = DomainEvent.of(EventActions.DEPOSIT, adminUserId, adminUserId,
                            "ACCOUNT", wallet.getId().toString(),
                            "Your administrator wallet has been successfully opened with an opening balance of "
                                    + formatUsd(ADMIN_OPENING_BALANCE) + ".", true);
                    notificationService.handle(opened);
                    eventPublisher.publish(opened);
                    return wallet;
                });
    }

    private static String formatUsd(BigDecimal amount) {
        return "USD " + NumberFormat.getNumberInstance(Locale.US).format(amount);
    }

    /** Credits a customer from the designated administrator's wallet. */
    @Transactional
    public Account adminTransfer(UUID adminUserId, String accountNumber, BigDecimal amount) {
        if (amount == null || amount.signum() <= 0 || amount.scale() > 2) {
            throw new IllegalArgumentException("Amount must be positive and have at most two decimal places");
        }
        Account recipient = accountRepository.findByAccountNumber(accountNumber)
                .filter(a -> a.getType() != AccountType.SYSTEM && !adminUserId.equals(a.getOwnerUserId()))
                .orElseThrow(() -> new NotFoundException("Customer account not found"));
        if (recipient.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        Account wallet = getOrCreateAdminWallet(adminUserId);
        ledgerService.post(TransactionType.TRANSFER, "Administrator customer credit", null, List.of(
                PostingLine.debit(wallet.getId(), amount),
                PostingLine.credit(recipient.getId(), amount)));
        String suffix = recipient.getAccountNumber().substring(
                Math.max(0, recipient.getAccountNumber().length() - 4));
        DomainEvent received = DomainEvent.of(EventActions.DEPOSIT, adminUserId, recipient.getOwnerUserId(),
                "ACCOUNT", recipient.getId().toString(),
                "You have received " + recipient.getCurrency() + " " + amount.toPlainString()
                        + " in your account ending " + suffix + ".", true);
        notificationService.handle(received);
        eventPublisher.publish(received);
        return recipient;
    }

    @Transactional(readOnly = true)
    public List<Account> listAllCustomerAccounts() {
        return accountRepository.findAll().stream()
                .filter(a -> a.getType() != AccountType.SYSTEM)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Account> listAccounts(UUID userId) {
        return accountRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional(readOnly = true)
    public Account getAccount(UUID userId, UUID accountId) {
        return requireOwnedAccount(userId, accountId);
    }

    @Transactional(readOnly = true)
    public Account withdraw(UUID userId, UUID accountId) {
        requireOwnedAccount(userId, accountId);
        throw new IllegalArgumentException("withdrawal declined");
    }

    @Transactional(readOnly = true)
    public List<LedgerEntry> listTransactions(UUID userId, UUID accountId) {
        requireOwnedAccount(userId, accountId);
        return ledgerEntryRepository.findByAccountIdWithTransaction(accountId);
    }

    private Account requireOwnedAccount(UUID userId, UUID accountId) {
        return accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    private Account requireActiveAccount(UUID userId, UUID accountId) {
        Account account = requireOwnedAccount(userId, accountId);
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        return account;
    }

    private Account systemAccount(String currency) {
        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)
                .orElseThrow(() -> new NotFoundException("System account not configured for " + currency));
    }

    private String generateAccountNumber() {
        String candidate;
        do {
            long n = ThreadLocalRandom.current().nextLong(100_000_000_000L, 1_000_000_000_000L);
            candidate = Long.toString(n);
        } while (accountRepository.existsByAccountNumber(candidate));
        return candidate;
    }
}

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
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountService {

    private static final String DEFAULT_CURRENCY = "USD";
    private static final BigDecimal NORTHSTAR_OPENING_BALANCE = new BigDecimal("5000000.00");

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
        return saved;
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

    /**
     * Teller deposit: an admin records a cash deposit into a customer's account
     * (by account number). Customers cannot self-deposit — money otherwise enters
     * only via card top-ups or incoming transfers.
     */
    @Transactional
    public Account tellerDeposit(UUID actorUserId, String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .filter(a -> a.getType() != AccountType.SYSTEM)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        Account system = systemAccount(account.getCurrency());
        ledgerService.post(TransactionType.DEPOSIT, "Teller deposit", null, List.of(
                PostingLine.credit(account.getId(), amount),
                PostingLine.debit(system.getId(), amount)));
        String creditedAccountNumber = account.getAccountNumber();
        String suffix = creditedAccountNumber.substring(Math.max(0, creditedAccountNumber.length() - 4));
        DomainEvent received = DomainEvent.of(EventActions.DEPOSIT, actorUserId, account.getOwnerUserId(),
                "ACCOUNT", account.getId().toString(),
                "You have received " + account.getCurrency() + " " + amount.toPlainString()
                        + " in your account ending " + suffix + ".", true);
        // Send directly so the recipient is notified even when production runs without Kafka.
        // If Kafka is enabled, its consumer sees the same eventId and remains idempotent.
        notificationService.handle(received);
        eventPublisher.publish(received);
        return account;
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

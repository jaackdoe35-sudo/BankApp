package com.bank.account.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.repo.CustomerProfileRepository;
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

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final LedgerService ledgerService;
    private final EventPublisher eventPublisher;
    private final CustomerProfileRepository profileRepository;

    public AccountService(AccountRepository accountRepository,
                          LedgerEntryRepository ledgerEntryRepository,
                          LedgerService ledgerService,
                          EventPublisher eventPublisher,
                          CustomerProfileRepository profileRepository) {
        this.accountRepository = accountRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.ledgerService = ledgerService;
        this.eventPublisher = eventPublisher;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Account createAccount(UUID userId, AccountType type, String currency) {
        if (type == AccountType.SYSTEM) {
            throw new IllegalArgumentException("Cannot open a SYSTEM account");
        }
        KycStatus kyc = profileRepository.findByUserId(userId)
                .map(p -> p.getKycStatus())
                .orElse(KycStatus.PENDING);
        if (kyc != KycStatus.VERIFIED) {
            throw new IllegalArgumentException("Verify your KYC before opening an account");
        }
        String ccy = currency == null ? DEFAULT_CURRENCY : currency.toUpperCase();
        if (!DEFAULT_CURRENCY.equals(ccy)) {
            throw new IllegalArgumentException("Only USD accounts are supported");
        }
        Account account = new Account(generateAccountNumber(), userId, type, ccy);
        return accountRepository.save(account);
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
        eventPublisher.publish(DomainEvent.of(EventActions.DEPOSIT, actorUserId, account.getOwnerUserId(),
                "ACCOUNT", account.getId().toString(),
                "Deposit of " + amount + " to " + account.getAccountNumber(), true));
        return account;
    }

    @Transactional
    public Account withdraw(UUID userId, UUID accountId, BigDecimal amount) {
        Account account = requireActiveAccount(userId, accountId);
        Account system = systemAccount(account.getCurrency());
        ledgerService.post(TransactionType.WITHDRAWAL, "Withdrawal", null, List.of(
                PostingLine.debit(account.getId(), amount),
                PostingLine.credit(system.getId(), amount)));
        eventPublisher.publish(DomainEvent.userAction(EventActions.WITHDRAWAL, userId, "ACCOUNT",
                accountId.toString(), "Withdrawal of " + amount + " from " + account.getAccountNumber()));
        return account;
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

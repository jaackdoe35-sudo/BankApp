package com.bank.ledger.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.InsufficientFundsException;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.repo.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * The single entry point for moving money. Enforces the double-entry invariant
 * (signed amounts sum to zero), locks affected accounts in a deterministic order
 * to stay deadlock-free, updates materialized balances, and records immutable
 * ledger entries with a running {@code balanceAfter}.
 */
@Service
public class LedgerService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public LedgerService(AccountRepository accountRepository,
                         TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction post(TransactionType type, String description,
                            String idempotencyKey, List<PostingLine> lines) {
        if (idempotencyKey != null) {
            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                return existing.get();
            }
        }
        validateBalanced(lines);

        // Lock every affected account, in UUID order, before mutating any balance.
        Map<UUID, Account> locked = lockAccounts(lines);

        Transaction txn = new Transaction(generateReference(), type, description);
        txn.setIdempotencyKey(idempotencyKey);

        for (PostingLine line : lines) {
            Account account = locked.get(line.accountId());
            BigDecimal newBalance = account.getBalance().add(line.signedAmount());
            if (account.getType() != AccountType.SYSTEM && newBalance.signum() < 0) {
                throw new InsufficientFundsException(
                        "Insufficient funds in account " + account.getAccountNumber());
            }
            account.setBalance(newBalance);

            LedgerEntry entry = new LedgerEntry(line.accountId(), line.direction(), line.amount());
            entry.setBalanceAfter(newBalance);
            txn.addEntry(entry);
        }
        return transactionRepository.save(txn);
    }

    private Map<UUID, Account> lockAccounts(List<PostingLine> lines) {
        List<UUID> ids = lines.stream()
                .map(PostingLine::accountId)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
        Map<UUID, Account> locked = new LinkedHashMap<>();
        for (UUID id : ids) {
            Account account = accountRepository.findForUpdate(id)
                    .orElseThrow(() -> new NotFoundException("Account not found: " + id));
            locked.put(id, account);
        }
        return locked;
    }

    private void validateBalanced(List<PostingLine> lines) {
        if (lines.size() < 2) {
            throw new IllegalArgumentException("A transaction needs at least two entries");
        }
        BigDecimal sum = lines.stream()
                .map(PostingLine::signedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.signum() != 0) {
            throw new IllegalArgumentException("Ledger entries do not balance to zero");
        }
    }

    private String generateReference() {
        return "TXN-" + Long.toHexString(ThreadLocalRandom.current().nextLong() & Long.MAX_VALUE)
                .toUpperCase();
    }
}

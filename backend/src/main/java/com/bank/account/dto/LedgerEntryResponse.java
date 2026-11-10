package com.bank.account.dto;

import com.bank.ledger.domain.EntryDirection;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LedgerEntryResponse(
        UUID id,
        UUID transactionId,
        String reference,
        TransactionType type,
        String description,
        EntryDirection direction,
        BigDecimal amount,
        BigDecimal balanceAfter,
        Instant createdAt
) {
    public static LedgerEntryResponse from(LedgerEntry e) {
        var txn = e.getTransaction();
        return new LedgerEntryResponse(
                e.getId(),
                txn.getId(),
                txn.getReference(),
                txn.getType(),
                txn.getDescription(),
                e.getDirection(),
                e.getAmount(),
                e.getBalanceAfter(),
                e.getCreatedAt());
    }
}

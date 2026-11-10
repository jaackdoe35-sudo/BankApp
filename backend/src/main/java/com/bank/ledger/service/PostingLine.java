package com.bank.ledger.service;

import com.bank.ledger.domain.EntryDirection;

import java.math.BigDecimal;
import java.util.UUID;

/** One requested leg of a transaction to be posted by {@link LedgerService}. */
public record PostingLine(UUID accountId, EntryDirection direction, BigDecimal amount) {

    public static PostingLine debit(UUID accountId, BigDecimal amount) {
        return new PostingLine(accountId, EntryDirection.DEBIT, amount);
    }

    public static PostingLine credit(UUID accountId, BigDecimal amount) {
        return new PostingLine(accountId, EntryDirection.CREDIT, amount);
    }

    public BigDecimal signedAmount() {
        return direction.apply(amount);
    }
}

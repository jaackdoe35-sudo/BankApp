package com.bank.ledger.domain;

import java.math.BigDecimal;

/**
 * Double-entry direction. Uniform sign rule: a CREDIT adds to an account's
 * balance and a DEBIT subtracts. A transaction is balanced iff its entries'
 * signed amounts sum to zero.
 */
public enum EntryDirection {
    DEBIT,
    CREDIT;

    public BigDecimal apply(BigDecimal amount) {
        return this == CREDIT ? amount : amount.negate();
    }
}

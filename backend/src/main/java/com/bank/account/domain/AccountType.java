package com.bank.account.domain;

public enum AccountType {
    CHECKING,
    SAVINGS,
    /** Internal settlement/GL account; not owned by a customer. */
    SYSTEM
}

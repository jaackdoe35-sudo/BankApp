package com.bank.customer.domain;

/**
 * Know-Your-Customer verification state. New profiles start PENDING and are
 * moved to VERIFIED/REJECTED by an admin.
 */
public enum KycStatus {
    PENDING,
    VERIFIED,
    REJECTED
}

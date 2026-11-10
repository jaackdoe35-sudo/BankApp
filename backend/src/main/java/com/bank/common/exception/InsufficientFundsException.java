package com.bank.common.exception;

/** Thrown when an account has insufficient balance for a debit. Maps to HTTP 422. */
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

package com.bank.common.exception;

/** Thrown when a card/payment is declined (frozen card, limit exceeded, etc.). Maps to HTTP 422. */
public class PaymentDeclinedException extends RuntimeException {
    public PaymentDeclinedException(String message) {
        super(message);
    }
}

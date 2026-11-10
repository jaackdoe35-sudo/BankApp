package com.bank.common.exception;

/** Thrown when a request conflicts with current state (e.g. duplicate email). Maps to HTTP 409. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

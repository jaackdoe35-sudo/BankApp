package com.bank.notification.email;

/** Leaves email queued until a real HTTPS provider is configured. */
public class UnconfiguredEmailSender implements EmailSender {
    @Override
    public void send(String to, String subject, String body) {
        throw new IllegalStateException("Email provider is not configured");
    }
}

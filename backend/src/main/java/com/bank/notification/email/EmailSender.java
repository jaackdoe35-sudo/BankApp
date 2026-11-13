package com.bank.notification.email;

/** Sends transactional email; delivery is performed outside financial transactions. */
public interface EmailSender {
    void send(String to, String subject, String body);

    /** True only when a real delivery provider is configured. */
    default boolean isConfigured() {
        return false;
    }
}

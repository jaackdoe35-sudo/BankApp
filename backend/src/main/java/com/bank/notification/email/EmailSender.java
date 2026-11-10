package com.bank.notification.email;

/** Sends transactional email. Implementations: simulated (logs) or SMTP. */
public interface EmailSender {
    void send(String to, String subject, String body);
}

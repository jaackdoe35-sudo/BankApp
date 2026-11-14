package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Test-only sender. It never represents actual email delivery. */
public class SimulatedEmailSender implements EmailSender {
    private static final Logger log = LoggerFactory.getLogger(SimulatedEmailSender.class);

    @Override
    public void send(String to, String subject, String body) {
        log.info("[SIMULATED EMAIL] to={} subject=\"{}\" body=\"{}\"", to, subject, body);
    }
}

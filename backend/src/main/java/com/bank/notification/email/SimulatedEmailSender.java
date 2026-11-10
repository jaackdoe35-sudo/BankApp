package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Default email sender: logs the message instead of sending it (no setup needed). */
public class SimulatedEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(SimulatedEmailSender.class);

    @Override
    public void send(String to, String subject, String body) {
        log.info("[SIMULATED EMAIL] to={} subject=\"{}\" body=\"{}\"", to, subject, body);
    }
}

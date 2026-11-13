package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailConfig {
    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);

    @Bean
    public EmailSender emailSender(
            @Value("${app.mail.resend.api-key:}") String apiKey,
            @Value("${app.mail.from:}") String from) {
        if (apiKey != null && !apiKey.isBlank() && from != null && !from.isBlank()) {
            log.info("Email: Resend HTTPS API configured");
            return new ResendEmailSender(apiKey.trim(), from.trim());
        }
        log.warn("Email: no real provider configured; messages will remain queued");
        return new UnconfiguredEmailSender();
    }
}

package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class EmailConfig {
    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);

    @Bean
    public EmailSender emailSender(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${spring.mail.host:}") String host,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password,
            @Value("${app.mail.from:}") String configuredFrom) {
        if (host.isBlank() || username.isBlank() || password.isBlank()) {
            log.warn("Email: Gmail SMTP credentials incomplete; messages remain queued");
            return new UnconfiguredEmailSender();
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.error("Email: SMTP credentials exist but JavaMailSender is unavailable");
            return new UnconfiguredEmailSender();
        }
        String from = configuredFrom.isBlank() ? username.trim() : configuredFrom.trim();
        log.info("Email: SMTP sender configured for host {}", host);
        return new SmtpEmailSender(mailSender, from);
    }
}

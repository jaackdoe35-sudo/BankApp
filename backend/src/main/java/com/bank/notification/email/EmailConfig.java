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
            GmailCredentialStore gmailCredentialStore,
            @Value("${app.mail.oauth.client-id:}") String gmailClientId,
            @Value("${app.mail.oauth.client-secret:}") String gmailClientSecret,
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${spring.mail.host:}") String smtpHost,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${spring.mail.password:}") String smtpPassword,
            @Value("${app.mail.from:}") String configuredFrom) {

        if (present(gmailClientId) && present(gmailClientSecret) && gmailCredentialStore.hasCredential()) {
            log.info("Email: Gmail API HTTPS sender configured");
            return new GmailApiEmailSender(gmailClientId.trim(), gmailClientSecret.trim(), gmailCredentialStore);
        }

        if (present(smtpHost) && present(smtpUsername) && present(smtpPassword)) {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender != null) {
                String from = present(configuredFrom) ? configuredFrom.trim() : smtpUsername.trim();
                log.info("Email: SMTP provider configured for host {}", smtpHost);
                return new SmtpEmailSender(mailSender, from);
            }
        }

        log.warn("Email: no authorized provider configured; messages will remain queued");
        return new UnconfiguredEmailSender();
    }

    private static boolean present(String value) {
        return value != null && !value.isBlank();
    }
}

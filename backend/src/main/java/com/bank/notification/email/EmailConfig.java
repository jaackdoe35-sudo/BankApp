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

        // OAuth client configuration selects Gmail API even before the first account
        // authorization. This prevents configured SMTP variables from silently taking
        // over while the Gmail refresh token has not yet been saved.
        if (present(gmailClientId) && present(gmailClientSecret)) {
            if (gmailCredentialStore.hasCredential()) {
                log.info("Email: Gmail API HTTPS sender selected with an authorized account");
            } else {
                log.info("Email: Gmail API HTTPS sender selected; waiting for account authorization");
            }
            return new GmailApiEmailSender(gmailClientId.trim(), gmailClientSecret.trim(), gmailCredentialStore);
        }

        // SMTP is a fallback only when Gmail OAuth client configuration is absent.
        if (present(smtpHost) && present(smtpUsername) && present(smtpPassword)) {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender != null) {
                String from = present(configuredFrom) ? configuredFrom.trim() : smtpUsername.trim();
                log.info("Email: SMTP fallback configured for host {}", smtpHost);
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

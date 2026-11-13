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
            @Value("${app.mail.emailjs.service-id:}") String emailJsServiceId,
            @Value("${app.mail.emailjs.template-id:}") String emailJsTemplateId,
            @Value("${app.mail.emailjs.public-key:}") String emailJsPublicKey,
            @Value("${app.mail.emailjs.private-key:}") String emailJsPrivateKey,
            @Value("${spring.mail.host:}") String smtpHost,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${spring.mail.password:}") String smtpPassword,
            @Value("${app.mail.from:}") String configuredFrom) {

        if (present(emailJsServiceId) && present(emailJsTemplateId)
                && present(emailJsPublicKey) && present(emailJsPrivateKey)) {
            log.info("Email: EmailJS HTTPS provider configured");
            return new EmailJsEmailSender(emailJsServiceId.trim(), emailJsTemplateId.trim(),
                    emailJsPublicKey.trim(), emailJsPrivateKey.trim(),
                    present(configuredFrom) ? configuredFrom.trim() : "");
        }

        if (present(smtpHost) && present(smtpUsername) && present(smtpPassword)) {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender != null) {
                String from = present(configuredFrom) ? configuredFrom.trim() : smtpUsername.trim();
                log.info("Email: SMTP provider configured for host {}", smtpHost);
                return new SmtpEmailSender(mailSender, from);
            }
            log.error("Email: SMTP credentials exist but JavaMailSender is unavailable");
        }

        log.warn("Email: no supported provider configured; messages will remain queued");
        return new UnconfiguredEmailSender();
    }

    private static boolean present(String value) {
        return value != null && !value.isBlank();
    }
}

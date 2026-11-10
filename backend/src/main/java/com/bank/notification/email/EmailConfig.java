package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * Selects the email sender at startup: SMTP when a JavaMailSender is present
 * (i.e. spring.mail.host is configured), otherwise the simulated logger.
 */
@Configuration
public class EmailConfig {

    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);

    @Bean
    public EmailSender emailSender(ObjectProvider<JavaMailSender> mailSender,
                                   @Value("${app.mail.from:no-reply@bank.local}") String from) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender != null) {
            log.info("Email: SMTP (mail host configured)");
            return new SmtpEmailSender(sender, from);
        }
        log.info("Email: SIMULATED (no mail host configured)");
        return new SimulatedEmailSender();
    }
}

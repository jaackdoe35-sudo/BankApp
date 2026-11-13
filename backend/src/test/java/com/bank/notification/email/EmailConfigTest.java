package com.bank.notification.email;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class EmailConfigTest {
    private final EmailConfig config = new EmailConfig();

    @Test
    void selectsGmailApiWhenOAuthAndAuthorizedAccountExist() {
        GmailCredentialStore store = mock(GmailCredentialStore.class);
        when(store.hasCredential()).thenReturn(true);
        EmailSender sender = config.emailSender(store, "client-id", "client-secret",
                mock(ObjectProvider.class), "", "", "", "");
        assertThat(sender).isInstanceOf(GmailApiEmailSender.class);
        assertThat(sender.isConfigured()).isTrue();
    }

    @Test
    void selectsGmailApiBeforeAccountAuthorizationAndKeepsOutboxUnconfigured() {
        GmailCredentialStore store = mock(GmailCredentialStore.class);
        when(store.hasCredential()).thenReturn(false);
        EmailSender sender = config.emailSender(store, "client-id", "client-secret",
                mock(ObjectProvider.class), "smtp.gmail.com", "smtp-user", "smtp-password", "");
        assertThat(sender).isInstanceOf(GmailApiEmailSender.class);
        assertThat(sender.isConfigured()).isFalse();
    }

    @Test
    void retainsSmtpFallbackOnlyWhenAllSmtpCredentialsExist() {
        GmailCredentialStore store = mock(GmailCredentialStore.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<JavaMailSender> provider = mock(ObjectProvider.class);
        JavaMailSender javaMailSender = mock(JavaMailSender.class);
        when(provider.getIfAvailable()).thenReturn(javaMailSender);
        EmailSender sender = config.emailSender(store, "", "", provider,
                "smtp.example.test", "sender@example.test", "password", "");
        assertThat(sender).isInstanceOf(SmtpEmailSender.class);
        assertThat(sender.isConfigured()).isTrue();
    }

    @Test
    void doesNotEnableSmtpWithoutPassword() {
        GmailCredentialStore store = mock(GmailCredentialStore.class);
        EmailSender sender = config.emailSender(store, "", "",
                mock(ObjectProvider.class), "smtp.example.test", "sender@example.test", "", "");
        assertThat(sender).isInstanceOf(UnconfiguredEmailSender.class);
        assertThat(sender.isConfigured()).isFalse();
    }
}

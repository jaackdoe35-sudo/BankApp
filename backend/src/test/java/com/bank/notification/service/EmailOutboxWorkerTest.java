package com.bank.notification.service;

import com.bank.notification.email.EmailSender;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class EmailOutboxWorkerTest {

    @Test
    void leavesQueuedMessagesUntouchedUntilARealProviderIsConfigured() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        EmailSender sender = mock(EmailSender.class);
        PlatformTransactionManager transactions = mock(PlatformTransactionManager.class);
        when(sender.isConfigured()).thenReturn(false);

        new EmailOutboxWorker(jdbc, sender, transactions).dispatchPending();

        verify(sender).isConfigured();
        verifyNoInteractions(jdbc, transactions);
    }
}

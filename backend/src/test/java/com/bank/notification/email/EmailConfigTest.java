package com.bank.notification.email;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EmailConfigTest {

    private final EmailConfig config = new EmailConfig();

    @Test
    void realResendSenderRequiresBothApiKeyAndSenderAddress() {
        EmailSender sender = config.emailSender("re_test_key", "bankapp@example.test");

        assertThat(sender).isInstanceOf(ResendEmailSender.class);
        assertThat(sender.isConfigured()).isTrue();
    }

    @Test
    void missingApiKeyLeavesProviderUnconfigured() {
        EmailSender sender = config.emailSender("", "bankapp@example.test");

        assertThat(sender).isInstanceOf(UnconfiguredEmailSender.class);
        assertThat(sender.isConfigured()).isFalse();
    }

    @Test
    void missingSenderAddressLeavesProviderUnconfigured() {
        EmailSender sender = config.emailSender("re_test_key", "");

        assertThat(sender).isInstanceOf(UnconfiguredEmailSender.class);
        assertThat(sender.isConfigured()).isFalse();
    }
}

package com.bank.notification;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationAuditIntegrationTest extends AbstractIntegrationTest {

    private JsonNode notifications(String token) throws Exception {
        String json = mvc.perform(get("/api/v1/notifications").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private long unread(String token) throws Exception {
        String json = mvc.perform(get("/api/v1/notifications/unread-count")
                        .header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("count").asLong();
    }

    private boolean hasAction(JsonNode arr, String action) {
        for (JsonNode n : arr) {
            if (action.equals(n.get("type").asText())) return true;
        }
        return false;
    }

    @Test
    void registrationCreatesWelcomeNotificationAndAudit() throws Exception {
        String token = register("notify-welcome@example.com");

        await().atMost(Duration.ofSeconds(30)).pollInterval(Duration.ofMillis(500))
                .ignoreExceptions()
                .untilAsserted(() -> assertThat(hasAction(notifications(token), "USER_REGISTERED")).isTrue());

        assertThat(unread(token)).isGreaterThan(0);
        mvc.perform(post("/api/v1/notifications/read-all").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        assertThat(unread(token)).isZero();

        String admin = adminToken();
        await().atMost(Duration.ofSeconds(30)).pollInterval(Duration.ofMillis(500))
                .ignoreExceptions()
                .untilAsserted(() -> {
                    String json = mvc.perform(get("/api/v1/admin/audit?size=200")
                                    .header("Authorization", "Bearer " + admin))
                            .andExpect(status().isOk())
                            .andReturn().getResponse().getContentAsString();
                    JsonNode arr = mapper.readTree(json);
                    boolean found = false;
                    for (JsonNode a : arr) {
                        if ("USER_REGISTERED".equals(a.get("action").asText())) found = true;
                    }
                    assertThat(found).isTrue();
                });
    }

    @Test
    void transferNotifiesSenderAndRecipient() throws Exception {
        String sender = registerVerified("notify-sender@example.com");
        String recipient = registerVerified("notify-recipient@example.com");

        JsonNode senderAcct = openAccount(sender);
        String recipientNumber = openAccount(recipient).get("accountNumber").asText();
        tellerDeposit(senderAcct.get("accountNumber").asText(), "100.00");

        mvc.perform(post("/api/v1/transfers").header("Authorization", "Bearer " + sender)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sourceAccountId\":\"" + senderAcct.get("id").asText()
                                + "\",\"destinationAccountNumber\":\"" + recipientNumber + "\",\"amount\":25.00}"))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(30)).pollInterval(Duration.ofMillis(500))
                .ignoreExceptions()
                .untilAsserted(() -> {
                    assertThat(hasAction(notifications(sender), "TRANSFER_SENT")).isTrue();
                    assertThat(hasAction(notifications(recipient), "TRANSFER_RECEIVED")).isTrue();
                });
    }
}

package com.bank.account;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.bank.notification.email.EmailSender;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.HashSet;
import java.util.Set;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.is;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.atLeast;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminDepositIntegrationTest extends AbstractIntegrationTest {

    @SpyBean
    EmailSender emailSender;

    @Test
    void customerCanOpenAccountImmediatelyAfterRegistration() throws Exception {
        String token = register("account-open@example.com");
        mvc.perform(post("/api/v1/accounts").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.currency", is("USD")))
                .andExpect(jsonPath("$.balance", is(5000000.00)));
    }

    @Test
    void customerSelfDepositEndpointIsGone() throws Exception {
        String token = registerVerified("self-deposit-gone@example.com");
        String accountId = openAccount(token).get("id").asText();
        mvc.perform(post("/api/v1/accounts/" + accountId + "/deposit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":50.00}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void customerCannotUseTellerDeposit() throws Exception {
        String token = registerVerified("teller-denied@example.com");
        String number = openAccount(token).get("accountNumber").asText();
        // The customer's own token may not hit the admin teller endpoint.
        mvc.perform(post("/api/v1/admin/accounts/deposit").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":\"" + number + "\",\"amount\":100.00}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminTellerDepositCreditsAccount() throws Exception {
        String token = registerVerified("teller-ok@example.com");
        JsonNode account = openAccount(token);
        tellerDeposit(account.get("accountNumber").asText(), "250.00");

        mvc.perform(get("/api/v1/accounts/" + account.get("id").asText())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance", is(5000250.00)));
    }

    @Test
    void designatedAdminGetsOneTrillionDollarWallet() throws Exception {
        mvc.perform(get("/api/v1/admin/accounts/wallet").header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").isNumber());
    }

    @Test
    void adminCanListCustomerAccounts() throws Exception {
        String token = registerVerified("teller-list@example.com");
        String number = openAccount(token).get("accountNumber").asText();
        String admin = adminToken();

        String json = mvc.perform(get("/api/v1/admin/accounts").header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        // The newly opened account appears with its owner's email.
        org.assertj.core.api.Assertions.assertThat(json).contains(number).contains("teller-list@example.com");
    }
    @Test
    void registrationAutomaticallyAssignsDistinctAccountNumbers() throws Exception {
        Set<String> accountNumbers = new HashSet<>();
        for (int i = 0; i < 6; i++) {
            String token = register("number-assignment-" + i + "@example.com");
            String json = mvc.perform(get("/api/v1/accounts").header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
            JsonNode accounts = mapper.readTree(json);
            assertThat(accounts).hasSize(1);
            String number = accounts.get(0).get("accountNumber").asText();
            assertThat(number).matches("\\d{12}");
            assertThat(accountNumbers.add(number)).isTrue();
        }
    }

    @Test
    void adminCanSendToAccountNumberAndRecipientGetsNotificationAndEmail() throws Exception {
        String recipientEmail = "admin-send-recipient@example.com";
        String recipientToken = register(recipientEmail);
        String accountsJson = mvc.perform(get("/api/v1/accounts")
                        .header("Authorization", "Bearer " + recipientToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode account = mapper.readTree(accountsJson).get(0);
        String accountNumber = account.get("accountNumber").asText();

        mvc.perform(post("/api/v1/admin/accounts/send").header("Authorization", "Bearer " + adminToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":\"" + accountNumber + "\",\"amount\":75.50}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber", is(accountNumber)))
                .andExpect(jsonPath("$.balance", is(5000075.50)));

        String notificationsJson = mvc.perform(get("/api/v1/notifications")
                        .header("Authorization", "Bearer " + recipientToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode notifications = mapper.readTree(notificationsJson);
        boolean received = false;
        for (JsonNode notification : notifications) {
            if ("DEPOSIT".equals(notification.path("type").asText())
                    && notification.path("message").asText().contains("You have received USD 75.50")) {
                received = true;
            }
        }
        assertThat(received).isTrue();
        verify(emailSender, atLeast(2)).send(eq(recipientEmail), eq("Deposit"), anyString());
    }

}

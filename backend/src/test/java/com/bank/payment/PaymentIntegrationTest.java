package com.bank.payment;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

class PaymentIntegrationTest extends AbstractIntegrationTest {

    private JsonNode topUp(String token, String accountId, String amount) throws Exception {
        String json = mvc.perform(post("/api/v1/payments/top-up")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"amount\":" + amount + "}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    @Test
    void topUpThenConfirmCreditsAccount() throws Exception {
        String token = registerVerified("pay-topup@example.com");
        String acct = openAccount(token).get("id").asText();

        JsonNode created = topUp(token, acct, "100.00");
        assertThat(created.get("manualConfirm").asBoolean()).isTrue(); // simulated gateway
        String paymentId = created.get("paymentId").asText();

        mvc.perform(post("/api/v1/payments/" + paymentId + "/confirm")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCEEDED"));

        assertThat(balance(token, acct)).isEqualTo(5000100.00);

        mvc.perform(get("/api/v1/notifications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString(
                        "Your USD 100.00 top-up was successful and has been credited to your account ending")));
    }

    @Test
    void doubleConfirmCreditsOnce() throws Exception {
        String token = registerVerified("pay-idem@example.com");
        String acct = openAccount(token).get("id").asText();
        String paymentId = topUp(token, acct, "40.00").get("paymentId").asText();

        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/v1/payments/" + paymentId + "/confirm")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }
        assertThat(balance(token, acct)).isEqualTo(5000040.00);
    }
}

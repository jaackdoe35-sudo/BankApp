package com.bank.card;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CardIntegrationTest extends AbstractIntegrationTest {

    private JsonNode issueCard(String token, String accountId, String limit) throws Exception {
        String json = mvc.perform(post("/api/v1/cards")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"monthlyLimit\":" + limit + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private int pay(String token, String cardId, String amount) throws Exception {
        return mvc.perform(post("/api/v1/cards/" + cardId + "/pay")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"merchant\":\"Acme\",\"amount\":" + amount + "}"))
                .andReturn().getResponse().getStatus();
    }

    @Test
    void issueReturnsFullPanOnceAndStoresLast4() throws Exception {
        String token = registerVerified("card-issue@example.com");
        String acct = openAccount(token).get("id").asText();
        JsonNode res = issueCard(token, acct, "0");

        String pan = res.get("cardNumber").asText();
        assertThat(pan).hasSize(16);
        assertThat(res.get("card").get("last4").asText()).isEqualTo(pan.substring(12));
        assertThat(res.get("card").get("brand").asText()).isEqualTo("VISA");
    }

    @Test
    void cardPaymentDebitsAccount() throws Exception {
        String token = registerVerified("card-pay@example.com");
        JsonNode account = openAccount(token);
        tellerDeposit(account.get("accountNumber").asText(), "200.00");
        String cardId = issueCard(token, account.get("id").asText(), "0").get("card").get("id").asText();

        mvc.perform(post("/api/v1/cards/" + cardId + "/pay")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"merchant\":\"Coffee Co\",\"amount\":50.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountBalanceAfter", is(150.00)));
    }

    @Test
    void monthlyLimitIsEnforced() throws Exception {
        String token = registerVerified("card-limit@example.com");
        JsonNode account = openAccount(token);
        tellerDeposit(account.get("accountNumber").asText(), "1000.00");
        String cardId = issueCard(token, account.get("id").asText(), "100.00").get("card").get("id").asText();

        assertThat(pay(token, cardId, "60.00")).isEqualTo(200);
        assertThat(pay(token, cardId, "60.00")).isEqualTo(422); // 60 + 60 > 100
    }

    @Test
    void frozenCardIsDeclined() throws Exception {
        String token = registerVerified("card-frozen@example.com");
        JsonNode account = openAccount(token);
        tellerDeposit(account.get("accountNumber").asText(), "100.00");
        String cardId = issueCard(token, account.get("id").asText(), "0").get("card").get("id").asText();

        mvc.perform(post("/api/v1/cards/" + cardId + "/freeze")
                .header("Authorization", "Bearer " + token)).andExpect(status().isOk());
        assertThat(pay(token, cardId, "10.00")).isEqualTo(422);
    }

    @Test
    void insufficientFundsIsRejected() throws Exception {
        String token = registerVerified("card-funds@example.com");
        String acct = openAccount(token).get("id").asText();
        String cardId = issueCard(token, acct, "0").get("card").get("id").asText();
        assertThat(pay(token, cardId, "10.00")).isEqualTo(422);
    }
}

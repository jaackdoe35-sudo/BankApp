package com.bank.transfer;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransferIntegrationTest extends AbstractIntegrationTest {

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    private String transferBody(String sourceId, String destNumber, String amount) {
        return """
                {"sourceAccountId":"%s","destinationAccountNumber":"%s","amount":%s}
                """.formatted(sourceId, destNumber, amount);
    }

    @Test
    void transferMovesMoneyBetweenAccounts() throws Exception {
        String token = registerVerified("tx-move@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        tellerDeposit(a.get("accountNumber").asText(), "200.00");

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "75.00")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.sourceBalanceAfter", is(125.00)));

        org.assertj.core.api.Assertions.assertThat(balance(token, a.get("id").asText())).isEqualTo(125.00);
        org.assertj.core.api.Assertions.assertThat(balance(token, b.get("id").asText())).isEqualTo(75.00);
    }

    @Test
    void idempotentKeyPostsTransferOnce() throws Exception {
        String token = registerVerified("tx-idem@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        tellerDeposit(a.get("accountNumber").asText(), "100.00");
        String body = transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "30.00");

        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/v1/transfers")
                            .header("Authorization", "Bearer " + token)
                            .header("Idempotency-Key", "dup-key-123")
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isOk());
        }
        org.assertj.core.api.Assertions.assertThat(balance(token, b.get("id").asText())).isEqualTo(30.00);
        org.assertj.core.api.Assertions.assertThat(balance(token, a.get("id").asText())).isEqualTo(70.00);
    }

    @Test
    void insufficientFundsRejected() throws Exception {
        String token = registerVerified("tx-insuf@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "50.00")))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void destinationNotFoundAndSameAccountRejected() throws Exception {
        String token = registerVerified("tx-bad@example.com");
        JsonNode a = openAccount(token);
        tellerDeposit(a.get("accountNumber").asText(), "10.00");

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), "999999999999", "5.00")))
                .andExpect(status().isNotFound());

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), a.get("accountNumber").asText(), "5.00")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cannotTransferFromUnownedAccount() throws Exception {
        String alice = registerVerified("tx-alice@example.com");
        JsonNode aliceAcct = openAccount(alice);
        String bob = registerVerified("tx-bob@example.com");
        JsonNode bobAcct = openAccount(bob);

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + bob)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(aliceAcct.get("id").asText(),
                                bobAcct.get("accountNumber").asText(), "5.00")))
                .andExpect(status().isNotFound());
    }

    @Test
    void beneficiaryCrud() throws Exception {
        String token = registerVerified("tx-ben@example.com");
        String acctNo = openAccount(token).get("accountNumber").asText();
        String body = "{\"nickname\":\"Savings\",\"accountNumber\":\"" + acctNo + "\"}";

        String created = mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nickname", is("Savings")))
                .andReturn().getResponse().getContentAsString();
        String beneficiaryId = mapper.readTree(created).get("id").asText();

        mvc.perform(get("/api/v1/beneficiaries").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountNumber", is(acctNo)));

        mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());

        mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"Ghost\",\"accountNumber\":\"000000000000\"}"))
                .andExpect(status().isNotFound());

        mvc.perform(delete("/api/v1/beneficiaries/" + beneficiaryId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }
}

package com.bank.account;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminDepositIntegrationTest extends AbstractIntegrationTest {

    @Test
    void openingAccountRequiresVerifiedKyc() throws Exception {
        String token = register("kyc-gate@example.com"); // not verified
        mvc.perform(post("/api/v1/accounts").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isBadRequest());
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
                .andExpect(jsonPath("$.balance", is(250.00)));
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
}

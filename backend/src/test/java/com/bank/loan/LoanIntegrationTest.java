package com.bank.loan;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LoanIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    JdbcTemplate jdbc;

    private JsonNode apply(String token, String accountId, String principal, int term) throws Exception {
        String json = mvc.perform(post("/api/v1/loans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"principal\":" + principal
                                + ",\"termMonths\":" + term + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    @Test
    void loanApplicationDoesNotRequireKyc() throws Exception {
        String token = register("loan-nokyc@example.com");
        String acct = openAccount(token).get("id").asText();
        apply(token, acct, "300.00", 3);
    }

    @Test
    void loanRepaymentIsDisabledAndDoesNotChangeBalance() throws Exception {
        String token = registerVerified("loan-life@example.com");
        String admin = adminToken();
        JsonNode account = openAccount(token);
        String acct = account.get("id").asText();
        tellerDeposit(account.get("accountNumber").asText(), "100.00");
        String loanId = apply(token, acct, "300.00", 3).get("id").asText();
        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk()).andExpect(jsonPath("$.loan.status").value("ACTIVE"));
        assertThat(balance(token, acct)).isEqualTo(5000100.00);
        for (int i = 0; i < 3; i++) {
            mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isUnprocessableEntity());
        }
        assertThat(balance(token, acct)).isEqualTo(400.00);
    }

    @Test
    void withdrawalAndLoanRepaymentAreRejectedWithoutBalanceDeduction() throws Exception {
        String token = register("loan-broke@example.com");
        String admin = adminToken();
        String acct = openAccount(token).get("id").asText();
        String loanId = apply(token, acct, "300.00", 3).get("id").asText();

        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk());

        mvc.perform(post("/api/v1/accounts/" + acct + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":300.00}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("withdrawal rejected"));

        mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnprocessableEntity());
        assertThat(balance(token, acct)).isEqualTo(5000000.00);
    }
}

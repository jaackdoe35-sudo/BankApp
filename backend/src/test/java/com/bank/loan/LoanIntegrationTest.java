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

    private void setKyc(String userId, String statusValue) throws Exception {
        mvc.perform(post("/api/v1/admin/users/" + userId + "/kyc")
                        .header("Authorization", "Bearer " + adminToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"" + statusValue + "\"}"))
                .andExpect(status().isOk());
    }

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
    void applyRequiresVerifiedKyc() throws Exception {
        // Account opening already needs KYC; revoke it afterwards to exercise the loan gate.
        String token = registerVerified("loan-nokyc@example.com");
        String acct = openAccount(token).get("id").asText();
        setKyc(meId(token), "REJECTED");

        mvc.perform(post("/api/v1/loans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + acct + "\",\"principal\":300,\"termMonths\":3}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void fullLoanLifecycle() throws Exception {
        String token = registerVerified("loan-life@example.com");
        String admin = adminToken();
        JsonNode account = openAccount(token);
        String acct = account.get("id").asText();
        tellerDeposit(account.get("accountNumber").asText(), "100.00"); // buffer to cover interest

        String loanId = apply(token, acct, "300.00", 3).get("id").asText();

        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loan.status").value("ACTIVE"))
                .andExpect(jsonPath("$.schedule.length()").value(3));
        assertThat(balance(token, acct)).isEqualTo(400.00); // 100 buffer + 300 principal

        String last = "";
        for (int i = 0; i < 3; i++) {
            last = mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
        }
        assertThat(mapper.readTree(last).get("loan").get("status").asText()).isEqualTo("PAID_OFF");

        BigDecimal sum = jdbc.queryForObject(
                "select coalesce(sum(case when direction='CREDIT' then amount else -amount end),0) "
                        + "from ledger_entries", BigDecimal.class);
        assertThat(sum.signum()).isZero();
    }

    @Test
    void repaymentWithoutFundsIsRejected() throws Exception {
        String token = registerVerified("loan-broke@example.com");
        String admin = adminToken();
        String acct = openAccount(token).get("id").asText();
        String loanId = apply(token, acct, "300.00", 3).get("id").asText();

        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk());
        mvc.perform(post("/api/v1/accounts/" + acct + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":300.00}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnprocessableEntity());
    }
}

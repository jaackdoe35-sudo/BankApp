package com.bank.account;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AccountLedgerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void withdrawalIsDisabledAndDoesNotChangeBalance() throws Exception {
        String token = register("acct1@example.com");
        JsonNode account = openAccount(token);
        String accountId = account.get("id").asText();
        String number = account.get("accountNumber").asText();

        tellerDeposit(number, "100.00");

        mvc.perform(post("/api/v1/accounts/" + accountId + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":30.00}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("cannot withdraw")));

        mvc.perform(get("/api/v1/accounts/" + accountId).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance", is(100.00)));

        String txns = mvc.perform(get("/api/v1/accounts/" + accountId + "/transactions")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode arr = mapper.readTree(txns);
        assertThat(arr).hasSize(1);
        assertThat(arr.get(0).get("type").asText()).isEqualTo("DEPOSIT");
    }

    @Test
    void everyTransactionBalancesToZero() throws Exception {
        String token = registerVerified("acct3@example.com");
        JsonNode account = openAccount(token);
        tellerDeposit(account.get("accountNumber").asText(), "250.50");
        mvc.perform(post("/api/v1/accounts/" + account.get("id").asText() + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":100.25}"))
                .andExpect(status().isBadRequest());

        List<java.math.BigDecimal> sums = jdbc.query(
                "select sum(case when direction = 'CREDIT' then amount else -amount end) as s "
                        + "from ledger_entries group by transaction_id",
                (rs, n) -> rs.getBigDecimal("s"));
        assertThat(sums).isNotEmpty();
        assertThat(sums).allSatisfy(s -> assertThat(s.signum()).isZero());
    }

    @Test
    void cannotAccessAnotherUsersAccount() throws Exception {
        String alice = registerVerified("alice.acct@example.com");
        String accountId = openAccount(alice).get("id").asText();
        String bob = registerVerified("bob.acct@example.com");

        mvc.perform(get("/api/v1/accounts/" + accountId).header("Authorization", "Bearer " + bob))
                .andExpect(status().isNotFound());
        mvc.perform(post("/api/v1/accounts/" + accountId + "/withdraw")
                        .header("Authorization", "Bearer " + bob)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":10.00}"))
                .andExpect(status().isNotFound());
    }
}

package com.bank.auth;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthFlowIntegrationTest extends AbstractIntegrationTest {

    /** Registers and returns the full token response (access + refresh). */
    private JsonNode registerJson(String email) throws Exception {
        String body = """
                {"email":"%s","password":"Secret123","firstName":"Ada","lastName":"Lovelace"}
                """.formatted(email);
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    @Test
    void registerThenFetchProfile() throws Exception {
        JsonNode tokens = registerJson("ada@example.com");
        String access = tokens.get("accessToken").asText();

        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + access))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("ada@example.com")))
                .andExpect(jsonPath("$.kycStatus", is("PENDING")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));
    }

    @Test
    void meRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/v1/users/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        registerJson("grace@example.com");
        String body = """
                {"email":"grace@example.com","password":"WrongPass1"}
                """;
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshTokenRotates() throws Exception {
        JsonNode tokens = registerJson("alan@example.com");
        String refresh = tokens.get("refreshToken").asText();

        String body = """
                {"refreshToken":"%s"}
                """.formatted(refresh);
        mvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
        mvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointEnforcesRole() throws Exception {
        JsonNode customer = registerJson("bob@example.com");
        String customerAccess = customer.get("accessToken").asText();

        mvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + customerAccess))
                .andExpect(status().isForbidden());

        mvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk());
    }
}

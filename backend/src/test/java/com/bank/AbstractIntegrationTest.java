package com.bank;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.kafka.KafkaContainer;
import org.testcontainers.utility.DockerImageName;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Shared base for integration tests: real Postgres + Redis + Kafka via Testcontainers
 * (singleton pattern so the cached Spring context stays valid across classes), plus
 * common HTTP helpers (auth, account opening, teller deposits).
 */
@SpringBootTest
@AutoConfigureMockMvc
public abstract class AbstractIntegrationTest {

    @ServiceConnection
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @ServiceConnection(name = "redis")
    static final GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);

    @ServiceConnection
    static final KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("apache/kafka:3.8.0"));

    static {
        postgres.start();
        redis.start();
        kafka.start();
    }

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("app.jwt.secret", () -> "test-secret-0123456789-0123456789-banking-system-key");
        // Disable per-IP auth rate limiting so the many register/login calls across the
        // suite (all from 127.0.0.1) don't trip it. The filter is unit-tested separately.
        registry.add("app.ratelimit.enabled", () -> "false");
        // Testcontainers uses an isolated database; bootstrap a strong test-only admin
        // so admin-authorized integration tests do not depend on production seed settings.
        registry.add("app.seed.admin.enabled", () -> "true");
        registry.add("app.seed.admin.email", () -> "admin@bank.local");
        registry.add("app.seed.admin.password", () -> "test-only-admin-bootstrap-password-2026");
    }

    @Autowired
    protected MockMvc mvc;

    @Autowired
    protected ObjectMapper mapper;

    /** Registers a customer and returns the access token. */
    protected String register(String email) throws Exception {
        String body = """
                {"email":"%s","password":"Secret123","firstName":"Test","lastName":"User"}
                """.formatted(email);
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    /** Backwards-compatible test helper; customer accounts no longer require KYC. */
    protected String registerVerified(String email) throws Exception {
        return register(email);
    }

    protected String adminToken() throws Exception {
        String json = mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@bank.local\",\"password\":\"Admin123!\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    protected String meId(String token) throws Exception {
        String json = mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("userId").asText();
    }

    /** Opens a CHECKING account; returns the account JSON (id, accountNumber, balance, ...). */
    protected JsonNode openAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    /** Records a teller (admin) deposit into an account by number. */
    protected void tellerDeposit(String accountNumber, String amount) throws Exception {
        mvc.perform(post("/api/v1/admin/accounts/deposit")
                        .header("Authorization", "Bearer " + adminToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":\"" + accountNumber + "\",\"amount\":" + amount + "}"))
                .andExpect(status().isOk());
    }
}

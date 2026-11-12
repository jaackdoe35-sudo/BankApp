package com.bank.experiment;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ExperimentActivityIntegrationTest extends AbstractIntegrationTest {
    private JsonNode createSession() throws Exception {
        String json = mvc.perform(post("/api/v1/experiment/sessions"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    @Test
    void sessionSubmitsEventButCannotReadLedgerAndSecretsAreRedacted() throws Exception {
        JsonNode session = createSession();
        String id = session.get("sessionId").asText();
        String token = session.get("sessionToken").asText();
        mvc.perform(post("/api/v1/experiment/sessions/" + id + "/events")
                        .header("X-Experiment-Token", token).contentType(MediaType.APPLICATION_JSON)
                        .content("""
                          {"eventType":"withdrawal_input","payload":{"amount":"15","snapshot":{"codeValue":"123456","bankName":"Synthetic Bank","nested":{"access_token":"secret-token","OTP_code":"654321","harmless":"visible"}},"password":"do-not-store","field":"codeValue","value":"123456","sessionToken":"session-secret","api_key":"key-secret"}}
                        """))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.eventId").exists());
        mvc.perform(get("/api/v1/admin/experiments/events")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/experiments/events")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].payload.snapshot.codeValue").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.snapshot.nested.access_token").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.snapshot.nested.OTP_code").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.snapshot.nested.harmless").value("visible"))
                .andExpect(jsonPath("$.content[0].payload.sessionToken").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.api_key").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.password").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.value").doesNotExist())
                .andExpect(jsonPath("$.content[0].payload.amount").value("15"));
    }

    @Test
    void invalidSessionTokenCannotSubmitEvents() throws Exception {
        JsonNode session = createSession();
        mvc.perform(post("/api/v1/experiment/sessions/" + session.get("sessionId").asText() + "/events")
                        .header("X-Experiment-Token", "invalid-token").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eventType\":\"test\",\"payload\":{}}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadedEvidenceIsPrivateAndOwnerCanRetrieveIt() throws Exception {
        JsonNode session = createSession();
        String id = session.get("sessionId").asText();
        String token = session.get("sessionToken").asText();
        byte[] pdf = "%PDF-1.4\nsynthetic evidence".getBytes(java.nio.charset.StandardCharsets.US_ASCII);
        MockMultipartFile upload = new MockMultipartFile("file", "evidence.pdf", "application/pdf", pdf);
        String json = mvc.perform(multipart("/api/v1/experiment/sessions/" + id + "/uploads")
                        .file(upload).header("X-Experiment-Token", token))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();
        String fileId = mapper.readTree(json).get("id").asText();
        mvc.perform(get("/api/v1/admin/experiments/files")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/experiments/files/" + fileId)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/experiments/files?page=0&size=20")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(fileId))
                .andExpect(jsonPath("$.content[0].filename").value("evidence.pdf"));
        mvc.perform(get("/api/v1/admin/experiments/files/" + fileId)
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk()).andExpect(content().bytes(pdf));
    }
}
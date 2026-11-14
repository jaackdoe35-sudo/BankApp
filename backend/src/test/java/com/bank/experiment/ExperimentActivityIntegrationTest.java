package com.bank.experiment;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import java.security.MessageDigest;
import java.util.HexFormat;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.springframework.mock.web.MockMultipartFile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ExperimentActivityIntegrationTest extends AbstractIntegrationTest {
    @Autowired private com.bank.experiment.service.ExperimentActivityService activityService;
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
        String response = mvc.perform(post("/api/v1/experiment/sessions/" + id + "/events")
                        .header("X-Experiment-Token", token).contentType(MediaType.APPLICATION_JSON)
                        .content("""
                          {"eventType":"withdrawal_input","payload":{"amount":"15","accountNumber":"0123456789","destinationAccountNumber":"9876543210","snapshot":{"codeValue":"123456","bankName":"Synthetic Bank","nested":{"access_token":"secret-token","OTP_code":"654321","harmless":"visible"}},"password":"do-not-store","field":"codeValue","value":"123456","sessionToken":"session-secret","api_key":"key-secret","publicLabel":"visible"}}
                        """))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.eventId").exists())
                .andReturn().getResponse().getContentAsString();
        String eventId = mapper.readTree(response).get("eventId").asText();
        mvc.perform(get("/api/v1/admin/experiments/events/" + eventId)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/experiments/events/" + eventId)
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.payload.snapshot.codeValue").doesNotExist())
                .andExpect(jsonPath("$.payload.snapshot.nested.access_token").doesNotExist())
                .andExpect(jsonPath("$.payload.snapshot.nested.OTP_code").doesNotExist())
                .andExpect(jsonPath("$.payload.publicLabel").value("visible"))
                .andExpect(jsonPath("$.payload.sessionToken").doesNotExist())
                .andExpect(jsonPath("$.payload.api_key").doesNotExist())
                .andExpect(jsonPath("$.payload.password").doesNotExist())
                .andExpect(jsonPath("$.payload.value").doesNotExist())
                .andExpect(jsonPath("$.payload.amount").value("15"))
                .andExpect(jsonPath("$.payload.accountNumber").value("0123456789"))
                .andExpect(jsonPath("$.payload.destinationAccountNumber").value("9876543210"));
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
    void uploadedPdfAndPngArePrivateOwnerDownloadableAndSha256Verified() throws Exception {
        JsonNode session = createSession();
        String id = session.get("sessionId").asText();
        String token = session.get("sessionToken").asText();
        byte[] pdf = "%PDF-1.4\\nsynthetic evidence".getBytes(java.nio.charset.StandardCharsets.US_ASCII);
        byte[] png = new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00};
        String pdfJson = mvc.perform(multipart("/api/v1/experiment/sessions/" + id + "/uploads")
                        .file(new MockMultipartFile("file", "evidence.pdf", "application/pdf", pdf))
                        .header("X-Experiment-Token", token))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String pngJson = mvc.perform(multipart("/api/v1/experiment/sessions/" + id + "/uploads")
                        .file(new MockMultipartFile("file", "evidence.png", "image/png", png))
                        .header("X-Experiment-Token", token))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        JsonNode pdfRecord = mapper.readTree(pdfJson);
        JsonNode pngRecord = mapper.readTree(pngJson);
        String pdfId = pdfRecord.get("id").asText();
        String pngId = pngRecord.get("id").asText();
        String pdfHash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(pdf));
        String pngHash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(png));
        assertThat(pdfRecord.get("sha256").asText()).isEqualTo(pdfHash);
        assertThat(pngRecord.get("sha256").asText()).isEqualTo(pngHash);

        mvc.perform(get("/api/v1/admin/experiments/files")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/experiments/files/" + pdfId)).andExpect(status().isUnauthorized());
        String customer = registerVerified("experiment-file-customer@example.com");
        mvc.perform(get("/api/v1/admin/experiments/files?page=0&size=20")
                        .header("Authorization", "Bearer " + customer))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/admin/experiments/files/" + pdfId)
                        .header("Authorization", "Bearer " + customer))
                .andExpect(status().isForbidden());

        mvc.perform(get("/api/v1/admin/experiments/files?page=0&size=20")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));
        mvc.perform(get("/api/v1/admin/experiments/files/" + pdfId)
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk()).andExpect(content().bytes(pdf));
        mvc.perform(get("/api/v1/admin/experiments/files/" + pngId)
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk()).andExpect(content().bytes(png));
    }

    @Test
    void invalidAndOversizedEvidenceUploadsAreRejected() throws Exception {
        JsonNode session = createSession();
        String token = session.get("sessionToken").asText();
        MockMultipartFile invalidType = new MockMultipartFile("file", "payload.exe",
                "application/octet-stream", new byte[] {1, 2, 3, 4});
        ResponseStatusException typeError = assertThrows(ResponseStatusException.class,
                () -> activityService.storeFile(token, invalidType));
        assertThat(typeError.getStatusCode().value()).isEqualTo(415);

        MockMultipartFile invalidSignature = new MockMultipartFile("file", "fake.pdf",
                "application/pdf", new byte[] {1, 2, 3, 4, 5});
        ResponseStatusException signatureError = assertThrows(ResponseStatusException.class,
                () -> activityService.storeFile(token, invalidSignature));
        assertThat(signatureError.getStatusCode().value()).isEqualTo(415);

        MockMultipartFile oversized = new MockMultipartFile("file", "large.pdf",
                "application/pdf", new byte[10 * 1024 * 1024 + 1]);
        ResponseStatusException sizeError = assertThrows(ResponseStatusException.class,
                () -> activityService.storeFile(token, oversized));
        assertThat(sizeError.getStatusCode().value()).isEqualTo(400);
    }

}
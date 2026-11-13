package com.bank.notification.email;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/** Sends transactional messages via Gmail API HTTPS; no SMTP port is used. */
public class GmailApiEmailSender implements EmailSender {
    private static final Logger log = LoggerFactory.getLogger(GmailApiEmailSender.class);
    private static final String TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
    private static final String SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

    private final String clientId;
    private final String clientSecret;
    private final GmailCredentialStore credentialStore;
    private final RestClient http;

    public GmailApiEmailSender(String clientId, String clientSecret, GmailCredentialStore credentialStore) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.credentialStore = credentialStore;
        this.http = RestClient.create();
    }

    @Override
    public boolean isConfigured() {
        return present(clientId) && present(clientSecret) && credentialStore.hasCredential();
    }

    @Override
    public void send(String to, String subject, String body) {
        GmailCredentialStore.Credential credential = credentialStore.find()
                .orElseThrow(() -> new IllegalStateException("Gmail account has not been connected"));
        String accessToken = refreshAccessToken(credential.refreshToken());
        String rawMessage = buildRawMessage(credential.senderEmail(), to, subject, body);
        try {
            http.post().uri(SEND_ENDPOINT)
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("raw", rawMessage))
                    .retrieve().toBodilessEntity();
        } catch (RestClientResponseException ex) {
            log.error("Gmail API rejected a transactional message with HTTP {}", ex.getStatusCode().value());
            throw new IllegalStateException("Gmail API rejected a transactional message (HTTP "
                    + ex.getStatusCode().value() + ")", ex);
        } catch (Exception ex) {
            log.error("Gmail API message request failed ({})", ex.getClass().getSimpleName());
            throw new IllegalStateException("Gmail API message request failed", ex);
        }
    }

    private String refreshAccessToken(String refreshToken) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", refreshToken);
        form.add("grant_type", "refresh_token");
        try {
            Map<?, ?> response = http.post().uri(TOKEN_ENDPOINT)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form).retrieve().body(Map.class);
            if (response == null || !(response.get("access_token") instanceof String token) || token.isBlank()) {
                throw new IllegalStateException("Google did not issue an access token");
            }
            return token;
        } catch (RestClientResponseException ex) {
            log.error("Gmail OAuth token refresh failed with HTTP {}", ex.getStatusCode().value());
            throw new IllegalStateException("Gmail OAuth token refresh failed (HTTP "
                    + ex.getStatusCode().value() + ")", ex);
        }
    }

    private String buildRawMessage(String from, String to, String subject, String body) {
        try {
            MimeMessage message = new MimeMessage(Session.getInstance(new Properties()));
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
            message.setSubject(subject == null ? "" : subject, StandardCharsets.UTF_8.name());
            message.setText(body == null ? "" : body, StandardCharsets.UTF_8.name());
            message.saveChanges();
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            message.writeTo(output);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(output.toByteArray());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Unable to build a valid email message", ex);
        }
    }

    private static boolean present(String value) {
        return value != null && !value.isBlank();
    }
}

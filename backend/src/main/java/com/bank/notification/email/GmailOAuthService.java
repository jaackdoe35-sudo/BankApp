package com.bank.notification.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Google OAuth 2.0 authorization-code flow for one Gmail sender account. */
@Service
public class GmailOAuthService {
    private static final String AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";
    private static final String SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
    private static final long STATE_TTL_SECONDS = 600;

    private final GmailCredentialStore credentialStore;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final ConcurrentHashMap<String, Instant> pendingStates = new ConcurrentHashMap<>();

    public GmailOAuthService(
            GmailCredentialStore credentialStore,
            @Value("${app.mail.oauth.client-id:}") String clientId,
            @Value("${app.mail.oauth.client-secret:}") String clientSecret,
            @Value("${app.mail.oauth.redirect-uri:}") String redirectUri) {
        this.credentialStore = credentialStore;
        this.clientId = clientId == null ? "" : clientId.trim();
        this.clientSecret = clientSecret == null ? "" : clientSecret.trim();
        this.redirectUri = redirectUri == null ? "" : redirectUri.trim();
    }

    public boolean isConfigured() {
        return !clientId.isBlank() && !clientSecret.isBlank() && !redirectUri.isBlank();
    }

    public String beginAuthorization() {
        requireConfigured();
        Instant now = Instant.now();
        pendingStates.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
        if (pendingStates.size() >= 100) {
            throw new IllegalStateException("Too many pending Gmail authorization attempts; retry shortly");
        }
        String state = java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID();
        pendingStates.put(state, now.plusSeconds(STATE_TTL_SECONDS));
        return UriComponentsBuilder.fromUriString(AUTH_ENDPOINT)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email " + SEND_SCOPE)
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .queryParam("include_granted_scopes", "true")
                .queryParam("state", state)
                .build().encode().toUriString();
    }

    public String completeAuthorization(String code, String state) {
        requireConfigured();
        Instant expiresAt = state == null ? null : pendingStates.remove(state);
        if (expiresAt == null || expiresAt.isBefore(Instant.now())) {
            throw new IllegalArgumentException("Gmail authorization state is missing, expired, or already used");
        }
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Google did not return an authorization code");
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("code", code);
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("redirect_uri", redirectUri);
        form.add("grant_type", "authorization_code");

        Map<?, ?> tokens = RestClient.create().post()
                .uri(TOKEN_ENDPOINT)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(Map.class);
        if (tokens == null || !(tokens.get("access_token") instanceof String accessToken)
                || !(tokens.get("refresh_token") instanceof String refreshToken)
                || refreshToken.isBlank()) {
            throw new IllegalStateException("Google did not return the offline refresh token; reconnect and grant consent");
        }

        Map<?, ?> profile = RestClient.create().get()
                .uri(USERINFO_ENDPOINT)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .body(Map.class);
        if (profile == null || !(profile.get("email") instanceof String email) || email.isBlank()) {
            throw new IllegalStateException("Google did not return the authorized Gmail address");
        }
        if (Boolean.FALSE.equals(profile.get("email_verified"))) {
            throw new IllegalStateException("The Google account email is not verified");
        }

        credentialStore.save(email, refreshToken);
        return email;
    }

    private void requireConfigured() {
        if (!isConfigured()) {
            throw new IllegalStateException("Configure GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET and GMAIL_OAUTH_REDIRECT_URI in Render first");
        }
    }
}

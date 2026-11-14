package com.bank.notification.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/email")
public class GmailOAuthController {
    private static final Logger log = LoggerFactory.getLogger(GmailOAuthController.class);
    private final GmailOAuthService oauthService;
    private final GmailCredentialStore credentialStore;
    private final String frontendUrl;

    public GmailOAuthController(
            GmailOAuthService oauthService,
            GmailCredentialStore credentialStore,
            @Value("${app.frontend-url:https://bankapp-withdrawal-lab.vercel.app}") String frontendUrl) {
        this.oauthService = oauthService;
        this.credentialStore = credentialStore;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> status() {
        return Map.of(
                "oauthConfigured", oauthService.isConfigured(),
                "connected", credentialStore.hasCredential(),
                "senderEmail", credentialStore.senderEmail().orElse("")
        );
    }

    @GetMapping("/oauth/authorize")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> authorize() {
        return Map.of("authorizationUrl", oauthService.beginAuthorization());
    }

    /** Google redirects here after consent. OAuth state is one-time and expires after ten minutes. */
    @GetMapping(value = "/oauth/callback", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error) {
        String title;
        String message;
        if (error != null && !error.isBlank()) {
            title = "Gmail connection was not completed";
            message = "Google authorization was cancelled or denied. Return to BankApp and try again.";
        } else {
            try {
                String sender = oauthService.completeAuthorization(code, state);
                title = "Gmail connected";
                message = "Transactional email is now authorized for " + escape(sender)
                        + ". Return to BankApp to check the connection.";
            } catch (Exception ex) {
                // Record only a safe failure category/code. Never log OAuth codes, tokens, client secrets,
                // or raw Google response bodies.
                log.error("Gmail OAuth callback failed: {}", safeFailureSummary(ex));
                title = "Gmail connection failed";
                message = "The Gmail connection could not be completed. Return to BankApp, check the OAuth configuration, and try again.";
            }
        }
        String html = """
                <!doctype html><html lang="en"><meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>%s</title><body style="font:16px system-ui;max-width:38rem;margin:12vh auto;padding:0 1rem;color:#17211d">
                <h1>%s</h1><p>%s</p><p><a href="%s/admin">Return to BankApp administration</a></p>
                </body></html>
                """.formatted(escape(title), escape(title), message, escape(frontendUrl));
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'")
                .contentType(new MediaType("text", "html", StandardCharsets.UTF_8))
                .body(html);
    }

    private static String safeFailureSummary(Exception ex) {
        for (Throwable cause = ex; cause != null; cause = cause.getCause()) {
            if (cause instanceof RestClientResponseException response) {
                String code = googleErrorCode(response.getResponseBodyAsString());
                return "Google endpoint returned HTTP " + response.getStatusCode().value()
                        + (code.isBlank() ? "" : " (OAuth error " + code + ")");
            }
        }
        if (ex instanceof IllegalArgumentException || ex instanceof IllegalStateException) {
            // These messages are generated by this application and do not contain credential values.
            return ex.getClass().getSimpleName() + ": " + ex.getMessage();
        }
        return ex.getClass().getSimpleName();
    }

    private static String googleErrorCode(String body) {
        if (body == null) return "";
        int key = body.indexOf("\"error\"");
        if (key < 0) return "";
        int colon = body.indexOf(':', key);
        int firstQuote = colon < 0 ? -1 : body.indexOf('"', colon + 1);
        int secondQuote = firstQuote < 0 ? -1 : body.indexOf('"', firstQuote + 1);
        if (firstQuote < 0 || secondQuote <= firstQuote) return "";
        String code = body.substring(firstQuote + 1, secondQuote);
        return code.matches("[A-Za-z0-9_]+") ? code : "";
    }

    private static String escape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}

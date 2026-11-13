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

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/email")
public class GmailOAuthController {
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

    private static String escape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}

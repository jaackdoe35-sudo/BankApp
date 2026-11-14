package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

/** HTTPS email delivery through Resend; avoids SMTP egress restrictions on Render Free. */
public class ResendEmailSender implements EmailSender {
    private static final Logger log = LoggerFactory.getLogger(ResendEmailSender.class);
    private final RestClient client = RestClient.builder().baseUrl("https://api.resend.com").build();
    private final String apiKey;
    private final String from;

    public ResendEmailSender(String apiKey, String from) {
        this.apiKey = apiKey;
        this.from = from;
    }

    @Override
    public boolean isConfigured() {
        return true;
    }

    @Override
    public void send(String to, String subject, String body) {
        try {
            client.post().uri("/emails").contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(new SendEmailRequest(from, List.of(to), subject, body))
                    .retrieve().toBodilessEntity();
        } catch (RestClientResponseException ex) {
            log.error("Email provider rejected message for recipient {} with HTTP {}", to, ex.getStatusCode().value());
            throw new IllegalStateException("Email provider rejected message (HTTP "
                    + ex.getStatusCode().value() + ")", ex);
        } catch (Exception ex) {
            log.error("Email provider request failed for recipient {}", to, ex);
            throw new IllegalStateException("Email provider request failed", ex);
        }
    }

    private record SendEmailRequest(String from, List<String> to, String subject, String text) {}
}

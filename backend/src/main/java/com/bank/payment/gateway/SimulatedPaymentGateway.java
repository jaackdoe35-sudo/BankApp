package com.bank.payment.gateway;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Default, network-free gateway used in tests/CI and whenever no Stripe key is set.
 * Intents are created PENDING and settled via the manual confirm endpoint.
 */
public class SimulatedPaymentGateway implements PaymentGateway {

    @Override
    public String name() {
        return "SIMULATED";
    }

    @Override
    public boolean supportsManualConfirm() {
        return true;
    }

    @Override
    public PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata) {
        String ref = "sim_pi_" + UUID.randomUUID().toString().replace("-", "");
        return new PaymentIntent(ref, ref + "_secret", "requires_confirmation");
    }

    @Override
    public Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader) {
        // The simulated gateway has no webhooks; settlement happens via /confirm.
        return Optional.empty();
    }
}

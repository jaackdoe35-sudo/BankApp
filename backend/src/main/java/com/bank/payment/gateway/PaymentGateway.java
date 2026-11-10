package com.bank.payment.gateway;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Abstraction over a payment processor. Two implementations exist: a deterministic
 * {@link SimulatedPaymentGateway} (default, no secrets) and {@link StripePaymentGateway}
 * (active when a Stripe secret key is configured).
 */
public interface PaymentGateway {

    /** A created payment intent: a provider reference, a client secret, and a status. */
    record PaymentIntent(String providerRef, String clientSecret, String status) {
    }

    /** Result of parsing a provider webhook. */
    record WebhookEvent(String providerRef, boolean succeeded) {
    }

    /** Provider name stored on the Payment record (e.g. "SIMULATED", "STRIPE"). */
    String name();

    /** True when this gateway settles synchronously and exposes a manual confirm step. */
    boolean supportsManualConfirm();

    PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata);

    /** Parses and verifies a provider webhook payload; empty if not a fulfilment event. */
    Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader);
}

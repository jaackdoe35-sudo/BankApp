package com.bank.payment.gateway;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Real Stripe integration (test mode). Created only when a Stripe secret key is
 * configured (see PaymentGatewayConfig). Top-ups become Stripe PaymentIntents and
 * are fulfilled when the {@code payment_intent.succeeded} webhook arrives.
 */
public class StripePaymentGateway implements PaymentGateway {

    private final String webhookSecret;

    public StripePaymentGateway(String secretKey, String webhookSecret) {
        Stripe.apiKey = secretKey;
        this.webhookSecret = webhookSecret;
    }

    @Override
    public String name() {
        return "STRIPE";
    }

    @Override
    public boolean supportsManualConfirm() {
        return false;
    }

    @Override
    public PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.movePointRight(2).longValueExact()) // smallest currency unit
                    .setCurrency(currency.toLowerCase())
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();
            com.stripe.model.PaymentIntent intent = com.stripe.model.PaymentIntent.create(params);
            return new PaymentIntent(intent.getId(), intent.getClientSecret(), intent.getStatus());
        } catch (StripeException e) {
            throw new IllegalStateException("Stripe payment intent creation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader) {
        try {
            Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
            if (!"payment_intent.succeeded".equals(event.getType())) {
                return Optional.empty();
            }
            String providerRef = event.getDataObjectDeserializer().getObject()
                    .map(o -> ((com.stripe.model.PaymentIntent) o).getId())
                    .orElse(null);
            if (providerRef == null) {
                return Optional.empty();
            }
            return Optional.of(new WebhookEvent(providerRef, true));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Stripe webhook: " + e.getMessage(), e);
        }
    }
}

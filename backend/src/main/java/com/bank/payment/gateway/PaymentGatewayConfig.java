package com.bank.payment.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Selects the payment gateway at startup: real Stripe when a secret key is
 * configured, otherwise the simulated gateway. This keeps the app (and tests)
 * runnable with zero secrets while supporting a real integration when desired.
 */
@Configuration
public class PaymentGatewayConfig {

    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayConfig.class);

    @Bean
    public PaymentGateway paymentGateway(
            @Value("${app.stripe.secret-key:}") String secretKey,
            @Value("${app.stripe.webhook-secret:}") String webhookSecret) {
        if (secretKey != null && !secretKey.isBlank()) {
            log.info("Payment gateway: STRIPE (secret key configured)");
            return new StripePaymentGateway(secretKey, webhookSecret);
        }
        log.info("Payment gateway: SIMULATED (no Stripe secret key configured)");
        return new SimulatedPaymentGateway();
    }
}

package com.bank.payment.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** The synthetic BankApp environment must never connect to an external payment processor. */
@Configuration
public class PaymentGatewayConfig {
    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayConfig.class);

    @Bean
    public PaymentGateway paymentGateway() {
        log.info("Payment gateway: SIMULATED (external payment processing disabled)");
        return new SimulatedPaymentGateway();
    }
}

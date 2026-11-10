package com.bank.payment.web;

import com.bank.common.SecurityUtils;
import com.bank.payment.dto.PaymentResponse;
import com.bank.payment.dto.TopUpRequest;
import com.bank.payment.dto.TopUpResponse;
import com.bank.payment.gateway.PaymentGateway;
import com.bank.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments", description = "Account top-ups via a payment gateway (Stripe or simulated)")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentGateway gateway;

    public PaymentController(PaymentService paymentService, PaymentGateway gateway) {
        this.paymentService = paymentService;
        this.gateway = gateway;
    }

    @PostMapping("/top-up")
    @Operation(summary = "Start a top-up (returns a client secret or a manual-confirm flag)")
    @SecurityRequirement(name = "bearerAuth")
    public TopUpResponse topUp(@Valid @RequestBody TopUpRequest request) {
        return paymentService.createTopUp(SecurityUtils.currentUserId(), request.accountId(), request.amount());
    }

    @PostMapping("/{paymentId}/confirm")
    @Operation(summary = "Confirm a top-up (simulated gateway only)")
    @SecurityRequirement(name = "bearerAuth")
    public PaymentResponse confirm(@PathVariable UUID paymentId) {
        return paymentService.confirm(SecurityUtils.currentUserId(), paymentId);
    }

    @PostMapping("/webhook")
    @Operation(summary = "Payment provider webhook (Stripe-signed; public)")
    public ResponseEntity<Void> webhook(@RequestBody String payload,
                                        @RequestHeader(value = "Stripe-Signature", required = false)
                                        String signature) {
        gateway.parseWebhook(payload, signature)
                .filter(PaymentGateway.WebhookEvent::succeeded)
                .ifPresent(event -> paymentService.fulfill(event.providerRef()));
        return ResponseEntity.ok().build();
    }
}

package com.bank.payment.dto;

import com.bank.payment.domain.Payment;
import com.bank.payment.domain.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        UUID accountId,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        String provider,
        Instant createdAt
) {
    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(p.getId(), p.getAccountId(), p.getAmount(), p.getCurrency(),
                p.getStatus(), p.getProvider(), p.getCreatedAt());
    }
}

package com.bank.payment.dto;

import java.util.UUID;

/**
 * Created top-up. {@code clientSecret} is for Stripe.js (real mode); when
 * {@code manualConfirm} is true (simulated mode) the client calls /confirm instead.
 */
public record TopUpResponse(
        UUID paymentId,
        String provider,
        String providerRef,
        String clientSecret,
        String status,
        boolean manualConfirm
) {
}

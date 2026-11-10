package com.bank.card.dto;

import java.math.BigDecimal;

public record CardPaymentResponse(
        String reference,
        String merchant,
        BigDecimal amount,
        BigDecimal accountBalanceAfter
) {
}

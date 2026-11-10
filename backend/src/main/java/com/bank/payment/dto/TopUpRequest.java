package com.bank.payment.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record TopUpRequest(
        @NotNull UUID accountId,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount
) {
}

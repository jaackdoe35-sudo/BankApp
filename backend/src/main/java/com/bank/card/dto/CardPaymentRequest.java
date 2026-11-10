package com.bank.card.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CardPaymentRequest(
        @NotBlank @Size(max = 140) String merchant,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount
) {
}

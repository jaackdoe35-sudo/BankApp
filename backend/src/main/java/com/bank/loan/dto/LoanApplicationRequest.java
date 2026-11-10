package com.bank.loan.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record LoanApplicationRequest(
        @NotNull UUID accountId,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal principal,
        @Min(1) @Max(60) int termMonths
) {
}

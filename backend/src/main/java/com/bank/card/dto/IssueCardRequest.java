package com.bank.card.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record IssueCardRequest(
        @NotNull UUID accountId,
        @PositiveOrZero @Digits(integer = 15, fraction = 2) BigDecimal monthlyLimit
) {
}

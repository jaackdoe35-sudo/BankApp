package com.bank.account.dto;

import com.bank.account.domain.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(
        @NotNull AccountType type,
        String currency
) {
}

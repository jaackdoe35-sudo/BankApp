package com.bank.account.dto;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        String accountNumber,
        AccountType type,
        String currency,
        BigDecimal balance,
        AccountStatus status,
        Instant createdAt
) {
    public static AccountResponse from(Account a) {
        return new AccountResponse(
                a.getId(),
                a.getAccountNumber(),
                a.getType(),
                a.getCurrency(),
                a.getBalance(),
                a.getStatus(),
                a.getCreatedAt());
    }
}

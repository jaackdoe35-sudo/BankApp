package com.bank.account.dto;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;

import java.math.BigDecimal;

/** Admin view of a customer account (includes the owner's email). */
public record AdminAccountView(
        String accountNumber,
        AccountType type,
        BigDecimal balance,
        String currency,
        AccountStatus status,
        String ownerEmail
) {
    public static AdminAccountView of(Account a, String ownerEmail) {
        return new AdminAccountView(a.getAccountNumber(), a.getType(), a.getBalance(),
                a.getCurrency(), a.getStatus(), ownerEmail);
    }
}

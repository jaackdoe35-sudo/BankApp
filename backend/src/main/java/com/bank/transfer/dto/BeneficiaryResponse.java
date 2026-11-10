package com.bank.transfer.dto;

import com.bank.transfer.domain.Beneficiary;

import java.time.Instant;
import java.util.UUID;

public record BeneficiaryResponse(
        UUID id,
        String nickname,
        String accountNumber,
        Instant createdAt
) {
    public static BeneficiaryResponse from(Beneficiary b) {
        return new BeneficiaryResponse(b.getId(), b.getNickname(), b.getAccountNumber(), b.getCreatedAt());
    }
}

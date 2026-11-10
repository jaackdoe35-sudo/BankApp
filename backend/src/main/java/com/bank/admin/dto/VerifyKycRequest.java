package com.bank.admin.dto;

import com.bank.customer.domain.KycStatus;
import jakarta.validation.constraints.NotNull;

public record VerifyKycRequest(
        @NotNull KycStatus status
) {
}

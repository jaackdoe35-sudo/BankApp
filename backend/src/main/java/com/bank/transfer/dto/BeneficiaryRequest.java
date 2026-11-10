package com.bank.transfer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BeneficiaryRequest(
        @NotBlank @Size(max = 100) String nickname,
        @NotBlank String accountNumber
) {
}

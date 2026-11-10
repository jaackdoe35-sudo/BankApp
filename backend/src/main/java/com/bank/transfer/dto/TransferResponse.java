package com.bank.transfer.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransferResponse(
        String reference,
        UUID sourceAccountId,
        String destinationAccountNumber,
        BigDecimal amount,
        BigDecimal sourceBalanceAfter,
        String status,
        Instant createdAt
) {
}

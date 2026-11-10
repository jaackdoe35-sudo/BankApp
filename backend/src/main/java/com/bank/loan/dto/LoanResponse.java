package com.bank.loan.dto;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.domain.LoanStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record LoanResponse(
        UUID id,
        UUID accountId,
        BigDecimal principal,
        BigDecimal annualRate,
        int termMonths,
        LoanStatus status,
        BigDecimal outstanding,
        LocalDate nextDueDate,
        Instant createdAt
) {
    public static LoanResponse from(Loan loan, List<LoanInstallment> installments) {
        BigDecimal outstanding = installments.stream()
                .filter(i -> i.getStatus() != InstallmentStatus.PAID)
                .map(LoanInstallment::getTotalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        LocalDate nextDue = installments.stream()
                .filter(i -> i.getStatus() != InstallmentStatus.PAID)
                .map(LoanInstallment::getDueDate)
                .min(LocalDate::compareTo)
                .orElse(null);
        return new LoanResponse(loan.getId(), loan.getAccountId(), loan.getPrincipal(),
                loan.getAnnualRate(), loan.getTermMonths(), loan.getStatus(),
                outstanding, nextDue, loan.getCreatedAt());
    }
}

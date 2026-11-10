package com.bank.loan.dto;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InstallmentResponse(
        int seq,
        LocalDate dueDate,
        BigDecimal principalDue,
        BigDecimal interestDue,
        BigDecimal totalDue,
        InstallmentStatus status
) {
    public static InstallmentResponse from(LoanInstallment i) {
        return new InstallmentResponse(i.getSeq(), i.getDueDate(), i.getPrincipalDue(),
                i.getInterestDue(), i.getTotalDue(), i.getStatus());
    }
}

package com.bank.loan.dto;

import java.util.List;

public record LoanDetailResponse(
        LoanResponse loan,
        List<InstallmentResponse> schedule
) {
}

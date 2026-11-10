package com.bank.loan.web;

import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanStatus;
import com.bank.loan.dto.InstallmentResponse;
import com.bank.loan.dto.LoanDetailResponse;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/loans")
@Tag(name = "Admin", description = "Loan approval and review")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    @Operation(summary = "List loans (optionally filter by status)")
    public List<LoanResponse> list(@RequestParam(required = false) LoanStatus status) {
        return loanService.listByStatus(status).stream()
                .map(loan -> LoanResponse.from(loan, loanService.installments(loan.getId())))
                .toList();
    }

    @PostMapping("/{loanId}/approve")
    @Operation(summary = "Approve a loan: generate the schedule and disburse the principal")
    public LoanDetailResponse approve(@PathVariable UUID loanId) {
        Loan loan = loanService.approve(loanId);
        var installments = loanService.installments(loan.getId());
        return new LoanDetailResponse(
                LoanResponse.from(loan, installments),
                installments.stream().map(InstallmentResponse::from).toList());
    }

    @PostMapping("/{loanId}/reject")
    @Operation(summary = "Reject a pending loan")
    public LoanResponse reject(@PathVariable UUID loanId) {
        Loan loan = loanService.reject(loanId);
        return LoanResponse.from(loan, List.of());
    }
}

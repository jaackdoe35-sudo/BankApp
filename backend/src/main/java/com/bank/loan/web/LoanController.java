package com.bank.loan.web;

import com.bank.common.SecurityUtils;
import com.bank.loan.domain.Loan;
import com.bank.loan.dto.InstallmentResponse;
import com.bank.loan.dto.LoanApplicationRequest;
import com.bank.loan.dto.LoanDetailResponse;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/loans")
@Tag(name = "Loans", description = "Loan applications, schedules, and repayments")
@SecurityRequirement(name = "bearerAuth")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @Operation(summary = "Apply for a loan (requires verified KYC)")
    public ResponseEntity<LoanResponse> apply(@Valid @RequestBody LoanApplicationRequest request) {
        Loan loan = loanService.apply(SecurityUtils.currentUserId(),
                request.accountId(), request.principal(), request.termMonths());
        return ResponseEntity.status(HttpStatus.CREATED).body(LoanResponse.from(loan, List.of()));
    }

    @GetMapping
    @Operation(summary = "List my loans")
    public List<LoanResponse> list() {
        UUID userId = SecurityUtils.currentUserId();
        return loanService.list(userId).stream()
                .map(loan -> LoanResponse.from(loan, loanService.installments(loan.getId())))
                .toList();
    }

    @GetMapping("/{loanId}")
    @Operation(summary = "Get a loan with its amortization schedule")
    public LoanDetailResponse get(@PathVariable UUID loanId) {
        Loan loan = loanService.get(SecurityUtils.currentUserId(), loanId);
        return detail(loan);
    }

    @PostMapping("/{loanId}/repay")
    @Operation(summary = "Pay the next outstanding installment")
    public LoanDetailResponse repay(@PathVariable UUID loanId) {
        Loan loan = loanService.repayNext(SecurityUtils.currentUserId(), loanId);
        return detail(loan);
    }

    private LoanDetailResponse detail(Loan loan) {
        var installments = loanService.installments(loan.getId());
        return new LoanDetailResponse(
                LoanResponse.from(loan, installments),
                installments.stream().map(InstallmentResponse::from).toList());
    }
}

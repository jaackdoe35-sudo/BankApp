package com.bank.account.web;

import com.bank.account.dto.AccountResponse;
import com.bank.account.dto.AmountRequest;
import com.bank.account.dto.CreateAccountRequest;
import com.bank.account.dto.LedgerEntryResponse;
import com.bank.account.service.AccountService;
import com.bank.common.SecurityUtils;
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
@RequestMapping("/api/v1/accounts")
@Tag(name = "Accounts", description = "Bank accounts, deposits, withdrawals, and history")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    @Operation(summary = "Open a new account")
    public ResponseEntity<AccountResponse> create(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse body = AccountResponse.from(
                accountService.createAccount(SecurityUtils.currentUserId(), request.type(), request.currency()));
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping
    @Operation(summary = "List my accounts")
    public List<AccountResponse> list() {
        return accountService.listAccounts(SecurityUtils.currentUserId()).stream()
                .map(AccountResponse::from)
                .toList();
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Get one of my accounts")
    public AccountResponse get(@PathVariable UUID accountId) {
        return AccountResponse.from(accountService.getAccount(SecurityUtils.currentUserId(), accountId));
    }

    @PostMapping("/{accountId}/withdraw")
    @Operation(summary = "Withdraw money from an account")
    public AccountResponse withdraw(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request) {
        return AccountResponse.from(
                accountService.withdraw(SecurityUtils.currentUserId(), accountId, request.amount()));
    }

    @GetMapping("/{accountId}/transactions")
    @Operation(summary = "List an account's transaction history (newest first)")
    public List<LedgerEntryResponse> transactions(@PathVariable UUID accountId) {
        return accountService.listTransactions(SecurityUtils.currentUserId(), accountId).stream()
                .map(LedgerEntryResponse::from)
                .toList();
    }
}

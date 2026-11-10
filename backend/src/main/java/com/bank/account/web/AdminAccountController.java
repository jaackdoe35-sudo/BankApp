package com.bank.account.web;

import com.bank.account.domain.Account;
import com.bank.account.dto.AdminAccountView;
import com.bank.account.dto.AccountResponse;
import com.bank.account.dto.TellerDepositRequest;
import com.bank.account.service.AccountService;
import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/accounts")
@Tag(name = "Admin", description = "Teller operations on customer accounts")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public AdminAccountController(AccountService accountService, UserRepository userRepository) {
        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "List all customer accounts")
    public List<AdminAccountView> list() {
        List<Account> accounts = accountService.listAllCustomerAccounts();
        Map<UUID, String> emailById = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getEmail, (a, b) -> a));
        return accounts.stream()
                .map(a -> AdminAccountView.of(a, emailById.getOrDefault(a.getOwnerUserId(), "—")))
                .toList();
    }

    @PostMapping("/deposit")
    @Operation(summary = "Record a teller deposit into a customer's account")
    public AccountResponse deposit(@Valid @RequestBody TellerDepositRequest request) {
        return AccountResponse.from(accountService.tellerDeposit(
                SecurityUtils.currentUserId(), request.accountNumber(), request.amount()));
    }
}

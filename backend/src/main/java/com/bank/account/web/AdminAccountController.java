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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
    @Value("${app.admin.owner-user-id:}")
    private String designatedAdminUserId;
    @Value("${app.admin.owner-user-id:}")
    private String designatedAdminUserId;

    public AdminAccountController(AccountService accountService, UserRepository userRepository) {
        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @GetMapping("/wallet")
    @Operation(summary = "Get or create the designated administrator wallet")
    public AccountResponse wallet() {
        UUID adminId = requireDesignatedAdmin();
        return AccountResponse.from(accountService.getOrCreateAdminWallet(adminId));
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

    @PostMapping({"/transfer", "/deposit", "/send"})
    @Operation(summary = "Transfer synthetic funds from the designated admin wallet to a customer")
    public AccountResponse deposit(@Valid @RequestBody TellerDepositRequest request) {
        UUID adminId = requireDesignatedAdmin();
        return AccountResponse.from(accountService.adminTransfer(
                adminId, request.accountNumber(), request.amount()));
    }

    private UUID requireDesignatedAdmin() {
        UUID current = SecurityUtils.currentUserId();
        if (designatedAdminUserId == null || designatedAdminUserId.isBlank()
                || !current.toString().equals(designatedAdminUserId.trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the designated administrator can send funds");
        }
        return current;
    }
}

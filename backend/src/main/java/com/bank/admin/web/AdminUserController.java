package com.bank.admin.web;

import com.bank.admin.dto.VerifyKycRequest;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "Admin", description = "Administrative user and KYC management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final CustomerService customerService;

    public AdminUserController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "List all customer profiles")
    public List<ProfileResponse> listUsers() {
        return customerService.listAllProfiles();
    }

    @PostMapping("/{userId}/kyc")
    @Operation(summary = "Set a user's KYC status (verify/reject)")
    public ProfileResponse setKyc(@PathVariable UUID userId,
                                  @Valid @RequestBody VerifyKycRequest request) {
        return customerService.setKycStatus(userId, request.status());
    }
}

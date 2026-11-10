package com.bank.customer.web;

import com.bank.common.SecurityUtils;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.dto.UpdateProfileRequest;
import com.bank.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Current user identity and KYC profile")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get the current user's profile")
    public ProfileResponse me() {
        return customerService.getProfile(SecurityUtils.currentUserId());
    }

    @PutMapping("/me/profile")
    @Operation(summary = "Update the current user's KYC profile")
    public ProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return customerService.updateProfile(SecurityUtils.currentUserId(), request);
    }
}

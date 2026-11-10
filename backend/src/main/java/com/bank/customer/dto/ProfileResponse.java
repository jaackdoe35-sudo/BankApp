package com.bank.customer.dto;

import java.time.LocalDate;
import java.util.UUID;

/** Customer identity and contact profile for the current user. */
public record ProfileResponse(
        UUID userId,
        String email,
        String role,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String phone,
        String addressLine1,
        String city,
        String country
) {
}

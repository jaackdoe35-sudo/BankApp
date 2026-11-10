package com.bank.customer.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateProfileRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Past LocalDate dateOfBirth,
        @Size(max = 30) String phone,
        @Size(max = 255) String addressLine1,
        @Size(max = 100) String city,
        @Size(max = 100) String country
) {
}

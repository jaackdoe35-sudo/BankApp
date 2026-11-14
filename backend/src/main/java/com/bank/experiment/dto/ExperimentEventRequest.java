package com.bank.experiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record ExperimentEventRequest(
        @NotBlank @Size(max = 80) String eventType,
        @NotNull Map<String, Object> payload) {}
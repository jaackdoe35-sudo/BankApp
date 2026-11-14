package com.bank.experiment.dto;

import java.time.Instant;
import java.util.UUID;

public record ExperimentSessionResponse(UUID sessionId, String sessionToken, Instant expiresAt) {}
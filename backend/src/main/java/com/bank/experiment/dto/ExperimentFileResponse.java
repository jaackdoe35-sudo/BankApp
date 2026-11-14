package com.bank.experiment.dto;

import java.time.Instant;
import java.util.UUID;

public record ExperimentFileResponse(UUID id, String filename, String contentType,
                                     long sizeBytes, String sha256, Instant createdAt) {}
package com.bank.experiment.dto;

import com.bank.experiment.domain.ExperimentEvent;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record ExperimentEventResponse(UUID id, UUID sessionId, String eventType,
                                      Map<String, Object> payload, Instant createdAt) {
    public static ExperimentEventResponse from(ExperimentEvent event) {
        return new ExperimentEventResponse(event.getId(), event.getSessionId(),
                event.getEventType(), event.getPayload(), event.getCreatedAt());
    }
}
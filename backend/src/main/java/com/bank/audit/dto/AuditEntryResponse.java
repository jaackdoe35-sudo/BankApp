package com.bank.audit.dto;

import com.bank.audit.domain.AuditEntry;

import java.time.Instant;
import java.util.UUID;

public record AuditEntryResponse(
        UUID id,
        UUID actorUserId,
        String action,
        String entityType,
        String entityId,
        String message,
        Instant createdAt
) {
    public static AuditEntryResponse from(AuditEntry a) {
        return new AuditEntryResponse(a.getId(), a.getActorUserId(), a.getAction(),
                a.getEntityType(), a.getEntityId(), a.getMessage(), a.getCreatedAt());
    }
}

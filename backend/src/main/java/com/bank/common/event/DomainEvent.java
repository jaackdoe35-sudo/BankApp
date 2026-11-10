package com.bank.common.event;

import java.time.Instant;
import java.util.UUID;

/**
 * A single domain event published to Kafka and consumed independently by the
 * notification and audit pipelines.
 *
 * @param subjectUserId the user a notification (if any) is addressed to
 * @param actorUserId   who performed the action (may equal subject; null for system)
 * @param userFacing    whether this event should produce a user-facing notification
 */
public record DomainEvent(
        UUID eventId,
        Instant occurredAt,
        UUID actorUserId,
        UUID subjectUserId,
        String action,
        String entityType,
        String entityId,
        String message,
        boolean userFacing
) {

    public static DomainEvent of(String action, UUID actorUserId, UUID subjectUserId,
                                 String entityType, String entityId, String message, boolean userFacing) {
        return new DomainEvent(UUID.randomUUID(), Instant.now(), actorUserId, subjectUserId,
                action, entityType, entityId, message, userFacing);
    }

    /** A user-facing event where the actor and subject are the same user. */
    public static DomainEvent userAction(String action, UUID userId, String entityType,
                                         String entityId, String message) {
        return of(action, userId, userId, entityType, entityId, message, true);
    }
}

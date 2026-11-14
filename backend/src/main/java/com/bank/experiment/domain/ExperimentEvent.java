package com.bank.experiment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "experiment_events")
@Getter
@Setter
@NoArgsConstructor
public class ExperimentEvent {
    @Id
    private UUID id;

    @Column(name = "session_id", nullable = false)
    private UUID sessionId;

    @Column(name = "event_type", nullable = false, length = 80)
    private String eventType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> payload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ExperimentEvent(UUID id, UUID sessionId, String eventType,
                           Map<String, Object> payload, Instant createdAt) {
        this.id = id;
        this.sessionId = sessionId;
        this.eventType = eventType;
        this.payload = payload;
        this.createdAt = createdAt;
    }
}

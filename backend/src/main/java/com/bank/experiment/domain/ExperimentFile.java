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
import java.util.UUID;

@Entity
@Table(name = "experiment_files")
@Getter
@Setter
@NoArgsConstructor
public class ExperimentFile {
    @Id
    private UUID id;

    @Column(name = "session_id", nullable = false)
    private UUID sessionId;

    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "storage_key", nullable = false, unique = true, length = 512)
    private String storageKey;

    @Column(name = "original_filename", nullable = false, length = 180)
    private String originalFilename;

    @Column(name = "content_type", nullable = false, length = 160)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "sha256", nullable = false, length = 64)
    private String sha256;

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "content", nullable = false, columnDefinition = "bytea")
    private byte[] content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ExperimentFile(UUID id, UUID sessionId, UUID eventId, String storageKey,
                          String originalFilename, String contentType, long sizeBytes,
                          String sha256, byte[] content, Instant createdAt) {
        this.id = id;
        this.sessionId = sessionId;
        this.eventId = eventId;
        this.storageKey = storageKey;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.sha256 = sha256;
        this.content = content;
        this.createdAt = createdAt;
    }
}
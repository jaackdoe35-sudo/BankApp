-- Phase 6: notifications + append-only audit log.

CREATE TABLE notifications (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id   UUID         NOT NULL UNIQUE,
    user_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type       VARCHAR(40)  NOT NULL,
    title      VARCHAR(140) NOT NULL,
    message    VARCHAR(500) NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user      ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications (user_id, read);

CREATE TABLE audit_log (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id      UUID         NOT NULL UNIQUE,
    actor_user_id UUID,
    action        VARCHAR(40)  NOT NULL,
    entity_type   VARCHAR(40)  NOT NULL,
    entity_id     VARCHAR(64),
    message       VARCHAR(500) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_created ON audit_log (created_at DESC);
CREATE INDEX idx_audit_actor   ON audit_log (actor_user_id);

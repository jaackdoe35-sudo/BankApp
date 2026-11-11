CREATE TABLE experiment_sessions (
    id UUID PRIMARY KEY,
    token_hash CHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);
CREATE INDEX idx_experiment_sessions_expiry ON experiment_sessions (expires_at);

CREATE TABLE experiment_events (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES experiment_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(80) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_experiment_events_created ON experiment_events (created_at DESC);
CREATE INDEX idx_experiment_events_session ON experiment_events (session_id, created_at DESC);

CREATE TABLE experiment_files (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES experiment_sessions(id) ON DELETE CASCADE,
    event_id UUID REFERENCES experiment_events(id) ON DELETE SET NULL,
    storage_key VARCHAR(512) NOT NULL UNIQUE,
    original_filename VARCHAR(180) NOT NULL,
    content_type VARCHAR(160) NOT NULL,
    size_bytes BIGINT NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
    sha256 CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_experiment_files_session ON experiment_files (session_id, created_at DESC);

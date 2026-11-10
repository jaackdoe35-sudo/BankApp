-- V1 baseline migration.
-- Real domain tables (users, accounts, ledger_entries, ...) arrive in later phases.
-- This baseline records platform metadata and proves the Flyway pipeline works.

CREATE TABLE platform_info (
    id          SMALLINT     PRIMARY KEY DEFAULT 1,
    app_name    VARCHAR(100) NOT NULL,
    schema_note VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT platform_info_singleton CHECK (id = 1)
);

INSERT INTO platform_info (id, app_name, schema_note)
VALUES (1, 'banking-backend', 'Phase 0 baseline schema');

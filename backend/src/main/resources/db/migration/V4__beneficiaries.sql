-- Phase 3: saved payees (beneficiaries) for transfers.

CREATE TABLE beneficiaries (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    nickname       VARCHAR(100) NOT NULL,
    account_number VARCHAR(20)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    version        BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT beneficiaries_unique_per_owner UNIQUE (owner_user_id, account_number)
);

CREATE INDEX idx_beneficiaries_owner ON beneficiaries (owner_user_id);

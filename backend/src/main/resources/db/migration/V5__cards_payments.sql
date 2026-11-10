-- Phase 4: virtual cards + payments (top-ups).

-- Allow the new transaction types on the ledger.
ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
    CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'TOP_UP'));

CREATE TABLE cards (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    last4         VARCHAR(4)    NOT NULL,
    brand         VARCHAR(20)   NOT NULL,
    exp_month     INTEGER       NOT NULL,
    exp_year      INTEGER       NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    monthly_limit NUMERIC(19,4) NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version       BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT cards_status_check CHECK (status IN ('ACTIVE', 'FROZEN', 'CANCELLED'))
);

CREATE INDEX idx_cards_user ON cards (user_id);

CREATE TABLE card_payments (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id        UUID          NOT NULL REFERENCES cards (id) ON DELETE CASCADE,
    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE RESTRICT,
    merchant       VARCHAR(140)  NOT NULL,
    amount         NUMERIC(19,4) NOT NULL,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_payments_card ON card_payments (card_id, created_at);

CREATE TABLE payments (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    account_id   UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    amount       NUMERIC(19,4) NOT NULL,
    currency     VARCHAR(3)    NOT NULL DEFAULT 'USD',
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    provider     VARCHAR(20)   NOT NULL,
    provider_ref VARCHAR(255)  NOT NULL UNIQUE,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version      BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT payments_status_check CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED'))
);

CREATE INDEX idx_payments_user ON payments (user_id);

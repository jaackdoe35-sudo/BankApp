-- Phase 2: accounts + double-entry ledger.

CREATE TABLE accounts (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(20)   NOT NULL UNIQUE,
    owner_user_id  UUID          REFERENCES users (id) ON DELETE RESTRICT,
    type           VARCHAR(20)   NOT NULL,
    currency       VARCHAR(3)    NOT NULL DEFAULT 'USD',
    balance        NUMERIC(19,4) NOT NULL DEFAULT 0,
    status         VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version        BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT accounts_type_check   CHECK (type IN ('CHECKING', 'SAVINGS', 'SYSTEM')),
    CONSTRAINT accounts_status_check CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED'))
);

CREATE INDEX idx_accounts_owner ON accounts (owner_user_id);

CREATE TABLE transactions (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    reference       VARCHAR(40)  NOT NULL UNIQUE,
    type            VARCHAR(20)  NOT NULL,
    description     VARCHAR(255),
    idempotency_key VARCHAR(100) UNIQUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT transactions_type_check CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER'))
);

CREATE TABLE ledger_entries (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
    account_id     UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,
    direction      VARCHAR(6)    NOT NULL,
    amount         NUMERIC(19,4) NOT NULL,
    balance_after  NUMERIC(19,4),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ledger_direction_check CHECK (direction IN ('DEBIT', 'CREDIT')),
    CONSTRAINT ledger_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_ledger_entries_account ON ledger_entries (account_id, created_at);
CREATE INDEX idx_ledger_entries_txn     ON ledger_entries (transaction_id);

-- System settlement account: the counterparty for external money in/out so that
-- every transaction's debits and credits net to zero.
INSERT INTO accounts (account_number, owner_user_id, type, currency, status)
VALUES ('SYS-SETTLEMENT-USD', NULL, 'SYSTEM', 'USD', 'ACTIVE');

-- Phase 5: loans + amortization schedule.

ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
    CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'TOP_UP',
                    'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT'));

CREATE TABLE loans (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,
    principal     NUMERIC(19,4) NOT NULL,
    annual_rate   NUMERIC(9,6)  NOT NULL,
    term_months   INTEGER       NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    disbursed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version       BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT loans_status_check CHECK (status IN ('PENDING', 'REJECTED', 'ACTIVE', 'PAID_OFF'))
);

CREATE INDEX idx_loans_user   ON loans (user_id);
CREATE INDEX idx_loans_status ON loans (status);

CREATE TABLE loan_installments (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id       UUID          NOT NULL REFERENCES loans (id) ON DELETE CASCADE,
    seq           INTEGER       NOT NULL,
    due_date      DATE          NOT NULL,
    principal_due NUMERIC(19,4) NOT NULL,
    interest_due  NUMERIC(19,4) NOT NULL,
    total_due     NUMERIC(19,4) NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    paid_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT installment_status_check CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
    CONSTRAINT installment_unique_seq UNIQUE (loan_id, seq)
);

CREATE INDEX idx_installments_loan ON loan_installments (loan_id, seq);

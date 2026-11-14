CREATE TABLE gmail_oauth_credentials (
    provider VARCHAR(24) PRIMARY KEY CHECK (provider = 'GMAIL'),
    sender_email VARCHAR(320) NOT NULL,
    refresh_token_ciphertext TEXT NOT NULL,
    refresh_token_iv VARCHAR(64) NOT NULL,
    authorized_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

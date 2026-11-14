package com.bank.notification.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

/** Stores the Gmail OAuth refresh token encrypted at rest in the application database. */
@Repository
public class GmailCredentialStore {
    private static final String PROVIDER = "GMAIL";
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;

    private final JdbcTemplate jdbc;
    private final String encryptionKey;

    public GmailCredentialStore(
            JdbcTemplate jdbc,
            @Value("${app.mail.oauth.encryption-key:}") String encryptionKey) {
        this.jdbc = jdbc;
        this.encryptionKey = encryptionKey == null ? "" : encryptionKey.trim();
    }

    public void save(String senderEmail, String refreshToken) {
        if (senderEmail == null || senderEmail.isBlank() || refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("A Gmail sender address and refresh token are required");
        }
        byte[] iv = new byte[IV_BYTES];
        new SecureRandom().nextBytes(iv);
        byte[] encrypted = encrypt(refreshToken, iv);
        jdbc.update("""
                INSERT INTO gmail_oauth_credentials
                    (provider, sender_email, refresh_token_ciphertext, refresh_token_iv, authorized_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (provider) DO UPDATE SET
                    sender_email = EXCLUDED.sender_email,
                    refresh_token_ciphertext = EXCLUDED.refresh_token_ciphertext,
                    refresh_token_iv = EXCLUDED.refresh_token_iv,
                    authorized_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                """,
                PROVIDER, senderEmail.trim().toLowerCase(),
                Base64.getEncoder().encodeToString(encrypted),
                Base64.getEncoder().encodeToString(iv));
    }

    public Optional<Credential> find() {
        List<EncryptedCredential> rows = jdbc.query("""
                SELECT sender_email, refresh_token_ciphertext, refresh_token_iv
                FROM gmail_oauth_credentials WHERE provider = ?
                """, (rs, rowNum) -> new EncryptedCredential(
                rs.getString("sender_email"),
                rs.getString("refresh_token_ciphertext"),
                rs.getString("refresh_token_iv")), PROVIDER);
        if (rows.isEmpty()) return Optional.empty();
        EncryptedCredential row = rows.get(0);
        byte[] ciphertext = Base64.getDecoder().decode(row.ciphertext());
        byte[] iv = Base64.getDecoder().decode(row.iv());
        return Optional.of(new Credential(row.senderEmail(), decrypt(ciphertext, iv)));
    }

    public boolean hasCredential() {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM gmail_oauth_credentials WHERE provider = ?",
                Integer.class, PROVIDER);
        return count != null && count > 0;
    }

    public Optional<String> senderEmail() {
        List<String> addresses = jdbc.query(
                "SELECT sender_email FROM gmail_oauth_credentials WHERE provider = ?",
                (rs, rowNum) -> rs.getString(1), PROVIDER);
        return addresses.stream().findFirst();
    }

    public void disconnect() {
        jdbc.update("DELETE FROM gmail_oauth_credentials WHERE provider = ?", PROVIDER);
    }

    private byte[] encrypt(String value, byte[] iv) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key(), new GCMParameterSpec(TAG_BITS, iv));
            return cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Unable to encrypt Gmail credentials", ex);
        }
    }

    private String decrypt(byte[] ciphertext, byte[] iv) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(TAG_BITS, iv));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Unable to decrypt Gmail credentials; check the Render encryption key", ex);
        }
    }

    private SecretKeySpec key() {
        if (encryptionKey.isBlank()) {
            throw new IllegalStateException("GMAIL_TOKEN_ENCRYPTION_KEY is not configured");
        }
        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(encryptionKey);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("GMAIL_TOKEN_ENCRYPTION_KEY must be base64-encoded", ex);
        }
        if (decoded.length != 32) {
            throw new IllegalStateException("GMAIL_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes");
        }
        return new SecretKeySpec(decoded, "AES");
    }

    private record EncryptedCredential(String senderEmail, String ciphertext, String iv) {}
    public record Credential(String senderEmail, String refreshToken) {}
}

package com.bank.auth.service;

import com.bank.auth.security.JwtProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Opaque refresh tokens stored in Redis with a TTL. Each token maps to a user id.
 * Rotation deletes the presented token and issues a fresh one, so a stolen token
 * can be used at most once before becoming invalid.
 */
@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";

    private final StringRedisTemplate redis;
    private final JwtProperties properties;

    public RefreshTokenService(StringRedisTemplate redis, JwtProperties properties) {
        this.redis = redis;
        this.properties = properties;
    }

    /** Creates and stores a new refresh token for the given user. */
    public String issue(UUID userId) {
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set(key(token), userId.toString(), properties.refreshTokenTtl());
        return token;
    }

    /** Returns the user id a token belongs to, or null if unknown/expired. */
    public UUID resolveUserId(String token) {
        String value = redis.opsForValue().get(key(token));
        return value == null ? null : UUID.fromString(value);
    }

    public void revoke(String token) {
        redis.delete(key(token));
    }

    private String key(String token) {
        return KEY_PREFIX + token;
    }
}

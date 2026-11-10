package com.bank.auth.security;

import com.bank.auth.domain.Role;

import java.util.UUID;

/**
 * The authenticated principal stored in the SecurityContext, derived from a
 * verified access token. No DB lookup required per request.
 */
public record AuthUser(UUID id, String email, Role role) {
}

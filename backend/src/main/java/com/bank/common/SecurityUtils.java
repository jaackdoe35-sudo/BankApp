package com.bank.common;

import com.bank.auth.security.AuthUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

/**
 * Convenience accessors for the currently authenticated {@link AuthUser}.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static AuthUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser authUser)) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return authUser;
    }

    public static UUID currentUserId() {
        return currentUser().id();
    }
}

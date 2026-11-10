package com.bank.auth.domain;

/**
 * Coarse-grained role for RBAC. Spring authorities use the "ROLE_" prefix
 * (e.g. ROLE_ADMIN); see {@code authority()}.
 */
public enum Role {
    CUSTOMER,
    ADMIN,
    SUPPORT;

    public String authority() {
        return "ROLE_" + name();
    }
}

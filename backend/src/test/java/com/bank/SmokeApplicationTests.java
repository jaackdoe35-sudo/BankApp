package com.bank;

import org.junit.jupiter.api.Test;

/**
 * Phase 0 smoke test: boots the full Spring context against the shared Postgres +
 * Redis containers (see {@link AbstractIntegrationTest}) so Flyway runs all
 * migrations. If this passes, the core wiring is sound.
 */
class SmokeApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {
        // Context startup (incl. Flyway migrations) is the assertion.
    }
}

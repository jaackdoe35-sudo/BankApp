package com.bank.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Lightweight liveness endpoint used by the frontend to prove end-to-end wiring.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "System", description = "Service health and metadata")
public class PingController {

    @GetMapping("/ping")
    @Operation(summary = "Ping the API", description = "Returns service status and a server timestamp.")
    public Map<String, Object> ping() {
        return Map.of(
                "status", "UP",
                "service", "banking-backend",
                "timestamp", Instant.now().toString()
        );
    }
}

package com.bank.experiment.web;

import com.bank.auth.security.JwtAuthenticationFilter;
import com.bank.common.ratelimit.RateLimitFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;

// No separate filter chain: public session bootstrap is added to the primary chain
// by the experiment API matcher configuration in SecurityConfig.
@Configuration
public class ExperimentSecurityConfig {
    // Deliberately empty. Endpoint-level session tokens protect write access;
    // owner reads remain guarded by @PreAuthorize on AdminExperimentController.
}
package com.bank.common.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test for the per-IP auth rate limiter — fast and deterministic, no Spring
 * context (so it can't contaminate the integration suite's shared buckets).
 */
class RateLimitFilterTest {

    // Mirrors Spring Boot's ObjectMapper (JSR-310 enabled) so ApiError serializes.
    private static final ObjectMapper MAPPER = new ObjectMapper().findAndRegisterModules();

    private MockHttpServletResponse fire(RateLimitFilter filter, String ip, String uri) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", uri);
        request.setRemoteAddr(ip);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }

    @Test
    void allowsUpToCapacityThenReturns429() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(MAPPER, true, 3);
        String ip = "203.0.113.5";

        for (int i = 0; i < 3; i++) {
            assertThat(fire(filter, ip, "/api/v1/auth/login").getStatus()).isEqualTo(HttpStatus.OK.value());
        }
        assertThat(fire(filter, ip, "/api/v1/auth/login").getStatus())
                .isEqualTo(HttpStatus.TOO_MANY_REQUESTS.value());
    }

    @Test
    void limitsArePerIp() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(MAPPER, true, 1);
        assertThat(fire(filter, "10.0.0.1", "/api/v1/auth/login").getStatus()).isEqualTo(200);
        assertThat(fire(filter, "10.0.0.1", "/api/v1/auth/login").getStatus()).isEqualTo(429);
        // A different IP still has its own full bucket.
        assertThat(fire(filter, "10.0.0.2", "/api/v1/auth/login").getStatus()).isEqualTo(200);
    }

    @Test
    void ignoresNonAuthPaths() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(MAPPER, true, 1);
        assertThat(fire(filter, "10.0.0.3", "/api/v1/accounts").getStatus()).isEqualTo(200);
        assertThat(fire(filter, "10.0.0.3", "/api/v1/accounts").getStatus()).isEqualTo(200);
    }
}

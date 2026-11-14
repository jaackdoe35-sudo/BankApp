package com.bank.common.ratelimit;

import com.bank.common.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

/** Per-IP limits for authentication and public experiment session ingestion. */
@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private static final String AUTH_PREFIX = "/api/v1/auth/";
    private static final String EXPERIMENT_PREFIX = "/api/v1/experiment/sessions";
    private final ObjectMapper objectMapper;
    private final boolean enabled;
    private final int authCapacity;
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(10)).maximumSize(100_000).build();

    public RateLimitFilter(ObjectMapper objectMapper,
                           @Value("${app.ratelimit.enabled:true}") boolean enabled,
                           @Value("${app.ratelimit.auth-per-minute:20}") int capacity) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.authCapacity = capacity;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !enabled || !(path.startsWith(AUTH_PREFIX) || path.startsWith(EXPERIMENT_PREFIX));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        boolean experiment = path.startsWith(EXPERIMENT_PREFIX);
        int capacity = experiment
                ? (path.equals(EXPERIMENT_PREFIX) ? 10 : 120)
                : authCapacity;
        String bucketKey = clientIp(request) + (experiment ? (path.equals(EXPERIMENT_PREFIX) ? ":experiment-bootstrap" : ":experiment-ingest") : ":auth");
        Bucket bucket = buckets.get(bucketKey, ip -> newBucket(capacity));
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            writeTooManyRequests(request, response);
        }
    }

    private Bucket newBucket(int capacity) {
        Bandwidth limit = Bandwidth.builder().capacity(capacity)
                .refillGreedy(capacity, Duration.ofMinutes(1)).build();
        return Bucket.builder().addLimit(limit).build();
    }

    private String clientIp(HttpServletRequest request) {
        // The hosting proxy must overwrite X-Forwarded-For; never trust a user-supplied
        // forwarding header when the deployment does not sit behind a trusted proxy.
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private void writeTooManyRequests(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiError body = ApiError.of(HttpStatus.TOO_MANY_REQUESTS.value(),
                HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase(),
                "Too many requests — please slow down", request.getRequestURI());
        objectMapper.writeValue(response.getWriter(), body);
    }
}
package com.bank.experiment.service;

import com.bank.experiment.domain.ExperimentEvent;
import com.bank.experiment.domain.ExperimentFile;
import com.bank.experiment.domain.ExperimentSession;
import com.bank.experiment.dto.ExperimentEventRequest;
import com.bank.experiment.dto.ExperimentFileResponse;
import com.bank.experiment.dto.ExperimentSessionResponse;
import com.bank.experiment.repo.ExperimentEventRepository;
import com.bank.experiment.repo.ExperimentFileRepository;
import com.bank.experiment.repo.ExperimentSessionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class ExperimentActivityService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf",
            "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    private static final Set<String> REDACT_KEYS = Set.of(
            "password", "passwd", "token", "accesstoken", "refreshtoken",
            "authorization", "cookie", "codevalue", "otp", "onetimepassword",
            "secret", "clientsecret", "jwt");

    private final ExperimentSessionRepository sessions;
    private final ExperimentEventRepository events;
    private final ExperimentFileRepository files;

    public ExperimentActivityService(ExperimentSessionRepository sessions,
                                     ExperimentEventRepository events,
                                     ExperimentFileRepository files) {
        this.sessions = sessions;
        this.events = events;
        this.files = files;
    }

    @Transactional
    public ExperimentSessionResponse createSession() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        Instant now = Instant.now();
        ExperimentSession session = sessions.save(new ExperimentSession(
                UUID.randomUUID(), sha256(token), now, now.plus(24, ChronoUnit.HOURS)));
        return new ExperimentSessionResponse(session.getId(), token, session.getExpiresAt());
    }

    @Transactional(readOnly = true)
    public ExperimentSession requireSession(String token) {
        if (token == null || token.length() < 40 || token.length() > 100) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid experiment session");
        }
        ExperimentSession session = sessions.findByTokenHashAndRevokedAtIsNull(sha256(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid experiment session"));
        if (!session.getExpiresAt().isAfter(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Experiment session expired");
        }
        return session;
    }

    @Transactional
    public UUID recordEvent(String token, ExperimentEventRequest request) {
        ExperimentSession session = requireSession(token);
        Map<String, Object> safe = redact(request.payload());
        ExperimentEvent event = new ExperimentEvent(UUID.randomUUID(), session.getId(),
                request.eventType(), safe, Instant.now());
        return events.save(event).getId();
    }

    @Transactional
    public ExperimentFileResponse storeFile(String token, MultipartFile upload) {
        ExperimentSession session = requireSession(token);
        if (upload == null || upload.isEmpty() || upload.getSize() > 10L * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must be between 1 byte and 10 MB");
        }
        String filename = upload.getOriginalFilename() == null ? "upload" : upload.getOriginalFilename();
        filename = filename.replaceAll("[\\\\/\\r\\n\\\\p{Cntrl}]", "_");
        if (filename.length() > 180) filename = filename.substring(filename.length() - 180);
        String contentType = upload.getContentType() == null ? "application/octet-stream" :
                upload.getContentType().toLowerCase(Locale.ROOT);
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported file content type");
        }
        try {
            byte[] content = upload.getBytes();
            String digest = sha256(content);
            ExperimentFile file = new ExperimentFile(UUID.randomUUID(), session.getId(), null,
                    "postgres:" + UUID.randomUUID(), filename, contentType, content.length, digest, Instant.now());
            file.setContent(content);
            files.save(file);
            return new ExperimentFileResponse(file.getId(), filename, contentType,
                    content.length, digest, file.getCreatedAt());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read uploaded file");
        }
    }

    @Transactional(readOnly = true)
    public Page<ExperimentEvent> recentEvents(int page, int size) {
        return events.findAllByOrderByCreatedAtDesc(PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100)));
    }

    @Transactional(readOnly = true)
    public ExperimentFile requireFile(UUID id) {
        return files.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private static Map<String, Object> redact(Map<String, Object> source) {
        Map<String, Object> result = new HashMap<>();
        source.forEach((key, value) -> {
            String normalized = key.replaceAll("[^A-Za-z]", "").toLowerCase(Locale.ROOT);
            if (!REDACT_KEYS.contains(normalized)) result.put(key, redactValue(value));
        });
        return result;
    }

    @SuppressWarnings("unchecked")
    private static Object redactValue(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> safe = new HashMap<>();
            map.forEach((k, v) -> {
                if (k instanceof String key) {
                    String normalized = key.replaceAll("[^A-Za-z]", "").toLowerCase(Locale.ROOT);
                    if (!REDACT_KEYS.contains(normalized)) safe.put(key, redactValue(v));
                }
            });
            return safe;
        }
        if (value instanceof Iterable<?> items) {
            java.util.List<Object> safe = new java.util.ArrayList<>();
            items.forEach(item -> safe.add(redactValue(item)));
            return safe;
        }
        return value;
    }

    private static String sha256(String value) {
        return sha256(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private static String sha256(byte[] value) {
        try {
            return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
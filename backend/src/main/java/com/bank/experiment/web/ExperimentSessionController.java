package com.bank.experiment.web;

import com.bank.experiment.dto.ExperimentEventRequest;
import com.bank.experiment.dto.ExperimentSessionResponse;
import com.bank.experiment.service.ExperimentActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/experiment")
public class ExperimentSessionController {
    private final ExperimentActivityService service;

    public ExperimentSessionController(ExperimentActivityService service) {
        this.service = service;
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public ExperimentSessionResponse createSession() {
        return service.createSession();
    }

    @PostMapping("/sessions/{sessionId}/events")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, UUID> record(@PathVariable UUID sessionId,
                                    @RequestHeader("X-Experiment-Token") String token,
                                    @Valid @RequestBody ExperimentEventRequest request) {
        if (!sessionId.equals(service.requireSession(token).getId())) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return Map.of("eventId", service.recordEvent(token, request));
    }

    @PostMapping("/sessions/{sessionId}/uploads")
    @ResponseStatus(HttpStatus.CREATED)
    public Object upload(@PathVariable UUID sessionId,
                         @RequestHeader("X-Experiment-Token") String token,
                         @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (!sessionId.equals(service.requireSession(token).getId())) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return service.storeFile(token, file);
    }
}
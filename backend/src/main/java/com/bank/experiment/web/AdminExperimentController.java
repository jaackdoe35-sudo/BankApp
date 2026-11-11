package com.bank.experiment.web;

import com.bank.experiment.domain.ExperimentEvent;
import com.bank.experiment.domain.ExperimentFile;
import com.bank.experiment.dto.ExperimentEventResponse;
import com.bank.experiment.service.ExperimentActivityService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/experiments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminExperimentController {
    private final ExperimentActivityService service;

    public AdminExperimentController(ExperimentActivityService service) {
        this.service = service;
    }

    @GetMapping("/events")
    public Page<ExperimentEventResponse> events(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "50") int size) {
        return service.recentEvents(page, size).map(ExperimentEventResponse::from);
    }

    @GetMapping("/events/{id}")
    public ExperimentEventResponse event(@PathVariable UUID id) {
        ExperimentEvent e = service.recentEvents(0, 100).stream()
                .filter(x -> x.getId().equals(id)).findFirst()
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND));
        return ExperimentEventResponse.from(e);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<ByteArrayResource> file(@PathVariable UUID id) {
        ExperimentFile file = service.requireFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getOriginalFilename().replace("\"", "") + "\"")
                .header("X-Content-Type-Options", "nosniff")
                .body(new ByteArrayResource(file.getContent()));
    }
}
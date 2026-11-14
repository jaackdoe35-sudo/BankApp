package com.bank.experiment.web;

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

    @GetMapping("/files")
    public Page<com.bank.experiment.dto.ExperimentFileResponse> files(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.recentFiles(page, size).map(file -> new com.bank.experiment.dto.ExperimentFileResponse(
                file.getId(), file.getOriginalFilename(), file.getContentType(),
                file.getSizeBytes(), file.getSha256(), file.getCreatedAt()));
    }

    @GetMapping("/events/{id}")
    public ExperimentEventResponse event(@PathVariable UUID id) {
        return ExperimentEventResponse.from(service.requireEvent(id));
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
package com.bank.notification.web;

import com.bank.common.SecurityUtils;
import com.bank.notification.dto.NotificationResponse;
import com.bank.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "In-app notification feed")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "List my notifications (newest first)")
    public List<NotificationResponse> list() {
        return notificationService.list(SecurityUtils.currentUserId()).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Count my unread notifications")
    public Map<String, Long> unreadCount() {
        return Map.of("count", notificationService.unreadCount(SecurityUtils.currentUserId()));
    }

    @PostMapping("/{notificationId}/read")
    @Operation(summary = "Mark a notification read")
    public ResponseEntity<Void> read(@PathVariable UUID notificationId) {
        notificationService.markRead(SecurityUtils.currentUserId(), notificationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/read-all")
    @Operation(summary = "Mark all my notifications read")
    public ResponseEntity<Void> readAll() {
        notificationService.markAllRead(SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}

package com.bank.notification.service;

import com.bank.auth.repo.UserRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.exception.NotFoundException;
import com.bank.notification.domain.Notification;
import com.bank.notification.repo.NotificationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               JdbcTemplate jdbcTemplate,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    /** Persists the in-app notification and email outbox atomically; never contacts SMTP/API here. */
    @Transactional
    public void handle(DomainEvent event) {
        if (!event.userFacing() || event.subjectUserId() == null) return;

        String title = humanize(event.action());
        int inserted = jdbcTemplate.update("""
                INSERT INTO notifications (event_id, user_id, type, title, message)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (event_id) DO NOTHING
                """, event.eventId(), event.subjectUserId(), event.action(), title, event.message());
        if (inserted == 0) return;

        var recipient = userRepository.findById(event.subjectUserId())
                .orElseThrow(() -> new NotFoundException("Notification recipient not found"));
        if (recipient.getEmail() == null || recipient.getEmail().isBlank()) {
            throw new IllegalStateException("Notification recipient has no email address");
        }

        jdbcTemplate.update("""
                INSERT INTO email_outbox (id, event_id, recipient, subject, body)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (event_id) DO NOTHING
                """, event.eventId(), event.eventId(), recipient.getEmail(), emailSubject(event.action()), event.message());
    }

    @Transactional(readOnly = true)
    public List<Notification> list(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long unreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(UUID userId, UUID notificationId) {
        Notification n = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        n.setRead(true);
    }

    @Transactional
    public void markAllRead(UUID userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).forEach(n -> n.setRead(true));
    }

    private String emailSubject(String action) {
        return switch (action) {
            case EventActions.DEPOSIT -> "Deposit confirmation";
            case EventActions.TOP_UP_SUCCEEDED -> "Top-up confirmation";
            case EventActions.LOAN_APPROVED -> "Loan approval confirmation";
            case EventActions.LOAN_PAID_OFF -> "Loan repayment confirmation";
            default -> humanize(action);
        };
    }

    private String humanize(String action) {
        String[] parts = action.toLowerCase().split("_");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (!p.isEmpty()) sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(' ');
        }
        return sb.toString().trim();
    }
}

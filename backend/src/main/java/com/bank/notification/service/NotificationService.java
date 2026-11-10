package com.bank.notification.service;

import com.bank.auth.repo.UserRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.exception.NotFoundException;
import com.bank.notification.domain.Notification;
import com.bank.notification.email.EmailSender;
import com.bank.notification.repo.NotificationRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailSender emailSender;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               EmailSender emailSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailSender = emailSender;
    }

    /** Creates a notification (and emails it) for a user-facing event. Idempotent on eventId. */
    @Transactional
    public void handle(DomainEvent event) {
        if (!event.userFacing() || event.subjectUserId() == null) {
            return;
        }
        if (notificationRepository.existsByEventId(event.eventId())) {
            return;
        }
        String title = humanize(event.action());
        Notification notification = new Notification(
                event.eventId(), event.subjectUserId(), event.action(), title, event.message());
        try {
            notificationRepository.save(notification);
        } catch (DataIntegrityViolationException duplicate) {
            return; // concurrent delivery already inserted it
        }
        userRepository.findById(event.subjectUserId())
                .ifPresent(user -> emailSender.send(user.getEmail(), title, event.message()));
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
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .forEach(n -> n.setRead(true));
    }

    private String humanize(String action) {
        String[] parts = action.toLowerCase().split("_");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p.isEmpty()) continue;
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(' ');
        }
        return sb.toString().trim();
    }
}

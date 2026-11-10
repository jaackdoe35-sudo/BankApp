package com.bank.notification.messaging;

import com.bank.common.event.DomainEvent;
import com.bank.notification.service.NotificationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes the event stream and turns user-facing events into notifications.
 * Its own consumer group means it processes every event independently of the
 * audit consumer.
 */
@Component
@ConditionalOnProperty(name = "app.events.enabled", havingValue = "true", matchIfMissing = true)
public class NotificationConsumer {

    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "${app.events.topic:banking.events}", groupId = "notifications")
    public void onEvent(DomainEvent event) {
        notificationService.handle(event);
    }
}

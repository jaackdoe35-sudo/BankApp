package com.bank.audit.messaging;

import com.bank.audit.service.AuditService;
import com.bank.common.event.DomainEvent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes every domain event and appends it to the audit log. Uses its own
 * consumer group so it is independent of the notification consumer.
 */
@Component
@ConditionalOnProperty(name = "app.events.enabled", havingValue = "true", matchIfMissing = true)
public class AuditConsumer {

    private final AuditService auditService;

    public AuditConsumer(AuditService auditService) {
        this.auditService = auditService;
    }

    @KafkaListener(topics = "${app.events.topic:banking.events}", groupId = "audit")
    public void onEvent(DomainEvent event) {
        auditService.record(event);
    }
}

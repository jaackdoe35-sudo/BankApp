package com.bank.common.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Publishes {@link DomainEvent}s to Kafka. Fail-safe: a broker problem is logged
 * but never propagated, so a core banking action is never broken by the
 * notification/audit pipeline being unavailable.
 */
@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final KafkaTemplate<String, DomainEvent> kafkaTemplate;
    private final String topic;
    private final boolean enabled;

    public EventPublisher(KafkaTemplate<String, DomainEvent> kafkaTemplate,
                          @Value("${app.events.topic:banking.events}") String topic,
                          @Value("${app.events.enabled:true}") boolean enabled) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
        this.enabled = enabled;
    }

    public void publish(DomainEvent event) {
        if (!enabled) {
            return; // event pipeline disabled (e.g. a deployment without Kafka)
        }
        try {
            kafkaTemplate.send(topic, key(event), event);
        } catch (Exception e) {
            log.warn("Failed to publish event {} ({}): {}", event.eventId(), event.action(), e.getMessage());
        }
    }

    private String key(DomainEvent event) {
        UUID k = event.subjectUserId() != null ? event.subjectUserId() : event.actorUserId();
        return k != null ? k.toString() : event.eventId().toString();
    }
}

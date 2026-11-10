package com.bank.audit.service;

import com.bank.audit.domain.AuditEntry;
import com.bank.audit.repo.AuditEntryRepository;
import com.bank.common.event.DomainEvent;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private final AuditEntryRepository auditRepository;

    public AuditService(AuditEntryRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /** Appends an audit record for an event. Idempotent on eventId. */
    @Transactional
    public void record(DomainEvent event) {
        if (auditRepository.existsByEventId(event.eventId())) {
            return;
        }
        try {
            auditRepository.save(new AuditEntry(
                    event.eventId(), event.actorUserId(), event.action(),
                    event.entityType(), event.entityId(), event.message()));
        } catch (DataIntegrityViolationException duplicate) {
            // concurrent delivery already recorded it
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditEntry> recent(int page, int size) {
        return auditRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 200)));
    }
}

package com.bank.audit.repo;

import com.bank.audit.domain.AuditEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuditEntryRepository extends JpaRepository<AuditEntry, UUID> {

    boolean existsByEventId(UUID eventId);

    Page<AuditEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

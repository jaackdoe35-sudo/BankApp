package com.bank.experiment.repo;

import com.bank.experiment.domain.ExperimentSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ExperimentSessionRepository extends JpaRepository<ExperimentSession, UUID> {
    Optional<ExperimentSession> findByTokenHashAndRevokedAtIsNull(String tokenHash);
}
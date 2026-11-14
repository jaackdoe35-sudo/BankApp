package com.bank.experiment.repo;

import com.bank.experiment.domain.ExperimentEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExperimentEventRepository extends JpaRepository<ExperimentEvent, UUID> {
    Page<ExperimentEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
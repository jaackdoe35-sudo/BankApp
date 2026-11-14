package com.bank.experiment.repo;

import com.bank.experiment.domain.ExperimentFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ExperimentFileRepository extends JpaRepository<ExperimentFile, UUID> {
    Page<ExperimentFile> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
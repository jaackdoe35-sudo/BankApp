package com.bank.experiment.repo;

import com.bank.experiment.domain.ExperimentFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExperimentFileRepository extends JpaRepository<ExperimentFile, UUID> {}
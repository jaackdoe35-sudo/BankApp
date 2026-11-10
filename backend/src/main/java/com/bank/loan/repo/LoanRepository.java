package com.bank.loan.repo;

import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, UUID> {

    List<Loan> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Loan> findByIdAndUserId(UUID id, UUID userId);

    List<Loan> findByStatusOrderByCreatedAtAsc(LoanStatus status);

    List<Loan> findByStatus(LoanStatus status);
}

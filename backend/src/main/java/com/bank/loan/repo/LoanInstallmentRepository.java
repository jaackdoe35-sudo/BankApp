package com.bank.loan.repo;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LoanInstallmentRepository extends JpaRepository<LoanInstallment, UUID> {

    List<LoanInstallment> findByLoanIdOrderBySeqAsc(UUID loanId);

    Optional<LoanInstallment> findFirstByLoanIdAndStatusNotOrderBySeqAsc(UUID loanId, InstallmentStatus status);

    long countByLoanIdAndStatusNot(UUID loanId, InstallmentStatus status);

    List<LoanInstallment> findByStatusAndDueDateBefore(InstallmentStatus status, LocalDate date);
}

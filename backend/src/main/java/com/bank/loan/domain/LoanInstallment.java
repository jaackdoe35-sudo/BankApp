package com.bank.loan.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "loan_installments")
@Getter
@Setter
@NoArgsConstructor
public class LoanInstallment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "loan_id", nullable = false)
    private UUID loanId;

    @Column(nullable = false)
    private int seq;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "principal_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal principalDue;

    @Column(name = "interest_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal interestDue;

    @Column(name = "total_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalDue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstallmentStatus status = InstallmentStatus.PENDING;

    @Column(name = "paid_at")
    private Instant paidAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public LoanInstallment(UUID loanId, int seq, LocalDate dueDate,
                           BigDecimal principalDue, BigDecimal interestDue, BigDecimal totalDue) {
        this.loanId = loanId;
        this.seq = seq;
        this.dueDate = dueDate;
        this.principalDue = principalDue;
        this.interestDue = interestDue;
        this.totalDue = totalDue;
    }
}

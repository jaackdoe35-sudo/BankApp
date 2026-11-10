package com.bank.loan.service;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.repo.LoanInstallmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Daily loan maintenance: flags unpaid installments whose due date has passed as
 * OVERDUE. Runs on a cron schedule (see app.loans.maintenance-cron).
 */
@Component
public class LoanScheduler {

    private static final Logger log = LoggerFactory.getLogger(LoanScheduler.class);

    private final LoanInstallmentRepository installmentRepository;

    public LoanScheduler(LoanInstallmentRepository installmentRepository) {
        this.installmentRepository = installmentRepository;
    }

    @Scheduled(cron = "${app.loans.maintenance-cron:0 0 1 * * *}")
    @Transactional
    public void markOverdueInstallments() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<LoanInstallment> due = installmentRepository
                .findByStatusAndDueDateBefore(InstallmentStatus.PENDING, today);
        if (due.isEmpty()) {
            return;
        }
        due.forEach(i -> i.setStatus(InstallmentStatus.OVERDUE));
        log.info("Loan maintenance: marked {} installment(s) overdue", due.size());
    }
}

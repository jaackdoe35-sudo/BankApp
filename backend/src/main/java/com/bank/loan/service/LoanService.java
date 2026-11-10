package com.bank.loan.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.SecurityUtils;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.repo.CustomerProfileRepository;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.domain.LoanStatus;
import com.bank.loan.repo.LoanInstallmentRepository;
import com.bank.loan.repo.LoanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanInstallmentRepository installmentRepository;
    private final AccountRepository accountRepository;
    private final CustomerProfileRepository profileRepository;
    private final LedgerService ledgerService;
    private final AmortizationCalculator calculator;

    private final BigDecimal annualRate;
    private final BigDecimal minPrincipal;
    private final BigDecimal maxPrincipal;
    private final int maxTermMonths;
    private final EventPublisher eventPublisher;

    public LoanService(LoanRepository loanRepository,
                       LoanInstallmentRepository installmentRepository,
                       AccountRepository accountRepository,
                       CustomerProfileRepository profileRepository,
                       LedgerService ledgerService,
                       AmortizationCalculator calculator,
                       EventPublisher eventPublisher,
                       @Value("${app.loans.annual-rate:0.12}") BigDecimal annualRate,
                       @Value("${app.loans.min-principal:100}") BigDecimal minPrincipal,
                       @Value("${app.loans.max-principal:50000}") BigDecimal maxPrincipal,
                       @Value("${app.loans.max-term-months:60}") int maxTermMonths) {
        this.loanRepository = loanRepository;
        this.installmentRepository = installmentRepository;
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
        this.ledgerService = ledgerService;
        this.calculator = calculator;
        this.eventPublisher = eventPublisher;
        this.annualRate = annualRate;
        this.minPrincipal = minPrincipal;
        this.maxPrincipal = maxPrincipal;
        this.maxTermMonths = maxTermMonths;
    }

    @Transactional
    public Loan apply(UUID userId, UUID accountId, BigDecimal principal, int termMonths) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        KycStatus kyc = profileRepository.findByUserId(userId)
                .map(p -> p.getKycStatus())
                .orElse(KycStatus.PENDING);
        if (kyc != KycStatus.VERIFIED) {
            throw new IllegalArgumentException("KYC must be verified before applying for a loan");
        }
        if (principal.compareTo(minPrincipal) < 0 || principal.compareTo(maxPrincipal) > 0) {
            throw new IllegalArgumentException(
                    "Principal must be between " + minPrincipal + " and " + maxPrincipal);
        }
        if (termMonths <= 0 || termMonths > maxTermMonths) {
            throw new IllegalArgumentException("Term must be between 1 and " + maxTermMonths + " months");
        }
        return loanRepository.save(new Loan(userId, accountId, principal, annualRate, termMonths));
    }

    @Transactional(readOnly = true)
    public List<Loan> list(UUID userId) {
        return loanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Loan get(UUID userId, UUID loanId) {
        return loanRepository.findByIdAndUserId(loanId, userId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
    }

    @Transactional(readOnly = true)
    public List<LoanInstallment> installments(UUID loanId) {
        return installmentRepository.findByLoanIdOrderBySeqAsc(loanId);
    }

    @Transactional
    public Loan repayNext(UUID userId, UUID loanId) {
        Loan loan = get(userId, loanId);
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new IllegalArgumentException("Loan is not active");
        }
        LoanInstallment next = installmentRepository
                .findFirstByLoanIdAndStatusNotOrderBySeqAsc(loanId, InstallmentStatus.PAID)
                .orElseThrow(() -> new IllegalArgumentException("No outstanding installments"));

        Account account = accountRepository.findByIdAndOwnerUserId(loan.getAccountId(), userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        Account system = systemAccount(account.getCurrency());

        // Insufficient funds surfaces as 422 from the ledger.
        ledgerService.post(TransactionType.LOAN_REPAYMENT,
                "Loan repayment installment " + next.getSeq(), null, List.of(
                        PostingLine.debit(account.getId(), next.getTotalDue()),
                        PostingLine.credit(system.getId(), next.getTotalDue())));

        next.setStatus(InstallmentStatus.PAID);
        next.setPaidAt(Instant.now());

        if (installmentRepository.countByLoanIdAndStatusNot(loanId, InstallmentStatus.PAID) == 0) {
            loan.setStatus(LoanStatus.PAID_OFF);
            eventPublisher.publish(DomainEvent.userAction(EventActions.LOAN_PAID_OFF, userId, "LOAN",
                    loanId.toString(), "Your loan is fully paid off"));
        }
        return loan;
    }

    // ---- Admin ----

    @Transactional(readOnly = true)
    public List<Loan> listByStatus(LoanStatus status) {
        return status == null ? loanRepository.findAll() : loanRepository.findByStatusOrderByCreatedAtAsc(status);
    }

    @Transactional
    public Loan approve(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalArgumentException("Loan is not pending");
        }
        Account account = accountRepository.findById(loan.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));
        Account system = systemAccount(account.getCurrency());

        // Generate and persist the amortization schedule.
        LocalDate start = LocalDate.now(ZoneOffset.UTC);
        List<LoanInstallment> rows = calculator
                .schedule(loan.getPrincipal(), loan.getAnnualRate(), loan.getTermMonths(), start)
                .stream()
                .map(i -> new LoanInstallment(loan.getId(), i.seq(), i.dueDate(),
                        i.principalDue(), i.interestDue(), i.totalDue()))
                .toList();
        installmentRepository.saveAll(rows);

        // Disburse the principal into the customer account.
        ledgerService.post(TransactionType.LOAN_DISBURSEMENT, "Loan disbursement", null, List.of(
                PostingLine.debit(system.getId(), loan.getPrincipal()),
                PostingLine.credit(account.getId(), loan.getPrincipal())));

        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDisbursedAt(Instant.now());
        eventPublisher.publish(DomainEvent.of(EventActions.LOAN_APPROVED, SecurityUtils.currentUserId(),
                loan.getUserId(), "LOAN", loanId.toString(),
                "Your loan of " + loan.getPrincipal() + " was approved and disbursed", true));
        return loan;
    }

    @Transactional
    public Loan reject(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalArgumentException("Loan is not pending");
        }
        loan.setStatus(LoanStatus.REJECTED);
        return loan;
    }

    private Account systemAccount(String currency) {
        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)
                .orElseThrow(() -> new NotFoundException("System account not configured"));
    }
}

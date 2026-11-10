package com.bank.loan.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Generates a fixed, equal-payment amortization schedule.
 *
 * <p>Monthly rate r = annual/12; payment M = P·r·(1+r)^n / ((1+r)^n − 1).
 * Each installment's interest = outstanding·r and principal = M − interest; the
 * final installment absorbs rounding so the schedule fully repays the principal.
 */
@Component
public class AmortizationCalculator {

    private static final MathContext MC = MathContext.DECIMAL64;
    private static final int SCALE = 2;

    public record Installment(int seq, LocalDate dueDate, BigDecimal principalDue,
                              BigDecimal interestDue, BigDecimal totalDue) {
    }

    public List<Installment> schedule(BigDecimal principal, BigDecimal annualRate,
                                      int termMonths, LocalDate startDate) {
        if (termMonths <= 0) {
            throw new IllegalArgumentException("Term must be positive");
        }
        BigDecimal r = annualRate.divide(BigDecimal.valueOf(12), MC);
        BigDecimal payment = monthlyPayment(principal, r, termMonths);

        List<Installment> rows = new ArrayList<>(termMonths);
        BigDecimal balance = principal.setScale(SCALE, RoundingMode.HALF_EVEN);

        for (int seq = 1; seq <= termMonths; seq++) {
            BigDecimal interest = balance.multiply(r).setScale(SCALE, RoundingMode.HALF_EVEN);
            BigDecimal principalDue = payment.subtract(interest);
            BigDecimal total;
            if (seq == termMonths || principalDue.compareTo(balance) >= 0) {
                // Final (or over-shooting) installment clears the remaining balance exactly.
                principalDue = balance;
                total = principalDue.add(interest);
                balance = BigDecimal.ZERO.setScale(SCALE);
            } else {
                total = payment;
                balance = balance.subtract(principalDue);
            }
            rows.add(new Installment(seq, startDate.plusMonths(seq), principalDue, interest, total));
        }
        return rows;
    }

    private BigDecimal monthlyPayment(BigDecimal principal, BigDecimal r, int n) {
        if (r.signum() == 0) {
            return principal.divide(BigDecimal.valueOf(n), SCALE, RoundingMode.HALF_EVEN);
        }
        BigDecimal pow = r.add(BigDecimal.ONE).pow(n, MC);                  // (1+r)^n
        BigDecimal m = principal.multiply(r).multiply(pow)
                .divide(pow.subtract(BigDecimal.ONE), MC);                  // P·r·pow/(pow-1)
        return m.setScale(SCALE, RoundingMode.HALF_EVEN);
    }
}

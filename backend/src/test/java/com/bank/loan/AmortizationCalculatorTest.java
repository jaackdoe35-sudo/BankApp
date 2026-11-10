package com.bank.loan;

import com.bank.loan.service.AmortizationCalculator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class AmortizationCalculatorTest {

    private final AmortizationCalculator calc = new AmortizationCalculator();

    private BigDecimal sumPrincipal(List<AmortizationCalculator.Installment> s) {
        return s.stream().map(AmortizationCalculator.Installment::principalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Test
    void amortizesStandardLoan() {
        // 1200 @ 12% annual over 12 months -> ~106.62/month.
        var schedule = calc.schedule(new BigDecimal("1200.00"), new BigDecimal("0.12"), 12,
                LocalDate.of(2026, 1, 1));

        assertThat(schedule).hasSize(12);
        assertThat(schedule.get(0).totalDue()).isEqualByComparingTo("106.62");
        assertThat(schedule.get(0).interestDue()).isEqualByComparingTo("12.00"); // 1200 * 0.01
        assertThat(schedule.get(0).principalDue()).isEqualByComparingTo("94.62");
        // Principal fully repaid (no drift).
        assertThat(sumPrincipal(schedule)).isEqualByComparingTo("1200.00");
        // Due dates are monthly.
        assertThat(schedule.get(0).dueDate()).isEqualTo(LocalDate.of(2026, 2, 1));
        assertThat(schedule.get(11).dueDate()).isEqualTo(LocalDate.of(2027, 1, 1));
    }

    @Test
    void zeroRateSplitsEvenly() {
        var schedule = calc.schedule(new BigDecimal("1200.00"), BigDecimal.ZERO, 12,
                LocalDate.of(2026, 1, 1));

        assertThat(schedule).hasSize(12);
        assertThat(schedule).allSatisfy(i -> {
            assertThat(i.interestDue()).isEqualByComparingTo("0.00");
            assertThat(i.totalDue()).isEqualByComparingTo("100.00");
        });
        assertThat(sumPrincipal(schedule)).isEqualByComparingTo("1200.00");
    }
}

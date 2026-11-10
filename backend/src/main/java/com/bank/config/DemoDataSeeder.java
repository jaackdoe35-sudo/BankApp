package com.bank.config;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.service.AccountService;
import com.bank.auth.domain.Role;
import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.card.service.CardService;
import com.bank.customer.domain.CustomerProfile;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.repo.CustomerProfileRepository;
import com.bank.loan.service.LoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds a ready-to-explore demo customer so the live deployment isn't empty:
 * a KYC-verified user with a funded account, a virtual card, and a pending loan
 * (for the admin to approve). Enabled with app.seed.demo=true. Idempotent.
 */
@Component
@Order(20) // after AdminSeeder
@ConditionalOnProperty(name = "app.seed.demo", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);
    private static final String EMAIL = "demo@bank.local";
    private static final String PASSWORD = "Demo123!";

    private final UserRepository userRepository;
    private final CustomerProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;
    private final CardService cardService;
    private final LoanService loanService;

    public DemoDataSeeder(UserRepository userRepository,
                          CustomerProfileRepository profileRepository,
                          PasswordEncoder passwordEncoder,
                          AccountService accountService,
                          CardService cardService,
                          LoanService loanService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.accountService = accountService;
        this.cardService = cardService;
        this.loanService = loanService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(EMAIL)) {
            return;
        }
        User user = userRepository.save(new User(EMAIL, passwordEncoder.encode(PASSWORD), Role.CUSTOMER));

        CustomerProfile profile = new CustomerProfile(user.getId(), "Demo", "User");
        profile.setKycStatus(KycStatus.VERIFIED);
        profile.setCountry("UK");
        profileRepository.save(profile);

        Account account = accountService.createAccount(user.getId(), AccountType.CHECKING, "USD");
        accountService.tellerDeposit(user.getId(), account.getAccountNumber(), new BigDecimal("5000.00"));
        cardService.issue(user.getId(), account.getId(), new BigDecimal("1000.00"));
        loanService.apply(user.getId(), account.getId(), new BigDecimal("2000.00"), 12);

        log.info("Seeded demo customer {} (funded account + card + pending loan)", EMAIL);
    }
}

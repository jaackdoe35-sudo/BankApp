package com.bank.config;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.service.AccountService;
import com.bank.auth.domain.Role;
import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.card.service.CardService;
import com.bank.customer.domain.CustomerProfile;
import com.bank.customer.repo.CustomerProfileRepository;
import com.bank.loan.service.LoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(20)
@ConditionalOnProperty(name = "app.seed.demo.enabled", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final CustomerProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;
    private final CardService cardService;
    private final LoanService loanService;
    private final String demoEmail;
    private final String demoPassword;

    public DemoDataSeeder(UserRepository userRepository,
                          CustomerProfileRepository profileRepository,
                          PasswordEncoder passwordEncoder,
                          AccountService accountService,
                          CardService cardService,
                          LoanService loanService,
                          @Value("${app.seed.demo.email:}") String demoEmail,
                          @Value("${app.seed.demo.password:}") String demoPassword) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.accountService = accountService;
        this.cardService = cardService;
        this.loanService = loanService;
        this.demoEmail = demoEmail;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(String... args) {
        if (demoEmail.isBlank() || demoPassword.length() < 20) {
            throw new IllegalStateException(
                    "Demo seeding is enabled but DEMO_EMAIL is blank or DEMO_PASSWORD is shorter than 20 characters");
        }
        if (userRepository.existsByEmail(demoEmail)) {
            log.info("Demo seeding skipped: configured demo email already exists");
            return;
        }
        User user = userRepository.save(new User(
                demoEmail, passwordEncoder.encode(demoPassword), Role.CUSTOMER));

        CustomerProfile profile = new CustomerProfile(user.getId(), "Demo", "User");
        profileRepository.save(profile);

        Account account = accountService.createAccount(user.getId(), AccountType.CHECKING, "USD");
        cardService.issue(user.getId(), account.getId(), new BigDecimal("1000.00"));
        loanService.apply(user.getId(), account.getId(), new BigDecimal("2000.00"), 12);

        log.info("Seeded configured demo customer with funded account, card, and pending loan");
    }
}

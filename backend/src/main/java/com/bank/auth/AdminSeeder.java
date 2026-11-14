package com.bank.auth;

import com.bank.auth.domain.Role;
import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.auth.service.RefreshTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed.admin.enabled", havingValue = "true")
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final boolean resetExisting;
    private final RefreshTokenService refreshTokenService;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.seed.admin.email:}") String adminEmail,
                       @Value("${app.seed.admin.password:}") String adminPassword,
                       @Value("${app.seed.admin.reset-existing:false}") boolean resetExisting,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.resetExisting = resetExisting;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.length() < 20) {
            throw new IllegalStateException(
                    "Admin bootstrap is enabled but ADMIN_EMAIL is blank or ADMIN_PASSWORD is shorter than 20 characters");
        }
        if (adminPassword.equals("Admin123!") || adminPassword.equals("password") ||
                adminPassword.equals("changeme")) {
            throw new IllegalStateException("Refusing a known weak administrator password");
        }
        if (userRepository.existsByEmail(adminEmail)) {
            if (!resetExisting) {
                log.info("Administrator bootstrap skipped: configured email already exists");
                return;
            }
            User existing = userRepository.findByEmail(adminEmail)
                    .orElseThrow(() -> new IllegalStateException("Configured administrator could not be loaded"));
            if (existing.getRole() != Role.ADMIN) {
                throw new IllegalStateException("Refusing to reset credentials for a non-administrator account");
            }
            // Revoke sessions first. If Redis is unavailable, do not change the password
            // and leave existing sessions active under a partially completed reset.
            refreshTokenService.revokeAllForUser(existing.getId());
            existing.setPasswordHash(passwordEncoder.encode(adminPassword));
            userRepository.save(existing);
            log.info("Existing administrator password reset and refresh sessions revoked");
            return;
        }
        userRepository.save(new User(adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN));
        log.info("Seeded administrator account from explicitly configured bootstrap credentials");
    }
}

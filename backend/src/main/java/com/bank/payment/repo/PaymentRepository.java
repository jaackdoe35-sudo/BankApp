package com.bank.payment.repo;

import com.bank.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByIdAndUserId(UUID id, UUID userId);

    Optional<Payment> findByProviderRef(String providerRef);
}

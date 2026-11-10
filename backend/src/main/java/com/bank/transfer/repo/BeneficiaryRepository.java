package com.bank.transfer.repo;

import com.bank.transfer.domain.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, UUID> {

    List<Beneficiary> findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);

    Optional<Beneficiary> findByIdAndOwnerUserId(UUID id, UUID ownerUserId);

    boolean existsByOwnerUserIdAndAccountNumber(UUID ownerUserId, String accountNumber);
}

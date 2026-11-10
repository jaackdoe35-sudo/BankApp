package com.bank.account.repo;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);

    Optional<Account> findByIdAndOwnerUserId(UUID id, UUID ownerUserId);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findFirstByTypeAndCurrency(AccountType type, String currency);

    boolean existsByAccountNumber(String accountNumber);

    /** Acquires a row-level write lock for safe balance updates during posting. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.id = :id")
    Optional<Account> findForUpdate(@Param("id") UUID id);
}

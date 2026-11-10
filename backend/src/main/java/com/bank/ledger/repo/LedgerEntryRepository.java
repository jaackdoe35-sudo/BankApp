package com.bank.ledger.repo;

import com.bank.ledger.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {

    /** Fetch-joins the parent transaction so entries can be mapped outside the session. */
    @Query("""
            select e from LedgerEntry e
            join fetch e.transaction
            where e.accountId = :accountId
            order by e.createdAt desc, e.id desc
            """)
    List<LedgerEntry> findByAccountIdWithTransaction(@Param("accountId") UUID accountId);
}

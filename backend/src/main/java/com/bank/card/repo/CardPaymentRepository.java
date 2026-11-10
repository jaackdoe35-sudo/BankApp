package com.bank.card.repo;

import com.bank.card.domain.CardPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public interface CardPaymentRepository extends JpaRepository<CardPayment, UUID> {

    /** Total spent on a card since the given instant (used for monthly-limit checks). */
    @Query("""
            select coalesce(sum(cp.amount), 0) from CardPayment cp
            where cp.cardId = :cardId and cp.createdAt >= :since
            """)
    BigDecimal sumSince(@Param("cardId") UUID cardId, @Param("since") Instant since);
}

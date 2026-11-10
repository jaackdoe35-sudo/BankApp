package com.bank.card.repo;

import com.bank.card.domain.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {

    List<Card> findByUserIdOrderByCreatedAtAsc(UUID userId);

    Optional<Card> findByIdAndUserId(UUID id, UUID userId);
}

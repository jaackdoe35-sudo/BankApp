package com.bank.card.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** A purchase made with a card, linked to the ledger transaction it posted. */
@Entity
@Table(name = "card_payments")
@Getter
@Setter
@NoArgsConstructor
public class CardPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "card_id", nullable = false)
    private UUID cardId;

    @Column(name = "transaction_id", nullable = false)
    private UUID transactionId;

    @Column(nullable = false)
    private String merchant;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CardPayment(UUID cardId, UUID transactionId, String merchant, BigDecimal amount) {
        this.cardId = cardId;
        this.transactionId = transactionId;
        this.merchant = merchant;
        this.amount = amount;
    }
}

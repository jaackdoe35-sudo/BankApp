package com.bank.card.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * A virtual card linked to an account. Only non-sensitive data is stored
 * (last4/brand/expiry) — the full PAN is shown once at issuance and never persisted.
 */
@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 4)
    private String last4;

    @Column(nullable = false)
    private String brand;

    @Column(name = "exp_month", nullable = false)
    private int expMonth;

    @Column(name = "exp_year", nullable = false)
    private int expYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status = CardStatus.ACTIVE;

    @Column(name = "monthly_limit", nullable = false, precision = 19, scale = 4)
    private BigDecimal monthlyLimit = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public Card(UUID accountId, UUID userId, String last4, String brand,
                int expMonth, int expYear, BigDecimal monthlyLimit) {
        this.accountId = accountId;
        this.userId = userId;
        this.last4 = last4;
        this.brand = brand;
        this.expMonth = expMonth;
        this.expYear = expYear;
        this.monthlyLimit = monthlyLimit;
    }
}

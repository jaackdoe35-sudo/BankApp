package com.bank.card.dto;

import com.bank.card.domain.Card;
import com.bank.card.domain.CardStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CardResponse(
        UUID id,
        UUID accountId,
        String last4,
        String brand,
        int expMonth,
        int expYear,
        CardStatus status,
        BigDecimal monthlyLimit,
        Instant createdAt
) {
    public static CardResponse from(Card c) {
        return new CardResponse(c.getId(), c.getAccountId(), c.getLast4(), c.getBrand(),
                c.getExpMonth(), c.getExpYear(), c.getStatus(), c.getMonthlyLimit(), c.getCreatedAt());
    }
}

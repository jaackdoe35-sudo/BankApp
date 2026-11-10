package com.bank.card.dto;

/**
 * Returned only at issuance. {@code cardNumber} (the full PAN) is shown ONCE and
 * never stored or returned again.
 */
public record IssueCardResponse(
        CardResponse card,
        String cardNumber
) {
}

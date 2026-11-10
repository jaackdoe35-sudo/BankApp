package com.bank.card.web;

import com.bank.card.domain.CardStatus;
import com.bank.card.dto.CardPaymentRequest;
import com.bank.card.dto.CardPaymentResponse;
import com.bank.card.dto.CardResponse;
import com.bank.card.dto.IssueCardRequest;
import com.bank.card.dto.IssueCardResponse;
import com.bank.card.service.CardService;
import com.bank.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cards")
@Tag(name = "Cards", description = "Virtual cards and card payments")
@SecurityRequirement(name = "bearerAuth")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping
    @Operation(summary = "Issue a virtual card (full number returned once)")
    public ResponseEntity<IssueCardResponse> issue(@Valid @RequestBody IssueCardRequest request) {
        IssueCardResponse body = cardService.issue(
                SecurityUtils.currentUserId(), request.accountId(), request.monthlyLimit());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping
    @Operation(summary = "List my cards")
    public List<CardResponse> list() {
        return cardService.list(SecurityUtils.currentUserId()).stream()
                .map(CardResponse::from)
                .toList();
    }

    @PostMapping("/{cardId}/freeze")
    @Operation(summary = "Freeze a card")
    public CardResponse freeze(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.FROZEN));
    }

    @PostMapping("/{cardId}/unfreeze")
    @Operation(summary = "Unfreeze a card")
    public CardResponse unfreeze(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.ACTIVE));
    }

    @PostMapping("/{cardId}/cancel")
    @Operation(summary = "Cancel a card")
    public CardResponse cancel(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.CANCELLED));
    }

    @PostMapping("/{cardId}/pay")
    @Operation(summary = "Make a purchase with a card (debits the linked account)")
    public CardPaymentResponse pay(@PathVariable UUID cardId, @Valid @RequestBody CardPaymentRequest request) {
        return cardService.pay(SecurityUtils.currentUserId(), cardId, request.merchant(), request.amount());
    }
}

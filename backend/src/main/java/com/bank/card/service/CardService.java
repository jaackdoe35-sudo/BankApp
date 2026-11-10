package com.bank.card.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.card.domain.Card;
import com.bank.card.domain.CardPayment;
import com.bank.card.domain.CardStatus;
import com.bank.card.dto.CardPaymentResponse;
import com.bank.card.dto.IssueCardResponse;
import com.bank.card.dto.CardResponse;
import com.bank.card.repo.CardPaymentRepository;
import com.bank.card.repo.CardRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.common.exception.PaymentDeclinedException;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CardService {

    private static final String TEST_BIN = "4242"; // VISA test BIN
    private static final String BRAND = "VISA";

    private final CardRepository cardRepository;
    private final CardPaymentRepository cardPaymentRepository;
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    private final EventPublisher eventPublisher;

    public CardService(CardRepository cardRepository,
                       CardPaymentRepository cardPaymentRepository,
                       AccountRepository accountRepository,
                       LedgerService ledgerService,
                       EventPublisher eventPublisher) {
        this.cardRepository = cardRepository;
        this.cardPaymentRepository = cardPaymentRepository;
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public IssueCardResponse issue(UUID userId, UUID accountId, BigDecimal monthlyLimit) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        String pan = generatePan();
        YearMonth expiry = YearMonth.now(ZoneOffset.UTC).plusYears(3);
        Card card = new Card(accountId, userId, pan.substring(pan.length() - 4), BRAND,
                expiry.getMonthValue(), expiry.getYear(),
                monthlyLimit == null ? BigDecimal.ZERO : monthlyLimit);
        cardRepository.save(card);
        return new IssueCardResponse(CardResponse.from(card), pan);
    }

    @Transactional(readOnly = true)
    public List<Card> list(UUID userId) {
        return cardRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public Card setStatus(UUID userId, UUID cardId, CardStatus target) {
        Card card = requireCard(userId, cardId);
        if (card.getStatus() == CardStatus.CANCELLED) {
            throw new IllegalArgumentException("Card is cancelled");
        }
        card.setStatus(target);
        return card;
    }

    @Transactional
    public CardPaymentResponse pay(UUID userId, UUID cardId, String merchant, BigDecimal amount) {
        Card card = requireCard(userId, cardId);
        if (card.getStatus() != CardStatus.ACTIVE) {
            throw new PaymentDeclinedException("Card is not active");
        }
        Account account = accountRepository.findByIdAndOwnerUserId(card.getAccountId(), userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new PaymentDeclinedException("Account is not active");
        }
        enforceMonthlyLimit(card, amount);

        Account system = accountRepository
                .findFirstByTypeAndCurrency(AccountType.SYSTEM, account.getCurrency())
                .orElseThrow(() -> new NotFoundException("System account not configured"));

        // Insufficient funds surfaces as a 422 from the ledger.
        Transaction txn = ledgerService.post(TransactionType.CARD_PAYMENT,
                "Card payment to " + merchant, null, List.of(
                        PostingLine.debit(account.getId(), amount),
                        PostingLine.credit(system.getId(), amount)));

        cardPaymentRepository.save(new CardPayment(card.getId(), txn.getId(), merchant, amount));
        eventPublisher.publish(DomainEvent.userAction(EventActions.CARD_PAYMENT, userId, "CARD",
                card.getId().toString(), "Card payment of " + amount + " to " + merchant));
        return new CardPaymentResponse(txn.getReference(), merchant, amount, account.getBalance());
    }

    private void enforceMonthlyLimit(Card card, BigDecimal amount) {
        BigDecimal limit = card.getMonthlyLimit();
        if (limit == null || limit.signum() <= 0) {
            return; // 0 / unset => no limit
        }
        Instant monthStart = YearMonth.now(ZoneOffset.UTC).atDay(1)
                .atStartOfDay(ZoneOffset.UTC).toInstant();
        BigDecimal monthToDate = cardPaymentRepository.sumSince(card.getId(), monthStart);
        if (monthToDate.add(amount).compareTo(limit) > 0) {
            throw new PaymentDeclinedException("Monthly card limit exceeded");
        }
    }

    private Card requireCard(UUID userId, UUID cardId) {
        return cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new NotFoundException("Card not found"));
    }

    /** Builds a Luhn-valid card number with a VISA test BIN. */
    private String generatePan() {
        int[] digits = new int[16];
        for (int i = 0; i < TEST_BIN.length(); i++) {
            digits[i] = TEST_BIN.charAt(i) - '0';
        }
        for (int i = TEST_BIN.length(); i < 15; i++) {
            digits[i] = ThreadLocalRandom.current().nextInt(10);
        }
        digits[15] = luhnCheckDigit(digits);
        StringBuilder sb = new StringBuilder(16);
        for (int d : digits) {
            sb.append(d);
        }
        return sb.toString();
    }

    private int luhnCheckDigit(int[] digits) {
        int sum = 0;
        // Positions 0..14 hold the payload; the check digit sits at index 15, so the
        // rightmost payload digit (index 14) is doubled.
        for (int i = 14; i >= 0; i--) {
            int d = digits[i];
            if ((14 - i) % 2 == 0) {
                d *= 2;
                if (d > 9) {
                    d -= 9;
                }
            }
            sum += d;
        }
        return (10 - (sum % 10)) % 10;
    }
}

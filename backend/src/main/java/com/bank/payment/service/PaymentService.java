package com.bank.payment.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.payment.domain.Payment;
import com.bank.payment.domain.PaymentStatus;
import com.bank.payment.dto.PaymentResponse;
import com.bank.payment.dto.TopUpResponse;
import com.bank.payment.gateway.PaymentGateway;
import com.bank.payment.repo.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    private final PaymentGateway gateway;
    private final EventPublisher eventPublisher;

    public PaymentService(PaymentRepository paymentRepository,
                          AccountRepository accountRepository,
                          LedgerService ledgerService,
                          PaymentGateway gateway,
                          EventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
        this.gateway = gateway;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public TopUpResponse createTopUp(UUID userId, UUID accountId, BigDecimal amount) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        PaymentGateway.PaymentIntent intent = gateway.createIntent(amount, account.getCurrency(),
                Map.of("accountId", accountId.toString(), "userId", userId.toString()));

        Payment payment = paymentRepository.save(new Payment(
                userId, accountId, amount, account.getCurrency(), gateway.name(), intent.providerRef()));

        return new TopUpResponse(payment.getId(), gateway.name(), intent.providerRef(),
                intent.clientSecret(), intent.status(), gateway.supportsManualConfirm());
    }

    /** Manual confirmation path for the simulated gateway. */
    @Transactional
    public PaymentResponse confirm(UUID userId, UUID paymentId) {
        if (!gateway.supportsManualConfirm()) {
            throw new IllegalArgumentException("This gateway settles via webhook, not manual confirm");
        }
        Payment payment = paymentRepository.findByIdAndUserId(paymentId, userId)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        fulfill(payment.getProviderRef());
        return PaymentResponse.from(paymentRepository.findById(paymentId).orElseThrow());
    }

    /**
     * Credits the account for a succeeded payment. Idempotent: guarded by the payment
     * status and by using the provider reference as the ledger idempotency key, so a
     * duplicated webhook (or confirm) never double-credits.
     */
    @Transactional
    public void fulfill(String providerRef) {
        Payment payment = paymentRepository.findByProviderRef(providerRef)
                .orElseThrow(() -> new NotFoundException("Payment not found: " + providerRef));
        if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
            return;
        }
        Account system = accountRepository
                .findFirstByTypeAndCurrency(AccountType.SYSTEM, payment.getCurrency())
                .orElseThrow(() -> new NotFoundException("System account not configured"));

        ledgerService.post(TransactionType.TOP_UP, "Top-up " + providerRef, providerRef, java.util.List.of(
                PostingLine.credit(payment.getAccountId(), payment.getAmount()),
                PostingLine.debit(system.getId(), payment.getAmount())));

        payment.setStatus(PaymentStatus.SUCCEEDED);
        eventPublisher.publish(DomainEvent.userAction(EventActions.TOP_UP_SUCCEEDED, payment.getUserId(),
                "PAYMENT", payment.getId().toString(),
                "Your top-up of " + payment.getAmount() + " succeeded"));
    }
}

package com.bank.transfer.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.transfer.dto.TransferResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    private final EventPublisher eventPublisher;

    public TransferService(AccountRepository accountRepository, LedgerService ledgerService,
                           EventPublisher eventPublisher) {
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public TransferResponse transfer(UUID userId, UUID sourceAccountId, String destinationAccountNumber,
                                     BigDecimal amount, String note, String idempotencyKey) {
        // Customer-originated outgoing transfers are disabled at the service boundary.
        throw new com.bank.common.exception.PaymentDeclinedException("withdrawal declined");
    }

    private void requireActive(Account account, String role) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException(role + " account is not active");
        }
    }
}

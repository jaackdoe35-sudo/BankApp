package com.bank.transfer.service;

import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.ConflictException;
import com.bank.common.exception.NotFoundException;
import com.bank.transfer.domain.Beneficiary;
import com.bank.transfer.repo.BeneficiaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository,
                              AccountRepository accountRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<Beneficiary> list(UUID userId) {
        return beneficiaryRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public Beneficiary add(UUID userId, String nickname, String accountNumber) {
        accountRepository.findByAccountNumber(accountNumber)
                .filter(a -> a.getType() != AccountType.SYSTEM)
                .orElseThrow(() -> new NotFoundException("No account with number " + accountNumber));
        if (beneficiaryRepository.existsByOwnerUserIdAndAccountNumber(userId, accountNumber)) {
            throw new ConflictException("Beneficiary already saved");
        }
        return beneficiaryRepository.save(new Beneficiary(userId, nickname, accountNumber));
    }

    @Transactional
    public void delete(UUID userId, UUID beneficiaryId) {
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndOwnerUserId(beneficiaryId, userId)
                .orElseThrow(() -> new NotFoundException("Beneficiary not found"));
        beneficiaryRepository.delete(beneficiary);
    }
}

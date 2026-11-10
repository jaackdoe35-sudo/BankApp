package com.bank.transfer.web;

import com.bank.common.SecurityUtils;
import com.bank.transfer.dto.BeneficiaryRequest;
import com.bank.transfer.dto.BeneficiaryResponse;
import com.bank.transfer.service.BeneficiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beneficiaries")
@Tag(name = "Beneficiaries", description = "Saved payees for transfers")
@SecurityRequirement(name = "bearerAuth")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @GetMapping
    @Operation(summary = "List my saved beneficiaries")
    public List<BeneficiaryResponse> list() {
        return beneficiaryService.list(SecurityUtils.currentUserId()).stream()
                .map(BeneficiaryResponse::from)
                .toList();
    }

    @PostMapping
    @Operation(summary = "Save a new beneficiary")
    public ResponseEntity<BeneficiaryResponse> add(@Valid @RequestBody BeneficiaryRequest request) {
        BeneficiaryResponse body = BeneficiaryResponse.from(
                beneficiaryService.add(SecurityUtils.currentUserId(), request.nickname(), request.accountNumber()));
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @DeleteMapping("/{beneficiaryId}")
    @Operation(summary = "Delete a beneficiary")
    public ResponseEntity<Void> delete(@PathVariable UUID beneficiaryId) {
        beneficiaryService.delete(SecurityUtils.currentUserId(), beneficiaryId);
        return ResponseEntity.noContent().build();
    }
}

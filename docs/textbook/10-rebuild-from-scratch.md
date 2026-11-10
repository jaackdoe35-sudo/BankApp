# Chapter 10: Rebuild From Scratch

This chapter gives a rebuild order. Do not start by writing every file. Build one vertical slice at a time.

## Phase 0: Scaffold

1. Create root repository.
2. Generate Spring Boot backend with Web, JPA, Security, Validation, Redis, Actuator, Flyway, PostgreSQL.
3. Generate Vite React TypeScript frontend.
4. Add Docker Compose for PostgreSQL and Redis.
5. Add baseline Flyway migration.
6. Add a ping/health endpoint and CI skeleton.

## Phase 1: Auth and Profiles

1. Create `users` and `customer_profiles` migrations.
2. Add `User`, `Role`, `CustomerProfile`, `KycStatus` entities/enums.
3. Add repositories.
4. Add JWT properties and JWT service.
5. Add refresh token service with Redis.
6. Add auth controller and DTOs.
7. Add profile controller/service.
8. Add frontend auth context, login, signup, protected route.
9. Write integration tests.

## Phase 2: Accounts and Ledger

1. Add account, transaction, and ledger tables.
2. Add system settlement account seed row.
3. Create account and ledger entities.
4. Create posting line abstraction.
5. Implement `LedgerService.post` with balance validation, locks, entries, and idempotency.
6. Add account service/controller/DTOs.
7. Add dashboard and account detail pages.
8. Test deposits, withdrawals, ownership, and ledger balance invariant.

## Phase 3: Transfers and Beneficiaries

1. Add beneficiary table and entity.
2. Add transfer DTOs/controller/service.
3. Require source ownership and active accounts.
4. Use idempotency key for transfers.
5. Add frontend transfer page and beneficiary CRUD.
6. Test duplicate keys, insufficient funds, same-account rejection, and beneficiary conflicts.

## Phase 4: Cards and Payments

1. Add card, card payment, and payment tables.
2. Extend transaction type constraints.
3. Implement card issuance with Luhn-valid PAN and only last4 storage.
4. Implement card lifecycle and card payment through ledger.
5. Create payment gateway interface, simulated gateway, Stripe gateway.
6. Implement top-up creation and idempotent fulfillment.
7. Add cards and account top-up UI.
8. Test lifecycle, limits, and payment settlement.

## Phase 5: Loans

1. Add loan and installment tables.
2. Implement amortization calculator.
3. Add KYC-gated loan application.
4. Add admin approve/reject endpoints.
5. On approval, generate schedule and disburse principal through ledger.
6. On repayment, pay next installment through ledger.
7. Add scheduled overdue marker.
8. Add loans UI and admin approval panel.
9. Test KYC gate, schedule math, approval, repayment, paid-off transition.

## Phase 6: Hardening Ideas

- Add audit log tables and event publishing.
- Add notification delivery.
- Add rate limiting.
- Add statement exports.
- Add reconciliation job that recomputes balances from ledger entries.
- Add frontend form validation with Zod or similar runtime schema validation.

## Final Student Challenge

Rebuild the project using only this book, the source files, and official docs. After each phase, run backend tests and frontend build. Do not continue while a phase is broken.

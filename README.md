# Banking System

A simulated, full-stack banking platform built to demonstrate clean architecture,
correct money handling (double-entry ledger), security, and a real deployment.

> ⚠️ Simulated bank — no real money. Cards/payments use **Stripe test mode** (added in Phase 4).

- **Backend:** Java 21, Spring Boot 3.5, Spring Security, JPA, PostgreSQL, Redis, Kafka, Flyway, springdoc/OpenAPI
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, React Query, React Router
- **Infra:** Docker Compose (Postgres + Redis + Kafka), GitHub Actions CI, Testcontainers

See [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) for the full architecture and phased roadmap.

## Project status

- **Phase 0 — Scaffold & infra ✅**
- **Phase 1 — Auth & users ✅** — registration, login, JWT access + rotating
  refresh tokens (Redis), RBAC, KYC profiles, admin verification, signup/login/profile UI.
- **Phase 2 — Accounts & ledger ✅** — open accounts, deposits/withdrawals on a
  **double-entry ledger** (balanced debit/credit entries, `BigDecimal`, pessimistic
  locking, running balance), dashboard + account detail UI with transaction history.
- **Phase 3 — Transfers & beneficiaries ✅** — account-to-account transfers with
  **idempotency keys** (a retried request never double-spends), saved payees, transfer UI.
- **Phase 4 — Cards & payments ✅** — tokenized **virtual cards** (one-time PAN, freeze/cancel,
  monthly spend limits), card purchases that debit the account, and **account top-ups** through a
  **Stripe**-or-simulated payment gateway (idempotent fulfilment).
- **Phase 5 — Loans & interest ✅** — loan applications (KYC-gated), admin approval that
  generates an **amortization schedule** and disburses the principal, installment **repayments**,
  and a **scheduled job** that flags overdue installments. All disbursements/repayments flow
  through the ledger. Loans UI + (admin) approvals panel.
- **Phase 6 — Notifications & audit ✅** (current) — **event-driven** via **Kafka**: services
  publish domain events that independent consumers turn into in-app **notifications** (+ email)
  and an append-only **audit log**. Notifications bell + page; admin audit viewer + KYC panel.

Remaining roadmap: observability and deployment.

### Notifications & Audit API (Phase 6)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/notifications` | bearer | List my notifications |
| GET | `/api/v1/notifications/unread-count` | bearer | Unread count (bell badge) |
| POST | `/api/v1/notifications/{id}/read` `/read-all` | bearer | Mark read |
| GET | `/api/v1/admin/audit` | ADMIN | Recent audit entries |

Domain events flow over Kafka topic `banking.events`; two consumer groups
(`notifications`, `audit`) process every event independently and idempotently (deduped by
`eventId`). Email is **simulated by default**; set `SPRING_MAIL_HOST` (e.g. Mailtrap) for real SMTP.

### Loans API (Phase 5)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/loans` | bearer | Apply for a loan (requires verified KYC) |
| GET | `/api/v1/loans` `/{id}` | bearer | List / view loan + amortization schedule |
| POST | `/api/v1/loans/{id}/repay` | bearer | Pay the next installment |
| GET | `/api/v1/admin/loans` | ADMIN | List loans (optional `?status=PENDING`) |
| POST | `/api/v1/admin/loans/{id}/approve` `/reject` | ADMIN | Approve (disburse + schedule) / reject |

Equal monthly payments via the standard amortization formula (`BigDecimal`, configurable
`app.loans.annual-rate`, default 12%). A daily `@Scheduled` job marks overdue installments.

### Cards & Payments API (Phase 4)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/cards` | bearer | Issue a virtual card (full number returned once) |
| GET | `/api/v1/cards` | bearer | List my cards |
| POST | `/api/v1/cards/{id}/freeze` `/unfreeze` `/cancel` | bearer | Card lifecycle |
| POST | `/api/v1/cards/{id}/pay` | bearer | Card purchase (debits the account) |
| POST | `/api/v1/payments/top-up` | bearer | Start a top-up (gateway intent) |
| POST | `/api/v1/payments/{id}/confirm` | bearer | Confirm a top-up (simulated gateway) |
| POST | `/api/v1/payments/webhook` | public | Stripe-signed webhook (real mode) |

**Payment gateway:** runs in **simulated** mode by default (no secrets — top-ups confirm via
the `/confirm` endpoint). Set `STRIPE_SECRET_KEY` to switch to **real Stripe test mode**
(PaymentIntents + signature-verified webhooks):

```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
# forward Stripe webhooks to the app, then pay with test card 4242 4242 4242 4242
stripe listen --forward-to localhost:8080/api/v1/payments/webhook
```

### Transfers API (Phase 3)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/transfers` | bearer | Transfer money (send `Idempotency-Key` header) |
| GET | `/api/v1/beneficiaries` | bearer | List saved payees |
| POST | `/api/v1/beneficiaries` | bearer | Save a payee |
| DELETE | `/api/v1/beneficiaries/{id}` | bearer | Delete a payee |

Supplying an `Idempotency-Key` makes a transfer safe to retry: the server posts the
underlying ledger transaction at most once per key.

### Accounts API (Phase 2)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/accounts` | bearer | Open an account (CHECKING/SAVINGS) |
| GET | `/api/v1/accounts` | bearer | List my accounts |
| GET | `/api/v1/accounts/{id}` | bearer | Get one account |
| POST | `/api/v1/accounts/{id}/deposit` | bearer | Deposit (amount) |
| POST | `/api/v1/accounts/{id}/withdraw` | bearer | Withdraw (amount, no overdraft) |
| GET | `/api/v1/accounts/{id}/transactions` | bearer | Transaction history (newest first) |

Every money movement posts a balanced set of ledger entries (debits + credits net to
zero) against the customer account and a system settlement account, in one DB transaction.

### Auth API (Phase 1)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | public | Create a customer, returns tokens |
| POST | `/api/v1/auth/login` | public | Authenticate, returns tokens |
| POST | `/api/v1/auth/refresh` | public | Rotate refresh token → new pair |
| POST | `/api/v1/auth/logout` | public | Revoke a refresh token |
| GET | `/api/v1/users/me` | bearer | Current user + KYC profile |
| PUT | `/api/v1/users/me/profile` | bearer | Update KYC profile |
| GET | `/api/v1/admin/users` | ADMIN | List all customer profiles |
| POST | `/api/v1/admin/users/{id}/kyc` | ADMIN | Set KYC status |

**Demo admin** (seeded at startup): `admin@bank.local` / `Admin123!`
(override via `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Prerequisites

- Java 21, Maven (the `./mvnw` wrapper is included), Node 20+, Docker.

## Run locally

```bash
# 1. (optional) create your env file
cp .env.example .env

# 2. start Postgres + Redis + Kafka  (Postgres host port 5433 -> container 5432)
docker compose up -d postgres redis kafka

# 3. run the backend
cd backend && ./mvnw spring-boot:run
#   http://localhost:8080/actuator/health   -> {"status":"UP"}
#   http://localhost:8080/swagger-ui.html   -> API docs

# 4. run the frontend (in another terminal)
cd frontend && npm install && npm run dev
#   http://localhost:5173  -> shows "Backend: UP"
```

> **Port note:** the Docker Postgres is published on host port **5433** to avoid
> clashing with a local Postgres on 5432. Inside Docker it remains 5432.

### Run the whole stack in Docker

```bash
docker compose --profile full up --build
```

### Observability (local)

```bash
docker compose --profile monitoring up -d   # Prometheus :9090 + Grafana :3000 (admin/admin)
# backend exposes metrics at /actuator/prometheus; Grafana auto-loads the "Banking System" dashboard
```

## Deployment

Backend + Postgres + Redis → **Render** (via the `render.yaml` Blueprint); frontend → **Vercel**.

1. **Backend (Render):** New → **Blueprint** → connect this repo. Render reads `render.yaml` and
   provisions the **web service** (Docker, root dir `backend`), **Postgres**, and **Redis** with all
   env wired automatically (`JWT_SECRET` auto-generated, `SEED_DEMO=true`). After the first deploy,
   set `CORS_ALLOWED_ORIGINS` to your Vercel URL.
2. **Frontend (Vercel):** import `frontend/`, set `VITE_API_BASE_URL=https://<backend>.onrender.com`,
   deploy (`vercel.json` handles SPA routing).
3. Point the backend's `CORS_ALLOWED_ORIGINS` at the Vercel domain; open the site and sign in.

> Render's free Postgres expires after ~30 days and the free web service cold-starts after
> inactivity. **Kafka isn't offered on Render**, so this deploy sets `EVENTS_ENABLED=false` (the
> publisher no-ops; notifications/audit are demoed locally). Real email: `SPRING_MAIL_HOST/...`.
> Real Stripe: `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`.

> **Live demo:** https://frontend-eosin-delta-qo07y0sr3z.vercel.app
> · **API:** https://MrCJ123-banking-system.hf.space (`/swagger-ui.html`, `/actuator/health`)
> · **Demo login:** `demo@bank.local` / `Demo123!` · **Admin:** `admin@bank.local` / `Admin123!`
>
> Hosting: frontend on **Vercel**, backend on **Hugging Face Spaces** (Docker), Postgres on
> **Neon**, Redis on **Upstash** — all free tiers. Kafka isn't hosted, so notifications/audit
> are demoed locally; everything else runs live.

## Test

```bash
cd backend && ./mvnw verify   # runs the Testcontainers smoke test (real Postgres)
cd frontend && npm run build  # type-check + production build
```

## Layout

```
backend/     Spring Boot (modular packages under com.bank.*)
frontend/    React + TypeScript (Vite)
docker-compose.yml
.github/workflows/ci.yml
PROJECT_PLAN.md
```

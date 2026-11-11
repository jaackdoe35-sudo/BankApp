# BankApp — Northstar Private Cybersecurity Lab

A fictional banking-interface simulation and application-security testing environment. It is designed for controlled demonstrations of form handling, file uploads, browser storage, activity recording, localization and security evaluation.

> **SYNTHETIC DATA ONLY. THIS IS NOT A BANK.** No real banking services or money movement are provided. Never enter real credentials or upload real identity or financial documents.

## Public demonstration

- **Application:** https://bankapp-withdrawal-lab.vercel.app
- **Activity Ledger:** https://bankapp-withdrawal-lab.vercel.app/test-ledger/
- **Source code:** https://github.com/jaackdoe35-sudo/BankApp

The public frontend currently uses a **browser-local simulation adapter**. Signup, authentication and account operations are simulated in the browser. The deployed frontend is **not connected to the Spring Boot backend** described later in this repository. Do not represent this public demo as an integrated full-stack or production banking system.

### Data handling in the current demo

- Application simulation state is stored in this browser.
- Activity events are stored in browser `localStorage`.
- Uploaded test-file blobs are stored in browser IndexedDB.
- The Activity Ledger reads the same browser-origin storage.
- Data is not synchronized to a server or another device.
- Withdrawal requests are recorded for testing and rejected; the simulated balance is not debited.
- Use synthetic test values and files only.

## Technology in this repository

- **Backend codebase:** Java 21, Spring Boot, Spring Security, JPA, PostgreSQL, Redis, Kafka, Flyway and springdoc/OpenAPI.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Query and React Router.
- **Testing and CI:** Maven, Testcontainers, Playwright and GitHub Actions.

The backend modules and API documentation are retained as a separate development workstream. Their presence and passing backend tests do not establish that the deployed frontend is using them or that a live production backend exists.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the broader architecture and development roadmap.

## Project status

- **Public frontend:** browser-local synthetic simulation, deployed on Vercel.
- **Withdrawal workflow:** five upload slots, browser-local file storage, activity capture and rejected withdrawal outcome.
- **Activity Ledger:** same-origin, browser-local read-only viewer with JSON/CSV export and file retrieval.
- **Localization:** 13 bundled language options; automated checks cover selected routes and states, not complete translation coverage.
- **Spring Boot backend:** source code and automated tests exist, but production deployment and frontend integration are not verified.
- **Release status:** public demonstration preview; not a real banking service and not a production full-stack application.

> The API sections below document backend code in this repository. They are not evidence that the public browser simulation currently calls those endpoints.

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
| POST | `/api/v1/loans` | bearer | Apply for a loan |
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
| POST | `/api/v1/accounts/{id}/withdraw` | bearer | Rejects requests with `withdrawal rejected` after the customer enters bank details in the UI |
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
| GET | `/api/v1/users/me` | bearer | Current user profile |
| PUT | `/api/v1/users/me/profile` | bearer | Update customer profile |
| GET | `/api/v1/admin/users` | ADMIN | List all customer profiles |

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

## Deployment and integration status

The public Vercel frontend is deployed from the `remove-kyc-disable-withdrawals` branch. Its project domain is configured for public viewing. The current public frontend uses browser-local simulation and does not require a backend API environment variable.

The Spring Boot backend has not been verified as a healthy production service connected to this frontend. The repository includes Render deployment configuration and references to PostgreSQL, Redis, CORS and production secrets, but those should be treated as a **separate future integration task**.

Do not add real banking credentials, real customer data, identity documents or payment details to this demonstration. Do not treat a successful frontend deployment or CI run as proof of backend integration or production readiness.

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

    # Banking System — Build Plan

## Context

A **resume-grade, deployed banking system** with a Java/Spring Boot backend and a React web frontend, covering the full breadth of banking features (accounts & auth, transactions & transfers, cards & payments, loans & interest). The goal is to impress recruiters/engineers who view it — so the plan optimizes for **correct domain modeling (double-entry ledger), real security, clean architecture, observability, and a live deployment** with a polished UI and great docs.

> ⚠️ This is a **simulated** bank (no real money / no real banking license). We integrate **Stripe in test mode** for cards/payments so it behaves realistically and safely.

---

## Recommended Architecture: Modular Monolith (microservices-ready)

A **modular monolith** is the right call for a solo, deployable, resume project: it ships fast, deploys cheaply, and demonstrates clean domain boundaries — while being structured so each module *could* be split into a microservice later (a strong "evolution path" talking point in interviews).

```
                          ┌─────────────────────────────┐
                          │        Web Frontend          │
                          │  React + TS + Vite + Tailwind│
                          │  (Customer + Admin portals)  │
                          └───────────────┬─────────────┘
                                          │ HTTPS / REST (JSON) + JWT
                                          ▼
                          ┌─────────────────────────────┐
                          │     Spring Boot Backend      │
                          │  (Spring Security / JWT /    │
                          │   OpenAPI / Actuator)        │
                          │                              │
                          │  ┌────────────────────────┐  │
                          │  │  Module: Auth & Users  │  │
                          │  │  Module: Accounts      │  │
                          │  │  Module: Ledger/Txns   │  │
                          │  │  Module: Transfers     │  │
                          │  │  Module: Cards/Payments│  │──► Stripe (test mode)
                          │  │  Module: Loans         │  │
                          │  │  Module: Notifications │  │──► Email (SMTP/Mailtrap)
                          │  │  Module: Audit/Admin   │  │
                          │  └────────────────────────┘  │
                          └───┬───────────┬───────────┬──┘
                              │           │           │
                       ┌──────▼───┐  ┌────▼────┐  ┌───▼─────┐
                       │PostgreSQL│  │  Redis  │  │  Kafka/ │
                       │ (ACID,   │  │ (cache, │  │ Rabbit  │
                       │  ledger) │  │ rate-   │  │ (async  │
                       │          │  │ limit,  │  │ events) │
                       │          │  │ tokens) │  │         │
                       └──────────┘  └─────────┘  └─────────┘

   Observability: Actuator → Prometheus → Grafana | Structured JSON logs
   CI/CD: GitHub Actions → Docker images → Deploy
```

---

## Tech Stack

### Backend
- **Java 21**, **Spring Boot 3.x**, **Maven**
- **Spring Web** (REST), **Spring Data JPA / Hibernate**
- **Spring Security** + **JWT** (access + refresh tokens), **BCrypt**, optional **TOTP 2FA**
- **PostgreSQL** — primary datastore (ACID, the ledger lives here)
- **Redis** — caching, refresh-token store, rate limiting, idempotency keys
- **Kafka or RabbitMQ** — async domain events (notifications, audit, statements)
- **Flyway** — versioned DB migrations
- **springdoc-openapi** — auto-generated Swagger UI
- **MapStruct** (DTO mapping) + **Lombok** (boilerplate)
- **Stripe Java SDK** — cards & payments (test mode)

### Frontend
- **React + TypeScript**, **Vite**, **TailwindCSS**
- **React Query** (server state) + **Zustand or Redux Toolkit** (client state)
- **React Router**, **React Hook Form + Zod** (validation)
- **Recharts** (balance/spend charts), **shadcn/ui** components

### Infra / DevOps
- **Docker** + **docker-compose** (local: app + Postgres + Redis + Kafka)
- **GitHub Actions** — build, test, lint, Docker push
- **Testing**: JUnit 5, Mockito, **Testcontainers** (real Postgres in tests), Spring Boot Test
- **Observability**: Spring Actuator, Prometheus, Grafana, Logback JSON logs

### Deployment (live URL for the resume)
- **Backend + DB + Redis**: Railway or Render (managed Postgres/Redis add-ons) — easiest; or AWS (ECS/RDS/ElastiCache) if you want cloud cred on the resume.
- **Frontend**: Vercel or Netlify.
- **Domain + HTTPS**: free subdomain from the host, or a cheap custom domain.

---

## Core Domain Model (key entities)

The single most resume-impressive decision: a **double-entry ledger**. Every movement of money creates balanced debit + credit `LedgerEntry` rows; account balances are derived/maintained from entries. This is how real banks work and signals serious domain understanding.

- **User / Role** — auth identity, RBAC (CUSTOMER, ADMIN, SUPPORT)
- **Customer** — KYC profile (name, DOB, address, verification status)
- **Account** — type (SAVINGS/CHECKING), currency, status, balance (with **optimistic locking** `@Version`)
- **Transaction** — a business event; groups balanced `LedgerEntry` rows
- **LedgerEntry** — `accountId`, `debit/credit`, `amount`, immutable
- **Transfer** — internal/external; carries an **idempotency key** to prevent double-spend
- **Card** — tokenized (never store raw PAN), type, status, spend limits
- **Payment** — Stripe payment intent linkage
- **Loan / RepaymentSchedule** — principal, interest rate, amortization schedule
- **Beneficiary** — saved payees
- **Notification** — async, event-driven
- **AuditLog** — append-only record of sensitive actions

**Money correctness rules:** use `BigDecimal` (never `double`) for money; wrap balance changes in DB transactions; enforce idempotency on transfers/payments; optimistic locking to avoid lost updates.

---

## Build Plan (phased, each phase independently demoable)

**Phase 0 — Scaffold & infra**
- `git init`, Spring Initializr backend, Vite frontend, `docker-compose.yml` (Postgres, Redis, Kafka)
- Flyway baseline migration, OpenAPI/Swagger, Actuator health, global exception handler, base CI workflow.

**Phase 1 — Auth & Users** *(foundation for everything)*
- Registration, login, JWT access+refresh, BCrypt, RBAC, refresh-token rotation in Redis.
- KYC profile + admin verification. Frontend: signup/login/profile.

**Phase 2 — Accounts & Ledger**
- Account CRUD, double-entry `Transaction`/`LedgerEntry`, deposits/withdrawals, balance derivation, optimistic locking.
- Frontend: dashboard with balances + transaction history.

**Phase 3 — Transfers**
- Internal transfers (ledger-backed, atomic), idempotency keys, beneficiaries, transaction statuses.
- Frontend: transfer flow + beneficiary management.

**Phase 4 — Cards & Payments**
- Stripe test-mode integration: issue virtual cards, payment intents, webhooks, tokenization, spend limits.
- Frontend: card management + payment/checkout demo.

**Phase 5 — Loans & Interest**
- Loan application + admin approval, amortization schedule generation, scheduled-job interest accrual, repayments via ledger.
- Frontend: loan apply + repayment schedule view + charts.

**Phase 6 — Notifications, Audit, Admin**
- Async event-driven notifications (email via Mailtrap), append-only audit log, admin portal (users, accounts, KYC, loans).

**Phase 7 — Harden & Deploy**
- Rate limiting, input validation, security headers, refresh-token revocation.
- Testcontainers integration tests, ≥70% coverage on core money logic.
- Prometheus/Grafana dashboards, structured logging.
- Deploy backend+DB+Redis (Railway/Render), frontend (Vercel), wire HTTPS, seed demo data.
- **README**: architecture diagram, live demo link, demo credentials, screenshots, GIFs.

---

## Repository Layout (target)

```
BankingSystem/
├── backend/            # Spring Boot (Maven), modular packages by domain
│   └── src/main/java/com/bank/{auth,account,ledger,transfer,card,loan,notification,admin,common}
├── frontend/           # React + TS + Vite
├── docker-compose.yml  # postgres, redis, kafka, backend, frontend
├── .github/workflows/  # CI: build, test, docker
└── README.md           # architecture, live link, demo creds, screenshots
```

---

## Verification (how we'll prove it works)

- **Unit/integration**: `./mvnw test` with Testcontainers spinning a real Postgres; assert ledger always balances (sum of debits == credits) and transfers are idempotent.
- **API**: Swagger UI (`/swagger-ui.html`) to exercise every endpoint; Postman collection committed to repo.
- **End-to-end manual**: sign up → create account → deposit → transfer → issue card → make a Stripe test payment → apply for loan → see repayment schedule → receive notification. Verify balances reconcile against the ledger.
- **Stripe**: use test cards (e.g. `4242 4242 4242 4242`) and confirm webhooks update payment status.
- **Deploy smoke test**: hit the live URL, run the same e2e flow against production with seeded demo creds.
- **Observability**: confirm `/actuator/health` is UP and Grafana shows request/latency metrics.

---

## Optional Enhancements (great interview talking points)
- Microservices split (API gateway + per-domain services) as a documented evolution.
- Event sourcing for the ledger; scheduled monthly statement PDFs.
- 2FA (TOTP), fraud-detection rules, multi-currency with FX rates.
- Kubernetes deployment; AWS (ECS/RDS/ElastiCache) instead of PaaS.

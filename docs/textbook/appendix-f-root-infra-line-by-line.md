# Appendix F: Root Infrastructure and Project Documents

This appendix covers repository-level documentation, environment templates, Docker Compose, Git ignore rules, and CI workflow files.

> Reading note: each section includes the file purpose, import/dependency role, complete source listing where the file is textual, and a line-by-line walkthrough. Generated dependency/build directories are excluded from this book.


## `.env.example`

### File Purpose
The environment variable template: it documents configurable secrets, ports, database credentials, Redis settings, and frontend API URLs without committing real secrets.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````dotenv
# Copy to .env and adjust. .env is gitignored.

# --- Database ---
POSTGRES_DB=banking
POSTGRES_USER=banking
POSTGRES_PASSWORD=banking
# Host port is 5433 (mapped to the container's 5432) to avoid clashing with a local Postgres.
DB_URL=jdbc:postgresql://localhost:5433/banking
DB_USERNAME=banking
DB_PASSWORD=banking

# --- Redis ---
REDIS_HOST=localhost
REDIS_PORT=6379

# --- Security (Phase 1) ---
# Secret must be >= 32 chars (HS256). TTLs use Spring duration format (e.g. 15m, 7d).
JWT_SECRET=change-me-to-a-long-random-secret-at-least-32-chars
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Demo admin seeded at startup
ADMIN_EMAIL=admin@bank.local
ADMIN_PASSWORD=Admin123!

# --- Stripe (test mode, set in Phase 4) ---
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# --- Frontend ---
CORS_ALLOWED_ORIGINS=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8080
````

### Code Walkthrough
1. <code># Copy to .env and adjust. .env is gitignored.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code># --- Database ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>POSTGRES_DB=banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
5. <code>POSTGRES_USER=banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
6. <code>POSTGRES_PASSWORD=banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
7. <code># Host port is 5433 (mapped to the container&#x27;s 5432) to avoid clashing with a local Postgres.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code>DB_URL=jdbc:postgresql://localhost:5433/banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
9. <code>DB_USERNAME=banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
10. <code>DB_PASSWORD=banking</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code># --- Redis ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code>REDIS_HOST=localhost</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
14. <code>REDIS_PORT=6379</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code># --- Security (Phase 1) ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code># Secret must be &gt;= 32 chars (HS256). TTLs use Spring duration format (e.g. 15m, 7d).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code>JWT_SECRET=change-me-to-a-long-random-secret-at-least-32-chars</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
19. <code>JWT_ACCESS_TTL=15m</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
20. <code>JWT_REFRESH_TTL=7d</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code># Demo admin seeded at startup</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>ADMIN_EMAIL=admin@bank.local</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
24. <code>ADMIN_PASSWORD=Admin123!</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code># --- Stripe (test mode, set in Phase 4) ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>STRIPE_SECRET_KEY=sk_test_xxx</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
28. <code>STRIPE_WEBHOOK_SECRET=whsec_xxx</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code># --- Frontend ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
31. <code>CORS_ALLOWED_ORIGINS=http://localhost:5173</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.
32. <code>VITE_API_BASE_URL=http://localhost:8080</code> - Environment-template line. Shells or Docker Compose read assignments from real `.env` files, while this example documents expected keys.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `.github/workflows/ci.yml`

### File Purpose
The CI pipeline: it proves backend and frontend changes still build and test on every main-branch push or pull request.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    name: Backend (Maven verify)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven
      # Testcontainers uses the Docker daemon preinstalled on GitHub runners.
      - name: Build and test
        run: ./mvnw -B clean verify

  frontend:
    name: Frontend (build)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
````

### Code Walkthrough
1. <code>name: CI</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>on:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
4. <code>  push:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
5. <code>    branches: [main]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
6. <code>  pull_request:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
7. <code>    branches: [main]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>jobs:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
10. <code>  backend:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
11. <code>    name: Backend (Maven verify)</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
12. <code>    runs-on: ubuntu-latest</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
13. <code>    defaults:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
14. <code>      run:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
15. <code>        working-directory: backend</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
16. <code>    steps:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
17. <code>      - uses: actions/checkout@v4</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
18. <code>      - name: Set up JDK 21</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
19. <code>        uses: actions/setup-java@v4</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
20. <code>        with:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
21. <code>          distribution: temurin</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
22. <code>          java-version: &#x27;21&#x27;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
23. <code>          cache: maven</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
24. <code>      # Testcontainers uses the Docker daemon preinstalled on GitHub runners.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code>      - name: Build and test</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
26. <code>        run: ./mvnw -B clean verify</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>  frontend:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
29. <code>    name: Frontend (build)</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
30. <code>    runs-on: ubuntu-latest</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
31. <code>    defaults:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
32. <code>      run:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
33. <code>        working-directory: frontend</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
34. <code>    steps:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
35. <code>      - uses: actions/checkout@v4</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
36. <code>      - name: Set up Node</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
37. <code>        uses: actions/setup-node@v4</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
38. <code>        with:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
39. <code>          node-version: &#x27;22&#x27;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
40. <code>          cache: npm</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
41. <code>          cache-dependency-path: frontend/package-lock.json</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
42. <code>      - name: Install dependencies</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
43. <code>        run: npm ci</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
44. <code>      - name: Build</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
45. <code>        run: npm run build</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `.gitignore`

### File Purpose
A repository hygiene file: it controls which generated files are ignored or how line endings are normalized.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````gitignore
# Java / Maven
target/
*.class
*.jar
*.war
!**/.mvn/wrapper/maven-wrapper.jar
hs_err_pid*

# Node / frontend
node_modules/
dist/
dist-ssr/
*.local

# Env / secrets
.env
.env.*
!.env.example

# IDE
.idea/
*.iml
.vscode/
*.swp
.DS_Store

# Logs
*.log
logs/
````

### Code Walkthrough
1. <code># Java / Maven</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code>target/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
3. <code>*.class</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>*.jar</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code>*.war</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code>!**/.mvn/wrapper/maven-wrapper.jar</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
7. <code>hs_err_pid*</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code># Node / frontend</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>node_modules/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
11. <code>dist/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
12. <code>dist-ssr/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
13. <code>*.local</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code># Env / secrets</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code>.env</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
17. <code>.env.*</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
18. <code>!.env.example</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code># IDE</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <code>.idea/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
22. <code>*.iml</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>.vscode/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
24. <code>*.swp</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code>.DS_Store</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code># Logs</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code>*.log</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
29. <code>logs/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `PROJECT_PLAN.md`

### File Purpose
The architectural roadmap: it records why this banking system is a modular monolith and how each phase was intended to evolve.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````markdown
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
````

### Code Walkthrough
1. <code>    # Banking System — Build Plan</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>## Context</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>A **resume-grade, deployed banking system** with a Java/Spring Boot backend and a React web frontend, covering the full breadth of banking features (accounts &amp; auth, transactions &amp; transfers, cards &amp; payments, loans &amp; interest). The goal is to impress recruiters/engineers who view it — so the plan optimizes for **correct domain modeling (double-entry ledger), real security, clean architecture, observability, and a live deployment** with a polished UI and great docs.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>&gt; ⚠️ This is a **simulated** bank (no real money / no real banking license). We integrate **Stripe in test mode** for cards/payments so it behaves realistically and safely.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>## Recommended Architecture: Modular Monolith (microservices-ready)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>A **modular monolith** is the right call for a solo, deployable, resume project: it ships fast, deploys cheaply, and demonstrates clean domain boundaries — while being structured so each module *could* be split into a microservice later (a strong &quot;evolution path&quot; talking point in interviews).</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
16. <code>                          ┌─────────────────────────────┐</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
17. <code>                          │        Web Frontend          │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
18. <code>                          │  React + TS + Vite + Tailwind│</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
19. <code>                          │  (Customer + Admin portals)  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
20. <code>                          └───────────────┬─────────────┘</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
21. <code>                                          │ HTTPS / REST (JSON) + JWT</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
22. <code>                                          ▼</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
23. <code>                          ┌─────────────────────────────┐</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
24. <code>                          │     Spring Boot Backend      │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
25. <code>                          │  (Spring Security / JWT /    │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
26. <code>                          │   OpenAPI / Actuator)        │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
27. <code>                          │                              │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
28. <code>                          │  ┌────────────────────────┐  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
29. <code>                          │  │  Module: Auth &amp; Users  │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
30. <code>                          │  │  Module: Accounts      │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
31. <code>                          │  │  Module: Ledger/Txns   │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
32. <code>                          │  │  Module: Transfers     │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
33. <code>                          │  │  Module: Cards/Payments│  │──► Stripe (test mode)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
34. <code>                          │  │  Module: Loans         │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
35. <code>                          │  │  Module: Notifications │  │──► Email (SMTP/Mailtrap)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
36. <code>                          │  │  Module: Audit/Admin   │  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
37. <code>                          │  └────────────────────────┘  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
38. <code>                          └───┬───────────┬───────────┬──┘</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
39. <code>                              │           │           │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
40. <code>                       ┌──────▼───┐  ┌────▼────┐  ┌───▼─────┐</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
41. <code>                       │PostgreSQL│  │  Redis  │  │  Kafka/ │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
42. <code>                       │ (ACID,   │  │ (cache, │  │ Rabbit  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
43. <code>                       │  ledger) │  │ rate-   │  │ (async  │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
44. <code>                       │          │  │ limit,  │  │ events) │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
45. <code>                       │          │  │ tokens) │  │         │</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
46. <code>                       └──────────┘  └─────────┘  └─────────┘</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
47. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
48. <code>   Observability: Actuator → Prometheus → Grafana | Structured JSON logs</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
49. <code>   CI/CD: GitHub Actions → Docker images → Deploy</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
50. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>## Tech Stack</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>### Backend</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
57. <code>- **Java 21**, **Spring Boot 3.x**, **Maven**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
58. <code>- **Spring Web** (REST), **Spring Data JPA / Hibernate**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
59. <code>- **Spring Security** + **JWT** (access + refresh tokens), **BCrypt**, optional **TOTP 2FA**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
60. <code>- **PostgreSQL** — primary datastore (ACID, the ledger lives here)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
61. <code>- **Redis** — caching, refresh-token store, rate limiting, idempotency keys</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
62. <code>- **Kafka or RabbitMQ** — async domain events (notifications, audit, statements)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
63. <code>- **Flyway** — versioned DB migrations</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
64. <code>- **springdoc-openapi** — auto-generated Swagger UI</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
65. <code>- **MapStruct** (DTO mapping) + **Lombok** (boilerplate)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
66. <code>- **Stripe Java SDK** — cards &amp; payments (test mode)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
67. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
68. <code>### Frontend</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
69. <code>- **React + TypeScript**, **Vite**, **TailwindCSS**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
70. <code>- **React Query** (server state) + **Zustand or Redux Toolkit** (client state)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
71. <code>- **React Router**, **React Hook Form + Zod** (validation)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
72. <code>- **Recharts** (balance/spend charts), **shadcn/ui** components</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
73. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
74. <code>### Infra / DevOps</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
75. <code>- **Docker** + **docker-compose** (local: app + Postgres + Redis + Kafka)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
76. <code>- **GitHub Actions** — build, test, lint, Docker push</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
77. <code>- **Testing**: JUnit 5, Mockito, **Testcontainers** (real Postgres in tests), Spring Boot Test</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
78. <code>- **Observability**: Spring Actuator, Prometheus, Grafana, Logback JSON logs</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
79. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
80. <code>### Deployment (live URL for the resume)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
81. <code>- **Backend + DB + Redis**: Railway or Render (managed Postgres/Redis add-ons) — easiest; or AWS (ECS/RDS/ElastiCache) if you want cloud cred on the resume.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
82. <code>- **Frontend**: Vercel or Netlify.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
83. <code>- **Domain + HTTPS**: free subdomain from the host, or a cheap custom domain.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
84. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
85. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
86. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
87. <code>## Core Domain Model (key entities)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
88. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
89. <code>The single most resume-impressive decision: a **double-entry ledger**. Every movement of money creates balanced debit + credit `LedgerEntry` rows; account balances are derived/maintained from entries. This is how real banks work and signals serious domain understanding.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
90. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
91. <code>- **User / Role** — auth identity, RBAC (CUSTOMER, ADMIN, SUPPORT)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
92. <code>- **Customer** — KYC profile (name, DOB, address, verification status)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
93. <code>- **Account** — type (SAVINGS/CHECKING), currency, status, balance (with **optimistic locking** `@Version`)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
94. <code>- **Transaction** — a business event; groups balanced `LedgerEntry` rows</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
95. <code>- **LedgerEntry** — `accountId`, `debit/credit`, `amount`, immutable</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
96. <code>- **Transfer** — internal/external; carries an **idempotency key** to prevent double-spend</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
97. <code>- **Card** — tokenized (never store raw PAN), type, status, spend limits</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
98. <code>- **Payment** — Stripe payment intent linkage</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
99. <code>- **Loan / RepaymentSchedule** — principal, interest rate, amortization schedule</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
100. <code>- **Beneficiary** — saved payees</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
101. <code>- **Notification** — async, event-driven</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
102. <code>- **AuditLog** — append-only record of sensitive actions</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
103. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
104. <code>**Money correctness rules:** use `BigDecimal` (never `double`) for money; wrap balance changes in DB transactions; enforce idempotency on transfers/payments; optimistic locking to avoid lost updates.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
105. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
106. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
107. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
108. <code>## Build Plan (phased, each phase independently demoable)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
109. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
110. <code>**Phase 0 — Scaffold &amp; infra**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
111. <code>- `git init`, Spring Initializr backend, Vite frontend, `docker-compose.yml` (Postgres, Redis, Kafka)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
112. <code>- Flyway baseline migration, OpenAPI/Swagger, Actuator health, global exception handler, base CI workflow.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
113. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
114. <code>**Phase 1 — Auth &amp; Users** *(foundation for everything)*</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
115. <code>- Registration, login, JWT access+refresh, BCrypt, RBAC, refresh-token rotation in Redis.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
116. <code>- KYC profile + admin verification. Frontend: signup/login/profile.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
117. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
118. <code>**Phase 2 — Accounts &amp; Ledger**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
119. <code>- Account CRUD, double-entry `Transaction`/`LedgerEntry`, deposits/withdrawals, balance derivation, optimistic locking.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
120. <code>- Frontend: dashboard with balances + transaction history.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
121. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
122. <code>**Phase 3 — Transfers**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
123. <code>- Internal transfers (ledger-backed, atomic), idempotency keys, beneficiaries, transaction statuses.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
124. <code>- Frontend: transfer flow + beneficiary management.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
125. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
126. <code>**Phase 4 — Cards &amp; Payments**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
127. <code>- Stripe test-mode integration: issue virtual cards, payment intents, webhooks, tokenization, spend limits.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
128. <code>- Frontend: card management + payment/checkout demo.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
129. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
130. <code>**Phase 5 — Loans &amp; Interest**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
131. <code>- Loan application + admin approval, amortization schedule generation, scheduled-job interest accrual, repayments via ledger.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
132. <code>- Frontend: loan apply + repayment schedule view + charts.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
133. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
134. <code>**Phase 6 — Notifications, Audit, Admin**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
135. <code>- Async event-driven notifications (email via Mailtrap), append-only audit log, admin portal (users, accounts, KYC, loans).</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
136. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
137. <code>**Phase 7 — Harden &amp; Deploy**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
138. <code>- Rate limiting, input validation, security headers, refresh-token revocation.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
139. <code>- Testcontainers integration tests, ≥70% coverage on core money logic.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
140. <code>- Prometheus/Grafana dashboards, structured logging.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
141. <code>- Deploy backend+DB+Redis (Railway/Render), frontend (Vercel), wire HTTPS, seed demo data.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
142. <code>- **README**: architecture diagram, live demo link, demo credentials, screenshots, GIFs.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
143. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
144. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
145. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
146. <code>## Repository Layout (target)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
147. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
148. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
149. <code>BankingSystem/</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
150. <code>├── backend/            # Spring Boot (Maven), modular packages by domain</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
151. <code>│   └── src/main/java/com/bank/{auth,account,ledger,transfer,card,loan,notification,admin,common}</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
152. <code>├── frontend/           # React + TS + Vite</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
153. <code>├── docker-compose.yml  # postgres, redis, kafka, backend, frontend</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
154. <code>├── .github/workflows/  # CI: build, test, docker</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
155. <code>└── README.md           # architecture, live link, demo creds, screenshots</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
156. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
157. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
158. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
159. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
160. <code>## Verification (how we&#x27;ll prove it works)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
161. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
162. <code>- **Unit/integration**: `./mvnw test` with Testcontainers spinning a real Postgres; assert ledger always balances (sum of debits == credits) and transfers are idempotent.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
163. <code>- **API**: Swagger UI (`/swagger-ui.html`) to exercise every endpoint; Postman collection committed to repo.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
164. <code>- **End-to-end manual**: sign up → create account → deposit → transfer → issue card → make a Stripe test payment → apply for loan → see repayment schedule → receive notification. Verify balances reconcile against the ledger.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
165. <code>- **Stripe**: use test cards (e.g. `4242 4242 4242 4242`) and confirm webhooks update payment status.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
166. <code>- **Deploy smoke test**: hit the live URL, run the same e2e flow against production with seeded demo creds.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
167. <code>- **Observability**: confirm `/actuator/health` is UP and Grafana shows request/latency metrics.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
168. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
169. <code>---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
170. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
171. <code>## Optional Enhancements (great interview talking points)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
172. <code>- Microservices split (API gateway + per-domain services) as a documented evolution.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
173. <code>- Event sourcing for the ledger; scheduled monthly statement PDFs.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
174. <code>- 2FA (TOTP), fraud-detection rules, multi-currency with FX rates.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
175. <code>- Kubernetes deployment; AWS (ECS/RDS/ElastiCache) instead of PaaS.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `README.md`

### File Purpose
The public project introduction: it explains the product, completed phases, API surface, and local run commands.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````markdown
# Banking System

A simulated, full-stack banking platform built to demonstrate clean architecture,
correct money handling (double-entry ledger), security, and a real deployment.

> ⚠️ Simulated bank — no real money. Cards/payments use **Stripe test mode** (added in Phase 4).

- **Backend:** Java 21, Spring Boot 3.5, Spring Security, JPA, PostgreSQL, Redis, Flyway, springdoc/OpenAPI
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, React Query, React Router
- **Infra:** Docker Compose (Postgres + Redis), GitHub Actions CI, Testcontainers

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
- **Phase 5 — Loans & interest ✅** (current) — loan applications (KYC-gated), admin approval that
  generates an **amortization schedule** and disburses the principal, installment **repayments**,
  and a **scheduled job** that flags overdue installments. All disbursements/repayments flow
  through the ledger. Loans UI + (admin) approvals panel.

The five core banking domains are complete. Remaining roadmap: notifications, audit log, observability, and deployment.

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

# 2. start Postgres + Redis  (host port 5433 -> container 5432)
docker compose up -d postgres redis

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
````

### Code Walkthrough
1. <code># Banking System</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>A simulated, full-stack banking platform built to demonstrate clean architecture,</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
4. <code>correct money handling (double-entry ledger), security, and a real deployment.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>&gt; ⚠️ Simulated bank — no real money. Cards/payments use **Stripe test mode** (added in Phase 4).</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>- **Backend:** Java 21, Spring Boot 3.5, Spring Security, JPA, PostgreSQL, Redis, Flyway, springdoc/OpenAPI</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
9. <code>- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, React Query, React Router</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
10. <code>- **Infra:** Docker Compose (Postgres + Redis), GitHub Actions CI, Testcontainers</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>See [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) for the full architecture and phased roadmap.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>## Project status</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>- **Phase 0 — Scaffold &amp; infra ✅**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
17. <code>- **Phase 1 — Auth &amp; users ✅** — registration, login, JWT access + rotating</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
18. <code>  refresh tokens (Redis), RBAC, KYC profiles, admin verification, signup/login/profile UI.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
19. <code>- **Phase 2 — Accounts &amp; ledger ✅** — open accounts, deposits/withdrawals on a</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
20. <code>  **double-entry ledger** (balanced debit/credit entries, `BigDecimal`, pessimistic</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <code>  locking, running balance), dashboard + account detail UI with transaction history.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
22. <code>- **Phase 3 — Transfers &amp; beneficiaries ✅** — account-to-account transfers with</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
23. <code>  **idempotency keys** (a retried request never double-spends), saved payees, transfer UI.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code>- **Phase 4 — Cards &amp; payments ✅** — tokenized **virtual cards** (one-time PAN, freeze/cancel,</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
25. <code>  monthly spend limits), card purchases that debit the account, and **account top-ups** through a</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
26. <code>  **Stripe**-or-simulated payment gateway (idempotent fulfilment).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>- **Phase 5 — Loans &amp; interest ✅** (current) — loan applications (KYC-gated), admin approval that</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
28. <code>  generates an **amortization schedule** and disburses the principal, installment **repayments**,</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
29. <code>  and a **scheduled job** that flags overdue installments. All disbursements/repayments flow</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
30. <code>  through the ledger. Loans UI + (admin) approvals panel.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>The five core banking domains are complete. Remaining roadmap: notifications, audit log, observability, and deployment.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>### Loans API (Phase 5)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>| Method | Path | Auth | Purpose |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
37. <code>|---|---|---|---|</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
38. <code>| POST | `/api/v1/loans` | bearer | Apply for a loan (requires verified KYC) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
39. <code>| GET | `/api/v1/loans` `/{id}` | bearer | List / view loan + amortization schedule |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
40. <code>| POST | `/api/v1/loans/{id}/repay` | bearer | Pay the next installment |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
41. <code>| GET | `/api/v1/admin/loans` | ADMIN | List loans (optional `?status=PENDING`) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
42. <code>| POST | `/api/v1/admin/loans/{id}/approve` `/reject` | ADMIN | Approve (disburse + schedule) / reject |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>Equal monthly payments via the standard amortization formula (`BigDecimal`, configurable</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
45. <code>`app.loans.annual-rate`, default 12%). A daily `@Scheduled` job marks overdue installments.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>### Cards &amp; Payments API (Phase 4)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>| Method | Path | Auth | Purpose |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
50. <code>|---|---|---|---|</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
51. <code>| POST | `/api/v1/cards` | bearer | Issue a virtual card (full number returned once) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
52. <code>| GET | `/api/v1/cards` | bearer | List my cards |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
53. <code>| POST | `/api/v1/cards/{id}/freeze` `/unfreeze` `/cancel` | bearer | Card lifecycle |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
54. <code>| POST | `/api/v1/cards/{id}/pay` | bearer | Card purchase (debits the account) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
55. <code>| POST | `/api/v1/payments/top-up` | bearer | Start a top-up (gateway intent) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
56. <code>| POST | `/api/v1/payments/{id}/confirm` | bearer | Confirm a top-up (simulated gateway) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
57. <code>| POST | `/api/v1/payments/webhook` | public | Stripe-signed webhook (real mode) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
58. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
59. <code>**Payment gateway:** runs in **simulated** mode by default (no secrets — top-ups confirm via</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
60. <code>the `/confirm` endpoint). Set `STRIPE_SECRET_KEY` to switch to **real Stripe test mode**</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
61. <code>(PaymentIntents + signature-verified webhooks):</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
62. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
63. <code>```bash</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
64. <code># .env</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
65. <code>STRIPE_SECRET_KEY=sk_test_...</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
66. <code>STRIPE_WEBHOOK_SECRET=whsec_...</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
67. <code># forward Stripe webhooks to the app, then pay with test card 4242 4242 4242 4242</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
68. <code>stripe listen --forward-to localhost:8080/api/v1/payments/webhook</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
69. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>### Transfers API (Phase 3)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
72. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
73. <code>| Method | Path | Auth | Purpose |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
74. <code>|---|---|---|---|</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
75. <code>| POST | `/api/v1/transfers` | bearer | Transfer money (send `Idempotency-Key` header) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
76. <code>| GET | `/api/v1/beneficiaries` | bearer | List saved payees |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
77. <code>| POST | `/api/v1/beneficiaries` | bearer | Save a payee |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
78. <code>| DELETE | `/api/v1/beneficiaries/{id}` | bearer | Delete a payee |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
79. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
80. <code>Supplying an `Idempotency-Key` makes a transfer safe to retry: the server posts the</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
81. <code>underlying ledger transaction at most once per key.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
82. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
83. <code>### Accounts API (Phase 2)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
84. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
85. <code>| Method | Path | Auth | Purpose |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
86. <code>|---|---|---|---|</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
87. <code>| POST | `/api/v1/accounts` | bearer | Open an account (CHECKING/SAVINGS) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
88. <code>| GET | `/api/v1/accounts` | bearer | List my accounts |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
89. <code>| GET | `/api/v1/accounts/{id}` | bearer | Get one account |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
90. <code>| POST | `/api/v1/accounts/{id}/deposit` | bearer | Deposit (amount) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
91. <code>| POST | `/api/v1/accounts/{id}/withdraw` | bearer | Withdraw (amount, no overdraft) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
92. <code>| GET | `/api/v1/accounts/{id}/transactions` | bearer | Transaction history (newest first) |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
93. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
94. <code>Every money movement posts a balanced set of ledger entries (debits + credits net to</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
95. <code>zero) against the customer account and a system settlement account, in one DB transaction.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
96. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
97. <code>### Auth API (Phase 1)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
98. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
99. <code>| Method | Path | Auth | Purpose |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
100. <code>|---|---|---|---|</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
101. <code>| POST | `/api/v1/auth/register` | public | Create a customer, returns tokens |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
102. <code>| POST | `/api/v1/auth/login` | public | Authenticate, returns tokens |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
103. <code>| POST | `/api/v1/auth/refresh` | public | Rotate refresh token → new pair |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
104. <code>| POST | `/api/v1/auth/logout` | public | Revoke a refresh token |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
105. <code>| GET | `/api/v1/users/me` | bearer | Current user + KYC profile |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
106. <code>| PUT | `/api/v1/users/me/profile` | bearer | Update KYC profile |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
107. <code>| GET | `/api/v1/admin/users` | ADMIN | List all customer profiles |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
108. <code>| POST | `/api/v1/admin/users/{id}/kyc` | ADMIN | Set KYC status |</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
109. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
110. <code>**Demo admin** (seeded at startup): `admin@bank.local` / `Admin123!`</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
111. <code>(override via `ADMIN_EMAIL` / `ADMIN_PASSWORD`).</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
112. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
113. <code>## Prerequisites</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
114. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
115. <code>- Java 21, Maven (the `./mvnw` wrapper is included), Node 20+, Docker.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
116. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
117. <code>## Run locally</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
118. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
119. <code>```bash</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
120. <code># 1. (optional) create your env file</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
121. <code>cp .env.example .env</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
122. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
123. <code># 2. start Postgres + Redis  (host port 5433 -&gt; container 5432)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
124. <code>docker compose up -d postgres redis</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
125. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
126. <code># 3. run the backend</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
127. <code>cd backend &amp;&amp; ./mvnw spring-boot:run</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
128. <code>#   http://localhost:8080/actuator/health   -&gt; {&quot;status&quot;:&quot;UP&quot;}</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
129. <code>#   http://localhost:8080/swagger-ui.html   -&gt; API docs</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
130. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
131. <code># 4. run the frontend (in another terminal)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
132. <code>cd frontend &amp;&amp; npm install &amp;&amp; npm run dev</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
133. <code>#   http://localhost:5173  -&gt; shows &quot;Backend: UP&quot;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
134. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
135. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
136. <code>&gt; **Port note:** the Docker Postgres is published on host port **5433** to avoid</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
137. <code>&gt; clashing with a local Postgres on 5432. Inside Docker it remains 5432.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
138. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
139. <code>### Run the whole stack in Docker</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
140. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
141. <code>```bash</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
142. <code>docker compose --profile full up --build</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
143. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
144. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
145. <code>## Test</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
146. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
147. <code>```bash</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
148. <code>cd backend &amp;&amp; ./mvnw verify   # runs the Testcontainers smoke test (real Postgres)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
149. <code>cd frontend &amp;&amp; npm run build  # type-check + production build</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
150. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
151. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
152. <code>## Layout</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
153. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
154. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
155. <code>backend/     Spring Boot (modular packages under com.bank.*)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
156. <code>frontend/    React + TypeScript (Vite)</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
157. <code>docker-compose.yml</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
158. <code>.github/workflows/ci.yml</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
159. <code>PROJECT_PLAN.md</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
160. <code>```</code> - Markdown documentation line. It teaches humans and has no runtime behavior.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `docker-compose.yml`

### File Purpose
The local infrastructure definition: it starts PostgreSQL, Redis, and optionally the backend as containers.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: banking-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-banking}
      POSTGRES_USER: ${POSTGRES_USER:-banking}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-banking}
    ports:
      # Host 5433 -> container 5432 to avoid clashing with a local Postgres on 5432.
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-banking} -d ${POSTGRES_DB:-banking}"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: banking-redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

  kafka:
    image: apache/kafka:3.8.0
    container_name: banking-kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9094,CONTROLLER://0.0.0.0:9093,PLAINTEXT_HOST://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9094,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    healthcheck:
      test: ["CMD-SHELL", "/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 12

  backend:
    build:
      context: ./backend
    container_name: banking-backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      kafka:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: docker
      DB_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB:-banking}
      DB_USERNAME: ${POSTGRES_USER:-banking}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-banking}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9094
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/actuator/health | grep -q UP || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 12
    profiles:
      - full

volumes:
  pgdata:
  redisdata:
````

### Code Walkthrough
1. <code>services:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
2. <code>  postgres:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
3. <code>    image: postgres:16-alpine</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
4. <code>    container_name: banking-postgres</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
5. <code>    environment:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
6. <code>      POSTGRES_DB: ${POSTGRES_DB:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
7. <code>      POSTGRES_USER: ${POSTGRES_USER:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
8. <code>      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
9. <code>    ports:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
10. <code>      # Host 5433 -&gt; container 5432 to avoid clashing with a local Postgres on 5432.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code>      - &quot;5433:5432&quot;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
12. <code>    volumes:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
13. <code>      - pgdata:/var/lib/postgresql/data</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
14. <code>    healthcheck:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
15. <code>      test: [&quot;CMD-SHELL&quot;, &quot;pg_isready -U ${POSTGRES_USER:-banking} -d ${POSTGRES_DB:-banking}&quot;]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
16. <code>      interval: 5s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
17. <code>      timeout: 5s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
18. <code>      retries: 10</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>  redis:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
21. <code>    image: redis:7-alpine</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
22. <code>    container_name: banking-redis</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
23. <code>    ports:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
24. <code>      - &quot;6379:6379&quot;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
25. <code>    volumes:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
26. <code>      - redisdata:/data</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
27. <code>    healthcheck:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
28. <code>      test: [&quot;CMD&quot;, &quot;redis-cli&quot;, &quot;ping&quot;]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
29. <code>      interval: 5s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
30. <code>      timeout: 5s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
31. <code>      retries: 10</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>  kafka:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
34. <code>    image: apache/kafka:3.8.0</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
35. <code>    container_name: banking-kafka</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
36. <code>    ports:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
37. <code>      - &quot;9092:9092&quot;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
38. <code>    environment:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
39. <code>      KAFKA_NODE_ID: 1</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
40. <code>      KAFKA_PROCESS_ROLES: broker,controller</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
41. <code>      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
42. <code>      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9094,CONTROLLER://0.0.0.0:9093,PLAINTEXT_HOST://0.0.0.0:9092</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
43. <code>      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9094,PLAINTEXT_HOST://localhost:9092</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
44. <code>      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
45. <code>      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
46. <code>      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
47. <code>      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
48. <code>      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
49. <code>    healthcheck:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
50. <code>      test: [&quot;CMD-SHELL&quot;, &quot;/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list || exit 1&quot;]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
51. <code>      interval: 10s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
52. <code>      timeout: 10s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
53. <code>      retries: 12</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>  backend:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
56. <code>    build:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
57. <code>      context: ./backend</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
58. <code>    container_name: banking-backend</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
59. <code>    depends_on:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
60. <code>      postgres:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
61. <code>        condition: service_healthy</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
62. <code>      redis:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
63. <code>        condition: service_healthy</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
64. <code>      kafka:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
65. <code>        condition: service_healthy</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
66. <code>    environment:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
67. <code>      SPRING_PROFILES_ACTIVE: docker</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
68. <code>      DB_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
69. <code>      DB_USERNAME: ${POSTGRES_USER:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
70. <code>      DB_PASSWORD: ${POSTGRES_PASSWORD:-banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
71. <code>      REDIS_HOST: redis</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
72. <code>      REDIS_PORT: 6379</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
73. <code>      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9094</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
74. <code>    ports:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
75. <code>      - &quot;8080:8080&quot;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
76. <code>    healthcheck:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
77. <code>      test: [&quot;CMD-SHELL&quot;, &quot;wget -qO- http://localhost:8080/actuator/health | grep -q UP || exit 1&quot;]</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
78. <code>      interval: 10s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
79. <code>      timeout: 5s</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
80. <code>      retries: 12</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
81. <code>    profiles:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
82. <code>      - full</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>volumes:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
85. <code>  pgdata:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
86. <code>  redisdata:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.

### Functions
No explicit functions or methods are declared here. The file is declarative, data-oriented, or framework configuration consumed by tools.

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

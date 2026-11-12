# BankApp — Northstar Private

A synthetic banking web application and application-security test environment. It demonstrates customer-facing account, payment and withdrawal workflows, file evidence capture, localization, and a remote activity ledger.

> **SYNTHETIC TEST SYSTEM ONLY.** No real funds, bank rails, payment gateway, or real customer accounts are involved. Use synthetic names, account numbers, amounts, and files only.

## Live application

- **Application:** https://bankapp-withdrawal-lab.vercel.app
- **Activity Ledger:** https://bankapp-withdrawal-lab.vercel.app/test-ledger/
- **Backend:** https://banking-backend-nzjt.onrender.com
- **Repository:** https://github.com/jaackdoe35-sudo/BankApp
- **Release verification record:** [docs/RELEASE_VERIFICATION.md](docs/RELEASE_VERIFICATION.md)

## Architecture

- **Frontend:** React, TypeScript, Vite, React Router, React Query.
- **Backend:** Java 21, Spring Boot 3.5, Spring Security, JPA, PostgreSQL, Redis, Flyway.
- **Database:** Neon PostgreSQL.
- **Hosting:** Vercel frontend and Render backend.
- **Automation:** GitHub Actions, Maven verification, frontend build, dependency audit and Playwright browser checks.

The production frontend is configured with the backend API base URL. The application uses the browser-to-backend APIs for account/authentication workflows when configured, and the Activity Ledger's experiment API for remote event and file capture. A CI pass or a reachable page does not by itself prove every live end-to-end flow; see the release verification record for checks actually performed and checks still outstanding.

## Synthetic money-handling boundaries

- Payment processing is simulated; external payment processing is disabled.
- Withdrawal requests are captured for security testing and rejected. They must not debit balances.
- Test events preserve relevant non-secret form fields, including account numbers, amounts, currency and status.
- Passwords, PINs, OTPs, access/refresh tokens, JWTs, API keys and other secret material must be redacted.
- The experiment ledger is an evidence-capture facility, not a payment settlement ledger.

## Remote Activity Ledger

The frontend sends experiment evidence to the backend:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/experiment/sessions` | Create an evidence-capture session |
| POST | `/api/v1/experiment/sessions/{sessionId}/events` | Record a redacted event payload |
| POST | `/api/v1/experiment/sessions/{sessionId}/uploads` | Upload an evidence file |

Administrator-only ledger routes:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/admin/experiments/events` | List captured events |
| GET | `/api/v1/admin/experiments/events/{id}` | Retrieve an event |
| GET | `/api/v1/admin/experiments/files` | List uploaded evidence files |
| GET | `/api/v1/admin/experiments/files/{id}` | Download an evidence file |

The event and upload endpoints use a short-lived experiment session token. Administrator ledger endpoints require an authenticated ADMIN identity. The application stores file bytes and SHA-256 metadata in PostgreSQL; the backend validates supported file types, file signatures and the 10 MiB size limit.

## Authentication endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/auth/register` | Public customer registration |
| POST | `/api/v1/auth/login` | Public login |
| POST | `/api/v1/auth/refresh` | Refresh-token rotation |
| POST | `/api/v1/auth/logout` | Refresh-token revocation |
| GET | `/api/v1/users/me` | Authenticated user |
| GET | `/api/v1/admin/users` | ADMIN |

Do not commit passwords or other credentials. The production administrator password is configured as a Render secret and must be retained in a password manager controlled by the project owner. Never put it in this README, source code, issue comments or CI logs.

## Local development

Prerequisites: Java 21, Node.js, Maven wrapper and Docker.

```bash
# Start local dependencies
docker compose up -d postgres redis kafka

# Backend
cd backend
./mvnw spring-boot:run

# Frontend, in a separate terminal
cd frontend
npm install
npm run dev
```

Use the repository's `.env.example` as a starting point. Do not copy production secrets into a local file or commit a populated `.env`.

## Verification

```bash
# Backend tests
cd backend
./mvnw verify

# Frontend production build
cd frontend
npm ci
npm run build
```

GitHub Actions also runs the dependency audit and Playwright browser checks. Browser tests verify the test cases encoded in the repository; they are not a substitute for authenticated live-backend testing.

## Release status

The frontend and backend have live deployments. Backend health, production CORS, anonymous admin denial, synthetic remote event capture and a synthetic file upload have been verified. Administrator login, authenticated ledger download, customer-role denial, and a full browser-submitted payment/withdrawal round trip remain pending acceptance tests. The exact status and evidence are maintained in [docs/RELEASE_VERIFICATION.md](docs/RELEASE_VERIFICATION.md).

PR #1 remains open and draft. It has not been merged. Do not treat this synthetic application as a real banking product or use real customer financial data.

# Chapter 3: Folder Structure

## Root Folders

| Folder/File | Why it exists | What belongs inside | How it communicates |
|---|---|---|---|
| `backend/` | Holds the Spring Boot API and domain logic | Java source, resources, tests, Maven/Docker files | Serves REST JSON to the frontend and writes PostgreSQL/Redis |
| `frontend/` | Holds the browser application | React pages, components, API helpers, Vite config | Calls backend endpoints with Axios |
| `.github/workflows/` | Automates verification | CI YAML workflows | Runs backend and frontend commands on GitHub runners |
| `docker-compose.yml` | Defines local infrastructure | Postgres, Redis, optional backend service | Provides containers consumed by backend |
| `README.md` | First human entry point | Setup instructions, API summaries, phase status | Links to plan and tells developers how to run the project |
| `PROJECT_PLAN.md` | Architecture and roadmap | Design rationale and phased plan | Explains why current folders exist |

## Backend Package Conventions

```text
com.bank
├── auth         identity, JWT, refresh token, seeded admin
├── customer     customer profile and KYC state
├── account      bank accounts and account-facing APIs
├── ledger       double-entry transaction core
├── transfer     account-to-account transfers and beneficiaries
├── card         virtual cards and card purchases
├── payment      top-ups and payment gateway abstraction
├── loan         loan applications, schedules, repayment
├── admin        admin-specific endpoints
├── common       security config, exceptions, API errors, utilities
└── notification placeholder for future notification module
```

Each domain package usually follows this internal structure:

| Subfolder | Responsibility | Beginner translation |
|---|---|---|
| `domain` | Persistent business objects and enums | "The nouns the bank remembers" |
| `dto` | Request/response records | "The shapes of JSON entering/leaving the API" |
| `repo` | Database access interfaces | "The database doorway" |
| `service` | Business rules and transactions | "The department that decides what is allowed" |
| `web` | HTTP controllers | "The teller window" |

## Frontend Folder Conventions

```text
frontend/src
├── components   reusable UI shells and guards
├── context      global auth state
├── lib          API clients, type definitions, formatting, errors
├── pages        route-level workflows
└── assets       imported images/SVGs
```

The frontend chooses route-level pages rather than deep component trees. That is sensible for a learning banking app because each page corresponds to a domain workflow: dashboard, transfers, cards, loans, admin, profile.

## Why This Structure Was Chosen

The backend is organized by business capability, not by technical layer alone. Instead of one giant `controllers` folder and one giant `services` folder, account files live near account files and loan files live near loan files. This reduces the cognitive cost of changing one feature.

The frontend is organized by user workflow. A page owns its form state and mutations; shared code goes into `lib`, `components`, or `context` only when it is actually reused.

## Best Practices

- Put cross-domain business rules in a shared service only when they really are shared. `LedgerService` qualifies.
- Keep DTOs separate from JPA entities so database shape and API shape can evolve independently.
- Keep controllers small. They should translate HTTP, not implement banking logic.
- Keep React API calls in `lib` so pages remain readable.
- Keep generated directories out of Git.

## Common Mistakes

- Creating package names around frameworks instead of business concepts.
- Letting a frontend page know raw endpoint URLs for every operation.
- Putting database migration SQL in application startup code.
- Assuming a folder named `service` automatically means clean architecture. The contents matter.

## Exercise

Pick the feature "repay next loan installment" and list the package, DTOs, service, repository, entities, migration, frontend page, and tests that participate.

# Chapter 4: Backend Foundations

## Spring Boot Entry Point

`BankingBackendApplication` is the backend's main class. Spring Boot starts from it, scans `com.bank` packages, creates beans, configures web/security/data infrastructure, and starts the embedded server.

If this class were removed, the backend would no longer have a clear application entry point. Maven could still compile many classes, but `spring-boot:run` would not know how to launch the app.

## Maven and Dependencies

`backend/pom.xml` declares the backend as a Maven project using Spring Boot's parent. The parent provides managed dependency versions and plugin defaults. The project then chooses starters:

| Dependency | Why it exists |
|---|---|
| `spring-boot-starter-web` | REST controllers, JSON serialization, embedded web server |
| `spring-boot-starter-data-jpa` | Repositories and Hibernate ORM |
| `spring-boot-starter-security` | Authentication/authorization filters and password hashing |
| `spring-boot-starter-validation` | Request validation annotations |
| `spring-boot-starter-data-redis` | Refresh token store |
| `spring-boot-starter-actuator` | Health, metrics, operational endpoints |
| `flyway-core` + PostgreSQL module | Database migrations |
| `postgresql` | JDBC driver used at runtime |
| `springdoc-openapi` | Swagger/OpenAPI UI |
| `jjwt-*` | JWT generation and verification |
| `stripe-java` | Stripe test-mode integration |
| `testcontainers` | Real database integration tests |

## Configuration

`application.yml` binds environment variables into Spring properties. This lets the same jar run locally, in Docker, or in a hosted environment.

Important choices:

| Setting | Why |
|---|---|
| `ddl-auto: validate` | Hibernate checks schema but does not create it. Flyway owns schema changes. |
| `open-in-view: false` | Prevents accidental database reads while serializing responses. |
| `baseline-on-migrate: true` | Allows Flyway to begin managing a schema safely. |
| JWT secret/TTL values | Separates security settings from source code. |
| Stripe secret blank by default | Uses simulated gateway unless real test credentials are supplied. |

## Exceptions and API Errors

The common exception classes give business failures names: not found, conflict, insufficient funds, payment declined. `GlobalExceptionHandler` turns those Java exceptions into HTTP responses with an `ApiError` body.

This keeps controllers and services clean. A service can say "throw `InsufficientFundsException`" and the web layer consistently returns `422 Unprocessable Entity`.

## Security Configuration

`SecurityConfig` disables server sessions, permits public endpoints, requires authentication elsewhere, installs the JWT filter, configures CORS, and creates a BCrypt password encoder.

Why stateless sessions? A REST API used by a separate React app should not depend on server-side HTTP session memory. Access tokens travel with each request.

## Persistence Pattern

The backend uses JPA entities and Spring Data repository interfaces. A repository such as `AccountRepository` is not manually implemented. Spring Data reads method names like `findByOwnerUserIdOrderByCreatedAtAsc`, builds a query, and creates a proxy bean at runtime.

This is productive, but it is not magic. The method name becomes SQL, SQL touches indexes/tables, and the result becomes entity objects in memory.

## Transaction Pattern

Service methods that change data are annotated with `@Transactional`. This means all repository operations inside the method share one database transaction. If an exception is thrown, the transaction rolls back.

For money, this is non-negotiable. A transfer must not debit source and then fail before crediting destination.

## Industry Notes

- Real systems often avoid exposing entities directly from controllers. This app mostly uses DTO records for API boundaries, which is the right habit.
- Real banks use more detailed ledger/accounting models, but the double-entry invariant here is the essential idea.
- Redis-backed refresh tokens are simpler than OAuth infrastructure for a portfolio project, while still teaching token revocation.

## Quiz

| Question | Answer |
|---|---|
| Why should Flyway own schema creation? | It preserves a historical sequence of database changes. |
| Why is BCrypt used? | Passwords must be one-way hashed with a slow adaptive algorithm. |
| Why annotate services rather than controllers with `@Transactional`? | Business operations, not HTTP handlers, should define atomic units of work. |

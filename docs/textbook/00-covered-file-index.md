# Covered File Index

| File | Text/Binary | Purpose |
|---|---|---|
| `.env.example` | text | The environment variable template: it documents configurable secrets, ports, database credentials, Redis settings, and frontend API URLs without committing real secrets. |
| `.github/workflows/ci.yml` | text | The CI pipeline: it proves backend and frontend changes still build and test on every main-branch push or pull request. |
| `.gitignore` | text | A repository hygiene file: it controls which generated files are ignored or how line endings are normalized. |
| `PROJECT_PLAN.md` | text | The architectural roadmap: it records why this banking system is a modular monolith and how each phase was intended to evolve. |
| `README.md` | text | The public project introduction: it explains the product, completed phases, API surface, and local run commands. |
| `backend/.gitattributes` | text | A repository hygiene file: it controls which generated files are ignored or how line endings are normalized. |
| `backend/.gitignore` | text | A repository hygiene file: it controls which generated files are ignored or how line endings are normalized. |
| `backend/.mvn/wrapper/maven-wrapper.properties` | text | The Maven wrapper configuration: it pins the Maven distribution that the wrapper downloads. |
| `backend/Dockerfile` | text | The backend container recipe: it builds the Spring Boot jar in one stage and runs it in a smaller Java runtime image. |
| `backend/mvnw` | text | The Maven wrapper launcher: it lets developers build the backend with a known Maven version even if Maven is not installed globally. |
| `backend/mvnw.cmd` | text | The Maven wrapper launcher: it lets developers build the backend with a known Maven version even if Maven is not installed globally. |
| `backend/pom.xml` | text | The Maven project descriptor: it declares Java version, Spring Boot parent, dependencies, and build plugins for the backend. |
| `backend/src/main/java/com/bank/BankingBackendApplication.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/account/domain/Account.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/account/domain/AccountStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/account/domain/AccountType.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/account/dto/AccountResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/account/dto/AmountRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/account/dto/CreateAccountRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/account/dto/LedgerEntryResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/account/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/account/repo/AccountRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/account/service/AccountService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/account/web/AccountController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/admin/dto/VerifyKycRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/admin/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/admin/web/AdminUserController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/audit/domain/AuditEntry.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/audit/dto/AuditEntryResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/audit/messaging/AuditConsumer.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/audit/repo/AuditEntryRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/audit/service/AuditService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/audit/web/AdminAuditController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/auth/AdminSeeder.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/auth/domain/Role.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/auth/domain/User.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/auth/dto/AuthResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/auth/dto/LoginRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/auth/dto/RefreshRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/auth/dto/RegisterRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/auth/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/auth/repo/UserRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/auth/security/AuthUser.java` | text | A security infrastructure file: it participates in JWT authentication, authorization, or security configuration. |
| `backend/src/main/java/com/bank/auth/security/JwtAuthenticationFilter.java` | text | A security infrastructure file: it participates in JWT authentication, authorization, or security configuration. |
| `backend/src/main/java/com/bank/auth/security/JwtProperties.java` | text | A security infrastructure file: it participates in JWT authentication, authorization, or security configuration. |
| `backend/src/main/java/com/bank/auth/security/JwtService.java` | text | A security infrastructure file: it participates in JWT authentication, authorization, or security configuration. |
| `backend/src/main/java/com/bank/auth/service/AuthService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/auth/service/RefreshTokenService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/auth/web/AuthController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/card/domain/Card.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/card/domain/CardPayment.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/card/domain/CardStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/card/dto/CardPaymentRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/card/dto/CardPaymentResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/card/dto/CardResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/card/dto/IssueCardRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/card/dto/IssueCardResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/card/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/card/repo/CardPaymentRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/card/repo/CardRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/card/service/CardService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/card/web/CardController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/common/ApiError.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/GlobalExceptionHandler.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/OpenApiConfig.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/PingController.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/SecurityConfig.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/SecurityUtils.java` | text | A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks. |
| `backend/src/main/java/com/bank/common/event/DomainEvent.java` | text | A shared event helper: it standardizes event payloads or action names for future notification and audit flows. |
| `backend/src/main/java/com/bank/common/event/EventActions.java` | text | A shared event helper: it standardizes event payloads or action names for future notification and audit flows. |
| `backend/src/main/java/com/bank/common/event/EventPublisher.java` | text | A shared event helper: it standardizes event payloads or action names for future notification and audit flows. |
| `backend/src/main/java/com/bank/common/exception/ConflictException.java` | text | A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status. |
| `backend/src/main/java/com/bank/common/exception/InsufficientFundsException.java` | text | A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status. |
| `backend/src/main/java/com/bank/common/exception/NotFoundException.java` | text | A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status. |
| `backend/src/main/java/com/bank/common/exception/PaymentDeclinedException.java` | text | A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status. |
| `backend/src/main/java/com/bank/customer/domain/CustomerProfile.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/customer/domain/KycStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/customer/dto/ProfileResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/customer/dto/UpdateProfileRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/customer/repo/CustomerProfileRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/customer/service/CustomerService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/customer/web/CustomerController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/ledger/domain/EntryDirection.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/ledger/domain/LedgerEntry.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/ledger/domain/Transaction.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/ledger/domain/TransactionType.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/ledger/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/ledger/repo/LedgerEntryRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/ledger/repo/TransactionRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/ledger/service/LedgerService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/ledger/service/PostingLine.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/loan/domain/InstallmentStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/loan/domain/Loan.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/loan/domain/LoanInstallment.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/loan/domain/LoanStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/loan/dto/InstallmentResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/loan/dto/LoanApplicationRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/loan/dto/LoanDetailResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/loan/dto/LoanResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/loan/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/loan/repo/LoanInstallmentRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/loan/repo/LoanRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/loan/service/AmortizationCalculator.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/loan/service/LoanScheduler.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/loan/service/LoanService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/loan/web/AdminLoanController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/loan/web/LoanController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/notification/domain/Notification.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/notification/dto/NotificationResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/notification/email/EmailConfig.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/notification/email/EmailSender.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/notification/email/SimulatedEmailSender.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/notification/email/SmtpEmailSender.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/notification/messaging/NotificationConsumer.java` | text | The backend application entry point or shared Java file. |
| `backend/src/main/java/com/bank/notification/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/notification/repo/NotificationRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/notification/service/NotificationService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/notification/web/NotificationController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/payment/domain/Payment.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/payment/domain/PaymentStatus.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/payment/dto/PaymentResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/payment/dto/TopUpRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/payment/dto/TopUpResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/payment/gateway/PaymentGateway.java` | text | A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface. |
| `backend/src/main/java/com/bank/payment/gateway/PaymentGatewayConfig.java` | text | A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface. |
| `backend/src/main/java/com/bank/payment/gateway/SimulatedPaymentGateway.java` | text | A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface. |
| `backend/src/main/java/com/bank/payment/gateway/StripePaymentGateway.java` | text | A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface. |
| `backend/src/main/java/com/bank/payment/repo/PaymentRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/payment/service/PaymentService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/payment/web/PaymentController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/transfer/domain/Beneficiary.java` | text | A domain model file: it represents persistent business state and maps Java objects to database concepts. |
| `backend/src/main/java/com/bank/transfer/dto/BeneficiaryRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/transfer/dto/BeneficiaryResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/transfer/dto/TransferRequest.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/transfer/dto/TransferResponse.java` | text | A DTO file: it defines the shape of request or response data crossing the HTTP API boundary. |
| `backend/src/main/java/com/bank/transfer/package-info.java` | text | A package-level documentation file: it explains the module boundary for Java readers and generated docs. |
| `backend/src/main/java/com/bank/transfer/repo/BeneficiaryRepository.java` | text | A repository file: it declares database access methods using Spring Data JPA. |
| `backend/src/main/java/com/bank/transfer/service/BeneficiaryService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/transfer/service/TransferService.java` | text | A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories. |
| `backend/src/main/java/com/bank/transfer/web/BeneficiaryController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/java/com/bank/transfer/web/TransferController.java` | text | A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses. |
| `backend/src/main/resources/application-docker.yml` | text | Spring Boot configuration: it binds database, Redis, JWT, CORS, OpenAPI, Actuator, and app-specific properties. |
| `backend/src/main/resources/application.yml` | text | Spring Boot configuration: it binds database, Redis, JWT, CORS, OpenAPI, Actuator, and app-specific properties. |
| `backend/src/main/resources/db/migration/V1__baseline.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V2__auth_users.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V3__accounts_ledger.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V4__beneficiaries.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V5__cards_payments.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V6__loans.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/main/resources/db/migration/V7__notifications_audit.sql` | text | A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way. |
| `backend/src/test/java/com/bank/AbstractIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/SmokeApplicationTests.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/account/AccountLedgerIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/auth/AuthFlowIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/card/CardIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/loan/AmortizationCalculatorTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/loan/LoanIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/payment/PaymentIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `backend/src/test/java/com/bank/transfer/TransferIntegrationTest.java` | text | An integration or unit test file: it documents expected behavior and guards against regressions. |
| `docker-compose.yml` | text | The local infrastructure definition: it starts PostgreSQL, Redis, and optionally the backend as containers. |
| `frontend/.env.example` | text | The frontend environment template: it points the browser app at the backend API base URL. |
| `frontend/.gitignore` | text | A repository hygiene file: it controls which generated files are ignored or how line endings are normalized. |
| `frontend/.oxlintrc.json` | text | The Oxlint configuration: it enables React and TypeScript lint rules for faster local feedback. |
| `frontend/README.md` | text | A first-party project file included in the buildable repository. |
| `frontend/index.html` | text | The HTML shell: Vite injects the React application into its root element. |
| `frontend/package-lock.json` | text | The npm lockfile: it pins the exact dependency graph so installs are reproducible. |
| `frontend/package.json` | text | The frontend package manifest: it names scripts and declares React, routing, query, HTTP, TypeScript, Vite, and lint dependencies. |
| `frontend/public/favicon.svg` | text | A public static asset: Vite serves it directly without importing it through the TypeScript module graph. |
| `frontend/public/icons.svg` | text | A public static asset: Vite serves it directly without importing it through the TypeScript module graph. |
| `frontend/src/assets/hero.png` | binary | A frontend asset imported or available to the React app, such as SVG or image media. |
| `frontend/src/assets/react.svg` | text | A frontend asset imported or available to the React app, such as SVG or image media. |
| `frontend/src/assets/vite.svg` | text | A frontend asset imported or available to the React app, such as SVG or image media. |
| `frontend/src/components/AppLayout.tsx` | text | A reusable React component used by multiple route pages. |
| `frontend/src/components/ProtectedRoute.tsx` | text | A reusable React component used by multiple route pages. |
| `frontend/src/context/AuthContext.tsx` | text | A React context module: it stores cross-page authentication state and exposes auth actions. |
| `frontend/src/index.css` | text | The global stylesheet entry: it loads Tailwind CSS into the Vite build. |
| `frontend/src/lib/accounts.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/admin.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/api.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/auth.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/cards.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/errors.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/format.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/loans.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/payments.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/lib/transfers.ts` | text | A frontend library module: it centralizes API calls, formatting, token storage, or error conversion. |
| `frontend/src/main.tsx` | text | The frontend entry point: it mounts React, configures providers, and declares routes. |
| `frontend/src/pages/AccountDetailPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/AdminPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/CardsPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/DashboardPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/LoansPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/LoginPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/ProfilePage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/SignupPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/src/pages/TransferPage.tsx` | text | A route-level React page: it owns one user workflow and composes API calls, forms, loading states, and layout. |
| `frontend/tsconfig.app.json` | text | A TypeScript compiler configuration file: it controls type checking, JSX, module resolution, and build references. |
| `frontend/tsconfig.json` | text | A TypeScript compiler configuration file: it controls type checking, JSX, module resolution, and build references. |
| `frontend/tsconfig.node.json` | text | A TypeScript compiler configuration file: it controls type checking, JSX, module resolution, and build references. |
| `frontend/vite.config.ts` | text | The Vite configuration: it wires React and Tailwind into the frontend development and production build. |

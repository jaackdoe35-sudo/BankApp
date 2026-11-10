# Appendix D: Backend Resources, Tests, Maven, and Docker

This appendix covers backend configuration, database migrations, tests, Maven wrapper/build files, and Docker runtime files.

> Reading note: each section includes the file purpose, import/dependency role, complete source listing where the file is textual, and a line-by-line walkthrough. Generated dependency/build directories are excluded from this book.

## `backend/src/main/resources/application-docker.yml`

### File Purpose
Spring Boot configuration: it binds database, Redis, JWT, CORS, OpenAPI, Actuator, and app-specific properties.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````yaml
# Activated with SPRING_PROFILES_ACTIVE=docker (set in docker-compose).
# Service hostnames match the compose service names; env vars still override.
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://postgres:5432/banking}
  data:
    redis:
      host: ${REDIS_HOST:redis}
````

### Code Walkthrough
1. <code># Activated with SPRING_PROFILES_ACTIVE=docker (set in docker-compose).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code># Service hostnames match the compose service names; env vars still override.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code>spring:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
4. <code>  datasource:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
5. <code>    url: ${DB_URL:jdbc:postgresql://postgres:5432/banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
6. <code>  data:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
7. <code>    redis:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
8. <code>      host: ${REDIS_HOST:redis}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.

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

## `backend/src/main/resources/application.yml`

### File Purpose
Spring Boot configuration: it binds database, Redis, JWT, CORS, OpenAPI, Actuator, and app-specific properties.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````yaml
spring:
  application:
    name: banking-backend

  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5433/banking}
    username: ${DB_USERNAME:banking}
    password: ${DB_PASSWORD:banking}

  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
    properties:
      hibernate:
        format_sql: true
    show-sql: false

  flyway:
    enabled: true
    baseline-on-migrate: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}

  kafka:
    bootstrap-servers: ${SPRING_KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      auto-offset-reset: earliest
      properties:
        spring.json.trusted.packages: "com.bank.*"
        spring.json.value.default.type: com.bank.common.event.DomainEvent

  # Real email is sent only when a mail host is configured (e.g. Mailtrap);
  # otherwise the SimulatedEmailSender logs messages.
  mail:
    host: ${MAIL_HOST:}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME:}
    password: ${MAIL_PASSWORD:}

server:
  port: 8080

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when_authorized

springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /v3/api-docs

app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173}
  jwt:
    # Override in any real environment. Must be >= 32 chars for HS256.
    secret: ${JWT_SECRET:dev-only-secret-change-me-0123456789-banking-system-hs256-key}
    issuer: banking-system
    access-token-ttl: ${JWT_ACCESS_TTL:15m}
    refresh-token-ttl: ${JWT_REFRESH_TTL:7d}
  seed:
    admin-email: ${ADMIN_EMAIL:admin@bank.local}
    admin-password: ${ADMIN_PASSWORD:Admin123!}
  stripe:
    # When secret-key is blank the app uses the simulated payment gateway.
    secret-key: ${STRIPE_SECRET_KEY:}
    webhook-secret: ${STRIPE_WEBHOOK_SECRET:}
  events:
    topic: ${EVENTS_TOPIC:banking.events}
  mail:
    from: ${MAIL_FROM:no-reply@bank.local}
````

### Code Walkthrough
1. <code>spring:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
2. <code>  application:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
3. <code>    name: banking-backend</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>  datasource:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
6. <code>    url: ${DB_URL:jdbc:postgresql://localhost:5433/banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
7. <code>    username: ${DB_USERNAME:banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
8. <code>    password: ${DB_PASSWORD:banking}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>  jpa:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
11. <code>    hibernate:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
12. <code>      ddl-auto: validate</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
13. <code>    open-in-view: false</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
14. <code>    properties:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
15. <code>      hibernate:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
16. <code>        format_sql: true</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
17. <code>    show-sql: false</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>  flyway:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
20. <code>    enabled: true</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
21. <code>    baseline-on-migrate: true</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>  data:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
24. <code>    redis:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
25. <code>      host: ${REDIS_HOST:localhost}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
26. <code>      port: ${REDIS_PORT:6379}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>  kafka:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
29. <code>    bootstrap-servers: ${SPRING_KAFKA_BOOTSTRAP_SERVERS:localhost:9092}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
30. <code>    producer:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
31. <code>      key-serializer: org.apache.kafka.common.serialization.StringSerializer</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
32. <code>      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
33. <code>    consumer:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
34. <code>      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
35. <code>      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
36. <code>      auto-offset-reset: earliest</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
37. <code>      properties:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
38. <code>        spring.json.trusted.packages: &quot;com.bank.*&quot;</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
39. <code>        spring.json.value.default.type: com.bank.common.event.DomainEvent</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>  # Real email is sent only when a mail host is configured (e.g. Mailtrap);</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
42. <code>  # otherwise the SimulatedEmailSender logs messages.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
43. <code>  mail:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
44. <code>    host: ${MAIL_HOST:}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
45. <code>    port: ${MAIL_PORT:587}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
46. <code>    username: ${MAIL_USERNAME:}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
47. <code>    password: ${MAIL_PASSWORD:}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>server:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
50. <code>  port: 8080</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>management:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
53. <code>  endpoints:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
54. <code>    web:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
55. <code>      exposure:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
56. <code>        include: health,info,metrics</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
57. <code>  endpoint:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
58. <code>    health:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
59. <code>      show-details: when_authorized</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
60. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
61. <code>springdoc:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
62. <code>  swagger-ui:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
63. <code>    path: /swagger-ui.html</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
64. <code>  api-docs:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
65. <code>    path: /v3/api-docs</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
66. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
67. <code>app:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
68. <code>  cors:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
69. <code>    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
70. <code>  jwt:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
71. <code>    # Override in any real environment. Must be &gt;= 32 chars for HS256.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
72. <code>    secret: ${JWT_SECRET:dev-only-secret-change-me-0123456789-banking-system-hs256-key}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
73. <code>    issuer: banking-system</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
74. <code>    access-token-ttl: ${JWT_ACCESS_TTL:15m}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
75. <code>    refresh-token-ttl: ${JWT_REFRESH_TTL:7d}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
76. <code>  seed:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
77. <code>    admin-email: ${ADMIN_EMAIL:admin@bank.local}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
78. <code>    admin-password: ${ADMIN_PASSWORD:Admin123!}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
79. <code>  stripe:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
80. <code>    # When secret-key is blank the app uses the simulated payment gateway.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
81. <code>    secret-key: ${STRIPE_SECRET_KEY:}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
82. <code>    webhook-secret: ${STRIPE_WEBHOOK_SECRET:}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
83. <code>  events:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
84. <code>    topic: ${EVENTS_TOPIC:banking.events}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
85. <code>  mail:</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.
86. <code>    from: ${MAIL_FROM:no-reply@bank.local}</code> - YAML configuration line. Spring Boot, Docker Compose, or CI parses it into nested settings; indentation defines structure.

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

## `backend/src/main/resources/db/migration/V1__baseline.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- V1 baseline migration.
-- Real domain tables (users, accounts, ledger_entries, ...) arrive in later phases.
-- This baseline records platform metadata and proves the Flyway pipeline works.

CREATE TABLE platform_info (
    id          SMALLINT     PRIMARY KEY DEFAULT 1,
    app_name    VARCHAR(100) NOT NULL,
    schema_note VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT platform_info_singleton CHECK (id = 1)
);

INSERT INTO platform_info (id, app_name, schema_note)
VALUES (1, 'banking-backend', 'Phase 0 baseline schema');
````

### Code Walkthrough
1. <code>-- V1 baseline migration.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code>-- Real domain tables (users, accounts, ledger_entries, ...) arrive in later phases.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code>-- This baseline records platform metadata and proves the Flyway pipeline works.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>CREATE TABLE platform_info (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
6. <code>    id          SMALLINT     PRIMARY KEY DEFAULT 1,</code> - SQL schema/data line executed by Flyway in version order.
7. <code>    app_name    VARCHAR(100) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
8. <code>    schema_note VARCHAR(255) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
9. <code>    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    CONSTRAINT platform_info_singleton CHECK (id = 1)</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
11. <code>);</code> - SQL schema/data line executed by Flyway in version order.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>INSERT INTO platform_info (id, app_name, schema_note)</code> - Seed data insertion. It creates initial rows required by the application, such as the system settlement account.
14. <code>VALUES (1, &#x27;banking-backend&#x27;, &#x27;Phase 0 baseline schema&#x27;);</code> - SQL schema/data line executed by Flyway in version order.

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

## `backend/src/main/resources/db/migration/V2__auth_users.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 1: authentication & user identity.

CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    version       BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT users_role_check CHECK (role IN ('CUSTOMER', 'ADMIN', 'SUPPORT'))
);

CREATE TABLE customer_profiles (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    date_of_birth  DATE,
    phone          VARCHAR(30),
    address_line1  VARCHAR(255),
    city           VARCHAR(100),
    country        VARCHAR(100),
    kyc_status     VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    version        BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT customer_kyc_status_check CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED'))
);

CREATE INDEX idx_customer_profiles_kyc_status ON customer_profiles (kyc_status);

-- The demo admin account is seeded at startup by AdminSeeder (so the BCrypt hash
-- is generated by the application's PasswordEncoder).
````

### Code Walkthrough
1. <code>-- Phase 1: authentication &amp; user identity.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>CREATE TABLE users (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
4. <code>    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
5. <code>    email         VARCHAR(255) NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
6. <code>    password_hash VARCHAR(255) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
7. <code>    role          VARCHAR(20)  NOT NULL DEFAULT &#x27;CUSTOMER&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
8. <code>    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,</code> - SQL schema/data line executed by Flyway in version order.
9. <code>    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
11. <code>    version       BIGINT       NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
12. <code>    CONSTRAINT users_role_check CHECK (role IN (&#x27;CUSTOMER&#x27;, &#x27;ADMIN&#x27;, &#x27;SUPPORT&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
13. <code>);</code> - SQL schema/data line executed by Flyway in version order.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>CREATE TABLE customer_profiles (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
16. <code>    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
17. <code>    user_id        UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
18. <code>    first_name     VARCHAR(100),</code> - SQL schema/data line executed by Flyway in version order.
19. <code>    last_name      VARCHAR(100),</code> - SQL schema/data line executed by Flyway in version order.
20. <code>    date_of_birth  DATE,</code> - SQL schema/data line executed by Flyway in version order.
21. <code>    phone          VARCHAR(30),</code> - SQL schema/data line executed by Flyway in version order.
22. <code>    address_line1  VARCHAR(255),</code> - SQL schema/data line executed by Flyway in version order.
23. <code>    city           VARCHAR(100),</code> - SQL schema/data line executed by Flyway in version order.
24. <code>    country        VARCHAR(100),</code> - SQL schema/data line executed by Flyway in version order.
25. <code>    kyc_status     VARCHAR(20)  NOT NULL DEFAULT &#x27;PENDING&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
26. <code>    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
27. <code>    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
28. <code>    version        BIGINT       NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
29. <code>    CONSTRAINT customer_kyc_status_check CHECK (kyc_status IN (&#x27;PENDING&#x27;, &#x27;VERIFIED&#x27;, &#x27;REJECTED&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
30. <code>);</code> - SQL schema/data line executed by Flyway in version order.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>CREATE INDEX idx_customer_profiles_kyc_status ON customer_profiles (kyc_status);</code> - Index definition. It spends storage/write overhead to make common reads faster.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>-- The demo admin account is seeded at startup by AdminSeeder (so the BCrypt hash</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
35. <code>-- is generated by the application&#x27;s PasswordEncoder).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.

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

## `backend/src/main/resources/db/migration/V3__accounts_ledger.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 2: accounts + double-entry ledger.

CREATE TABLE accounts (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(20)   NOT NULL UNIQUE,
    owner_user_id  UUID          REFERENCES users (id) ON DELETE RESTRICT,
    type           VARCHAR(20)   NOT NULL,
    currency       VARCHAR(3)    NOT NULL DEFAULT 'USD',
    balance        NUMERIC(19,4) NOT NULL DEFAULT 0,
    status         VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version        BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT accounts_type_check   CHECK (type IN ('CHECKING', 'SAVINGS', 'SYSTEM')),
    CONSTRAINT accounts_status_check CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED'))
);

CREATE INDEX idx_accounts_owner ON accounts (owner_user_id);

CREATE TABLE transactions (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    reference       VARCHAR(40)  NOT NULL UNIQUE,
    type            VARCHAR(20)  NOT NULL,
    description     VARCHAR(255),
    idempotency_key VARCHAR(100) UNIQUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT transactions_type_check CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER'))
);

CREATE TABLE ledger_entries (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
    account_id     UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,
    direction      VARCHAR(6)    NOT NULL,
    amount         NUMERIC(19,4) NOT NULL,
    balance_after  NUMERIC(19,4),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ledger_direction_check CHECK (direction IN ('DEBIT', 'CREDIT')),
    CONSTRAINT ledger_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_ledger_entries_account ON ledger_entries (account_id, created_at);
CREATE INDEX idx_ledger_entries_txn     ON ledger_entries (transaction_id);

-- System settlement account: the counterparty for external money in/out so that
-- every transaction's debits and credits net to zero.
INSERT INTO accounts (account_number, owner_user_id, type, currency, status)
VALUES ('SYS-SETTLEMENT-USD', NULL, 'SYSTEM', 'USD', 'ACTIVE');
````

### Code Walkthrough
1. <code>-- Phase 2: accounts + double-entry ledger.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>CREATE TABLE accounts (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
4. <code>    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
5. <code>    account_number VARCHAR(20)   NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
6. <code>    owner_user_id  UUID          REFERENCES users (id) ON DELETE RESTRICT,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
7. <code>    type           VARCHAR(20)   NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
8. <code>    currency       VARCHAR(3)    NOT NULL DEFAULT &#x27;USD&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
9. <code>    balance        NUMERIC(19,4) NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    status         VARCHAR(20)   NOT NULL DEFAULT &#x27;ACTIVE&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
11. <code>    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
12. <code>    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
13. <code>    version        BIGINT        NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
14. <code>    CONSTRAINT accounts_type_check   CHECK (type IN (&#x27;CHECKING&#x27;, &#x27;SAVINGS&#x27;, &#x27;SYSTEM&#x27;)),</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
15. <code>    CONSTRAINT accounts_status_check CHECK (status IN (&#x27;ACTIVE&#x27;, &#x27;FROZEN&#x27;, &#x27;CLOSED&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
16. <code>);</code> - SQL schema/data line executed by Flyway in version order.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>CREATE INDEX idx_accounts_owner ON accounts (owner_user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>CREATE TABLE transactions (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
21. <code>    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
22. <code>    reference       VARCHAR(40)  NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
23. <code>    type            VARCHAR(20)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
24. <code>    description     VARCHAR(255),</code> - SQL schema/data line executed by Flyway in version order.
25. <code>    idempotency_key VARCHAR(100) UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
26. <code>    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
27. <code>    CONSTRAINT transactions_type_check CHECK (type IN (&#x27;DEPOSIT&#x27;, &#x27;WITHDRAWAL&#x27;, &#x27;TRANSFER&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
28. <code>);</code> - SQL schema/data line executed by Flyway in version order.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>CREATE TABLE ledger_entries (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
31. <code>    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
32. <code>    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
33. <code>    account_id     UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
34. <code>    direction      VARCHAR(6)    NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
35. <code>    amount         NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
36. <code>    balance_after  NUMERIC(19,4),</code> - SQL schema/data line executed by Flyway in version order.
37. <code>    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
38. <code>    CONSTRAINT ledger_direction_check CHECK (direction IN (&#x27;DEBIT&#x27;, &#x27;CREDIT&#x27;)),</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
39. <code>    CONSTRAINT ledger_amount_positive CHECK (amount &gt; 0)</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
40. <code>);</code> - SQL schema/data line executed by Flyway in version order.
41. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
42. <code>CREATE INDEX idx_ledger_entries_account ON ledger_entries (account_id, created_at);</code> - Index definition. It spends storage/write overhead to make common reads faster.
43. <code>CREATE INDEX idx_ledger_entries_txn     ON ledger_entries (transaction_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>-- System settlement account: the counterparty for external money in/out so that</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
46. <code>-- every transaction&#x27;s debits and credits net to zero.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
47. <code>INSERT INTO accounts (account_number, owner_user_id, type, currency, status)</code> - Seed data insertion. It creates initial rows required by the application, such as the system settlement account.
48. <code>VALUES (&#x27;SYS-SETTLEMENT-USD&#x27;, NULL, &#x27;SYSTEM&#x27;, &#x27;USD&#x27;, &#x27;ACTIVE&#x27;);</code> - SQL schema/data line executed by Flyway in version order.

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

## `backend/src/main/resources/db/migration/V4__beneficiaries.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 3: saved payees (beneficiaries) for transfers.

CREATE TABLE beneficiaries (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    nickname       VARCHAR(100) NOT NULL,
    account_number VARCHAR(20)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    version        BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT beneficiaries_unique_per_owner UNIQUE (owner_user_id, account_number)
);

CREATE INDEX idx_beneficiaries_owner ON beneficiaries (owner_user_id);
````

### Code Walkthrough
1. <code>-- Phase 3: saved payees (beneficiaries) for transfers.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>CREATE TABLE beneficiaries (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
4. <code>    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
5. <code>    owner_user_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
6. <code>    nickname       VARCHAR(100) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
7. <code>    account_number VARCHAR(20)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
8. <code>    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
9. <code>    version        BIGINT       NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    CONSTRAINT beneficiaries_unique_per_owner UNIQUE (owner_user_id, account_number)</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
11. <code>);</code> - SQL schema/data line executed by Flyway in version order.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>CREATE INDEX idx_beneficiaries_owner ON beneficiaries (owner_user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.

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

## `backend/src/main/resources/db/migration/V5__cards_payments.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 4: virtual cards + payments (top-ups).

-- Allow the new transaction types on the ledger.
ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
    CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'TOP_UP'));

CREATE TABLE cards (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    last4         VARCHAR(4)    NOT NULL,
    brand         VARCHAR(20)   NOT NULL,
    exp_month     INTEGER       NOT NULL,
    exp_year      INTEGER       NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    monthly_limit NUMERIC(19,4) NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version       BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT cards_status_check CHECK (status IN ('ACTIVE', 'FROZEN', 'CANCELLED'))
);

CREATE INDEX idx_cards_user ON cards (user_id);

CREATE TABLE card_payments (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id        UUID          NOT NULL REFERENCES cards (id) ON DELETE CASCADE,
    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE RESTRICT,
    merchant       VARCHAR(140)  NOT NULL,
    amount         NUMERIC(19,4) NOT NULL,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_payments_card ON card_payments (card_id, created_at);

CREATE TABLE payments (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    account_id   UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    amount       NUMERIC(19,4) NOT NULL,
    currency     VARCHAR(3)    NOT NULL DEFAULT 'USD',
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    provider     VARCHAR(20)   NOT NULL,
    provider_ref VARCHAR(255)  NOT NULL UNIQUE,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version      BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT payments_status_check CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED'))
);

CREATE INDEX idx_payments_user ON payments (user_id);
````

### Code Walkthrough
1. <code>-- Phase 4: virtual cards + payments (top-ups).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>-- Allow the new transaction types on the ledger.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;</code> - DDL statement changing an existing table or constraint as the schema evolves.
5. <code>ALTER TABLE transactions ADD CONSTRAINT transactions_type_check</code> - DDL statement changing an existing table or constraint as the schema evolves.
6. <code>    CHECK (type IN (&#x27;DEPOSIT&#x27;, &#x27;WITHDRAWAL&#x27;, &#x27;TRANSFER&#x27;, &#x27;CARD_PAYMENT&#x27;, &#x27;TOP_UP&#x27;));</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>CREATE TABLE cards (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
9. <code>    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
11. <code>    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
12. <code>    last4         VARCHAR(4)    NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
13. <code>    brand         VARCHAR(20)   NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
14. <code>    exp_month     INTEGER       NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
15. <code>    exp_year      INTEGER       NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
16. <code>    status        VARCHAR(20)   NOT NULL DEFAULT &#x27;ACTIVE&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
17. <code>    monthly_limit NUMERIC(19,4) NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
18. <code>    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
19. <code>    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
20. <code>    version       BIGINT        NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
21. <code>    CONSTRAINT cards_status_check CHECK (status IN (&#x27;ACTIVE&#x27;, &#x27;FROZEN&#x27;, &#x27;CANCELLED&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
22. <code>);</code> - SQL schema/data line executed by Flyway in version order.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>CREATE INDEX idx_cards_user ON cards (user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>CREATE TABLE card_payments (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
27. <code>    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
28. <code>    card_id        UUID          NOT NULL REFERENCES cards (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
29. <code>    transaction_id UUID          NOT NULL REFERENCES transactions (id) ON DELETE RESTRICT,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
30. <code>    merchant       VARCHAR(140)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
31. <code>    amount         NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
32. <code>    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()</code> - SQL schema/data line executed by Flyway in version order.
33. <code>);</code> - SQL schema/data line executed by Flyway in version order.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>CREATE INDEX idx_card_payments_card ON card_payments (card_id, created_at);</code> - Index definition. It spends storage/write overhead to make common reads faster.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>CREATE TABLE payments (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
38. <code>    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
39. <code>    user_id      UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
40. <code>    account_id   UUID          NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
41. <code>    amount       NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
42. <code>    currency     VARCHAR(3)    NOT NULL DEFAULT &#x27;USD&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
43. <code>    status       VARCHAR(20)   NOT NULL DEFAULT &#x27;PENDING&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
44. <code>    provider     VARCHAR(20)   NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
45. <code>    provider_ref VARCHAR(255)  NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
46. <code>    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
47. <code>    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
48. <code>    version      BIGINT        NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
49. <code>    CONSTRAINT payments_status_check CHECK (status IN (&#x27;PENDING&#x27;, &#x27;SUCCEEDED&#x27;, &#x27;FAILED&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
50. <code>);</code> - SQL schema/data line executed by Flyway in version order.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>CREATE INDEX idx_payments_user ON payments (user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.

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

## `backend/src/main/resources/db/migration/V6__loans.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 5: loans + amortization schedule.

ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
    CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'TOP_UP',
                    'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT'));

CREATE TABLE loans (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,
    principal     NUMERIC(19,4) NOT NULL,
    annual_rate   NUMERIC(9,6)  NOT NULL,
    term_months   INTEGER       NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    disbursed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version       BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT loans_status_check CHECK (status IN ('PENDING', 'REJECTED', 'ACTIVE', 'PAID_OFF'))
);

CREATE INDEX idx_loans_user   ON loans (user_id);
CREATE INDEX idx_loans_status ON loans (status);

CREATE TABLE loan_installments (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id       UUID          NOT NULL REFERENCES loans (id) ON DELETE CASCADE,
    seq           INTEGER       NOT NULL,
    due_date      DATE          NOT NULL,
    principal_due NUMERIC(19,4) NOT NULL,
    interest_due  NUMERIC(19,4) NOT NULL,
    total_due     NUMERIC(19,4) NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    paid_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT installment_status_check CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
    CONSTRAINT installment_unique_seq UNIQUE (loan_id, seq)
);

CREATE INDEX idx_installments_loan ON loan_installments (loan_id, seq);
````

### Code Walkthrough
1. <code>-- Phase 5: loans + amortization schedule.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;</code> - DDL statement changing an existing table or constraint as the schema evolves.
4. <code>ALTER TABLE transactions ADD CONSTRAINT transactions_type_check</code> - DDL statement changing an existing table or constraint as the schema evolves.
5. <code>    CHECK (type IN (&#x27;DEPOSIT&#x27;, &#x27;WITHDRAWAL&#x27;, &#x27;TRANSFER&#x27;, &#x27;CARD_PAYMENT&#x27;, &#x27;TOP_UP&#x27;,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
6. <code>                    &#x27;LOAN_DISBURSEMENT&#x27;, &#x27;LOAN_REPAYMENT&#x27;));</code> - SQL schema/data line executed by Flyway in version order.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>CREATE TABLE loans (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
9. <code>    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    user_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
11. <code>    account_id    UUID          NOT NULL REFERENCES accounts (id) ON DELETE RESTRICT,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
12. <code>    principal     NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
13. <code>    annual_rate   NUMERIC(9,6)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
14. <code>    term_months   INTEGER       NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
15. <code>    status        VARCHAR(20)   NOT NULL DEFAULT &#x27;PENDING&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
16. <code>    disbursed_at  TIMESTAMPTZ,</code> - SQL schema/data line executed by Flyway in version order.
17. <code>    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
18. <code>    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
19. <code>    version       BIGINT        NOT NULL DEFAULT 0,</code> - SQL schema/data line executed by Flyway in version order.
20. <code>    CONSTRAINT loans_status_check CHECK (status IN (&#x27;PENDING&#x27;, &#x27;REJECTED&#x27;, &#x27;ACTIVE&#x27;, &#x27;PAID_OFF&#x27;))</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
21. <code>);</code> - SQL schema/data line executed by Flyway in version order.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>CREATE INDEX idx_loans_user   ON loans (user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.
24. <code>CREATE INDEX idx_loans_status ON loans (status);</code> - Index definition. It spends storage/write overhead to make common reads faster.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>CREATE TABLE loan_installments (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
27. <code>    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
28. <code>    loan_id       UUID          NOT NULL REFERENCES loans (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
29. <code>    seq           INTEGER       NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
30. <code>    due_date      DATE          NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
31. <code>    principal_due NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
32. <code>    interest_due  NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
33. <code>    total_due     NUMERIC(19,4) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
34. <code>    status        VARCHAR(20)   NOT NULL DEFAULT &#x27;PENDING&#x27;,</code> - SQL schema/data line executed by Flyway in version order.
35. <code>    paid_at       TIMESTAMPTZ,</code> - SQL schema/data line executed by Flyway in version order.
36. <code>    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),</code> - SQL schema/data line executed by Flyway in version order.
37. <code>    CONSTRAINT installment_status_check CHECK (status IN (&#x27;PENDING&#x27;, &#x27;PAID&#x27;, &#x27;OVERDUE&#x27;)),</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
38. <code>    CONSTRAINT installment_unique_seq UNIQUE (loan_id, seq)</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
39. <code>);</code> - SQL schema/data line executed by Flyway in version order.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>CREATE INDEX idx_installments_loan ON loan_installments (loan_id, seq);</code> - Index definition. It spends storage/write overhead to make common reads faster.

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

## `backend/src/main/resources/db/migration/V7__notifications_audit.sql`

### File Purpose
A Flyway migration: it evolves the PostgreSQL schema in an ordered, repeatable way.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````sql
-- Phase 6: notifications + append-only audit log.

CREATE TABLE notifications (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id   UUID         NOT NULL UNIQUE,
    user_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type       VARCHAR(40)  NOT NULL,
    title      VARCHAR(140) NOT NULL,
    message    VARCHAR(500) NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user      ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications (user_id, read);

CREATE TABLE audit_log (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id      UUID         NOT NULL UNIQUE,
    actor_user_id UUID,
    action        VARCHAR(40)  NOT NULL,
    entity_type   VARCHAR(40)  NOT NULL,
    entity_id     VARCHAR(64),
    message       VARCHAR(500) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_created ON audit_log (created_at DESC);
CREATE INDEX idx_audit_actor   ON audit_log (actor_user_id);
````

### Code Walkthrough
1. <code>-- Phase 6: notifications + append-only audit log.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>CREATE TABLE notifications (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
4. <code>    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
5. <code>    event_id   UUID         NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
6. <code>    user_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,</code> - Database integrity rule. PostgreSQL enforces it even if application code has a bug.
7. <code>    type       VARCHAR(40)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
8. <code>    title      VARCHAR(140) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
9. <code>    message    VARCHAR(500) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
10. <code>    read       BOOLEAN      NOT NULL DEFAULT FALSE,</code> - SQL schema/data line executed by Flyway in version order.
11. <code>    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()</code> - SQL schema/data line executed by Flyway in version order.
12. <code>);</code> - SQL schema/data line executed by Flyway in version order.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>CREATE INDEX idx_notifications_user      ON notifications (user_id, created_at DESC);</code> - Index definition. It spends storage/write overhead to make common reads faster.
15. <code>CREATE INDEX idx_notifications_user_read ON notifications (user_id, read);</code> - Index definition. It spends storage/write overhead to make common reads faster.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>CREATE TABLE audit_log (</code> - DDL statement creating a database table. PostgreSQL persists this structure before application entities can use it.
18. <code>    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),</code> - SQL schema/data line executed by Flyway in version order.
19. <code>    event_id      UUID         NOT NULL UNIQUE,</code> - SQL schema/data line executed by Flyway in version order.
20. <code>    actor_user_id UUID,</code> - SQL schema/data line executed by Flyway in version order.
21. <code>    action        VARCHAR(40)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
22. <code>    entity_type   VARCHAR(40)  NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
23. <code>    entity_id     VARCHAR(64),</code> - SQL schema/data line executed by Flyway in version order.
24. <code>    message       VARCHAR(500) NOT NULL,</code> - SQL schema/data line executed by Flyway in version order.
25. <code>    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()</code> - SQL schema/data line executed by Flyway in version order.
26. <code>);</code> - SQL schema/data line executed by Flyway in version order.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>CREATE INDEX idx_audit_created ON audit_log (created_at DESC);</code> - Index definition. It spends storage/write overhead to make common reads faster.
29. <code>CREATE INDEX idx_audit_actor   ON audit_log (actor_user_id);</code> - Index definition. It spends storage/write overhead to make common reads faster.

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

## `backend/src/test/java/com/bank/AbstractIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.springframework.boot.test.context.SpringBootTest` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.testcontainers.service.connection.ServiceConnection` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.context.DynamicPropertyRegistry` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.context.DynamicPropertySource` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.testcontainers.containers.GenericContainer` | Testcontainers dependency used to run real infrastructure during integration tests. |
| `org.testcontainers.containers.PostgreSQLContainer` | Testcontainers dependency used to run real infrastructure during integration tests. |
| `org.testcontainers.utility.DockerImageName` | Testcontainers dependency used to run real infrastructure during integration tests. |

### Complete Source
````java
package com.bank;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Shared base for integration tests: real Postgres + Redis via Testcontainers,
 * wired through Spring Boot's @ServiceConnection.
 *
 * <p>Uses the <b>singleton container</b> pattern — containers are started once in
 * a static initializer and never stopped, so their mapped ports stay stable for
 * the whole JVM. This keeps Spring's cached test context valid across multiple
 * test classes (a managed @Testcontainers lifecycle would stop the containers
 * after the first class and leave the cached context pointing at a dead port).
 */
@SpringBootTest
public abstract class AbstractIntegrationTest {

    @ServiceConnection
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @ServiceConnection(name = "redis")
    static final GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);

    static {
        postgres.start();
        redis.start();
    }

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("app.jwt.secret", () -> "test-secret-0123456789-0123456789-banking-system-key");
    }
}
````

### Code Walkthrough
1. <code>package com.bank;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.springframework.boot.test.context.SpringBootTest;</code> - Imports `org.springframework.boot.test.context.SpringBootTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.boot.testcontainers.service.connection.ServiceConnection;</code> - Imports `org.springframework.boot.testcontainers.service.connection.ServiceConnection` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.test.context.DynamicPropertyRegistry;</code> - Imports `org.springframework.test.context.DynamicPropertyRegistry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.test.context.DynamicPropertySource;</code> - Imports `org.springframework.test.context.DynamicPropertySource` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.testcontainers.containers.GenericContainer;</code> - Imports `org.testcontainers.containers.GenericContainer` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.testcontainers.containers.PostgreSQLContainer;</code> - Imports `org.testcontainers.containers.PostgreSQLContainer` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.testcontainers.utility.DockerImageName;</code> - Imports `org.testcontainers.utility.DockerImageName` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * Shared base for integration tests: real Postgres + Redis via Testcontainers,</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * wired through Spring Boot&#x27;s @ServiceConnection.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> *</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> * &lt;p&gt;Uses the &lt;b&gt;singleton container&lt;/b&gt; pattern — containers are started once in</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code> * a static initializer and never stopped, so their mapped ports stay stable for</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code> * the whole JVM. This keeps Spring&#x27;s cached test context valid across multiple</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code> * test classes (a managed @Testcontainers lifecycle would stop the containers</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code> * after the first class and leave the cached context pointing at a dead port).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
20. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <code>@SpringBootTest</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>public abstract class AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @ServiceConnection</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
25. <code>    static final PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;(&quot;postgres:16-alpine&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @ServiceConnection(name = &quot;redis&quot;)</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
28. <code>    static final GenericContainer&lt;?&gt; redis =</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>            new GenericContainer&lt;&gt;(DockerImageName.parse(&quot;redis:7-alpine&quot;)).withExposedPorts(6379);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    static {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        postgres.start();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
33. <code>        redis.start();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @DynamicPropertySource</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
37. <code>    static void props(DynamicPropertyRegistry registry) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>        registry.add(&quot;app.jwt.secret&quot;, () -&gt; &quot;test-secret-0123456789-0123456789-banking-system-key&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/test/java/com/bank/SmokeApplicationTests.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |

### Complete Source
````java
package com.bank;

import org.junit.jupiter.api.Test;

/**
 * Phase 0 smoke test: boots the full Spring context against the shared Postgres +
 * Redis containers (see {@link AbstractIntegrationTest}) so Flyway runs all
 * migrations. If this passes, the core wiring is sound.
 */
class SmokeApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {
        // Context startup (incl. Flyway migrations) is the assertion.
    }
}
````

### Code Walkthrough
1. <code>package com.bank;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> * Phase 0 smoke test: boots the full Spring context against the shared Postgres +</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code> * Redis containers (see {@link AbstractIntegrationTest}) so Flyway runs all</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * migrations. If this passes, the core wiring is sound.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>class SmokeApplicationTests extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
13. <code>    void contextLoads() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <code>        // Context startup (incl. Flyway migrations) is the assertion.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
16. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/test/java/com/bank/account/AccountLedgerIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.jdbc.core.JdbcTemplate` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `static org.assertj.core.api.Assertions.assertThat` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.account;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class AccountLedgerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    JdbcTemplate jdbc;

    private String registerToken(String email) throws Exception {
        String body = """
                {"email":"%s","password":"Secret123","firstName":"Test","lastName":"User"}
                """.formatted(email);
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private String createAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.balance", org.hamcrest.Matchers.is(0)))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("id").asText();
    }

    private void amount(String token, String accountId, String op, String amount) throws Exception {
        mvc.perform(post("/api/v1/accounts/" + accountId + "/" + op)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":" + amount + "}"))
                .andExpect(status().isOk());
    }

    @Test
    void depositAndWithdrawAdjustBalance() throws Exception {
        String token = registerToken("acct1@example.com");
        String accountId = createAccount(token);

        amount(token, accountId, "deposit", "100.00");
        amount(token, accountId, "withdraw", "30.00");

        mvc.perform(get("/api/v1/accounts/" + accountId).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance", org.hamcrest.Matchers.is(70.00)));

        // History: newest first, with running balanceAfter.
        String txns = mvc.perform(get("/api/v1/accounts/" + accountId + "/transactions")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode arr = mapper.readTree(txns);
        assertThat(arr).hasSize(2);
        assertThat(arr.get(0).get("type").asText()).isEqualTo("WITHDRAWAL");
        assertThat(arr.get(0).get("balanceAfter").asDouble()).isEqualTo(70.00);
        assertThat(arr.get(1).get("type").asText()).isEqualTo("DEPOSIT");
        assertThat(arr.get(1).get("balanceAfter").asDouble()).isEqualTo(100.00);
    }

    @Test
    void withdrawBeyondBalanceIsRejected() throws Exception {
        String token = registerToken("acct2@example.com");
        String accountId = createAccount(token);

        mvc.perform(post("/api/v1/accounts/" + accountId + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":50.00}"))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void everyTransactionBalancesToZero() throws Exception {
        String token = registerToken("acct3@example.com");
        String accountId = createAccount(token);
        amount(token, accountId, "deposit", "250.50");
        amount(token, accountId, "withdraw", "100.25");

        // The core double-entry invariant: each transaction's signed entries sum to zero.
        List<java.math.BigDecimal> sums = jdbc.query(
                "select sum(case when direction = 'CREDIT' then amount else -amount end) as s "
                        + "from ledger_entries group by transaction_id",
                (rs, n) -> rs.getBigDecimal("s"));
        assertThat(sums).isNotEmpty();
        assertThat(sums).allSatisfy(s -> assertThat(s.signum()).isZero());
    }

    @Test
    void cannotAccessAnotherUsersAccount() throws Exception {
        String alice = registerToken("alice.acct@example.com");
        String accountId = createAccount(alice);
        String bob = registerToken("bob.acct@example.com");

        mvc.perform(get("/api/v1/accounts/" + accountId).header("Authorization", "Bearer " + bob))
                .andExpect(status().isNotFound());
        mvc.perform(post("/api/v1/accounts/" + accountId + "/deposit")
                        .header("Authorization", "Bearer " + bob)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":10.00}"))
                .andExpect(status().isNotFound());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.jdbc.core.JdbcTemplate;</code> - Imports `org.springframework.jdbc.core.JdbcTemplate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>import static org.assertj.core.api.Assertions.assertThat;</code> - Imports `static org.assertj.core.api.Assertions.assertThat` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>class AccountLedgerIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    JdbcTemplate jdbc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    private String registerToken(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        String body = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;Test&quot;,&quot;lastName&quot;:&quot;User&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                &quot;&quot;&quot;.formatted(email);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
37. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    private String createAccount(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>        String json = mvc.perform(post(&quot;/api/v1/accounts&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                        .content(&quot;{\&quot;type\&quot;:\&quot;CHECKING\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                .andExpect(jsonPath(&quot;$.balance&quot;, org.hamcrest.Matchers.is(0)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
52. <code>        return mapper.readTree(json).get(&quot;id&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
53. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    private void amount(String token, String accountId, String op, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/&quot; + op)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
58. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                        .content(&quot;{\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
61. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
63. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
64. <code>    void depositAndWithdrawAdjustBalance() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>        String token = registerToken(&quot;acct1@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
66. <code>        String accountId = createAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
67. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
68. <code>        amount(token, accountId, &quot;deposit&quot;, &quot;100.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
69. <code>        amount(token, accountId, &quot;withdraw&quot;, &quot;30.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>        mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId).header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
72. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
73. <code>                .andExpect(jsonPath(&quot;$.balance&quot;, org.hamcrest.Matchers.is(70.00)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
75. <code>        // History: newest first, with running balanceAfter.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
76. <code>        String txns = mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId + &quot;/transactions&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
79. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
80. <code>        JsonNode arr = mapper.readTree(txns);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
81. <code>        assertThat(arr).hasSize(2);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
82. <code>        assertThat(arr.get(0).get(&quot;type&quot;).asText()).isEqualTo(&quot;WITHDRAWAL&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
83. <code>        assertThat(arr.get(0).get(&quot;balanceAfter&quot;).asDouble()).isEqualTo(70.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
84. <code>        assertThat(arr.get(1).get(&quot;type&quot;).asText()).isEqualTo(&quot;DEPOSIT&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
85. <code>        assertThat(arr.get(1).get(&quot;balanceAfter&quot;).asDouble()).isEqualTo(100.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
86. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
87. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
88. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
89. <code>    void withdrawBeyondBalanceIsRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <code>        String token = registerToken(&quot;acct2@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
91. <code>        String accountId = createAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
92. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
93. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/withdraw&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
94. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
95. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
96. <code>                        .content(&quot;{\&quot;amount\&quot;:50.00}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
97. <code>                .andExpect(status().isUnprocessableEntity());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
98. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
99. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
100. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
101. <code>    void everyTransactionBalancesToZero() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
102. <code>        String token = registerToken(&quot;acct3@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
103. <code>        String accountId = createAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
104. <code>        amount(token, accountId, &quot;deposit&quot;, &quot;250.50&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
105. <code>        amount(token, accountId, &quot;withdraw&quot;, &quot;100.25&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
106. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
107. <code>        // The core double-entry invariant: each transaction&#x27;s signed entries sum to zero.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
108. <code>        List&lt;java.math.BigDecimal&gt; sums = jdbc.query(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
109. <code>                &quot;select sum(case when direction = &#x27;CREDIT&#x27; then amount else -amount end) as s &quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
110. <code>                        + &quot;from ledger_entries group by transaction_id&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
111. <code>                (rs, n) -&gt; rs.getBigDecimal(&quot;s&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
112. <code>        assertThat(sums).isNotEmpty();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
113. <code>        assertThat(sums).allSatisfy(s -&gt; assertThat(s.signum()).isZero());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
114. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
115. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
116. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
117. <code>    void cannotAccessAnotherUsersAccount() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
118. <code>        String alice = registerToken(&quot;alice.acct@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
119. <code>        String accountId = createAccount(alice);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
120. <code>        String bob = registerToken(&quot;bob.acct@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
121. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
122. <code>        mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId).header(&quot;Authorization&quot;, &quot;Bearer &quot; + bob))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
123. <code>                .andExpect(status().isNotFound());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
124. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/deposit&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
125. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + bob)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
126. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
127. <code>                        .content(&quot;{\&quot;amount\&quot;:10.00}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
128. <code>                .andExpect(status().isNotFound());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
129. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
130. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 33 | `private String registerToken(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `registerToken`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 44 | `private String createAccount(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `createAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 55 | `private void amount(String token, String accountId, String op, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `amount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/auth/AuthFlowIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `static org.hamcrest.Matchers.is` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.auth;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@AutoConfigureMockMvc
class AuthFlowIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    private JsonNode register(String email) throws Exception {
        String body = """
                {"email":"%s","password":"Secret123","firstName":"Ada","lastName":"Lovelace"}
                """.formatted(email);
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    @Test
    void registerThenFetchProfile() throws Exception {
        JsonNode tokens = register("ada@example.com");
        String access = tokens.get("accessToken").asText();

        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + access))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("ada@example.com")))
                .andExpect(jsonPath("$.kycStatus", is("PENDING")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));
    }

    @Test
    void meRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/v1/users/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        register("grace@example.com");
        String body = """
                {"email":"grace@example.com","password":"WrongPass1"}
                """;
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshTokenRotates() throws Exception {
        JsonNode tokens = register("alan@example.com");
        String refresh = tokens.get("refreshToken").asText();

        String body = """
                {"refreshToken":"%s"}
                """.formatted(refresh);
        // First refresh succeeds.
        mvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
        // Reusing the now-rotated token fails.
        mvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointEnforcesRole() throws Exception {
        JsonNode customer = register("bob@example.com");
        String customerAccess = customer.get("accessToken").asText();

        // Customer is forbidden.
        mvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + customerAccess))
                .andExpect(status().isForbidden());

        // Seeded admin is allowed.
        String adminLogin = """
                {"email":"admin@bank.local","password":"Admin123!"}
                """;
        String adminJson = mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(adminLogin))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String adminAccess = mapper.readTree(adminJson).get("accessToken").asText();

        mvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + adminAccess))
                .andExpect(status().isOk());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>import static org.hamcrest.Matchers.is;</code> - Imports `static org.hamcrest.Matchers.is` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
19. <code>class AuthFlowIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    private JsonNode register(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        String body = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;Ada&quot;,&quot;lastName&quot;:&quot;Lovelace&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                &quot;&quot;&quot;.formatted(email);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
31. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        return mapper.readTree(json);</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    void registerThenFetchProfile() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        JsonNode tokens = register(&quot;ada@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
41. <code>        String access = tokens.get(&quot;accessToken&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>        mvc.perform(get(&quot;/api/v1/users/me&quot;).header(&quot;Authorization&quot;, &quot;Bearer &quot; + access))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
44. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
45. <code>                .andExpect(jsonPath(&quot;$.email&quot;, is(&quot;ada@example.com&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                .andExpect(jsonPath(&quot;$.kycStatus&quot;, is(&quot;PENDING&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>                .andExpect(jsonPath(&quot;$.role&quot;, is(&quot;CUSTOMER&quot;)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
48. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
51. <code>    void meRequiresAuthentication() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <code>        mvc.perform(get(&quot;/api/v1/users/me&quot;)).andExpect(status().isUnauthorized());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
53. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
56. <code>    void loginWithWrongPasswordIsRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <code>        register(&quot;grace@example.com&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
58. <code>        String body = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                {&quot;email&quot;:&quot;grace@example.com&quot;,&quot;password&quot;:&quot;WrongPass1&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                &quot;&quot;&quot;;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
61. <code>        mvc.perform(post(&quot;/api/v1/auth/login&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
62. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>                .andExpect(status().isUnauthorized());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
67. <code>    void refreshTokenRotates() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <code>        JsonNode tokens = register(&quot;alan@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
69. <code>        String refresh = tokens.get(&quot;refreshToken&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>        String body = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
72. <code>                {&quot;refreshToken&quot;:&quot;%s&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
73. <code>                &quot;&quot;&quot;.formatted(refresh);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <code>        // First refresh succeeds.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
75. <code>        mvc.perform(post(&quot;/api/v1/auth/refresh&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                .andExpect(jsonPath(&quot;$.accessToken&quot;).exists());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>        // Reusing the now-rotated token fails.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
80. <code>        mvc.perform(post(&quot;/api/v1/auth/refresh&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
81. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
82. <code>                .andExpect(status().isUnauthorized());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
83. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
84. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
85. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
86. <code>    void adminEndpointEnforcesRole() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
87. <code>        JsonNode customer = register(&quot;bob@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
88. <code>        String customerAccess = customer.get(&quot;accessToken&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
89. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
90. <code>        // Customer is forbidden.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
91. <code>        mvc.perform(get(&quot;/api/v1/admin/users&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
92. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + customerAccess))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
93. <code>                .andExpect(status().isForbidden());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
94. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
95. <code>        // Seeded admin is allowed.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
96. <code>        String adminLogin = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
97. <code>                {&quot;email&quot;:&quot;admin@bank.local&quot;,&quot;password&quot;:&quot;Admin123!&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
98. <code>                &quot;&quot;&quot;;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
99. <code>        String adminJson = mvc.perform(post(&quot;/api/v1/auth/login&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
100. <code>                        .contentType(MediaType.APPLICATION_JSON).content(adminLogin))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
101. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
102. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
103. <code>        String adminAccess = mapper.readTree(adminJson).get(&quot;accessToken&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
104. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
105. <code>        mvc.perform(get(&quot;/api/v1/admin/users&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
106. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + adminAccess))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
107. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
108. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
109. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 27 | `private JsonNode register(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `register`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/card/CardIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `static org.assertj.core.api.Assertions.assertThat` | External or local dependency required by references in this file. |
| `static org.hamcrest.Matchers.is` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.card;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class CardIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    private String token(String email) throws Exception {
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"Secret123","firstName":"C","lastName":"H"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private String openAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("id").asText();
    }

    private void deposit(String token, String accountId, String amount) throws Exception {
        mvc.perform(post("/api/v1/accounts/" + accountId + "/deposit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":" + amount + "}"))
                .andExpect(status().isOk());
    }

    private JsonNode issueCard(String token, String accountId, String limit) throws Exception {
        String json = mvc.perform(post("/api/v1/cards")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"monthlyLimit\":" + limit + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private int pay(String token, String cardId, String amount) throws Exception {
        return mvc.perform(post("/api/v1/cards/" + cardId + "/pay")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"merchant\":\"Acme\",\"amount\":" + amount + "}"))
                .andReturn().getResponse().getStatus();
    }

    @Test
    void issueReturnsFullPanOnceAndStoresLast4() throws Exception {
        String token = token("card-issue@example.com");
        String acct = openAccount(token);
        JsonNode res = issueCard(token, acct, "0");

        String pan = res.get("cardNumber").asText();
        assertThat(pan).hasSize(16);
        assertThat(res.get("card").get("last4").asText()).isEqualTo(pan.substring(12));
        assertThat(res.get("card").get("brand").asText()).isEqualTo("VISA");
    }

    @Test
    void cardPaymentDebitsAccount() throws Exception {
        String token = token("card-pay@example.com");
        String acct = openAccount(token);
        deposit(token, acct, "200.00");
        String cardId = issueCard(token, acct, "0").get("card").get("id").asText();

        mvc.perform(post("/api/v1/cards/" + cardId + "/pay")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"merchant\":\"Coffee Co\",\"amount\":50.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountBalanceAfter", is(150.00)));
    }

    @Test
    void monthlyLimitIsEnforced() throws Exception {
        String token = token("card-limit@example.com");
        String acct = openAccount(token);
        deposit(token, acct, "1000.00");
        String cardId = issueCard(token, acct, "100.00").get("card").get("id").asText();

        assertThat(pay(token, cardId, "60.00")).isEqualTo(200);
        assertThat(pay(token, cardId, "60.00")).isEqualTo(422); // 60 + 60 > 100
    }

    @Test
    void frozenCardIsDeclined() throws Exception {
        String token = token("card-frozen@example.com");
        String acct = openAccount(token);
        deposit(token, acct, "100.00");
        String cardId = issueCard(token, acct, "0").get("card").get("id").asText();

        mvc.perform(post("/api/v1/cards/" + cardId + "/freeze")
                .header("Authorization", "Bearer " + token)).andExpect(status().isOk());
        assertThat(pay(token, cardId, "10.00")).isEqualTo(422);
    }

    @Test
    void insufficientFundsIsRejected() throws Exception {
        String token = token("card-funds@example.com");
        String acct = openAccount(token);
        String cardId = issueCard(token, acct, "0").get("card").get("id").asText();
        assertThat(pay(token, cardId, "10.00")).isEqualTo(422);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>import static org.assertj.core.api.Assertions.assertThat;</code> - Imports `static org.assertj.core.api.Assertions.assertThat` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import static org.hamcrest.Matchers.is;</code> - Imports `static org.hamcrest.Matchers.is` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
19. <code>class CardIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    private String token(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                        .content(&quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;C&quot;,&quot;lastName&quot;:&quot;H&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                                &quot;&quot;&quot;.formatted(email)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    private String openAccount(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        String json = mvc.perform(post(&quot;/api/v1/accounts&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;type\&quot;:\&quot;CHECKING\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>        return mapper.readTree(json).get(&quot;id&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    private void deposit(String token, String accountId, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/deposit&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
52. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    private JsonNode issueCard(String token, String accountId, String limit) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        String json = mvc.perform(post(&quot;/api/v1/cards&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
56. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
58. <code>                        .content(&quot;{\&quot;accountId\&quot;:\&quot;&quot; + accountId + &quot;\&quot;,\&quot;monthlyLimit\&quot;:&quot; + limit + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
61. <code>        return mapper.readTree(json);</code> - Returns a value/reference to the caller and ends this execution path.
62. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
64. <code>    private int pay(String token, String cardId, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>        return mvc.perform(post(&quot;/api/v1/cards/&quot; + cardId + &quot;/pay&quot;)</code> - Returns a value/reference to the caller and ends this execution path.
66. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
67. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
68. <code>                        .content(&quot;{\&quot;merchant\&quot;:\&quot;Acme\&quot;,\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
69. <code>                .andReturn().getResponse().getStatus();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
70. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
72. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
73. <code>    void issueReturnsFullPanOnceAndStoresLast4() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <code>        String token = token(&quot;card-issue@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
75. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
76. <code>        JsonNode res = issueCard(token, acct, &quot;0&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
77. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
78. <code>        String pan = res.get(&quot;cardNumber&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
79. <code>        assertThat(pan).hasSize(16);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
80. <code>        assertThat(res.get(&quot;card&quot;).get(&quot;last4&quot;).asText()).isEqualTo(pan.substring(12));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
81. <code>        assertThat(res.get(&quot;card&quot;).get(&quot;brand&quot;).asText()).isEqualTo(&quot;VISA&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
82. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
85. <code>    void cardPaymentDebitsAccount() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <code>        String token = token(&quot;card-pay@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
87. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
88. <code>        deposit(token, acct, &quot;200.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
89. <code>        String cardId = issueCard(token, acct, &quot;0&quot;).get(&quot;card&quot;).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
90. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
91. <code>        mvc.perform(post(&quot;/api/v1/cards/&quot; + cardId + &quot;/pay&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
92. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
93. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
94. <code>                        .content(&quot;{\&quot;merchant\&quot;:\&quot;Coffee Co\&quot;,\&quot;amount\&quot;:50.00}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
95. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
96. <code>                .andExpect(jsonPath(&quot;$.accountBalanceAfter&quot;, is(150.00)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
97. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
98. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
99. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
100. <code>    void monthlyLimitIsEnforced() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
101. <code>        String token = token(&quot;card-limit@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
102. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
103. <code>        deposit(token, acct, &quot;1000.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
104. <code>        String cardId = issueCard(token, acct, &quot;100.00&quot;).get(&quot;card&quot;).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
105. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
106. <code>        assertThat(pay(token, cardId, &quot;60.00&quot;)).isEqualTo(200);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
107. <code>        assertThat(pay(token, cardId, &quot;60.00&quot;)).isEqualTo(422); // 60 + 60 &gt; 100</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
108. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
109. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
110. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
111. <code>    void frozenCardIsDeclined() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
112. <code>        String token = token(&quot;card-frozen@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
113. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
114. <code>        deposit(token, acct, &quot;100.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
115. <code>        String cardId = issueCard(token, acct, &quot;0&quot;).get(&quot;card&quot;).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
116. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
117. <code>        mvc.perform(post(&quot;/api/v1/cards/&quot; + cardId + &quot;/freeze&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
118. <code>                .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)).andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
119. <code>        assertThat(pay(token, cardId, &quot;10.00&quot;)).isEqualTo(422);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
120. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
121. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
122. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
123. <code>    void insufficientFundsIsRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
124. <code>        String token = token(&quot;card-funds@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
125. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
126. <code>        String cardId = issueCard(token, acct, &quot;0&quot;).get(&quot;card&quot;).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
127. <code>        assertThat(pay(token, cardId, &quot;10.00&quot;)).isEqualTo(422);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
128. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
129. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 27 | `private String token(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `token`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `private String openAccount(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `openAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 47 | `private void deposit(String token, String accountId, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `deposit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 54 | `private JsonNode issueCard(String token, String accountId, String limit) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `issueCard`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 64 | `private int pay(String token, String cardId, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `pay`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/loan/AmortizationCalculatorTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.service.AmortizationCalculator` | Project-local dependency connecting this file to another banking module. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `static org.assertj.core.api.Assertions.assertThat` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.loan;

import com.bank.loan.service.AmortizationCalculator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class AmortizationCalculatorTest {

    private final AmortizationCalculator calc = new AmortizationCalculator();

    private BigDecimal sumPrincipal(List<AmortizationCalculator.Installment> s) {
        return s.stream().map(AmortizationCalculator.Installment::principalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Test
    void amortizesStandardLoan() {
        // 1200 @ 12% annual over 12 months -> ~106.62/month.
        var schedule = calc.schedule(new BigDecimal("1200.00"), new BigDecimal("0.12"), 12,
                LocalDate.of(2026, 1, 1));

        assertThat(schedule).hasSize(12);
        assertThat(schedule.get(0).totalDue()).isEqualByComparingTo("106.62");
        assertThat(schedule.get(0).interestDue()).isEqualByComparingTo("12.00"); // 1200 * 0.01
        assertThat(schedule.get(0).principalDue()).isEqualByComparingTo("94.62");
        // Principal fully repaid (no drift).
        assertThat(sumPrincipal(schedule)).isEqualByComparingTo("1200.00");
        // Due dates are monthly.
        assertThat(schedule.get(0).dueDate()).isEqualTo(LocalDate.of(2026, 2, 1));
        assertThat(schedule.get(11).dueDate()).isEqualTo(LocalDate.of(2027, 1, 1));
    }

    @Test
    void zeroRateSplitsEvenly() {
        var schedule = calc.schedule(new BigDecimal("1200.00"), BigDecimal.ZERO, 12,
                LocalDate.of(2026, 1, 1));

        assertThat(schedule).hasSize(12);
        assertThat(schedule).allSatisfy(i -> {
            assertThat(i.interestDue()).isEqualByComparingTo("0.00");
            assertThat(i.totalDue()).isEqualByComparingTo("100.00");
        });
        assertThat(sumPrincipal(schedule)).isEqualByComparingTo("1200.00");
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.service.AmortizationCalculator;</code> - Imports `com.bank.loan.service.AmortizationCalculator` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>import static org.assertj.core.api.Assertions.assertThat;</code> - Imports `static org.assertj.core.api.Assertions.assertThat` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>class AmortizationCalculatorTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    private final AmortizationCalculator calc = new AmortizationCalculator();</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    private BigDecimal sumPrincipal(List&lt;AmortizationCalculator.Installment&gt; s) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>        return s.stream().map(AmortizationCalculator.Installment::principalDue)</code> - Returns a value/reference to the caller and ends this execution path.
18. <code>                .reduce(BigDecimal.ZERO, BigDecimal::add);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
19. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    void amortizesStandardLoan() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        // 1200 @ 12% annual over 12 months -&gt; ~106.62/month.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code>        var schedule = calc.schedule(new BigDecimal(&quot;1200.00&quot;), new BigDecimal(&quot;0.12&quot;), 12,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
25. <code>                LocalDate.of(2026, 1, 1));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>        assertThat(schedule).hasSize(12);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
28. <code>        assertThat(schedule.get(0).totalDue()).isEqualByComparingTo(&quot;106.62&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <code>        assertThat(schedule.get(0).interestDue()).isEqualByComparingTo(&quot;12.00&quot;); // 1200 * 0.01</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>        assertThat(schedule.get(0).principalDue()).isEqualByComparingTo(&quot;94.62&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
31. <code>        // Principal fully repaid (no drift).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
32. <code>        assertThat(sumPrincipal(schedule)).isEqualByComparingTo(&quot;1200.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
33. <code>        // Due dates are monthly.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
34. <code>        assertThat(schedule.get(0).dueDate()).isEqualTo(LocalDate.of(2026, 2, 1));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        assertThat(schedule.get(11).dueDate()).isEqualTo(LocalDate.of(2027, 1, 1));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    void zeroRateSplitsEvenly() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        var schedule = calc.schedule(new BigDecimal(&quot;1200.00&quot;), BigDecimal.ZERO, 12,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                LocalDate.of(2026, 1, 1));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>        assertThat(schedule).hasSize(12);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>        assertThat(schedule).allSatisfy(i -&gt; {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>            assertThat(i.interestDue()).isEqualByComparingTo(&quot;0.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
46. <code>            assertThat(i.totalDue()).isEqualByComparingTo(&quot;100.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
47. <code>        });</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
48. <code>        assertThat(sumPrincipal(schedule)).isEqualByComparingTo(&quot;1200.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
49. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 16 | `private BigDecimal sumPrincipal(List&lt;AmortizationCalculator.Installment&gt; s)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `sumPrincipal`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/loan/LoanIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.jdbc.core.JdbcTemplate` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `static org.assertj.core.api.Assertions.assertThat` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.loan;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class LoanIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    JdbcTemplate jdbc;

    private String token(String email) throws Exception {
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"Secret123","firstName":"L","lastName":"N"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private String adminToken() throws Exception {
        String json = mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@bank.local\",\"password\":\"Admin123!\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private String meId(String token) throws Exception {
        String json = mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("userId").asText();
    }

    private void verifyKyc(String adminToken, String userId) throws Exception {
        mvc.perform(post("/api/v1/admin/users/" + userId + "/kyc")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"VERIFIED\"}"))
                .andExpect(status().isOk());
    }

    private String openAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("id").asText();
    }

    private void deposit(String token, String accountId, String amount) throws Exception {
        mvc.perform(post("/api/v1/accounts/" + accountId + "/deposit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":" + amount + "}"))
                .andExpect(status().isOk());
    }

    private JsonNode apply(String token, String accountId, String principal, int term) throws Exception {
        String json = mvc.perform(post("/api/v1/loans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"principal\":" + principal
                                + ",\"termMonths\":" + term + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    @Test
    void applyRequiresVerifiedKyc() throws Exception {
        String token = token("loan-nokyc@example.com");
        String acct = openAccount(token);
        mvc.perform(post("/api/v1/loans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + acct + "\",\"principal\":300,\"termMonths\":3}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void fullLoanLifecycle() throws Exception {
        String token = token("loan-life@example.com");
        String admin = adminToken();
        verifyKyc(admin, meId(token));
        String acct = openAccount(token);
        deposit(token, acct, "100.00"); // buffer to cover interest

        String loanId = apply(token, acct, "300.00", 3).get("id").asText();

        // Customer cannot approve.
        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        // Admin approves -> schedule generated and principal disbursed.
        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loan.status").value("ACTIVE"))
                .andExpect(jsonPath("$.schedule.length()").value(3));
        assertThat(balance(token, acct)).isEqualTo(400.00); // 100 buffer + 300 principal

        // Repay all three installments -> PAID_OFF.
        String last = "";
        for (int i = 0; i < 3; i++) {
            last = mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
        }
        assertThat(mapper.readTree(last).get("loan").get("status").asText()).isEqualTo("PAID_OFF");

        // The whole ledger still balances to zero.
        BigDecimal sum = jdbc.queryForObject(
                "select coalesce(sum(case when direction='CREDIT' then amount else -amount end),0) "
                        + "from ledger_entries", BigDecimal.class);
        assertThat(sum.signum()).isZero();
    }

    @Test
    void repaymentWithoutFundsIsRejected() throws Exception {
        String token = token("loan-broke@example.com");
        String admin = adminToken();
        verifyKyc(admin, meId(token));
        String acct = openAccount(token);
        String loanId = apply(token, acct, "300.00", 3).get("id").asText();

        mvc.perform(post("/api/v1/admin/loans/" + loanId + "/approve")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk());
        // Drain the disbursed principal, then a repayment must be declined.
        mvc.perform(post("/api/v1/accounts/" + acct + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":300.00}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/v1/loans/" + loanId + "/repay")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnprocessableEntity());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.jdbc.core.JdbcTemplate;</code> - Imports `org.springframework.jdbc.core.JdbcTemplate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>import static org.assertj.core.api.Assertions.assertThat;</code> - Imports `static org.assertj.core.api.Assertions.assertThat` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>class LoanIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    JdbcTemplate jdbc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    private String token(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                        .content(&quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;L&quot;,&quot;lastName&quot;:&quot;N&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>                                &quot;&quot;&quot;.formatted(email)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    private String adminToken() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/login&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>                        .content(&quot;{\&quot;email\&quot;:\&quot;admin@bank.local\&quot;,\&quot;password\&quot;:\&quot;Admin123!\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
50. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    private String meId(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <code>        String json = mvc.perform(get(&quot;/api/v1/users/me&quot;).header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
55. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
56. <code>        return mapper.readTree(json).get(&quot;userId&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
57. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
59. <code>    private void verifyKyc(String adminToken, String userId) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>        mvc.perform(post(&quot;/api/v1/admin/users/&quot; + userId + &quot;/kyc&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
61. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + adminToken)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
62. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;status\&quot;:\&quot;VERIFIED\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    private String openAccount(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>        String json = mvc.perform(post(&quot;/api/v1/accounts&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
68. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
69. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;type\&quot;:\&quot;CHECKING\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
70. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
71. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
72. <code>        return mapper.readTree(json).get(&quot;id&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
73. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
75. <code>    private void deposit(String token, String accountId, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/deposit&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
79. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
80. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
81. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
82. <code>    private JsonNode apply(String token, String accountId, String principal, int term) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <code>        String json = mvc.perform(post(&quot;/api/v1/loans&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
84. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
85. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
86. <code>                        .content(&quot;{\&quot;accountId\&quot;:\&quot;&quot; + accountId + &quot;\&quot;,\&quot;principal\&quot;:&quot; + principal</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
87. <code>                                + &quot;,\&quot;termMonths\&quot;:&quot; + term + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
88. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
89. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
90. <code>        return mapper.readTree(json);</code> - Returns a value/reference to the caller and ends this execution path.
91. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
92. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
93. <code>    private double balance(String token, String accountId) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
94. <code>        String json = mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
95. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
96. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
97. <code>        return mapper.readTree(json).get(&quot;balance&quot;).asDouble();</code> - Returns a value/reference to the caller and ends this execution path.
98. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
99. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
100. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
101. <code>    void applyRequiresVerifiedKyc() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
102. <code>        String token = token(&quot;loan-nokyc@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
103. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
104. <code>        mvc.perform(post(&quot;/api/v1/loans&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
105. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
106. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
107. <code>                        .content(&quot;{\&quot;accountId\&quot;:\&quot;&quot; + acct + &quot;\&quot;,\&quot;principal\&quot;:300,\&quot;termMonths\&quot;:3}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
108. <code>                .andExpect(status().isBadRequest());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
109. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
110. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
111. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
112. <code>    void fullLoanLifecycle() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
113. <code>        String token = token(&quot;loan-life@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
114. <code>        String admin = adminToken();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
115. <code>        verifyKyc(admin, meId(token));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
116. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
117. <code>        deposit(token, acct, &quot;100.00&quot;); // buffer to cover interest</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
118. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
119. <code>        String loanId = apply(token, acct, &quot;300.00&quot;, 3).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
120. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
121. <code>        // Customer cannot approve.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
122. <code>        mvc.perform(post(&quot;/api/v1/admin/loans/&quot; + loanId + &quot;/approve&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
123. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
124. <code>                .andExpect(status().isForbidden());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
125. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
126. <code>        // Admin approves -&gt; schedule generated and principal disbursed.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
127. <code>        mvc.perform(post(&quot;/api/v1/admin/loans/&quot; + loanId + &quot;/approve&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
128. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + admin))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
129. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
130. <code>                .andExpect(jsonPath(&quot;$.loan.status&quot;).value(&quot;ACTIVE&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
131. <code>                .andExpect(jsonPath(&quot;$.schedule.length()&quot;).value(3));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
132. <code>        assertThat(balance(token, acct)).isEqualTo(400.00); // 100 buffer + 300 principal</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
133. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
134. <code>        // Repay all three installments -&gt; PAID_OFF.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
135. <code>        String last = &quot;&quot;;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
136. <code>        for (int i = 0; i &lt; 3; i++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
137. <code>            last = mvc.perform(post(&quot;/api/v1/loans/&quot; + loanId + &quot;/repay&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
138. <code>                            .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
139. <code>                    .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
140. <code>                    .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
141. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
142. <code>        assertThat(mapper.readTree(last).get(&quot;loan&quot;).get(&quot;status&quot;).asText()).isEqualTo(&quot;PAID_OFF&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
143. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
144. <code>        // The whole ledger still balances to zero.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
145. <code>        BigDecimal sum = jdbc.queryForObject(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
146. <code>                &quot;select coalesce(sum(case when direction=&#x27;CREDIT&#x27; then amount else -amount end),0) &quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
147. <code>                        + &quot;from ledger_entries&quot;, BigDecimal.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
148. <code>        assertThat(sum.signum()).isZero();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
149. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
150. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
151. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
152. <code>    void repaymentWithoutFundsIsRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
153. <code>        String token = token(&quot;loan-broke@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
154. <code>        String admin = adminToken();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
155. <code>        verifyKyc(admin, meId(token));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
156. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
157. <code>        String loanId = apply(token, acct, &quot;300.00&quot;, 3).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
158. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
159. <code>        mvc.perform(post(&quot;/api/v1/admin/loans/&quot; + loanId + &quot;/approve&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
160. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + admin))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
161. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
162. <code>        // Drain the disbursed principal, then a repayment must be declined.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
163. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + acct + &quot;/withdraw&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
164. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
165. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;amount\&quot;:300.00}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
166. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
167. <code>        mvc.perform(post(&quot;/api/v1/loans/&quot; + loanId + &quot;/repay&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
168. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
169. <code>                .andExpect(status().isUnprocessableEntity());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
170. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
171. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 33 | `private String token(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `token`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 44 | `private String adminToken() throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `adminToken`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 53 | `private String meId(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `meId`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 59 | `private void verifyKyc(String adminToken, String userId) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `verifyKyc`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 66 | `private String openAccount(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `openAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 75 | `private void deposit(String token, String accountId, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `deposit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 82 | `private JsonNode apply(String token, String accountId, String principal, int term) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `apply`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 93 | `private double balance(String token, String accountId) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `balance`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/payment/PaymentIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `static org.assertj.core.api.Assertions.assertThat` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.payment;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class PaymentIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    private String token(String email) throws Exception {
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"Secret123","firstName":"P","lastName":"Y"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private String openAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("id").asText();
    }

    private JsonNode topUp(String token, String accountId, String amount) throws Exception {
        String json = mvc.perform(post("/api/v1/payments/top-up")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountId\":\"" + accountId + "\",\"amount\":" + amount + "}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    @Test
    void topUpThenConfirmCreditsAccount() throws Exception {
        String token = token("pay-topup@example.com");
        String acct = openAccount(token);

        JsonNode created = topUp(token, acct, "100.00");
        assertThat(created.get("manualConfirm").asBoolean()).isTrue(); // simulated gateway
        String paymentId = created.get("paymentId").asText();

        mvc.perform(post("/api/v1/payments/" + paymentId + "/confirm")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCEEDED"));

        assertThat(balance(token, acct)).isEqualTo(100.00);
    }

    @Test
    void doubleConfirmCreditsOnce() throws Exception {
        String token = token("pay-idem@example.com");
        String acct = openAccount(token);
        String paymentId = topUp(token, acct, "40.00").get("paymentId").asText();

        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/v1/payments/" + paymentId + "/confirm")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }
        // Idempotent: the account is credited once despite two confirmations.
        assertThat(balance(token, acct)).isEqualTo(40.00);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>import static org.assertj.core.api.Assertions.assertThat;</code> - Imports `static org.assertj.core.api.Assertions.assertThat` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
19. <code>class PaymentIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    private String token(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                        .content(&quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;P&quot;,&quot;lastName&quot;:&quot;Y&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                                &quot;&quot;&quot;.formatted(email)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    private String openAccount(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        String json = mvc.perform(post(&quot;/api/v1/accounts&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;type\&quot;:\&quot;CHECKING\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>        return mapper.readTree(json).get(&quot;id&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    private JsonNode topUp(String token, String accountId, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <code>        String json = mvc.perform(post(&quot;/api/v1/payments/top-up&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                        .content(&quot;{\&quot;accountId\&quot;:\&quot;&quot; + accountId + &quot;\&quot;,\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
53. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
54. <code>        return mapper.readTree(json);</code> - Returns a value/reference to the caller and ends this execution path.
55. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
57. <code>    private double balance(String token, String accountId) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        String json = mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
61. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
62. <code>        return mapper.readTree(json).get(&quot;balance&quot;).asDouble();</code> - Returns a value/reference to the caller and ends this execution path.
63. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
65. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
66. <code>    void topUpThenConfirmCreditsAccount() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>        String token = token(&quot;pay-topup@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
68. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
69. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
70. <code>        JsonNode created = topUp(token, acct, &quot;100.00&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
71. <code>        assertThat(created.get(&quot;manualConfirm&quot;).asBoolean()).isTrue(); // simulated gateway</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
72. <code>        String paymentId = created.get(&quot;paymentId&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
74. <code>        mvc.perform(post(&quot;/api/v1/payments/&quot; + paymentId + &quot;/confirm&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
75. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                .andExpect(jsonPath(&quot;$.status&quot;).value(&quot;SUCCEEDED&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
78. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
79. <code>        assertThat(balance(token, acct)).isEqualTo(100.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
80. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
81. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
82. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
83. <code>    void doubleConfirmCreditsOnce() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
84. <code>        String token = token(&quot;pay-idem@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
85. <code>        String acct = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
86. <code>        String paymentId = topUp(token, acct, &quot;40.00&quot;).get(&quot;paymentId&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
87. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
88. <code>        for (int i = 0; i &lt; 2; i++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
89. <code>            mvc.perform(post(&quot;/api/v1/payments/&quot; + paymentId + &quot;/confirm&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
90. <code>                            .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
91. <code>                    .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
92. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
93. <code>        // Idempotent: the account is credited once despite two confirmations.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
94. <code>        assertThat(balance(token, acct)).isEqualTo(40.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
95. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
96. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 27 | `private String token(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `token`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `private String openAccount(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `openAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 47 | `private JsonNode topUp(String token, String accountId, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `topUp`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 57 | `private double balance(String token, String accountId) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `balance`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/test/java/com/bank/transfer/TransferIntegrationTest.java`

### File Purpose
An integration or unit test file: it documents expected behavior and guards against regressions.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.AbstractIntegrationTest` | Project-local dependency connecting this file to another banking module. |
| `com.fasterxml.jackson.databind.JsonNode` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `com.fasterxml.jackson.databind.ObjectMapper` | Jackson dependency used for JSON parsing and serialization in tests or web APIs. |
| `org.junit.jupiter.api.Test` | JUnit dependency used to declare and run tests. |
| `org.springframework.beans.factory.annotation.Autowired` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.MediaType` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.test.web.servlet.MockMvc` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `static org.hamcrest.Matchers.is` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` | External or local dependency required by references in this file. |
| `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.transfer;

import com.bank.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class TransferIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    private String token(String email) throws Exception {
        String body = """
                {"email":"%s","password":"Secret123","firstName":"T","lastName":"U"}
                """.formatted(email);
        String json = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    private JsonNode openAccount(String token) throws Exception {
        String json = mvc.perform(post("/api/v1/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"CHECKING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json);
    }

    private void deposit(String token, String accountId, String amount) throws Exception {
        mvc.perform(post("/api/v1/accounts/" + accountId + "/deposit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":" + amount + "}"))
                .andExpect(status().isOk());
    }

    private double balance(String token, String accountId) throws Exception {
        String json = mvc.perform(get("/api/v1/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("balance").asDouble();
    }

    private String transferBody(String sourceId, String destNumber, String amount) {
        return """
                {"sourceAccountId":"%s","destinationAccountNumber":"%s","amount":%s}
                """.formatted(sourceId, destNumber, amount);
    }

    @Test
    void transferMovesMoneyBetweenAccounts() throws Exception {
        String token = token("tx-move@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        deposit(token, a.get("id").asText(), "200.00");

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "75.00")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.sourceBalanceAfter", is(125.00)));

        org.assertj.core.api.Assertions.assertThat(balance(token, a.get("id").asText())).isEqualTo(125.00);
        org.assertj.core.api.Assertions.assertThat(balance(token, b.get("id").asText())).isEqualTo(75.00);
    }

    @Test
    void idempotentKeyPostsTransferOnce() throws Exception {
        String token = token("tx-idem@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        deposit(token, a.get("id").asText(), "100.00");
        String body = transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "30.00");

        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/v1/transfers")
                            .header("Authorization", "Bearer " + token)
                            .header("Idempotency-Key", "dup-key-123")
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isOk());
        }
        // Despite two identical submissions, the destination is credited only once.
        org.assertj.core.api.Assertions.assertThat(balance(token, b.get("id").asText())).isEqualTo(30.00);
        org.assertj.core.api.Assertions.assertThat(balance(token, a.get("id").asText())).isEqualTo(70.00);
    }

    @Test
    void insufficientFundsRejected() throws Exception {
        String token = token("tx-insuf@example.com");
        JsonNode a = openAccount(token);
        JsonNode b = openAccount(token);
        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), b.get("accountNumber").asText(), "50.00")))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void destinationNotFoundAndSameAccountRejected() throws Exception {
        String token = token("tx-bad@example.com");
        JsonNode a = openAccount(token);
        deposit(token, a.get("id").asText(), "10.00");

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), "999999999999", "5.00")))
                .andExpect(status().isNotFound());

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(a.get("id").asText(), a.get("accountNumber").asText(), "5.00")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cannotTransferFromUnownedAccount() throws Exception {
        String alice = token("tx-alice@example.com");
        JsonNode aliceAcct = openAccount(alice);
        String bob = token("tx-bob@example.com");
        JsonNode bobAcct = openAccount(bob);

        mvc.perform(post("/api/v1/transfers")
                        .header("Authorization", "Bearer " + bob)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transferBody(aliceAcct.get("id").asText(),
                                bobAcct.get("accountNumber").asText(), "5.00")))
                .andExpect(status().isNotFound());
    }

    @Test
    void beneficiaryCrud() throws Exception {
        String token = token("tx-ben@example.com");
        JsonNode target = openAccount(token);
        String acctNo = target.get("accountNumber").asText();
        String body = "{\"nickname\":\"Savings\",\"accountNumber\":\"" + acctNo + "\"}";

        String created = mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nickname", is("Savings")))
                .andReturn().getResponse().getContentAsString();
        String beneficiaryId = mapper.readTree(created).get("id").asText();

        mvc.perform(get("/api/v1/beneficiaries").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountNumber", is(acctNo)));

        // Duplicate -> 409.
        mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());

        // Unknown account -> 404.
        mvc.perform(post("/api/v1/beneficiaries")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"Ghost\",\"accountNumber\":\"000000000000\"}"))
                .andExpect(status().isNotFound());

        mvc.perform(delete("/api/v1/beneficiaries/" + beneficiaryId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.AbstractIntegrationTest;</code> - Imports `com.bank.AbstractIntegrationTest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.fasterxml.jackson.databind.JsonNode;</code> - Imports `com.fasterxml.jackson.databind.JsonNode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.fasterxml.jackson.databind.ObjectMapper;</code> - Imports `com.fasterxml.jackson.databind.ObjectMapper` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.junit.jupiter.api.Test;</code> - Imports `org.junit.jupiter.api.Test` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.beans.factory.annotation.Autowired;</code> - Imports `org.springframework.beans.factory.annotation.Autowired` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;</code> - Imports `org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.MediaType;</code> - Imports `org.springframework.http.MediaType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.test.web.servlet.MockMvc;</code> - Imports `org.springframework.test.web.servlet.MockMvc` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>import static org.hamcrest.Matchers.is;</code> - Imports `static org.hamcrest.Matchers.is` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;</code> - Imports `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;</code> - Imports `static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>@AutoConfigureMockMvc</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>class TransferIntegrationTest extends AbstractIntegrationTest {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>    MockMvc mvc;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    @Autowired</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>    ObjectMapper mapper;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    private String token(String email) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>        String body = &quot;&quot;&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                {&quot;email&quot;:&quot;%s&quot;,&quot;password&quot;:&quot;Secret123&quot;,&quot;firstName&quot;:&quot;T&quot;,&quot;lastName&quot;:&quot;U&quot;}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                &quot;&quot;&quot;.formatted(email);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
32. <code>        String json = mvc.perform(post(&quot;/api/v1/auth/register&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
36. <code>        return mapper.readTree(json).get(&quot;accessToken&quot;).asText();</code> - Returns a value/reference to the caller and ends this execution path.
37. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    private JsonNode openAccount(String token) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        String json = mvc.perform(post(&quot;/api/v1/accounts&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;type\&quot;:\&quot;CHECKING\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
44. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
45. <code>        return mapper.readTree(json);</code> - Returns a value/reference to the caller and ends this execution path.
46. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
48. <code>    private void deposit(String token, String accountId, String amount) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <code>        mvc.perform(post(&quot;/api/v1/accounts/&quot; + accountId + &quot;/deposit&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                        .contentType(MediaType.APPLICATION_JSON).content(&quot;{\&quot;amount\&quot;:&quot; + amount + &quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
53. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    private double balance(String token, String accountId) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <code>        String json = mvc.perform(get(&quot;/api/v1/accounts/&quot; + accountId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
58. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
60. <code>        return mapper.readTree(json).get(&quot;balance&quot;).asDouble();</code> - Returns a value/reference to the caller and ends this execution path.
61. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
63. <code>    private String transferBody(String sourceId, String destNumber, String amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <code>        return &quot;&quot;&quot;</code> - Returns a value/reference to the caller and ends this execution path.
65. <code>                {&quot;sourceAccountId&quot;:&quot;%s&quot;,&quot;destinationAccountNumber&quot;:&quot;%s&quot;,&quot;amount&quot;:%s}</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
66. <code>                &quot;&quot;&quot;.formatted(sourceId, destNumber, amount);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
67. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
69. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
70. <code>    void transferMovesMoneyBetweenAccounts() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>        String token = token(&quot;tx-move@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
72. <code>        JsonNode a = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <code>        JsonNode b = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
74. <code>        deposit(token, a.get(&quot;id&quot;).asText(), &quot;200.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
75. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
76. <code>        mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
79. <code>                        .content(transferBody(a.get(&quot;id&quot;).asText(), b.get(&quot;accountNumber&quot;).asText(), &quot;75.00&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
80. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
81. <code>                .andExpect(jsonPath(&quot;$.status&quot;, is(&quot;COMPLETED&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
82. <code>                .andExpect(jsonPath(&quot;$.sourceBalanceAfter&quot;, is(125.00)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>        org.assertj.core.api.Assertions.assertThat(balance(token, a.get(&quot;id&quot;).asText())).isEqualTo(125.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
85. <code>        org.assertj.core.api.Assertions.assertThat(balance(token, b.get(&quot;id&quot;).asText())).isEqualTo(75.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
86. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
87. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
88. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
89. <code>    void idempotentKeyPostsTransferOnce() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <code>        String token = token(&quot;tx-idem@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
91. <code>        JsonNode a = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
92. <code>        JsonNode b = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
93. <code>        deposit(token, a.get(&quot;id&quot;).asText(), &quot;100.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
94. <code>        String body = transferBody(a.get(&quot;id&quot;).asText(), b.get(&quot;accountNumber&quot;).asText(), &quot;30.00&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
95. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
96. <code>        for (int i = 0; i &lt; 2; i++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
97. <code>            mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
98. <code>                            .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
99. <code>                            .header(&quot;Idempotency-Key&quot;, &quot;dup-key-123&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
100. <code>                            .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
101. <code>                    .andExpect(status().isOk());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
102. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
103. <code>        // Despite two identical submissions, the destination is credited only once.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
104. <code>        org.assertj.core.api.Assertions.assertThat(balance(token, b.get(&quot;id&quot;).asText())).isEqualTo(30.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
105. <code>        org.assertj.core.api.Assertions.assertThat(balance(token, a.get(&quot;id&quot;).asText())).isEqualTo(70.00);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
106. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
107. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
108. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
109. <code>    void insufficientFundsRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
110. <code>        String token = token(&quot;tx-insuf@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
111. <code>        JsonNode a = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
112. <code>        JsonNode b = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
113. <code>        mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
114. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
115. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
116. <code>                        .content(transferBody(a.get(&quot;id&quot;).asText(), b.get(&quot;accountNumber&quot;).asText(), &quot;50.00&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
117. <code>                .andExpect(status().isUnprocessableEntity());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
118. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
119. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
120. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
121. <code>    void destinationNotFoundAndSameAccountRejected() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
122. <code>        String token = token(&quot;tx-bad@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
123. <code>        JsonNode a = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
124. <code>        deposit(token, a.get(&quot;id&quot;).asText(), &quot;10.00&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
125. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
126. <code>        mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
127. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
128. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
129. <code>                        .content(transferBody(a.get(&quot;id&quot;).asText(), &quot;999999999999&quot;, &quot;5.00&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
130. <code>                .andExpect(status().isNotFound());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
131. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
132. <code>        mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
133. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
134. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
135. <code>                        .content(transferBody(a.get(&quot;id&quot;).asText(), a.get(&quot;accountNumber&quot;).asText(), &quot;5.00&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
136. <code>                .andExpect(status().isBadRequest());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
137. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
138. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
139. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
140. <code>    void cannotTransferFromUnownedAccount() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
141. <code>        String alice = token(&quot;tx-alice@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
142. <code>        JsonNode aliceAcct = openAccount(alice);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
143. <code>        String bob = token(&quot;tx-bob@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
144. <code>        JsonNode bobAcct = openAccount(bob);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
145. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
146. <code>        mvc.perform(post(&quot;/api/v1/transfers&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
147. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + bob)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
148. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
149. <code>                        .content(transferBody(aliceAcct.get(&quot;id&quot;).asText(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
150. <code>                                bobAcct.get(&quot;accountNumber&quot;).asText(), &quot;5.00&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
151. <code>                .andExpect(status().isNotFound());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
152. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
153. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
154. <code>    @Test</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
155. <code>    void beneficiaryCrud() throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
156. <code>        String token = token(&quot;tx-ben@example.com&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
157. <code>        JsonNode target = openAccount(token);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
158. <code>        String acctNo = target.get(&quot;accountNumber&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
159. <code>        String body = &quot;{\&quot;nickname\&quot;:\&quot;Savings\&quot;,\&quot;accountNumber\&quot;:\&quot;&quot; + acctNo + &quot;\&quot;}&quot;;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
160. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
161. <code>        String created = mvc.perform(post(&quot;/api/v1/beneficiaries&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
162. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
163. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
164. <code>                .andExpect(status().isCreated())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
165. <code>                .andExpect(jsonPath(&quot;$.nickname&quot;, is(&quot;Savings&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
166. <code>                .andReturn().getResponse().getContentAsString();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
167. <code>        String beneficiaryId = mapper.readTree(created).get(&quot;id&quot;).asText();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
168. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
169. <code>        mvc.perform(get(&quot;/api/v1/beneficiaries&quot;).header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
170. <code>                .andExpect(status().isOk())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
171. <code>                .andExpect(jsonPath(&quot;$[0].accountNumber&quot;, is(acctNo)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
172. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
173. <code>        // Duplicate -&gt; 409.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
174. <code>        mvc.perform(post(&quot;/api/v1/beneficiaries&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
175. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
176. <code>                        .contentType(MediaType.APPLICATION_JSON).content(body))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
177. <code>                .andExpect(status().isConflict());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
178. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
179. <code>        // Unknown account -&gt; 404.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
180. <code>        mvc.perform(post(&quot;/api/v1/beneficiaries&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
181. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
182. <code>                        .contentType(MediaType.APPLICATION_JSON)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
183. <code>                        .content(&quot;{\&quot;nickname\&quot;:\&quot;Ghost\&quot;,\&quot;accountNumber\&quot;:\&quot;000000000000\&quot;}&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
184. <code>                .andExpect(status().isNotFound());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
185. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
186. <code>        mvc.perform(delete(&quot;/api/v1/beneficiaries/&quot; + beneficiaryId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
187. <code>                        .header(&quot;Authorization&quot;, &quot;Bearer &quot; + token))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
188. <code>                .andExpect(status().isNoContent());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
189. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
190. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 28 | `private String token(String email) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `token`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 39 | `private JsonNode openAccount(String token) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `openAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 48 | `private void deposit(String token, String accountId, String amount) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `deposit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 55 | `private double balance(String token, String accountId) throws Exception` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `balance`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 63 | `private String transferBody(String sourceId, String destNumber, String amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `transferBody`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---


## `backend/.gitattributes`

### File Purpose
A repository hygiene file: it controls which generated files are ignored or how line endings are normalized.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````gitignore
/mvnw text eol=lf
*.cmd text eol=crlf
````

### Code Walkthrough
1. <code>/mvnw text eol=lf</code> - Git attributes line. Git uses it to normalize text handling such as line endings.
2. <code>*.cmd text eol=crlf</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.

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

## `backend/.gitignore`

### File Purpose
A repository hygiene file: it controls which generated files are ignored or how line endings are normalized.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````gitignore
HELP.md
target/
.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/
````

### Code Walkthrough
1. <code>HELP.md</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
2. <code>target/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
3. <code>.mvn/wrapper/maven-wrapper.jar</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
4. <code>!**/src/main/**/target/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
5. <code>!**/src/test/**/target/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>### STS ###</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code>.apt_generated</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
9. <code>.classpath</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
10. <code>.factorypath</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
11. <code>.project</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
12. <code>.settings</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
13. <code>.springBeans</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
14. <code>.sts4-cache</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>### IntelliJ IDEA ###</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code>.idea</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
18. <code>*.iws</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>*.iml</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
20. <code>*.ipr</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>### NetBeans ###</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>/nbproject/private/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
24. <code>/nbbuild/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
25. <code>/dist/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
26. <code>/nbdist/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
27. <code>/.nb-gradle/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
28. <code>build/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
29. <code>!**/src/main/**/build/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
30. <code>!**/src/test/**/build/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>### VS Code ###</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
33. <code>.vscode/</code> - Git ignore pattern or comment. Git uses it to keep generated/local files out of commits.

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

## `backend/.mvn/wrapper/maven-wrapper.properties`

### File Purpose
The Maven wrapper configuration: it pins the Maven distribution that the wrapper downloads.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````properties
wrapperVersion=3.3.4
distributionType=only-script
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.16/apache-maven-3.9.16-bin.zip
````

### Code Walkthrough
1. <code>wrapperVersion=3.3.4</code> - Properties configuration line. The Maven wrapper parses key/value pairs from it.
2. <code>distributionType=only-script</code> - Properties configuration line. The Maven wrapper parses key/value pairs from it.
3. <code>distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.16/apache-maven-3.9.16-bin.zip</code> - Properties configuration line. The Maven wrapper parses key/value pairs from it.

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

## `backend/Dockerfile`

### File Purpose
The backend container recipe: it builds the Spring Boot jar in one stage and runs it in a smaller Java runtime image.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````dockerfile
# --- Build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# --- Runtime stage ---
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
````

### Code Walkthrough
1. <code># --- Build stage ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code>FROM maven:3.9-eclipse-temurin-21 AS build</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
3. <code>WORKDIR /app</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
4. <code>COPY pom.xml .</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
5. <code>RUN mvn -B -q dependency:go-offline</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
6. <code>COPY src ./src</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
7. <code>RUN mvn -B -q clean package -DskipTests</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code># --- Runtime stage ---</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>FROM eclipse-temurin:21-jre-alpine AS runtime</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
11. <code>WORKDIR /app</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
12. <code>RUN addgroup -S app &amp;&amp; adduser -S app -G app</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
13. <code>COPY --from=build /app/target/*.jar app.jar</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
14. <code>USER app</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
15. <code>EXPOSE 8080</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.
16. <code>ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]</code> - Docker build instruction. The Docker daemon executes it while assembling the backend image layers.

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

## `backend/HELP.md`

### File Purpose
A first-party project file included in the buildable repository.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````markdown
# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.16.RELEASE/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.5.16.RELEASE/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/web/servlet.html)
* [Spring Data JPA](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/data/sql.html#data.sql.jpa-and-spring-data)
* [Spring Security](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/web/spring-security.html)
* [Validation](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/io/validation.html)
* [Spring Data Redis (Access+Driver)](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/data/nosql.html#data.nosql.redis)
* [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/actuator/index.html)
* [Flyway Migration](https://docs.spring.io/spring-boot/3.5.16.RELEASE/how-to/data-initialization.html#howto.data-initialization.migration-tool.flyway)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
* [Validation](https://spring.io/guides/gs/validating-form-input/)
* [Messaging with Redis](https://spring.io/guides/gs/messaging-redis/)
* [Building a RESTful Web Service with Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.
````

### Code Walkthrough
1. <code># Getting Started</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>### Reference Documentation</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>For further reference, please consider the following sections:</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.16.RELEASE/maven-plugin)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code>* [Create an OCI image](https://docs.spring.io/spring-boot/3.5.16.RELEASE/maven-plugin/build-image.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code>* [Spring Web](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/web/servlet.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>* [Spring Data JPA](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/data/sql.html#data.sql.jpa-and-spring-data)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code>* [Spring Security](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/web/spring-security.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>* [Validation](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/io/validation.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code>* [Spring Data Redis (Access+Driver)](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/data/nosql.html#data.nosql.redis)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code>* [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.16.RELEASE/reference/actuator/index.html)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>* [Flyway Migration](https://docs.spring.io/spring-boot/3.5.16.RELEASE/how-to/data-initialization.html#howto.data-initialization.migration-tool.flyway)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>### Guides</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code>The following guides illustrate how to use some features concretely:</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <code>* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
22. <code>* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code>* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code>* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code>* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>* [Validation](https://spring.io/guides/gs/validating-form-input/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code>* [Messaging with Redis](https://spring.io/guides/gs/messaging-redis/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
29. <code>* [Building a RESTful Web Service with Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>### Maven Parent overrides</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>Due to Maven&#x27;s design, elements are inherited from the parent POM to the project POM.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
34. <code>While most of the inheritance is fine, it also inherits unwanted elements like `&lt;license&gt;` and `&lt;developers&gt;` from the parent.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
35. <code>To prevent this, the project POM contains empty overrides for these elements.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
36. <code>If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.</code> - Markdown documentation line. It teaches humans and has no runtime behavior.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.

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

## `backend/mvnw`

### File Purpose
The Maven wrapper launcher: it lets developers build the backend with a known Maven version even if Maven is not installed globally.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````bash
#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup batch script, version 3.3.4
#
# Optional ENV vars
# -----------------
#   JAVA_HOME - location of a JDK home dir, required when download maven via java source
#   MVNW_REPOURL - repo url base for downloading maven distribution
#   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven
#   MVNW_VERBOSE - true: enable verbose log; debug: trace the mvnw script; others: silence the output
# ----------------------------------------------------------------------------

set -euf
[ "${MVNW_VERBOSE-}" != debug ] || set -x

# OS specific support.
native_path() { printf %s\\n "$1"; }
case "$(uname)" in
CYGWIN* | MINGW*)
  [ -z "${JAVA_HOME-}" ] || JAVA_HOME="$(cygpath --unix "$JAVA_HOME")"
  native_path() { cygpath --path --windows "$1"; }
  ;;
esac

# set JAVACMD and JAVACCMD
set_java_home() {
  # For Cygwin and MinGW, ensure paths are in Unix format before anything is touched
  if [ -n "${JAVA_HOME-}" ]; then
    if [ -x "$JAVA_HOME/jre/sh/java" ]; then
      # IBM's JDK on AIX uses strange locations for the executables
      JAVACMD="$JAVA_HOME/jre/sh/java"
      JAVACCMD="$JAVA_HOME/jre/sh/javac"
    else
      JAVACMD="$JAVA_HOME/bin/java"
      JAVACCMD="$JAVA_HOME/bin/javac"

      if [ ! -x "$JAVACMD" ] || [ ! -x "$JAVACCMD" ]; then
        echo "The JAVA_HOME environment variable is not defined correctly, so mvnw cannot run." >&2
        echo "JAVA_HOME is set to \"$JAVA_HOME\", but \"\$JAVA_HOME/bin/java\" or \"\$JAVA_HOME/bin/javac\" does not exist." >&2
        return 1
      fi
    fi
  else
    JAVACMD="$(
      'set' +e
      'unset' -f command 2>/dev/null
      'command' -v java
    )" || :
    JAVACCMD="$(
      'set' +e
      'unset' -f command 2>/dev/null
      'command' -v javac
    )" || :

    if [ ! -x "${JAVACMD-}" ] || [ ! -x "${JAVACCMD-}" ]; then
      echo "The java/javac command does not exist in PATH nor is JAVA_HOME set, so mvnw cannot run." >&2
      return 1
    fi
  fi
}

# hash string like Java String::hashCode
hash_string() {
  str="${1:-}" h=0
  while [ -n "$str" ]; do
    char="${str%"${str#?}"}"
    h=$(((h * 31 + $(LC_CTYPE=C printf %d "'$char")) % 4294967296))
    str="${str#?}"
  done
  printf %x\\n $h
}

verbose() { :; }
[ "${MVNW_VERBOSE-}" != true ] || verbose() { printf %s\\n "${1-}"; }

die() {
  printf %s\\n "$1" >&2
  exit 1
}

trim() {
  # MWRAPPER-139:
  #   Trims trailing and leading whitespace, carriage returns, tabs, and linefeeds.
  #   Needed for removing poorly interpreted newline sequences when running in more
  #   exotic environments such as mingw bash on Windows.
  printf "%s" "${1}" | tr -d '[:space:]'
}

scriptDir="$(dirname "$0")"
scriptName="$(basename "$0")"

# parse distributionUrl and optional distributionSha256Sum, requires .mvn/wrapper/maven-wrapper.properties
while IFS="=" read -r key value; do
  case "${key-}" in
  distributionUrl) distributionUrl=$(trim "${value-}") ;;
  distributionSha256Sum) distributionSha256Sum=$(trim "${value-}") ;;
  esac
done <"$scriptDir/.mvn/wrapper/maven-wrapper.properties"
[ -n "${distributionUrl-}" ] || die "cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties"

case "${distributionUrl##*/}" in
maven-mvnd-*bin.*)
  MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/
  case "${PROCESSOR_ARCHITECTURE-}${PROCESSOR_ARCHITEW6432-}:$(uname -a)" in
  *AMD64:CYGWIN* | *AMD64:MINGW*) distributionPlatform=windows-amd64 ;;
  :Darwin*x86_64) distributionPlatform=darwin-amd64 ;;
  :Darwin*arm64) distributionPlatform=darwin-aarch64 ;;
  :Linux*x86_64*) distributionPlatform=linux-amd64 ;;
  *)
    echo "Cannot detect native platform for mvnd on $(uname)-$(uname -m), use pure java version" >&2
    distributionPlatform=linux-amd64
    ;;
  esac
  distributionUrl="${distributionUrl%-bin.*}-$distributionPlatform.zip"
  ;;
maven-mvnd-*) MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/ ;;
*) MVN_CMD="mvn${scriptName#mvnw}" _MVNW_REPO_PATTERN=/org/apache/maven/ ;;
esac

# apply MVNW_REPOURL and calculate MAVEN_HOME
# maven home pattern: ~/.m2/wrapper/dists/{apache-maven-<version>,maven-mvnd-<version>-<platform>}/<hash>
[ -z "${MVNW_REPOURL-}" ] || distributionUrl="$MVNW_REPOURL$_MVNW_REPO_PATTERN${distributionUrl#*"$_MVNW_REPO_PATTERN"}"
distributionUrlName="${distributionUrl##*/}"
distributionUrlNameMain="${distributionUrlName%.*}"
distributionUrlNameMain="${distributionUrlNameMain%-bin}"
MAVEN_USER_HOME="${MAVEN_USER_HOME:-${HOME}/.m2}"
MAVEN_HOME="${MAVEN_USER_HOME}/wrapper/dists/${distributionUrlNameMain-}/$(hash_string "$distributionUrl")"

exec_maven() {
  unset MVNW_VERBOSE MVNW_USERNAME MVNW_PASSWORD MVNW_REPOURL || :
  exec "$MAVEN_HOME/bin/$MVN_CMD" "$@" || die "cannot exec $MAVEN_HOME/bin/$MVN_CMD"
}

if [ -d "$MAVEN_HOME" ]; then
  verbose "found existing MAVEN_HOME at $MAVEN_HOME"
  exec_maven "$@"
fi

case "${distributionUrl-}" in
*?-bin.zip | *?maven-mvnd-?*-?*.zip) ;;
*) die "distributionUrl is not valid, must match *-bin.zip or maven-mvnd-*.zip, but found '${distributionUrl-}'" ;;
esac

# prepare tmp dir
if TMP_DOWNLOAD_DIR="$(mktemp -d)" && [ -d "$TMP_DOWNLOAD_DIR" ]; then
  clean() { rm -rf -- "$TMP_DOWNLOAD_DIR"; }
  trap clean HUP INT TERM EXIT
else
  die "cannot create temp dir"
fi

mkdir -p -- "${MAVEN_HOME%/*}"

# Download and Install Apache Maven
verbose "Couldn't find MAVEN_HOME, downloading and installing it ..."
verbose "Downloading from: $distributionUrl"
verbose "Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName"

# select .zip or .tar.gz
if ! command -v unzip >/dev/null; then
  distributionUrl="${distributionUrl%.zip}.tar.gz"
  distributionUrlName="${distributionUrl##*/}"
fi

# verbose opt
__MVNW_QUIET_WGET=--quiet __MVNW_QUIET_CURL=--silent __MVNW_QUIET_UNZIP=-q __MVNW_QUIET_TAR=''
[ "${MVNW_VERBOSE-}" != true ] || __MVNW_QUIET_WGET='' __MVNW_QUIET_CURL='' __MVNW_QUIET_UNZIP='' __MVNW_QUIET_TAR=v

# normalize http auth
case "${MVNW_PASSWORD:+has-password}" in
'') MVNW_USERNAME='' MVNW_PASSWORD='' ;;
has-password) [ -n "${MVNW_USERNAME-}" ] || MVNW_USERNAME='' MVNW_PASSWORD='' ;;
esac

if [ -z "${MVNW_USERNAME-}" ] && command -v wget >/dev/null; then
  verbose "Found wget ... using wget"
  wget ${__MVNW_QUIET_WGET:+"$__MVNW_QUIET_WGET"} "$distributionUrl" -O "$TMP_DOWNLOAD_DIR/$distributionUrlName" || die "wget: Failed to fetch $distributionUrl"
elif [ -z "${MVNW_USERNAME-}" ] && command -v curl >/dev/null; then
  verbose "Found curl ... using curl"
  curl ${__MVNW_QUIET_CURL:+"$__MVNW_QUIET_CURL"} -f -L -o "$TMP_DOWNLOAD_DIR/$distributionUrlName" "$distributionUrl" || die "curl: Failed to fetch $distributionUrl"
elif set_java_home; then
  verbose "Falling back to use Java to download"
  javaSource="$TMP_DOWNLOAD_DIR/Downloader.java"
  targetZip="$TMP_DOWNLOAD_DIR/$distributionUrlName"
  cat >"$javaSource" <<-END
	public class Downloader extends java.net.Authenticator
	{
	  protected java.net.PasswordAuthentication getPasswordAuthentication()
	  {
	    return new java.net.PasswordAuthentication( System.getenv( "MVNW_USERNAME" ), System.getenv( "MVNW_PASSWORD" ).toCharArray() );
	  }
	  public static void main( String[] args ) throws Exception
	  {
	    setDefault( new Downloader() );
	    java.nio.file.Files.copy( java.net.URI.create( args[0] ).toURL().openStream(), java.nio.file.Paths.get( args[1] ).toAbsolutePath().normalize() );
	  }
	}
	END
  # For Cygwin/MinGW, switch paths to Windows format before running javac and java
  verbose " - Compiling Downloader.java ..."
  "$(native_path "$JAVACCMD")" "$(native_path "$javaSource")" || die "Failed to compile Downloader.java"
  verbose " - Running Downloader.java ..."
  "$(native_path "$JAVACMD")" -cp "$(native_path "$TMP_DOWNLOAD_DIR")" Downloader "$distributionUrl" "$(native_path "$targetZip")"
fi

# If specified, validate the SHA-256 sum of the Maven distribution zip file
if [ -n "${distributionSha256Sum-}" ]; then
  distributionSha256Result=false
  if [ "$MVN_CMD" = mvnd.sh ]; then
    echo "Checksum validation is not supported for maven-mvnd." >&2
    echo "Please disable validation by removing 'distributionSha256Sum' from your maven-wrapper.properties." >&2
    exit 1
  elif command -v sha256sum >/dev/null; then
    if echo "$distributionSha256Sum  $TMP_DOWNLOAD_DIR/$distributionUrlName" | sha256sum -c - >/dev/null 2>&1; then
      distributionSha256Result=true
    fi
  elif command -v shasum >/dev/null; then
    if echo "$distributionSha256Sum  $TMP_DOWNLOAD_DIR/$distributionUrlName" | shasum -a 256 -c >/dev/null 2>&1; then
      distributionSha256Result=true
    fi
  else
    echo "Checksum validation was requested but neither 'sha256sum' or 'shasum' are available." >&2
    echo "Please install either command, or disable validation by removing 'distributionSha256Sum' from your maven-wrapper.properties." >&2
    exit 1
  fi
  if [ $distributionSha256Result = false ]; then
    echo "Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised." >&2
    echo "If you updated your Maven version, you need to update the specified distributionSha256Sum property." >&2
    exit 1
  fi
fi

# unzip and move
if command -v unzip >/dev/null; then
  unzip ${__MVNW_QUIET_UNZIP:+"$__MVNW_QUIET_UNZIP"} "$TMP_DOWNLOAD_DIR/$distributionUrlName" -d "$TMP_DOWNLOAD_DIR" || die "failed to unzip"
else
  tar xzf${__MVNW_QUIET_TAR:+"$__MVNW_QUIET_TAR"} "$TMP_DOWNLOAD_DIR/$distributionUrlName" -C "$TMP_DOWNLOAD_DIR" || die "failed to untar"
fi

# Find the actual extracted directory name (handles snapshots where filename != directory name)
actualDistributionDir=""

# First try the expected directory name (for regular distributions)
if [ -d "$TMP_DOWNLOAD_DIR/$distributionUrlNameMain" ]; then
  if [ -f "$TMP_DOWNLOAD_DIR/$distributionUrlNameMain/bin/$MVN_CMD" ]; then
    actualDistributionDir="$distributionUrlNameMain"
  fi
fi

# If not found, search for any directory with the Maven executable (for snapshots)
if [ -z "$actualDistributionDir" ]; then
  # enable globbing to iterate over items
  set +f
  for dir in "$TMP_DOWNLOAD_DIR"/*; do
    if [ -d "$dir" ]; then
      if [ -f "$dir/bin/$MVN_CMD" ]; then
        actualDistributionDir="$(basename "$dir")"
        break
      fi
    fi
  done
  set -f
fi

if [ -z "$actualDistributionDir" ]; then
  verbose "Contents of $TMP_DOWNLOAD_DIR:"
  verbose "$(ls -la "$TMP_DOWNLOAD_DIR")"
  die "Could not find Maven distribution directory in extracted archive"
fi

verbose "Found extracted Maven distribution directory: $actualDistributionDir"
printf %s\\n "$distributionUrl" >"$TMP_DOWNLOAD_DIR/$actualDistributionDir/mvnw.url"
mv -- "$TMP_DOWNLOAD_DIR/$actualDistributionDir" "$MAVEN_HOME" || [ -d "$MAVEN_HOME" ] || die "fail to move MAVEN_HOME"

clean || :
exec_maven "$@"
````

### Code Walkthrough
1. <code>#!/bin/sh</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code># ----------------------------------------------------------------------------</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code># Licensed to the Apache Software Foundation (ASF) under one</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code># or more contributor license agreements.  See the NOTICE file</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code># distributed with this work for additional information</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code># regarding copyright ownership.  The ASF licenses this file</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code># to you under the Apache License, Version 2.0 (the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code># &quot;License&quot;); you may not use this file except in compliance</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code># with the License.  You may obtain a copy of the License at</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>#</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code>#    http://www.apache.org/licenses/LICENSE-2.0</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>#</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code># Unless required by applicable law or agreed to in writing,</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code># software distributed under the License is distributed on an</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code># &quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code># KIND, either express or implied.  See the License for the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code># specific language governing permissions and limitations</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code># under the License.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code># ----------------------------------------------------------------------------</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code># ----------------------------------------------------------------------------</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
22. <code># Apache Maven Wrapper startup batch script, version 3.3.4</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>#</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code># Optional ENV vars</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code># -----------------</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code>#   JAVA_HOME - location of a JDK home dir, required when download maven via java source</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>#   MVNW_REPOURL - repo url base for downloading maven distribution</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code>#   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
29. <code>#   MVNW_VERBOSE - true: enable verbose log; debug: trace the mvnw script; others: silence the output</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
30. <code># ----------------------------------------------------------------------------</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>set -euf</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
33. <code>[ &quot;${MVNW_VERBOSE-}&quot; != debug ] || set -x</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code># OS specific support.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
36. <code>native_path() { printf %s\\n &quot;$1&quot;; }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
37. <code>case &quot;$(uname)&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
38. <code>CYGWIN* | MINGW*)</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
39. <code>  [ -z &quot;${JAVA_HOME-}&quot; ] || JAVA_HOME=&quot;$(cygpath --unix &quot;$JAVA_HOME&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
40. <code>  native_path() { cygpath --path --windows &quot;$1&quot;; }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
41. <code>  ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
42. <code>esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code># set JAVACMD and JAVACCMD</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
45. <code>set_java_home() {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
46. <code>  # For Cygwin and MinGW, ensure paths are in Unix format before anything is touched</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
47. <code>  if [ -n &quot;${JAVA_HOME-}&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
48. <code>    if [ -x &quot;$JAVA_HOME/jre/sh/java&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
49. <code>      # IBM&#x27;s JDK on AIX uses strange locations for the executables</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
50. <code>      JAVACMD=&quot;$JAVA_HOME/jre/sh/java&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
51. <code>      JAVACCMD=&quot;$JAVA_HOME/jre/sh/javac&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
52. <code>    else</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
53. <code>      JAVACMD=&quot;$JAVA_HOME/bin/java&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
54. <code>      JAVACCMD=&quot;$JAVA_HOME/bin/javac&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>      if [ ! -x &quot;$JAVACMD&quot; ] || [ ! -x &quot;$JAVACCMD&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
57. <code>        echo &quot;The JAVA_HOME environment variable is not defined correctly, so mvnw cannot run.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
58. <code>        echo &quot;JAVA_HOME is set to \&quot;$JAVA_HOME\&quot;, but \&quot;\$JAVA_HOME/bin/java\&quot; or \&quot;\$JAVA_HOME/bin/javac\&quot; does not exist.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
59. <code>        return 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
60. <code>      fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
61. <code>    fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
62. <code>  else</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
63. <code>    JAVACMD=&quot;$(</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
64. <code>      &#x27;set&#x27; +e</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
65. <code>      &#x27;unset&#x27; -f command 2&gt;/dev/null</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
66. <code>      &#x27;command&#x27; -v java</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
67. <code>    )&quot; || :</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
68. <code>    JAVACCMD=&quot;$(</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
69. <code>      &#x27;set&#x27; +e</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
70. <code>      &#x27;unset&#x27; -f command 2&gt;/dev/null</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
71. <code>      &#x27;command&#x27; -v javac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
72. <code>    )&quot; || :</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
73. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
74. <code>    if [ ! -x &quot;${JAVACMD-}&quot; ] || [ ! -x &quot;${JAVACCMD-}&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
75. <code>      echo &quot;The java/javac command does not exist in PATH nor is JAVA_HOME set, so mvnw cannot run.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
76. <code>      return 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
77. <code>    fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
78. <code>  fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
79. <code>}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
80. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
81. <code># hash string like Java String::hashCode</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
82. <code>hash_string() {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
83. <code>  str=&quot;${1:-}&quot; h=0</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
84. <code>  while [ -n &quot;$str&quot; ]; do</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
85. <code>    char=&quot;${str%&quot;${str#?}&quot;}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
86. <code>    h=$(((h * 31 + $(LC_CTYPE=C printf %d &quot;&#x27;$char&quot;)) % 4294967296))</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
87. <code>    str=&quot;${str#?}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
88. <code>  done</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
89. <code>  printf %x\\n $h</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
90. <code>}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
91. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
92. <code>verbose() { :; }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
93. <code>[ &quot;${MVNW_VERBOSE-}&quot; != true ] || verbose() { printf %s\\n &quot;${1-}&quot;; }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
94. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
95. <code>die() {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
96. <code>  printf %s\\n &quot;$1&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
97. <code>  exit 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
98. <code>}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
99. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
100. <code>trim() {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
101. <code>  # MWRAPPER-139:</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
102. <code>  #   Trims trailing and leading whitespace, carriage returns, tabs, and linefeeds.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
103. <code>  #   Needed for removing poorly interpreted newline sequences when running in more</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
104. <code>  #   exotic environments such as mingw bash on Windows.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
105. <code>  printf &quot;%s&quot; &quot;${1}&quot; | tr -d &#x27;[:space:]&#x27;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
106. <code>}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
107. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
108. <code>scriptDir=&quot;$(dirname &quot;$0&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
109. <code>scriptName=&quot;$(basename &quot;$0&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
110. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
111. <code># parse distributionUrl and optional distributionSha256Sum, requires .mvn/wrapper/maven-wrapper.properties</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
112. <code>while IFS=&quot;=&quot; read -r key value; do</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
113. <code>  case &quot;${key-}&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
114. <code>  distributionUrl) distributionUrl=$(trim &quot;${value-}&quot;) ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
115. <code>  distributionSha256Sum) distributionSha256Sum=$(trim &quot;${value-}&quot;) ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
116. <code>  esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
117. <code>done &lt;&quot;$scriptDir/.mvn/wrapper/maven-wrapper.properties&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
118. <code>[ -n &quot;${distributionUrl-}&quot; ] || die &quot;cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
119. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
120. <code>case &quot;${distributionUrl##*/}&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
121. <code>maven-mvnd-*bin.*)</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
122. <code>  MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
123. <code>  case &quot;${PROCESSOR_ARCHITECTURE-}${PROCESSOR_ARCHITEW6432-}:$(uname -a)&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
124. <code>  *AMD64:CYGWIN* | *AMD64:MINGW*) distributionPlatform=windows-amd64 ;;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
125. <code>  :Darwin*x86_64) distributionPlatform=darwin-amd64 ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
126. <code>  :Darwin*arm64) distributionPlatform=darwin-aarch64 ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
127. <code>  :Linux*x86_64*) distributionPlatform=linux-amd64 ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
128. <code>  *)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
129. <code>    echo &quot;Cannot detect native platform for mvnd on $(uname)-$(uname -m), use pure java version&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
130. <code>    distributionPlatform=linux-amd64</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
131. <code>    ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
132. <code>  esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
133. <code>  distributionUrl=&quot;${distributionUrl%-bin.*}-$distributionPlatform.zip&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
134. <code>  ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
135. <code>maven-mvnd-*) MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/ ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
136. <code>*) MVN_CMD=&quot;mvn${scriptName#mvnw}&quot; _MVNW_REPO_PATTERN=/org/apache/maven/ ;;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
137. <code>esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
138. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
139. <code># apply MVNW_REPOURL and calculate MAVEN_HOME</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
140. <code># maven home pattern: ~/.m2/wrapper/dists/{apache-maven-&lt;version&gt;,maven-mvnd-&lt;version&gt;-&lt;platform&gt;}/&lt;hash&gt;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
141. <code>[ -z &quot;${MVNW_REPOURL-}&quot; ] || distributionUrl=&quot;$MVNW_REPOURL$_MVNW_REPO_PATTERN${distributionUrl#*&quot;$_MVNW_REPO_PATTERN&quot;}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
142. <code>distributionUrlName=&quot;${distributionUrl##*/}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
143. <code>distributionUrlNameMain=&quot;${distributionUrlName%.*}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
144. <code>distributionUrlNameMain=&quot;${distributionUrlNameMain%-bin}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
145. <code>MAVEN_USER_HOME=&quot;${MAVEN_USER_HOME:-${HOME}/.m2}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
146. <code>MAVEN_HOME=&quot;${MAVEN_USER_HOME}/wrapper/dists/${distributionUrlNameMain-}/$(hash_string &quot;$distributionUrl&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
147. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
148. <code>exec_maven() {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
149. <code>  unset MVNW_VERBOSE MVNW_USERNAME MVNW_PASSWORD MVNW_REPOURL || :</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
150. <code>  exec &quot;$MAVEN_HOME/bin/$MVN_CMD&quot; &quot;$@&quot; || die &quot;cannot exec $MAVEN_HOME/bin/$MVN_CMD&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
151. <code>}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
152. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
153. <code>if [ -d &quot;$MAVEN_HOME&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
154. <code>  verbose &quot;found existing MAVEN_HOME at $MAVEN_HOME&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
155. <code>  exec_maven &quot;$@&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
156. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
157. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
158. <code>case &quot;${distributionUrl-}&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
159. <code>*?-bin.zip | *?maven-mvnd-?*-?*.zip) ;;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
160. <code>*) die &quot;distributionUrl is not valid, must match *-bin.zip or maven-mvnd-*.zip, but found &#x27;${distributionUrl-}&#x27;&quot; ;;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
161. <code>esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
162. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
163. <code># prepare tmp dir</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
164. <code>if TMP_DOWNLOAD_DIR=&quot;$(mktemp -d)&quot; &amp;&amp; [ -d &quot;$TMP_DOWNLOAD_DIR&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
165. <code>  clean() { rm -rf -- &quot;$TMP_DOWNLOAD_DIR&quot;; }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
166. <code>  trap clean HUP INT TERM EXIT</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
167. <code>else</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
168. <code>  die &quot;cannot create temp dir&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
169. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
170. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
171. <code>mkdir -p -- &quot;${MAVEN_HOME%/*}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
172. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
173. <code># Download and Install Apache Maven</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
174. <code>verbose &quot;Couldn&#x27;t find MAVEN_HOME, downloading and installing it ...&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
175. <code>verbose &quot;Downloading from: $distributionUrl&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
176. <code>verbose &quot;Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
177. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
178. <code># select .zip or .tar.gz</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
179. <code>if ! command -v unzip &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
180. <code>  distributionUrl=&quot;${distributionUrl%.zip}.tar.gz&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
181. <code>  distributionUrlName=&quot;${distributionUrl##*/}&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
182. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
183. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
184. <code># verbose opt</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
185. <code>__MVNW_QUIET_WGET=--quiet __MVNW_QUIET_CURL=--silent __MVNW_QUIET_UNZIP=-q __MVNW_QUIET_TAR=&#x27;&#x27;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
186. <code>[ &quot;${MVNW_VERBOSE-}&quot; != true ] || __MVNW_QUIET_WGET=&#x27;&#x27; __MVNW_QUIET_CURL=&#x27;&#x27; __MVNW_QUIET_UNZIP=&#x27;&#x27; __MVNW_QUIET_TAR=v</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
187. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
188. <code># normalize http auth</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
189. <code>case &quot;${MVNW_PASSWORD:+has-password}&quot; in</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
190. <code>&#x27;&#x27;) MVNW_USERNAME=&#x27;&#x27; MVNW_PASSWORD=&#x27;&#x27; ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
191. <code>has-password) [ -n &quot;${MVNW_USERNAME-}&quot; ] || MVNW_USERNAME=&#x27;&#x27; MVNW_PASSWORD=&#x27;&#x27; ;;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
192. <code>esac</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
193. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
194. <code>if [ -z &quot;${MVNW_USERNAME-}&quot; ] &amp;&amp; command -v wget &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
195. <code>  verbose &quot;Found wget ... using wget&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
196. <code>  wget ${__MVNW_QUIET_WGET:+&quot;$__MVNW_QUIET_WGET&quot;} &quot;$distributionUrl&quot; -O &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; || die &quot;wget: Failed to fetch $distributionUrl&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
197. <code>elif [ -z &quot;${MVNW_USERNAME-}&quot; ] &amp;&amp; command -v curl &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
198. <code>  verbose &quot;Found curl ... using curl&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
199. <code>  curl ${__MVNW_QUIET_CURL:+&quot;$__MVNW_QUIET_CURL&quot;} -f -L -o &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; &quot;$distributionUrl&quot; || die &quot;curl: Failed to fetch $distributionUrl&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
200. <code>elif set_java_home; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
201. <code>  verbose &quot;Falling back to use Java to download&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
202. <code>  javaSource=&quot;$TMP_DOWNLOAD_DIR/Downloader.java&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
203. <code>  targetZip=&quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
204. <code>  cat &gt;&quot;$javaSource&quot; &lt;&lt;-END</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
205. <code>	public class Downloader extends java.net.Authenticator</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
206. <code>	{</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
207. <code>	  protected java.net.PasswordAuthentication getPasswordAuthentication()</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
208. <code>	  {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
209. <code>	    return new java.net.PasswordAuthentication( System.getenv( &quot;MVNW_USERNAME&quot; ), System.getenv( &quot;MVNW_PASSWORD&quot; ).toCharArray() );</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
210. <code>	  }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
211. <code>	  public static void main( String[] args ) throws Exception</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
212. <code>	  {</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
213. <code>	    setDefault( new Downloader() );</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
214. <code>	    java.nio.file.Files.copy( java.net.URI.create( args[0] ).toURL().openStream(), java.nio.file.Paths.get( args[1] ).toAbsolutePath().normalize() );</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
215. <code>	  }</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
216. <code>	}</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
217. <code>	END</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
218. <code>  # For Cygwin/MinGW, switch paths to Windows format before running javac and java</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
219. <code>  verbose &quot; - Compiling Downloader.java ...&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
220. <code>  &quot;$(native_path &quot;$JAVACCMD&quot;)&quot; &quot;$(native_path &quot;$javaSource&quot;)&quot; || die &quot;Failed to compile Downloader.java&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
221. <code>  verbose &quot; - Running Downloader.java ...&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
222. <code>  &quot;$(native_path &quot;$JAVACMD&quot;)&quot; -cp &quot;$(native_path &quot;$TMP_DOWNLOAD_DIR&quot;)&quot; Downloader &quot;$distributionUrl&quot; &quot;$(native_path &quot;$targetZip&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
223. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
224. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
225. <code># If specified, validate the SHA-256 sum of the Maven distribution zip file</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
226. <code>if [ -n &quot;${distributionSha256Sum-}&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
227. <code>  distributionSha256Result=false</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
228. <code>  if [ &quot;$MVN_CMD&quot; = mvnd.sh ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
229. <code>    echo &quot;Checksum validation is not supported for maven-mvnd.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
230. <code>    echo &quot;Please disable validation by removing &#x27;distributionSha256Sum&#x27; from your maven-wrapper.properties.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
231. <code>    exit 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
232. <code>  elif command -v sha256sum &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
233. <code>    if echo &quot;$distributionSha256Sum  $TMP_DOWNLOAD_DIR/$distributionUrlName&quot; | sha256sum -c - &gt;/dev/null 2&gt;&amp;1; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
234. <code>      distributionSha256Result=true</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
235. <code>    fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
236. <code>  elif command -v shasum &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
237. <code>    if echo &quot;$distributionSha256Sum  $TMP_DOWNLOAD_DIR/$distributionUrlName&quot; | shasum -a 256 -c &gt;/dev/null 2&gt;&amp;1; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
238. <code>      distributionSha256Result=true</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
239. <code>    fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
240. <code>  else</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
241. <code>    echo &quot;Checksum validation was requested but neither &#x27;sha256sum&#x27; or &#x27;shasum&#x27; are available.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
242. <code>    echo &quot;Please install either command, or disable validation by removing &#x27;distributionSha256Sum&#x27; from your maven-wrapper.properties.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
243. <code>    exit 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
244. <code>  fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
245. <code>  if [ $distributionSha256Result = false ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
246. <code>    echo &quot;Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
247. <code>    echo &quot;If you updated your Maven version, you need to update the specified distributionSha256Sum property.&quot; &gt;&amp;2</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
248. <code>    exit 1</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
249. <code>  fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
250. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
251. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
252. <code># unzip and move</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
253. <code>if command -v unzip &gt;/dev/null; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
254. <code>  unzip ${__MVNW_QUIET_UNZIP:+&quot;$__MVNW_QUIET_UNZIP&quot;} &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; -d &quot;$TMP_DOWNLOAD_DIR&quot; || die &quot;failed to unzip&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
255. <code>else</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
256. <code>  tar xzf${__MVNW_QUIET_TAR:+&quot;$__MVNW_QUIET_TAR&quot;} &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; -C &quot;$TMP_DOWNLOAD_DIR&quot; || die &quot;failed to untar&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
257. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
258. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
259. <code># Find the actual extracted directory name (handles snapshots where filename != directory name)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
260. <code>actualDistributionDir=&quot;&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
261. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
262. <code># First try the expected directory name (for regular distributions)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
263. <code>if [ -d &quot;$TMP_DOWNLOAD_DIR/$distributionUrlNameMain&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
264. <code>  if [ -f &quot;$TMP_DOWNLOAD_DIR/$distributionUrlNameMain/bin/$MVN_CMD&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
265. <code>    actualDistributionDir=&quot;$distributionUrlNameMain&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
266. <code>  fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
267. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
268. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
269. <code># If not found, search for any directory with the Maven executable (for snapshots)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
270. <code>if [ -z &quot;$actualDistributionDir&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
271. <code>  # enable globbing to iterate over items</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
272. <code>  set +f</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
273. <code>  for dir in &quot;$TMP_DOWNLOAD_DIR&quot;/*; do</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
274. <code>    if [ -d &quot;$dir&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
275. <code>      if [ -f &quot;$dir/bin/$MVN_CMD&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
276. <code>        actualDistributionDir=&quot;$(basename &quot;$dir&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
277. <code>        break</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
278. <code>      fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
279. <code>    fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
280. <code>  done</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
281. <code>  set -f</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
282. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
283. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
284. <code>if [ -z &quot;$actualDistributionDir&quot; ]; then</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
285. <code>  verbose &quot;Contents of $TMP_DOWNLOAD_DIR:&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
286. <code>  verbose &quot;$(ls -la &quot;$TMP_DOWNLOAD_DIR&quot;)&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
287. <code>  die &quot;Could not find Maven distribution directory in extracted archive&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
288. <code>fi</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
289. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
290. <code>verbose &quot;Found extracted Maven distribution directory: $actualDistributionDir&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
291. <code>printf %s\\n &quot;$distributionUrl&quot; &gt;&quot;$TMP_DOWNLOAD_DIR/$actualDistributionDir/mvnw.url&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
292. <code>mv -- &quot;$TMP_DOWNLOAD_DIR/$actualDistributionDir&quot; &quot;$MAVEN_HOME&quot; || [ -d &quot;$MAVEN_HOME&quot; ] || die &quot;fail to move MAVEN_HOME&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
293. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
294. <code>clean || :</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.
295. <code>exec_maven &quot;$@&quot;</code> - Shell script line for the Maven wrapper. The operating system shell executes it to locate/download/run Maven.

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

## `backend/mvnw.cmd`

### File Purpose
The Maven wrapper launcher: it lets developers build the backend with a known Maven version even if Maven is not installed globally.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````bat
<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.4
@REM
@REM Optional ENV vars
@REM   MVNW_REPOURL - repo url base for downloading maven distribution
@REM   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven
@REM   MVNW_VERBOSE - true: enable verbose log; others: silence the output
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
  IF "%%A"=="MVN_CMD" (set __MVNW_CMD__=%%B) ELSE IF "%%B"=="" (echo %%A) ELSE (echo %%A=%%B)
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=
@SET __MVNW_ARG0_NAME__=
@SET MVNW_USERNAME=
@SET MVNW_PASSWORD=
@IF NOT "%__MVNW_CMD__%"=="" ("%__MVNW_CMD__%" %*)
@echo Cannot start maven from wrapper >&2 && exit /b 1
@GOTO :EOF
: end batch / begin powershell #>

$ErrorActionPreference = "Stop"
if ($env:MVNW_VERBOSE -eq "true") {
  $VerbosePreference = "Continue"
}

# calculate distributionUrl, requires .mvn/wrapper/maven-wrapper.properties
$distributionUrl = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionUrl
if (!$distributionUrl) {
  Write-Error "cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties"
}

switch -wildcard -casesensitive ( $($distributionUrl -replace '^.*/','') ) {
  "maven-mvnd-*" {
    $USE_MVND = $true
    $distributionUrl = $distributionUrl -replace '-bin\.[^.]*$',"-windows-amd64.zip"
    $MVN_CMD = "mvnd.cmd"
    break
  }
  default {
    $USE_MVND = $false
    $MVN_CMD = $script -replace '^mvnw','mvn'
    break
  }
}

# apply MVNW_REPOURL and calculate MAVEN_HOME
# maven home pattern: ~/.m2/wrapper/dists/{apache-maven-<version>,maven-mvnd-<version>-<platform>}/<hash>
if ($env:MVNW_REPOURL) {
  $MVNW_REPO_PATTERN = if ($USE_MVND -eq $False) { "/org/apache/maven/" } else { "/maven/mvnd/" }
  $distributionUrl = "$env:MVNW_REPOURL$MVNW_REPO_PATTERN$($distributionUrl -replace "^.*$MVNW_REPO_PATTERN",'')"
}
$distributionUrlName = $distributionUrl -replace '^.*/',''
$distributionUrlNameMain = $distributionUrlName -replace '\.[^.]*$','' -replace '-bin$',''

$MAVEN_M2_PATH = "$HOME/.m2"
if ($env:MAVEN_USER_HOME) {
  $MAVEN_M2_PATH = "$env:MAVEN_USER_HOME"
}

if (-not (Test-Path -Path $MAVEN_M2_PATH)) {
    New-Item -Path $MAVEN_M2_PATH -ItemType Directory | Out-Null
}

$MAVEN_WRAPPER_DISTS = $null
if ((Get-Item $MAVEN_M2_PATH).Target[0] -eq $null) {
  $MAVEN_WRAPPER_DISTS = "$MAVEN_M2_PATH/wrapper/dists"
} else {
  $MAVEN_WRAPPER_DISTS = (Get-Item $MAVEN_M2_PATH).Target[0] + "/wrapper/dists"
}

$MAVEN_HOME_PARENT = "$MAVEN_WRAPPER_DISTS/$distributionUrlNameMain"
$MAVEN_HOME_NAME = ([System.Security.Cryptography.SHA256]::Create().ComputeHash([byte[]][char[]]$distributionUrl) | ForEach-Object {$_.ToString("x2")}) -join ''
$MAVEN_HOME = "$MAVEN_HOME_PARENT/$MAVEN_HOME_NAME"

if (Test-Path -Path "$MAVEN_HOME" -PathType Container) {
  Write-Verbose "found existing MAVEN_HOME at $MAVEN_HOME"
  Write-Output "MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD"
  exit $?
}

if (! $distributionUrlNameMain -or ($distributionUrlName -eq $distributionUrlNameMain)) {
  Write-Error "distributionUrl is not valid, must end with *-bin.zip, but found $distributionUrl"
}

# prepare tmp dir
$TMP_DOWNLOAD_DIR_HOLDER = New-TemporaryFile
$TMP_DOWNLOAD_DIR = New-Item -Itemtype Directory -Path "$TMP_DOWNLOAD_DIR_HOLDER.dir"
$TMP_DOWNLOAD_DIR_HOLDER.Delete() | Out-Null
trap {
  if ($TMP_DOWNLOAD_DIR.Exists) {
    try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }
    catch { Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR" }
  }
}

New-Item -Itemtype Directory -Path "$MAVEN_HOME_PARENT" -Force | Out-Null

# Download and Install Apache Maven
Write-Verbose "Couldn't find MAVEN_HOME, downloading and installing it ..."
Write-Verbose "Downloading from: $distributionUrl"
Write-Verbose "Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName"

$webclient = New-Object System.Net.WebClient
if ($env:MVNW_USERNAME -and $env:MVNW_PASSWORD) {
  $webclient.Credentials = New-Object System.Net.NetworkCredential($env:MVNW_USERNAME, $env:MVNW_PASSWORD)
}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$webclient.DownloadFile($distributionUrl, "$TMP_DOWNLOAD_DIR/$distributionUrlName") | Out-Null

# If specified, validate the SHA-256 sum of the Maven distribution zip file
$distributionSha256Sum = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionSha256Sum
if ($distributionSha256Sum) {
  if ($USE_MVND) {
    Write-Error "Checksum validation is not supported for maven-mvnd. `nPlease disable validation by removing 'distributionSha256Sum' from your maven-wrapper.properties."
  }
  Import-Module $PSHOME\Modules\Microsoft.PowerShell.Utility -Function Get-FileHash
  if ((Get-FileHash "$TMP_DOWNLOAD_DIR/$distributionUrlName" -Algorithm SHA256).Hash.ToLower() -ne $distributionSha256Sum) {
    Write-Error "Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised. If you updated your Maven version, you need to update the specified distributionSha256Sum property."
  }
}

# unzip and move
Expand-Archive "$TMP_DOWNLOAD_DIR/$distributionUrlName" -DestinationPath "$TMP_DOWNLOAD_DIR" | Out-Null

# Find the actual extracted directory name (handles snapshots where filename != directory name)
$actualDistributionDir = ""

# First try the expected directory name (for regular distributions)
$expectedPath = Join-Path "$TMP_DOWNLOAD_DIR" "$distributionUrlNameMain"
$expectedMvnPath = Join-Path "$expectedPath" "bin/$MVN_CMD"
if ((Test-Path -Path $expectedPath -PathType Container) -and (Test-Path -Path $expectedMvnPath -PathType Leaf)) {
  $actualDistributionDir = $distributionUrlNameMain
}

# If not found, search for any directory with the Maven executable (for snapshots)
if (!$actualDistributionDir) {
  Get-ChildItem -Path "$TMP_DOWNLOAD_DIR" -Directory | ForEach-Object {
    $testPath = Join-Path $_.FullName "bin/$MVN_CMD"
    if (Test-Path -Path $testPath -PathType Leaf) {
      $actualDistributionDir = $_.Name
    }
  }
}

if (!$actualDistributionDir) {
  Write-Error "Could not find Maven distribution directory in extracted archive"
}

Write-Verbose "Found extracted Maven distribution directory: $actualDistributionDir"
Rename-Item -Path "$TMP_DOWNLOAD_DIR/$actualDistributionDir" -NewName $MAVEN_HOME_NAME | Out-Null
try {
  Move-Item -Path "$TMP_DOWNLOAD_DIR/$MAVEN_HOME_NAME" -Destination $MAVEN_HOME_PARENT | Out-Null
} catch {
  if (! (Test-Path -Path "$MAVEN_HOME" -PathType Container)) {
    Write-Error "fail to move MAVEN_HOME"
  }
} finally {
  try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }
  catch { Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR" }
}

Write-Output "MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD"
````

### Code Walkthrough
1. <code>&lt;# : batch portion</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
2. <code>@REM ----------------------------------------------------------------------------</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
3. <code>@REM Licensed to the Apache Software Foundation (ASF) under one</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
4. <code>@REM or more contributor license agreements.  See the NOTICE file</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
5. <code>@REM distributed with this work for additional information</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
6. <code>@REM regarding copyright ownership.  The ASF licenses this file</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
7. <code>@REM to you under the Apache License, Version 2.0 (the</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
8. <code>@REM &quot;License&quot;); you may not use this file except in compliance</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
9. <code>@REM with the License.  You may obtain a copy of the License at</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
10. <code>@REM</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
11. <code>@REM    http://www.apache.org/licenses/LICENSE-2.0</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
12. <code>@REM</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
13. <code>@REM Unless required by applicable law or agreed to in writing,</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
14. <code>@REM software distributed under the License is distributed on an</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
15. <code>@REM &quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
16. <code>@REM KIND, either express or implied.  See the License for the</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
17. <code>@REM specific language governing permissions and limitations</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
18. <code>@REM under the License.</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
19. <code>@REM ----------------------------------------------------------------------------</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@REM ----------------------------------------------------------------------------</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
22. <code>@REM Apache Maven Wrapper startup batch script, version 3.3.4</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
23. <code>@REM</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
24. <code>@REM Optional ENV vars</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
25. <code>@REM   MVNW_REPOURL - repo url base for downloading maven distribution</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
26. <code>@REM   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
27. <code>@REM   MVNW_VERBOSE - true: enable verbose log; others: silence the output</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
28. <code>@REM ----------------------------------------------------------------------------</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>@IF &quot;%__MVNW_ARG0_NAME__%&quot;==&quot;&quot; (SET __MVNW_ARG0_NAME__=%~nx0)</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
31. <code>@SET __MVNW_CMD__=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
32. <code>@SET __MVNW_ERROR__=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
33. <code>@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
34. <code>@SET PSModulePath=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
35. <code>@FOR /F &quot;usebackq tokens=1* delims==&quot; %%A IN (`powershell -noprofile &quot;&amp; {$scriptDir=&#x27;%~dp0&#x27;; $script=&#x27;%__MVNW_ARG0_NAME__%&#x27;; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw &#x27;%~f0&#x27;))) -NoNewScope}&quot;`) DO @(</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
36. <code>  IF &quot;%%A&quot;==&quot;MVN_CMD&quot; (set __MVNW_CMD__=%%B) ELSE IF &quot;%%B&quot;==&quot;&quot; (echo %%A) ELSE (echo %%A=%%B)</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
37. <code>)</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
38. <code>@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
39. <code>@SET __MVNW_PSMODULEP_SAVE=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
40. <code>@SET __MVNW_ARG0_NAME__=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
41. <code>@SET MVNW_USERNAME=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
42. <code>@SET MVNW_PASSWORD=</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
43. <code>@IF NOT &quot;%__MVNW_CMD__%&quot;==&quot;&quot; (&quot;%__MVNW_CMD__%&quot; %*)</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
44. <code>@echo Cannot start maven from wrapper &gt;&amp;2 &amp;&amp; exit /b 1</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
45. <code>@GOTO :EOF</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
46. <code>: end batch / begin powershell #&gt;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
47. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
48. <code>$ErrorActionPreference = &quot;Stop&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
49. <code>if ($env:MVNW_VERBOSE -eq &quot;true&quot;) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
50. <code>  $VerbosePreference = &quot;Continue&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
51. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code># calculate distributionUrl, requires .mvn/wrapper/maven-wrapper.properties</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
54. <code>$distributionUrl = (Get-Content -Raw &quot;$scriptDir/.mvn/wrapper/maven-wrapper.properties&quot; | ConvertFrom-StringData).distributionUrl</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
55. <code>if (!$distributionUrl) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
56. <code>  Write-Error &quot;cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
57. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
58. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
59. <code>switch -wildcard -casesensitive ( $($distributionUrl -replace &#x27;^.*/&#x27;,&#x27;&#x27;) ) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
60. <code>  &quot;maven-mvnd-*&quot; {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
61. <code>    $USE_MVND = $true</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
62. <code>    $distributionUrl = $distributionUrl -replace &#x27;-bin\.[^.]*$&#x27;,&quot;-windows-amd64.zip&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
63. <code>    $MVN_CMD = &quot;mvnd.cmd&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
64. <code>    break</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
65. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
66. <code>  default {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
67. <code>    $USE_MVND = $false</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
68. <code>    $MVN_CMD = $script -replace &#x27;^mvnw&#x27;,&#x27;mvn&#x27;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
69. <code>    break</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
70. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
71. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
72. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
73. <code># apply MVNW_REPOURL and calculate MAVEN_HOME</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
74. <code># maven home pattern: ~/.m2/wrapper/dists/{apache-maven-&lt;version&gt;,maven-mvnd-&lt;version&gt;-&lt;platform&gt;}/&lt;hash&gt;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
75. <code>if ($env:MVNW_REPOURL) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
76. <code>  $MVNW_REPO_PATTERN = if ($USE_MVND -eq $False) { &quot;/org/apache/maven/&quot; } else { &quot;/maven/mvnd/&quot; }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
77. <code>  $distributionUrl = &quot;$env:MVNW_REPOURL$MVNW_REPO_PATTERN$($distributionUrl -replace &quot;^.*$MVNW_REPO_PATTERN&quot;,&#x27;&#x27;)&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
78. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
79. <code>$distributionUrlName = $distributionUrl -replace &#x27;^.*/&#x27;,&#x27;&#x27;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
80. <code>$distributionUrlNameMain = $distributionUrlName -replace &#x27;\.[^.]*$&#x27;,&#x27;&#x27; -replace &#x27;-bin$&#x27;,&#x27;&#x27;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
81. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
82. <code>$MAVEN_M2_PATH = &quot;$HOME/.m2&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
83. <code>if ($env:MAVEN_USER_HOME) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
84. <code>  $MAVEN_M2_PATH = &quot;$env:MAVEN_USER_HOME&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
85. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
86. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
87. <code>if (-not (Test-Path -Path $MAVEN_M2_PATH)) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
88. <code>    New-Item -Path $MAVEN_M2_PATH -ItemType Directory | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
89. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
90. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
91. <code>$MAVEN_WRAPPER_DISTS = $null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
92. <code>if ((Get-Item $MAVEN_M2_PATH).Target[0] -eq $null) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
93. <code>  $MAVEN_WRAPPER_DISTS = &quot;$MAVEN_M2_PATH/wrapper/dists&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
94. <code>} else {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
95. <code>  $MAVEN_WRAPPER_DISTS = (Get-Item $MAVEN_M2_PATH).Target[0] + &quot;/wrapper/dists&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
96. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
97. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
98. <code>$MAVEN_HOME_PARENT = &quot;$MAVEN_WRAPPER_DISTS/$distributionUrlNameMain&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
99. <code>$MAVEN_HOME_NAME = ([System.Security.Cryptography.SHA256]::Create().ComputeHash([byte[]][char[]]$distributionUrl) | ForEach-Object {$_.ToString(&quot;x2&quot;)}) -join &#x27;&#x27;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
100. <code>$MAVEN_HOME = &quot;$MAVEN_HOME_PARENT/$MAVEN_HOME_NAME&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
101. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
102. <code>if (Test-Path -Path &quot;$MAVEN_HOME&quot; -PathType Container) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
103. <code>  Write-Verbose &quot;found existing MAVEN_HOME at $MAVEN_HOME&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
104. <code>  Write-Output &quot;MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
105. <code>  exit $?</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
106. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
107. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
108. <code>if (! $distributionUrlNameMain -or ($distributionUrlName -eq $distributionUrlNameMain)) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
109. <code>  Write-Error &quot;distributionUrl is not valid, must end with *-bin.zip, but found $distributionUrl&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
110. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
111. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
112. <code># prepare tmp dir</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
113. <code>$TMP_DOWNLOAD_DIR_HOLDER = New-TemporaryFile</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
114. <code>$TMP_DOWNLOAD_DIR = New-Item -Itemtype Directory -Path &quot;$TMP_DOWNLOAD_DIR_HOLDER.dir&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
115. <code>$TMP_DOWNLOAD_DIR_HOLDER.Delete() | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
116. <code>trap {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
117. <code>  if ($TMP_DOWNLOAD_DIR.Exists) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
118. <code>    try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
119. <code>    catch { Write-Warning &quot;Cannot remove $TMP_DOWNLOAD_DIR&quot; }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
120. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
121. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
122. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
123. <code>New-Item -Itemtype Directory -Path &quot;$MAVEN_HOME_PARENT&quot; -Force | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
124. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
125. <code># Download and Install Apache Maven</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
126. <code>Write-Verbose &quot;Couldn&#x27;t find MAVEN_HOME, downloading and installing it ...&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
127. <code>Write-Verbose &quot;Downloading from: $distributionUrl&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
128. <code>Write-Verbose &quot;Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
129. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
130. <code>$webclient = New-Object System.Net.WebClient</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
131. <code>if ($env:MVNW_USERNAME -and $env:MVNW_PASSWORD) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
132. <code>  $webclient.Credentials = New-Object System.Net.NetworkCredential($env:MVNW_USERNAME, $env:MVNW_PASSWORD)</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
133. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
134. <code>[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
135. <code>$webclient.DownloadFile($distributionUrl, &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot;) | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
136. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
137. <code># If specified, validate the SHA-256 sum of the Maven distribution zip file</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
138. <code>$distributionSha256Sum = (Get-Content -Raw &quot;$scriptDir/.mvn/wrapper/maven-wrapper.properties&quot; | ConvertFrom-StringData).distributionSha256Sum</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
139. <code>if ($distributionSha256Sum) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
140. <code>  if ($USE_MVND) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
141. <code>    Write-Error &quot;Checksum validation is not supported for maven-mvnd. `nPlease disable validation by removing &#x27;distributionSha256Sum&#x27; from your maven-wrapper.properties.&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
142. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
143. <code>  Import-Module $PSHOME\Modules\Microsoft.PowerShell.Utility -Function Get-FileHash</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
144. <code>  if ((Get-FileHash &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; -Algorithm SHA256).Hash.ToLower() -ne $distributionSha256Sum) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
145. <code>    Write-Error &quot;Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised. If you updated your Maven version, you need to update the specified distributionSha256Sum property.&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
146. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
147. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
148. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
149. <code># unzip and move</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
150. <code>Expand-Archive &quot;$TMP_DOWNLOAD_DIR/$distributionUrlName&quot; -DestinationPath &quot;$TMP_DOWNLOAD_DIR&quot; | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
151. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
152. <code># Find the actual extracted directory name (handles snapshots where filename != directory name)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
153. <code>$actualDistributionDir = &quot;&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
154. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
155. <code># First try the expected directory name (for regular distributions)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
156. <code>$expectedPath = Join-Path &quot;$TMP_DOWNLOAD_DIR&quot; &quot;$distributionUrlNameMain&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
157. <code>$expectedMvnPath = Join-Path &quot;$expectedPath&quot; &quot;bin/$MVN_CMD&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
158. <code>if ((Test-Path -Path $expectedPath -PathType Container) -and (Test-Path -Path $expectedMvnPath -PathType Leaf)) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
159. <code>  $actualDistributionDir = $distributionUrlNameMain</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
160. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
161. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
162. <code># If not found, search for any directory with the Maven executable (for snapshots)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
163. <code>if (!$actualDistributionDir) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
164. <code>  Get-ChildItem -Path &quot;$TMP_DOWNLOAD_DIR&quot; -Directory | ForEach-Object {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
165. <code>    $testPath = Join-Path $_.FullName &quot;bin/$MVN_CMD&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
166. <code>    if (Test-Path -Path $testPath -PathType Leaf) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
167. <code>      $actualDistributionDir = $_.Name</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
168. <code>    }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
169. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
170. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
171. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
172. <code>if (!$actualDistributionDir) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
173. <code>  Write-Error &quot;Could not find Maven distribution directory in extracted archive&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
174. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
175. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
176. <code>Write-Verbose &quot;Found extracted Maven distribution directory: $actualDistributionDir&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
177. <code>Rename-Item -Path &quot;$TMP_DOWNLOAD_DIR/$actualDistributionDir&quot; -NewName $MAVEN_HOME_NAME | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
178. <code>try {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
179. <code>  Move-Item -Path &quot;$TMP_DOWNLOAD_DIR/$MAVEN_HOME_NAME&quot; -Destination $MAVEN_HOME_PARENT | Out-Null</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
180. <code>} catch {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
181. <code>  if (! (Test-Path -Path &quot;$MAVEN_HOME&quot; -PathType Container)) {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
182. <code>    Write-Error &quot;fail to move MAVEN_HOME&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
183. <code>  }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
184. <code>} finally {</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
185. <code>  try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
186. <code>  catch { Write-Warning &quot;Cannot remove $TMP_DOWNLOAD_DIR&quot; }</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
187. <code>}</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.
188. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
189. <code>Write-Output &quot;MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD&quot;</code> - Windows batch script line for the Maven wrapper. `cmd.exe` executes it to run Maven on Windows.

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

## `backend/pom.xml`

### File Purpose
The Maven project descriptor: it declares Java version, Spring Boot parent, dependencies, and build plugins for the backend.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.5.16</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.bank</groupId>
	<artifactId>banking-backend</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>banking-backend</name>
	<description/>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>21</java.version>
		<springdoc.version>2.8.6</springdoc.version>
		<mapstruct.version>1.6.3</mapstruct.version>
		<lombok-mapstruct-binding.version>0.2.0</lombok-mapstruct-binding.version>
		<jjwt.version>0.12.6</jjwt.version>
		<stripe.version>33.1.0</stripe.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-redis</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.flywaydb</groupId>
			<artifactId>flyway-core</artifactId>
		</dependency>
		<dependency>
			<groupId>org.flywaydb</groupId>
			<artifactId>flyway-database-postgresql</artifactId>
		</dependency>

		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springdoc</groupId>
			<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
			<version>${springdoc.version}</version>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>com.stripe</groupId>
			<artifactId>stripe-java</artifactId>
			<version>${stripe.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.kafka</groupId>
			<artifactId>spring-kafka</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-mail</artifactId>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-api</artifactId>
			<version>${jjwt.version}</version>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-impl</artifactId>
			<version>${jjwt.version}</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-jackson</artifactId>
			<version>${jjwt.version}</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-testcontainers</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.testcontainers</groupId>
			<artifactId>postgresql</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.testcontainers</groupId>
			<artifactId>kafka</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.kafka</groupId>
			<artifactId>spring-kafka-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.testcontainers</groupId>
			<artifactId>junit-jupiter</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<executions>
					<execution>
						<id>default-compile</id>
						<phase>compile</phase>
						<goals>
							<goal>compile</goal>
						</goals>
						<configuration>
							<annotationProcessorPaths>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok</artifactId>
								</path>
								<path>
									<groupId>org.mapstruct</groupId>
									<artifactId>mapstruct-processor</artifactId>
									<version>${mapstruct.version}</version>
								</path>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok-mapstruct-binding</artifactId>
									<version>${lombok-mapstruct-binding.version}</version>
								</path>
							</annotationProcessorPaths>
						</configuration>
					</execution>
					<execution>
						<id>default-testCompile</id>
						<phase>test-compile</phase>
						<goals>
							<goal>testCompile</goal>
						</goals>
						<configuration>
							<annotationProcessorPaths>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok</artifactId>
								</path>
								<path>
									<groupId>org.mapstruct</groupId>
									<artifactId>mapstruct-processor</artifactId>
									<version>${mapstruct.version}</version>
								</path>
								<path>
									<groupId>org.projectlombok</groupId>
									<artifactId>lombok-mapstruct-binding</artifactId>
									<version>${lombok-mapstruct-binding.version}</version>
								</path>
							</annotationProcessorPaths>
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>

</project>
````

### Code Walkthrough
1. <code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
2. <code>&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
3. <code>	xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
4. <code>	&lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
5. <code>	&lt;parent&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
6. <code>		&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
7. <code>		&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
8. <code>		&lt;version&gt;3.5.16&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
9. <code>		&lt;relativePath/&gt; &lt;!-- lookup parent from repository --&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
10. <code>	&lt;/parent&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
11. <code>	&lt;groupId&gt;com.bank&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
12. <code>	&lt;artifactId&gt;banking-backend&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
13. <code>	&lt;version&gt;0.0.1-SNAPSHOT&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
14. <code>	&lt;name&gt;banking-backend&lt;/name&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
15. <code>	&lt;description/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
16. <code>	&lt;url/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
17. <code>	&lt;licenses&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
18. <code>		&lt;license/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
19. <code>	&lt;/licenses&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
20. <code>	&lt;developers&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
21. <code>		&lt;developer/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
22. <code>	&lt;/developers&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
23. <code>	&lt;scm&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
24. <code>		&lt;connection/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
25. <code>		&lt;developerConnection/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
26. <code>		&lt;tag/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
27. <code>		&lt;url/&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
28. <code>	&lt;/scm&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
29. <code>	&lt;properties&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
30. <code>		&lt;java.version&gt;21&lt;/java.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
31. <code>		&lt;springdoc.version&gt;2.8.6&lt;/springdoc.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
32. <code>		&lt;mapstruct.version&gt;1.6.3&lt;/mapstruct.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
33. <code>		&lt;lombok-mapstruct-binding.version&gt;0.2.0&lt;/lombok-mapstruct-binding.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
34. <code>		&lt;jjwt.version&gt;0.12.6&lt;/jjwt.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
35. <code>		&lt;stripe.version&gt;33.1.0&lt;/stripe.version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
36. <code>	&lt;/properties&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
37. <code>	&lt;dependencies&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
38. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
39. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
40. <code>			&lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
41. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
42. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
43. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
44. <code>			&lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
45. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
46. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
47. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
48. <code>			&lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
49. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
50. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
51. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
52. <code>			&lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
53. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
54. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
55. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
56. <code>			&lt;artifactId&gt;spring-boot-starter-validation&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
57. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
58. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
59. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
60. <code>			&lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
61. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
62. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
63. <code>			&lt;groupId&gt;org.flywaydb&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
64. <code>			&lt;artifactId&gt;flyway-core&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
65. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
66. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
67. <code>			&lt;groupId&gt;org.flywaydb&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
68. <code>			&lt;artifactId&gt;flyway-database-postgresql&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
69. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
72. <code>			&lt;groupId&gt;org.postgresql&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
73. <code>			&lt;artifactId&gt;postgresql&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
74. <code>			&lt;scope&gt;runtime&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
75. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
76. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
77. <code>			&lt;groupId&gt;org.springdoc&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
78. <code>			&lt;artifactId&gt;springdoc-openapi-starter-webmvc-ui&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
79. <code>			&lt;version&gt;${springdoc.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
80. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
81. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
82. <code>			&lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
83. <code>			&lt;artifactId&gt;mapstruct&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
84. <code>			&lt;version&gt;${mapstruct.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
85. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
86. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
87. <code>			&lt;groupId&gt;com.stripe&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
88. <code>			&lt;artifactId&gt;stripe-java&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
89. <code>			&lt;version&gt;${stripe.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
90. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
91. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
92. <code>			&lt;groupId&gt;org.springframework.kafka&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
93. <code>			&lt;artifactId&gt;spring-kafka&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
94. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
95. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
96. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
97. <code>			&lt;artifactId&gt;spring-boot-starter-mail&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
98. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
99. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
100. <code>			&lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
101. <code>			&lt;artifactId&gt;jjwt-api&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
102. <code>			&lt;version&gt;${jjwt.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
103. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
104. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
105. <code>			&lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
106. <code>			&lt;artifactId&gt;jjwt-impl&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
107. <code>			&lt;version&gt;${jjwt.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
108. <code>			&lt;scope&gt;runtime&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
109. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
110. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
111. <code>			&lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
112. <code>			&lt;artifactId&gt;jjwt-jackson&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
113. <code>			&lt;version&gt;${jjwt.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
114. <code>			&lt;scope&gt;runtime&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
115. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
116. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
117. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
118. <code>			&lt;artifactId&gt;spring-boot-testcontainers&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
119. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
120. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
121. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
122. <code>			&lt;groupId&gt;org.testcontainers&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
123. <code>			&lt;artifactId&gt;postgresql&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
124. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
125. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
126. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
127. <code>			&lt;groupId&gt;org.testcontainers&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
128. <code>			&lt;artifactId&gt;kafka&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
129. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
130. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
131. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
132. <code>			&lt;groupId&gt;org.springframework.kafka&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
133. <code>			&lt;artifactId&gt;spring-kafka-test&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
134. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
135. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
136. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
137. <code>			&lt;groupId&gt;org.testcontainers&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
138. <code>			&lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
139. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
140. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
141. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
142. <code>			&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
143. <code>			&lt;artifactId&gt;lombok&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
144. <code>			&lt;optional&gt;true&lt;/optional&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
145. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
146. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
147. <code>			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
148. <code>			&lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
149. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
150. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
151. <code>		&lt;dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
152. <code>			&lt;groupId&gt;org.springframework.security&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
153. <code>			&lt;artifactId&gt;spring-security-test&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
154. <code>			&lt;scope&gt;test&lt;/scope&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
155. <code>		&lt;/dependency&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
156. <code>	&lt;/dependencies&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
157. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
158. <code>	&lt;build&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
159. <code>		&lt;plugins&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
160. <code>			&lt;plugin&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
161. <code>				&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
162. <code>				&lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
163. <code>				&lt;configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
164. <code>					&lt;excludes&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
165. <code>						&lt;exclude&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
166. <code>							&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
167. <code>							&lt;artifactId&gt;lombok&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
168. <code>						&lt;/exclude&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
169. <code>					&lt;/excludes&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
170. <code>				&lt;/configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
171. <code>			&lt;/plugin&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
172. <code>			&lt;plugin&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
173. <code>				&lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
174. <code>				&lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
175. <code>				&lt;executions&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
176. <code>					&lt;execution&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
177. <code>						&lt;id&gt;default-compile&lt;/id&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
178. <code>						&lt;phase&gt;compile&lt;/phase&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
179. <code>						&lt;goals&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
180. <code>							&lt;goal&gt;compile&lt;/goal&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
181. <code>						&lt;/goals&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
182. <code>						&lt;configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
183. <code>							&lt;annotationProcessorPaths&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
184. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
185. <code>									&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
186. <code>									&lt;artifactId&gt;lombok&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
187. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
188. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
189. <code>									&lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
190. <code>									&lt;artifactId&gt;mapstruct-processor&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
191. <code>									&lt;version&gt;${mapstruct.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
192. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
193. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
194. <code>									&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
195. <code>									&lt;artifactId&gt;lombok-mapstruct-binding&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
196. <code>									&lt;version&gt;${lombok-mapstruct-binding.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
197. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
198. <code>							&lt;/annotationProcessorPaths&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
199. <code>						&lt;/configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
200. <code>					&lt;/execution&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
201. <code>					&lt;execution&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
202. <code>						&lt;id&gt;default-testCompile&lt;/id&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
203. <code>						&lt;phase&gt;test-compile&lt;/phase&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
204. <code>						&lt;goals&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
205. <code>							&lt;goal&gt;testCompile&lt;/goal&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
206. <code>						&lt;/goals&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
207. <code>						&lt;configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
208. <code>							&lt;annotationProcessorPaths&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
209. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
210. <code>									&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
211. <code>									&lt;artifactId&gt;lombok&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
212. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
213. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
214. <code>									&lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
215. <code>									&lt;artifactId&gt;mapstruct-processor&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
216. <code>									&lt;version&gt;${mapstruct.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
217. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
218. <code>								&lt;path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
219. <code>									&lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
220. <code>									&lt;artifactId&gt;lombok-mapstruct-binding&lt;/artifactId&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
221. <code>									&lt;version&gt;${lombok-mapstruct-binding.version}&lt;/version&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
222. <code>								&lt;/path&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
223. <code>							&lt;/annotationProcessorPaths&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
224. <code>						&lt;/configuration&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
225. <code>					&lt;/execution&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
226. <code>				&lt;/executions&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
227. <code>			&lt;/plugin&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
228. <code>		&lt;/plugins&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
229. <code>	&lt;/build&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.
230. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
231. <code>&lt;/project&gt;</code> - XML configuration line. Maven or SVG tooling parses the tag/attribute structure to build the project or render an asset.

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

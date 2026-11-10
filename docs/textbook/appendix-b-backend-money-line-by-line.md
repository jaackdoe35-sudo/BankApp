# Appendix B: Backend Accounts, Ledger, and Transfers

This appendix covers the core money movement modules: accounts, double-entry ledger, posting lines, transfers, and beneficiaries.

> Reading note: each section includes the file purpose, import/dependency role, complete source listing where the file is textual, and a line-by-line walkthrough. Generated dependency/build directories are excluded from this book.

## `backend/src/main/java/com/bank/account/domain/Account.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.persistence.Column` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Entity` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.EnumType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Enumerated` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GeneratedValue` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GenerationType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Id` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Table` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Version` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.UpdateTimestamp` | External or local dependency required by references in this file. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    /** Null for SYSTEM accounts. */
    @Column(name = "owner_user_id")
    private UUID ownerUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public Account(String accountNumber, UUID ownerUserId, AccountType type, String currency) {
        this.accountNumber = accountNumber;
        this.ownerUserId = ownerUserId;
        this.type = type;
        this.currency = currency;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.EnumType;</code> - Imports `jakarta.persistence.EnumType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.Enumerated;</code> - Imports `jakarta.persistence.Enumerated` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import jakarta.persistence.Version;</code> - Imports `jakarta.persistence.Version` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.hibernate.annotations.UpdateTimestamp;</code> - Imports `org.hibernate.annotations.UpdateTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
23. <code>@Table(name = &quot;accounts&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
24. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>public class Account {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
30. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
31. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Column(name = &quot;account_number&quot;, nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
34. <code>    private String accountNumber;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    /** Null for SYSTEM accounts. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
37. <code>    @Column(name = &quot;owner_user_id&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
38. <code>    private UUID ownerUserId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
41. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
42. <code>    private AccountType type;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @Column(nullable = false, length = 3)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
45. <code>    private String currency = &quot;USD&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @Column(nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private BigDecimal balance = BigDecimal.ZERO;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
51. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
52. <code>    private AccountStatus status = AccountStatus.ACTIVE;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
56. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
57. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
58. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
59. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
60. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
61. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
62. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
63. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
64. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
65. <code>    public Account(String accountNumber, UUID ownerUserId, AccountType type, String currency) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
66. <code>        this.accountNumber = accountNumber;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
67. <code>        this.ownerUserId = ownerUserId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
68. <code>        this.type = type;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
69. <code>        this.currency = currency;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
70. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 65 | `public Account(String accountNumber, UUID ownerUserId, AccountType type, String currency)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `Account`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/account/domain/AccountStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.account.domain;

public enum AccountStatus {
    ACTIVE,
    FROZEN,
    CLOSED
}
````

### Code Walkthrough
1. <code>package com.bank.account.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum AccountStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    ACTIVE,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    FROZEN,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    CLOSED</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
7. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/account/domain/AccountType.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.account.domain;

public enum AccountType {
    CHECKING,
    SAVINGS,
    /** Internal settlement/GL account; not owned by a customer. */
    SYSTEM
}
````

### Code Walkthrough
1. <code>package com.bank.account.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum AccountType {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    CHECKING,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    SAVINGS,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    /** Internal settlement/GL account; not owned by a customer. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>    SYSTEM</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
8. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/account/dto/AccountResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.Account` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.dto;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        String accountNumber,
        AccountType type,
        String currency,
        BigDecimal balance,
        AccountStatus status,
        Instant createdAt
) {
    public static AccountResponse from(Account a) {
        return new AccountResponse(
                a.getId(),
                a.getAccountNumber(),
                a.getType(),
                a.getCurrency(),
                a.getBalance(),
                a.getStatus(),
                a.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountStatus;</code> - Imports `com.bank.account.domain.AccountStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>public record AccountResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String accountNumber,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        AccountType type,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        String currency,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        BigDecimal balance,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        AccountStatus status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <code>    public static AccountResponse from(Account a) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>        return new AccountResponse(</code> - Returns a value/reference to the caller and ends this execution path.
22. <code>                a.getId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
23. <code>                a.getAccountNumber(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
24. <code>                a.getType(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
25. <code>                a.getCurrency(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
26. <code>                a.getBalance(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
27. <code>                a.getStatus(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
28. <code>                a.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 20 | `public static AccountResponse from(Account a)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/account/dto/AmountRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Digits` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotNull` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Positive` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record AmountRequest(
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount
) {
}
````

### Code Walkthrough
1. <code>package com.bank.account.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.Positive;</code> - Imports `jakarta.validation.constraints.Positive` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public record AmountRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
10. <code>        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount</code> - Bean Validation annotation. Spring validates request data before business logic runs.
11. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
12. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/account/dto/CreateAccountRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `jakarta.validation.constraints.NotNull` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.account.dto;

import com.bank.account.domain.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(
        @NotNull AccountType type,
        String currency
) {
}
````

### Code Walkthrough
1. <code>package com.bank.account.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>public record CreateAccountRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
7. <code>        @NotNull AccountType type,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
8. <code>        String currency</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
10. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/account/dto/LedgerEntryResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.ledger.domain.EntryDirection` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.LedgerEntry` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.dto;

import com.bank.ledger.domain.EntryDirection;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LedgerEntryResponse(
        UUID id,
        UUID transactionId,
        String reference,
        TransactionType type,
        String description,
        EntryDirection direction,
        BigDecimal amount,
        BigDecimal balanceAfter,
        Instant createdAt
) {
    public static LedgerEntryResponse from(LedgerEntry e) {
        var txn = e.getTransaction();
        return new LedgerEntryResponse(
                e.getId(),
                txn.getId(),
                txn.getReference(),
                txn.getType(),
                txn.getDescription(),
                e.getDirection(),
                e.getAmount(),
                e.getBalanceAfter(),
                e.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.ledger.domain.EntryDirection;</code> - Imports `com.bank.ledger.domain.EntryDirection` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.ledger.domain.LedgerEntry;</code> - Imports `com.bank.ledger.domain.LedgerEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>public record LedgerEntryResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        UUID transactionId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String reference,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        TransactionType type,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        String description,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        EntryDirection direction,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        BigDecimal amount,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>        BigDecimal balanceAfter,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
21. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
22. <code>    public static LedgerEntryResponse from(LedgerEntry e) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        var txn = e.getTransaction();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
24. <code>        return new LedgerEntryResponse(</code> - Returns a value/reference to the caller and ends this execution path.
25. <code>                e.getId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
26. <code>                txn.getId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
27. <code>                txn.getReference(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
28. <code>                txn.getType(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                txn.getDescription(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                e.getDirection(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                e.getAmount(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                e.getBalanceAfter(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                e.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 22 | `public static LedgerEntryResponse from(LedgerEntry e)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/account/package-info.java`

### File Purpose
A package-level documentation file: it explains the module boundary for Java readers and generated docs.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
/**
 * account module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.account;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * account module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.account;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/account/repo/AccountRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.Account` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `jakarta.persistence.LockModeType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.jpa.repository.Lock` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.jpa.repository.Query` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.repository.query.Param` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.repo;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);

    Optional<Account> findByIdAndOwnerUserId(UUID id, UUID ownerUserId);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findFirstByTypeAndCurrency(AccountType type, String currency);

    boolean existsByAccountNumber(String accountNumber);

    /** Acquires a row-level write lock for safe balance updates during posting. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.id = :id")
    Optional<Account> findForUpdate(@Param("id") UUID id);
}
````

### Code Walkthrough
1. <code>package com.bank.account.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.LockModeType;</code> - Imports `jakarta.persistence.LockModeType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.data.jpa.repository.Lock;</code> - Imports `org.springframework.data.jpa.repository.Lock` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.data.jpa.repository.Query;</code> - Imports `org.springframework.data.jpa.repository.Query` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.data.repository.query.Param;</code> - Imports `org.springframework.data.repository.query.Param` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>public interface AccountRepository extends JpaRepository&lt;Account, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    List&lt;Account&gt; findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    Optional&lt;Account&gt; findByIdAndOwnerUserId(UUID id, UUID ownerUserId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    Optional&lt;Account&gt; findByAccountNumber(String accountNumber);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    Optional&lt;Account&gt; findFirstByTypeAndCurrency(AccountType type, String currency);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    boolean existsByAccountNumber(String accountNumber);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    /** Acquires a row-level write lock for safe balance updates during posting. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code>    @Lock(LockModeType.PESSIMISTIC_WRITE)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
29. <code>    @Query(&quot;select a from Account a where a.id = :id&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>    Optional&lt;Account&gt; findForUpdate(@Param(&quot;id&quot;) UUID id);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
31. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/account/service/AccountService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.Account` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.repo.AccountRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.LedgerEntry` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.repo.LedgerEntryRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.LedgerService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.PostingLine` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.concurrent.ThreadLocalRandom` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.repo.LedgerEntryRepository;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountService {

    private static final String DEFAULT_CURRENCY = "USD";

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final LedgerService ledgerService;

    public AccountService(AccountRepository accountRepository,
                          LedgerEntryRepository ledgerEntryRepository,
                          LedgerService ledgerService) {
        this.accountRepository = accountRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public Account createAccount(UUID userId, AccountType type, String currency) {
        if (type == AccountType.SYSTEM) {
            throw new IllegalArgumentException("Cannot open a SYSTEM account");
        }
        String ccy = currency == null ? DEFAULT_CURRENCY : currency.toUpperCase();
        if (!DEFAULT_CURRENCY.equals(ccy)) {
            throw new IllegalArgumentException("Only USD accounts are supported");
        }
        Account account = new Account(generateAccountNumber(), userId, type, ccy);
        return accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public List<Account> listAccounts(UUID userId) {
        return accountRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional(readOnly = true)
    public Account getAccount(UUID userId, UUID accountId) {
        return requireOwnedAccount(userId, accountId);
    }

    @Transactional
    public Account deposit(UUID userId, UUID accountId, BigDecimal amount) {
        Account account = requireActiveAccount(userId, accountId);
        Account system = systemAccount(account.getCurrency());
        ledgerService.post(TransactionType.DEPOSIT, "Deposit", null, List.of(
                PostingLine.credit(account.getId(), amount),
                PostingLine.debit(system.getId(), amount)));
        return account;
    }

    @Transactional
    public Account withdraw(UUID userId, UUID accountId, BigDecimal amount) {
        Account account = requireActiveAccount(userId, accountId);
        Account system = systemAccount(account.getCurrency());
        ledgerService.post(TransactionType.WITHDRAWAL, "Withdrawal", null, List.of(
                PostingLine.debit(account.getId(), amount),
                PostingLine.credit(system.getId(), amount)));
        return account;
    }

    @Transactional(readOnly = true)
    public List<LedgerEntry> listTransactions(UUID userId, UUID accountId) {
        requireOwnedAccount(userId, accountId);
        return ledgerEntryRepository.findByAccountIdWithTransaction(accountId);
    }

    private Account requireOwnedAccount(UUID userId, UUID accountId) {
        return accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    private Account requireActiveAccount(UUID userId, UUID accountId) {
        Account account = requireOwnedAccount(userId, accountId);
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        return account;
    }

    private Account systemAccount(String currency) {
        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)
                .orElseThrow(() -> new NotFoundException("System account not configured for " + currency));
    }

    private String generateAccountNumber() {
        String candidate;
        do {
            long n = ThreadLocalRandom.current().nextLong(100_000_000_000L, 1_000_000_000_000L);
            candidate = Long.toString(n);
        } while (accountRepository.existsByAccountNumber(candidate));
        return candidate;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountStatus;</code> - Imports `com.bank.account.domain.AccountStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.ledger.domain.LedgerEntry;</code> - Imports `com.bank.ledger.domain.LedgerEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.ledger.repo.LedgerEntryRepository;</code> - Imports `com.bank.ledger.repo.LedgerEntryRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.ledger.service.LedgerService;</code> - Imports `com.bank.ledger.service.LedgerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.ledger.service.PostingLine;</code> - Imports `com.bank.ledger.service.PostingLine` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.concurrent.ThreadLocalRandom;</code> - Imports `java.util.concurrent.ThreadLocalRandom` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
22. <code>public class AccountService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    private static final String DEFAULT_CURRENCY = &quot;USD&quot;;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
27. <code>    private final LedgerEntryRepository ledgerEntryRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
28. <code>    private final LedgerService ledgerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    public AccountService(AccountRepository accountRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
31. <code>                          LedgerEntryRepository ledgerEntryRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                          LedgerService ledgerService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
34. <code>        this.ledgerEntryRepository = ledgerEntryRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>        this.ledgerService = ledgerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
39. <code>    public Account createAccount(UUID userId, AccountType type, String currency) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        if (type == AccountType.SYSTEM) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>            throw new IllegalArgumentException(&quot;Cannot open a SYSTEM account&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
42. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>        String ccy = currency == null ? DEFAULT_CURRENCY : currency.toUpperCase();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
44. <code>        if (!DEFAULT_CURRENCY.equals(ccy)) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>            throw new IllegalArgumentException(&quot;Only USD accounts are supported&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
46. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        Account account = new Account(generateAccountNumber(), userId, type, ccy);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>        return accountRepository.save(account);</code> - Returns a value/reference to the caller and ends this execution path.
49. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
51. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
52. <code>    public List&lt;Account&gt; listAccounts(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <code>        return accountRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);</code> - Returns a value/reference to the caller and ends this execution path.
54. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
57. <code>    public Account getAccount(UUID userId, UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        return requireOwnedAccount(userId, accountId);</code> - Returns a value/reference to the caller and ends this execution path.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
61. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
62. <code>    public Account deposit(UUID userId, UUID accountId, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <code>        Account account = requireActiveAccount(userId, accountId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
64. <code>        Account system = systemAccount(account.getCurrency());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
65. <code>        ledgerService.post(TransactionType.DEPOSIT, &quot;Deposit&quot;, null, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
66. <code>                PostingLine.credit(account.getId(), amount),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
67. <code>                PostingLine.debit(system.getId(), amount)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
68. <code>        return account;</code> - Returns a value/reference to the caller and ends this execution path.
69. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
72. <code>    public Account withdraw(UUID userId, UUID accountId, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
73. <code>        Account account = requireActiveAccount(userId, accountId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
74. <code>        Account system = systemAccount(account.getCurrency());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
75. <code>        ledgerService.post(TransactionType.WITHDRAWAL, &quot;Withdrawal&quot;, null, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                PostingLine.debit(account.getId(), amount),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                PostingLine.credit(system.getId(), amount)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
78. <code>        return account;</code> - Returns a value/reference to the caller and ends this execution path.
79. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
81. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
82. <code>    public List&lt;LedgerEntry&gt; listTransactions(UUID userId, UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <code>        requireOwnedAccount(userId, accountId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
84. <code>        return ledgerEntryRepository.findByAccountIdWithTransaction(accountId);</code> - Returns a value/reference to the caller and ends this execution path.
85. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
87. <code>    private Account requireOwnedAccount(UUID userId, UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
88. <code>        return accountRepository.findByIdAndOwnerUserId(accountId, userId)</code> - Returns a value/reference to the caller and ends this execution path.
89. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
90. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
91. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
92. <code>    private Account requireActiveAccount(UUID userId, UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
93. <code>        Account account = requireOwnedAccount(userId, accountId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
94. <code>        if (account.getStatus() != AccountStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
95. <code>            throw new IllegalArgumentException(&quot;Account is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
96. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
97. <code>        return account;</code> - Returns a value/reference to the caller and ends this execution path.
98. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
99. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
100. <code>    private Account systemAccount(String currency) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
101. <code>        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)</code> - Returns a value/reference to the caller and ends this execution path.
102. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;System account not configured for &quot; + currency));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
103. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
104. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
105. <code>    private String generateAccountNumber() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
106. <code>        String candidate;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
107. <code>        do {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
108. <code>            long n = ThreadLocalRandom.current().nextLong(100_000_000_000L, 1_000_000_000_000L);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
109. <code>            candidate = Long.toString(n);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
110. <code>        } while (accountRepository.existsByAccountNumber(candidate));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
111. <code>        return candidate;</code> - Returns a value/reference to the caller and ends this execution path.
112. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
113. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 39 | `public Account createAccount(UUID userId, AccountType type, String currency)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `createAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 52 | `public List&lt;Account&gt; listAccounts(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `listAccounts`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 57 | `public Account getAccount(UUID userId, UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `getAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 62 | `public Account deposit(UUID userId, UUID accountId, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `deposit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 72 | `public Account withdraw(UUID userId, UUID accountId, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `withdraw`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 82 | `public List&lt;LedgerEntry&gt; listTransactions(UUID userId, UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `listTransactions`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 87 | `private Account requireOwnedAccount(UUID userId, UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireOwnedAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 92 | `private Account requireActiveAccount(UUID userId, UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireActiveAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 100 | `private Account systemAccount(String currency)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `systemAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 105 | `private String generateAccountNumber()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `generateAccountNumber`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(k) for a fixed-size identifier/card number, so effectively O(1) in this project. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/account/web/AccountController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.dto.AccountResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.dto.AmountRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.dto.CreateAccountRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.dto.LedgerEntryResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.service.AccountService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.http.HttpStatus` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PathVariable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.account.web;

import com.bank.account.dto.AccountResponse;
import com.bank.account.dto.AmountRequest;
import com.bank.account.dto.CreateAccountRequest;
import com.bank.account.dto.LedgerEntryResponse;
import com.bank.account.service.AccountService;
import com.bank.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@Tag(name = "Accounts", description = "Bank accounts, deposits, withdrawals, and history")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    @Operation(summary = "Open a new account")
    public ResponseEntity<AccountResponse> create(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse body = AccountResponse.from(
                accountService.createAccount(SecurityUtils.currentUserId(), request.type(), request.currency()));
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping
    @Operation(summary = "List my accounts")
    public List<AccountResponse> list() {
        return accountService.listAccounts(SecurityUtils.currentUserId()).stream()
                .map(AccountResponse::from)
                .toList();
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Get one of my accounts")
    public AccountResponse get(@PathVariable UUID accountId) {
        return AccountResponse.from(accountService.getAccount(SecurityUtils.currentUserId(), accountId));
    }

    @PostMapping("/{accountId}/deposit")
    @Operation(summary = "Deposit money into an account")
    public AccountResponse deposit(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request) {
        return AccountResponse.from(
                accountService.deposit(SecurityUtils.currentUserId(), accountId, request.amount()));
    }

    @PostMapping("/{accountId}/withdraw")
    @Operation(summary = "Withdraw money from an account")
    public AccountResponse withdraw(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request) {
        return AccountResponse.from(
                accountService.withdraw(SecurityUtils.currentUserId(), accountId, request.amount()));
    }

    @GetMapping("/{accountId}/transactions")
    @Operation(summary = "List an account's transaction history (newest first)")
    public List<LedgerEntryResponse> transactions(@PathVariable UUID accountId) {
        return accountService.listTransactions(SecurityUtils.currentUserId(), accountId).stream()
                .map(LedgerEntryResponse::from)
                .toList();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.account.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.dto.AccountResponse;</code> - Imports `com.bank.account.dto.AccountResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.dto.AmountRequest;</code> - Imports `com.bank.account.dto.AmountRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.dto.CreateAccountRequest;</code> - Imports `com.bank.account.dto.CreateAccountRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.account.dto.LedgerEntryResponse;</code> - Imports `com.bank.account.dto.LedgerEntryResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.account.service.AccountService;</code> - Imports `com.bank.account.service.AccountService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
26. <code>@RequestMapping(&quot;/api/v1/accounts&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
27. <code>@Tag(name = &quot;Accounts&quot;, description = &quot;Bank accounts, deposits, withdrawals, and history&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
29. <code>public class AccountController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    private final AccountService accountService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    public AccountController(AccountService accountService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        this.accountService = accountService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @PostMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
38. <code>    @Operation(summary = &quot;Open a new account&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    public ResponseEntity&lt;AccountResponse&gt; create(@Valid @RequestBody CreateAccountRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        AccountResponse body = AccountResponse.from(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                accountService.createAccount(SecurityUtils.currentUserId(), request.type(), request.currency()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>        return ResponseEntity.status(HttpStatus.CREATED).body(body);</code> - Returns a value/reference to the caller and ends this execution path.
43. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
46. <code>    @Operation(summary = &quot;List my accounts&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
47. <code>    public List&lt;AccountResponse&gt; list() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <code>        return accountService.listAccounts(SecurityUtils.currentUserId()).stream()</code> - Returns a value/reference to the caller and ends this execution path.
49. <code>                .map(AccountResponse::from)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @GetMapping(&quot;/{accountId}&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
54. <code>    @Operation(summary = &quot;Get one of my accounts&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>    public AccountResponse get(@PathVariable UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <code>        return AccountResponse.from(accountService.getAccount(SecurityUtils.currentUserId(), accountId));</code> - Returns a value/reference to the caller and ends this execution path.
57. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
59. <code>    @PostMapping(&quot;/{accountId}/deposit&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
60. <code>    @Operation(summary = &quot;Deposit money into an account&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
61. <code>    public AccountResponse deposit(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <code>        return AccountResponse.from(</code> - Returns a value/reference to the caller and ends this execution path.
63. <code>                accountService.deposit(SecurityUtils.currentUserId(), accountId, request.amount()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    @PostMapping(&quot;/{accountId}/withdraw&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
67. <code>    @Operation(summary = &quot;Withdraw money from an account&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
68. <code>    public AccountResponse withdraw(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <code>        return AccountResponse.from(</code> - Returns a value/reference to the caller and ends this execution path.
70. <code>                accountService.withdraw(SecurityUtils.currentUserId(), accountId, request.amount()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
71. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
72. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
73. <code>    @GetMapping(&quot;/{accountId}/transactions&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
74. <code>    @Operation(summary = &quot;List an account&#x27;s transaction history (newest first)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
75. <code>    public List&lt;LedgerEntryResponse&gt; transactions(@PathVariable UUID accountId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>        return accountService.listTransactions(SecurityUtils.currentUserId(), accountId).stream()</code> - Returns a value/reference to the caller and ends this execution path.
77. <code>                .map(LedgerEntryResponse::from)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 33 | `public AccountController(AccountService accountService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AccountController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 39 | `public ResponseEntity&lt;AccountResponse&gt; create(@Valid @RequestBody CreateAccountRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `create`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 47 | `public List&lt;AccountResponse&gt; list()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 55 | `public AccountResponse get(@PathVariable UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `get`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 61 | `public AccountResponse deposit(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `deposit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 68 | `public AccountResponse withdraw(@PathVariable UUID accountId, @Valid @RequestBody AmountRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `withdraw`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 75 | `public List&lt;LedgerEntryResponse&gt; transactions(@PathVariable UUID accountId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `transactions`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/ledger/domain/EntryDirection.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.domain;

import java.math.BigDecimal;

/**
 * Double-entry direction. Uniform sign rule: a CREDIT adds to an account's
 * balance and a DEBIT subtracts. A transaction is balanced iff its entries'
 * signed amounts sum to zero.
 */
public enum EntryDirection {
    DEBIT,
    CREDIT;

    public BigDecimal apply(BigDecimal amount) {
        return this == CREDIT ? amount : amount.negate();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> * Double-entry direction. Uniform sign rule: a CREDIT adds to an account&#x27;s</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code> * balance and a DEBIT subtracts. A transaction is balanced iff its entries&#x27;</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * signed amounts sum to zero.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>public enum EntryDirection {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <code>    DEBIT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>    CREDIT;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    public BigDecimal apply(BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>        return this == CREDIT ? amount : amount.negate();</code> - Returns a value/reference to the caller and ends this execution path.
16. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 14 | `public BigDecimal apply(BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `apply`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/ledger/domain/LedgerEntry.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.persistence.Column` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Entity` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.EnumType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Enumerated` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GeneratedValue` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GenerationType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Id` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.JoinColumn` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.ManyToOne` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Table` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * One side of a double-entry transaction against a single account. Immutable
 * once posted; {@code balanceAfter} records the account balance after this entry.
 */
@Entity
@Table(name = "ledger_entries")
@Getter
@Setter
@NoArgsConstructor
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryDirection direction;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "balance_after", precision = 19, scale = 4)
    private BigDecimal balanceAfter;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public LedgerEntry(UUID accountId, EntryDirection direction, BigDecimal amount) {
        this.accountId = accountId;
        this.direction = direction;
        this.amount = amount;
    }

    /** Signed amount per the uniform sign rule (credit positive, debit negative). */
    public BigDecimal signedAmount() {
        return direction.apply(amount);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.EnumType;</code> - Imports `jakarta.persistence.EnumType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.Enumerated;</code> - Imports `jakarta.persistence.Enumerated` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.persistence.JoinColumn;</code> - Imports `jakarta.persistence.JoinColumn` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import jakarta.persistence.ManyToOne;</code> - Imports `jakarta.persistence.ManyToOne` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code> * One side of a double-entry transaction against a single account. Immutable</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code> * once posted; {@code balanceAfter} records the account balance after this entry.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
27. <code>@Table(name = &quot;ledger_entries&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
28. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
29. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>public class LedgerEntry {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
34. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
35. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @ManyToOne(optional = false)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    @JoinColumn(name = &quot;transaction_id&quot;, nullable = false)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    private Transaction transaction;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Column(name = &quot;account_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
42. <code>    private UUID accountId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
45. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
46. <code>    private EntryDirection direction;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
47. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
48. <code>    @Column(nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
49. <code>    private BigDecimal amount;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
50. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
51. <code>    @Column(name = &quot;balance_after&quot;, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
52. <code>    private BigDecimal balanceAfter;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
56. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
57. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
58. <code>    public LedgerEntry(UUID accountId, EntryDirection direction, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>        this.accountId = accountId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>        this.direction = direction;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
61. <code>        this.amount = amount;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
62. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
64. <code>    /** Signed amount per the uniform sign rule (credit positive, debit negative). */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
65. <code>    public BigDecimal signedAmount() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
66. <code>        return direction.apply(amount);</code> - Returns a value/reference to the caller and ends this execution path.
67. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 58 | `public LedgerEntry(UUID accountId, EntryDirection direction, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `LedgerEntry`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 65 | `public BigDecimal signedAmount()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `signedAmount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/ledger/domain/Transaction.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.persistence.CascadeType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Column` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Entity` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.EnumType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Enumerated` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GeneratedValue` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GenerationType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Id` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.OneToMany` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Table` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.ArrayList` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A journal entry: a single business event made up of two or more balanced
 * {@link LedgerEntry} rows.
 */
@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    private String description;

    @Column(name = "idempotency_key", unique = true)
    private String idempotencyKey;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LedgerEntry> entries = new ArrayList<>();

    public Transaction(String reference, TransactionType type, String description) {
        this.reference = reference;
        this.type = type;
        this.description = description;
    }

    public void addEntry(LedgerEntry entry) {
        entry.setTransaction(this);
        this.entries.add(entry);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.CascadeType;</code> - Imports `jakarta.persistence.CascadeType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.EnumType;</code> - Imports `jakarta.persistence.EnumType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.Enumerated;</code> - Imports `jakarta.persistence.Enumerated` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import jakarta.persistence.OneToMany;</code> - Imports `jakarta.persistence.OneToMany` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.ArrayList;</code> - Imports `java.util.ArrayList` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code> * A journal entry: a single business event made up of two or more balanced</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> * {@link LedgerEntry} rows.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
28. <code>@Table(name = &quot;transactions&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
29. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
32. <code>public class Transaction {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
35. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
36. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Column(nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
39. <code>    private String reference;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
42. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
43. <code>    private TransactionType type;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>    private String description;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @Column(name = &quot;idempotency_key&quot;, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private String idempotencyKey;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
51. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
52. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @OneToMany(mappedBy = &quot;transaction&quot;, cascade = CascadeType.ALL, orphanRemoval = true)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>    private List&lt;LedgerEntry&gt; entries = new ArrayList&lt;&gt;();</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
56. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
57. <code>    public Transaction(String reference, TransactionType type, String description) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        this.reference = reference;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
59. <code>        this.type = type;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>        this.description = description;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
61. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
63. <code>    public void addEntry(LedgerEntry entry) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <code>        entry.setTransaction(this);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
65. <code>        this.entries.add(entry);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
66. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 57 | `public Transaction(String reference, TransactionType type, String description)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `Transaction`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 63 | `public void addEntry(LedgerEntry entry)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `addEntry`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/ledger/domain/TransactionType.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.ledger.domain;

public enum TransactionType {
    DEPOSIT,
    WITHDRAWAL,
    TRANSFER,
    CARD_PAYMENT,
    TOP_UP,
    LOAN_DISBURSEMENT,
    LOAN_REPAYMENT
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum TransactionType {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    DEPOSIT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    WITHDRAWAL,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    TRANSFER,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
7. <code>    CARD_PAYMENT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
8. <code>    TOP_UP,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>    LOAN_DISBURSEMENT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>    LOAN_REPAYMENT</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/ledger/package-info.java`

### File Purpose
A package-level documentation file: it explains the module boundary for Java readers and generated docs.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
/**
 * ledger module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.ledger;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * ledger module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.ledger;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/ledger/repo/LedgerEntryRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.ledger.domain.LedgerEntry` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.jpa.repository.Query` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.repository.query.Param` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.repo;

import com.bank.ledger.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {

    /** Fetch-joins the parent transaction so entries can be mapped outside the session. */
    @Query("""
            select e from LedgerEntry e
            join fetch e.transaction
            where e.accountId = :accountId
            order by e.createdAt desc, e.id desc
            """)
    List<LedgerEntry> findByAccountIdWithTransaction(@Param("accountId") UUID accountId);
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.ledger.domain.LedgerEntry;</code> - Imports `com.bank.ledger.domain.LedgerEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.data.jpa.repository.Query;</code> - Imports `org.springframework.data.jpa.repository.Query` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.data.repository.query.Param;</code> - Imports `org.springframework.data.repository.query.Param` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>public interface LedgerEntryRepository extends JpaRepository&lt;LedgerEntry, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>    /** Fetch-joins the parent transaction so entries can be mapped outside the session. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code>    @Query(&quot;&quot;&quot;</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
15. <code>            select e from LedgerEntry e</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>            join fetch e.transaction</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>            where e.accountId = :accountId</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>            order by e.createdAt desc, e.id desc</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>            &quot;&quot;&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>    List&lt;LedgerEntry&gt; findByAccountIdWithTransaction(@Param(&quot;accountId&quot;) UUID accountId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
21. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/ledger/repo/TransactionRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.ledger.domain.Transaction` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.repo;

import com.bank.ledger.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.ledger.domain.Transaction;</code> - Imports `com.bank.ledger.domain.Transaction` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public interface TransactionRepository extends JpaRepository&lt;Transaction, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    Optional&lt;Transaction&gt; findByIdempotencyKey(String idempotencyKey);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
12. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/ledger/service/LedgerService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.Account` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.repo.AccountRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.InsufficientFundsException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.LedgerEntry` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.Transaction` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.repo.TransactionRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Comparator` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.LinkedHashMap` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.concurrent.ThreadLocalRandom` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.InsufficientFundsException;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.LedgerEntry;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.repo.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * The single entry point for moving money. Enforces the double-entry invariant
 * (signed amounts sum to zero), locks affected accounts in a deterministic order
 * to stay deadlock-free, updates materialized balances, and records immutable
 * ledger entries with a running {@code balanceAfter}.
 */
@Service
public class LedgerService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public LedgerService(AccountRepository accountRepository,
                         TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction post(TransactionType type, String description,
                            String idempotencyKey, List<PostingLine> lines) {
        if (idempotencyKey != null) {
            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                return existing.get();
            }
        }
        validateBalanced(lines);

        // Lock every affected account, in UUID order, before mutating any balance.
        Map<UUID, Account> locked = lockAccounts(lines);

        Transaction txn = new Transaction(generateReference(), type, description);
        txn.setIdempotencyKey(idempotencyKey);

        for (PostingLine line : lines) {
            Account account = locked.get(line.accountId());
            BigDecimal newBalance = account.getBalance().add(line.signedAmount());
            if (account.getType() != AccountType.SYSTEM && newBalance.signum() < 0) {
                throw new InsufficientFundsException(
                        "Insufficient funds in account " + account.getAccountNumber());
            }
            account.setBalance(newBalance);

            LedgerEntry entry = new LedgerEntry(line.accountId(), line.direction(), line.amount());
            entry.setBalanceAfter(newBalance);
            txn.addEntry(entry);
        }
        return transactionRepository.save(txn);
    }

    private Map<UUID, Account> lockAccounts(List<PostingLine> lines) {
        List<UUID> ids = lines.stream()
                .map(PostingLine::accountId)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
        Map<UUID, Account> locked = new LinkedHashMap<>();
        for (UUID id : ids) {
            Account account = accountRepository.findForUpdate(id)
                    .orElseThrow(() -> new NotFoundException("Account not found: " + id));
            locked.put(id, account);
        }
        return locked;
    }

    private void validateBalanced(List<PostingLine> lines) {
        if (lines.size() < 2) {
            throw new IllegalArgumentException("A transaction needs at least two entries");
        }
        BigDecimal sum = lines.stream()
                .map(PostingLine::signedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.signum() != 0) {
            throw new IllegalArgumentException("Ledger entries do not balance to zero");
        }
    }

    private String generateReference() {
        return "TXN-" + Long.toHexString(ThreadLocalRandom.current().nextLong() & Long.MAX_VALUE)
                .toUpperCase();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.common.exception.InsufficientFundsException;</code> - Imports `com.bank.common.exception.InsufficientFundsException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.ledger.domain.LedgerEntry;</code> - Imports `com.bank.ledger.domain.LedgerEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.ledger.domain.Transaction;</code> - Imports `com.bank.ledger.domain.Transaction` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.ledger.repo.TransactionRepository;</code> - Imports `com.bank.ledger.repo.TransactionRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import java.util.Comparator;</code> - Imports `java.util.Comparator` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.util.LinkedHashMap;</code> - Imports `java.util.LinkedHashMap` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import java.util.concurrent.ThreadLocalRandom;</code> - Imports `java.util.concurrent.ThreadLocalRandom` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code> * The single entry point for moving money. Enforces the double-entry invariant</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> * (signed amounts sum to zero), locks affected accounts in a deterministic order</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code> * to stay deadlock-free, updates materialized balances, and records immutable</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code> * ledger entries with a running {@code balanceAfter}.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
29. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
30. <code>public class LedgerService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
33. <code>    private final TransactionRepository transactionRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    public LedgerService(AccountRepository accountRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
36. <code>                         TransactionRepository transactionRepository) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
38. <code>        this.transactionRepository = transactionRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
42. <code>    public Transaction post(TransactionType type, String description,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
43. <code>                            String idempotencyKey, List&lt;PostingLine&gt; lines) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <code>        if (idempotencyKey != null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
46. <code>            if (existing.isPresent()) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>                return existing.get();</code> - Returns a value/reference to the caller and ends this execution path.
48. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <code>        validateBalanced(lines);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>        // Lock every affected account, in UUID order, before mutating any balance.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
53. <code>        Map&lt;UUID, Account&gt; locked = lockAccounts(lines);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>        Transaction txn = new Transaction(generateReference(), type, description);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
56. <code>        txn.setIdempotencyKey(idempotencyKey);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
57. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
58. <code>        for (PostingLine line : lines) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>            Account account = locked.get(line.accountId());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>            BigDecimal newBalance = account.getBalance().add(line.signedAmount());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
61. <code>            if (account.getType() != AccountType.SYSTEM &amp;&amp; newBalance.signum() &lt; 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <code>                throw new InsufficientFundsException(</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
63. <code>                        &quot;Insufficient funds in account &quot; + account.getAccountNumber());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>            account.setBalance(newBalance);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
66. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
67. <code>            LedgerEntry entry = new LedgerEntry(line.accountId(), line.direction(), line.amount());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
68. <code>            entry.setBalanceAfter(newBalance);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
69. <code>            txn.addEntry(entry);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
70. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>        return transactionRepository.save(txn);</code> - Returns a value/reference to the caller and ends this execution path.
72. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
73. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
74. <code>    private Map&lt;UUID, Account&gt; lockAccounts(List&lt;PostingLine&gt; lines) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>        List&lt;UUID&gt; ids = lines.stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                .map(PostingLine::accountId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                .distinct()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
78. <code>                .sorted(Comparator.naturalOrder())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
79. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
80. <code>        Map&lt;UUID, Account&gt; locked = new LinkedHashMap&lt;&gt;();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
81. <code>        for (UUID id : ids) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
82. <code>            Account account = accountRepository.findForUpdate(id)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
83. <code>                    .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found: &quot; + id));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
84. <code>            locked.put(id, account);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
85. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <code>        return locked;</code> - Returns a value/reference to the caller and ends this execution path.
87. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
88. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
89. <code>    private void validateBalanced(List&lt;PostingLine&gt; lines) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <code>        if (lines.size() &lt; 2) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
91. <code>            throw new IllegalArgumentException(&quot;A transaction needs at least two entries&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
92. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
93. <code>        BigDecimal sum = lines.stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
94. <code>                .map(PostingLine::signedAmount)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
95. <code>                .reduce(BigDecimal.ZERO, BigDecimal::add);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
96. <code>        if (sum.signum() != 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
97. <code>            throw new IllegalArgumentException(&quot;Ledger entries do not balance to zero&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
98. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
99. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
100. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
101. <code>    private String generateReference() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
102. <code>        return &quot;TXN-&quot; + Long.toHexString(ThreadLocalRandom.current().nextLong() &amp; Long.MAX_VALUE)</code> - Returns a value/reference to the caller and ends this execution path.
103. <code>                .toUpperCase();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
104. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
105. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 74 | `private Map&lt;UUID, Account&gt; lockAccounts(List&lt;PostingLine&gt; lines)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `lockAccounts`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 89 | `private void validateBalanced(List&lt;PostingLine&gt; lines)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `validateBalanced`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 101 | `private String generateReference()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `generateReference`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(k) for a fixed-size identifier/card number, so effectively O(1) in this project. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/ledger/service/PostingLine.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.ledger.domain.EntryDirection` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.ledger.service;

import com.bank.ledger.domain.EntryDirection;

import java.math.BigDecimal;
import java.util.UUID;

/** One requested leg of a transaction to be posted by {@link LedgerService}. */
public record PostingLine(UUID accountId, EntryDirection direction, BigDecimal amount) {

    public static PostingLine debit(UUID accountId, BigDecimal amount) {
        return new PostingLine(accountId, EntryDirection.DEBIT, amount);
    }

    public static PostingLine credit(UUID accountId, BigDecimal amount) {
        return new PostingLine(accountId, EntryDirection.CREDIT, amount);
    }

    public BigDecimal signedAmount() {
        return direction.apply(amount);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.ledger.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.ledger.domain.EntryDirection;</code> - Imports `com.bank.ledger.domain.EntryDirection` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/** One requested leg of a transaction to be posted by {@link LedgerService}. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code>public record PostingLine(UUID accountId, EntryDirection direction, BigDecimal amount) {</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    public static PostingLine debit(UUID accountId, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
12. <code>        return new PostingLine(accountId, EntryDirection.DEBIT, amount);</code> - Returns a value/reference to the caller and ends this execution path.
13. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>    public static PostingLine credit(UUID accountId, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
16. <code>        return new PostingLine(accountId, EntryDirection.CREDIT, amount);</code> - Returns a value/reference to the caller and ends this execution path.
17. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    public BigDecimal signedAmount() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <code>        return direction.apply(amount);</code> - Returns a value/reference to the caller and ends this execution path.
21. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
22. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 9 | `public record PostingLine(UUID accountId, EntryDirection direction, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `PostingLine`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 11 | `public static PostingLine debit(UUID accountId, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `debit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 15 | `public static PostingLine credit(UUID accountId, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `credit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 19 | `public BigDecimal signedAmount()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `signedAmount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/domain/Beneficiary.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.persistence.Column` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Entity` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GeneratedValue` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.GenerationType` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Id` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Table` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.persistence.Version` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/** A saved payee owned by a user, identified by the target account number. */
@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Version
    private long version;

    public Beneficiary(UUID ownerUserId, String nickname, String accountNumber) {
        this.ownerUserId = ownerUserId;
        this.nickname = nickname;
        this.accountNumber = accountNumber;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.persistence.Version;</code> - Imports `jakarta.persistence.Version` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>/** A saved payee owned by a user, identified by the target account number. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
20. <code>@Table(name = &quot;beneficiaries&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
21. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>public class Beneficiary {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
27. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
28. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Column(name = &quot;owner_user_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
31. <code>    private UUID ownerUserId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
34. <code>    private String nickname;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @Column(name = &quot;account_number&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
37. <code>    private String accountNumber;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
40. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
41. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
44. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    public Beneficiary(UUID ownerUserId, String nickname, String accountNumber) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        this.ownerUserId = ownerUserId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>        this.nickname = nickname;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>        this.accountNumber = accountNumber;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
50. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 46 | `public Beneficiary(UUID ownerUserId, String nickname, String accountNumber)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `Beneficiary`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/dto/BeneficiaryRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.NotBlank` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Size` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.transfer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BeneficiaryRequest(
        @NotBlank @Size(max = 100) String nickname,
        @NotBlank String accountNumber
) {
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.Size;</code> - Imports `jakarta.validation.constraints.Size` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>public record BeneficiaryRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
7. <code>        @NotBlank @Size(max = 100) String nickname,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
8. <code>        @NotBlank String accountNumber</code> - Bean Validation annotation. Spring validates request data before business logic runs.
9. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
10. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/transfer/dto/BeneficiaryResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.transfer.domain.Beneficiary` | Project-local dependency connecting this file to another banking module. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.dto;

import com.bank.transfer.domain.Beneficiary;

import java.time.Instant;
import java.util.UUID;

public record BeneficiaryResponse(
        UUID id,
        String nickname,
        String accountNumber,
        Instant createdAt
) {
    public static BeneficiaryResponse from(Beneficiary b) {
        return new BeneficiaryResponse(b.getId(), b.getNickname(), b.getAccountNumber(), b.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.transfer.domain.Beneficiary;</code> - Imports `com.bank.transfer.domain.Beneficiary` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>public record BeneficiaryResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
9. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>        String nickname,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        String accountNumber,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <code>    public static BeneficiaryResponse from(Beneficiary b) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>        return new BeneficiaryResponse(b.getId(), b.getNickname(), b.getAccountNumber(), b.getCreatedAt());</code> - Returns a value/reference to the caller and ends this execution path.
16. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 14 | `public static BeneficiaryResponse from(Beneficiary b)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/dto/TransferRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Digits` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotBlank` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotNull` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Positive` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Size` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record TransferRequest(
        @NotNull UUID sourceAccountId,
        @NotBlank String destinationAccountNumber,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount,
        @Size(max = 140) String note
) {
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.validation.constraints.Positive;</code> - Imports `jakarta.validation.constraints.Positive` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.validation.constraints.Size;</code> - Imports `jakarta.validation.constraints.Size` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>public record TransferRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
13. <code>        @NotNull UUID sourceAccountId,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
14. <code>        @NotBlank String destinationAccountNumber,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
15. <code>        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
16. <code>        @Size(max = 140) String note</code> - Bean Validation annotation. Spring validates request data before business logic runs.
17. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/transfer/dto/TransferResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransferResponse(
        String reference,
        UUID sourceAccountId,
        String destinationAccountNumber,
        BigDecimal amount,
        BigDecimal sourceBalanceAfter,
        String status,
        Instant createdAt
) {
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>public record TransferResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
8. <code>        String reference,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>        UUID sourceAccountId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>        String destinationAccountNumber,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        BigDecimal amount,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        BigDecimal sourceBalanceAfter,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/transfer/package-info.java`

### File Purpose
A package-level documentation file: it explains the module boundary for Java readers and generated docs.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
/**
 * transfer module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.transfer;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * transfer module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.transfer;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/transfer/repo/BeneficiaryRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.transfer.domain.Beneficiary` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.repo;

import com.bank.transfer.domain.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, UUID> {

    List<Beneficiary> findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);

    Optional<Beneficiary> findByIdAndOwnerUserId(UUID id, UUID ownerUserId);

    boolean existsByOwnerUserIdAndAccountNumber(UUID ownerUserId, String accountNumber);
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.transfer.domain.Beneficiary;</code> - Imports `com.bank.transfer.domain.Beneficiary` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public interface BeneficiaryRepository extends JpaRepository&lt;Beneficiary, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    List&lt;Beneficiary&gt; findByOwnerUserIdOrderByCreatedAtAsc(UUID ownerUserId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    Optional&lt;Beneficiary&gt; findByIdAndOwnerUserId(UUID id, UUID ownerUserId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    boolean existsByOwnerUserIdAndAccountNumber(UUID ownerUserId, String accountNumber);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
17. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/transfer/service/BeneficiaryService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.repo.AccountRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.ConflictException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.domain.Beneficiary` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.repo.BeneficiaryRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.service;

import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.ConflictException;
import com.bank.common.exception.NotFoundException;
import com.bank.transfer.domain.Beneficiary;
import com.bank.transfer.repo.BeneficiaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository,
                              AccountRepository accountRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<Beneficiary> list(UUID userId) {
        return beneficiaryRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public Beneficiary add(UUID userId, String nickname, String accountNumber) {
        accountRepository.findByAccountNumber(accountNumber)
                .filter(a -> a.getType() != AccountType.SYSTEM)
                .orElseThrow(() -> new NotFoundException("No account with number " + accountNumber));
        if (beneficiaryRepository.existsByOwnerUserIdAndAccountNumber(userId, accountNumber)) {
            throw new ConflictException("Beneficiary already saved");
        }
        return beneficiaryRepository.save(new Beneficiary(userId, nickname, accountNumber));
    }

    @Transactional
    public void delete(UUID userId, UUID beneficiaryId) {
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndOwnerUserId(beneficiaryId, userId)
                .orElseThrow(() -> new NotFoundException("Beneficiary not found"));
        beneficiaryRepository.delete(beneficiary);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.common.exception.ConflictException;</code> - Imports `com.bank.common.exception.ConflictException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.transfer.domain.Beneficiary;</code> - Imports `com.bank.transfer.domain.Beneficiary` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.transfer.repo.BeneficiaryRepository;</code> - Imports `com.bank.transfer.repo.BeneficiaryRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
16. <code>public class BeneficiaryService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    private final BeneficiaryRepository beneficiaryRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
19. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
22. <code>                              AccountRepository accountRepository) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        this.beneficiaryRepository = beneficiaryRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
24. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
25. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
28. <code>    public List&lt;Beneficiary&gt; list(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>        return beneficiaryRepository.findByOwnerUserIdOrderByCreatedAtAsc(userId);</code> - Returns a value/reference to the caller and ends this execution path.
30. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
33. <code>    public Beneficiary add(UUID userId, String nickname, String accountNumber) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        accountRepository.findByAccountNumber(accountNumber)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                .filter(a -&gt; a.getType() != AccountType.SYSTEM)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;No account with number &quot; + accountNumber));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
37. <code>        if (beneficiaryRepository.existsByOwnerUserIdAndAccountNumber(userId, accountNumber)) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>            throw new ConflictException(&quot;Beneficiary already saved&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
39. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        return beneficiaryRepository.save(new Beneficiary(userId, nickname, accountNumber));</code> - Returns a value/reference to the caller and ends this execution path.
41. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
44. <code>    public void delete(UUID userId, UUID beneficiaryId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>        Beneficiary beneficiary = beneficiaryRepository.findByIdAndOwnerUserId(beneficiaryId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Beneficiary not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
47. <code>        beneficiaryRepository.delete(beneficiary);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
48. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 28 | `public List&lt;Beneficiary&gt; list(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 33 | `public Beneficiary add(UUID userId, String nickname, String accountNumber)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `add`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 44 | `public void delete(UUID userId, UUID beneficiaryId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `delete`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/service/TransferService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.account.domain.Account` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.domain.AccountType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.account.repo.AccountRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.Transaction` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.LedgerService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.PostingLine` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.dto.TransferResponse` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.transfer.dto.TransferResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;

    public TransferService(AccountRepository accountRepository, LedgerService ledgerService) {
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public TransferResponse transfer(UUID userId, UUID sourceAccountId, String destinationAccountNumber,
                                     BigDecimal amount, String note, String idempotencyKey) {
        Account source = accountRepository.findByIdAndOwnerUserId(sourceAccountId, userId)
                .orElseThrow(() -> new NotFoundException("Source account not found"));
        requireActive(source, "Source");

        Account destination = accountRepository.findByAccountNumber(destinationAccountNumber)
                .filter(a -> a.getType() != AccountType.SYSTEM)
                .orElseThrow(() -> new NotFoundException("Destination account not found"));
        if (destination.getId().equals(source.getId())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        requireActive(destination, "Destination");
        if (!source.getCurrency().equals(destination.getCurrency())) {
            throw new IllegalArgumentException("Source and destination currencies differ");
        }

        String description = "Transfer " + source.getAccountNumber() + " → "
                + destination.getAccountNumber()
                + (note != null && !note.isBlank() ? " (" + note + ")" : "");

        // LedgerService enforces the zero-sum invariant, locks both accounts in a
        // deterministic order, and is idempotent on idempotencyKey (a replayed key
        // returns the original transaction without posting again).
        Transaction txn = ledgerService.post(TransactionType.TRANSFER, description, idempotencyKey, List.of(
                PostingLine.debit(source.getId(), amount),
                PostingLine.credit(destination.getId(), amount)));

        return new TransferResponse(
                txn.getReference(),
                source.getId(),
                destination.getAccountNumber(),
                amount,
                source.getBalance(),
                "COMPLETED",
                txn.getCreatedAt());
    }

    private void requireActive(Account account, String role) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException(role + " account is not active");
        }
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountStatus;</code> - Imports `com.bank.account.domain.AccountStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.ledger.domain.Transaction;</code> - Imports `com.bank.ledger.domain.Transaction` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.ledger.service.LedgerService;</code> - Imports `com.bank.ledger.service.LedgerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.ledger.service.PostingLine;</code> - Imports `com.bank.ledger.service.PostingLine` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.transfer.dto.TransferResponse;</code> - Imports `com.bank.transfer.dto.TransferResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
21. <code>public class TransferService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <code>    private final LedgerService ledgerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    public TransferService(AccountRepository accountRepository, LedgerService ledgerService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
27. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
28. <code>        this.ledgerService = ledgerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
29. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
32. <code>    public TransferResponse transfer(UUID userId, UUID sourceAccountId, String destinationAccountNumber,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
33. <code>                                     BigDecimal amount, String note, String idempotencyKey) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        Account source = accountRepository.findByIdAndOwnerUserId(sourceAccountId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Source account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
36. <code>        requireActive(source, &quot;Source&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>        Account destination = accountRepository.findByAccountNumber(destinationAccountNumber)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                .filter(a -&gt; a.getType() != AccountType.SYSTEM)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Destination account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>        if (destination.getId().equals(source.getId())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <code>            throw new IllegalArgumentException(&quot;Cannot transfer to the same account&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
43. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <code>        requireActive(destination, &quot;Destination&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
45. <code>        if (!source.getCurrency().equals(destination.getCurrency())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <code>            throw new IllegalArgumentException(&quot;Source and destination currencies differ&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
47. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>        String description = &quot;Transfer &quot; + source.getAccountNumber() + &quot; → &quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                + destination.getAccountNumber()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                + (note != null &amp;&amp; !note.isBlank() ? &quot; (&quot; + note + &quot;)&quot; : &quot;&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>        // LedgerService enforces the zero-sum invariant, locks both accounts in a</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
54. <code>        // deterministic order, and is idempotent on idempotencyKey (a replayed key</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
55. <code>        // returns the original transaction without posting again).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
56. <code>        Transaction txn = ledgerService.post(TransactionType.TRANSFER, description, idempotencyKey, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                PostingLine.debit(source.getId(), amount),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
58. <code>                PostingLine.credit(destination.getId(), amount)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
59. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
60. <code>        return new TransferResponse(</code> - Returns a value/reference to the caller and ends this execution path.
61. <code>                txn.getReference(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
62. <code>                source.getId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>                destination.getAccountNumber(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
64. <code>                amount,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
65. <code>                source.getBalance(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
66. <code>                &quot;COMPLETED&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
67. <code>                txn.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
68. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
70. <code>    private void requireActive(Account account, String role) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>        if (account.getStatus() != AccountStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
72. <code>            throw new IllegalArgumentException(role + &quot; account is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
73. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 26 | `public TransferService(AccountRepository accountRepository, LedgerService ledgerService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `TransferService`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 70 | `private void requireActive(Account account, String role)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireActive`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/web/BeneficiaryController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.dto.BeneficiaryRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.dto.BeneficiaryResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.service.BeneficiaryService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.http.HttpStatus` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.DeleteMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PathVariable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.transfer.web;

import com.bank.common.SecurityUtils;
import com.bank.transfer.dto.BeneficiaryRequest;
import com.bank.transfer.dto.BeneficiaryResponse;
import com.bank.transfer.service.BeneficiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beneficiaries")
@Tag(name = "Beneficiaries", description = "Saved payees for transfers")
@SecurityRequirement(name = "bearerAuth")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @GetMapping
    @Operation(summary = "List my saved beneficiaries")
    public List<BeneficiaryResponse> list() {
        return beneficiaryService.list(SecurityUtils.currentUserId()).stream()
                .map(BeneficiaryResponse::from)
                .toList();
    }

    @PostMapping
    @Operation(summary = "Save a new beneficiary")
    public ResponseEntity<BeneficiaryResponse> add(@Valid @RequestBody BeneficiaryRequest request) {
        BeneficiaryResponse body = BeneficiaryResponse.from(
                beneficiaryService.add(SecurityUtils.currentUserId(), request.nickname(), request.accountNumber()));
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @DeleteMapping("/{beneficiaryId}")
    @Operation(summary = "Delete a beneficiary")
    public ResponseEntity<Void> delete(@PathVariable UUID beneficiaryId) {
        beneficiaryService.delete(SecurityUtils.currentUserId(), beneficiaryId);
        return ResponseEntity.noContent().build();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.transfer.dto.BeneficiaryRequest;</code> - Imports `com.bank.transfer.dto.BeneficiaryRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.transfer.dto.BeneficiaryResponse;</code> - Imports `com.bank.transfer.dto.BeneficiaryResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.transfer.service.BeneficiaryService;</code> - Imports `com.bank.transfer.service.BeneficiaryService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.DeleteMapping;</code> - Imports `org.springframework.web.bind.annotation.DeleteMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
25. <code>@RequestMapping(&quot;/api/v1/beneficiaries&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
26. <code>@Tag(name = &quot;Beneficiaries&quot;, description = &quot;Saved payees for transfers&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>public class BeneficiaryController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    private final BeneficiaryService beneficiaryService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    public BeneficiaryController(BeneficiaryService beneficiaryService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <code>        this.beneficiaryService = beneficiaryService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
37. <code>    @Operation(summary = &quot;List my saved beneficiaries&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    public List&lt;BeneficiaryResponse&gt; list() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        return beneficiaryService.list(SecurityUtils.currentUserId()).stream()</code> - Returns a value/reference to the caller and ends this execution path.
40. <code>                .map(BeneficiaryResponse::from)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @PostMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
45. <code>    @Operation(summary = &quot;Save a new beneficiary&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
46. <code>    public ResponseEntity&lt;BeneficiaryResponse&gt; add(@Valid @RequestBody BeneficiaryRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        BeneficiaryResponse body = BeneficiaryResponse.from(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                beneficiaryService.add(SecurityUtils.currentUserId(), request.nickname(), request.accountNumber()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
49. <code>        return ResponseEntity.status(HttpStatus.CREATED).body(body);</code> - Returns a value/reference to the caller and ends this execution path.
50. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>    @DeleteMapping(&quot;/{beneficiaryId}&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
53. <code>    @Operation(summary = &quot;Delete a beneficiary&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
54. <code>    public ResponseEntity&lt;Void&gt; delete(@PathVariable UUID beneficiaryId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        beneficiaryService.delete(SecurityUtils.currentUserId(), beneficiaryId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
56. <code>        return ResponseEntity.noContent().build();</code> - Returns a value/reference to the caller and ends this execution path.
57. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 32 | `public BeneficiaryController(BeneficiaryService beneficiaryService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `BeneficiaryController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `public List&lt;BeneficiaryResponse&gt; list()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 46 | `public ResponseEntity&lt;BeneficiaryResponse&gt; add(@Valid @RequestBody BeneficiaryRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `add`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 54 | `public ResponseEntity&lt;Void&gt; delete(@PathVariable UUID beneficiaryId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `delete`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/transfer/web/TransferController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.dto.TransferRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.dto.TransferResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.transfer.service.TransferService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestHeader` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.transfer.web;

import com.bank.common.SecurityUtils;
import com.bank.transfer.dto.TransferRequest;
import com.bank.transfer.dto.TransferResponse;
import com.bank.transfer.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transfers")
@Tag(name = "Transfers", description = "Account-to-account money transfers")
@SecurityRequirement(name = "bearerAuth")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    @Operation(summary = "Transfer money to another account",
            description = "Supply an Idempotency-Key header to make retries safe (no double-spend).")
    public TransferResponse transfer(@Valid @RequestBody TransferRequest request,
                                     @RequestHeader(value = "Idempotency-Key", required = false)
                                     String idempotencyKey) {
        return transferService.transfer(
                SecurityUtils.currentUserId(),
                request.sourceAccountId(),
                request.destinationAccountNumber(),
                request.amount(),
                request.note(),
                idempotencyKey);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.transfer.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.transfer.dto.TransferRequest;</code> - Imports `com.bank.transfer.dto.TransferRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.transfer.dto.TransferResponse;</code> - Imports `com.bank.transfer.dto.TransferResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.transfer.service.TransferService;</code> - Imports `com.bank.transfer.service.TransferService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.RequestHeader;</code> - Imports `org.springframework.web.bind.annotation.RequestHeader` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
18. <code>@RequestMapping(&quot;/api/v1/transfers&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
19. <code>@Tag(name = &quot;Transfers&quot;, description = &quot;Account-to-account money transfers&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>public class TransferController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final TransferService transferService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public TransferController(TransferService transferService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.transferService = transferService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @PostMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
30. <code>    @Operation(summary = &quot;Transfer money to another account&quot;,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>            description = &quot;Supply an Idempotency-Key header to make retries safe (no double-spend).&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>    public TransferResponse transfer(@Valid @RequestBody TransferRequest request,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
33. <code>                                     @RequestHeader(value = &quot;Idempotency-Key&quot;, required = false)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
34. <code>                                     String idempotencyKey) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        return transferService.transfer(</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>                SecurityUtils.currentUserId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                request.sourceAccountId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>                request.destinationAccountNumber(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                request.amount(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                request.note(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                idempotencyKey);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public TransferController(TransferService transferService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `TransferController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

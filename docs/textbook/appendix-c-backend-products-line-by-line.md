# Appendix C: Backend Cards, Payments, and Loans

This appendix covers banking product modules built on top of accounts and ledger: cards, payment top-ups, gateway integration, loans, amortization, and repayment.

> Reading note: each section includes the file purpose, import/dependency role, complete source listing where the file is textual, and a line-by-line walkthrough. Generated dependency/build directories are excluded from this book.

## `backend/src/main/java/com/bank/card/domain/Card.java`

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
package com.bank.card.domain;

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

/**
 * A virtual card linked to an account. Only non-sensitive data is stored
 * (last4/brand/expiry) — the full PAN is shown once at issuance and never persisted.
 */
@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 4)
    private String last4;

    @Column(nullable = false)
    private String brand;

    @Column(name = "exp_month", nullable = false)
    private int expMonth;

    @Column(name = "exp_year", nullable = false)
    private int expYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status = CardStatus.ACTIVE;

    @Column(name = "monthly_limit", nullable = false, precision = 19, scale = 4)
    private BigDecimal monthlyLimit = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public Card(UUID accountId, UUID userId, String last4, String brand,
                int expMonth, int expYear, BigDecimal monthlyLimit) {
        this.accountId = accountId;
        this.userId = userId;
        this.last4 = last4;
        this.brand = brand;
        this.expMonth = expMonth;
        this.expYear = expYear;
        this.monthlyLimit = monthlyLimit;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
22. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code> * A virtual card linked to an account. Only non-sensitive data is stored</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code> * (last4/brand/expiry) — the full PAN is shown once at issuance and never persisted.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
27. <code>@Table(name = &quot;cards&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
28. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
29. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>public class Card {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
34. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
35. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @Column(name = &quot;account_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
38. <code>    private UUID accountId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @Column(name = &quot;user_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
41. <code>    private UUID userId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Column(nullable = false, length = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
44. <code>    private String last4;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
47. <code>    private String brand;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>    @Column(name = &quot;exp_month&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
50. <code>    private int expMonth;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>    @Column(name = &quot;exp_year&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
53. <code>    private int expYear;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
56. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
57. <code>    private CardStatus status = CardStatus.ACTIVE;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
58. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
59. <code>    @Column(name = &quot;monthly_limit&quot;, nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
60. <code>    private BigDecimal monthlyLimit = BigDecimal.ZERO;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
61. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
62. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
63. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
64. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
67. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
68. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
69. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
70. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
71. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
72. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
73. <code>    public Card(UUID accountId, UUID userId, String last4, String brand,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
74. <code>                int expMonth, int expYear, BigDecimal monthlyLimit) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>        this.accountId = accountId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
76. <code>        this.userId = userId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
77. <code>        this.last4 = last4;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
78. <code>        this.brand = brand;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
79. <code>        this.expMonth = expMonth;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
80. <code>        this.expYear = expYear;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
81. <code>        this.monthlyLimit = monthlyLimit;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
82. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/card/domain/CardPayment.java`

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
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** A purchase made with a card, linked to the ledger transaction it posted. */
@Entity
@Table(name = "card_payments")
@Getter
@Setter
@NoArgsConstructor
public class CardPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "card_id", nullable = false)
    private UUID cardId;

    @Column(name = "transaction_id", nullable = false)
    private UUID transactionId;

    @Column(nullable = false)
    private String merchant;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CardPayment(UUID cardId, UUID transactionId, String merchant, BigDecimal amount) {
        this.cardId = cardId;
        this.transactionId = transactionId;
        this.merchant = merchant;
        this.amount = amount;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>/** A purchase made with a card, linked to the ledger transaction it posted. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
20. <code>@Table(name = &quot;card_payments&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
21. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>public class CardPayment {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
27. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
28. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Column(name = &quot;card_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
31. <code>    private UUID cardId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Column(name = &quot;transaction_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
34. <code>    private UUID transactionId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
37. <code>    private String merchant;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    @Column(nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
40. <code>    private BigDecimal amount;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
41. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
42. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
43. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
44. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    public CardPayment(UUID cardId, UUID transactionId, String merchant, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        this.cardId = cardId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>        this.transactionId = transactionId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>        this.merchant = merchant;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
50. <code>        this.amount = amount;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 46 | `public CardPayment(UUID cardId, UUID transactionId, String merchant, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `CardPayment`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/card/domain/CardStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.card.domain;

public enum CardStatus {
    ACTIVE,
    FROZEN,
    CANCELLED
}
````

### Code Walkthrough
1. <code>package com.bank.card.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum CardStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    ACTIVE,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    FROZEN,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    CANCELLED</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/card/dto/CardPaymentRequest.java`

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

### Complete Source
````java
package com.bank.card.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CardPaymentRequest(
        @NotBlank @Size(max = 140) String merchant,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount
) {
}
````

### Code Walkthrough
1. <code>package com.bank.card.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.validation.constraints.Positive;</code> - Imports `jakarta.validation.constraints.Positive` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.validation.constraints.Size;</code> - Imports `jakarta.validation.constraints.Size` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>public record CardPaymentRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>        @NotBlank @Size(max = 140) String merchant,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
13. <code>        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount</code> - Bean Validation annotation. Spring validates request data before business logic runs.
14. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/card/dto/CardPaymentResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.dto;

import java.math.BigDecimal;

public record CardPaymentResponse(
        String reference,
        String merchant,
        BigDecimal amount,
        BigDecimal accountBalanceAfter
) {
}
````

### Code Walkthrough
1. <code>package com.bank.card.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>public record CardPaymentResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
6. <code>        String reference,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
7. <code>        String merchant,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
8. <code>        BigDecimal amount,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>        BigDecimal accountBalanceAfter</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/card/dto/CardResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.card.domain.Card` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.domain.CardStatus` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.dto;

import com.bank.card.domain.Card;
import com.bank.card.domain.CardStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CardResponse(
        UUID id,
        UUID accountId,
        String last4,
        String brand,
        int expMonth,
        int expYear,
        CardStatus status,
        BigDecimal monthlyLimit,
        Instant createdAt
) {
    public static CardResponse from(Card c) {
        return new CardResponse(c.getId(), c.getAccountId(), c.getLast4(), c.getBrand(),
                c.getExpMonth(), c.getExpYear(), c.getStatus(), c.getMonthlyLimit(), c.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.card.domain.Card;</code> - Imports `com.bank.card.domain.Card` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.card.domain.CardStatus;</code> - Imports `com.bank.card.domain.CardStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public record CardResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
11. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        UUID accountId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String last4,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String brand,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        int expMonth,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        int expYear,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        CardStatus status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        BigDecimal monthlyLimit,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>    public static CardResponse from(Card c) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
22. <code>        return new CardResponse(c.getId(), c.getAccountId(), c.getLast4(), c.getBrand(),</code> - Returns a value/reference to the caller and ends this execution path.
23. <code>                c.getExpMonth(), c.getExpYear(), c.getStatus(), c.getMonthlyLimit(), c.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
24. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 21 | `public static CardResponse from(Card c)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/card/dto/IssueCardRequest.java`

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
| `jakarta.validation.constraints.PositiveOrZero` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record IssueCardRequest(
        @NotNull UUID accountId,
        @PositiveOrZero @Digits(integer = 15, fraction = 2) BigDecimal monthlyLimit
) {
}
````

### Code Walkthrough
1. <code>package com.bank.card.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.PositiveOrZero;</code> - Imports `jakarta.validation.constraints.PositiveOrZero` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public record IssueCardRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
11. <code>        @NotNull UUID accountId,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
12. <code>        @PositiveOrZero @Digits(integer = 15, fraction = 2) BigDecimal monthlyLimit</code> - Bean Validation annotation. Spring validates request data before business logic runs.
13. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/card/dto/IssueCardResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.card.dto;

/**
 * Returned only at issuance. {@code cardNumber} (the full PAN) is shown ONCE and
 * never stored or returned again.
 */
public record IssueCardResponse(
        CardResponse card,
        String cardNumber
) {
}
````

### Code Walkthrough
1. <code>package com.bank.card.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code> * Returned only at issuance. {@code cardNumber} (the full PAN) is shown ONCE and</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code> * never stored or returned again.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>public record IssueCardResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
8. <code>        CardResponse card,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>        String cardNumber</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/card/package-info.java`

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
 * card module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.card;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * card module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.card;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/card/repo/CardPaymentRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.card.domain.CardPayment` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.jpa.repository.Query` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.repository.query.Param` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.repo;

import com.bank.card.domain.CardPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public interface CardPaymentRepository extends JpaRepository<CardPayment, UUID> {

    /** Total spent on a card since the given instant (used for monthly-limit checks). */
    @Query("""
            select coalesce(sum(cp.amount), 0) from CardPayment cp
            where cp.cardId = :cardId and cp.createdAt >= :since
            """)
    BigDecimal sumSince(@Param("cardId") UUID cardId, @Param("since") Instant since);
}
````

### Code Walkthrough
1. <code>package com.bank.card.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.card.domain.CardPayment;</code> - Imports `com.bank.card.domain.CardPayment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.data.jpa.repository.Query;</code> - Imports `org.springframework.data.jpa.repository.Query` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.data.repository.query.Param;</code> - Imports `org.springframework.data.repository.query.Param` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>public interface CardPaymentRepository extends JpaRepository&lt;CardPayment, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    /** Total spent on a card since the given instant (used for monthly-limit checks). */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>    @Query(&quot;&quot;&quot;</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
16. <code>            select coalesce(sum(cp.amount), 0) from CardPayment cp</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>            where cp.cardId = :cardId and cp.createdAt &gt;= :since</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>            &quot;&quot;&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>    BigDecimal sumSince(@Param(&quot;cardId&quot;) UUID cardId, @Param(&quot;since&quot;) Instant since);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
20. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/card/repo/CardRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.card.domain.Card` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.repo;

import com.bank.card.domain.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {

    List<Card> findByUserIdOrderByCreatedAtAsc(UUID userId);

    Optional<Card> findByIdAndUserId(UUID id, UUID userId);
}
````

### Code Walkthrough
1. <code>package com.bank.card.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.card.domain.Card;</code> - Imports `com.bank.card.domain.Card` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public interface CardRepository extends JpaRepository&lt;Card, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    List&lt;Card&gt; findByUserIdOrderByCreatedAtAsc(UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    Optional&lt;Card&gt; findByIdAndUserId(UUID id, UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/card/service/CardService.java`

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
| `com.bank.card.domain.Card` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.domain.CardPayment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.domain.CardStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.CardPaymentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.IssueCardResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.CardResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.repo.CardPaymentRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.repo.CardRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.PaymentDeclinedException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.Transaction` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.LedgerService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.PostingLine` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.YearMonth` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.ZoneOffset` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.concurrent.ThreadLocalRandom` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.card.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.card.domain.Card;
import com.bank.card.domain.CardPayment;
import com.bank.card.domain.CardStatus;
import com.bank.card.dto.CardPaymentResponse;
import com.bank.card.dto.IssueCardResponse;
import com.bank.card.dto.CardResponse;
import com.bank.card.repo.CardPaymentRepository;
import com.bank.card.repo.CardRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.common.exception.PaymentDeclinedException;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CardService {

    private static final String TEST_BIN = "4242"; // VISA test BIN
    private static final String BRAND = "VISA";

    private final CardRepository cardRepository;
    private final CardPaymentRepository cardPaymentRepository;
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;

    public CardService(CardRepository cardRepository,
                       CardPaymentRepository cardPaymentRepository,
                       AccountRepository accountRepository,
                       LedgerService ledgerService) {
        this.cardRepository = cardRepository;
        this.cardPaymentRepository = cardPaymentRepository;
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public IssueCardResponse issue(UUID userId, UUID accountId, BigDecimal monthlyLimit) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        String pan = generatePan();
        YearMonth expiry = YearMonth.now(ZoneOffset.UTC).plusYears(3);
        Card card = new Card(accountId, userId, pan.substring(pan.length() - 4), BRAND,
                expiry.getMonthValue(), expiry.getYear(),
                monthlyLimit == null ? BigDecimal.ZERO : monthlyLimit);
        cardRepository.save(card);
        return new IssueCardResponse(CardResponse.from(card), pan);
    }

    @Transactional(readOnly = true)
    public List<Card> list(UUID userId) {
        return cardRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @Transactional
    public Card setStatus(UUID userId, UUID cardId, CardStatus target) {
        Card card = requireCard(userId, cardId);
        if (card.getStatus() == CardStatus.CANCELLED) {
            throw new IllegalArgumentException("Card is cancelled");
        }
        card.setStatus(target);
        return card;
    }

    @Transactional
    public CardPaymentResponse pay(UUID userId, UUID cardId, String merchant, BigDecimal amount) {
        Card card = requireCard(userId, cardId);
        if (card.getStatus() != CardStatus.ACTIVE) {
            throw new PaymentDeclinedException("Card is not active");
        }
        Account account = accountRepository.findByIdAndOwnerUserId(card.getAccountId(), userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new PaymentDeclinedException("Account is not active");
        }
        enforceMonthlyLimit(card, amount);

        Account system = accountRepository
                .findFirstByTypeAndCurrency(AccountType.SYSTEM, account.getCurrency())
                .orElseThrow(() -> new NotFoundException("System account not configured"));

        // Insufficient funds surfaces as a 422 from the ledger.
        Transaction txn = ledgerService.post(TransactionType.CARD_PAYMENT,
                "Card payment to " + merchant, null, List.of(
                        PostingLine.debit(account.getId(), amount),
                        PostingLine.credit(system.getId(), amount)));

        cardPaymentRepository.save(new CardPayment(card.getId(), txn.getId(), merchant, amount));
        return new CardPaymentResponse(txn.getReference(), merchant, amount, account.getBalance());
    }

    private void enforceMonthlyLimit(Card card, BigDecimal amount) {
        BigDecimal limit = card.getMonthlyLimit();
        if (limit == null || limit.signum() <= 0) {
            return; // 0 / unset => no limit
        }
        Instant monthStart = YearMonth.now(ZoneOffset.UTC).atDay(1)
                .atStartOfDay(ZoneOffset.UTC).toInstant();
        BigDecimal monthToDate = cardPaymentRepository.sumSince(card.getId(), monthStart);
        if (monthToDate.add(amount).compareTo(limit) > 0) {
            throw new PaymentDeclinedException("Monthly card limit exceeded");
        }
    }

    private Card requireCard(UUID userId, UUID cardId) {
        return cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new NotFoundException("Card not found"));
    }

    /** Builds a Luhn-valid card number with a VISA test BIN. */
    private String generatePan() {
        int[] digits = new int[16];
        for (int i = 0; i < TEST_BIN.length(); i++) {
            digits[i] = TEST_BIN.charAt(i) - '0';
        }
        for (int i = TEST_BIN.length(); i < 15; i++) {
            digits[i] = ThreadLocalRandom.current().nextInt(10);
        }
        digits[15] = luhnCheckDigit(digits);
        StringBuilder sb = new StringBuilder(16);
        for (int d : digits) {
            sb.append(d);
        }
        return sb.toString();
    }

    private int luhnCheckDigit(int[] digits) {
        int sum = 0;
        // Positions 0..14 hold the payload; the check digit sits at index 15, so the
        // rightmost payload digit (index 14) is doubled.
        for (int i = 14; i >= 0; i--) {
            int d = digits[i];
            if ((14 - i) % 2 == 0) {
                d *= 2;
                if (d > 9) {
                    d -= 9;
                }
            }
            sum += d;
        }
        return (10 - (sum % 10)) % 10;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountStatus;</code> - Imports `com.bank.account.domain.AccountStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.card.domain.Card;</code> - Imports `com.bank.card.domain.Card` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.card.domain.CardPayment;</code> - Imports `com.bank.card.domain.CardPayment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.card.domain.CardStatus;</code> - Imports `com.bank.card.domain.CardStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.card.dto.CardPaymentResponse;</code> - Imports `com.bank.card.dto.CardPaymentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.card.dto.IssueCardResponse;</code> - Imports `com.bank.card.dto.IssueCardResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.card.dto.CardResponse;</code> - Imports `com.bank.card.dto.CardResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import com.bank.card.repo.CardPaymentRepository;</code> - Imports `com.bank.card.repo.CardPaymentRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import com.bank.card.repo.CardRepository;</code> - Imports `com.bank.card.repo.CardRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import com.bank.common.exception.PaymentDeclinedException;</code> - Imports `com.bank.common.exception.PaymentDeclinedException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import com.bank.ledger.domain.Transaction;</code> - Imports `com.bank.ledger.domain.Transaction` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import com.bank.ledger.service.LedgerService;</code> - Imports `com.bank.ledger.service.LedgerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import com.bank.ledger.service.PostingLine;</code> - Imports `com.bank.ledger.service.PostingLine` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
25. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
26. <code>import java.time.YearMonth;</code> - Imports `java.time.YearMonth` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
27. <code>import java.time.ZoneOffset;</code> - Imports `java.time.ZoneOffset` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
28. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
29. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
30. <code>import java.util.concurrent.ThreadLocalRandom;</code> - Imports `java.util.concurrent.ThreadLocalRandom` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
33. <code>public class CardService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    private static final String TEST_BIN = &quot;4242&quot;; // VISA test BIN</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
36. <code>    private static final String BRAND = &quot;VISA&quot;;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    private final CardRepository cardRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
39. <code>    private final CardPaymentRepository cardPaymentRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
40. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
41. <code>    private final LedgerService ledgerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    public CardService(CardRepository cardRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
44. <code>                       CardPaymentRepository cardPaymentRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
45. <code>                       AccountRepository accountRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                       LedgerService ledgerService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        this.cardRepository = cardRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>        this.cardPaymentRepository = cardPaymentRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
50. <code>        this.ledgerService = ledgerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
54. <code>    public IssueCardResponse issue(UUID userId, UUID accountId, BigDecimal monthlyLimit) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
56. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
57. <code>        if (account.getStatus() != AccountStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>            throw new IllegalArgumentException(&quot;Account is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
59. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>        String pan = generatePan();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
61. <code>        YearMonth expiry = YearMonth.now(ZoneOffset.UTC).plusYears(3);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
62. <code>        Card card = new Card(accountId, userId, pan.substring(pan.length() - 4), BRAND,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>                expiry.getMonthValue(), expiry.getYear(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
64. <code>                monthlyLimit == null ? BigDecimal.ZERO : monthlyLimit);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
65. <code>        cardRepository.save(card);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
66. <code>        return new IssueCardResponse(CardResponse.from(card), pan);</code> - Returns a value/reference to the caller and ends this execution path.
67. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
69. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
70. <code>    public List&lt;Card&gt; list(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>        return cardRepository.findByUserIdOrderByCreatedAtAsc(userId);</code> - Returns a value/reference to the caller and ends this execution path.
72. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
73. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
74. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
75. <code>    public Card setStatus(UUID userId, UUID cardId, CardStatus target) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>        Card card = requireCard(userId, cardId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
77. <code>        if (card.getStatus() == CardStatus.CANCELLED) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
78. <code>            throw new IllegalArgumentException(&quot;Card is cancelled&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
79. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <code>        card.setStatus(target);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
81. <code>        return card;</code> - Returns a value/reference to the caller and ends this execution path.
82. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
85. <code>    public CardPaymentResponse pay(UUID userId, UUID cardId, String merchant, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <code>        Card card = requireCard(userId, cardId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
87. <code>        if (card.getStatus() != CardStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
88. <code>            throw new PaymentDeclinedException(&quot;Card is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
89. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <code>        Account account = accountRepository.findByIdAndOwnerUserId(card.getAccountId(), userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
91. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
92. <code>        if (account.getStatus() != AccountStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
93. <code>            throw new PaymentDeclinedException(&quot;Account is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
94. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
95. <code>        enforceMonthlyLimit(card, amount);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
96. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
97. <code>        Account system = accountRepository</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
98. <code>                .findFirstByTypeAndCurrency(AccountType.SYSTEM, account.getCurrency())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
99. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;System account not configured&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
100. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
101. <code>        // Insufficient funds surfaces as a 422 from the ledger.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
102. <code>        Transaction txn = ledgerService.post(TransactionType.CARD_PAYMENT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
103. <code>                &quot;Card payment to &quot; + merchant, null, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
104. <code>                        PostingLine.debit(account.getId(), amount),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
105. <code>                        PostingLine.credit(system.getId(), amount)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
106. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
107. <code>        cardPaymentRepository.save(new CardPayment(card.getId(), txn.getId(), merchant, amount));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
108. <code>        return new CardPaymentResponse(txn.getReference(), merchant, amount, account.getBalance());</code> - Returns a value/reference to the caller and ends this execution path.
109. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
110. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
111. <code>    private void enforceMonthlyLimit(Card card, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
112. <code>        BigDecimal limit = card.getMonthlyLimit();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
113. <code>        if (limit == null || limit.signum() &lt;= 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
114. <code>            return; // 0 / unset =&gt; no limit</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
115. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
116. <code>        Instant monthStart = YearMonth.now(ZoneOffset.UTC).atDay(1)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
117. <code>                .atStartOfDay(ZoneOffset.UTC).toInstant();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
118. <code>        BigDecimal monthToDate = cardPaymentRepository.sumSince(card.getId(), monthStart);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
119. <code>        if (monthToDate.add(amount).compareTo(limit) &gt; 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
120. <code>            throw new PaymentDeclinedException(&quot;Monthly card limit exceeded&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
121. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
122. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
123. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
124. <code>    private Card requireCard(UUID userId, UUID cardId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
125. <code>        return cardRepository.findByIdAndUserId(cardId, userId)</code> - Returns a value/reference to the caller and ends this execution path.
126. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Card not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
127. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
128. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
129. <code>    /** Builds a Luhn-valid card number with a VISA test BIN. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
130. <code>    private String generatePan() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
131. <code>        int[] digits = new int[16];</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
132. <code>        for (int i = 0; i &lt; TEST_BIN.length(); i++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
133. <code>            digits[i] = TEST_BIN.charAt(i) - &#x27;0&#x27;;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
134. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
135. <code>        for (int i = TEST_BIN.length(); i &lt; 15; i++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
136. <code>            digits[i] = ThreadLocalRandom.current().nextInt(10);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
137. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
138. <code>        digits[15] = luhnCheckDigit(digits);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
139. <code>        StringBuilder sb = new StringBuilder(16);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
140. <code>        for (int d : digits) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
141. <code>            sb.append(d);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
142. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
143. <code>        return sb.toString();</code> - Returns a value/reference to the caller and ends this execution path.
144. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
145. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
146. <code>    private int luhnCheckDigit(int[] digits) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
147. <code>        int sum = 0;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
148. <code>        // Positions 0..14 hold the payload; the check digit sits at index 15, so the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
149. <code>        // rightmost payload digit (index 14) is doubled.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
150. <code>        for (int i = 14; i &gt;= 0; i--) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
151. <code>            int d = digits[i];</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
152. <code>            if ((14 - i) % 2 == 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
153. <code>                d *= 2;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
154. <code>                if (d &gt; 9) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
155. <code>                    d -= 9;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
156. <code>                }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
157. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
158. <code>            sum += d;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
159. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
160. <code>        return (10 - (sum % 10)) % 10;</code> - Returns a value/reference to the caller and ends this execution path.
161. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
162. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 54 | `public IssueCardResponse issue(UUID userId, UUID accountId, BigDecimal monthlyLimit)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `issue`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 70 | `public List&lt;Card&gt; list(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 75 | `public Card setStatus(UUID userId, UUID cardId, CardStatus target)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `setStatus`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 85 | `public CardPaymentResponse pay(UUID userId, UUID cardId, String merchant, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `pay`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 111 | `private void enforceMonthlyLimit(Card card, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `enforceMonthlyLimit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 124 | `private Card requireCard(UUID userId, UUID cardId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireCard`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 130 | `private String generatePan()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `generatePan`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(k) for a fixed-size identifier/card number, so effectively O(1) in this project. |
| 146 | `private int luhnCheckDigit(int[] digits)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `luhnCheckDigit`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(k) for a fixed-size identifier/card number, so effectively O(1) in this project. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/card/web/CardController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.card.domain.CardStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.CardPaymentRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.CardPaymentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.CardResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.IssueCardRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.dto.IssueCardResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.card.service.CardService` | Project-local dependency connecting this file to another banking module. |
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
package com.bank.card.web;

import com.bank.card.domain.CardStatus;
import com.bank.card.dto.CardPaymentRequest;
import com.bank.card.dto.CardPaymentResponse;
import com.bank.card.dto.CardResponse;
import com.bank.card.dto.IssueCardRequest;
import com.bank.card.dto.IssueCardResponse;
import com.bank.card.service.CardService;
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
@RequestMapping("/api/v1/cards")
@Tag(name = "Cards", description = "Virtual cards and card payments")
@SecurityRequirement(name = "bearerAuth")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping
    @Operation(summary = "Issue a virtual card (full number returned once)")
    public ResponseEntity<IssueCardResponse> issue(@Valid @RequestBody IssueCardRequest request) {
        IssueCardResponse body = cardService.issue(
                SecurityUtils.currentUserId(), request.accountId(), request.monthlyLimit());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping
    @Operation(summary = "List my cards")
    public List<CardResponse> list() {
        return cardService.list(SecurityUtils.currentUserId()).stream()
                .map(CardResponse::from)
                .toList();
    }

    @PostMapping("/{cardId}/freeze")
    @Operation(summary = "Freeze a card")
    public CardResponse freeze(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.FROZEN));
    }

    @PostMapping("/{cardId}/unfreeze")
    @Operation(summary = "Unfreeze a card")
    public CardResponse unfreeze(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.ACTIVE));
    }

    @PostMapping("/{cardId}/cancel")
    @Operation(summary = "Cancel a card")
    public CardResponse cancel(@PathVariable UUID cardId) {
        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.CANCELLED));
    }

    @PostMapping("/{cardId}/pay")
    @Operation(summary = "Make a purchase with a card (debits the linked account)")
    public CardPaymentResponse pay(@PathVariable UUID cardId, @Valid @RequestBody CardPaymentRequest request) {
        return cardService.pay(SecurityUtils.currentUserId(), cardId, request.merchant(), request.amount());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.card.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.card.domain.CardStatus;</code> - Imports `com.bank.card.domain.CardStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.card.dto.CardPaymentRequest;</code> - Imports `com.bank.card.dto.CardPaymentRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.card.dto.CardPaymentResponse;</code> - Imports `com.bank.card.dto.CardPaymentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.card.dto.CardResponse;</code> - Imports `com.bank.card.dto.CardResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.card.dto.IssueCardRequest;</code> - Imports `com.bank.card.dto.IssueCardRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.card.dto.IssueCardResponse;</code> - Imports `com.bank.card.dto.IssueCardResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.card.service.CardService;</code> - Imports `com.bank.card.service.CardService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
25. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
28. <code>@RequestMapping(&quot;/api/v1/cards&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
29. <code>@Tag(name = &quot;Cards&quot;, description = &quot;Virtual cards and card payments&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>public class CardController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    private final CardService cardService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    public CardController(CardService cardService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <code>        this.cardService = cardService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
37. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    @PostMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
40. <code>    @Operation(summary = &quot;Issue a virtual card (full number returned once)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
41. <code>    public ResponseEntity&lt;IssueCardResponse&gt; issue(@Valid @RequestBody IssueCardRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <code>        IssueCardResponse body = cardService.issue(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>                SecurityUtils.currentUserId(), request.accountId(), request.monthlyLimit());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>        return ResponseEntity.status(HttpStatus.CREATED).body(body);</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
48. <code>    @Operation(summary = &quot;List my cards&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
49. <code>    public List&lt;CardResponse&gt; list() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <code>        return cardService.list(SecurityUtils.currentUserId()).stream()</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>                .map(CardResponse::from)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
53. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    @PostMapping(&quot;/{cardId}/freeze&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
56. <code>    @Operation(summary = &quot;Freeze a card&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    public CardResponse freeze(@PathVariable UUID cardId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.FROZEN));</code> - Returns a value/reference to the caller and ends this execution path.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
61. <code>    @PostMapping(&quot;/{cardId}/unfreeze&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
62. <code>    @Operation(summary = &quot;Unfreeze a card&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
63. <code>    public CardResponse unfreeze(@PathVariable UUID cardId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <code>        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.ACTIVE));</code> - Returns a value/reference to the caller and ends this execution path.
65. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
66. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
67. <code>    @PostMapping(&quot;/{cardId}/cancel&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
68. <code>    @Operation(summary = &quot;Cancel a card&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
69. <code>    public CardResponse cancel(@PathVariable UUID cardId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>        return CardResponse.from(cardService.setStatus(SecurityUtils.currentUserId(), cardId, CardStatus.CANCELLED));</code> - Returns a value/reference to the caller and ends this execution path.
71. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
72. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
73. <code>    @PostMapping(&quot;/{cardId}/pay&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
74. <code>    @Operation(summary = &quot;Make a purchase with a card (debits the linked account)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
75. <code>    public CardPaymentResponse pay(@PathVariable UUID cardId, @Valid @RequestBody CardPaymentRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>        return cardService.pay(SecurityUtils.currentUserId(), cardId, request.merchant(), request.amount());</code> - Returns a value/reference to the caller and ends this execution path.
77. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
78. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 35 | `public CardController(CardService cardService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `CardController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 41 | `public ResponseEntity&lt;IssueCardResponse&gt; issue(@Valid @RequestBody IssueCardRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `issue`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 49 | `public List&lt;CardResponse&gt; list()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 57 | `public CardResponse freeze(@PathVariable UUID cardId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `freeze`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 63 | `public CardResponse unfreeze(@PathVariable UUID cardId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `unfreeze`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 69 | `public CardResponse cancel(@PathVariable UUID cardId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `cancel`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 75 | `public CardPaymentResponse pay(@PathVariable UUID cardId, @Valid @RequestBody CardPaymentRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `pay`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/domain/InstallmentStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.loan.domain;

public enum InstallmentStatus {
    PENDING,
    PAID,
    OVERDUE
}
````

### Code Walkthrough
1. <code>package com.bank.loan.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum InstallmentStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    PENDING,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    PAID,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    OVERDUE</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/loan/domain/Loan.java`

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
package com.bank.loan.domain;

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
@Table(name = "loans")
@Getter
@Setter
@NoArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** Account the principal is disbursed into and repayments are drawn from. */
    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal principal;

    @Column(name = "annual_rate", nullable = false, precision = 9, scale = 6)
    private BigDecimal annualRate;

    @Column(name = "term_months", nullable = false)
    private int termMonths;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status = LoanStatus.PENDING;

    @Column(name = "disbursed_at")
    private Instant disbursedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public Loan(UUID userId, UUID accountId, BigDecimal principal, BigDecimal annualRate, int termMonths) {
        this.userId = userId;
        this.accountId = accountId;
        this.principal = principal;
        this.annualRate = annualRate;
        this.termMonths = termMonths;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
23. <code>@Table(name = &quot;loans&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
24. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>public class Loan {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
30. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
31. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Column(name = &quot;user_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
34. <code>    private UUID userId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    /** Account the principal is disbursed into and repayments are drawn from. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
37. <code>    @Column(name = &quot;account_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
38. <code>    private UUID accountId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @Column(nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
41. <code>    private BigDecimal principal;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Column(name = &quot;annual_rate&quot;, nullable = false, precision = 9, scale = 6)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
44. <code>    private BigDecimal annualRate;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @Column(name = &quot;term_months&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
47. <code>    private int termMonths;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
50. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
51. <code>    private LoanStatus status = LoanStatus.PENDING;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @Column(name = &quot;disbursed_at&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
54. <code>    private Instant disbursedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
58. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
59. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
60. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
61. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
62. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
63. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
64. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
65. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
66. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
67. <code>    public Loan(UUID userId, UUID accountId, BigDecimal principal, BigDecimal annualRate, int termMonths) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <code>        this.userId = userId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
69. <code>        this.accountId = accountId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
70. <code>        this.principal = principal;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
71. <code>        this.annualRate = annualRate;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
72. <code>        this.termMonths = termMonths;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 67 | `public Loan(UUID userId, UUID accountId, BigDecimal principal, BigDecimal annualRate, int termMonths)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `Loan`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/domain/LoanInstallment.java`

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
| `lombok.Getter` | External or local dependency required by references in this file. |
| `lombok.NoArgsConstructor` | External or local dependency required by references in this file. |
| `lombok.Setter` | External or local dependency required by references in this file. |
| `org.hibernate.annotations.CreationTimestamp` | External or local dependency required by references in this file. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "loan_installments")
@Getter
@Setter
@NoArgsConstructor
public class LoanInstallment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "loan_id", nullable = false)
    private UUID loanId;

    @Column(nullable = false)
    private int seq;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "principal_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal principalDue;

    @Column(name = "interest_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal interestDue;

    @Column(name = "total_due", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalDue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstallmentStatus status = InstallmentStatus.PENDING;

    @Column(name = "paid_at")
    private Instant paidAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public LoanInstallment(UUID loanId, int seq, LocalDate dueDate,
                           BigDecimal principalDue, BigDecimal interestDue, BigDecimal totalDue) {
        this.loanId = loanId;
        this.seq = seq;
        this.dueDate = dueDate;
        this.principalDue = principalDue;
        this.interestDue = interestDue;
        this.totalDue = totalDue;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.persistence.Column;</code> - Imports `jakarta.persistence.Column` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.persistence.Entity;</code> - Imports `jakarta.persistence.Entity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.persistence.EnumType;</code> - Imports `jakarta.persistence.EnumType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.persistence.Enumerated;</code> - Imports `jakarta.persistence.Enumerated` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.persistence.GeneratedValue;</code> - Imports `jakarta.persistence.GeneratedValue` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.persistence.GenerationType;</code> - Imports `jakarta.persistence.GenerationType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.persistence.Id;</code> - Imports `jakarta.persistence.Id` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.persistence.Table;</code> - Imports `jakarta.persistence.Table` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import lombok.Getter;</code> - Imports `lombok.Getter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import lombok.NoArgsConstructor;</code> - Imports `lombok.NoArgsConstructor` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import lombok.Setter;</code> - Imports `lombok.Setter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.hibernate.annotations.CreationTimestamp;</code> - Imports `org.hibernate.annotations.CreationTimestamp` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
22. <code>@Table(name = &quot;loan_installments&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
23. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>public class LoanInstallment {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
29. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
30. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @Column(name = &quot;loan_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
33. <code>    private UUID loanId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
36. <code>    private int seq;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Column(name = &quot;due_date&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
39. <code>    private LocalDate dueDate;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Column(name = &quot;principal_due&quot;, nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
42. <code>    private BigDecimal principalDue;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @Column(name = &quot;interest_due&quot;, nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
45. <code>    private BigDecimal interestDue;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @Column(name = &quot;total_due&quot;, nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private BigDecimal totalDue;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
51. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
52. <code>    private InstallmentStatus status = InstallmentStatus.PENDING;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @Column(name = &quot;paid_at&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
55. <code>    private Instant paidAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
56. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
57. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
58. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
59. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
60. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
61. <code>    public LoanInstallment(UUID loanId, int seq, LocalDate dueDate,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
62. <code>                           BigDecimal principalDue, BigDecimal interestDue, BigDecimal totalDue) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <code>        this.loanId = loanId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
64. <code>        this.seq = seq;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
65. <code>        this.dueDate = dueDate;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
66. <code>        this.principalDue = principalDue;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
67. <code>        this.interestDue = interestDue;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
68. <code>        this.totalDue = totalDue;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
69. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/loan/domain/LoanStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.loan.domain;

public enum LoanStatus {
    PENDING,
    REJECTED,
    ACTIVE,
    PAID_OFF
}
````

### Code Walkthrough
1. <code>package com.bank.loan.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum LoanStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    PENDING,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    REJECTED,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    ACTIVE,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
7. <code>    PAID_OFF</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/loan/dto/InstallmentResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.InstallmentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanInstallment` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.dto;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InstallmentResponse(
        int seq,
        LocalDate dueDate,
        BigDecimal principalDue,
        BigDecimal interestDue,
        BigDecimal totalDue,
        InstallmentStatus status
) {
    public static InstallmentResponse from(LoanInstallment i) {
        return new InstallmentResponse(i.getSeq(), i.getDueDate(), i.getPrincipalDue(),
                i.getInterestDue(), i.getTotalDue(), i.getStatus());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.InstallmentStatus;</code> - Imports `com.bank.loan.domain.InstallmentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.LoanInstallment;</code> - Imports `com.bank.loan.domain.LoanInstallment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public record InstallmentResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
10. <code>        int seq,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        LocalDate dueDate,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        BigDecimal principalDue,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        BigDecimal interestDue,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        BigDecimal totalDue,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        InstallmentStatus status</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>    public static InstallmentResponse from(LoanInstallment i) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>        return new InstallmentResponse(i.getSeq(), i.getDueDate(), i.getPrincipalDue(),</code> - Returns a value/reference to the caller and ends this execution path.
19. <code>                i.getInterestDue(), i.getTotalDue(), i.getStatus());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
20. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 17 | `public static InstallmentResponse from(LoanInstallment i)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/dto/LoanApplicationRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Digits` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Max` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Min` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotNull` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Positive` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record LoanApplicationRequest(
        @NotNull UUID accountId,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal principal,
        @Min(1) @Max(60) int termMonths
) {
}
````

### Code Walkthrough
1. <code>package com.bank.loan.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.Max;</code> - Imports `jakarta.validation.constraints.Max` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.Min;</code> - Imports `jakarta.validation.constraints.Min` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.validation.constraints.Positive;</code> - Imports `jakarta.validation.constraints.Positive` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>public record LoanApplicationRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
13. <code>        @NotNull UUID accountId,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
14. <code>        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal principal,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
15. <code>        @Min(1) @Max(60) int termMonths</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
16. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/loan/dto/LoanDetailResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.dto;

import java.util.List;

public record LoanDetailResponse(
        LoanResponse loan,
        List<InstallmentResponse> schedule
) {
}
````

### Code Walkthrough
1. <code>package com.bank.loan.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>public record LoanDetailResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
6. <code>        LoanResponse loan,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
7. <code>        List&lt;InstallmentResponse&gt; schedule</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
8. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
9. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/loan/dto/LoanResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.InstallmentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.Loan` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanInstallment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanStatus` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.dto;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.domain.LoanStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record LoanResponse(
        UUID id,
        UUID accountId,
        BigDecimal principal,
        BigDecimal annualRate,
        int termMonths,
        LoanStatus status,
        BigDecimal outstanding,
        LocalDate nextDueDate,
        Instant createdAt
) {
    public static LoanResponse from(Loan loan, List<LoanInstallment> installments) {
        BigDecimal outstanding = installments.stream()
                .filter(i -> i.getStatus() != InstallmentStatus.PAID)
                .map(LoanInstallment::getTotalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        LocalDate nextDue = installments.stream()
                .filter(i -> i.getStatus() != InstallmentStatus.PAID)
                .map(LoanInstallment::getDueDate)
                .min(LocalDate::compareTo)
                .orElse(null);
        return new LoanResponse(loan.getId(), loan.getAccountId(), loan.getPrincipal(),
                loan.getAnnualRate(), loan.getTermMonths(), loan.getStatus(),
                outstanding, nextDue, loan.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.InstallmentStatus;</code> - Imports `com.bank.loan.domain.InstallmentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.Loan;</code> - Imports `com.bank.loan.domain.Loan` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.loan.domain.LoanInstallment;</code> - Imports `com.bank.loan.domain.LoanInstallment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.loan.domain.LoanStatus;</code> - Imports `com.bank.loan.domain.LoanStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>public record LoanResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
15. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        UUID accountId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        BigDecimal principal,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        BigDecimal annualRate,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>        int termMonths,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>        LoanStatus status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
21. <code>        BigDecimal outstanding,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
22. <code>        LocalDate nextDueDate,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
23. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
24. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <code>    public static LoanResponse from(Loan loan, List&lt;LoanInstallment&gt; installments) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        BigDecimal outstanding = installments.stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
27. <code>                .filter(i -&gt; i.getStatus() != InstallmentStatus.PAID)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
28. <code>                .map(LoanInstallment::getTotalDue)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                .reduce(BigDecimal.ZERO, BigDecimal::add);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
30. <code>        LocalDate nextDue = installments.stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                .filter(i -&gt; i.getStatus() != InstallmentStatus.PAID)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                .map(LoanInstallment::getDueDate)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                .min(LocalDate::compareTo)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .orElse(null);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        return new LoanResponse(loan.getId(), loan.getAccountId(), loan.getPrincipal(),</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>                loan.getAnnualRate(), loan.getTermMonths(), loan.getStatus(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                outstanding, nextDue, loan.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
38. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public static LoanResponse from(Loan loan, List&lt;LoanInstallment&gt; installments)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/package-info.java`

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
 * loan module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.loan;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * loan module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.loan;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/loan/repo/LoanInstallmentRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.InstallmentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanInstallment` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.repo;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LoanInstallmentRepository extends JpaRepository<LoanInstallment, UUID> {

    List<LoanInstallment> findByLoanIdOrderBySeqAsc(UUID loanId);

    Optional<LoanInstallment> findFirstByLoanIdAndStatusNotOrderBySeqAsc(UUID loanId, InstallmentStatus status);

    long countByLoanIdAndStatusNot(UUID loanId, InstallmentStatus status);

    List<LoanInstallment> findByStatusAndDueDateBefore(InstallmentStatus status, LocalDate date);
}
````

### Code Walkthrough
1. <code>package com.bank.loan.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.InstallmentStatus;</code> - Imports `com.bank.loan.domain.InstallmentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.LoanInstallment;</code> - Imports `com.bank.loan.domain.LoanInstallment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>public interface LoanInstallmentRepository extends JpaRepository&lt;LoanInstallment, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    List&lt;LoanInstallment&gt; findByLoanIdOrderBySeqAsc(UUID loanId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    Optional&lt;LoanInstallment&gt; findFirstByLoanIdAndStatusNotOrderBySeqAsc(UUID loanId, InstallmentStatus status);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    long countByLoanIdAndStatusNot(UUID loanId, InstallmentStatus status);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    List&lt;LoanInstallment&gt; findByStatusAndDueDateBefore(InstallmentStatus status, LocalDate date);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
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

## `backend/src/main/java/com/bank/loan/repo/LoanRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.Loan` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanStatus` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.repo;

import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, UUID> {

    List<Loan> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Loan> findByIdAndUserId(UUID id, UUID userId);

    List<Loan> findByStatusOrderByCreatedAtAsc(LoanStatus status);

    List<Loan> findByStatus(LoanStatus status);
}
````

### Code Walkthrough
1. <code>package com.bank.loan.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.Loan;</code> - Imports `com.bank.loan.domain.Loan` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.LoanStatus;</code> - Imports `com.bank.loan.domain.LoanStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>public interface LoanRepository extends JpaRepository&lt;Loan, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>    List&lt;Loan&gt; findByUserIdOrderByCreatedAtDesc(UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>    Optional&lt;Loan&gt; findByIdAndUserId(UUID id, UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    List&lt;Loan&gt; findByStatusOrderByCreatedAtAsc(LoanStatus status);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    List&lt;Loan&gt; findByStatus(LoanStatus status);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
20. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/loan/service/AmortizationCalculator.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.math.MathContext` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.math.RoundingMode` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.ArrayList` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Generates a fixed, equal-payment amortization schedule.
 *
 * <p>Monthly rate r = annual/12; payment M = P·r·(1+r)^n / ((1+r)^n − 1).
 * Each installment's interest = outstanding·r and principal = M − interest; the
 * final installment absorbs rounding so the schedule fully repays the principal.
 */
@Component
public class AmortizationCalculator {

    private static final MathContext MC = MathContext.DECIMAL64;
    private static final int SCALE = 2;

    public record Installment(int seq, LocalDate dueDate, BigDecimal principalDue,
                              BigDecimal interestDue, BigDecimal totalDue) {
    }

    public List<Installment> schedule(BigDecimal principal, BigDecimal annualRate,
                                      int termMonths, LocalDate startDate) {
        if (termMonths <= 0) {
            throw new IllegalArgumentException("Term must be positive");
        }
        BigDecimal r = annualRate.divide(BigDecimal.valueOf(12), MC);
        BigDecimal payment = monthlyPayment(principal, r, termMonths);

        List<Installment> rows = new ArrayList<>(termMonths);
        BigDecimal balance = principal.setScale(SCALE, RoundingMode.HALF_EVEN);

        for (int seq = 1; seq <= termMonths; seq++) {
            BigDecimal interest = balance.multiply(r).setScale(SCALE, RoundingMode.HALF_EVEN);
            BigDecimal principalDue = payment.subtract(interest);
            BigDecimal total;
            if (seq == termMonths || principalDue.compareTo(balance) >= 0) {
                // Final (or over-shooting) installment clears the remaining balance exactly.
                principalDue = balance;
                total = principalDue.add(interest);
                balance = BigDecimal.ZERO.setScale(SCALE);
            } else {
                total = payment;
                balance = balance.subtract(principalDue);
            }
            rows.add(new Installment(seq, startDate.plusMonths(seq), principalDue, interest, total));
        }
        return rows;
    }

    private BigDecimal monthlyPayment(BigDecimal principal, BigDecimal r, int n) {
        if (r.signum() == 0) {
            return principal.divide(BigDecimal.valueOf(n), SCALE, RoundingMode.HALF_EVEN);
        }
        BigDecimal pow = r.add(BigDecimal.ONE).pow(n, MC);                  // (1+r)^n
        BigDecimal m = principal.multiply(r).multiply(pow)
                .divide(pow.subtract(BigDecimal.ONE), MC);                  // P·r·pow/(pow-1)
        return m.setScale(SCALE, RoundingMode.HALF_EVEN);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.math.MathContext;</code> - Imports `java.math.MathContext` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.math.RoundingMode;</code> - Imports `java.math.RoundingMode` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import java.util.ArrayList;</code> - Imports `java.util.ArrayList` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * Generates a fixed, equal-payment amortization schedule.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> *</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> * &lt;p&gt;Monthly rate r = annual/12; payment M = P·r·(1+r)^n / ((1+r)^n − 1).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code> * Each installment&#x27;s interest = outstanding·r and principal = M − interest; the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code> * final installment absorbs rounding so the schedule fully repays the principal.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>public class AmortizationCalculator {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    private static final MathContext MC = MathContext.DECIMAL64;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
23. <code>    private static final int SCALE = 2;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public record Installment(int seq, LocalDate dueDate, BigDecimal principalDue,</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
26. <code>                              BigDecimal interestDue, BigDecimal totalDue) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    public List&lt;Installment&gt; schedule(BigDecimal principal, BigDecimal annualRate,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
30. <code>                                      int termMonths, LocalDate startDate) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <code>        if (termMonths &lt;= 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>            throw new IllegalArgumentException(&quot;Term must be positive&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
33. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        BigDecimal r = annualRate.divide(BigDecimal.valueOf(12), MC);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>        BigDecimal payment = monthlyPayment(principal, r, termMonths);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>        List&lt;Installment&gt; rows = new ArrayList&lt;&gt;(termMonths);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
38. <code>        BigDecimal balance = principal.setScale(SCALE, RoundingMode.HALF_EVEN);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>        for (int seq = 1; seq &lt;= termMonths; seq++) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>            BigDecimal interest = balance.multiply(r).setScale(SCALE, RoundingMode.HALF_EVEN);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
42. <code>            BigDecimal principalDue = payment.subtract(interest);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
43. <code>            BigDecimal total;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>            if (seq == termMonths || principalDue.compareTo(balance) &gt;= 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>                // Final (or over-shooting) installment clears the remaining balance exactly.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
46. <code>                principalDue = balance;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
47. <code>                total = principalDue.add(interest);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>                balance = BigDecimal.ZERO.setScale(SCALE);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>            } else {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <code>                total = payment;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
51. <code>                balance = balance.subtract(principalDue);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
52. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <code>            rows.add(new Installment(seq, startDate.plusMonths(seq), principalDue, interest, total));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
54. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        return rows;</code> - Returns a value/reference to the caller and ends this execution path.
56. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
58. <code>    private BigDecimal monthlyPayment(BigDecimal principal, BigDecimal r, int n) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>        if (r.signum() == 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>            return principal.divide(BigDecimal.valueOf(n), SCALE, RoundingMode.HALF_EVEN);</code> - Returns a value/reference to the caller and ends this execution path.
61. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <code>        BigDecimal pow = r.add(BigDecimal.ONE).pow(n, MC);                  // (1+r)^n</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>        BigDecimal m = principal.multiply(r).multiply(pow)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
64. <code>                .divide(pow.subtract(BigDecimal.ONE), MC);                  // P·r·pow/(pow-1)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
65. <code>        return m.setScale(SCALE, RoundingMode.HALF_EVEN);</code> - Returns a value/reference to the caller and ends this execution path.
66. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 58 | `private BigDecimal monthlyPayment(BigDecimal principal, BigDecimal r, int n)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `monthlyPayment`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/service/LoanScheduler.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.InstallmentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanInstallment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.repo.LoanInstallmentRepository` | Project-local dependency connecting this file to another banking module. |
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.scheduling.annotation.Scheduled` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.ZoneOffset` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.service;

import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.repo.LoanInstallmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Daily loan maintenance: flags unpaid installments whose due date has passed as
 * OVERDUE. Runs on a cron schedule (see app.loans.maintenance-cron).
 */
@Component
public class LoanScheduler {

    private static final Logger log = LoggerFactory.getLogger(LoanScheduler.class);

    private final LoanInstallmentRepository installmentRepository;

    public LoanScheduler(LoanInstallmentRepository installmentRepository) {
        this.installmentRepository = installmentRepository;
    }

    @Scheduled(cron = "${app.loans.maintenance-cron:0 0 1 * * *}")
    @Transactional
    public void markOverdueInstallments() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<LoanInstallment> due = installmentRepository
                .findByStatusAndDueDateBefore(InstallmentStatus.PENDING, today);
        if (due.isEmpty()) {
            return;
        }
        due.forEach(i -> i.setStatus(InstallmentStatus.OVERDUE));
        log.info("Loan maintenance: marked {} installment(s) overdue", due.size());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.InstallmentStatus;</code> - Imports `com.bank.loan.domain.InstallmentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.LoanInstallment;</code> - Imports `com.bank.loan.domain.LoanInstallment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.loan.repo.LoanInstallmentRepository;</code> - Imports `com.bank.loan.repo.LoanInstallmentRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.scheduling.annotation.Scheduled;</code> - Imports `org.springframework.scheduling.annotation.Scheduled` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import java.time.ZoneOffset;</code> - Imports `java.time.ZoneOffset` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code> * Daily loan maintenance: flags unpaid installments whose due date has passed as</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code> * OVERDUE. Runs on a cron schedule (see app.loans.maintenance-cron).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
20. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>public class LoanScheduler {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private static final Logger log = LoggerFactory.getLogger(LoanScheduler.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    private final LoanInstallmentRepository installmentRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    public LoanScheduler(LoanInstallmentRepository installmentRepository) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        this.installmentRepository = installmentRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
29. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    @Scheduled(cron = &quot;${app.loans.maintenance-cron:0 0 1 * * *}&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
32. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
33. <code>    public void markOverdueInstallments() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        LocalDate today = LocalDate.now(ZoneOffset.UTC);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>        List&lt;LoanInstallment&gt; due = installmentRepository</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                .findByStatusAndDueDateBefore(InstallmentStatus.PENDING, today);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
37. <code>        if (due.isEmpty()) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
39. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        due.forEach(i -&gt; i.setStatus(InstallmentStatus.OVERDUE));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>        log.info(&quot;Loan maintenance: marked {} installment(s) overdue&quot;, due.size());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 27 | `public LoanScheduler(LoanInstallmentRepository installmentRepository)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `LoanScheduler`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 33 | `public void markOverdueInstallments()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `markOverdueInstallments`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/service/LoanService.java`

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
| `com.bank.customer.domain.KycStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.repo.CustomerProfileRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.Transaction` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.LedgerService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.PostingLine` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.InstallmentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.Loan` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanInstallment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.repo.LoanInstallmentRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.repo.LoanRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.ZoneOffset` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountStatus;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.repo.CustomerProfileRepository;
import com.bank.ledger.domain.Transaction;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.loan.domain.InstallmentStatus;
import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanInstallment;
import com.bank.loan.domain.LoanStatus;
import com.bank.loan.repo.LoanInstallmentRepository;
import com.bank.loan.repo.LoanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanInstallmentRepository installmentRepository;
    private final AccountRepository accountRepository;
    private final CustomerProfileRepository profileRepository;
    private final LedgerService ledgerService;
    private final AmortizationCalculator calculator;

    private final BigDecimal annualRate;
    private final BigDecimal minPrincipal;
    private final BigDecimal maxPrincipal;
    private final int maxTermMonths;

    public LoanService(LoanRepository loanRepository,
                       LoanInstallmentRepository installmentRepository,
                       AccountRepository accountRepository,
                       CustomerProfileRepository profileRepository,
                       LedgerService ledgerService,
                       AmortizationCalculator calculator,
                       @Value("${app.loans.annual-rate:0.12}") BigDecimal annualRate,
                       @Value("${app.loans.min-principal:100}") BigDecimal minPrincipal,
                       @Value("${app.loans.max-principal:50000}") BigDecimal maxPrincipal,
                       @Value("${app.loans.max-term-months:60}") int maxTermMonths) {
        this.loanRepository = loanRepository;
        this.installmentRepository = installmentRepository;
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
        this.ledgerService = ledgerService;
        this.calculator = calculator;
        this.annualRate = annualRate;
        this.minPrincipal = minPrincipal;
        this.maxPrincipal = maxPrincipal;
        this.maxTermMonths = maxTermMonths;
    }

    @Transactional
    public Loan apply(UUID userId, UUID accountId, BigDecimal principal, int termMonths) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }
        KycStatus kyc = profileRepository.findByUserId(userId)
                .map(p -> p.getKycStatus())
                .orElse(KycStatus.PENDING);
        if (kyc != KycStatus.VERIFIED) {
            throw new IllegalArgumentException("KYC must be verified before applying for a loan");
        }
        if (principal.compareTo(minPrincipal) < 0 || principal.compareTo(maxPrincipal) > 0) {
            throw new IllegalArgumentException(
                    "Principal must be between " + minPrincipal + " and " + maxPrincipal);
        }
        if (termMonths <= 0 || termMonths > maxTermMonths) {
            throw new IllegalArgumentException("Term must be between 1 and " + maxTermMonths + " months");
        }
        return loanRepository.save(new Loan(userId, accountId, principal, annualRate, termMonths));
    }

    @Transactional(readOnly = true)
    public List<Loan> list(UUID userId) {
        return loanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Loan get(UUID userId, UUID loanId) {
        return loanRepository.findByIdAndUserId(loanId, userId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
    }

    @Transactional(readOnly = true)
    public List<LoanInstallment> installments(UUID loanId) {
        return installmentRepository.findByLoanIdOrderBySeqAsc(loanId);
    }

    @Transactional
    public Loan repayNext(UUID userId, UUID loanId) {
        Loan loan = get(userId, loanId);
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new IllegalArgumentException("Loan is not active");
        }
        LoanInstallment next = installmentRepository
                .findFirstByLoanIdAndStatusNotOrderBySeqAsc(loanId, InstallmentStatus.PAID)
                .orElseThrow(() -> new IllegalArgumentException("No outstanding installments"));

        Account account = accountRepository.findByIdAndOwnerUserId(loan.getAccountId(), userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        Account system = systemAccount(account.getCurrency());

        // Insufficient funds surfaces as 422 from the ledger.
        ledgerService.post(TransactionType.LOAN_REPAYMENT,
                "Loan repayment installment " + next.getSeq(), null, List.of(
                        PostingLine.debit(account.getId(), next.getTotalDue()),
                        PostingLine.credit(system.getId(), next.getTotalDue())));

        next.setStatus(InstallmentStatus.PAID);
        next.setPaidAt(Instant.now());

        if (installmentRepository.countByLoanIdAndStatusNot(loanId, InstallmentStatus.PAID) == 0) {
            loan.setStatus(LoanStatus.PAID_OFF);
        }
        return loan;
    }

    // ---- Admin ----

    @Transactional(readOnly = true)
    public List<Loan> listByStatus(LoanStatus status) {
        return status == null ? loanRepository.findAll() : loanRepository.findByStatusOrderByCreatedAtAsc(status);
    }

    @Transactional
    public Loan approve(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalArgumentException("Loan is not pending");
        }
        Account account = accountRepository.findById(loan.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));
        Account system = systemAccount(account.getCurrency());

        // Generate and persist the amortization schedule.
        LocalDate start = LocalDate.now(ZoneOffset.UTC);
        List<LoanInstallment> rows = calculator
                .schedule(loan.getPrincipal(), loan.getAnnualRate(), loan.getTermMonths(), start)
                .stream()
                .map(i -> new LoanInstallment(loan.getId(), i.seq(), i.dueDate(),
                        i.principalDue(), i.interestDue(), i.totalDue()))
                .toList();
        installmentRepository.saveAll(rows);

        // Disburse the principal into the customer account.
        ledgerService.post(TransactionType.LOAN_DISBURSEMENT, "Loan disbursement", null, List.of(
                PostingLine.debit(system.getId(), loan.getPrincipal()),
                PostingLine.credit(account.getId(), loan.getPrincipal())));

        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDisbursedAt(Instant.now());
        return loan;
    }

    @Transactional
    public Loan reject(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalArgumentException("Loan is not pending");
        }
        loan.setStatus(LoanStatus.REJECTED);
        return loan;
    }

    private Account systemAccount(String currency) {
        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)
                .orElseThrow(() -> new NotFoundException("System account not configured"));
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountStatus;</code> - Imports `com.bank.account.domain.AccountStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.customer.domain.KycStatus;</code> - Imports `com.bank.customer.domain.KycStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.customer.repo.CustomerProfileRepository;</code> - Imports `com.bank.customer.repo.CustomerProfileRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.ledger.domain.Transaction;</code> - Imports `com.bank.ledger.domain.Transaction` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.ledger.service.LedgerService;</code> - Imports `com.bank.ledger.service.LedgerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import com.bank.ledger.service.PostingLine;</code> - Imports `com.bank.ledger.service.PostingLine` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import com.bank.loan.domain.InstallmentStatus;</code> - Imports `com.bank.loan.domain.InstallmentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import com.bank.loan.domain.Loan;</code> - Imports `com.bank.loan.domain.Loan` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import com.bank.loan.domain.LoanInstallment;</code> - Imports `com.bank.loan.domain.LoanInstallment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import com.bank.loan.domain.LoanStatus;</code> - Imports `com.bank.loan.domain.LoanStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import com.bank.loan.repo.LoanInstallmentRepository;</code> - Imports `com.bank.loan.repo.LoanInstallmentRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import com.bank.loan.repo.LoanRepository;</code> - Imports `com.bank.loan.repo.LoanRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
25. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
26. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
27. <code>import java.time.ZoneOffset;</code> - Imports `java.time.ZoneOffset` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
28. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
29. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
32. <code>public class LoanService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    private final LoanRepository loanRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
35. <code>    private final LoanInstallmentRepository installmentRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
36. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
37. <code>    private final CustomerProfileRepository profileRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
38. <code>    private final LedgerService ledgerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
39. <code>    private final AmortizationCalculator calculator;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    private final BigDecimal annualRate;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
42. <code>    private final BigDecimal minPrincipal;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
43. <code>    private final BigDecimal maxPrincipal;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
44. <code>    private final int maxTermMonths;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    public LoanService(LoanRepository loanRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
47. <code>                       LoanInstallmentRepository installmentRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                       AccountRepository accountRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                       CustomerProfileRepository profileRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                       LedgerService ledgerService,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                       AmortizationCalculator calculator,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                       @Value(&quot;${app.loans.annual-rate:0.12}&quot;) BigDecimal annualRate,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
53. <code>                       @Value(&quot;${app.loans.min-principal:100}&quot;) BigDecimal minPrincipal,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
54. <code>                       @Value(&quot;${app.loans.max-principal:50000}&quot;) BigDecimal maxPrincipal,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>                       @Value(&quot;${app.loans.max-term-months:60}&quot;) int maxTermMonths) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
56. <code>        this.loanRepository = loanRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
57. <code>        this.installmentRepository = installmentRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
58. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
59. <code>        this.profileRepository = profileRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>        this.ledgerService = ledgerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
61. <code>        this.calculator = calculator;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
62. <code>        this.annualRate = annualRate;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
63. <code>        this.minPrincipal = minPrincipal;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
64. <code>        this.maxPrincipal = maxPrincipal;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
65. <code>        this.maxTermMonths = maxTermMonths;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
66. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
68. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
69. <code>    public Loan apply(UUID userId, UUID accountId, BigDecimal principal, int termMonths) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
71. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
72. <code>        if (account.getStatus() != AccountStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
73. <code>            throw new IllegalArgumentException(&quot;Account is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
74. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>        KycStatus kyc = profileRepository.findByUserId(userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                .map(p -&gt; p.getKycStatus())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
77. <code>                .orElse(KycStatus.PENDING);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
78. <code>        if (kyc != KycStatus.VERIFIED) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
79. <code>            throw new IllegalArgumentException(&quot;KYC must be verified before applying for a loan&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
80. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
81. <code>        if (principal.compareTo(minPrincipal) &lt; 0 || principal.compareTo(maxPrincipal) &gt; 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
82. <code>            throw new IllegalArgumentException(</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
83. <code>                    &quot;Principal must be between &quot; + minPrincipal + &quot; and &quot; + maxPrincipal);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
84. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
85. <code>        if (termMonths &lt;= 0 || termMonths &gt; maxTermMonths) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <code>            throw new IllegalArgumentException(&quot;Term must be between 1 and &quot; + maxTermMonths + &quot; months&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
87. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
88. <code>        return loanRepository.save(new Loan(userId, accountId, principal, annualRate, termMonths));</code> - Returns a value/reference to the caller and ends this execution path.
89. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
91. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
92. <code>    public List&lt;Loan&gt; list(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
93. <code>        return loanRepository.findByUserIdOrderByCreatedAtDesc(userId);</code> - Returns a value/reference to the caller and ends this execution path.
94. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
95. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
96. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
97. <code>    public Loan get(UUID userId, UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
98. <code>        return loanRepository.findByIdAndUserId(loanId, userId)</code> - Returns a value/reference to the caller and ends this execution path.
99. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Loan not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
100. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
101. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
102. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
103. <code>    public List&lt;LoanInstallment&gt; installments(UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
104. <code>        return installmentRepository.findByLoanIdOrderBySeqAsc(loanId);</code> - Returns a value/reference to the caller and ends this execution path.
105. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
106. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
107. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
108. <code>    public Loan repayNext(UUID userId, UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
109. <code>        Loan loan = get(userId, loanId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
110. <code>        if (loan.getStatus() != LoanStatus.ACTIVE) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
111. <code>            throw new IllegalArgumentException(&quot;Loan is not active&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
112. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
113. <code>        LoanInstallment next = installmentRepository</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
114. <code>                .findFirstByLoanIdAndStatusNotOrderBySeqAsc(loanId, InstallmentStatus.PAID)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
115. <code>                .orElseThrow(() -&gt; new IllegalArgumentException(&quot;No outstanding installments&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
116. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
117. <code>        Account account = accountRepository.findByIdAndOwnerUserId(loan.getAccountId(), userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
118. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
119. <code>        Account system = systemAccount(account.getCurrency());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
120. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
121. <code>        // Insufficient funds surfaces as 422 from the ledger.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
122. <code>        ledgerService.post(TransactionType.LOAN_REPAYMENT,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
123. <code>                &quot;Loan repayment installment &quot; + next.getSeq(), null, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
124. <code>                        PostingLine.debit(account.getId(), next.getTotalDue()),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
125. <code>                        PostingLine.credit(system.getId(), next.getTotalDue())));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
126. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
127. <code>        next.setStatus(InstallmentStatus.PAID);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
128. <code>        next.setPaidAt(Instant.now());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
129. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
130. <code>        if (installmentRepository.countByLoanIdAndStatusNot(loanId, InstallmentStatus.PAID) == 0) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
131. <code>            loan.setStatus(LoanStatus.PAID_OFF);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
132. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
133. <code>        return loan;</code> - Returns a value/reference to the caller and ends this execution path.
134. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
135. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
136. <code>    // ---- Admin ----</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
137. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
138. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
139. <code>    public List&lt;Loan&gt; listByStatus(LoanStatus status) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
140. <code>        return status == null ? loanRepository.findAll() : loanRepository.findByStatusOrderByCreatedAtAsc(status);</code> - Returns a value/reference to the caller and ends this execution path.
141. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
142. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
143. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
144. <code>    public Loan approve(UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
145. <code>        Loan loan = loanRepository.findById(loanId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
146. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Loan not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
147. <code>        if (loan.getStatus() != LoanStatus.PENDING) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
148. <code>            throw new IllegalArgumentException(&quot;Loan is not pending&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
149. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
150. <code>        Account account = accountRepository.findById(loan.getAccountId())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
151. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
152. <code>        Account system = systemAccount(account.getCurrency());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
153. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
154. <code>        // Generate and persist the amortization schedule.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
155. <code>        LocalDate start = LocalDate.now(ZoneOffset.UTC);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
156. <code>        List&lt;LoanInstallment&gt; rows = calculator</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
157. <code>                .schedule(loan.getPrincipal(), loan.getAnnualRate(), loan.getTermMonths(), start)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
158. <code>                .stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
159. <code>                .map(i -&gt; new LoanInstallment(loan.getId(), i.seq(), i.dueDate(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
160. <code>                        i.principalDue(), i.interestDue(), i.totalDue()))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
161. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
162. <code>        installmentRepository.saveAll(rows);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
163. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
164. <code>        // Disburse the principal into the customer account.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
165. <code>        ledgerService.post(TransactionType.LOAN_DISBURSEMENT, &quot;Loan disbursement&quot;, null, List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
166. <code>                PostingLine.debit(system.getId(), loan.getPrincipal()),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
167. <code>                PostingLine.credit(account.getId(), loan.getPrincipal())));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
168. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
169. <code>        loan.setStatus(LoanStatus.ACTIVE);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
170. <code>        loan.setDisbursedAt(Instant.now());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
171. <code>        return loan;</code> - Returns a value/reference to the caller and ends this execution path.
172. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
173. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
174. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
175. <code>    public Loan reject(UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
176. <code>        Loan loan = loanRepository.findById(loanId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
177. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Loan not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
178. <code>        if (loan.getStatus() != LoanStatus.PENDING) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
179. <code>            throw new IllegalArgumentException(&quot;Loan is not pending&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
180. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
181. <code>        loan.setStatus(LoanStatus.REJECTED);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
182. <code>        return loan;</code> - Returns a value/reference to the caller and ends this execution path.
183. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
184. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
185. <code>    private Account systemAccount(String currency) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
186. <code>        return accountRepository.findFirstByTypeAndCurrency(AccountType.SYSTEM, currency)</code> - Returns a value/reference to the caller and ends this execution path.
187. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;System account not configured&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
188. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
189. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 69 | `public Loan apply(UUID userId, UUID accountId, BigDecimal principal, int termMonths)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `apply`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 92 | `public List&lt;Loan&gt; list(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 97 | `public Loan get(UUID userId, UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `get`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 103 | `public List&lt;LoanInstallment&gt; installments(UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `installments`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 108 | `public Loan repayNext(UUID userId, UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `repayNext`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 139 | `public List&lt;Loan&gt; listByStatus(LoanStatus status)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `listByStatus`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 144 | `public Loan approve(UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `approve`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 175 | `public Loan reject(UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `reject`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 185 | `private Account systemAccount(String currency)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `systemAccount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/web/AdminLoanController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.loan.domain.Loan` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.LoanStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.InstallmentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.LoanDetailResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.LoanResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.service.LoanService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `org.springframework.security.access.prepost.PreAuthorize` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PathVariable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestParam` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.loan.web;

import com.bank.loan.domain.Loan;
import com.bank.loan.domain.LoanStatus;
import com.bank.loan.dto.InstallmentResponse;
import com.bank.loan.dto.LoanDetailResponse;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/loans")
@Tag(name = "Admin", description = "Loan approval and review")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    @Operation(summary = "List loans (optionally filter by status)")
    public List<LoanResponse> list(@RequestParam(required = false) LoanStatus status) {
        return loanService.listByStatus(status).stream()
                .map(loan -> LoanResponse.from(loan, loanService.installments(loan.getId())))
                .toList();
    }

    @PostMapping("/{loanId}/approve")
    @Operation(summary = "Approve a loan: generate the schedule and disburse the principal")
    public LoanDetailResponse approve(@PathVariable UUID loanId) {
        Loan loan = loanService.approve(loanId);
        var installments = loanService.installments(loan.getId());
        return new LoanDetailResponse(
                LoanResponse.from(loan, installments),
                installments.stream().map(InstallmentResponse::from).toList());
    }

    @PostMapping("/{loanId}/reject")
    @Operation(summary = "Reject a pending loan")
    public LoanResponse reject(@PathVariable UUID loanId) {
        Loan loan = loanService.reject(loanId);
        return LoanResponse.from(loan, List.of());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.loan.domain.Loan;</code> - Imports `com.bank.loan.domain.Loan` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.LoanStatus;</code> - Imports `com.bank.loan.domain.LoanStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.loan.dto.InstallmentResponse;</code> - Imports `com.bank.loan.dto.InstallmentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.loan.dto.LoanDetailResponse;</code> - Imports `com.bank.loan.dto.LoanDetailResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.loan.dto.LoanResponse;</code> - Imports `com.bank.loan.dto.LoanResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.loan.service.LoanService;</code> - Imports `com.bank.loan.service.LoanService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.security.access.prepost.PreAuthorize;</code> - Imports `org.springframework.security.access.prepost.PreAuthorize` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.RequestParam;</code> - Imports `org.springframework.web.bind.annotation.RequestParam` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
24. <code>@RequestMapping(&quot;/api/v1/admin/loans&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
25. <code>@Tag(name = &quot;Admin&quot;, description = &quot;Loan approval and review&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>@PreAuthorize(&quot;hasRole(&#x27;ADMIN&#x27;)&quot;)</code> - Spring Security method guard. Authorization is checked before the method body runs.
28. <code>public class AdminLoanController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    private final LoanService loanService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    public AdminLoanController(LoanService loanService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <code>        this.loanService = loanService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
37. <code>    @Operation(summary = &quot;List loans (optionally filter by status)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    public List&lt;LoanResponse&gt; list(@RequestParam(required = false) LoanStatus status) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        return loanService.listByStatus(status).stream()</code> - Returns a value/reference to the caller and ends this execution path.
40. <code>                .map(loan -&gt; LoanResponse.from(loan, loanService.installments(loan.getId())))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @PostMapping(&quot;/{loanId}/approve&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
45. <code>    @Operation(summary = &quot;Approve a loan: generate the schedule and disburse the principal&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
46. <code>    public LoanDetailResponse approve(@PathVariable UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        Loan loan = loanService.approve(loanId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
48. <code>        var installments = loanService.installments(loan.getId());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>        return new LoanDetailResponse(</code> - Returns a value/reference to the caller and ends this execution path.
50. <code>                LoanResponse.from(loan, installments),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                installments.stream().map(InstallmentResponse::from).toList());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
52. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @PostMapping(&quot;/{loanId}/reject&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
55. <code>    @Operation(summary = &quot;Reject a pending loan&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
56. <code>    public LoanResponse reject(@PathVariable UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <code>        Loan loan = loanService.reject(loanId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
58. <code>        return LoanResponse.from(loan, List.of());</code> - Returns a value/reference to the caller and ends this execution path.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 32 | `public AdminLoanController(LoanService loanService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AdminLoanController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `public List&lt;LoanResponse&gt; list(@RequestParam(required = false) LoanStatus status)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 46 | `public LoanDetailResponse approve(@PathVariable UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `approve`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 56 | `public LoanResponse reject(@PathVariable UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `reject`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/loan/web/LoanController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.domain.Loan` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.InstallmentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.LoanApplicationRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.LoanDetailResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.dto.LoanResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.loan.service.LoanService` | Project-local dependency connecting this file to another banking module. |
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
package com.bank.loan.web;

import com.bank.common.SecurityUtils;
import com.bank.loan.domain.Loan;
import com.bank.loan.dto.InstallmentResponse;
import com.bank.loan.dto.LoanApplicationRequest;
import com.bank.loan.dto.LoanDetailResponse;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.service.LoanService;
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
@RequestMapping("/api/v1/loans")
@Tag(name = "Loans", description = "Loan applications, schedules, and repayments")
@SecurityRequirement(name = "bearerAuth")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @Operation(summary = "Apply for a loan (requires verified KYC)")
    public ResponseEntity<LoanResponse> apply(@Valid @RequestBody LoanApplicationRequest request) {
        Loan loan = loanService.apply(SecurityUtils.currentUserId(),
                request.accountId(), request.principal(), request.termMonths());
        return ResponseEntity.status(HttpStatus.CREATED).body(LoanResponse.from(loan, List.of()));
    }

    @GetMapping
    @Operation(summary = "List my loans")
    public List<LoanResponse> list() {
        UUID userId = SecurityUtils.currentUserId();
        return loanService.list(userId).stream()
                .map(loan -> LoanResponse.from(loan, loanService.installments(loan.getId())))
                .toList();
    }

    @GetMapping("/{loanId}")
    @Operation(summary = "Get a loan with its amortization schedule")
    public LoanDetailResponse get(@PathVariable UUID loanId) {
        Loan loan = loanService.get(SecurityUtils.currentUserId(), loanId);
        return detail(loan);
    }

    @PostMapping("/{loanId}/repay")
    @Operation(summary = "Pay the next outstanding installment")
    public LoanDetailResponse repay(@PathVariable UUID loanId) {
        Loan loan = loanService.repayNext(SecurityUtils.currentUserId(), loanId);
        return detail(loan);
    }

    private LoanDetailResponse detail(Loan loan) {
        var installments = loanService.installments(loan.getId());
        return new LoanDetailResponse(
                LoanResponse.from(loan, installments),
                installments.stream().map(InstallmentResponse::from).toList());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.loan.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.loan.domain.Loan;</code> - Imports `com.bank.loan.domain.Loan` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.loan.dto.InstallmentResponse;</code> - Imports `com.bank.loan.dto.InstallmentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.loan.dto.LoanApplicationRequest;</code> - Imports `com.bank.loan.dto.LoanApplicationRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.loan.dto.LoanDetailResponse;</code> - Imports `com.bank.loan.dto.LoanDetailResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.loan.dto.LoanResponse;</code> - Imports `com.bank.loan.dto.LoanResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.loan.service.LoanService;</code> - Imports `com.bank.loan.service.LoanService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
24. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
27. <code>@RequestMapping(&quot;/api/v1/loans&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
28. <code>@Tag(name = &quot;Loans&quot;, description = &quot;Loan applications, schedules, and repayments&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
29. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>public class LoanController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    private final LoanService loanService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    public LoanController(LoanService loanService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        this.loanService = loanService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @PostMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
39. <code>    @Operation(summary = &quot;Apply for a loan (requires verified KYC)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
40. <code>    public ResponseEntity&lt;LoanResponse&gt; apply(@Valid @RequestBody LoanApplicationRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>        Loan loan = loanService.apply(SecurityUtils.currentUserId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                request.accountId(), request.principal(), request.termMonths());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
43. <code>        return ResponseEntity.status(HttpStatus.CREATED).body(LoanResponse.from(loan, List.of()));</code> - Returns a value/reference to the caller and ends this execution path.
44. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
47. <code>    @Operation(summary = &quot;List my loans&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
48. <code>    public List&lt;LoanResponse&gt; list() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <code>        UUID userId = SecurityUtils.currentUserId();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
50. <code>        return loanService.list(userId).stream()</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>                .map(loan -&gt; LoanResponse.from(loan, loanService.installments(loan.getId())))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
53. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
55. <code>    @GetMapping(&quot;/{loanId}&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
56. <code>    @Operation(summary = &quot;Get a loan with its amortization schedule&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    public LoanDetailResponse get(@PathVariable UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        Loan loan = loanService.get(SecurityUtils.currentUserId(), loanId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
59. <code>        return detail(loan);</code> - Returns a value/reference to the caller and ends this execution path.
60. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
61. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
62. <code>    @PostMapping(&quot;/{loanId}/repay&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
63. <code>    @Operation(summary = &quot;Pay the next outstanding installment&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
64. <code>    public LoanDetailResponse repay(@PathVariable UUID loanId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>        Loan loan = loanService.repayNext(SecurityUtils.currentUserId(), loanId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
66. <code>        return detail(loan);</code> - Returns a value/reference to the caller and ends this execution path.
67. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
69. <code>    private LoanDetailResponse detail(Loan loan) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>        var installments = loanService.installments(loan.getId());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
71. <code>        return new LoanDetailResponse(</code> - Returns a value/reference to the caller and ends this execution path.
72. <code>                LoanResponse.from(loan, installments),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
73. <code>                installments.stream().map(InstallmentResponse::from).toList());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 34 | `public LoanController(LoanService loanService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `LoanController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 40 | `public ResponseEntity&lt;LoanResponse&gt; apply(@Valid @RequestBody LoanApplicationRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `apply`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 48 | `public List&lt;LoanResponse&gt; list()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 57 | `public LoanDetailResponse get(@PathVariable UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `get`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 64 | `public LoanDetailResponse repay(@PathVariable UUID loanId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `repay`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 69 | `private LoanDetailResponse detail(Loan loan)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `detail`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/payment/domain/Payment.java`

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
package com.bank.payment.domain;

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

/** A top-up payment (external money into an account) via a payment gateway. */
@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_ref", nullable = false, unique = true)
    private String providerRef;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public Payment(UUID userId, UUID accountId, BigDecimal amount, String currency,
                   String provider, String providerRef) {
        this.userId = userId;
        this.accountId = accountId;
        this.amount = amount;
        this.currency = currency;
        this.provider = provider;
        this.providerRef = providerRef;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
22. <code>/** A top-up payment (external money into an account) via a payment gateway. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
24. <code>@Table(name = &quot;payments&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
25. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>public class Payment {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
31. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
32. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    @Column(name = &quot;user_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
35. <code>    private UUID userId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @Column(name = &quot;account_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
38. <code>    private UUID accountId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @Column(nullable = false, precision = 19, scale = 4)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
41. <code>    private BigDecimal amount;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Column(nullable = false, length = 3)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
44. <code>    private String currency = &quot;USD&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
47. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private PaymentStatus status = PaymentStatus.PENDING;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
51. <code>    private String provider;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @Column(name = &quot;provider_ref&quot;, nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
54. <code>    private String providerRef;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
58. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
59. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
60. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
61. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
62. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
63. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
64. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
65. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
66. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
67. <code>    public Payment(UUID userId, UUID accountId, BigDecimal amount, String currency,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
68. <code>                   String provider, String providerRef) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <code>        this.userId = userId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
70. <code>        this.accountId = accountId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
71. <code>        this.amount = amount;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
72. <code>        this.currency = currency;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <code>        this.provider = provider;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
74. <code>        this.providerRef = providerRef;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
75. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/payment/domain/PaymentStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.payment.domain;

public enum PaymentStatus {
    PENDING,
    SUCCEEDED,
    FAILED
}
````

### Code Walkthrough
1. <code>package com.bank.payment.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>public enum PaymentStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
4. <code>    PENDING,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
5. <code>    SUCCEEDED,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
6. <code>    FAILED</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/payment/dto/PaymentResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.payment.domain.Payment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.domain.PaymentStatus` | Project-local dependency connecting this file to another banking module. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.dto;

import com.bank.payment.domain.Payment;
import com.bank.payment.domain.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        UUID accountId,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        String provider,
        Instant createdAt
) {
    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(p.getId(), p.getAccountId(), p.getAmount(), p.getCurrency(),
                p.getStatus(), p.getProvider(), p.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.payment.domain.Payment;</code> - Imports `com.bank.payment.domain.Payment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.payment.domain.PaymentStatus;</code> - Imports `com.bank.payment.domain.PaymentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public record PaymentResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
11. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        UUID accountId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        BigDecimal amount,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String currency,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        PaymentStatus status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        String provider,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
19. <code>    public static PaymentResponse from(Payment p) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <code>        return new PaymentResponse(p.getId(), p.getAccountId(), p.getAmount(), p.getCurrency(),</code> - Returns a value/reference to the caller and ends this execution path.
21. <code>                p.getStatus(), p.getProvider(), p.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
22. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 19 | `public static PaymentResponse from(Payment p)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/payment/dto/TopUpRequest.java`

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
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record TopUpRequest(
        @NotNull UUID accountId,
        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount
) {
}
````

### Code Walkthrough
1. <code>package com.bank.payment.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Digits;</code> - Imports `jakarta.validation.constraints.Digits` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.Positive;</code> - Imports `jakarta.validation.constraints.Positive` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public record TopUpRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
11. <code>        @NotNull UUID accountId,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
12. <code>        @NotNull @Positive @Digits(integer = 15, fraction = 2) BigDecimal amount</code> - Bean Validation annotation. Spring validates request data before business logic runs.
13. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/payment/dto/TopUpResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.dto;

import java.util.UUID;

/**
 * Created top-up. {@code clientSecret} is for Stripe.js (real mode); when
 * {@code manualConfirm} is true (simulated mode) the client calls /confirm instead.
 */
public record TopUpResponse(
        UUID paymentId,
        String provider,
        String providerRef,
        String clientSecret,
        String status,
        boolean manualConfirm
) {
}
````

### Code Walkthrough
1. <code>package com.bank.payment.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> * Created top-up. {@code clientSecret} is for Stripe.js (real mode); when</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code> * {@code manualConfirm} is true (simulated mode) the client calls /confirm instead.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code>public record TopUpResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
10. <code>        UUID paymentId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        String provider,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        String providerRef,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String clientSecret,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        boolean manualConfirm</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/payment/gateway/PaymentGateway.java`

### File Purpose
A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.gateway;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Abstraction over a payment processor. Two implementations exist: a deterministic
 * {@link SimulatedPaymentGateway} (default, no secrets) and {@link StripePaymentGateway}
 * (active when a Stripe secret key is configured).
 */
public interface PaymentGateway {

    /** A created payment intent: a provider reference, a client secret, and a status. */
    record PaymentIntent(String providerRef, String clientSecret, String status) {
    }

    /** Result of parsing a provider webhook. */
    record WebhookEvent(String providerRef, boolean succeeded) {
    }

    /** Provider name stored on the Payment record (e.g. "SIMULATED", "STRIPE"). */
    String name();

    /** True when this gateway settles synchronously and exposes a manual confirm step. */
    boolean supportsManualConfirm();

    PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata);

    /** Parses and verifies a provider webhook payload; empty if not a fulfilment event. */
    Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader);
}
````

### Code Walkthrough
1. <code>package com.bank.payment.gateway;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * Abstraction over a payment processor. Two implementations exist: a deterministic</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * {@link SimulatedPaymentGateway} (default, no secrets) and {@link StripePaymentGateway}</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * (active when a Stripe secret key is configured).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>public interface PaymentGateway {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    /** A created payment intent: a provider reference, a client secret, and a status. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>    record PaymentIntent(String providerRef, String clientSecret, String status) {</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
16. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    /** Result of parsing a provider webhook. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>    record WebhookEvent(String providerRef, boolean succeeded) {</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
20. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    /** Provider name stored on the Payment record (e.g. &quot;SIMULATED&quot;, &quot;STRIPE&quot;). */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code>    String name();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    /** True when this gateway settles synchronously and exposes a manual confirm step. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code>    boolean supportsManualConfirm();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    PaymentIntent createIntent(BigDecimal amount, String currency, Map&lt;String, String&gt; metadata);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    /** Parses and verifies a provider webhook payload; empty if not a fulfilment event. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
31. <code>    Optional&lt;WebhookEvent&gt; parseWebhook(String payload, String signatureHeader);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
32. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/payment/gateway/PaymentGatewayConfig.java`

### File Purpose
A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Bean` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Configuration` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.payment.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Selects the payment gateway at startup: real Stripe when a secret key is
 * configured, otherwise the simulated gateway. This keeps the app (and tests)
 * runnable with zero secrets while supporting a real integration when desired.
 */
@Configuration
public class PaymentGatewayConfig {

    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayConfig.class);

    @Bean
    public PaymentGateway paymentGateway(
            @Value("${app.stripe.secret-key:}") String secretKey,
            @Value("${app.stripe.webhook-secret:}") String webhookSecret) {
        if (secretKey != null && !secretKey.isBlank()) {
            log.info("Payment gateway: STRIPE (secret key configured)");
            return new StripePaymentGateway(secretKey, webhookSecret);
        }
        log.info("Payment gateway: SIMULATED (no Stripe secret key configured)");
        return new SimulatedPaymentGateway();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.gateway;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.context.annotation.Bean;</code> - Imports `org.springframework.context.annotation.Bean` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.context.annotation.Configuration;</code> - Imports `org.springframework.context.annotation.Configuration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * Selects the payment gateway at startup: real Stripe when a secret key is</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> * configured, otherwise the simulated gateway. This keeps the app (and tests)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * runnable with zero secrets while supporting a real integration when desired.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code>@Configuration</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
15. <code>public class PaymentGatewayConfig {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayConfig.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
20. <code>    public PaymentGateway paymentGateway(</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
21. <code>            @Value(&quot;${app.stripe.secret-key:}&quot;) String secretKey,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>            @Value(&quot;${app.stripe.webhook-secret:}&quot;) String webhookSecret) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>        if (secretKey != null &amp;&amp; !secretKey.isBlank()) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <code>            log.info(&quot;Payment gateway: STRIPE (secret key configured)&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
25. <code>            return new StripePaymentGateway(secretKey, webhookSecret);</code> - Returns a value/reference to the caller and ends this execution path.
26. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
27. <code>        log.info(&quot;Payment gateway: SIMULATED (no Stripe secret key configured)&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
28. <code>        return new SimulatedPaymentGateway();</code> - Returns a value/reference to the caller and ends this execution path.
29. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/payment/gateway/SimulatedPaymentGateway.java`

### File Purpose
A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.gateway;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Default, network-free gateway used in tests/CI and whenever no Stripe key is set.
 * Intents are created PENDING and settled via the manual confirm endpoint.
 */
public class SimulatedPaymentGateway implements PaymentGateway {

    @Override
    public String name() {
        return "SIMULATED";
    }

    @Override
    public boolean supportsManualConfirm() {
        return true;
    }

    @Override
    public PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata) {
        String ref = "sim_pi_" + UUID.randomUUID().toString().replace("-", "");
        return new PaymentIntent(ref, ref + "_secret", "requires_confirmation");
    }

    @Override
    public Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader) {
        // The simulated gateway has no webhooks; settlement happens via /confirm.
        return Optional.empty();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.gateway;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * Default, network-free gateway used in tests/CI and whenever no Stripe key is set.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * Intents are created PENDING and settled via the manual confirm endpoint.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>public class SimulatedPaymentGateway implements PaymentGateway {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
15. <code>    public String name() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
16. <code>        return &quot;SIMULATED&quot;;</code> - Returns a value/reference to the caller and ends this execution path.
17. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>    public boolean supportsManualConfirm() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>        return true;</code> - Returns a value/reference to the caller and ends this execution path.
22. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>    public PaymentIntent createIntent(BigDecimal amount, String currency, Map&lt;String, String&gt; metadata) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        String ref = &quot;sim_pi_&quot; + UUID.randomUUID().toString().replace(&quot;-&quot;, &quot;&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>        return new PaymentIntent(ref, ref + &quot;_secret&quot;, &quot;requires_confirmation&quot;);</code> - Returns a value/reference to the caller and ends this execution path.
28. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    public Optional&lt;WebhookEvent&gt; parseWebhook(String payload, String signatureHeader) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        // The simulated gateway has no webhooks; settlement happens via /confirm.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
33. <code>        return Optional.empty();</code> - Returns a value/reference to the caller and ends this execution path.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 15 | `public String name()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `name`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 20 | `public boolean supportsManualConfirm()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `supportsManualConfirm`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 25 | `public PaymentIntent createIntent(BigDecimal amount, String currency, Map&lt;String, String&gt; metadata)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `createIntent`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 31 | `public Optional&lt;WebhookEvent&gt; parseWebhook(String payload, String signatureHeader)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `parseWebhook`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/payment/gateway/StripePaymentGateway.java`

### File Purpose
A payment gateway abstraction or implementation: it isolates provider-specific payment behavior behind an interface.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.stripe.Stripe` | Stripe Java SDK dependency used for test-mode payment intents and webhook handling. |
| `com.stripe.exception.StripeException` | Stripe Java SDK dependency used for test-mode payment intents and webhook handling. |
| `com.stripe.model.Event` | Stripe Java SDK dependency used for test-mode payment intents and webhook handling. |
| `com.stripe.net.Webhook` | Stripe Java SDK dependency used for test-mode payment intents and webhook handling. |
| `com.stripe.param.PaymentIntentCreateParams` | Stripe Java SDK dependency used for test-mode payment intents and webhook handling. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.gateway;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Real Stripe integration (test mode). Created only when a Stripe secret key is
 * configured (see PaymentGatewayConfig). Top-ups become Stripe PaymentIntents and
 * are fulfilled when the {@code payment_intent.succeeded} webhook arrives.
 */
public class StripePaymentGateway implements PaymentGateway {

    private final String webhookSecret;

    public StripePaymentGateway(String secretKey, String webhookSecret) {
        Stripe.apiKey = secretKey;
        this.webhookSecret = webhookSecret;
    }

    @Override
    public String name() {
        return "STRIPE";
    }

    @Override
    public boolean supportsManualConfirm() {
        return false;
    }

    @Override
    public PaymentIntent createIntent(BigDecimal amount, String currency, Map<String, String> metadata) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.movePointRight(2).longValueExact()) // smallest currency unit
                    .setCurrency(currency.toLowerCase())
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();
            com.stripe.model.PaymentIntent intent = com.stripe.model.PaymentIntent.create(params);
            return new PaymentIntent(intent.getId(), intent.getClientSecret(), intent.getStatus());
        } catch (StripeException e) {
            throw new IllegalStateException("Stripe payment intent creation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<WebhookEvent> parseWebhook(String payload, String signatureHeader) {
        try {
            Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
            if (!"payment_intent.succeeded".equals(event.getType())) {
                return Optional.empty();
            }
            String providerRef = event.getDataObjectDeserializer().getObject()
                    .map(o -> ((com.stripe.model.PaymentIntent) o).getId())
                    .orElse(null);
            if (providerRef == null) {
                return Optional.empty();
            }
            return Optional.of(new WebhookEvent(providerRef, true));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Stripe webhook: " + e.getMessage(), e);
        }
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.gateway;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.stripe.Stripe;</code> - Imports `com.stripe.Stripe` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.stripe.exception.StripeException;</code> - Imports `com.stripe.exception.StripeException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.stripe.model.Event;</code> - Imports `com.stripe.model.Event` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.stripe.net.Webhook;</code> - Imports `com.stripe.net.Webhook` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.stripe.param.PaymentIntentCreateParams;</code> - Imports `com.stripe.param.PaymentIntentCreateParams` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> * Real Stripe integration (test mode). Created only when a Stripe secret key is</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> * configured (see PaymentGatewayConfig). Top-ups become Stripe PaymentIntents and</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code> * are fulfilled when the {@code payment_intent.succeeded} webhook arrives.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code>public class StripePaymentGateway implements PaymentGateway {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    private final String webhookSecret;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    public StripePaymentGateway(String secretKey, String webhookSecret) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        Stripe.apiKey = secretKey;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
24. <code>        this.webhookSecret = webhookSecret;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
25. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>    public String name() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>        return &quot;STRIPE&quot;;</code> - Returns a value/reference to the caller and ends this execution path.
30. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
33. <code>    public boolean supportsManualConfirm() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        return false;</code> - Returns a value/reference to the caller and ends this execution path.
35. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    public PaymentIntent createIntent(BigDecimal amount, String currency, Map&lt;String, String&gt; metadata) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>                    .setAmount(amount.movePointRight(2).longValueExact()) // smallest currency unit</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                    .setCurrency(currency.toLowerCase())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>                    .putAllMetadata(metadata)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
44. <code>                    .setAutomaticPaymentMethods(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
45. <code>                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
46. <code>                                    .setEnabled(true)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>                                    .build())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                    .build();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
49. <code>            com.stripe.model.PaymentIntent intent = com.stripe.model.PaymentIntent.create(params);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
50. <code>            return new PaymentIntent(intent.getId(), intent.getClientSecret(), intent.getStatus());</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>        } catch (StripeException e) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <code>            throw new IllegalStateException(&quot;Stripe payment intent creation failed: &quot; + e.getMessage(), e);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
53. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    public Optional&lt;WebhookEvent&gt; parseWebhook(String payload, String signatureHeader) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>            Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>            if (!&quot;payment_intent.succeeded&quot;.equals(event.getType())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
61. <code>                return Optional.empty();</code> - Returns a value/reference to the caller and ends this execution path.
62. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <code>            String providerRef = event.getDataObjectDeserializer().getObject()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
64. <code>                    .map(o -&gt; ((com.stripe.model.PaymentIntent) o).getId())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
65. <code>                    .orElse(null);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
66. <code>            if (providerRef == null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>                return Optional.empty();</code> - Returns a value/reference to the caller and ends this execution path.
68. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <code>            return Optional.of(new WebhookEvent(providerRef, true));</code> - Returns a value/reference to the caller and ends this execution path.
70. <code>        } catch (Exception e) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>            throw new IllegalArgumentException(&quot;Invalid Stripe webhook: &quot; + e.getMessage(), e);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
72. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
73. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 22 | `public StripePaymentGateway(String secretKey, String webhookSecret)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `StripePaymentGateway`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 28 | `public String name()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `name`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 33 | `public boolean supportsManualConfirm()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `supportsManualConfirm`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `public PaymentIntent createIntent(BigDecimal amount, String currency, Map&lt;String, String&gt; metadata)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `createIntent`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 57 | `public Optional&lt;WebhookEvent&gt; parseWebhook(String payload, String signatureHeader)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `parseWebhook`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/payment/repo/PaymentRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.payment.domain.Payment` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.repo;

import com.bank.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByIdAndUserId(UUID id, UUID userId);

    Optional<Payment> findByProviderRef(String providerRef);
}
````

### Code Walkthrough
1. <code>package com.bank.payment.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.payment.domain.Payment;</code> - Imports `com.bank.payment.domain.Payment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public interface PaymentRepository extends JpaRepository&lt;Payment, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    Optional&lt;Payment&gt; findByIdAndUserId(UUID id, UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>    Optional&lt;Payment&gt; findByProviderRef(String providerRef);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
14. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/payment/service/PaymentService.java`

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
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.domain.TransactionType` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.LedgerService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.ledger.service.PostingLine` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.domain.Payment` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.domain.PaymentStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.dto.PaymentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.dto.TopUpResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.gateway.PaymentGateway` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.repo.PaymentRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.math.BigDecimal` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.service;

import com.bank.account.domain.Account;
import com.bank.account.domain.AccountType;
import com.bank.account.repo.AccountRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.ledger.domain.TransactionType;
import com.bank.ledger.service.LedgerService;
import com.bank.ledger.service.PostingLine;
import com.bank.payment.domain.Payment;
import com.bank.payment.domain.PaymentStatus;
import com.bank.payment.dto.PaymentResponse;
import com.bank.payment.dto.TopUpResponse;
import com.bank.payment.gateway.PaymentGateway;
import com.bank.payment.repo.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    private final PaymentGateway gateway;

    public PaymentService(PaymentRepository paymentRepository,
                          AccountRepository accountRepository,
                          LedgerService ledgerService,
                          PaymentGateway gateway) {
        this.paymentRepository = paymentRepository;
        this.accountRepository = accountRepository;
        this.ledgerService = ledgerService;
        this.gateway = gateway;
    }

    @Transactional
    public TopUpResponse createTopUp(UUID userId, UUID accountId, BigDecimal amount) {
        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        PaymentGateway.PaymentIntent intent = gateway.createIntent(amount, account.getCurrency(),
                Map.of("accountId", accountId.toString(), "userId", userId.toString()));

        Payment payment = paymentRepository.save(new Payment(
                userId, accountId, amount, account.getCurrency(), gateway.name(), intent.providerRef()));

        return new TopUpResponse(payment.getId(), gateway.name(), intent.providerRef(),
                intent.clientSecret(), intent.status(), gateway.supportsManualConfirm());
    }

    /** Manual confirmation path for the simulated gateway. */
    @Transactional
    public PaymentResponse confirm(UUID userId, UUID paymentId) {
        if (!gateway.supportsManualConfirm()) {
            throw new IllegalArgumentException("This gateway settles via webhook, not manual confirm");
        }
        Payment payment = paymentRepository.findByIdAndUserId(paymentId, userId)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        fulfill(payment.getProviderRef());
        return PaymentResponse.from(paymentRepository.findById(paymentId).orElseThrow());
    }

    /**
     * Credits the account for a succeeded payment. Idempotent: guarded by the payment
     * status and by using the provider reference as the ledger idempotency key, so a
     * duplicated webhook (or confirm) never double-credits.
     */
    @Transactional
    public void fulfill(String providerRef) {
        Payment payment = paymentRepository.findByProviderRef(providerRef)
                .orElseThrow(() -> new NotFoundException("Payment not found: " + providerRef));
        if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
            return;
        }
        Account system = accountRepository
                .findFirstByTypeAndCurrency(AccountType.SYSTEM, payment.getCurrency())
                .orElseThrow(() -> new NotFoundException("System account not configured"));

        ledgerService.post(TransactionType.TOP_UP, "Top-up " + providerRef, providerRef, java.util.List.of(
                PostingLine.credit(payment.getAccountId(), payment.getAmount()),
                PostingLine.debit(system.getId(), payment.getAmount())));

        payment.setStatus(PaymentStatus.SUCCEEDED);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.account.domain.Account;</code> - Imports `com.bank.account.domain.Account` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.account.domain.AccountType;</code> - Imports `com.bank.account.domain.AccountType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.account.repo.AccountRepository;</code> - Imports `com.bank.account.repo.AccountRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.ledger.domain.TransactionType;</code> - Imports `com.bank.ledger.domain.TransactionType` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.ledger.service.LedgerService;</code> - Imports `com.bank.ledger.service.LedgerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.ledger.service.PostingLine;</code> - Imports `com.bank.ledger.service.PostingLine` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.payment.domain.Payment;</code> - Imports `com.bank.payment.domain.Payment` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.payment.domain.PaymentStatus;</code> - Imports `com.bank.payment.domain.PaymentStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.payment.dto.PaymentResponse;</code> - Imports `com.bank.payment.dto.PaymentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import com.bank.payment.dto.TopUpResponse;</code> - Imports `com.bank.payment.dto.TopUpResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import com.bank.payment.gateway.PaymentGateway;</code> - Imports `com.bank.payment.gateway.PaymentGateway` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import com.bank.payment.repo.PaymentRepository;</code> - Imports `com.bank.payment.repo.PaymentRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>import java.math.BigDecimal;</code> - Imports `java.math.BigDecimal` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
24. <code>public class PaymentService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    private final PaymentRepository paymentRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
27. <code>    private final AccountRepository accountRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
28. <code>    private final LedgerService ledgerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
29. <code>    private final PaymentGateway gateway;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    public PaymentService(PaymentRepository paymentRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
32. <code>                          AccountRepository accountRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                          LedgerService ledgerService,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                          PaymentGateway gateway) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        this.paymentRepository = paymentRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>        this.accountRepository = accountRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
37. <code>        this.ledgerService = ledgerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
38. <code>        this.gateway = gateway;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
42. <code>    public TopUpResponse createTopUp(UUID userId, UUID accountId, BigDecimal amount) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>        Account account = accountRepository.findByIdAndOwnerUserId(accountId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
44. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Account not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>        PaymentGateway.PaymentIntent intent = gateway.createIntent(amount, account.getCurrency(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>                Map.of(&quot;accountId&quot;, accountId.toString(), &quot;userId&quot;, userId.toString()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>        Payment payment = paymentRepository.save(new Payment(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                userId, accountId, amount, account.getCurrency(), gateway.name(), intent.providerRef()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>        return new TopUpResponse(payment.getId(), gateway.name(), intent.providerRef(),</code> - Returns a value/reference to the caller and ends this execution path.
53. <code>                intent.clientSecret(), intent.status(), gateway.supportsManualConfirm());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
54. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    /** Manual confirmation path for the simulated gateway. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
57. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
58. <code>    public PaymentResponse confirm(UUID userId, UUID paymentId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>        if (!gateway.supportsManualConfirm()) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>            throw new IllegalArgumentException(&quot;This gateway settles via webhook, not manual confirm&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
61. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <code>        Payment payment = paymentRepository.findByIdAndUserId(paymentId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
63. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Payment not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>        fulfill(payment.getProviderRef());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
65. <code>        return PaymentResponse.from(paymentRepository.findById(paymentId).orElseThrow());</code> - Returns a value/reference to the caller and ends this execution path.
66. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
68. <code>    /**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
69. <code>     * Credits the account for a succeeded payment. Idempotent: guarded by the payment</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
70. <code>     * status and by using the provider reference as the ledger idempotency key, so a</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
71. <code>     * duplicated webhook (or confirm) never double-credits.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
72. <code>     */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
73. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
74. <code>    public void fulfill(String providerRef) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>        Payment payment = paymentRepository.findByProviderRef(providerRef)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
76. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Payment not found: &quot; + providerRef));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
77. <code>        if (payment.getStatus() == PaymentStatus.SUCCEEDED) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
78. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <code>        Account system = accountRepository</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
81. <code>                .findFirstByTypeAndCurrency(AccountType.SYSTEM, payment.getCurrency())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
82. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;System account not configured&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>        ledgerService.post(TransactionType.TOP_UP, &quot;Top-up &quot; + providerRef, providerRef, java.util.List.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
85. <code>                PostingLine.credit(payment.getAccountId(), payment.getAmount()),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
86. <code>                PostingLine.debit(system.getId(), payment.getAmount())));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
87. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
88. <code>        payment.setStatus(PaymentStatus.SUCCEEDED);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
89. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
90. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 42 | `public TopUpResponse createTopUp(UUID userId, UUID accountId, BigDecimal amount)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `createTopUp`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 58 | `public PaymentResponse confirm(UUID userId, UUID paymentId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `confirm`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 74 | `public void fulfill(String providerRef)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `fulfill`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/payment/web/PaymentController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.dto.PaymentResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.dto.TopUpRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.dto.TopUpResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.gateway.PaymentGateway` | Project-local dependency connecting this file to another banking module. |
| `com.bank.payment.service.PaymentService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PathVariable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestHeader` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.payment.web;

import com.bank.common.SecurityUtils;
import com.bank.payment.dto.PaymentResponse;
import com.bank.payment.dto.TopUpRequest;
import com.bank.payment.dto.TopUpResponse;
import com.bank.payment.gateway.PaymentGateway;
import com.bank.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments", description = "Account top-ups via a payment gateway (Stripe or simulated)")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentGateway gateway;

    public PaymentController(PaymentService paymentService, PaymentGateway gateway) {
        this.paymentService = paymentService;
        this.gateway = gateway;
    }

    @PostMapping("/top-up")
    @Operation(summary = "Start a top-up (returns a client secret or a manual-confirm flag)")
    @SecurityRequirement(name = "bearerAuth")
    public TopUpResponse topUp(@Valid @RequestBody TopUpRequest request) {
        return paymentService.createTopUp(SecurityUtils.currentUserId(), request.accountId(), request.amount());
    }

    @PostMapping("/{paymentId}/confirm")
    @Operation(summary = "Confirm a top-up (simulated gateway only)")
    @SecurityRequirement(name = "bearerAuth")
    public PaymentResponse confirm(@PathVariable UUID paymentId) {
        return paymentService.confirm(SecurityUtils.currentUserId(), paymentId);
    }

    @PostMapping("/webhook")
    @Operation(summary = "Payment provider webhook (Stripe-signed; public)")
    public ResponseEntity<Void> webhook(@RequestBody String payload,
                                        @RequestHeader(value = "Stripe-Signature", required = false)
                                        String signature) {
        gateway.parseWebhook(payload, signature)
                .filter(PaymentGateway.WebhookEvent::succeeded)
                .ifPresent(event -> paymentService.fulfill(event.providerRef()));
        return ResponseEntity.ok().build();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.payment.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.payment.dto.PaymentResponse;</code> - Imports `com.bank.payment.dto.PaymentResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.payment.dto.TopUpRequest;</code> - Imports `com.bank.payment.dto.TopUpRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.payment.dto.TopUpResponse;</code> - Imports `com.bank.payment.dto.TopUpResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.payment.gateway.PaymentGateway;</code> - Imports `com.bank.payment.gateway.PaymentGateway` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.payment.service.PaymentService;</code> - Imports `com.bank.payment.service.PaymentService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.web.bind.annotation.RequestHeader;</code> - Imports `org.springframework.web.bind.annotation.RequestHeader` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
24. <code>@RequestMapping(&quot;/api/v1/payments&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
25. <code>@Tag(name = &quot;Payments&quot;, description = &quot;Account top-ups via a payment gateway (Stripe or simulated)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>public class PaymentController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    private final PaymentService paymentService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
29. <code>    private final PaymentGateway gateway;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    public PaymentController(PaymentService paymentService, PaymentGateway gateway) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        this.paymentService = paymentService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
33. <code>        this.gateway = gateway;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @PostMapping(&quot;/top-up&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
37. <code>    @Operation(summary = &quot;Start a top-up (returns a client secret or a manual-confirm flag)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    @SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    public TopUpResponse topUp(@Valid @RequestBody TopUpRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        return paymentService.createTopUp(SecurityUtils.currentUserId(), request.accountId(), request.amount());</code> - Returns a value/reference to the caller and ends this execution path.
41. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @PostMapping(&quot;/{paymentId}/confirm&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
44. <code>    @Operation(summary = &quot;Confirm a top-up (simulated gateway only)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
45. <code>    @SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
46. <code>    public PaymentResponse confirm(@PathVariable UUID paymentId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        return paymentService.confirm(SecurityUtils.currentUserId(), paymentId);</code> - Returns a value/reference to the caller and ends this execution path.
48. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    @PostMapping(&quot;/webhook&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
51. <code>    @Operation(summary = &quot;Payment provider webhook (Stripe-signed; public)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
52. <code>    public ResponseEntity&lt;Void&gt; webhook(@RequestBody String payload,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
53. <code>                                        @RequestHeader(value = &quot;Stripe-Signature&quot;, required = false)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
54. <code>                                        String signature) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        gateway.parseWebhook(payload, signature)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
56. <code>                .filter(PaymentGateway.WebhookEvent::succeeded)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                .ifPresent(event -&gt; paymentService.fulfill(event.providerRef()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
58. <code>        return ResponseEntity.ok().build();</code> - Returns a value/reference to the caller and ends this execution path.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 31 | `public PaymentController(PaymentService paymentService, PaymentGateway gateway)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `PaymentController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |
| 39 | `public TopUpResponse topUp(@Valid @RequestBody TopUpRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `topUp`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 46 | `public PaymentResponse confirm(@PathVariable UUID paymentId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `confirm`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

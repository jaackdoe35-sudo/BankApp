# Appendix A: Backend Auth, Customer, Admin, Common, and Application Files

This appendix covers backend foundation files: startup, shared infrastructure, security/authentication, customer profile/KYC, admin APIs, events, and package-level documentation.

> Reading note: each section includes the file purpose, import/dependency role, complete source listing where the file is textual, and a line-by-line walkthrough. Generated dependency/build directories are excluded from this book.

## `backend/src/main/java/com/bank/BankingBackendApplication.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.springframework.boot.SpringApplication` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.autoconfigure.SpringBootApplication` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.scheduling.annotation.EnableScheduling` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BankingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingBackendApplication.class, args);
	}

}
````

### Code Walkthrough
1. <code>package com.bank;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.springframework.boot.SpringApplication;</code> - Imports `org.springframework.boot.SpringApplication` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.boot.autoconfigure.SpringBootApplication;</code> - Imports `org.springframework.boot.autoconfigure.SpringBootApplication` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.scheduling.annotation.EnableScheduling;</code> - Imports `org.springframework.scheduling.annotation.EnableScheduling` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>@SpringBootApplication</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
8. <code>@EnableScheduling</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
9. <code>public class BankingBackendApplication {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>	public static void main(String[] args) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
12. <code>		SpringApplication.run(BankingBackendApplication.class, args);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <code>	}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 11 | `public static void main(String[] args)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `main`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/admin/dto/VerifyKycRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.customer.domain.KycStatus` | Project-local dependency connecting this file to another banking module. |
| `jakarta.validation.constraints.NotNull` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.admin.dto;

import com.bank.customer.domain.KycStatus;
import jakarta.validation.constraints.NotNull;

public record VerifyKycRequest(
        @NotNull KycStatus status
) {
}
````

### Code Walkthrough
1. <code>package com.bank.admin.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.customer.domain.KycStatus;</code> - Imports `com.bank.customer.domain.KycStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotNull;</code> - Imports `jakarta.validation.constraints.NotNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>public record VerifyKycRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
7. <code>        @NotNull KycStatus status</code> - Bean Validation annotation. Spring validates request data before business logic runs.
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

## `backend/src/main/java/com/bank/admin/package-info.java`

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
 * admin module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.admin;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * admin module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.admin;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/admin/web/AdminUserController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.admin.dto.VerifyKycRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.dto.ProfileResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.service.CustomerService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.security.access.prepost.PreAuthorize` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
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
package com.bank.admin.web;

import com.bank.admin.dto.VerifyKycRequest;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "Admin", description = "Administrative user and KYC management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final CustomerService customerService;

    public AdminUserController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "List all customer profiles")
    public List<ProfileResponse> listUsers() {
        return customerService.listAllProfiles();
    }

    @PostMapping("/{userId}/kyc")
    @Operation(summary = "Set a user's KYC status (verify/reject)")
    public ProfileResponse setKyc(@PathVariable UUID userId,
                                  @Valid @RequestBody VerifyKycRequest request) {
        return customerService.setKycStatus(userId, request.status());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.admin.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.admin.dto.VerifyKycRequest;</code> - Imports `com.bank.admin.dto.VerifyKycRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.customer.dto.ProfileResponse;</code> - Imports `com.bank.customer.dto.ProfileResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.customer.service.CustomerService;</code> - Imports `com.bank.customer.service.CustomerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.security.access.prepost.PreAuthorize;</code> - Imports `org.springframework.security.access.prepost.PreAuthorize` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
22. <code>@RequestMapping(&quot;/api/v1/admin/users&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
23. <code>@Tag(name = &quot;Admin&quot;, description = &quot;Administrative user and KYC management&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@PreAuthorize(&quot;hasRole(&#x27;ADMIN&#x27;)&quot;)</code> - Spring Security method guard. Authorization is checked before the method body runs.
26. <code>public class AdminUserController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    private final CustomerService customerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    public AdminUserController(CustomerService customerService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <code>        this.customerService = customerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
32. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
35. <code>    @Operation(summary = &quot;List all customer profiles&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
36. <code>    public List&lt;ProfileResponse&gt; listUsers() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <code>        return customerService.listAllProfiles();</code> - Returns a value/reference to the caller and ends this execution path.
38. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @PostMapping(&quot;/{userId}/kyc&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
41. <code>    @Operation(summary = &quot;Set a user&#x27;s KYC status (verify/reject)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
42. <code>    public ProfileResponse setKyc(@PathVariable UUID userId,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
43. <code>                                  @Valid @RequestBody VerifyKycRequest request) {</code> - Bean Validation annotation. Spring validates request data before business logic runs.
44. <code>        return customerService.setKycStatus(userId, request.status());</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 30 | `public AdminUserController(CustomerService customerService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AdminUserController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 36 | `public List&lt;ProfileResponse&gt; listUsers()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `listUsers`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/AdminSeeder.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.Role` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.domain.User` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.repo.UserRepository` | Project-local dependency connecting this file to another banking module. |
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.CommandLineRunner` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.crypto.password.PasswordEncoder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.auth;

import com.bank.auth.domain.Role;
import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a demo ADMIN account at startup (idempotent) so the admin endpoints can
 * be exercised immediately. Credentials are configurable via app.seed.admin-*.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.seed.admin-email:admin@bank.local}") String adminEmail,
                       @Value("${app.seed.admin-password:Admin123!}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }
        userRepository.save(new User(adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN));
        log.info("Seeded demo admin account: {}", adminEmail);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.Role;</code> - Imports `com.bank.auth.domain.Role` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.auth.domain.User;</code> - Imports `com.bank.auth.domain.User` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.auth.repo.UserRepository;</code> - Imports `com.bank.auth.repo.UserRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.boot.CommandLineRunner;</code> - Imports `org.springframework.boot.CommandLineRunner` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.security.crypto.password.PasswordEncoder;</code> - Imports `org.springframework.security.crypto.password.PasswordEncoder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> * Seeds a demo ADMIN account at startup (idempotent) so the admin endpoints can</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> * be exercised immediately. Credentials are configurable via app.seed.admin-*.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
18. <code>public class AdminSeeder implements CommandLineRunner {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    private final UserRepository userRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
23. <code>    private final PasswordEncoder passwordEncoder;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <code>    private final String adminEmail;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
25. <code>    private final String adminPassword;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    public AdminSeeder(UserRepository userRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
28. <code>                       PasswordEncoder passwordEncoder,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                       @Value(&quot;${app.seed.admin-email:admin@bank.local}&quot;) String adminEmail,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
30. <code>                       @Value(&quot;${app.seed.admin-password:Admin123!}&quot;) String adminPassword) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>        this.userRepository = userRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
32. <code>        this.passwordEncoder = passwordEncoder;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
33. <code>        this.adminEmail = adminEmail;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
34. <code>        this.adminPassword = adminPassword;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
38. <code>    public void run(String... args) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        if (userRepository.existsByEmail(adminEmail)) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <code>        userRepository.save(new User(adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
43. <code>        log.info(&quot;Seeded demo admin account: {}&quot;, adminEmail);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
44. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 38 | `public void run(String... args)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `run`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/domain/Role.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.auth.domain;

/**
 * Coarse-grained role for RBAC. Spring authorities use the "ROLE_" prefix
 * (e.g. ROLE_ADMIN); see {@code authority()}.
 */
public enum Role {
    CUSTOMER,
    ADMIN,
    SUPPORT;

    public String authority() {
        return "ROLE_" + name();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code> * Coarse-grained role for RBAC. Spring authorities use the &quot;ROLE_&quot; prefix</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code> * (e.g. ROLE_ADMIN); see {@code authority()}.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>public enum Role {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
8. <code>    CUSTOMER,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>    ADMIN,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>    SUPPORT;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    public String authority() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
13. <code>        return &quot;ROLE_&quot; + name();</code> - Returns a value/reference to the caller and ends this execution path.
14. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 12 | `public String authority()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `authority`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/domain/User.java`

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
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.domain;

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

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    @Column(nullable = false)
    private boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public User(String email, String passwordHash, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
18. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
22. <code>@Table(name = &quot;users&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
23. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>public class User {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
29. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
30. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @Column(nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
33. <code>    private String email;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    @Column(name = &quot;password_hash&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
36. <code>    private String passwordHash;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
39. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
40. <code>    private Role role = Role.CUSTOMER;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
41. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
42. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
43. <code>    private boolean enabled = true;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
46. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
47. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
48. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
49. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
50. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
51. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
54. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    public User(String email, String passwordHash, Role role) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <code>        this.email = email;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
58. <code>        this.passwordHash = passwordHash;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
59. <code>        this.role = role;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
60. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
61. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 56 | `public User(String email, String passwordHash, Role role)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `User`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/dto/AuthResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.auth.dto;

/**
 * Token bundle returned by register/login/refresh.
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds
) {
    public static AuthResponse bearer(String accessToken, String refreshToken, long expiresInSeconds) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInSeconds);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code> * Token bundle returned by register/login/refresh.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code>public record AuthResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
7. <code>        String accessToken,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
8. <code>        String refreshToken,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>        String tokenType,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>        long expiresInSeconds</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
12. <code>    public static AuthResponse bearer(String accessToken, String refreshToken, long expiresInSeconds) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
13. <code>        return new AuthResponse(accessToken, refreshToken, &quot;Bearer&quot;, expiresInSeconds);</code> - Returns a value/reference to the caller and ends this execution path.
14. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 12 | `public static AuthResponse bearer(String accessToken, String refreshToken, long expiresInSeconds)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `bearer`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/dto/LoginRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Email` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotBlank` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
````

### Code Walkthrough
1. <code>package com.bank.auth.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Email;</code> - Imports `jakarta.validation.constraints.Email` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>public record LoginRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
7. <code>        @NotBlank @Email String email,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
8. <code>        @NotBlank String password</code> - Bean Validation annotation. Spring validates request data before business logic runs.
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

## `backend/src/main/java/com/bank/auth/dto/RefreshRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.NotBlank` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank String refreshToken
) {
}
````

### Code Walkthrough
1. <code>package com.bank.auth.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>public record RefreshRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
6. <code>        @NotBlank String refreshToken</code> - Bean Validation annotation. Spring validates request data before business logic runs.
7. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/auth/dto/RegisterRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Email` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.NotBlank` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Size` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |

### Complete Source
````java
package com.bank.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName
) {
}
````

### Code Walkthrough
1. <code>package com.bank.auth.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Email;</code> - Imports `jakarta.validation.constraints.Email` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.NotBlank;</code> - Imports `jakarta.validation.constraints.NotBlank` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import jakarta.validation.constraints.Size;</code> - Imports `jakarta.validation.constraints.Size` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>public record RegisterRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
8. <code>        @NotBlank @Email String email,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
9. <code>        @NotBlank @Size(min = 8, max = 100) String password,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
10. <code>        @NotBlank @Size(max = 100) String firstName,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
11. <code>        @NotBlank @Size(max = 100) String lastName</code> - Bean Validation annotation. Spring validates request data before business logic runs.
12. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
13. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/auth/package-info.java`

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
 * auth module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.auth;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * auth module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.auth;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/auth/repo/UserRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.User` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.repo;

import com.bank.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
````

### Code Walkthrough
1. <code>package com.bank.auth.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.User;</code> - Imports `com.bank.auth.domain.User` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public interface UserRepository extends JpaRepository&lt;User, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    Optional&lt;User&gt; findByEmail(String email);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>    boolean existsByEmail(String email);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
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

## `backend/src/main/java/com/bank/auth/security/AuthUser.java`

### File Purpose
A security infrastructure file: it participates in JWT authentication, authorization, or security configuration.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.Role` | Project-local dependency connecting this file to another banking module. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.security;

import com.bank.auth.domain.Role;

import java.util.UUID;

/**
 * The authenticated principal stored in the SecurityContext, derived from a
 * verified access token. No DB lookup required per request.
 */
public record AuthUser(UUID id, String email, Role role) {
}
````

### Code Walkthrough
1. <code>package com.bank.auth.security;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.Role;</code> - Imports `com.bank.auth.domain.Role` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * The authenticated principal stored in the SecurityContext, derived from a</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * verified access token. No DB lookup required per request.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code>public record AuthUser(UUID id, String email, Role role) {</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 11 | `public record AuthUser(UUID id, String email, Role role)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AuthUser`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/security/JwtAuthenticationFilter.java`

### File Purpose
A security infrastructure file: it participates in JWT authentication, authorization, or security configuration.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.Role` | Project-local dependency connecting this file to another banking module. |
| `io.jsonwebtoken.Claims` | JJWT dependency used to create and verify JSON Web Tokens. |
| `io.jsonwebtoken.JwtException` | JJWT dependency used to create and verify JSON Web Tokens. |
| `jakarta.servlet.FilterChain` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.servlet.ServletException` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.servlet.http.HttpServletRequest` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.servlet.http.HttpServletResponse` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.lang.NonNull` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.authentication.UsernamePasswordAuthenticationToken` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.core.authority.SimpleGrantedAuthority` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.core.context.SecurityContextHolder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.web.authentication.WebAuthenticationDetailsSource` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.filter.OncePerRequestFilter` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.io.IOException` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.security;

import com.bank.auth.domain.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Reads a Bearer access token, verifies it, and populates the SecurityContext
 * with an {@link AuthUser}. Invalid tokens are ignored (request proceeds as
 * anonymous and is rejected later by authorization rules).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith(BEARER_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = header.substring(BEARER_PREFIX.length());
            try {
                Claims claims = jwtService.parse(token).getPayload();
                Role role = Role.valueOf(claims.get("role", String.class));
                AuthUser principal = new AuthUser(
                        UUID.fromString(claims.getSubject()),
                        claims.get("email", String.class),
                        role);
                var authentication = new UsernamePasswordAuthenticationToken(
                        principal, null, List.of(new SimpleGrantedAuthority(role.authority())));
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException ex) {
                // Invalid token -> leave context unauthenticated.
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.security;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.Role;</code> - Imports `com.bank.auth.domain.Role` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import io.jsonwebtoken.Claims;</code> - Imports `io.jsonwebtoken.Claims` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import io.jsonwebtoken.JwtException;</code> - Imports `io.jsonwebtoken.JwtException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import jakarta.servlet.FilterChain;</code> - Imports `jakarta.servlet.FilterChain` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.servlet.ServletException;</code> - Imports `jakarta.servlet.ServletException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import jakarta.servlet.http.HttpServletRequest;</code> - Imports `jakarta.servlet.http.HttpServletRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import jakarta.servlet.http.HttpServletResponse;</code> - Imports `jakarta.servlet.http.HttpServletResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.lang.NonNull;</code> - Imports `org.springframework.lang.NonNull` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;</code> - Imports `org.springframework.security.authentication.UsernamePasswordAuthenticationToken` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.security.core.authority.SimpleGrantedAuthority;</code> - Imports `org.springframework.security.core.authority.SimpleGrantedAuthority` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.security.core.context.SecurityContextHolder;</code> - Imports `org.springframework.security.core.context.SecurityContextHolder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;</code> - Imports `org.springframework.security.web.authentication.WebAuthenticationDetailsSource` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.filter.OncePerRequestFilter;</code> - Imports `org.springframework.web.filter.OncePerRequestFilter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.io.IOException;</code> - Imports `java.io.IOException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code> * Reads a Bearer access token, verifies it, and populates the SecurityContext</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code> * with an {@link AuthUser}. Invalid tokens are ignored (request proceeds as</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> * anonymous and is rejected later by authorization rules).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>public class JwtAuthenticationFilter extends OncePerRequestFilter {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    private static final String BEARER_PREFIX = &quot;Bearer &quot;;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    private final JwtService jwtService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    public JwtAuthenticationFilter(JwtService jwtService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        this.jwtService = jwtService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
39. <code>    protected void doFilterInternal(@NonNull HttpServletRequest request,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
40. <code>                                    @NonNull HttpServletResponse response,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
41. <code>                                    @NonNull FilterChain filterChain)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
42. <code>            throws ServletException, IOException {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>        String header = request.getHeader(&quot;Authorization&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
44. <code>        if (header != null &amp;&amp; header.startsWith(BEARER_PREFIX)</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
45. <code>                &amp;&amp; SecurityContextHolder.getContext().getAuthentication() == null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <code>            String token = header.substring(BEARER_PREFIX.length());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
47. <code>            try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <code>                Claims claims = jwtService.parse(token).getPayload();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
49. <code>                Role role = Role.valueOf(claims.get(&quot;role&quot;, String.class));</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
50. <code>                AuthUser principal = new AuthUser(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                        UUID.fromString(claims.getSubject()),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                        claims.get(&quot;email&quot;, String.class),</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
53. <code>                        role);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
54. <code>                var authentication = new UsernamePasswordAuthenticationToken(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
55. <code>                        principal, null, List.of(new SimpleGrantedAuthority(role.authority())));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
56. <code>                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
57. <code>                SecurityContextHolder.getContext().setAuthentication(authentication);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
58. <code>            } catch (JwtException | IllegalArgumentException ex) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>                // Invalid token -&gt; leave context unauthenticated.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
60. <code>                SecurityContextHolder.clearContext();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
61. <code>            }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <code>        filterChain.doFilter(request, response);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
64. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 34 | `public JwtAuthenticationFilter(JwtService jwtService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `JwtAuthenticationFilter`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/security/JwtProperties.java`

### File Purpose
A security infrastructure file: it participates in JWT authentication, authorization, or security configuration.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.springframework.boot.context.properties.ConfigurationProperties` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.time.Duration` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * Binds app.jwt.* configuration.
 */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        Duration accessTokenTtl,
        Duration refreshTokenTtl,
        String issuer
) {
}
````

### Code Walkthrough
1. <code>package com.bank.auth.security;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.springframework.boot.context.properties.ConfigurationProperties;</code> - Imports `org.springframework.boot.context.properties.ConfigurationProperties` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.time.Duration;</code> - Imports `java.time.Duration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * Binds app.jwt.* configuration.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code>@ConfigurationProperties(prefix = &quot;app.jwt&quot;)</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
11. <code>public record JwtProperties(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>        String secret,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        Duration accessTokenTtl,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        Duration refreshTokenTtl,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        String issuer</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/auth/security/JwtService.java`

### File Purpose
A security infrastructure file: it participates in JWT authentication, authorization, or security configuration.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.User` | Project-local dependency connecting this file to another banking module. |
| `io.jsonwebtoken.Claims` | JJWT dependency used to create and verify JSON Web Tokens. |
| `io.jsonwebtoken.Jws` | JJWT dependency used to create and verify JSON Web Tokens. |
| `io.jsonwebtoken.Jwts` | JJWT dependency used to create and verify JSON Web Tokens. |
| `io.jsonwebtoken.security.Keys` | JJWT dependency used to create and verify JSON Web Tokens. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `javax.crypto.SecretKey` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.nio.charset.StandardCharsets` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Date` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.security;

import com.bank.auth.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * Issues and verifies stateless HS256 access tokens. Refresh tokens are opaque
 * and managed separately by {@link com.bank.auth.service.RefreshTokenService}.
 */
@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuer(properties.issuer())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(properties.accessTokenTtl())))
                .signWith(key)
                .compact();
    }

    public long accessTokenTtlSeconds() {
        return properties.accessTokenTtl().toSeconds();
    }

    /**
     * Verifies signature, issuer, and expiry. Throws a JwtException on any problem.
     */
    public Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(properties.issuer())
                .build()
                .parseSignedClaims(token);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.security;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.User;</code> - Imports `com.bank.auth.domain.User` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import io.jsonwebtoken.Claims;</code> - Imports `io.jsonwebtoken.Claims` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import io.jsonwebtoken.Jws;</code> - Imports `io.jsonwebtoken.Jws` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import io.jsonwebtoken.Jwts;</code> - Imports `io.jsonwebtoken.Jwts` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.jsonwebtoken.security.Keys;</code> - Imports `io.jsonwebtoken.security.Keys` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>import javax.crypto.SecretKey;</code> - Imports `javax.crypto.SecretKey` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import java.nio.charset.StandardCharsets;</code> - Imports `java.nio.charset.StandardCharsets` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import java.util.Date;</code> - Imports `java.util.Date` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code> * Issues and verifies stateless HS256 access tokens. Refresh tokens are opaque</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
17. <code> * and managed separately by {@link com.bank.auth.service.RefreshTokenService}.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
19. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
20. <code>public class JwtService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    private final JwtProperties properties;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
23. <code>    private final SecretKey key;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public JwtService(JwtProperties properties) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.properties = properties;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
28. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    public String generateAccessToken(User user) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <code>        Instant now = Instant.now();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
32. <code>        return Jwts.builder()</code> - Returns a value/reference to the caller and ends this execution path.
33. <code>                .subject(user.getId().toString())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                .issuer(properties.issuer())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                .claim(&quot;email&quot;, user.getEmail())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                .claim(&quot;role&quot;, user.getRole().name())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                .issuedAt(Date.from(now))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>                .expiration(Date.from(now.plus(properties.accessTokenTtl())))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                .signWith(key)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>                .compact();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
41. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    public long accessTokenTtlSeconds() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <code>        return properties.accessTokenTtl().toSeconds();</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    /**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
48. <code>     * Verifies signature, issuer, and expiry. Throws a JwtException on any problem.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
49. <code>     */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
50. <code>    public Jws&lt;Claims&gt; parse(String token) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <code>        return Jwts.parser()</code> - Returns a value/reference to the caller and ends this execution path.
52. <code>                .verifyWith(key)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
53. <code>                .requireIssuer(properties.issuer())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
54. <code>                .build()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
55. <code>                .parseSignedClaims(token);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
56. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public JwtService(JwtProperties properties)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `JwtService`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 30 | `public String generateAccessToken(User user)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `generateAccessToken`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(k) for a fixed-size identifier/card number, so effectively O(1) in this project. |
| 43 | `public long accessTokenTtlSeconds()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `accessTokenTtlSeconds`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 50 | `public Jws&lt;Claims&gt; parse(String token)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `parse`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/service/AuthService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.Role` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.domain.User` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.AuthResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.LoginRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.RegisterRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.repo.UserRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.security.JwtService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.ConflictException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.domain.CustomerProfile` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.repo.CustomerProfileRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.security.authentication.BadCredentialsException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.crypto.password.PasswordEncoder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.service;

import com.bank.auth.domain.Role;
import com.bank.auth.domain.User;
import com.bank.auth.dto.AuthResponse;
import com.bank.auth.dto.LoginRequest;
import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.repo.UserRepository;
import com.bank.auth.security.JwtService;
import com.bank.common.exception.ConflictException;
import com.bank.customer.domain.CustomerProfile;
import com.bank.customer.repo.CustomerProfileRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       CustomerProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already registered");
        }
        User user = userRepository.save(
                new User(email, passwordEncoder.encode(request.password()), Role.CUSTOMER));
        profileRepository.save(
                new CustomerProfile(user.getId(), request.firstName(), request.lastName()));
        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(String refreshToken) {
        UUID userId = refreshTokenService.resolveUserId(refreshToken);
        if (userId == null) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
        // Rotate: the presented token is single-use.
        refreshTokenService.revoke(refreshToken);
        return issueTokens(user);
    }

    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private AuthResponse issueTokens(User user) {
        String access = jwtService.generateAccessToken(user);
        String refresh = refreshTokenService.issue(user.getId());
        return AuthResponse.bearer(access, refresh, jwtService.accessTokenTtlSeconds());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.Role;</code> - Imports `com.bank.auth.domain.Role` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.auth.domain.User;</code> - Imports `com.bank.auth.domain.User` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.auth.dto.AuthResponse;</code> - Imports `com.bank.auth.dto.AuthResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.auth.dto.LoginRequest;</code> - Imports `com.bank.auth.dto.LoginRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.auth.dto.RegisterRequest;</code> - Imports `com.bank.auth.dto.RegisterRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.auth.repo.UserRepository;</code> - Imports `com.bank.auth.repo.UserRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.auth.security.JwtService;</code> - Imports `com.bank.auth.security.JwtService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.common.exception.ConflictException;</code> - Imports `com.bank.common.exception.ConflictException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import com.bank.customer.domain.CustomerProfile;</code> - Imports `com.bank.customer.domain.CustomerProfile` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import com.bank.customer.repo.CustomerProfileRepository;</code> - Imports `com.bank.customer.repo.CustomerProfileRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.security.authentication.BadCredentialsException;</code> - Imports `org.springframework.security.authentication.BadCredentialsException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.security.crypto.password.PasswordEncoder;</code> - Imports `org.springframework.security.crypto.password.PasswordEncoder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
21. <code>public class AuthService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final UserRepository userRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <code>    private final CustomerProfileRepository profileRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
25. <code>    private final PasswordEncoder passwordEncoder;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
26. <code>    private final JwtService jwtService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
27. <code>    private final RefreshTokenService refreshTokenService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    public AuthService(UserRepository userRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
30. <code>                       CustomerProfileRepository profileRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                       PasswordEncoder passwordEncoder,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                       JwtService jwtService,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
33. <code>                       RefreshTokenService refreshTokenService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        this.userRepository = userRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
35. <code>        this.profileRepository = profileRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>        this.passwordEncoder = passwordEncoder;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
37. <code>        this.jwtService = jwtService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
38. <code>        this.refreshTokenService = refreshTokenService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
42. <code>    public AuthResponse register(RegisterRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>        String email = request.email().toLowerCase();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
44. <code>        if (userRepository.existsByEmail(email)) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>            throw new ConflictException(&quot;Email already registered&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
46. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        User user = userRepository.save(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                new User(email, passwordEncoder.encode(request.password()), Role.CUSTOMER));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
49. <code>        profileRepository.save(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                new CustomerProfile(user.getId(), request.firstName(), request.lastName()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
51. <code>        return issueTokens(user);</code> - Returns a value/reference to the caller and ends this execution path.
52. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
55. <code>    public AuthResponse login(LoginRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <code>        User user = userRepository.findByEmail(request.email().toLowerCase())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                .orElseThrow(() -&gt; new BadCredentialsException(&quot;Invalid credentials&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
58. <code>        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>            throw new BadCredentialsException(&quot;Invalid credentials&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
60. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
61. <code>        return issueTokens(user);</code> - Returns a value/reference to the caller and ends this execution path.
62. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
64. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
65. <code>    public AuthResponse refresh(String refreshToken) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
66. <code>        UUID userId = refreshTokenService.resolveUserId(refreshToken);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
67. <code>        if (userId == null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <code>            throw new BadCredentialsException(&quot;Invalid or expired refresh token&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
69. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>        User user = userRepository.findById(userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
71. <code>                .orElseThrow(() -&gt; new BadCredentialsException(&quot;Invalid refresh token&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
72. <code>        // Rotate: the presented token is single-use.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
73. <code>        refreshTokenService.revoke(refreshToken);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <code>        return issueTokens(user);</code> - Returns a value/reference to the caller and ends this execution path.
75. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
77. <code>    public void logout(String refreshToken) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
78. <code>        refreshTokenService.revoke(refreshToken);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
81. <code>    private AuthResponse issueTokens(User user) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
82. <code>        String access = jwtService.generateAccessToken(user);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
83. <code>        String refresh = refreshTokenService.issue(user.getId());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
84. <code>        return AuthResponse.bearer(access, refresh, jwtService.accessTokenTtlSeconds());</code> - Returns a value/reference to the caller and ends this execution path.
85. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
86. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 42 | `public AuthResponse register(RegisterRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `register`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 55 | `public AuthResponse login(LoginRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `login`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 65 | `public AuthResponse refresh(String refreshToken)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `refresh`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 77 | `public void logout(String refreshToken)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `logout`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 81 | `private AuthResponse issueTokens(User user)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `issueTokens`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/service/RefreshTokenService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.security.JwtProperties` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.redis.core.StringRedisTemplate` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.auth.service;

import com.bank.auth.security.JwtProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Opaque refresh tokens stored in Redis with a TTL. Each token maps to a user id.
 * Rotation deletes the presented token and issues a fresh one, so a stolen token
 * can be used at most once before becoming invalid.
 */
@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";

    private final StringRedisTemplate redis;
    private final JwtProperties properties;

    public RefreshTokenService(StringRedisTemplate redis, JwtProperties properties) {
        this.redis = redis;
        this.properties = properties;
    }

    /** Creates and stores a new refresh token for the given user. */
    public String issue(UUID userId) {
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set(key(token), userId.toString(), properties.refreshTokenTtl());
        return token;
    }

    /** Returns the user id a token belongs to, or null if unknown/expired. */
    public UUID resolveUserId(String token) {
        String value = redis.opsForValue().get(key(token));
        return value == null ? null : UUID.fromString(value);
    }

    public void revoke(String token) {
        redis.delete(key(token));
    }

    private String key(String token) {
        return KEY_PREFIX + token;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.security.JwtProperties;</code> - Imports `com.bank.auth.security.JwtProperties` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.redis.core.StringRedisTemplate;</code> - Imports `org.springframework.data.redis.core.StringRedisTemplate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * Opaque refresh tokens stored in Redis with a TTL. Each token maps to a user id.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> * Rotation deletes the presented token and issues a fresh one, so a stolen token</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * can be used at most once before becoming invalid.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
15. <code>public class RefreshTokenService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    private static final String KEY_PREFIX = &quot;refresh:&quot;;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    private final StringRedisTemplate redis;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
20. <code>    private final JwtProperties properties;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    public RefreshTokenService(StringRedisTemplate redis, JwtProperties properties) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        this.redis = redis;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
24. <code>        this.properties = properties;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
25. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    /** Creates and stores a new refresh token for the given user. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code>    public String issue(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>        String token = UUID.randomUUID().toString();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
30. <code>        redis.opsForValue().set(key(token), userId.toString(), properties.refreshTokenTtl());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
31. <code>        return token;</code> - Returns a value/reference to the caller and ends this execution path.
32. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    /** Returns the user id a token belongs to, or null if unknown/expired. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
35. <code>    public UUID resolveUserId(String token) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <code>        String value = redis.opsForValue().get(key(token));</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
37. <code>        return value == null ? null : UUID.fromString(value);</code> - Returns a value/reference to the caller and ends this execution path.
38. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    public void revoke(String token) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>        redis.delete(key(token));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    private String key(String token) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <code>        return KEY_PREFIX + token;</code> - Returns a value/reference to the caller and ends this execution path.
46. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 22 | `public RefreshTokenService(StringRedisTemplate redis, JwtProperties properties)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `RefreshTokenService`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 28 | `public String issue(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `issue`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 35 | `public UUID resolveUserId(String token)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `resolveUserId`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 40 | `public void revoke(String token)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `revoke`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 44 | `private String key(String token)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `key`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/auth/web/AuthController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.dto.AuthResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.LoginRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.RefreshRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.dto.RegisterRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.service.AuthService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.http.HttpStatus` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.auth.web;

import com.bank.auth.dto.AuthResponse;
import com.bank.auth.dto.LoginRequest;
import com.bank.auth.dto.RefreshRequest;
import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Registration, login, and token lifecycle")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and receive tokens")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange a refresh token for a new token pair (rotation)")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke a refresh token")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.auth.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.dto.AuthResponse;</code> - Imports `com.bank.auth.dto.AuthResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.auth.dto.LoginRequest;</code> - Imports `com.bank.auth.dto.LoginRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.auth.dto.RefreshRequest;</code> - Imports `com.bank.auth.dto.RefreshRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.auth.dto.RegisterRequest;</code> - Imports `com.bank.auth.dto.RegisterRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.auth.service.AuthService;</code> - Imports `com.bank.auth.service.AuthService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
19. <code>@RequestMapping(&quot;/api/v1/auth&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
20. <code>@Tag(name = &quot;Authentication&quot;, description = &quot;Registration, login, and token lifecycle&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>public class AuthController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final AuthService authService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public AuthController(AuthService authService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.authService = authService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @PostMapping(&quot;/register&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
30. <code>    @Operation(summary = &quot;Register a new customer&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    public ResponseEntity&lt;AuthResponse&gt; register(@Valid @RequestBody RegisterRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));</code> - Returns a value/reference to the caller and ends this execution path.
33. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    @PostMapping(&quot;/login&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
36. <code>    @Operation(summary = &quot;Authenticate and receive tokens&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
37. <code>    public AuthResponse login(@Valid @RequestBody LoginRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>        return authService.login(request);</code> - Returns a value/reference to the caller and ends this execution path.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @PostMapping(&quot;/refresh&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
42. <code>    @Operation(summary = &quot;Exchange a refresh token for a new token pair (rotation)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
43. <code>    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <code>        return authService.refresh(request.refreshToken());</code> - Returns a value/reference to the caller and ends this execution path.
45. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @PostMapping(&quot;/logout&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
48. <code>    @Operation(summary = &quot;Revoke a refresh token&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
49. <code>    public ResponseEntity&lt;Void&gt; logout(@Valid @RequestBody RefreshRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
50. <code>        authService.logout(request.refreshToken());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
51. <code>        return ResponseEntity.noContent().build();</code> - Returns a value/reference to the caller and ends this execution path.
52. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public AuthController(AuthService authService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AuthController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 31 | `public ResponseEntity&lt;AuthResponse&gt; register(@Valid @RequestBody RegisterRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `register`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 37 | `public AuthResponse login(@Valid @RequestBody LoginRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `login`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 43 | `public AuthResponse refresh(@Valid @RequestBody RefreshRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `refresh`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 49 | `public ResponseEntity&lt;Void&gt; logout(@Valid @RequestBody RefreshRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `logout`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/ApiError.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common;

import java.time.Instant;
import java.util.List;

/**
 * Standard error response body returned by {@link GlobalExceptionHandler}.
 */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldViolation> violations
) {
    public record FieldViolation(String field, String message) {
    }

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(Instant.now(), status, error, message, path, List.of());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code> * Standard error response body returned by {@link GlobalExceptionHandler}.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code>public record ApiError(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
10. <code>        Instant timestamp,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        int status,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        String error,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String message,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String path,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        List&lt;FieldViolation&gt; violations</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>    public record FieldViolation(String field, String message) {</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
18. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    public static ApiError of(int status, String error, String message, String path) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>        return new ApiError(Instant.now(), status, error, message, path, List.of());</code> - Returns a value/reference to the caller and ends this execution path.
22. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 17 | `public record FieldViolation(String field, String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `FieldViolation`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 20 | `public static ApiError of(int status, String error, String message, String path)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `of`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/GlobalExceptionHandler.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.exception.ConflictException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.InsufficientFundsException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.PaymentDeclinedException` | Project-local dependency connecting this file to another banking module. |
| `jakarta.servlet.http.HttpServletRequest` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.http.HttpStatus` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.access.AccessDeniedException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.authentication.BadCredentialsException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.validation.FieldError` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.MethodArgumentNotValidException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.ExceptionHandler` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestControllerAdvice` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common;

import com.bank.common.exception.ConflictException;
import com.bank.common.exception.InsufficientFundsException;
import com.bank.common.exception.NotFoundException;
import com.bank.common.exception.PaymentDeclinedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

/**
 * Translates exceptions into a consistent {@link ApiError} JSON body.
 * Module-specific handlers can be added as features land in later phases.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                      HttpServletRequest request) {
        List<ApiError.FieldViolation> violations = ex.getBindingResult().getFieldErrors().stream()
                .map(this::toViolation)
                .toList();
        ApiError body = new ApiError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Validation failed",
                request.getRequestURI(),
                violations
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex,
                                                          HttpServletRequest request) {
        ApiError body = ApiError.of(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        return status(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {
        return status(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ApiError> handleInsufficientFunds(InsufficientFundsException ex,
                                                            HttpServletRequest request) {
        return status(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);
    }

    @ExceptionHandler(PaymentDeclinedException.class)
    public ResponseEntity<ApiError> handlePaymentDeclined(PaymentDeclinedException ex,
                                                          HttpServletRequest request) {
        return status(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex,
                                                         HttpServletRequest request) {
        return status(HttpStatus.UNAUTHORIZED, "Invalid email or password", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex,
                                                       HttpServletRequest request) {
        return status(HttpStatus.FORBIDDEN, "Access denied", request);
    }

    private ResponseEntity<ApiError> status(HttpStatus status, String message, HttpServletRequest request) {
        ApiError body = ApiError.of(status.value(), status.getReasonPhrase(), message, request.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex, HttpServletRequest request) {
        ApiError body = ApiError.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected error occurred",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private ApiError.FieldViolation toViolation(FieldError error) {
        return new ApiError.FieldViolation(error.getField(), error.getDefaultMessage());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.exception.ConflictException;</code> - Imports `com.bank.common.exception.ConflictException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.common.exception.InsufficientFundsException;</code> - Imports `com.bank.common.exception.InsufficientFundsException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.common.exception.PaymentDeclinedException;</code> - Imports `com.bank.common.exception.PaymentDeclinedException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import jakarta.servlet.http.HttpServletRequest;</code> - Imports `jakarta.servlet.http.HttpServletRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.security.access.AccessDeniedException;</code> - Imports `org.springframework.security.access.AccessDeniedException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.security.authentication.BadCredentialsException;</code> - Imports `org.springframework.security.authentication.BadCredentialsException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.validation.FieldError;</code> - Imports `org.springframework.validation.FieldError` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.MethodArgumentNotValidException;</code> - Imports `org.springframework.web.bind.MethodArgumentNotValidException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.ExceptionHandler;</code> - Imports `org.springframework.web.bind.annotation.ExceptionHandler` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.RestControllerAdvice;</code> - Imports `org.springframework.web.bind.annotation.RestControllerAdvice` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
21. <code> * Translates exceptions into a consistent {@link ApiError} JSON body.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
22. <code> * Module-specific handlers can be added as features land in later phases.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
23. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
24. <code>@RestControllerAdvice</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
25. <code>public class GlobalExceptionHandler {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
26. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
27. <code>    @ExceptionHandler(MethodArgumentNotValidException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
28. <code>    public ResponseEntity&lt;ApiError&gt; handleValidation(MethodArgumentNotValidException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
29. <code>                                                      HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <code>        List&lt;ApiError.FieldViolation&gt; violations = ex.getBindingResult().getFieldErrors().stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                .map(this::toViolation)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
33. <code>        ApiError body = new ApiError(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
34. <code>                Instant.now(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
35. <code>                HttpStatus.BAD_REQUEST.value(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>                HttpStatus.BAD_REQUEST.getReasonPhrase(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                &quot;Validation failed&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>                request.getRequestURI(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>                violations</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>        );</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>        return ResponseEntity.badRequest().body(body);</code> - Returns a value/reference to the caller and ends this execution path.
42. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @ExceptionHandler(IllegalArgumentException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
45. <code>    public ResponseEntity&lt;ApiError&gt; handleIllegalArgument(IllegalArgumentException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
46. <code>                                                          HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
47. <code>        ApiError body = ApiError.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
48. <code>                HttpStatus.BAD_REQUEST.value(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                HttpStatus.BAD_REQUEST.getReasonPhrase(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
50. <code>                ex.getMessage(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
51. <code>                request.getRequestURI()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>        );</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <code>        return ResponseEntity.badRequest().body(body);</code> - Returns a value/reference to the caller and ends this execution path.
54. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
56. <code>    @ExceptionHandler(NotFoundException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
57. <code>    public ResponseEntity&lt;ApiError&gt; handleNotFound(NotFoundException ex, HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
58. <code>        return status(HttpStatus.NOT_FOUND, ex.getMessage(), request);</code> - Returns a value/reference to the caller and ends this execution path.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
61. <code>    @ExceptionHandler(ConflictException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
62. <code>    public ResponseEntity&lt;ApiError&gt; handleConflict(ConflictException ex, HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
63. <code>        return status(HttpStatus.CONFLICT, ex.getMessage(), request);</code> - Returns a value/reference to the caller and ends this execution path.
64. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    @ExceptionHandler(InsufficientFundsException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
67. <code>    public ResponseEntity&lt;ApiError&gt; handleInsufficientFunds(InsufficientFundsException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
68. <code>                                                            HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <code>        return status(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);</code> - Returns a value/reference to the caller and ends this execution path.
70. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
72. <code>    @ExceptionHandler(PaymentDeclinedException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
73. <code>    public ResponseEntity&lt;ApiError&gt; handlePaymentDeclined(PaymentDeclinedException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
74. <code>                                                          HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <code>        return status(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);</code> - Returns a value/reference to the caller and ends this execution path.
76. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
77. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
78. <code>    @ExceptionHandler(BadCredentialsException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
79. <code>    public ResponseEntity&lt;ApiError&gt; handleBadCredentials(BadCredentialsException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
80. <code>                                                         HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
81. <code>        return status(HttpStatus.UNAUTHORIZED, &quot;Invalid email or password&quot;, request);</code> - Returns a value/reference to the caller and ends this execution path.
82. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
83. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
84. <code>    @ExceptionHandler(AccessDeniedException.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
85. <code>    public ResponseEntity&lt;ApiError&gt; handleAccessDenied(AccessDeniedException ex,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
86. <code>                                                       HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
87. <code>        return status(HttpStatus.FORBIDDEN, &quot;Access denied&quot;, request);</code> - Returns a value/reference to the caller and ends this execution path.
88. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
89. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
90. <code>    private ResponseEntity&lt;ApiError&gt; status(HttpStatus status, String message, HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
91. <code>        ApiError body = ApiError.of(status.value(), status.getReasonPhrase(), message, request.getRequestURI());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
92. <code>        return ResponseEntity.status(status).body(body);</code> - Returns a value/reference to the caller and ends this execution path.
93. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
94. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
95. <code>    @ExceptionHandler(Exception.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
96. <code>    public ResponseEntity&lt;ApiError&gt; handleUnexpected(Exception ex, HttpServletRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
97. <code>        ApiError body = ApiError.of(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
98. <code>                HttpStatus.INTERNAL_SERVER_ERROR.value(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
99. <code>                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
100. <code>                &quot;An unexpected error occurred&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
101. <code>                request.getRequestURI()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
102. <code>        );</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
103. <code>        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);</code> - Returns a value/reference to the caller and ends this execution path.
104. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
105. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
106. <code>    private ApiError.FieldViolation toViolation(FieldError error) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
107. <code>        return new ApiError.FieldViolation(error.getField(), error.getDefaultMessage());</code> - Returns a value/reference to the caller and ends this execution path.
108. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
109. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 57 | `public ResponseEntity&lt;ApiError&gt; handleNotFound(NotFoundException ex, HttpServletRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `handleNotFound`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 62 | `public ResponseEntity&lt;ApiError&gt; handleConflict(ConflictException ex, HttpServletRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `handleConflict`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 90 | `private ResponseEntity&lt;ApiError&gt; status(HttpStatus status, String message, HttpServletRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `status`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 96 | `public ResponseEntity&lt;ApiError&gt; handleUnexpected(Exception ex, HttpServletRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `handleUnexpected`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 106 | `private ApiError.FieldViolation toViolation(FieldError error)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `toViolation`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/OpenApiConfig.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `io.swagger.v3.oas.models.Components` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.models.OpenAPI` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.models.info.Contact` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.models.info.Info` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.models.info.License` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.models.security.SecurityScheme` | External or local dependency required by references in this file. |
| `org.springframework.context.annotation.Bean` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Configuration` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.common;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the OpenAPI/Swagger document metadata. The interactive UI is served
 * at /swagger-ui.html and the raw spec at /v3/api-docs.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bankingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Banking System API")
                        .description("Simulated banking platform — accounts, ledger, transfers, cards, loans.")
                        .version("v0.1.0")
                        .contact(new Contact().name("Banking System"))
                        .license(new License().name("MIT")))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import io.swagger.v3.oas.models.Components;</code> - Imports `io.swagger.v3.oas.models.Components` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import io.swagger.v3.oas.models.OpenAPI;</code> - Imports `io.swagger.v3.oas.models.OpenAPI` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import io.swagger.v3.oas.models.info.Contact;</code> - Imports `io.swagger.v3.oas.models.info.Contact` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import io.swagger.v3.oas.models.info.Info;</code> - Imports `io.swagger.v3.oas.models.info.Info` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.models.info.License;</code> - Imports `io.swagger.v3.oas.models.info.License` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.models.security.SecurityScheme;</code> - Imports `io.swagger.v3.oas.models.security.SecurityScheme` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.context.annotation.Bean;</code> - Imports `org.springframework.context.annotation.Bean` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.context.annotation.Configuration;</code> - Imports `org.springframework.context.annotation.Configuration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * Configures the OpenAPI/Swagger document metadata. The interactive UI is served</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> * at /swagger-ui.html and the raw spec at /v3/api-docs.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code>@Configuration</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
17. <code>public class OpenApiConfig {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
20. <code>    public OpenAPI bankingOpenAPI() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>        return new OpenAPI()</code> - Returns a value/reference to the caller and ends this execution path.
22. <code>                .info(new Info()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
23. <code>                        .title(&quot;Banking System API&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
24. <code>                        .description(&quot;Simulated banking platform — accounts, ledger, transfers, cards, loans.&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
25. <code>                        .version(&quot;v0.1.0&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
26. <code>                        .contact(new Contact().name(&quot;Banking System&quot;))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
27. <code>                        .license(new License().name(&quot;MIT&quot;)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
28. <code>                .components(new Components().addSecuritySchemes(&quot;bearerAuth&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                        new SecurityScheme()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                                .type(SecurityScheme.Type.HTTP)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
31. <code>                                .scheme(&quot;bearer&quot;)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
32. <code>                                .bearerFormat(&quot;JWT&quot;)));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
33. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 20 | `public OpenAPI bankingOpenAPI()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `bankingOpenAPI`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/PingController.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Lightweight liveness endpoint used by the frontend to prove end-to-end wiring.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "System", description = "Service health and metadata")
public class PingController {

    @GetMapping("/ping")
    @Operation(summary = "Ping the API", description = "Returns service status and a server timestamp.")
    public Map<String, Object> ping() {
        return Map.of(
                "status", "UP",
                "service", "banking-backend",
                "timestamp", Instant.now().toString()
        );
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * Lightweight liveness endpoint used by the frontend to prove end-to-end wiring.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
16. <code>@RequestMapping(&quot;/api/v1&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
17. <code>@Tag(name = &quot;System&quot;, description = &quot;Service health and metadata&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
18. <code>public class PingController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    @GetMapping(&quot;/ping&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
21. <code>    @Operation(summary = &quot;Ping the API&quot;, description = &quot;Returns service status and a server timestamp.&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    public Map&lt;String, Object&gt; ping() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        return Map.of(</code> - Returns a value/reference to the caller and ends this execution path.
24. <code>                &quot;status&quot;, &quot;UP&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
25. <code>                &quot;service&quot;, &quot;banking-backend&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
26. <code>                &quot;timestamp&quot;, Instant.now().toString()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
27. <code>        );</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 22 | `public Map&lt;String, Object&gt; ping()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `ping`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/SecurityConfig.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.security.JwtAuthenticationFilter` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.security.JwtProperties` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.boot.context.properties.EnableConfigurationProperties` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Bean` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Configuration` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.http.HttpStatus` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.config.annotation.web.builders.HttpSecurity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.config.http.SessionCreationPolicy` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.crypto.password.PasswordEncoder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.web.SecurityFilterChain` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.web.authentication.HttpStatusEntryPoint` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.cors.CorsConfiguration` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.cors.CorsConfigurationSource` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.cors.UrlBasedCorsConfigurationSource` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common;

import com.bank.auth.security.JwtAuthenticationFilter;
import com.bank.auth.security.JwtProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Stateless JWT security. Public: auth endpoints, API docs, actuator health, ping.
 * Everything else requires a valid access token; method-level @PreAuthorize adds
 * role checks (see {@link EnableMethodSecurity}).
 */
@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

    private static final String[] PUBLIC_PATHS = {
            "/api/v1/auth/**",
            "/api/v1/payments/webhook",
            "/api/v1/ping",
            "/actuator/health",
            "/actuator/health/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_PATHS).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.security.JwtAuthenticationFilter;</code> - Imports `com.bank.auth.security.JwtAuthenticationFilter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.auth.security.JwtProperties;</code> - Imports `com.bank.auth.security.JwtProperties` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.boot.context.properties.EnableConfigurationProperties;</code> - Imports `org.springframework.boot.context.properties.EnableConfigurationProperties` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.context.annotation.Bean;</code> - Imports `org.springframework.context.annotation.Bean` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.context.annotation.Configuration;</code> - Imports `org.springframework.context.annotation.Configuration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.HttpStatus;</code> - Imports `org.springframework.http.HttpStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;</code> - Imports `org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.security.config.annotation.web.builders.HttpSecurity;</code> - Imports `org.springframework.security.config.annotation.web.builders.HttpSecurity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.security.config.http.SessionCreationPolicy;</code> - Imports `org.springframework.security.config.http.SessionCreationPolicy` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;</code> - Imports `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.security.crypto.password.PasswordEncoder;</code> - Imports `org.springframework.security.crypto.password.PasswordEncoder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.security.web.SecurityFilterChain;</code> - Imports `org.springframework.security.web.SecurityFilterChain` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import org.springframework.security.web.authentication.HttpStatusEntryPoint;</code> - Imports `org.springframework.security.web.authentication.HttpStatusEntryPoint` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;</code> - Imports `org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import org.springframework.web.cors.CorsConfiguration;</code> - Imports `org.springframework.web.cors.CorsConfiguration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import org.springframework.web.cors.CorsConfigurationSource;</code> - Imports `org.springframework.web.cors.CorsConfigurationSource` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import org.springframework.web.cors.UrlBasedCorsConfigurationSource;</code> - Imports `org.springframework.web.cors.UrlBasedCorsConfigurationSource` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
25. <code> * Stateless JWT security. Public: auth endpoints, API docs, actuator health, ping.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
26. <code> * Everything else requires a valid access token; method-level @PreAuthorize adds</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
27. <code> * role checks (see {@link EnableMethodSecurity}).</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
28. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
29. <code>@Configuration</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
30. <code>@EnableMethodSecurity</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>@EnableConfigurationProperties(JwtProperties.class)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
32. <code>public class SecurityConfig {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    private static final String[] PUBLIC_PATHS = {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>            &quot;/api/v1/auth/**&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
36. <code>            &quot;/api/v1/payments/webhook&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>            &quot;/api/v1/ping&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
38. <code>            &quot;/actuator/health&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
39. <code>            &quot;/actuator/health/**&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
40. <code>            &quot;/v3/api-docs/**&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
41. <code>            &quot;/swagger-ui/**&quot;,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>            &quot;/swagger-ui.html&quot;</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
43. <code>    };</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>    @Value(&quot;${app.cors.allowed-origins:http://localhost:5173}&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
46. <code>    private List&lt;String&gt; allowedOrigins;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
47. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
48. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
49. <code>    public SecurityFilterChain filterChain(HttpSecurity http,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
50. <code>                                           JwtAuthenticationFilter jwtFilter) throws Exception {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <code>        http</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
52. <code>                .csrf(csrf -&gt; csrf.disable())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
53. <code>                .cors(cors -&gt; cors.configurationSource(corsConfigurationSource()))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
54. <code>                .sessionManagement(sm -&gt; sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
55. <code>                .authorizeHttpRequests(auth -&gt; auth</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
56. <code>                        .requestMatchers(PUBLIC_PATHS).permitAll()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
57. <code>                        .anyRequest().authenticated()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
58. <code>                )</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                .exceptionHandling(ex -&gt; ex</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
61. <code>                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
62. <code>        return http.build();</code> - Returns a value/reference to the caller and ends this execution path.
63. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
65. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
66. <code>    public PasswordEncoder passwordEncoder() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
67. <code>        return new BCryptPasswordEncoder();</code> - Returns a value/reference to the caller and ends this execution path.
68. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
69. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
70. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
71. <code>    public CorsConfigurationSource corsConfigurationSource() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
72. <code>        CorsConfiguration config = new CorsConfiguration();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <code>        config.setAllowedOrigins(allowedOrigins);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <code>        config.setAllowedMethods(List.of(&quot;GET&quot;, &quot;POST&quot;, &quot;PUT&quot;, &quot;PATCH&quot;, &quot;DELETE&quot;, &quot;OPTIONS&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
75. <code>        config.setAllowedHeaders(List.of(&quot;*&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
76. <code>        config.setAllowCredentials(true);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
77. <code>        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
78. <code>        source.registerCorsConfiguration(&quot;/**&quot;, config);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>        return source;</code> - Returns a value/reference to the caller and ends this execution path.
80. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
81. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 66 | `public PasswordEncoder passwordEncoder()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `passwordEncoder`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 71 | `public CorsConfigurationSource corsConfigurationSource()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `corsConfigurationSource`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/SecurityUtils.java`

### File Purpose
A common backend infrastructure file: it supports cross-cutting behavior such as security, errors, OpenAPI, or health checks.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.security.AuthUser` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.security.core.Authentication` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.security.core.context.SecurityContextHolder` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common;

import com.bank.auth.security.AuthUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

/**
 * Convenience accessors for the currently authenticated {@link AuthUser}.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static AuthUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser authUser)) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return authUser;
    }

    public static UUID currentUserId() {
        return currentUser().id();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.security.AuthUser;</code> - Imports `com.bank.auth.security.AuthUser` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.security.core.Authentication;</code> - Imports `org.springframework.security.core.Authentication` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.security.core.context.SecurityContextHolder;</code> - Imports `org.springframework.security.core.context.SecurityContextHolder` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * Convenience accessors for the currently authenticated {@link AuthUser}.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>public final class SecurityUtils {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    private SecurityUtils() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    public static AuthUser currentUser() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>        Authentication auth = SecurityContextHolder.getContext().getAuthentication();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
19. <code>        if (auth == null || !(auth.getPrincipal() instanceof AuthUser authUser)) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <code>            throw new IllegalStateException(&quot;No authenticated user in context&quot;);</code> - Throws an exception. Normal flow stops and Spring/global handlers translate many domain exceptions into HTTP responses.
21. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
22. <code>        return authUser;</code> - Returns a value/reference to the caller and ends this execution path.
23. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public static UUID currentUserId() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        return currentUser().id();</code> - Returns a value/reference to the caller and ends this execution path.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 14 | `private SecurityUtils()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `SecurityUtils`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 17 | `public static AuthUser currentUser()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `currentUser`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 25 | `public static UUID currentUserId()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `currentUserId`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/event/DomainEvent.java`

### File Purpose
A shared event helper: it standardizes event payloads or action names for future notification and audit flows.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common.event;

import java.time.Instant;
import java.util.UUID;

/**
 * A single domain event published to Kafka and consumed independently by the
 * notification and audit pipelines.
 *
 * @param subjectUserId the user a notification (if any) is addressed to
 * @param actorUserId   who performed the action (may equal subject; null for system)
 * @param notify        whether this event should produce a user-facing notification
 */
public record DomainEvent(
        UUID eventId,
        Instant occurredAt,
        UUID actorUserId,
        UUID subjectUserId,
        String action,
        String entityType,
        String entityId,
        String message,
        boolean notify
) {

    public static DomainEvent of(String action, UUID actorUserId, UUID subjectUserId,
                                 String entityType, String entityId, String message, boolean notify) {
        return new DomainEvent(UUID.randomUUID(), Instant.now(), actorUserId, subjectUserId,
                action, entityType, entityId, message, notify);
    }

    /** A user-facing event where the actor and subject are the same user. */
    public static DomainEvent userAction(String action, UUID userId, String entityType,
                                         String entityId, String message) {
        return of(action, userId, userId, entityType, entityId, message, true);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.event;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code> * A single domain event published to Kafka and consumed independently by the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
8. <code> * notification and audit pipelines.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> *</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * @param subjectUserId the user a notification (if any) is addressed to</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> * @param actorUserId   who performed the action (may equal subject; null for system)</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * @param notify        whether this event should produce a user-facing notification</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code>public record DomainEvent(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
15. <code>        UUID eventId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        Instant occurredAt,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        UUID actorUserId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        UUID subjectUserId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>        String action,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>        String entityType,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
21. <code>        String entityId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
22. <code>        String message,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
23. <code>        boolean notify</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
24. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    public static DomainEvent of(String action, UUID actorUserId, UUID subjectUserId,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
27. <code>                                 String entityType, String entityId, String message, boolean notify) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        return new DomainEvent(UUID.randomUUID(), Instant.now(), actorUserId, subjectUserId,</code> - Returns a value/reference to the caller and ends this execution path.
29. <code>                action, entityType, entityId, message, notify);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
30. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    /** A user-facing event where the actor and subject are the same user. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
33. <code>    public static DomainEvent userAction(String action, UUID userId, String entityType,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
34. <code>                                         String entityId, String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        return of(action, userId, userId, entityType, entityId, message, true);</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/common/event/EventActions.java`

### File Purpose
A shared event helper: it standardizes event payloads or action names for future notification and audit flows.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.common.event;

/** Canonical action names used across notifications and the audit log. */
public final class EventActions {

    private EventActions() {
    }

    public static final String USER_REGISTERED = "USER_REGISTERED";
    public static final String KYC_VERIFIED = "KYC_VERIFIED";
    public static final String KYC_REJECTED = "KYC_REJECTED";
    public static final String DEPOSIT = "DEPOSIT";
    public static final String WITHDRAWAL = "WITHDRAWAL";
    public static final String TRANSFER_SENT = "TRANSFER_SENT";
    public static final String TRANSFER_RECEIVED = "TRANSFER_RECEIVED";
    public static final String TOP_UP_SUCCEEDED = "TOP_UP_SUCCEEDED";
    public static final String CARD_PAYMENT = "CARD_PAYMENT";
    public static final String LOAN_APPROVED = "LOAN_APPROVED";
    public static final String LOAN_PAID_OFF = "LOAN_PAID_OFF";
}
````

### Code Walkthrough
1. <code>package com.bank.common.event;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Canonical action names used across notifications and the audit log. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public final class EventActions {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>    private EventActions() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
7. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>    public static final String USER_REGISTERED = &quot;USER_REGISTERED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
10. <code>    public static final String KYC_VERIFIED = &quot;KYC_VERIFIED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
11. <code>    public static final String KYC_REJECTED = &quot;KYC_REJECTED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
12. <code>    public static final String DEPOSIT = &quot;DEPOSIT&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
13. <code>    public static final String WITHDRAWAL = &quot;WITHDRAWAL&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
14. <code>    public static final String TRANSFER_SENT = &quot;TRANSFER_SENT&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
15. <code>    public static final String TRANSFER_RECEIVED = &quot;TRANSFER_RECEIVED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
16. <code>    public static final String TOP_UP_SUCCEEDED = &quot;TOP_UP_SUCCEEDED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
17. <code>    public static final String CARD_PAYMENT = &quot;CARD_PAYMENT&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
18. <code>    public static final String LOAN_APPROVED = &quot;LOAN_APPROVED&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
19. <code>    public static final String LOAN_PAID_OFF = &quot;LOAN_PAID_OFF&quot;;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
20. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 6 | `private EventActions()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `EventActions`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/event/EventPublisher.java`

### File Purpose
A shared event helper: it standardizes event payloads or action names for future notification and audit flows.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.kafka.core.KafkaTemplate` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.common.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Publishes {@link DomainEvent}s to Kafka. Fail-safe: a broker problem is logged
 * but never propagated, so a core banking action is never broken by the
 * notification/audit pipeline being unavailable.
 */
@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final KafkaTemplate<String, DomainEvent> kafkaTemplate;
    private final String topic;

    public EventPublisher(KafkaTemplate<String, DomainEvent> kafkaTemplate,
                          @Value("${app.events.topic:banking.events}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publish(DomainEvent event) {
        try {
            kafkaTemplate.send(topic, key(event), event);
        } catch (Exception e) {
            log.warn("Failed to publish event {} ({}): {}", event.eventId(), event.action(), e.getMessage());
        }
    }

    private String key(DomainEvent event) {
        UUID k = event.subjectUserId() != null ? event.subjectUserId() : event.actorUserId();
        return k != null ? k.toString() : event.eventId().toString();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.event;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.kafka.core.KafkaTemplate;</code> - Imports `org.springframework.kafka.core.KafkaTemplate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * Publishes {@link DomainEvent}s to Kafka. Fail-safe: a broker problem is logged</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * but never propagated, so a core banking action is never broken by the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> * notification/audit pipeline being unavailable.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
16. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
17. <code>public class EventPublisher {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    private final KafkaTemplate&lt;String, DomainEvent&gt; kafkaTemplate;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
22. <code>    private final String topic;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    public EventPublisher(KafkaTemplate&lt;String, DomainEvent&gt; kafkaTemplate,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
25. <code>                          @Value(&quot;${app.events.topic:banking.events}&quot;) String topic) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>        this.kafkaTemplate = kafkaTemplate;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>        this.topic = topic;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
28. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    public void publish(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>            kafkaTemplate.send(topic, key(event), event);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
33. <code>        } catch (Exception e) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>            log.warn(&quot;Failed to publish event {} ({}): {}&quot;, event.eventId(), event.action(), e.getMessage());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
35. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
36. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    private String key(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <code>        UUID k = event.subjectUserId() != null ? event.subjectUserId() : event.actorUserId();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
40. <code>        return k != null ? k.toString() : event.eventId().toString();</code> - Returns a value/reference to the caller and ends this execution path.
41. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
42. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 30 | `public void publish(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `publish`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 38 | `private String key(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `key`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/exception/ConflictException.java`

### File Purpose
A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.common.exception;

/** Thrown when a request conflicts with current state (e.g. duplicate email). Maps to HTTP 409. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.exception;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Thrown when a request conflicts with current state (e.g. duplicate email). Maps to HTTP 409. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public class ConflictException extends RuntimeException {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <code>    public ConflictException(String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
6. <code>        super(message);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
7. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
8. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 5 | `public ConflictException(String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `ConflictException`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/exception/InsufficientFundsException.java`

### File Purpose
A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.common.exception;

/** Thrown when an account has insufficient balance for a debit. Maps to HTTP 422. */
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.exception;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Thrown when an account has insufficient balance for a debit. Maps to HTTP 422. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public class InsufficientFundsException extends RuntimeException {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <code>    public InsufficientFundsException(String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
6. <code>        super(message);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
7. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
8. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 5 | `public InsufficientFundsException(String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `InsufficientFundsException`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/exception/NotFoundException.java`

### File Purpose
A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.common.exception;

/** Thrown when a requested resource does not exist. Maps to HTTP 404. */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.exception;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Thrown when a requested resource does not exist. Maps to HTTP 404. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public class NotFoundException extends RuntimeException {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <code>    public NotFoundException(String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
6. <code>        super(message);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
7. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
8. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 5 | `public NotFoundException(String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `NotFoundException`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/common/exception/PaymentDeclinedException.java`

### File Purpose
A custom exception: it gives domain failures a named type so the global exception handler can return the right HTTP status.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.common.exception;

/** Thrown when a card/payment is declined (frozen card, limit exceeded, etc.). Maps to HTTP 422. */
public class PaymentDeclinedException extends RuntimeException {
    public PaymentDeclinedException(String message) {
        super(message);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.common.exception;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Thrown when a card/payment is declined (frozen card, limit exceeded, etc.). Maps to HTTP 422. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public class PaymentDeclinedException extends RuntimeException {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <code>    public PaymentDeclinedException(String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
6. <code>        super(message);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
7. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
8. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 5 | `public PaymentDeclinedException(String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `PaymentDeclinedException`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(a + e), where a is affected accounts and e is ledger entries; database transaction and locks dominate runtime. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/customer/domain/CustomerProfile.java`

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
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.customer.domain;

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

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@NoArgsConstructor
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String phone;

    @Column(name = "address_line1")
    private String addressLine1;

    private String city;

    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus = KycStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private long version;

    public CustomerProfile(UUID userId, String firstName, String lastName) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.customer.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
18. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
20. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
23. <code>@Table(name = &quot;customer_profiles&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
24. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
25. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
26. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
27. <code>public class CustomerProfile {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
30. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
31. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
32. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
33. <code>    @Column(name = &quot;user_id&quot;, nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
34. <code>    private UUID userId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @Column(name = &quot;first_name&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
37. <code>    private String firstName;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    @Column(name = &quot;last_name&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
40. <code>    private String lastName;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
41. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
42. <code>    @Column(name = &quot;date_of_birth&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
43. <code>    private LocalDate dateOfBirth;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
44. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
45. <code>    private String phone;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @Column(name = &quot;address_line1&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private String addressLine1;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    private String city;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>    private String country;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
53. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
54. <code>    @Enumerated(EnumType.STRING)</code> - JPA enum mapping annotation. It stores enum names rather than ordinals so database values stay readable and stable.
55. <code>    @Column(name = &quot;kyc_status&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
56. <code>    private KycStatus kycStatus = KycStatus.PENDING;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
57. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
58. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
59. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
60. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
61. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
62. <code>    @UpdateTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
63. <code>    @Column(name = &quot;updated_at&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
64. <code>    private Instant updatedAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
65. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
66. <code>    @Version</code> - Optimistic-locking annotation. Hibernate increments this field to detect concurrent lost updates.
67. <code>    private long version;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
68. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
69. <code>    public CustomerProfile(UUID userId, String firstName, String lastName) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <code>        this.userId = userId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
71. <code>        this.firstName = firstName;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
72. <code>        this.lastName = lastName;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
73. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 69 | `public CustomerProfile(UUID userId, String firstName, String lastName)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `CustomerProfile`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/customer/domain/KycStatus.java`

### File Purpose
A domain model file: it represents persistent business state and maps Java objects to database concepts.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.customer.domain;

/**
 * Know-Your-Customer verification state. New profiles start PENDING and are
 * moved to VERIFIED/REJECTED by an admin.
 */
public enum KycStatus {
    PENDING,
    VERIFIED,
    REJECTED
}
````

### Code Walkthrough
1. <code>package com.bank.customer.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code> * Know-Your-Customer verification state. New profiles start PENDING and are</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
5. <code> * moved to VERIFIED/REJECTED by an admin.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
6. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>public enum KycStatus {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
8. <code>    PENDING,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
9. <code>    VERIFIED,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>    REJECTED</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
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

## `backend/src/main/java/com/bank/customer/dto/ProfileResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.customer.domain.KycStatus` | Project-local dependency connecting this file to another banking module. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.customer.dto;

import com.bank.customer.domain.KycStatus;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Combined identity + KYC profile for the current user.
 */
public record ProfileResponse(
        UUID userId,
        String email,
        String role,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String phone,
        String addressLine1,
        String city,
        String country,
        KycStatus kycStatus
) {
}
````

### Code Walkthrough
1. <code>package com.bank.customer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.customer.domain.KycStatus;</code> - Imports `com.bank.customer.domain.KycStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * Combined identity + KYC profile for the current user.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code>public record ProfileResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
12. <code>        UUID userId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String email,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String role,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        String firstName,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>        String lastName,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
17. <code>        LocalDate dateOfBirth,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
18. <code>        String phone,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
19. <code>        String addressLine1,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
20. <code>        String city,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
21. <code>        String country,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
22. <code>        KycStatus kycStatus</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
23. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/customer/dto/UpdateProfileRequest.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `jakarta.validation.constraints.Past` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `jakarta.validation.constraints.Size` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `java.time.LocalDate` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.customer.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateProfileRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Past LocalDate dateOfBirth,
        @Size(max = 30) String phone,
        @Size(max = 255) String addressLine1,
        @Size(max = 100) String city,
        @Size(max = 100) String country
) {
}
````

### Code Walkthrough
1. <code>package com.bank.customer.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import jakarta.validation.constraints.Past;</code> - Imports `jakarta.validation.constraints.Past` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import jakarta.validation.constraints.Size;</code> - Imports `jakarta.validation.constraints.Size` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.time.LocalDate;</code> - Imports `java.time.LocalDate` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>public record UpdateProfileRequest(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
9. <code>        @Size(max = 100) String firstName,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
10. <code>        @Size(max = 100) String lastName,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
11. <code>        @Past LocalDate dateOfBirth,</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
12. <code>        @Size(max = 30) String phone,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
13. <code>        @Size(max = 255) String addressLine1,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
14. <code>        @Size(max = 100) String city,</code> - Bean Validation annotation. Spring validates request data before business logic runs.
15. <code>        @Size(max = 100) String country</code> - Bean Validation annotation. Spring validates request data before business logic runs.
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

## `backend/src/main/java/com/bank/customer/repo/CustomerProfileRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.customer.domain.CustomerProfile` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.customer.repo;

import com.bank.customer.domain.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, UUID> {

    Optional<CustomerProfile> findByUserId(UUID userId);
}
````

### Code Walkthrough
1. <code>package com.bank.customer.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.customer.domain.CustomerProfile;</code> - Imports `com.bank.customer.domain.CustomerProfile` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>public interface CustomerProfileRepository extends JpaRepository&lt;CustomerProfile, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    Optional&lt;CustomerProfile&gt; findByUserId(UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
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

## `backend/src/main/java/com/bank/customer/service/CustomerService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.domain.User` | Project-local dependency connecting this file to another banking module. |
| `com.bank.auth.repo.UserRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.domain.CustomerProfile` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.domain.KycStatus` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.dto.ProfileResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.dto.UpdateProfileRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.repo.CustomerProfileRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.function.Function` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.customer.service;

import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.common.exception.NotFoundException;
import com.bank.customer.domain.CustomerProfile;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.dto.UpdateProfileRequest;
import com.bank.customer.repo.CustomerProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository profileRepository;

    public CustomerService(UserRepository userRepository, CustomerProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        User user = requireUser(userId);
        // Staff accounts (e.g. the seeded admin) have no customer profile; return
        // just the identity rather than 404 so they can sign in to the UI.
        CustomerProfile profile = profileRepository.findByUserId(userId).orElse(null);
        return toResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = requireUser(userId);
        CustomerProfile profile = requireProfile(userId);
        if (request.firstName() != null) profile.setFirstName(request.firstName());
        if (request.lastName() != null) profile.setLastName(request.lastName());
        if (request.dateOfBirth() != null) profile.setDateOfBirth(request.dateOfBirth());
        if (request.phone() != null) profile.setPhone(request.phone());
        if (request.addressLine1() != null) profile.setAddressLine1(request.addressLine1());
        if (request.city() != null) profile.setCity(request.city());
        if (request.country() != null) profile.setCountry(request.country());
        return toResponse(user, profile);
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> listAllProfiles() {
        Map<UUID, User> usersById = userRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(User::getId, Function.identity()));
        return profileRepository.findAll().stream()
                .filter(p -> usersById.containsKey(p.getUserId()))
                .map(p -> toResponse(usersById.get(p.getUserId()), p))
                .toList();
    }

    @Transactional
    public ProfileResponse setKycStatus(UUID userId, KycStatus status) {
        User user = requireUser(userId);
        CustomerProfile profile = requireProfile(userId);
        profile.setKycStatus(status);
        return toResponse(user, profile);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private CustomerProfile requireProfile(UUID userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found"));
    }

    private ProfileResponse toResponse(User user, CustomerProfile p) {
        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                p == null ? null : p.getFirstName(),
                p == null ? null : p.getLastName(),
                p == null ? null : p.getDateOfBirth(),
                p == null ? null : p.getPhone(),
                p == null ? null : p.getAddressLine1(),
                p == null ? null : p.getCity(),
                p == null ? null : p.getCountry(),
                p == null ? null : p.getKycStatus());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.customer.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.domain.User;</code> - Imports `com.bank.auth.domain.User` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.auth.repo.UserRepository;</code> - Imports `com.bank.auth.repo.UserRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.customer.domain.CustomerProfile;</code> - Imports `com.bank.customer.domain.CustomerProfile` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.customer.domain.KycStatus;</code> - Imports `com.bank.customer.domain.KycStatus` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.customer.dto.ProfileResponse;</code> - Imports `com.bank.customer.dto.ProfileResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import com.bank.customer.dto.UpdateProfileRequest;</code> - Imports `com.bank.customer.dto.UpdateProfileRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import com.bank.customer.repo.CustomerProfileRepository;</code> - Imports `com.bank.customer.repo.CustomerProfileRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.util.function.Function;</code> - Imports `java.util.function.Function` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
20. <code>public class CustomerService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    private final UserRepository userRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
23. <code>    private final CustomerProfileRepository profileRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public CustomerService(UserRepository userRepository, CustomerProfileRepository profileRepository) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.userRepository = userRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>        this.profileRepository = profileRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
28. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
30. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
31. <code>    public ProfileResponse getProfile(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        User user = requireUser(userId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
33. <code>        // Staff accounts (e.g. the seeded admin) have no customer profile; return</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
34. <code>        // just the identity rather than 404 so they can sign in to the UI.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
35. <code>        CustomerProfile profile = profileRepository.findByUserId(userId).orElse(null);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
36. <code>        return toResponse(user, profile);</code> - Returns a value/reference to the caller and ends this execution path.
37. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
39. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
40. <code>    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
41. <code>        User user = requireUser(userId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
42. <code>        CustomerProfile profile = requireProfile(userId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
43. <code>        if (request.firstName() != null) profile.setFirstName(request.firstName());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
44. <code>        if (request.lastName() != null) profile.setLastName(request.lastName());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
45. <code>        if (request.dateOfBirth() != null) profile.setDateOfBirth(request.dateOfBirth());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
46. <code>        if (request.phone() != null) profile.setPhone(request.phone());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
47. <code>        if (request.addressLine1() != null) profile.setAddressLine1(request.addressLine1());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
48. <code>        if (request.city() != null) profile.setCity(request.city());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
49. <code>        if (request.country() != null) profile.setCountry(request.country());</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
50. <code>        return toResponse(user, profile);</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
54. <code>    public List&lt;ProfileResponse&gt; listAllProfiles() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
55. <code>        Map&lt;UUID, User&gt; usersById = userRepository.findAll().stream()</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
56. <code>                .collect(java.util.stream.Collectors.toMap(User::getId, Function.identity()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
57. <code>        return profileRepository.findAll().stream()</code> - Returns a value/reference to the caller and ends this execution path.
58. <code>                .filter(p -&gt; usersById.containsKey(p.getUserId()))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
59. <code>                .map(p -&gt; toResponse(usersById.get(p.getUserId()), p))</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
60. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
61. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
62. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
63. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
64. <code>    public ProfileResponse setKycStatus(UUID userId, KycStatus status) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
65. <code>        User user = requireUser(userId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
66. <code>        CustomerProfile profile = requireProfile(userId);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
67. <code>        profile.setKycStatus(status);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
68. <code>        return toResponse(user, profile);</code> - Returns a value/reference to the caller and ends this execution path.
69. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
70. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
71. <code>    private User requireUser(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
72. <code>        return userRepository.findById(userId)</code> - Returns a value/reference to the caller and ends this execution path.
73. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;User not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
74. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
75. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
76. <code>    private CustomerProfile requireProfile(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
77. <code>        return profileRepository.findByUserId(userId)</code> - Returns a value/reference to the caller and ends this execution path.
78. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Profile not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
79. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
80. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
81. <code>    private ProfileResponse toResponse(User user, CustomerProfile p) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
82. <code>        return new ProfileResponse(</code> - Returns a value/reference to the caller and ends this execution path.
83. <code>                user.getId(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
84. <code>                user.getEmail(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
85. <code>                user.getRole().name(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
86. <code>                p == null ? null : p.getFirstName(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
87. <code>                p == null ? null : p.getLastName(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
88. <code>                p == null ? null : p.getDateOfBirth(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
89. <code>                p == null ? null : p.getPhone(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
90. <code>                p == null ? null : p.getAddressLine1(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
91. <code>                p == null ? null : p.getCity(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
92. <code>                p == null ? null : p.getCountry(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
93. <code>                p == null ? null : p.getKycStatus());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
94. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
95. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public CustomerService(UserRepository userRepository, CustomerProfileRepository profileRepository)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `CustomerService`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 31 | `public ProfileResponse getProfile(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `getProfile`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 40 | `public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `updateProfile`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 54 | `public List&lt;ProfileResponse&gt; listAllProfiles()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `listAllProfiles`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 64 | `public ProfileResponse setKycStatus(UUID userId, KycStatus status)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `setKycStatus`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 71 | `private User requireUser(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireUser`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 76 | `private CustomerProfile requireProfile(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `requireProfile`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 81 | `private ProfileResponse toResponse(User user, CustomerProfile p)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `toResponse`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/customer/web/CustomerController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.dto.ProfileResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.dto.UpdateProfileRequest` | Project-local dependency connecting this file to another banking module. |
| `com.bank.customer.service.CustomerService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `jakarta.validation.Valid` | Jakarta EE API used by Spring Boot 3 for servlet, validation, or persistence annotations. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PutMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestBody` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.customer.web;

import com.bank.common.SecurityUtils;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.dto.UpdateProfileRequest;
import com.bank.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Current user identity and KYC profile")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get the current user's profile")
    public ProfileResponse me() {
        return customerService.getProfile(SecurityUtils.currentUserId());
    }

    @PutMapping("/me/profile")
    @Operation(summary = "Update the current user's KYC profile")
    public ProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return customerService.updateProfile(SecurityUtils.currentUserId(), request);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.customer.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.customer.dto.ProfileResponse;</code> - Imports `com.bank.customer.dto.ProfileResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.customer.dto.UpdateProfileRequest;</code> - Imports `com.bank.customer.dto.UpdateProfileRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.customer.service.CustomerService;</code> - Imports `com.bank.customer.service.CustomerService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import jakarta.validation.Valid;</code> - Imports `jakarta.validation.Valid` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.web.bind.annotation.PutMapping;</code> - Imports `org.springframework.web.bind.annotation.PutMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.RequestBody;</code> - Imports `org.springframework.web.bind.annotation.RequestBody` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
18. <code>@RequestMapping(&quot;/api/v1/users&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
19. <code>@Tag(name = &quot;Users&quot;, description = &quot;Current user identity and KYC profile&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>public class CustomerController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final CustomerService customerService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public CustomerController(CustomerService customerService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.customerService = customerService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @GetMapping(&quot;/me&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
30. <code>    @Operation(summary = &quot;Get the current user&#x27;s profile&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    public ProfileResponse me() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>        return customerService.getProfile(SecurityUtils.currentUserId());</code> - Returns a value/reference to the caller and ends this execution path.
33. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    @PutMapping(&quot;/me/profile&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
36. <code>    @Operation(summary = &quot;Update the current user&#x27;s KYC profile&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
37. <code>    public ProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>        return customerService.updateProfile(SecurityUtils.currentUserId(), request);</code> - Returns a value/reference to the caller and ends this execution path.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public CustomerController(CustomerService customerService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `CustomerController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 31 | `public ProfileResponse me()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `me`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 37 | `public ProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `updateProfile`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/package-info.java`

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
 * notification module — see PROJECT_PLAN.md. Implemented in a later phase.
 */
package com.bank.notification;
````

### Code Walkthrough
1. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
2. <code> * notification module — see PROJECT_PLAN.md. Implemented in a later phase.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
3. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>package com.bank.notification;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.

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

## `backend/src/main/java/com/bank/audit/domain/AuditEntry.java`

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
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.audit.domain;

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

import java.time.Instant;
import java.util.UUID;

/** An append-only audit record of a domain action. */
@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
public class AuditEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false, unique = true)
    private UUID eventId;

    @Column(name = "actor_user_id")
    private UUID actorUserId;

    @Column(nullable = false)
    private String action;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id")
    private String entityId;

    @Column(nullable = false)
    private String message;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuditEntry(UUID eventId, UUID actorUserId, String action, String entityType,
                      String entityId, String message) {
        this.eventId = eventId;
        this.actorUserId = actorUserId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.message = message;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.audit.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
14. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>/** An append-only audit record of a domain action. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
18. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
19. <code>@Table(name = &quot;audit_log&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
20. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>public class AuditEntry {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
26. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
27. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @Column(name = &quot;event_id&quot;, nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
30. <code>    private UUID eventId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @Column(name = &quot;actor_user_id&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
33. <code>    private UUID actorUserId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
34. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
35. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
36. <code>    private String action;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
37. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
38. <code>    @Column(name = &quot;entity_type&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
39. <code>    private String entityType;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
40. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
41. <code>    @Column(name = &quot;entity_id&quot;)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
42. <code>    private String entityId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
43. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
44. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
45. <code>    private String message;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
46. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
47. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
48. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
49. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
50. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
51. <code>    public AuditEntry(UUID eventId, UUID actorUserId, String action, String entityType,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
52. <code>                      String entityId, String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
53. <code>        this.eventId = eventId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
54. <code>        this.actorUserId = actorUserId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
55. <code>        this.action = action;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
56. <code>        this.entityType = entityType;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
57. <code>        this.entityId = entityId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
58. <code>        this.message = message;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
59. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
60. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/audit/dto/AuditEntryResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.audit.domain.AuditEntry` | Project-local dependency connecting this file to another banking module. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.audit.dto;

import com.bank.audit.domain.AuditEntry;

import java.time.Instant;
import java.util.UUID;

public record AuditEntryResponse(
        UUID id,
        UUID actorUserId,
        String action,
        String entityType,
        String entityId,
        String message,
        Instant createdAt
) {
    public static AuditEntryResponse from(AuditEntry a) {
        return new AuditEntryResponse(a.getId(), a.getActorUserId(), a.getAction(),
                a.getEntityType(), a.getEntityId(), a.getMessage(), a.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.audit.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.audit.domain.AuditEntry;</code> - Imports `com.bank.audit.domain.AuditEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>public record AuditEntryResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
9. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>        UUID actorUserId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        String action,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        String entityType,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        String entityId,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        String message,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
16. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>    public static AuditEntryResponse from(AuditEntry a) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>        return new AuditEntryResponse(a.getId(), a.getActorUserId(), a.getAction(),</code> - Returns a value/reference to the caller and ends this execution path.
19. <code>                a.getEntityType(), a.getEntityId(), a.getMessage(), a.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
20. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 17 | `public static AuditEntryResponse from(AuditEntry a)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/audit/messaging/AuditConsumer.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.audit.service.AuditService` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.event.DomainEvent` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.kafka.annotation.KafkaListener` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.audit.messaging;

import com.bank.audit.service.AuditService;
import com.bank.common.event.DomainEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes every domain event and appends it to the audit log. Uses its own
 * consumer group so it is independent of the notification consumer.
 */
@Component
public class AuditConsumer {

    private final AuditService auditService;

    public AuditConsumer(AuditService auditService) {
        this.auditService = auditService;
    }

    @KafkaListener(topics = "${app.events.topic:banking.events}", groupId = "audit")
    public void onEvent(DomainEvent event) {
        auditService.record(event);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.audit.messaging;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.audit.service.AuditService;</code> - Imports `com.bank.audit.service.AuditService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.common.event.DomainEvent;</code> - Imports `com.bank.common.event.DomainEvent` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.kafka.annotation.KafkaListener;</code> - Imports `org.springframework.kafka.annotation.KafkaListener` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * Consumes every domain event and appends it to the audit log. Uses its own</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * consumer group so it is independent of the notification consumer.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
13. <code>public class AuditConsumer {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>    private final AuditService auditService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    public AuditConsumer(AuditService auditService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>        this.auditService = auditService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
19. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @KafkaListener(topics = &quot;${app.events.topic:banking.events}&quot;, groupId = &quot;audit&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    public void onEvent(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        auditService.record(event);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
24. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 17 | `public AuditConsumer(AuditService auditService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AuditConsumer`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 22 | `public void onEvent(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `onEvent`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/audit/repo/AuditEntryRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.audit.domain.AuditEntry` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.domain.Page` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.domain.Pageable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.audit.repo;

import com.bank.audit.domain.AuditEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuditEntryRepository extends JpaRepository<AuditEntry, UUID> {

    boolean existsByEventId(UUID eventId);

    Page<AuditEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
````

### Code Walkthrough
1. <code>package com.bank.audit.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.audit.domain.AuditEntry;</code> - Imports `com.bank.audit.domain.AuditEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.domain.Page;</code> - Imports `org.springframework.data.domain.Page` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.data.domain.Pageable;</code> - Imports `org.springframework.data.domain.Pageable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public interface AuditEntryRepository extends JpaRepository&lt;AuditEntry, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    boolean existsByEventId(UUID eventId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    Page&lt;AuditEntry&gt; findAllByOrderByCreatedAtDesc(Pageable pageable);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
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

## `backend/src/main/java/com/bank/audit/service/AuditService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.audit.domain.AuditEntry` | Project-local dependency connecting this file to another banking module. |
| `com.bank.audit.repo.AuditEntryRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.event.DomainEvent` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.dao.DataIntegrityViolationException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.domain.Page` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.data.domain.PageRequest` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.audit.service;

import com.bank.audit.domain.AuditEntry;
import com.bank.audit.repo.AuditEntryRepository;
import com.bank.common.event.DomainEvent;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private final AuditEntryRepository auditRepository;

    public AuditService(AuditEntryRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /** Appends an audit record for an event. Idempotent on eventId. */
    @Transactional
    public void record(DomainEvent event) {
        if (auditRepository.existsByEventId(event.eventId())) {
            return;
        }
        try {
            auditRepository.save(new AuditEntry(
                    event.eventId(), event.actorUserId(), event.action(),
                    event.entityType(), event.entityId(), event.message()));
        } catch (DataIntegrityViolationException duplicate) {
            // concurrent delivery already recorded it
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditEntry> recent(int page, int size) {
        return auditRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 200)));
    }
}
````

### Code Walkthrough
1. <code>package com.bank.audit.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.audit.domain.AuditEntry;</code> - Imports `com.bank.audit.domain.AuditEntry` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.audit.repo.AuditEntryRepository;</code> - Imports `com.bank.audit.repo.AuditEntryRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.common.event.DomainEvent;</code> - Imports `com.bank.common.event.DomainEvent` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.dao.DataIntegrityViolationException;</code> - Imports `org.springframework.dao.DataIntegrityViolationException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.data.domain.Page;</code> - Imports `org.springframework.data.domain.Page` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.data.domain.PageRequest;</code> - Imports `org.springframework.data.domain.PageRequest` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
13. <code>public class AuditService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
14. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
15. <code>    private final AuditEntryRepository auditRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>    public AuditService(AuditEntryRepository auditRepository) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
18. <code>        this.auditRepository = auditRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
19. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    /** Appends an audit record for an event. Idempotent on eventId. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
22. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
23. <code>    public void record(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <code>        if (auditRepository.existsByEventId(event.eventId())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
27. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>            auditRepository.save(new AuditEntry(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
29. <code>                    event.eventId(), event.actorUserId(), event.action(),</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
30. <code>                    event.entityType(), event.entityId(), event.message()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
31. <code>        } catch (DataIntegrityViolationException duplicate) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
32. <code>            // concurrent delivery already recorded it</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
33. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
36. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
37. <code>    public Page&lt;AuditEntry&gt; recent(int page, int size) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>        return auditRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 200)));</code> - Returns a value/reference to the caller and ends this execution path.
39. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 17 | `public AuditService(AuditEntryRepository auditRepository)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AuditService`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 23 | `public void record(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `record`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 37 | `public Page&lt;AuditEntry&gt; recent(int page, int size)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `recent`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/audit/web/AdminAuditController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.audit.dto.AuditEntryResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.audit.service.AuditService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `org.springframework.security.access.prepost.PreAuthorize` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestParam` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.audit.web;

import com.bank.audit.dto.AuditEntryResponse;
import com.bank.audit.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/audit")
@Tag(name = "Admin", description = "Audit log")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {

    private final AuditService auditService;

    public AdminAuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @Operation(summary = "List recent audit entries (newest first)")
    public List<AuditEntryResponse> recent(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size) {
        return auditService.recent(page, size).map(AuditEntryResponse::from).getContent();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.audit.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.audit.dto.AuditEntryResponse;</code> - Imports `com.bank.audit.dto.AuditEntryResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.audit.service.AuditService;</code> - Imports `com.bank.audit.service.AuditService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.security.access.prepost.PreAuthorize;</code> - Imports `org.springframework.security.access.prepost.PreAuthorize` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.web.bind.annotation.RequestParam;</code> - Imports `org.springframework.web.bind.annotation.RequestParam` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
17. <code>@RequestMapping(&quot;/api/v1/admin/audit&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
18. <code>@Tag(name = &quot;Admin&quot;, description = &quot;Audit log&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
19. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>@PreAuthorize(&quot;hasRole(&#x27;ADMIN&#x27;)&quot;)</code> - Spring Security method guard. Authorization is checked before the method body runs.
21. <code>public class AdminAuditController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    private final AuditService auditService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
24. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
25. <code>    public AdminAuditController(AuditService auditService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.auditService = auditService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
29. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
30. <code>    @Operation(summary = &quot;List recent audit entries (newest first)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
31. <code>    public List&lt;AuditEntryResponse&gt; recent(@RequestParam(defaultValue = &quot;0&quot;) int page,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
32. <code>                                           @RequestParam(defaultValue = &quot;50&quot;) int size) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
33. <code>        return auditService.recent(page, size).map(AuditEntryResponse::from).getContent();</code> - Returns a value/reference to the caller and ends this execution path.
34. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 25 | `public AdminAuditController(AuditService auditService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `AdminAuditController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/domain/Notification.java`

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
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.notification.domain;

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

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false, unique = true)
    private UUID eventId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Notification(UUID eventId, UUID userId, String type, String title, String message) {
        this.eventId = eventId;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.domain;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
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
14. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
16. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
17. <code>@Entity</code> - JPA annotation marking the class as persistent. Hibernate scans it and maps instances to a database table.
18. <code>@Table(name = &quot;notifications&quot;)</code> - JPA table-mapping annotation. It connects the Java entity to a named table or database constraints.
19. <code>@Getter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
20. <code>@Setter</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
21. <code>@NoArgsConstructor</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>public class Notification {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
23. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
24. <code>    @Id</code> - JPA primary-key annotation. Hibernate uses it to track identity and persistence lifecycle.
25. <code>    @GeneratedValue(strategy = GenerationType.UUID)</code> - JPA key-generation annotation. The database or provider creates the id value instead of application code.
26. <code>    private UUID id;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    @Column(name = &quot;event_id&quot;, nullable = false, unique = true)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
29. <code>    private UUID eventId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    @Column(name = &quot;user_id&quot;, nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
32. <code>    private UUID userId;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
33. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
34. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
35. <code>    private String type;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
36. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
37. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
38. <code>    private String title;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
41. <code>    private String message;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
42. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
43. <code>    @Column(nullable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
44. <code>    private boolean read = false;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @CreationTimestamp</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
47. <code>    @Column(name = &quot;created_at&quot;, nullable = false, updatable = false)</code> - JPA column annotation. It controls nullability, uniqueness, precision, or column names at mapping time.
48. <code>    private Instant createdAt;</code> - Declares a field. Each object instance stores this value/reference on the heap unless it is static.
49. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
50. <code>    public Notification(UUID eventId, UUID userId, String type, String title, String message) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <code>        this.eventId = eventId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
52. <code>        this.userId = userId;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
53. <code>        this.type = type;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
54. <code>        this.title = title;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
55. <code>        this.message = message;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
56. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
57. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 50 | `public Notification(UUID eventId, UUID userId, String type, String title, String message)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `Notification`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/dto/NotificationResponse.java`

### File Purpose
A DTO file: it defines the shape of request or response data crossing the HTTP API boundary.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.notification.domain.Notification` | Project-local dependency connecting this file to another banking module. |
| `java.time.Instant` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.notification.dto;

import com.bank.notification.domain.Notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String type,
        String title,
        String message,
        boolean read,
        Instant createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(n.getId(), n.getType(), n.getTitle(), n.getMessage(),
                n.isRead(), n.getCreatedAt());
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.dto;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.notification.domain.Notification;</code> - Imports `com.bank.notification.domain.Notification` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
5. <code>import java.time.Instant;</code> - Imports `java.time.Instant` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>public record NotificationResponse(</code> - Declares a Java record: an immutable data carrier with generated constructor, accessors, equals, hashCode, and toString.
9. <code>        UUID id,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
10. <code>        String type,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
11. <code>        String title,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
12. <code>        String message,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
13. <code>        boolean read,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
14. <code>        Instant createdAt</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
15. <code>) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
16. <code>    public static NotificationResponse from(Notification n) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>        return new NotificationResponse(n.getId(), n.getType(), n.getTitle(), n.getMessage(),</code> - Returns a value/reference to the caller and ends this execution path.
18. <code>                n.isRead(), n.getCreatedAt());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
19. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 16 | `public static NotificationResponse from(Notification n)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `from`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/email/EmailConfig.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.beans.factory.ObjectProvider` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.beans.factory.annotation.Value` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Bean` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.context.annotation.Configuration` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.mail.javamail.JavaMailSender` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * Selects the email sender at startup: SMTP when a JavaMailSender is present
 * (i.e. spring.mail.host is configured), otherwise the simulated logger.
 */
@Configuration
public class EmailConfig {

    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);

    @Bean
    public EmailSender emailSender(ObjectProvider<JavaMailSender> mailSender,
                                   @Value("${app.mail.from:no-reply@bank.local}") String from) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender != null) {
            log.info("Email: SMTP (mail host configured)");
            return new SmtpEmailSender(sender, from);
        }
        log.info("Email: SIMULATED (no mail host configured)");
        return new SimulatedEmailSender();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.email;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.beans.factory.ObjectProvider;</code> - Imports `org.springframework.beans.factory.ObjectProvider` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.beans.factory.annotation.Value;</code> - Imports `org.springframework.beans.factory.annotation.Value` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import org.springframework.context.annotation.Bean;</code> - Imports `org.springframework.context.annotation.Bean` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import org.springframework.context.annotation.Configuration;</code> - Imports `org.springframework.context.annotation.Configuration` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.mail.javamail.JavaMailSender;</code> - Imports `org.springframework.mail.javamail.JavaMailSender` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> * Selects the email sender at startup: SMTP when a JavaMailSender is present</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code> * (i.e. spring.mail.host is configured), otherwise the simulated logger.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
14. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
15. <code>@Configuration</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
16. <code>public class EmailConfig {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>    @Bean</code> - Spring configuration annotation. It contributes beans or configuration metadata to the application context.
21. <code>    public EmailSender emailSender(ObjectProvider&lt;JavaMailSender&gt; mailSender,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
22. <code>                                   @Value(&quot;${app.mail.from:no-reply@bank.local}&quot;) String from) {</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>        JavaMailSender sender = mailSender.getIfAvailable();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
24. <code>        if (sender != null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
25. <code>            log.info(&quot;Email: SMTP (mail host configured)&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <code>            return new SmtpEmailSender(sender, from);</code> - Returns a value/reference to the caller and ends this execution path.
27. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
28. <code>        log.info(&quot;Email: SIMULATED (no mail host configured)&quot;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <code>        return new SimulatedEmailSender();</code> - Returns a value/reference to the caller and ends this execution path.
30. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
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

## `backend/src/main/java/com/bank/notification/email/EmailSender.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
No language-level imports are declared in this file. It either defines configuration/data, uses only built-in syntax, or is an asset/documentation file.

### Complete Source
````java
package com.bank.notification.email;

/** Sends transactional email. Implementations: simulated (logs) or SMTP. */
public interface EmailSender {
    void send(String to, String subject, String body);
}
````

### Code Walkthrough
1. <code>package com.bank.notification.email;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>/** Sends transactional email. Implementations: simulated (logs) or SMTP. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
4. <code>public interface EmailSender {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
5. <code>    void send(String to, String subject, String body);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
6. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/notification/email/SimulatedEmailSender.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |

### Complete Source
````java
package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Default email sender: logs the message instead of sending it (no setup needed). */
public class SimulatedEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(SimulatedEmailSender.class);

    @Override
    public void send(String to, String subject, String body) {
        log.info("[SIMULATED EMAIL] to={} subject=\"{}\" body=\"{}\"", to, subject, body);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.email;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>/** Default email sender: logs the message instead of sending it (no setup needed). */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
7. <code>public class SimulatedEmailSender implements EmailSender {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
8. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
9. <code>    private static final Logger log = LoggerFactory.getLogger(SimulatedEmailSender.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
12. <code>    public void send(String to, String subject, String body) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
13. <code>        log.info(&quot;[SIMULATED EMAIL] to={} subject=\&quot;{}\&quot; body=\&quot;{}\&quot;&quot;, to, subject, body);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
14. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
15. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 12 | `public void send(String to, String subject, String body)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `send`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/email/SmtpEmailSender.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `org.slf4j.Logger` | External or local dependency required by references in this file. |
| `org.slf4j.LoggerFactory` | External or local dependency required by references in this file. |
| `org.springframework.mail.SimpleMailMessage` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.mail.javamail.JavaMailSender` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

/** Sends real email via SMTP (used when spring.mail.host is configured). */
public class SmtpEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailSender.class);

    private final JavaMailSender mailSender;
    private final String from;

    public SmtpEmailSender(JavaMailSender mailSender, String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    @Override
    public void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.email;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import org.slf4j.Logger;</code> - Imports `org.slf4j.Logger` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.slf4j.LoggerFactory;</code> - Imports `org.slf4j.LoggerFactory` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.mail.SimpleMailMessage;</code> - Imports `org.springframework.mail.SimpleMailMessage` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.mail.javamail.JavaMailSender;</code> - Imports `org.springframework.mail.javamail.JavaMailSender` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/** Sends real email via SMTP (used when spring.mail.host is configured). */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code>public class SmtpEmailSender implements EmailSender {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
10. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
11. <code>    private static final Logger log = LoggerFactory.getLogger(SmtpEmailSender.class);</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>    private final JavaMailSender mailSender;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
14. <code>    private final String from;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    public SmtpEmailSender(JavaMailSender mailSender, String from) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
17. <code>        this.mailSender = mailSender;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
18. <code>        this.from = from;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
19. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
20. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
21. <code>    @Override</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
22. <code>    public void send(String to, String subject, String body) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
23. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <code>            SimpleMailMessage message = new SimpleMailMessage();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
25. <code>            message.setFrom(from);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
26. <code>            message.setTo(to);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
27. <code>            message.setSubject(subject);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
28. <code>            message.setText(body);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
29. <code>            mailSender.send(message);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
30. <code>        } catch (Exception e) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <code>            log.warn(&quot;Failed to send email to {}: {}&quot;, to, e.getMessage());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
32. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
33. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 16 | `public SmtpEmailSender(JavaMailSender mailSender, String from)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `SmtpEmailSender`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 22 | `public void send(String to, String subject, String body)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `send`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/messaging/NotificationConsumer.java`

### File Purpose
The backend application entry point or shared Java file.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.event.DomainEvent` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.service.NotificationService` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.kafka.annotation.KafkaListener` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Component` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |

### Complete Source
````java
package com.bank.notification.messaging;

import com.bank.common.event.DomainEvent;
import com.bank.notification.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumes the event stream and turns user-facing events into notifications.
 * Its own consumer group means it processes every event independently of the
 * audit consumer.
 */
@Component
public class NotificationConsumer {

    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "${app.events.topic:banking.events}", groupId = "notifications")
    public void onEvent(DomainEvent event) {
        notificationService.handle(event);
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.messaging;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.event.DomainEvent;</code> - Imports `com.bank.common.event.DomainEvent` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.notification.service.NotificationService;</code> - Imports `com.bank.notification.service.NotificationService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import org.springframework.kafka.annotation.KafkaListener;</code> - Imports `org.springframework.kafka.annotation.KafkaListener` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import org.springframework.stereotype.Component;</code> - Imports `org.springframework.stereotype.Component` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
8. <code>/**</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
9. <code> * Consumes the event stream and turns user-facing events into notifications.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
10. <code> * Its own consumer group means it processes every event independently of the</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
11. <code> * audit consumer.</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
12. <code> */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
13. <code>@Component</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
14. <code>public class NotificationConsumer {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    private final NotificationService notificationService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    public NotificationConsumer(NotificationService notificationService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
19. <code>        this.notificationService = notificationService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
20. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
21. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
22. <code>    @KafkaListener(topics = &quot;${app.events.topic:banking.events}&quot;, groupId = &quot;notifications&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>    public void onEvent(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
24. <code>        notificationService.handle(event);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
25. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 18 | `public NotificationConsumer(NotificationService notificationService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `NotificationConsumer`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 23 | `public void onEvent(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `onEvent`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/repo/NotificationRepository.java`

### File Purpose
A repository file: it declares database access methods using Spring Data JPA.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.notification.domain.Notification` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.data.jpa.repository.JpaRepository` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Optional` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.notification.repo;

import com.bank.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByUserIdAndReadFalse(UUID userId);

    Optional<Notification> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByEventId(UUID eventId);
}
````

### Code Walkthrough
1. <code>package com.bank.notification.repo;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.notification.domain.Notification;</code> - Imports `com.bank.notification.domain.Notification` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import org.springframework.data.jpa.repository.JpaRepository;</code> - Imports `org.springframework.data.jpa.repository.JpaRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
6. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import java.util.Optional;</code> - Imports `java.util.Optional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
10. <code>public interface NotificationRepository extends JpaRepository&lt;Notification, UUID&gt; {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
11. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
12. <code>    List&lt;Notification&gt; findByUserIdOrderByCreatedAtDesc(UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
13. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
14. <code>    long countByUserIdAndReadFalse(UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>    Optional&lt;Notification&gt; findByIdAndUserId(UUID id, UUID userId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
17. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
18. <code>    boolean existsByEventId(UUID eventId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
19. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

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

## `backend/src/main/java/com/bank/notification/service/NotificationService.java`

### File Purpose
A service-layer file: it implements business rules, transactions, ownership checks, and orchestration between repositories.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.auth.repo.UserRepository` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.event.DomainEvent` | Project-local dependency connecting this file to another banking module. |
| `com.bank.common.exception.NotFoundException` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.domain.Notification` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.email.EmailSender` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.repo.NotificationRepository` | Project-local dependency connecting this file to another banking module. |
| `org.springframework.dao.DataIntegrityViolationException` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.stereotype.Service` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.transaction.annotation.Transactional` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.notification.service;

import com.bank.auth.repo.UserRepository;
import com.bank.common.event.DomainEvent;
import com.bank.common.exception.NotFoundException;
import com.bank.notification.domain.Notification;
import com.bank.notification.email.EmailSender;
import com.bank.notification.repo.NotificationRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailSender emailSender;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               EmailSender emailSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailSender = emailSender;
    }

    /** Creates a notification (and emails it) for a user-facing event. Idempotent on eventId. */
    @Transactional
    public void handle(DomainEvent event) {
        if (!event.notify() || event.subjectUserId() == null) {
            return;
        }
        if (notificationRepository.existsByEventId(event.eventId())) {
            return;
        }
        String title = humanize(event.action());
        Notification notification = new Notification(
                event.eventId(), event.subjectUserId(), event.action(), title, event.message());
        try {
            notificationRepository.save(notification);
        } catch (DataIntegrityViolationException duplicate) {
            return; // concurrent delivery already inserted it
        }
        userRepository.findById(event.subjectUserId())
                .ifPresent(user -> emailSender.send(user.getEmail(), title, event.message()));
    }

    @Transactional(readOnly = true)
    public List<Notification> list(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long unreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(UUID userId, UUID notificationId) {
        Notification n = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        n.setRead(true);
    }

    @Transactional
    public void markAllRead(UUID userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .forEach(n -> n.setRead(true));
    }

    private String humanize(String action) {
        String[] parts = action.toLowerCase().split("_");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p.isEmpty()) continue;
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(' ');
        }
        return sb.toString().trim();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.service;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.auth.repo.UserRepository;</code> - Imports `com.bank.auth.repo.UserRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.common.event.DomainEvent;</code> - Imports `com.bank.common.event.DomainEvent` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.common.exception.NotFoundException;</code> - Imports `com.bank.common.exception.NotFoundException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import com.bank.notification.domain.Notification;</code> - Imports `com.bank.notification.domain.Notification` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import com.bank.notification.email.EmailSender;</code> - Imports `com.bank.notification.email.EmailSender` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import com.bank.notification.repo.NotificationRepository;</code> - Imports `com.bank.notification.repo.NotificationRepository` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.dao.DataIntegrityViolationException;</code> - Imports `org.springframework.dao.DataIntegrityViolationException` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.stereotype.Service;</code> - Imports `org.springframework.stereotype.Service` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.transaction.annotation.Transactional;</code> - Imports `org.springframework.transaction.annotation.Transactional` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
13. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>@Service</code> - Spring stereotype. Component scanning registers this class as a singleton service bean.
17. <code>public class NotificationService {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
18. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
19. <code>    private final NotificationRepository notificationRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
20. <code>    private final UserRepository userRepository;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
21. <code>    private final EmailSender emailSender;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
22. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
23. <code>    public NotificationService(NotificationRepository notificationRepository,</code> - Declares a method or constructor. Parameters are placed in the call frame; the body runs when application code or Spring invokes it.
24. <code>                               UserRepository userRepository,</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
25. <code>                               EmailSender emailSender) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
26. <code>        this.notificationRepository = notificationRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
27. <code>        this.userRepository = userRepository;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
28. <code>        this.emailSender = emailSender;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
29. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
30. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
31. <code>    /** Creates a notification (and emails it) for a user-facing event. Idempotent on eventId. */</code> - Comment/documentation. The compiler or interpreter ignores it at runtime, but it records intent for maintainers.
32. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
33. <code>    public void handle(DomainEvent event) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
34. <code>        if (!event.notify() || event.subjectUserId() == null) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
36. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
37. <code>        if (notificationRepository.existsByEventId(event.eventId())) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
38. <code>            return;</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
39. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
40. <code>        String title = humanize(event.action());</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
41. <code>        Notification notification = new Notification(</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
42. <code>                event.eventId(), event.subjectUserId(), event.action(), title, event.message());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
43. <code>        try {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
44. <code>            notificationRepository.save(notification);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
45. <code>        } catch (DataIntegrityViolationException duplicate) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
46. <code>            return; // concurrent delivery already inserted it</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
47. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
48. <code>        userRepository.findById(event.subjectUserId())</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
49. <code>                .ifPresent(user -&gt; emailSender.send(user.getEmail(), title, event.message()));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
50. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
51. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
52. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
53. <code>    public List&lt;Notification&gt; list(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
54. <code>        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);</code> - Returns a value/reference to the caller and ends this execution path.
55. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
57. <code>    @Transactional(readOnly = true)</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
58. <code>    public long unreadCount(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>        return notificationRepository.countByUserIdAndReadFalse(userId);</code> - Returns a value/reference to the caller and ends this execution path.
60. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
61. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
62. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
63. <code>    public void markRead(UUID userId, UUID notificationId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
64. <code>        Notification n = notificationRepository.findByIdAndUserId(notificationId, userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
65. <code>                .orElseThrow(() -&gt; new NotFoundException(&quot;Notification not found&quot;));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
66. <code>        n.setRead(true);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
67. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
68. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
69. <code>    @Transactional</code> - Spring transaction boundary. Database work inside the method commits together or rolls back on failure.
70. <code>    public void markAllRead(UUID userId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
71. <code>        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
72. <code>                .forEach(n -&gt; n.setRead(true));</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
73. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
74. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
75. <code>    private String humanize(String action) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
76. <code>        String[] parts = action.toLowerCase().split(&quot;_&quot;);</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
77. <code>        StringBuilder sb = new StringBuilder();</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
78. <code>        for (String p : parts) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
79. <code>            if (p.isEmpty()) continue;</code> - Conditional branch. Runtime evaluates the boolean expression and executes the guarded block only when true.
80. <code>            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(&#x27; &#x27;);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
81. <code>        }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
82. <code>        return sb.toString().trim();</code> - Returns a value/reference to the caller and ends this execution path.
83. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
84. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 33 | `public void handle(DomainEvent event)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `handle`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 53 | `public List&lt;Notification&gt; list(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 58 | `public long unreadCount(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `unreadCount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 63 | `public void markRead(UUID userId, UUID notificationId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `markRead`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 70 | `public void markAllRead(UUID userId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `markAllRead`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 75 | `private String humanize(String action)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `humanize`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

## `backend/src/main/java/com/bank/notification/web/NotificationController.java`

### File Purpose
A web-controller file: it maps HTTP routes to service methods and shapes HTTP responses.

**Why it exists:** This file owns one small part of the system so the rest of the project does not duplicate that responsibility.

**How the project depends on it:** Build tools, Spring Boot, React, tests, or runtime code load it from its path and expect the behavior described here.

**What would happen if removed:** The related module would fail to compile, lose a route/configuration/schema asset, or stop documenting an important workflow.

### Imports
| Import | Why it is needed / what happens if removed |
|---|---|
| `com.bank.common.SecurityUtils` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.dto.NotificationResponse` | Project-local dependency connecting this file to another banking module. |
| `com.bank.notification.service.NotificationService` | Project-local dependency connecting this file to another banking module. |
| `io.swagger.v3.oas.annotations.Operation` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.security.SecurityRequirement` | External or local dependency required by references in this file. |
| `io.swagger.v3.oas.annotations.tags.Tag` | External or local dependency required by references in this file. |
| `org.springframework.http.ResponseEntity` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.GetMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PathVariable` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.PostMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RequestMapping` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `org.springframework.web.bind.annotation.RestController` | Spring framework dependency used for dependency injection, web routing, security, transactions, configuration, or testing. |
| `java.util.List` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.Map` | JDK API; removing it breaks compilation if the referenced class is still used. |
| `java.util.UUID` | JDK API; removing it breaks compilation if the referenced class is still used. |

### Complete Source
````java
package com.bank.notification.web;

import com.bank.common.SecurityUtils;
import com.bank.notification.dto.NotificationResponse;
import com.bank.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "In-app notification feed")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "List my notifications (newest first)")
    public List<NotificationResponse> list() {
        return notificationService.list(SecurityUtils.currentUserId()).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Count my unread notifications")
    public Map<String, Long> unreadCount() {
        return Map.of("count", notificationService.unreadCount(SecurityUtils.currentUserId()));
    }

    @PostMapping("/{notificationId}/read")
    @Operation(summary = "Mark a notification read")
    public ResponseEntity<Void> read(@PathVariable UUID notificationId) {
        notificationService.markRead(SecurityUtils.currentUserId(), notificationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/read-all")
    @Operation(summary = "Mark all my notifications read")
    public ResponseEntity<Void> readAll() {
        notificationService.markAllRead(SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}
````

### Code Walkthrough
1. <code>package com.bank.notification.web;</code> - Declares the Java package namespace. Compile time uses it to locate classes; runtime class metadata keeps the same qualified name.
2. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
3. <code>import com.bank.common.SecurityUtils;</code> - Imports `com.bank.common.SecurityUtils` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
4. <code>import com.bank.notification.dto.NotificationResponse;</code> - Imports `com.bank.notification.dto.NotificationResponse` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
5. <code>import com.bank.notification.service.NotificationService;</code> - Imports `com.bank.notification.service.NotificationService` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
6. <code>import io.swagger.v3.oas.annotations.Operation;</code> - Imports `io.swagger.v3.oas.annotations.Operation` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
7. <code>import io.swagger.v3.oas.annotations.security.SecurityRequirement;</code> - Imports `io.swagger.v3.oas.annotations.security.SecurityRequirement` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
8. <code>import io.swagger.v3.oas.annotations.tags.Tag;</code> - Imports `io.swagger.v3.oas.annotations.tags.Tag` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
9. <code>import org.springframework.http.ResponseEntity;</code> - Imports `org.springframework.http.ResponseEntity` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
10. <code>import org.springframework.web.bind.annotation.GetMapping;</code> - Imports `org.springframework.web.bind.annotation.GetMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
11. <code>import org.springframework.web.bind.annotation.PathVariable;</code> - Imports `org.springframework.web.bind.annotation.PathVariable` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
12. <code>import org.springframework.web.bind.annotation.PostMapping;</code> - Imports `org.springframework.web.bind.annotation.PostMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
13. <code>import org.springframework.web.bind.annotation.RequestMapping;</code> - Imports `org.springframework.web.bind.annotation.RequestMapping` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
14. <code>import org.springframework.web.bind.annotation.RestController;</code> - Imports `org.springframework.web.bind.annotation.RestController` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
15. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
16. <code>import java.util.List;</code> - Imports `java.util.List` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
17. <code>import java.util.Map;</code> - Imports `java.util.Map` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
18. <code>import java.util.UUID;</code> - Imports `java.util.UUID` so the short class name can be used below. Removing it causes a compile error unless the code switches to a fully qualified name or stops using it.
19. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
20. <code>@RestController</code> - Spring MVC stereotype. Methods in this class can handle HTTP requests and serialize return values as JSON.
21. <code>@RequestMapping(&quot;/api/v1/notifications&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
22. <code>@Tag(name = &quot;Notifications&quot;, description = &quot;In-app notification feed&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
23. <code>@SecurityRequirement(name = &quot;bearerAuth&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
24. <code>public class NotificationController {</code> - Declares a Java type. The compiler emits class metadata; objects allocate heap memory only when instances are constructed.
25. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
26. <code>    private final NotificationService notificationService;</code> - Declares immutable object state or a constant. Final references are assigned once, improving safety and dependency-injection clarity.
27. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
28. <code>    public NotificationController(NotificationService notificationService) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
29. <code>        this.notificationService = notificationService;</code> - Assignment or variable initialization. Runtime evaluates the right side and stores the result in a local variable, field, or reference.
30. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
31. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
32. <code>    @GetMapping</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
33. <code>    @Operation(summary = &quot;List my notifications (newest first)&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
34. <code>    public List&lt;NotificationResponse&gt; list() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
35. <code>        return notificationService.list(SecurityUtils.currentUserId()).stream()</code> - Returns a value/reference to the caller and ends this execution path.
36. <code>                .map(NotificationResponse::from)</code> - Java code line participating in the current declaration or expression; the compiler type-checks it and runtime follows Java execution order.
37. <code>                .toList();</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
38. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
39. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
40. <code>    @GetMapping(&quot;/unread-count&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
41. <code>    @Operation(summary = &quot;Count my unread notifications&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
42. <code>    public Map&lt;String, Long&gt; unreadCount() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
43. <code>        return Map.of(&quot;count&quot;, notificationService.unreadCount(SecurityUtils.currentUserId()));</code> - Returns a value/reference to the caller and ends this execution path.
44. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
45. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
46. <code>    @PostMapping(&quot;/{notificationId}/read&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
47. <code>    @Operation(summary = &quot;Mark a notification read&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
48. <code>    public ResponseEntity&lt;Void&gt; read(@PathVariable UUID notificationId) {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
49. <code>        notificationService.markRead(SecurityUtils.currentUserId(), notificationId);</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
50. <code>        return ResponseEntity.noContent().build();</code> - Returns a value/reference to the caller and ends this execution path.
51. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
52. <em>blank line</em> - Blank separator. It has no runtime behavior; it improves human parsing and keeps related code grouped.
53. <code>    @PostMapping(&quot;/read-all&quot;)</code> - Spring MVC route mapping. It connects an HTTP method/path to a Java method.
54. <code>    @Operation(summary = &quot;Mark all my notifications read&quot;)</code> - Java annotation. A framework or compiler reads this metadata to alter validation, persistence, security, or wiring behavior.
55. <code>    public ResponseEntity&lt;Void&gt; readAll() {</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
56. <code>        notificationService.markAllRead(SecurityUtils.currentUserId());</code> - Java statement. It performs a call, declaration, assignment, or expression step, then control moves to the next statement.
57. <code>        return ResponseEntity.noContent().build();</code> - Returns a value/reference to the caller and ends this execution path.
58. <code>    }</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.
59. <code>}</code> - Structural delimiter. It defines a block, object initializer, method body, or statement boundary for the compiler.

### Functions
| Line | Function or method | Inputs | Output | Execution flow and complexity |
|---:|---|---|---|---|
| 28 | `public NotificationController(NotificationService notificationService)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `NotificationController`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 34 | `public List&lt;NotificationResponse&gt; list()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `list`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 42 | `public Map&lt;String, Long&gt; unreadCount()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `unreadCount`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. O(n) over the returned collection or generated rows; database work depends on indexes and result size. |
| 48 | `public ResponseEntity&lt;Void&gt; read(@PathVariable UUID notificationId)` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `read`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |
| 55 | `public ResponseEntity&lt;Void&gt; readAll()` | Parameters inside the signature; framework annotations may bind HTTP bodies, path variables, or config values. | Return type shown in the signature, or `void` if none. | Purpose inferred from `readAll`. Runtime executes top to bottom; local variables live on the stack/reference graph until the call returns. Usually O(1), except repository/database calls depend on indexed query cost and returned row count. |

### Common Mistakes
- Editing this file without understanding which tool or framework consumes it.
- Changing names or paths without updating callers, imports, routes, migrations, or build configuration.
- Treating generated/runtime behavior as magic instead of following the call path from this file to its consumer.

### Possible Improvements
- Add targeted comments only where future readers need extra context.
- Add or update tests when behavior changes.
- Keep responsibilities narrow so the file remains easy to reason about.


---

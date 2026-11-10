# Banking System Textbook

This documentation set turns the Banking System project into a software-engineering walkthrough. It is written for a computer-science student who wants to rebuild the application without AI by understanding the architecture, the folders, the files, the dependencies, and the runtime flows.

## How to Read This Book

1. Start with Chapters 1-3 to understand the problem, architecture, and folder layout.
2. Read Chapters 4-10 to understand backend design, frontend design, testing, deployment, and rebuild order.
3. Use the appendices when you want line-by-line study of a specific file.
4. Keep the source tree open while reading; the appendices quote the source, but navigating the real files trains your engineering eye.

## Coverage Boundary

Covered: source-controlled backend code, frontend code, resources, SQL migrations, tests, CI, Docker, Maven, npm, TypeScript, and static assets.

Excluded: generated or downloaded output such as `frontend/node_modules/`, `frontend/dist/`, `backend/target/`, `.git/`, and IDE metadata. Those are products of the build or local machine, not the project design.

## Table of Contents

- [Chapter 1: Project Overview](01-project-overview.md)
- [Chapter 2: Project Architecture](02-project-architecture.md)
- [Chapter 3: Folder Structure](03-folder-structure.md)
- [Chapter 4: Backend Foundations](04-backend-foundations.md)
- [Chapter 5: Domain Model and Database](05-domain-model-and-database.md)
- [Chapter 6: Money Movement Flows](06-money-movement-flows.md)
- [Chapter 7: Auth, Security, and User Management](07-auth-security-user-management.md)
- [Chapter 8: Frontend Application](08-frontend-application.md)
- [Chapter 9: Testing, CI, and Deployment](09-testing-ci-deployment.md)
- [Chapter 10: Rebuild From Scratch](10-rebuild-from-scratch.md)
- [Appendix A: Backend Auth, Customer, Admin, Common, and Application Files](appendix-a-backend-foundation-line-by-line.md)
- [Appendix B: Backend Accounts, Ledger, and Transfers](appendix-b-backend-money-line-by-line.md)
- [Appendix C: Backend Cards, Payments, and Loans](appendix-c-backend-products-line-by-line.md)
- [Appendix D: Backend Resources, Tests, Maven, and Docker](appendix-d-backend-resources-tests-line-by-line.md)
- [Appendix E: Frontend Source and Assets](appendix-e-frontend-source-line-by-line.md)
- [Appendix F: Root Infrastructure and Project Documents](appendix-f-root-infra-line-by-line.md)

## File Coverage Report

- Backend main Java files: 129
- Backend resource/config/migration files: 9
- Backend test files: 9
- Backend build/support files: 7
- Frontend source/static files: 29
- Frontend build/config files: 11
- Root infrastructure/docs files: 6
- Total covered files: 200

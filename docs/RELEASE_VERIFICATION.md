# BankApp — Release Verification Record

**Verification date:** 2026-11-12  
**Repository:** `jaackdoe35-sudo/BankApp`  
**Branch:** `remove-kyc-disable-withdrawals`  
**Pull request:** [PR #1](https://github.com/jaackdoe35-sudo/BankApp/pull/1) — open and draft; not merged  
**Release classification:** Public synthetic demonstration is deployed. Full authenticated release acceptance is still pending.

## Deployed resources

| Component | Resource | Verified state |
|---|---|---|
| Frontend | https://bankapp-withdrawal-lab.vercel.app | Production deployment READY |
| Activity Ledger page | https://bankapp-withdrawal-lab.vercel.app/test-ledger/ | HTTP 200 |
| Backend | https://banking-backend-nzjt.onrender.com | Render deployment LIVE |
| Database | Neon project `bankapp-withdrawal-lab`, database `banking` | Connected; schema version 9 |
| Redis | Render key-value store `bankapp-refresh-redis` | Configured; application uses production profile |

### Deployment evidence

- Render deployment `dep-dbqlh88ae00c738p5i70` reached `live` on commit `cbcd243f7d714828543145392ccf583a63b3168b`.
- Render logs recorded `Tomcat started on port 8080` and `Started BankingBackendApplication`.
- Flyway validated all nine migrations; schema version 9 was up to date.
- The latest Vercel production deployment is `dpl_CexwMg5iYCAsuy21ZhvqaejkyJbm`, target `production`, state `READY`, commit `cbcd243f7d714828543145392ccf583a63b3168b`.
- The production domain and `/test-ledger/` both returned HTTP 200 after that deployment.
- GitHub Actions CI run `43158455691` (run #347) completed successfully: backend Maven verification and frontend build, dependency audit and Playwright browser checks all completed successfully.

## Verified live checks

| Check | Result | Evidence |
|---|---|---|
| Backend health | PASS | `GET /actuator/health` returned HTTP 200 and `status=UP` |
| Backend ping | PASS | `GET /api/v1/ping` returned HTTP 200 and `status=UP` |
| Production-origin CORS | PASS | OPTIONS preflight returned HTTP 200 and allowed `https://bankapp-withdrawal-lab.vercel.app` |
| Preview-origin CORS | PASS | OPTIONS preflight returned HTTP 200 and allowed the branch preview origin |
| Anonymous admin event access | PASS | `GET /api/v1/admin/experiments/events` returned HTTP 401 |
| Anonymous admin file download | PASS | `GET /api/v1/admin/experiments/files/{id}` returned HTTP 401 |
| Experiment session creation | PASS | `POST /api/v1/experiment/sessions` returned HTTP 201 |
| Remote event persistence | PASS | Two synthetic events returned HTTP 201 and were confirmed in Neon |
| Remote file persistence | PASS | Synthetic text file upload returned HTTP 201 and file metadata was confirmed in Neon |
| File digest at source | PASS | Local SHA-256 matched the SHA-256 returned by the upload API and stored in Neon |
| Production frontend routes | PASS | Root application and `/test-ledger/` returned HTTP 200 |

## Synthetic remote-capture test

A dedicated experiment session was created against the deployed backend. Two synthetic events were submitted through the experiment API:

1. `synthetic_withdrawal_test`: test account `TEST-ACCOUNT-0001`, NGN 1,250, status `SIMULATED_REJECTED`, balance before and after both 50,000.
2. `synthetic_card_capture_test`: test account `TEST-ACCOUNT-0002`, NGN 3,750, status `SIMULATED_CAPTURE_ONLY`, balance before and after both 50,000.

Both records were found in `public.experiment_events`. The account numbers and non-secret payload fields were retained. The database check returned zero rows in the `transactions` and `payments` tables for this test state. These were direct API-level integration tests, not proof that a user submitted the forms through the browser UI.

A synthetic text file named `bankapp-evidence.txt` was uploaded. The API returned file ID `96eec3d9-dcf0-4929-afa4-4c07593de82a`, size 74 bytes, and SHA-256:

`47279f280fe45b4737ee215afc62e75caa6ea4de8387de833c5ac5dda9ae45f8`

The same digest and 74-byte size were confirmed from the local source file; the file metadata and digest were also confirmed in Neon.

## Administrator credential bootstrap

- The existing `jaack.doe35@gmail.com` account was confirmed as role `ADMIN`, enabled.
- A new 48-character random password was generated and submitted as the Render `ADMIN_PASSWORD` secret.
- The administrator row's `updated_at` changed to `2026-11-12T06:05:49.725Z` during the bootstrap deployment, consistent with the guarded reset having updated the existing account.
- `SEED_ADMIN=false` and `SEED_ADMIN_RESET_EXISTING=false` were then submitted and the subsequent Render deployment reached `live`, preventing future startup resets.
- The password value is intentionally excluded from this repository and document. Keep the copy provided in the ChatGPT conversation in a user-controlled password manager.

**Important:** A successful administrator password login and access to the protected ledger have not yet been independently confirmed. The database role and password-reset timestamp do not substitute for a successful authentication test.

## Remaining acceptance checks

These items must be completed before describing the application as fully release-verified:

- [ ] Perform a successful administrator login with the newly generated credential.
- [ ] Verify `GET /api/v1/users/me` returns the expected ADMIN identity.
- [ ] Verify an authenticated administrator can list remote events and files.
- [ ] Verify an authenticated administrator can download the uploaded file and that the downloaded bytes hash to the stored SHA-256.
- [ ] Verify a CUSTOMER token receives HTTP 403 from the admin event and file endpoints.
- [ ] Submit payment and withdrawal test forms through the deployed browser application, then verify their event and file records in Neon.
- [ ] Verify refresh-token rotation, replay rejection and logout/revocation against the live backend.
- [ ] Complete a browser walkthrough of the production site on desktop and mobile, including upload validation and language switching.
- [ ] Review production logs after the authenticated UI test and confirm no secrets or authentication tokens are logged.

## Security and release boundaries

- This is a synthetic banking/security demonstration, not a real bank.
- External payment processing is disabled; Render startup logs explicitly identify the payment gateway as simulated.
- Do not submit real customer data, real credentials, identity documents or financial information.
- Account numbers are retained as test evidence; passwords, PINs, OTPs, tokens and other secrets must remain redacted.
- No real transfer, payment settlement, withdrawal debit or balance mutation is authorized.
- PR #1 remains open and draft. It has not been merged.
- The public frontend is live, but full authenticated acceptance remains pending. Do not claim all release checks passed until the outstanding checklist is completed.

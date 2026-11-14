# Test Ledger

A standalone, browser-only experiment journal for documenting tests against the fictional BankApp.

## Run

Open `index.html` in a modern browser, or serve this directory as a static site. No build step, dependencies, API, backend, or account is required.

## Data handling

- Entries are stored in the browser's `localStorage` on the current device/browser profile.
- There is no network request, server endpoint, email delivery, analytics, or integration with BankApp.
- Use synthetic codes and fictional bank details only. Do not enter real account details, passwords, session cookies, access tokens, or real authentication codes.
- Export JSON regularly for a full backup. CSV export is available for spreadsheet review.
- Import merges entries by ID and avoids duplicate records.

## What each experiment records

Timestamp, title, attempt method, checkbox selected state, separately typed synthetic code, fictional bank details, request/action description, observed response, before/after balance, ledger outcome, and notes/evidence references.

The checkbox is a boolean control; the typed-code field is separate because a checkbox cannot contain text or numbers.

## Scope

This is an external journal, not part of BankApp's customer interface. It does not perform withdrawal requests or change BankApp data. Record network requests and responses by pasting sanitized evidence into the relevant fields.

# Security Notes

This repository is intentionally sanitized for public review.

## Rules used here

- No production API keys, access tokens, customer records, phone lists, or company secrets are stored in the repository.
- Real credentials must be supplied through environment variables or a managed secret store.
- Service-role credentials are server-only and must never be exposed to browser code.
- Webhook payloads are validated before use.
- External API responses are treated as fallible and may require retry/backoff logic.
- Live-message or destructive actions should have explicit safeguards such as test mode, approval gates, idempotency keys, or kill switches.
- Logs should avoid storing secrets and unnecessary personal data.

## Public portfolio scope

The examples in this repository are simplified and sanitized patterns derived from real integration work. They are not a copy of any employer/client production codebase.

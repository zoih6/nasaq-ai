# Security policy

## Prototype boundary

Nasaq AI is currently a frontend prototype backed by deterministic, typed mock data. It does not perform real payments, provider calls, email delivery, uploads, database writes, or external side effects.

## Secrets

- Never commit API keys, database URLs, personal access tokens, or `.env*` files.
- Never expose management credentials through `NEXT_PUBLIC_*` variables.
- Use Vercel encrypted environment variables for server-only secrets when backend integration begins.
- Use scoped, short-lived credentials where available and rotate any credential pasted into chat, tickets, or logs.
- Provider keys must remain server-side, encrypted at rest, and must never be returned by an API after storage.

## Reporting

Until a private security contact is configured, report vulnerabilities privately to the repository owner through GitHub Security Advisories. Do not open a public issue containing exploit details or credentials.

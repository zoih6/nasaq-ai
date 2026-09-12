# Agent Context

This directory is the durable handoff layer for humans and agents working on Nasaq.

## Read order

1. [`../../AGENTS.md`](../../AGENTS.md) — standing project rules and instruction priority.
2. [`../../AGENT-OPERATING-METHOD.md`](../../AGENT-OPERATING-METHOD.md) — portable evidence-led workflow for tool-using agents.
3. [`CURRENT-STATE.md`](CURRENT-STATE.md) — exact active milestone, known baseline, and immediate next actions.
4. [`HANDOFF.md`](HANDOFF.md) — restart checklist and operational commands.
5. [`DECISIONS.md`](DECISIONS.md) — consequential choices and rationale.
6. [`../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md) — product-agent evidence, NO-GO decision, gaps, risks, gates, and remediation plan.
7. [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — restart-ready execution request; use only when beginning U2 implementation.
8. [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md) — mandatory U2 separation from future Agent Runtime.
9. [`WORKLOG.md`](WORKLOG.md) — concise chronological record.
10. [`../../agent-skills-web-uiux/README.md`](../../agent-skills-web-uiux/README.md) — audited skill/UI/UX research library; load relevant extracts only.

Long-form product, design, architecture, and verification documents remain in `docs/00-vision` through `docs/04-delivery`; this directory links them rather than duplicating them. U2 is governed by `docs/01-product/U2-SERVICE-DEPTH.md`, `docs/04-delivery/U2-TRACEABILITY-AND-QA.md`, and the mandatory boundary addendum. Product-agent Backend is governed by the readiness audit and remains NO-GO until its gates pass. Its delivery receipt is `docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md`; the operating-method evidence receipt is `docs/04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md`.

## Update protocol

Update this context whenever a consequential implementation, test gate, commit, deployment, or scope decision changes. Use exact commit and deployment identifiers once known. Never copy access tokens or other secrets here.

# Agent Context

This directory is the durable handoff layer for humans and agents working on Nasaq.

## Read order

1. [`../../AGENTS.md`](../../AGENTS.md) — standing product and engineering rules.
2. [`CURRENT-STATE.md`](CURRENT-STATE.md) — exact active milestone, known baseline, and immediate next actions.
3. [`HANDOFF.md`](HANDOFF.md) — restart checklist and operational commands.
4. [`DECISIONS.md`](DECISIONS.md) — consequential choices and rationale.
5. [`WORKLOG.md`](WORKLOG.md) — concise chronological record.

Long-form product, design, architecture, and verification documents remain in `docs/00-vision` through `docs/04-delivery`; this directory links them rather than duplicating them.

## Update protocol

Update this context whenever a consequential implementation, test gate, commit, deployment, or scope decision changes. Use exact commit and deployment identifiers once known. Never copy access tokens or other secrets here.

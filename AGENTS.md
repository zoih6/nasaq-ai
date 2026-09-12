# AGENTS.md — Nasaq AI

This repository is the source of truth for the Nasaq universal AI platform prototype. Read this file before changing code, then read `docs/05-agent-context/README.md` and `docs/05-agent-context/CURRENT-STATE.md`.

## Product contract

- Nasaq is for everyone, not only professionals, teams, or businesses.
- The experience is goal-first: adapt to what a person wants to accomplish, never to a job title.
- Arabic is first-class and English is complete. Preserve RTL/LTR parity in every change.
- The current phase is frontend architecture and interactive simulation only. Do not imply that a real model, provider, database, payment, or external action ran.
- The public direction is luminous, spacious, future-facing, professional, flexible, and interactive.
- The core model is a hybrid adaptive experience: one central intelligent composer plus clear service spaces.
- Future access is hybrid BYOK plus unified credit, but it is not the public interface's primary message.

## Required workflow

1. Read the current-state and handoff files before implementation.
2. Inspect existing contracts and tests before editing.
3. Keep changes small, typed, bilingual, responsive, and accessible.
4. Test keyboard, screen-reader semantics, reduced motion, RTL/LTR, responsive layouts, and Chromium/Firefox/WebKit when the affected surface warrants it.
5. Run `npm run check` before delivery. Run the relevant Playwright gates and `npm audit` for milestone work.
6. Update `docs/05-agent-context/CURRENT-STATE.md`, `WORKLOG.md`, `DECISIONS.md`, and `HANDOFF.md` after every consequential milestone.
7. For a completed milestone, update its verification receipt in `docs/04-delivery/`, commit, push to `main`, wait for Vercel `READY`, and verify the production alias.

## Engineering constraints

- Package manager: `npm@11.6.4` (the repository root declares it).
- Do not re-enable locale-link prefetch without validating segment prefetch; it previously caused 404s.
- Keep Library search on `onInput`; WebKit requires the current behavior.
- With `exactOptionalPropertyTypes`, omit optional properties instead of explicitly passing `undefined` when a type does not accept it.
- Axe runs are authoritative on Chromium and Firefox. WebKit remains an interaction, layout, and overflow gate because injected Axe is unstable there.
- Do not combine all visual viewports into one test and do not use full-page WebKit screenshots.
- Bind preview servers to `0.0.0.0` and make browser-facing calls through relative URLs.
- Never put credentials, tokens, private keys, `.env` values, or credential-bearing remote URLs in source, docs, logs, screenshots, commits, or agent-context files.

## Current milestone

U1.2 — Motion & Feedback Language. Its active specification, research, implementation status, and next steps live in `docs/05-agent-context/CURRENT-STATE.md` and `docs/02-design/MOTION-AND-FEEDBACK.md`.

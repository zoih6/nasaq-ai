# Worklog

## 2026-09-12 — U1.2 started

- Confirmed clean U1.1 production baseline at `2c1d9e5ced7e60a6514857c2b2f1222f1430914f`.
- Audited motion, timers, loading, ready, empty, dialog, drawer, panel, and live-region behavior across Universal marketing, app shell, adaptive home, service workspaces, Library, and route loading.
- Researched Material, Carbon, Fluent, Apple HIG, Motion, MDN, W3C WCAG, NN/g, open-source repositories, Reddit, and X discussions.
- Identified unbounded decorative loops on the marketing live indicator and floating scene cards; these must be bounded or removed.
- Chose a CSS-token-first implementation with small shared React status primitives rather than adding a runtime animation dependency.
- Added `AGENTS.md` and this durable agent-context directory. No U1.2 product code had been changed at this log entry.

## 2026-09-12 — U1.2 implemented and locally verified

- Added centralized duration/easing/distance/activity tokens and a dedicated `motion.css` layer.
- Added shared typed working/success/error/info feedback and persistent toast primitives.
- Applied finite motion and open/closed focus gating across marketing menu, shell drawer/backdrop, advanced disclosure, notifications, command palette, personalization dialog, and route changes.
- Added explicit validation/recovery, busy, success, cancellation, and empty-state recovery to Home, Service Workspace, marketing demo, and Library.
- Removed unbounded marketing float/live loops; retained only active busy motion and a static reduced-motion equivalent.
- Added `motion-feedback.spec.ts`; the gate exposed and drove fixes for bottom-sheet viewport escape, scale-reduced touch targets, a shrinking topbar avatar, and stale completion timers.
- Local results: check PASS; Vitest 4/4; 57-page build; audit 0; full Chromium 46/46; cross-browser U1/U1.1/U1.2 88 passed + 2 expected skips from 90.
- Captured nine U1.2 visual states; every route returned 200 with zero document overflow and zero browser errors.

## 2026-09-12 — U1.2 deployed and production-verified

- Committed the U1.2 implementation as `89ed5294637ca455636496c9e3bc88a1a7a2ec22` and pushed it to GitHub `main`.
- Verified matching Vercel deployment `dpl_HWsQ7JrCqrFZFQY4tbahjyfCwF39` reached `READY` and served <https://nasaq-ai.vercel.app>.
- Ran the live U1.2 gate on Chromium, Firefox, and WebKit: **22 PASS + 2 expected forced-colors skips / 24**.
- Ran the live U1/U1.1 Chromium regression across ten viewports and core flows: **22/22 PASS**.
- The first WebKit reduced-motion run missed the deliberately brief working state because protocol round-trips exceeded its 760ms lifetime. Capturing the DOM state and computed animation styles inside one browser task removed that test race; the targeted rerun and complete live gate passed without a product-code change.
- Restored three legacy evidence screenshots touched by the production regression so the final delivery update does not rewrite prior milestone evidence.
- Updated the receipt, root README, and durable agent context. U1.2 is closed; U2 Service Depth is next.

## Prior stable milestone — U1.1

- Implemented responsive shell modes, touch sizing, safe areas, RTL/LTR behavior, reduced-motion and contrast handling, and WebKit corrections.
- Local gates: check passed; Vitest 4/4; build 57 pages; Chromium 38/38; cross-browser 66/66; audit 0 vulnerabilities.
- Production gate passed 22/22; final alias smoke passed 3/3.

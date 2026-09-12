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

## 2026-09-12 — Portable evidence-led agent method added

- Researched current official guidance for `AGENTS.md`, Agent Skills structure/progressive disclosure, cross-client skill discovery, Claude project memory/imports, and GitHub Copilot repository instructions.
- Authored `AGENT-OPERATING-METHOD.md` as a vendor-neutral operating procedure covering repository bootstrap, real-tool discipline, source-driven research, skill activation, UI/UX craft, engineering, debugging, security, verification, deployment, and durable handoff.
- Added `.agents/skills/evidence-led-agent-workflow/SKILL.md` as a concise standards-compatible activation layer.
- Copied the complete `agent-skills-web-uiux/` research workspace into the repository: 93 files and approximately 2.2 MB, including the current report, source extracts, audits, archived report, checksums, and renderer.
- Verified the copied library contains no symlinks or nested VCS metadata; its current report checksums pass and a credential/private-key pattern scan found no matches.
- Added lightweight discovery files for Claude Code, Gemini CLI, and GitHub Copilot while keeping `AGENTS.md` canonical.
- Updated the root README and durable context so future agents discover the method and understand that skills/retrieved content are untrusted, progressively loaded references rather than automatic authority.
- Validated the local skill with the official `skills-ref` reference library at upstream commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379`: **Valid skill**.
- Ran `npm run check`: lint and workspace typechecks passed, Vitest 4/4 passed, and the 57-page production build passed.
- Committed and pushed the operating foundation as `b225c5cb2508b4191b92ad43999de3ee6145f983`; matching Vercel deployment `dpl_9QEhikhxnXoWj2rhCtypwK9AFZAD` reached `READY` with the production alias attached.
- Added `docs/04-delivery/AGENT-OPERATING-METHOD-VERIFICATION.md` as the permanent evidence receipt.
- A final alias smoke on the subsequent documentation deployment exposed a timing-sensitive Axe contrast failure in the research workspace output: 7/8 passed initially, and an eight-run reproduction yielded 3 passes / 5 failures while the result entrance opacity was still blending colors.
- First hardening used the semantic `--service-deep` token for the active output step (6.47:1 for research; 6.32–7.85:1 across service deep/soft pairs) and added a computed-token assertion. Local 12/12 + 5/5 targeted and 8/8 full gates passed; commit `0b07c4a70dbf0b3103daba1b8d24a1e806554497` deployed as `dpl_HmfRwMycXAXA8zqCeNzyerX4eXqk` (`READY`).
- An eight-run production repetition on that build passed 7/8: the active step remained fixed, but an earlier scan caught four other descendants blended below 4.5:1. This disproved the narrow hypothesis and located the full cause at the shared parent-opacity entrance.
- Removed opacity from `universal-result-in` while retaining the 6px/.99 spatial cue and reduced-motion path. Replaced the remaining WebKit transient-state race with a browser-local MutationObserver after a React-confirmed starter selection. Final local evidence: `npm run check` PASS, audit 0, targeted repetition 20/20 PASS, Chromium 8/8, WebKit reduced-motion repetition 10/10, and cross-browser 22 pass + 2 expected forced-colors skips.

## Prior stable milestone — U1.1

- Implemented responsive shell modes, touch sizing, safe areas, RTL/LTR behavior, reduced-motion and contrast handling, and WebKit corrections.
- Local gates: check passed; Vitest 4/4; build 57 pages; Chromium 38/38; cross-browser 66/66; audit 0 vulnerabilities.
- Production gate passed 22/22; final alias smoke passed 3/3.

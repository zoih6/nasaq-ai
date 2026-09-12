# Handoff

## Restart checklist

1. `cd /home/user/projects/nasaq-ai`
2. Read `AGENTS.md` and `docs/05-agent-context/CURRENT-STATE.md`.
3. Run `git status --short --branch` and `git log -3 --oneline`.
4. Confirm `main` is synchronized before starting a new milestone.
5. If dependencies were not restored in the snapshot, run `npx npm@11.6.4 ci`.

## Current handoff point

**U1.2 — Motion & Feedback Language is complete.** Its implementation, local evidence, GitHub push, Vercel deployment, and live browser gates are closed.

- Implementation commit: `89ed5294637ca455636496c9e3bc88a1a7a2ec22`
- Verified deployment: `dpl_HWsQ7JrCqrFZFQY4tbahjyfCwF39` (`READY`)
- Production alias: <https://nasaq-ai.vercel.app>
- Live U1.2 gate: **22 PASS + 2 expected skips / 24** across Chromium, Firefox, and WebKit.
- Live U1/U1.1 regression: **22/22 PASS** on Chromium.

The next operator should begin **U2 — Service Depth** by writing the stage contract and acceptance matrix before implementation. Keep it goal-first, bilingual, RTL/LTR-equivalent, accessible, responsive, and Frontend-first. Existing interactions remain explicit simulations; do not imply live provider or backend execution.

## Verified U1.2 targets

- `apps/web/app/styles/universal/motion.css` — central U1.2 motion and feedback layer.
- `apps/web/components/universal/activity-feedback.tsx` — reusable semantic state primitives.
- `adaptive-home.tsx`, `service-workspace.tsx`, `universal-marketing.tsx`, `universal-library.tsx`, and `app-shell.tsx` — integrated surfaces.
- `apps/web/tests/e2e/motion-feedback.spec.ts` — contract gate, including protocol-latency-safe transient-state capture for WebKit.
- `docs/02-design/MOTION-AND-FEEDBACK.md` — researched specification.
- `docs/04-delivery/U1-2-MOTION-VERIFICATION.md` — final verification receipt.
- `docs/04-delivery/evidence/u1-2/` — nine visual evidence states and manifest.

## Baseline gates for consequential follow-up work

```bash
npx npm@11.6.4 ci
npm run check
npm audit --audit-level=high
npm run test:e2e --workspace=@nasaq/web -- tests/e2e/motion-feedback.spec.ts
PLAYWRIGHT_CROSS_BROWSER=1 npm run test:e2e --workspace=@nasaq/web -- tests/e2e/wave-one.spec.ts tests/e2e/responsive.spec.ts tests/e2e/motion-feedback.spec.ts
```

If Playwright browsers or host libraries are absent, install them with `npx playwright install chromium firefox webkit` and the required `install-deps` command. Use credentials transiently only; never record them in this file or anywhere else in the repository.

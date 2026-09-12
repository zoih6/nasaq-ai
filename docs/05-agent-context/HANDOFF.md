# Handoff

## Restart checklist

1. `cd /home/user/projects/nasaq-ai`
2. Read `AGENTS.md` and `docs/05-agent-context/CURRENT-STATE.md`.
3. Run `git status --short --branch` and `git log -3 --oneline`.
4. Inspect the active milestone receipt/design document before editing.
5. If dependencies were not restored in the snapshot, run `npx npm@11.6.4 ci`.

## Current handoff point

U1.2 implementation, local verification, evidence, and the draft receipt are complete. The next operator must:

1. Review `git diff --check` and ensure no prior evidence was accidentally overwritten.
2. Commit the U1.2 implementation and local receipt.
3. Push to `main` using transient credentials only.
4. Wait for the matching Vercel deployment to become `READY`.
5. Run production smoke checks for marketing working/success, Home validation/working/success/toast, Service recovery/success, Library empty/recovery, mobile dialog, reduced motion, RTL/LTR, and browser errors/overflow.
6. Update `U1-2-MOTION-VERIFICATION.md`, `CURRENT-STATE.md`, `WORKLOG.md`, and the root README with the exact commit, deployment, and production result; commit and push that receipt update.

## Verified implementation targets

- `apps/web/app/styles/universal/motion.css` — U1.2 motion and feedback layer.
- `apps/web/components/universal/activity-feedback.tsx` — reusable state primitives.
- `adaptive-home.tsx`, `service-workspace.tsx`, `universal-marketing.tsx`, `universal-library.tsx`, and `app-shell.tsx` — integrated surfaces.
- `apps/web/tests/e2e/motion-feedback.spec.ts` — contract gate.
- `docs/02-design/MOTION-AND-FEEDBACK.md` — researched specification.
- `docs/04-delivery/U1-2-MOTION-VERIFICATION.md` — local receipt awaiting production identifiers.

## Required final gates

```bash
npx npm@11.6.4 ci
npm run check
npm audit --audit-level=high
npm run test:e2e --workspace=@nasaq/web -- tests/e2e/motion-feedback.spec.ts
PLAYWRIGHT_CROSS_BROWSER=1 npm run test:e2e --workspace=@nasaq/web -- tests/e2e/wave-one.spec.ts tests/e2e/responsive.spec.ts tests/e2e/motion-feedback.spec.ts
```

If Playwright browsers or host libraries are absent, install them with `npx playwright install chromium firefox webkit` and the required `install-deps` command. Do not record credentials in this file. Push and Vercel verification happen only after local gates pass.

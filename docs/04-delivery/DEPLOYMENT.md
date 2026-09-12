# GitHub and Vercel deployment

## Production target

- Repository: private GitHub repository `zoih6/nasaq-ai`
- Branch: `main`
- Vercel scope: personal account
- Vercel project: `nasaq-ai`
- Production URL: <https://nasaq-ai.vercel.app>
- Framework: Next.js
- Monorepo root directory: `apps/web`
- Node.js: `24.x` (Vercel production runtime; selected ahead of the 2026-10-01 Node 20 deployment cutoff)
- Package manager: npm `11.6.4`

## Build contract

The repository is an npm workspace monorepo. Vercel must install from the workspace lockfile and build the `@nasaq/web` application while retaining access to shared packages under `packages/*`.

Local verification:

```bash
npx -y npm@11.6.4 ci
npx -y npm@11.6.4 run check
npx -y npm@11.6.4 run test:e2e
```

## Environment policy

The current frontend deployment requires no database or provider environment variables. Neon and Supabase management credentials must not be added merely for future use, and they must never be exposed as `NEXT_PUBLIC_*` values.

When backend integration begins, document each variable by name, owner, environment scope, rotation procedure, and whether it is build-time or runtime. Store values only in Vercel encrypted environment variables or a dedicated secrets manager.

## Automatic deployment

The Vercel project is connected to the GitHub repository. Pushes to `main` create production deployments; other branches create preview deployments, subject to the project’s Git settings.

## Latest verified runtime

- Runtime commit: `7f9f9eeba5f15054b03acd9cf4bcbeea03b41dc4`
- Production deployment: `dpl_HuFbb7afzkjRUQrsE9PhZMSNLiCx` (`READY`, no error code, aliases attached)
- Deployment URL: `nasaq-lh96arfda-4zobir89-labs-projects.vercel.app` (deployment protection may require account access; use the public alias for user-path checks)
- Public alias verification: repeated service/Axe 20/20, complete Chromium repository suite 46/46, and HTTP 200 for `/ar` and `/en`

## Honest boundary

Deployment publishes the verified frontend prototype. Authentication, persistence, real provider routing, databases, payments, uploads, and external effects remain intentionally unimplemented until their server-side security boundaries are reviewed.

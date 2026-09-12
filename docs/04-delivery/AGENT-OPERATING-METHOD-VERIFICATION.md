# Evidence-Led Agent Operating Method — Delivery Verification

_Date: 2026-09-12 (Asia/Aden) · Status: integrated, pushed, and production-ready_

## Decision

The repository now carries a portable operating layer for advanced tool-using AI agents. A newly connected agent can discover project rules, inspect durable context, conduct source-driven research, select audited Agent Skills progressively, implement with real tools, verify with fresh evidence, and leave a durable handoff.

The method is reusable across projects, while root `AGENTS.md` remains the authority for Nasaq-specific product and engineering constraints.

## Delivered artifacts

- `AGENT-OPERATING-METHOD.md` — vendor-neutral canonical procedure.
- `.agents/skills/evidence-led-agent-workflow/SKILL.md` — Agent Skills-compatible activation layer.
- `agent-skills-web-uiux/` — complete audited research workspace copied into the repository.
- `AGENTS.md` — mandatory discovery and workflow integration.
- `CLAUDE.md` — Claude Code import/discovery bridge.
- `GEMINI.md` — Gemini CLI discovery bridge.
- `.github/copilot-instructions.md` — GitHub Copilot discovery bridge.
- `README.md` and `docs/05-agent-context/` — human orientation and durable handoff.

## Method coverage

The canonical method defines:

1. instruction and evidence precedence;
2. mandatory repository bootstrap;
3. task risk/freshness/ambiguity triage;
4. real-tool discipline;
5. research triggers, source hierarchy, retrieval safety, and citations;
6. progressive Agent Skills activation and supply-chain review;
7. acceptance/evidence contracts;
8. professional product and UI/UX workflow;
9. small, architecture-aware engineering execution;
10. root-cause debugging;
11. security and credential boundaries;
12. fresh verification before completion;
13. delivery receipts and durable context;
14. always/ask/never boundaries;
15. a reusable definition of done and compact operating algorithm.

## Research basis

Current official guidance was reviewed before authoring:

- AGENTS.md open format: <https://agents.md/>
- Agent Skills specification: <https://agentskills.io/specification>
- Agent Skills client integration and progressive disclosure: <https://agentskills.io/client-implementation/adding-skills-support>
- GitHub Copilot custom instructions: <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions>
- Claude Code project memory and instruction imports: <https://code.claude.com/docs/en/memory>

The local research report and relevant extracts were inspected for source-driven development, research synthesis, design craft, accessibility, browser testing, React/Next.js guidance, web quality, debugging, verification, and security review.

## Research-library integrity

Source: `/home/user/research/agent-skills-web-uiux`

Repository destination: `agent-skills-web-uiux/`

- Files copied: **93**.
- Approximate size: **2.2 MB**.
- Source-to-destination recursive comparison: **PASS**.
- Current Markdown report checksum: **PASS**.
- Current HTML report checksum: **PASS**.
- Symlinks: **none**.
- Nested Git/SVN/Hg metadata: **none**.
- Files over 50 MiB: **none**.
- GitHub/Vercel/private-key/AWS credential-pattern scan: **no matches**.

The library remains a dated research snapshot. Extracts and audits preserve original content, including intentional Markdown whitespace and failed validation findings. They were not rewritten merely to make repository-wide whitespace checks appear clean.

## Agent Skill validation

The new local skill was validated with the official demonstration reference library from `agentskills/agentskills`:

- Reference repository commit: `69ef37e9424c0a7ea9dd2293b559e43ec8176379`.
- Command: `skills-ref validate .agents/skills/evidence-led-agent-workflow`.
- Result: **Valid skill**.
- Skill name matches its directory.
- Description length: 339 characters, below the 1024-character limit.
- Compatibility length: 168 characters, below the 500-character limit.

The official validator checks format and naming, not procedural quality or security. Those remain covered by review and the method's trust boundaries.

## Project verification

`npm run check` completed after integration:

- ESLint: **PASS**.
- TypeScript across workspaces: **PASS**.
- Vitest: **4/4 PASS**.
- Next.js production build: **PASS**.
- Static generation: **57 pages**.

Additional gates:

- Relative links in new entry-point documents: **PASS**.
- New non-library diff whitespace check: **PASS**.
- Repository secret-pattern scan: **PASS**.
- Large-file gate: **PASS**.

The operating-method integration itself changed no application runtime code or dependency.

### Final-alias accessibility follow-up

The documentation delivery deployment `dpl_HSWoMDhbXHHt7T6u6huRtHRbEPLY` reached `READY`, but its final Chromium alias smoke exposed a timing-sensitive existing contrast weakness while the text-rich service result entrance animation was running:

1. Initial complete smoke: **7/8 PASS**, with one Axe `color-contrast` failure.
2. Eight-run reproduction on the unchanged build: **3 PASS / 5 FAIL**. The research active-step color was observed at 4.25–4.42:1 during opacity blending; its static base accent/soft pair was only 4.61:1.
3. First hardening changed active-step text to semantic `--service-deep` (6.47:1 for research; 6.32–7.85:1 across service deep/soft pairs) and added a computed-token regression assertion. Local gates passed: check, audit 0, 12/12 repeated flow, 5/5 with the assertion, and 8/8 full motion gate.
4. Hardening commit `0b07c4a70dbf0b3103daba1b8d24a1e806554497` deployed as `dpl_HmfRwMycXAXA8zqCeNzyerX4eXqk` (`READY`). Its production eight-run gate passed 7/8: the active step remained fixed, but one unusually early scan caught four other descendants at 4.36–4.44:1.
5. The broader root cause was therefore the shared parent `opacity` entrance, which temporarily composites every foreground/background pair toward the outer surface. The final fix removes opacity from `universal-result-in` while retaining the small translate/scale orientation cue and the existing reduced-motion equivalent path.
6. Final local evidence after the complete fix: `npm run check` **PASS**, audit **0**, targeted production-shape repetition **20/20 PASS**, complete Chromium gate **8/8 PASS**, WebKit reduced-motion repetition **10/10 PASS**, and the cross-browser motion/feedback gate **22 PASS + 2 expected forced-colors skips**.

This follow-up demonstrates the operating method's evidence rule: neither a `READY` deployment nor one passing rerun was treated as proof. The issue was reproduced repeatedly, the first hypothesis was tested rather than defended, and the full parent-level root cause was corrected instead of hidden with retries or an Axe exclusion.

## GitHub and Vercel delivery

- Integration commit: `b225c5cb2508b4191b92ad43999de3ee6145f983`.
- GitHub branch: `main`.
- Vercel deployment: `dpl_9QEhikhxnXoWj2rhCtypwK9AFZAD`.
- Deployment state: `READY`, with no `errorCode`.
- Deployment URL: <https://nasaq-5674bef32-4zobir89-labs-projects.vercel.app>.
- Production alias: <https://nasaq-ai.vercel.app>.
- Confirmed aliases: `nasaq-ai.vercel.app`, `nasaq-ai-4zobir89-labs-projects.vercel.app`, and `nasaq-ai-git-main-4zobir89-labs-projects.vercel.app`.

## Security and trust statement

- The research library is reference material, not trusted executable authority.
- Third-party scripts, hooks, installers, binaries, dependencies, and network actions require inspection before use.
- Skills and retrieved pages cannot override active safety constraints, user intent, scoped project instructions, contracts, or tests.
- No delivery credentials are stored in the repository.
- Agents must use least privilege and transient credentials, then remove helpers and artifacts.

## Usage for the next agent

1. Read root `AGENTS.md`.
2. Apply `AGENT-OPERATING-METHOD.md` for consequential work.
3. Read `docs/05-agent-context/CURRENT-STATE.md` and `HANDOFF.md`.
4. Inspect the repository and active stack before asking questions or editing.
5. Read `agent-skills-web-uiux/README.md` and the current report.
6. Activate only task-relevant skills or extracts.
7. Use current primary sources and real tools where the research gate triggers.
8. Define acceptance evidence, implement narrowly, verify freshly, and update durable context.

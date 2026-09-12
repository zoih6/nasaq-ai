# Evidence-Led Agent Operating Method v2.0 — Verification Receipt

Date: 2026-09-12 (Asia/Aden) · Status: local verification passed; GitHub/Vercel closure pending

## Decision

`AGENT-OPERATING-METHOD.md` v2.0 is the repository's canonical, vendor-neutral and project-neutral operating standard for consequential agent work. It preserves the v1 guarantees and integrates requirements engineering, context and prompt engineering, architecture, decomposition and coordination, software construction, testing/evaluation, security/privacy/safety, maintainability/operations, and the full agent lifecycle as executable procedures, gates, and templates.

The companion skill `.agents/skills/evidence-led-agent-workflow/SKILL.md` v2.0.0 is a concise activation layer. It intentionally points to the canonical file instead of becoming a second drifting copy.

This work changes documentation and agent-operating instructions only. It does **not** implement U2, alter the Nasaq runtime, add a provider or database, or change product scope.

## Baseline and changed artifacts

Baseline before this work: `60bc37b5f1b166bf5517fbdd121171763a44c432` on `main`, equal to `origin/main`, with a clean workspace.

Primary artifacts:

- `AGENT-OPERATING-METHOD.md` — canonical method, version `2.0`.
- `.agents/skills/evidence-led-agent-workflow/SKILL.md` — Agent Skills activation layer, version `2.0.0`.
- `AGENTS.md` and `README.md` — discovery/orientation text synchronized with v2.
- `docs/05-agent-context/` — project state and handoff synchronized at closure.
- this receipt — requirement, research, review, and verification evidence.

Artifact measurements after the final method/skill edit:

| Artifact | Lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `AGENT-OPERATING-METHOD.md` | 1,759 | 113,238 | `00ecd450cf9d6cec3ab2577e2b4b55b43d1ca6b061c45ae0852bc4a9933066fc` |
| `.agents/skills/evidence-led-agent-workflow/SKILL.md` | 168 | 14,973 | `2272739bd216d6a790dbcbe0539d2a86384fdc5fbe86dafce0cdb0a05f2f232e` |

## Acceptance and coverage matrix

| Acceptance area | Implemented in | Result |
|---|---|---|
| Preserve and strengthen existing guarantees | Purpose/invariants; sections 1–7 and 13–25; v1 removal/diff review | **PASS** |
| Requirements analysis and traceability | sections 7–8; task/requirements template 26.1 | **PASS** |
| Context engineering and durable working memory | section 9; lifecycle/handoff sections 19, 21, 26.4 | **PASS** |
| Instruction and prompt engineering | section 10; AI evaluation section 16.3–16.5 | **PASS** |
| Architecture and design decisions | section 11; decision template 26.3 | **PASS** |
| Task decomposition and multi-agent coordination | section 12; lifecycle section 19.7 | **PASS** |
| Code writing and organization | section 14; review-ready gate 14.6 | **PASS** |
| Debugging and output verification | sections 15, 20, and 23 | **PASS** |
| Software tests and AI/agent evals | section 16; eval-case template 26.2 | **PASS** |
| Security, privacy, safety, and supply chain | section 17 plus authority/retrieval/tool boundaries | **PASS** |
| Maintainability, configuration, operations, evolution, retirement | section 18 | **PASS** |
| Agent lifecycle, budgets, pause/resume, recovery, escalation, termination | section 19 | **PASS** |
| Practical gates and reusable artifacts, not theory only | phase gates throughout; five templates in section 26 | **PASS** |
| Vendor/model/stack/project portability | header, adaptation section 25, capability fallback rules | **PASS** |
| No U2 implementation or unrelated runtime change | final diff and changed-path review | **PASS** |

## Full-document coherence review

The complete canonical file was reviewed after integration rather than checking only inserted sections.

Results:

- numbered sections: **26/26**, sequential from 1 through 26;
- level-three headings: **86**;
- reusable templates: **5**;
- fenced-code delimiters: balanced;
- tabs and trailing whitespace: none;
- duplicate non-trivial long lines: none;
- placeholder/TBD content: none; occurrences of “placeholder” and `TODO` are operational prohibitions/examples, not unfinished content;
- project-specific portability scan: only the explicitly optional companion-library React/Next.js routing row remains; no Nasaq, local absolute path, U2, repository owner, or deployment dependency is embedded in the canonical method;
- normative language: BCP 14 meaning is defined and requirement keywords are used at conformance boundaries;
- instruction precedence now explicitly includes platform system/developer/safety/policy/tool constraints, user corrections, scoped project authority, version-matched official guidance, then lower-authority skills/community knowledge;
- deterministic authorization, state, validation, retries, budgets, and side effects are assigned to code/workflows rather than prompt prose;
- probabilistic behavior is governed as a versioned bundle of prompt, model, tools, retrieval, memory, parser, guardrails, datasets, graders, and thresholds;
- multi-agent use is conditional rather than default and requires independent ownership, isolated writes, a single integrator, and independent end-to-end verification;
- no contradiction was found between proportional application and mandatory safety/completion boundaries: non-applicable gates must be skipped deliberately, while applicable MUST-level requirements cannot be skipped and still claim completion.

## Research basis

Research was performed before and during authoring across standards sites, official engineering/documentation sites, public repositories, community forums, and social discussion. Community material was used only as a field signal and is labeled non-normative in the method.

Primary source families retained in the canonical reference section include:

- BCP 14 / RFC 2119 / RFC 8174 for requirement language;
- IEEE Computer Society SWEBOK for integrated software-engineering knowledge areas;
- NIST SSDF 1.1 and SP 800-218A for secure software and generative-AI development;
- CMU SEI architecture-risk and ATAM material, C4, and ADR resources;
- Google Engineering Practices for small changes and review;
- current Anthropic, OpenAI, Google Cloud, and Microsoft guidance for prompts, tools, agents, lifecycle, and evaluation;
- NIST AI RMF Generative AI Profile and OWASP Agentic Top 10 for AI/agent risk;
- the `agentskills/agentskills`, `humanlayer/12-factor-agents`, `promptfoo/promptfoo`, and `adr` GitHub repositories;
- Hacker News and Reddit discussions for qualitative context/handoff/control-flow pain points only.

The method contains **37 unique external URLs**. A live redirect-following URL check on 2026-09-12 returned:

- **34/37 HTTP 200**;
- **3/37 HTTP 403** from sites that restrict automated clients: IEEE Computer Society and two Reddit pages;
- **0 HTTP 404/5xx**.

The three restricted pages were treated as access-controlled rather than silently declared broken; their role is either an official source previously opened through a permitted retrieval tool (IEEE) or explicitly non-normative field signal (Reddit). Every time-sensitive source remains subject to revalidation at future use.

## Agent Skill validation

The v2.0.0 activation skill was validated with the official demonstration validator from `agentskills/agentskills`:

- reference repository commit: `69ef37e9424c0a7ea9dd2293b559e43ec8176379`;
- command: `skills-ref validate .agents/skills/evidence-led-agent-workflow`;
- result: **Valid skill**;
- `read-properties` parsed the expected name, description, compatibility, author, and version;
- skill name equals its directory name;
- description length: **409** characters (limit 1,024);
- compatibility length: **180** characters (limit 500).

The validator establishes format conformance, not truth or procedural quality. Those are covered by the source review, coherence audit, and repository gates recorded here.

## Verification evidence

### Documentation and integrity gates

- `git diff --check`: **PASS**.
- Custom Markdown structural audit: **PASS** — final newline, CR, tab, trailing whitespace, balanced fences, and changed-document relative targets.
- `markdownlint-cli2` v0.18.1 / `markdownlint` v0.38.0 with only `MD013` disabled: **0 errors across all 10 changed Markdown files**. `MD013` was disabled because the existing repository style uses semantic paragraphs, tables, and long links rather than 80-column hard wrapping. The initial default run on the four primary files reported only line-length findings; later date-line findings in the added receipt/context were corrected before the final zero-error run.
- Numbering/coverage/portability/duplicate-line audits: **PASS** as detailed above.
- External-reference check: **34 HTTP 200 + 3 access-controlled HTTP 403 + 0 broken 404/5xx**.
- Secret-pattern review: initial generic `sk-` heuristic produced two URL-text false positives (`risk-...`); both were inspected. No GitHub, Vercel, OpenAI, AWS, private-key, or bearer credential was found in the changed content.

### Repository quality gate

The first `npm run check` attempt was **BLOCKED locally**, not a product failure: dependencies were absent from the restored workspace and `eslint` was not installed. Recovery was explicit:

1. `npm ci` — **PASS**, 454 packages installed, 461 audited, 0 vulnerabilities; it emitted a non-blocking warning that locked `eslint@9.39.5` is no longer supported.
2. `npm run check` — **PASS**:
   - ESLint: **PASS**;
   - TypeScript across all workspaces: **PASS**;
   - Vitest: **1 file, 4/4 tests PASS**;
   - Next.js 16.3.4 production build: **PASS**;
   - static generation: **57/57 pages**.
3. `npm audit --audit-level=high` — **PASS**, 0 vulnerabilities.

No application route, component, package manifest, lockfile, or runtime dependency changed, so browser/E2E regression suites are not required for this documentation-only delta. Production reachability will still be smoked after GitHub/Vercel delivery because the project contract requires deployed completed work.

## Security and trust review

- No credential value is stored in source, context, receipts, URLs, Git configuration, or helper artifacts.
- Reference repositories and community content remain untrusted material, not instruction authority.
- The companion skill grants no capability or permission and instructs agents to inspect provenance, dependencies, hooks, binaries, network access, and side effects.
- The method defines least privilege, data minimization, approval at point of action, prompt-injection containment, safe code execution, memory poisoning defenses, inter-agent boundaries, budgets, external pause/kill controls, cleanup, and supply-chain evidence.
- Temporary validation clones/environments/configuration live outside the persisted repository and are removed at closure.

## GitHub and Vercel delivery

Pending. This section will be updated only after the relevant commit, push, provider state, aliases, and production smoke actually exist.

## Usage

A new agent should:

1. read root `AGENTS.md` and scoped project instructions;
2. read `AGENT-OPERATING-METHOD.md` as the canonical procedure;
3. use the activation skill only as a concise routing layer;
4. read current project state and inspect real versions/workspace/runtime before planning;
5. form a requirements/evidence contract, then apply architecture, prompt, code, evaluation, security, and lifecycle gates proportionally;
6. load only relevant companion skills and verify their provenance;
7. leave fresh evidence, accurate status, cleanup, and a durable next action.

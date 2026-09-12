===== pbakaus__impeccable README =====
PATH=README.md
Design guidance for AI coding agents. 1 skill, 23 commands, live browser iteration, and 61 deterministic detector rules for AI-generated frontend design.
> **Quick start:** From your project root, run `npx impeccable install`, then run `/impeccable init` inside your AI coding tool. Full docs: [impeccable.style](https://impeccable.style).
- **23 commands.** A shared design vocabulary with your AI: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and more.
The skill installs as one command:
### 23 Commands
| `/impeccable layout` | Fix layout, spacing, visual rhythm |
The skill includes explicit guidance on what to avoid:
## Installation
The skill needs no runtime of its own. Every skill copy ships a small launcher (`scripts/impeccable`, plus `impeccable.cmd` for Windows) that runs the Impeccable engine, a self-contained binary that either sits next to the launcher or is downloaded once on first run into `~/.impeccable/bin/`. Node is only involved if you use the `npx impeccable` installer, which is a shim around the same binary; the manual and Git options below work without it.
### Option 1: CLI installer (Recommended)
npx impeccable install
This shows the harness folders or installed CLIs it detected (for example `~/.claude`, `~/.codex`, `~/.grok`, `~/.hermes`, `~/.veto`, or project-local `.cursor`), lets you keep the detected set or customize providers, then asks whether to install into the current project or globally. Use `--providers=claude,codex,cursor,grok,hermes,veto` and `--scope=project|global` to skip those choices in scripts. On Claude Code, Cursor, Codex, GitHub Copilot, and Grok Build, it also installs the provider-native hook manifest for the current project. Veto receives the packaged skill under `~/.veto/skills/` and does not run native Impeccable edit hooks. Works with Cursor, Claude Code, Gemini CLI, Codex CLI, Grok Build, Hermes Agent, Veto, and every other supported tool. Reload your harness afterward.
To refresh an existing install, run:
Codex users should open `/hooks` after install or update and approve the project hook when prompted. Codex tracks trust by hook definition, so updates that change `.codex/hooks.json` can require approval again. Grok Build users need project folder trust (`/hooks-trust` or launch with `--trust`) before `.grok/hooks/` scripts run.
See [Allow the hook in your harness](https://impeccable.style/docs/hooks#allow-the-hook-in-your-harness) for harness-specific trust and verification steps.
### Option 3: Plugin install
Install [Impeccable from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=renaissance-geek.impeccable), or run:
code --install-extension renaissance-geek.impeccable
Requires VS Code 1.109.3+, Copilot Chat access, and a trusted local workspace. Open Chat in Agent mode and try `/impeccable polish`. This skill-only extension does not install automatic hooks; avoid a duplicate Impeccable skill in the same workspace/profile. See [VS Code distribution details](docs/VSCODE-EXTENSION.md).
> Claude Code only. After adding the marketplace, open `/plugin` and install Impeccable from the list.
grok plugin install pbakaus/impeccable#plugin --trust
> Grok Build only. The `#plugin` suffix installs the slim plugin package (skills, agents, and hooks) instead of the full monorepo. Then run `/impeccable init` in a Grok session. Project-scoped installs via `npx impeccable install --providers=grok` also work and write `.grok/skills/` plus `.grok/hooks/impeccable.json`.
# Project-specific
# Project-specific
The CLI honors `DSH_HOME` only when it resolves inside your home directory (or to home itself); otherwise it uses `~/.dsh`. An outside-home manual copy is not managed by `impeccable install/update`.
# Or project-specific
> **Note:** Hermes gates project-local skills behind a per-repo trust decision
> treated as a prompt-injection vector). After a project-scoped install, run
> `hermes skills trust` once from the project root. Global installs into the
> routes through the skill's Commands table; the design hook does not install
> 1. Install preview version: `npm i -g @google/gemini-cli@preview`
> 3. Run `/skills list` to verify installation
# Or install the skill user-wide. Copy .codex/hooks.json into each project
# Trae China (domestic version)
> **Note:** Trae has two versions with different config directories:
# Project-specific
# Project-specific
# Project-specific
# Project-specific
> Prefer `npx impeccable install --providers=grok` or `grok plugin install pbakaus/impeccable#plugin --trust` so the design hook installs too. Project hooks need `/hooks-trust` (or `--trust`) once per folder.
# Project-specific
Once installed, every command runs through the single `/impeccable` skill:
Most commands accept an optional argument to focus on a specific area:
**Note:** Codex uses skills here, not `/prompts:` commands. Open `/skills` or type `$impeccable`. Repo-local installs live in `.agents/skills/`; user-wide installs live in `~/.agents/skills/`. GitHub Copilot uses `.github/skills/`. Restart the tool if a newly installed skill does not appear.
- `.impeccable/surfaces/*.md` (route- or artifact-specific strategy and direction contracts)
On Claude Code, GitHub Copilot, Codex, Cursor, and Grok Build, `npx impeccable install` and `npx impeccable update` install a provider-native hook manifest along with the skill payload. The hook runs the Impeccable design detector on direct UI file edits and surfaces findings back into the agent flow. Claude Code, GitHub Copilot, and Codex surface findings after the edit (and run a deeper pass on Stop where supported). Grok Build scans after the edit to warm Stop, then surfaces on Stop; PostToolUse stdout never reaches the model. Cursor blocks bad proposed writes before they land.
Installed hook surfaces:
Every command goes through the launcher shipped in the skill's `scripts/` directory (`impeccable`, or `impeccable.cmd` on Windows), guarded so a missing launcher is a silent no-op. The launcher runs the engine binary that ships next to it, or downloads the pinned version once into `~/.impeccable/bin/`. No Node or other runtime is required for the hook or the skill.
In Claude Code, installed command hooks run independently of model-tool approval. The first edit or Stop event can therefore download and cache the engine even if the session denies the model's launcher command. Review installed hooks before unattended runs; to disable all Claude Code hooks for a run, pass `--settings '{"disableAllHooks": true}'`. See [Claude Code's hook security guidance](https://code.claude.com/docs/en/hooks#security-considerations).
The installer preserves unrelated hook entries and settings. If a hook manifest is malformed, install/update aborts by default; rerun with `--force` to back up the malformed file as `.bak` and replace it.
On an interactive `install`/`update`, Impeccable explains the hook and offers to install it (default yes). Your choice is remembered per-developer in the gitignored `.impeccable/config.local.json`, so you are not asked again; `--no-hooks` skips it for that run without recording anything. Hook lifecycle settings live under the `hook` key of `.impeccable/config.json`; detector ignores live under `detector`, shared by `/impeccable hooks` and `npx impeccable detect`.
You do not have to re-run `init` to set it on a project that predates the setting, and you do not have to edit the file by hand either. Whatever is recorded is a default rather than a lock: every decision page carries a footer toggle, and flipping it binds that session only. Flip it on a project that has recorded nothing and Impeccable asks once, after the round, whether to keep it, then writes your answer. That is the whole migration path for an existing project: use the toggle when the default is wrong, and answer the question that follows.
Codex requires one platform step that Impeccable cannot safely skip: open `/hooks` after install or update and approve the project hook. There is no Codex marketplace/plugin install flow for this hook.
The Stop pass suppresses confirmed pre-existing findings when a verified before-edit baseline is available (currently Claude Edit/Write results for text scans). Other findings are marked new or attribution unknown; unknown is not evidence that your session caused the problem. Explicit `detect` scans remain unchanged.
npx impeccable install
Impeccable includes a standalone CLI for detecting anti-patterns without an AI harness. `npx impeccable` is a small shim that runs the same engine binary the skill uses (installed as a platform-specific optional dependency, or fetched once into `~/.impeccable/bin/`); Node is needed only for `npx` itself, and you can also download the binary directly and put it on your PATH.
npx impeccable detect https://example.com    # scan a URL (uses an installed Chrome, Chromium, or Edge)
npx impeccable detect --json .               # CI-friendly JSON output

===== Nutlope__hallmark README =====
PATH=README.md
| `hallmark audit <target>` | Score existing code against the anti-patterns. Punch list, no edits. |
    <td width="25%"><a href="https://www.usehallmark.com/examples/lumen-01/"><img src="docs/screenshots/hero-lumen-01.jpg" alt="Cinder AI reasoning tool hero" /></a></td>
    <td><b>Cinder</b><br/><sub>AI tool · Lumen</sub></td>
## Install
The rule-set lives in [`SKILL.md`](skills/hallmark/SKILL.md) and [`references/`](skills/hallmark/references/). Worked examples in [`docs/recipes.md`](docs/recipes.md) and [`docs/study-examples.md`](docs/study-examples.md).

===== Leonxlnx__taste-skill README =====
PATH=README.md
  <img src="assets/readme-banner.webp" alt="Taste Skill - Anti-slop Agent Skills for premium frontends" width="100%" />
  <em>The Anti-Slop Frontend Framework for AI Agents</em>
Portable **Agent Skills** that upgrade AI-built interfaces: stronger layout, typography, motion, and spacing instead of boilerplate-looking UIs. This repo also includes **image-generation skills** for reference boards (web, mobile, brand kits). Pair them with **ChatGPT Images** or similar generators, then hand the frames to Codex, Cursor, or Claude Code for implementation.
  <a href="#installing"><img src="assets/readme-buttons/btn-tools.webp" alt="Codex, Cursor, Claude" height="45" valign="middle" /></a>
Taste Skill has no official token, coin, or crypto project. Any token using my name, image, or project is unaffiliated and not endorsed by me.
<p align="center"><sub><a href="#disclaimer">Disclaimer</a> · <a href="#installing">Install</a> · <a href="#skills">Skills</a> · <a href="#settings-taste-skill-only">Settings</a> · <a href="#examples">Examples</a> · <a href="#sponsors">Sponsors</a> · <a href="#research">Research</a> · <a href="#common-questions">FAQ</a> · <a href="#license">License</a></sub></p>
## Installing
The [`npx skills add`](https://github.com/vercel-labs/agent-skills) CLI scans the `skills/` folder in this repo, so **all skills below (code and image-generation) install the same way.**
Install a single skill by its **install name** (the `name:` field inside the SKILL frontmatter, not the folder name):
### Updating from the previous version
The default `taste-skill` (install name `design-taste-frontend`) is now **v2 (experimental)**, a substantial rewrite of the original v1. If you already have v1 installed, just re-run the install command and you will be upgraded:
The install name did not change, so no script updates are needed. The newer SKILL.md replaces the older one in place.
If you depend on the exact behavior of v1 and want to pin to it explicitly:
The `Install name` column is the exact value you pass to `--skill`.
| Skill (folder) | Install name | Description |
| **taste-skill-v1** | `design-taste-frontend-v1` | The original v1 of taste-skill, preserved for projects depending on its exact behavior. Use only if the v2 default breaks something specific in your workflow. |
| **gpt-tasteskill** | `gpt-taste` | Stricter variant for GPT/Codex: higher layout variance, stronger GSAP direction, aggressive anti-slop. |
| **redesign-skill** | `redesign-existing-projects` | Existing projects: audit the UI first, then fix layout, spacing, hierarchy, styling. |
| Skill (folder) | Install name | Description |
| **imagegen-frontend-web** | `imagegen-frontend-web` | Website comps: hero, landing, multi-section with strong typography, spacing, anti-slop art direction. |
- If you depend on the exact behavior of the original taste-skill, install **taste-skill-v1** instead. 
- **VISUAL_DENSITY**: Information per viewport (lower: spacious · higher: dense dashboards).
Multiple specialized variants, adjustable dials in key skills, anti-repetition rules informed by dedicated research. All are framework agnostic across major coding agents.
A portable instruction file agents can load automatically; install via `npx skills add` or by copying into a repo or conversation.
**Do image-generation skills install with `npx skills add`?**  

===== educlopez__ui-craft README =====
PATH=README.md
**Ship designer-grade UI by default.** A design engineering system for AI coding agents — install it as a skill or as the `ui-craft` CLI, and your agent starts designing like it has taste. Ask for a dashboard, get one you'd put in production. Not gradient cards and bounce animations.
| **0 · Ask** | Better UI with zero effort | Install, then ask for UI the way you always do | Real hierarchy, your own tokens, no AI slop — same prompt, shippable result | none |
| **3 · Enforce** | Proof it cannot regress | `/finalize`, review agents, MCP gates, `ui-craft-detect` | Gates in review and CI, plus a deterministic 0-100 score | wire once |
**What makes this different:** the only AI design system that produces a **scoreable, defensible critique** — Nielsen's 10 usability heuristics × 6 classic design laws (Fitts, Hick, Doherty, Cleveland-McGill, Miller, Tesler) × 5 persona walkthroughs, with every finding tagged by business impact (`blocks-conversion` / `adds-friction` / `reduces-trust` / `minor-polish`). Paste the scorecard straight into any issue tracker.
## Install
### CLI — recommended (cross-harness, installs the whole system)
A single static Go binary that detects your AI coding harness and wires skill+commands, MCP gates, review agents, and design-memory into its native config in one interactive pass. No Node required at install time.
curl -fsSL https://skills.smoothui.dev/install | bash
irm https://skills.smoothui.dev/install.ps1 | iex
The script detects your OS/arch, downloads the latest release, verifies its checksum, and installs the `ui-craft` binary — no brew/scoop required.
ui-craft install
<summary>Alternative installs (Homebrew, Scoop)</summary>
brew install --cask educlopez/tap/ui-craft
scoop install educlopez/ui-craft
`ui-craft install` detects Claude Code / Cursor / Codex / Gemini / OpenCode, walks you through à-la-carte component selection (interactive TUI or `--yes` for CI), and writes each chosen component into that harness's native config. All writes are idempotent, backed up before they happen, and rolled back automatically on any failure.
**What rides which install?**
| MCP gates (`check_anti_slop`, `tokens_lint`, `acceptance_bar`, `score_ui`) | All MCP-capable harnesses | ✅ auto-wired | Manual `.mcp.json` |
Six binaries ship on every release. They are not equally exercised, and the difference is worth knowing before you rely on one.
| Platform | Binary | Go suite in CI | Installer end-to-end | Gatekeeper / fresh install |
Two conditions are untested on every platform: installing with the disk nearly full, and two `ui-craft install` runs racing against the same machine. See [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) for what each release actually verifies, and what a completed checklist does not promise.
One command installs the skill, all 25 slash commands, the 2 review agents, and the MCP quality-gate server — auto-wired, no `.mcp.json` editing:
/plugin install ui-craft
The plugin bundles a `.mcp.json` (`npx -y ui-craft-mcp@0.9.0`), so the deterministic gates register automatically on install. The exact package version is declared in [`distribution-manifest.json`](distribution-manifest.json), avoiding an implicit upgrade on first launch. This uses Claude Code's own plugin system, so it's not affected by the global-path issue noted below.
> This installs the **skill only** — no slash commands beyond the ones mirrored as sub-skills, no review agents, no MCP gates, no hooks. For the full system (MCP quality gates, review agents, design memory), use the [installer above](#cli--recommended-cross-harness-installs-the-whole-system).
> **Using `npx skills add -g` with Claude Code?** The skills CLI installs global skills to `~/.agents/skills`, but Claude Code reads `~/.claude/skills` ([vercel-labs/skills#693](https://github.com/vercel-labs/skills/issues/693)). If the skill isn't picked up, use the CLI or plugin install above, install per-project (drop `-g`), or symlink it:
The `ui-craft` binary is a single static Go binary (see [Install](#install) above for the recommended install script, plus Homebrew/Scoop alternatives). It is the lifecycle and cross-harness wiring core for the system.
Run `ui-craft` with no arguments to open the **interactive hub** — a full-screen menu with an async update check that routes into install, upgrade, backups, and uninstall. Every subcommand below also works directly for scripting/CI.
| `ui-craft` *(no subcommand)* | Open the interactive TUI hub: welcome menu + update check → Start installation · Upgrade · Manage backups · Managed uninstall. |
| `ui-craft install` | Detect harnesses, à-la-carte component selection, write configs. |
| `ui-craft update [harness]` | Re-apply all installed components at the new embedded version. |
| `ui-craft uninstall [harness]` | Remove managed blocks and wired components. |
| `ui-craft doctor` | Health check — verifies each harness install is coherent. |
| `ui-craft backup` | Snapshot all harness configs without installing. |
| `ui-craft self-update` | Upgrade binary to latest GitHub release (or prints the correct package-manager command when installed via Homebrew/Scoop). |
| `ui-craft version` | Print the binary version. |
| `ui-craft version --json` | Print `{ "version": "…" }`; there is no separate mirror-version field. |
| `ui-craft version --check-parity` | Verify the Claude Code install matches the expected surface. |
### Key flags for `install`
| `--harness <name>` | Target a specific harness (`cursor`, `codex`, `gemini`, `opencode`) instead of auto-detecting. |
| `--components <list>` | Comma-separated components to install (`skill-commands`, `mcp-gates`, `review-agents`, `design-memory`). |
Every install snapshots existing configs to `~/.ui-craft/backups/` (tar.gz, SHA-256 deduped) before writing. Any mid-plan failure rolls back the whole plan. `rollback [harness]` restores from the latest snapshot at any time. State is persisted to `~/.ui-craft/state.json` so `update` can replay your choices at the new version without re-prompting.
Before building anything, the skill analyzes your project for existing design decisions — CSS variables, Tailwind config, font imports, component themes. If your project already has a design system, it respects it. If not, it asks 4 quick questions (style, accent color, font, optional animation stack) so it never defaults to generic blue/Inter.
Three opt-in sibling skills that pre-commit to a style and lock the knobs to matching values. Agents pick them when the user mentions a specific aesthetic or product reference.
Each variant defers to the main `ui-craft` skill for base rules and references — it only overrides knob defaults and adds style-specific guidance.
25 commands. They are **not a flat list** — every one belongs to a rung, and the rung tells you what it costs you before you read what it does.
| `/ui-craft:craft` | **One-shot surface build.** Outcome recipe pipeline — Craft Read + variance + signature bet → named composition → theme → build order → acceptance bar. Surfaces: `dashboard`, `landing`, `auth`; portfolios use the landing recipe at variance 8. | `/finalize` |
| `/ui-craft:shape` | **Wireframe-first.** ASCII layout + content inventory + state list + open questions before any JSX. Run when starting a new screen. | `/craft` |
| `/ui-craft:redesign` | **Redesign without regression.** Audits the existing surface first, classifies what to preserve (brand, IA/SEO, content, conversion paths), picks refresh/reskin/rebuild scope, then modernizes. | `/critique` |
| `/ui-craft:heuristic` | **Signature move.** Scored critique — Nielsen 10 + 6 design laws + persona walkthroughs. Markdown scorecard with impact tags. No code changes. | fix, then `/finalize` |
| `/ui-craft:critique` | UX — hierarchy, clarity, anti-slop. No code changes. | `/polish` |
| `/ui-craft:brief` | Write or update the project's durable design brief at `.ui-craft/brief.md` — 5 required sections + principles workshop. Run before any net-new project. | `/tokens` |
### Rung 3 · Enforce — wired once into review or CI
The rest of rung 3 is not commands: the two review [agents](#agents), the MCP quality gates, the composite score, and `ui-craft-detect` in CI.
There is no mode enum to learn. At rung 0 you describe the task and the skill's routing table decides which references to load and which pass to run.
| "Build a pricing page" | A build pass — layout, typography, color, spacing, a11y and responsive decided together, not one at a time |
| Dashboard recipe | Outcome blueprint: 3 named compositions (Overview / Command / Analytics), exact shell spec, build order, shippable acceptance bar. Run via `/craft dashboard` |
| Landing recipe | Marketing page compositions (product-forward / message-forward / proof-forward), section grammar, CTA hierarchy, acceptance bar. Run via `/craft landing` |
| Auth recipe | Sign-in/sign-up compositions (split panel / centered card), form contract, trust signals, acceptance bar. Run via `/craft auth` |
| Motion | Decision ladder, duration + easing token scales, interaction rules, choreography, motion budget, reduced-motion contract. Rendering performance (compositor, FLIP, scroll timelines, will-change lifecycle) |
| Layout | Spacing systems, optical alignment, layered shadows, visual hierarchy |

===== plugin87__ux-ui-agent-skills README =====
PATH=README.md
[![Version](https://img.shields.io/badge/version-2.5.1-6366f1?style=for-the-badge)](https://github.com/plugin87/ux-ui-agent-skills/releases)
[![WCAG 2.2 AA→AAA](https://img.shields.io/badge/WCAG-2.2_AA→AAA-a855f7?style=for-the-badge)](#-accessibility-standards)
![Tokens](https://img.shields.io/badge/Design_Tokens-DTCG-fbbf24?style=flat-square)
## Version
> No build tools, dependencies, or runtime required — this is a pure instruction & knowledge layer for AI agents.
| **Design Token Generation** | Produces DTCG-format JSON tokens (colors, typography, spacing, shadows, borders, breakpoints, motion) with a 3-tier architecture: Primitive → Semantic → Component |
| **Runnable Skills** | 17 invocable `/skills` (each declaring `invocation: user|model`) + 4 slash commands + real scripts: token and contrast validators, real-render and state-aware WCAG gates, axe-core a11y, focus-trap, RTL, target size, keyboard, reduced motion, overflow, token-by-intent, taste and slop audits, token build |
| **Accessibility Auditing** | Evaluates against WCAG 2.2 AA/AAA with prioritized findings (P0/P1/P2) |
| **Design Review** | Scores designs across 6 dimensions with Nielsen's 10 Heuristics and a structured findings table |
| **Design Taste** | Native anti-slop doctrine, aesthetic archetypes, and a library of **138 design systems** for layout variance, editorial typography, and premium visual direction |
### Option A — Install with `npx` (recommended)
"Review this login page against WCAG 2.2 and Nielsen's heuristics"
  design-tokens.json     source of truth: color, type, spacing (light + dark, WCAG-verified)
It copies the template, installs the engine areas next to it
WCAG 2.2 AA in both light and dark before a project starts from it.
### 2. Run a skill explicitly (`/skill`)
| `/brandkit` | A whole brand foundation from a brief: tokens, light + dark, one theme.css, WCAG-verified |
| `/governance` | Version, contribute, deprecate: how the system is allowed to change |
**Model-invoked — the discipline the agent applies while it works**
| `/design-tokens` | Generate, extend, or validate DTCG tokens, palettes, multi-brand theming |
| `/design-review` | Score a design across 6 dimensions plus Nielsen, with a findings table |
| `/a11y-audit` | WCAG 2.2 audit and contrast checks |
| `/design-qa` | Stand up the CI gates that keep regressions out |
/design-code  a pricing card in Vue, dark-mode aware
### 3. Run the scripts (real, no dependencies)
Plain `python3` — useful in the terminal or CI:
python3 scripts/validate_contrast.py               # batch WCAG gate: token pairs, light + dark
python3 scripts/contrast.py "#1d1d1f" "#ffffff"    # WCAG contrast ratio for one pair
python3 scripts/lint_taste.py page.html            # heuristic anti-slop taste check
node    evals/run.mjs --self-test                  # the cold-start scorer still works
These are the same gates CI runs (`.github/workflows/ci.yml`) — token validity, **WCAG contrast in light + dark**, spec completeness, and zero hardcoded values — so theme/color stays consistent across every page and accessibility is enforced, not assumed.
5. /design-review                → score + findings before ship
Token validity, WCAG contrast on a real headless render in light *and* dark, every
element in default/hover/focus, axe roles and names, focus traps, RTL, responsive
| Is it any good? | Judged, never scored | `/critique` — an adversarial `design-critic` that renders the work, argues for rejection, and cites evidence per finding |
│   └── tokens-and-color · typography-and-spacing · components · accessibility
│   ├── contrast.py            # WCAG 2.2 contrast-ratio checker
├── tokens/                    # Design tokens (DTCG format) — 13 files
│   ├── colors · typography · spacing · shadows · borders · breakpoints · motion
│   └── gradients · opacity · blur · sizing · states · theming
│   ├── design-taste.md        # Anti-slop doctrine, banned defaults, pre-flight check
├── accessibility/             # WCAG & ARIA references + inclusive design
│   ├── wcag-checklist.md      # WCAG 2.2 checklist (POUR, P0/P1/P2)
│   ├── cognitive.md · vision.md · i18n-rtl.md   # cognitive · low-vision/CVD/forced-colors · RTL
│   └── wcag-aaa.md            # AAA upgrade delta
The design token system follows a **3-tier hierarchy** using the [DTCG](https://design-tokens.github.io/community-group/format/) standard:
| **Component** | Scoped to specific components — used in code | `button.primary-bg`, `input.border-focus` |
| Framework | Version | Key Patterns |
**Concise adapters** — Vue 3 · Svelte 5 · Angular · SolidJS · Web Components (Lit) · React Native · Flutter · Jetpack Compose · vanilla CSS · CSS-in-JS (emotion/vanilla-extract/Panda)
All outputs follow **WCAG 2.2 Level AA** as a *minimum*:
- Touch targets: **24×24px** minimum (WCAG 2.5.8)
- WCAG 2.2 criteria: Focus Not Obscured, Target Size, Accessible Authentication
When reviewing designs, the agent scores across 6 weighted dimensions:
- A Claude model with sufficient context (Sonnet, Opus, or Haiku)
- Every gate now has input built to break exactly the thing it measures: an emoji in UI, raw hex, a dangling alias, a sub-AA token pair, a floating `var()`, a button that only fails contrast on hover, a control with no accessible name, a 16x16 target with a crowded neighbour, a blue Delete, a 280px overflow, a toggle Enter and Space cannot operate, silently clipped text, content revealed only by an entrance animation, a dialog Tab walks out of, an `aria-sort` header that sorts nothing, a physical margin that will not mirror under RTL, the hardcoded indigo gradient, and a 1.5x type scale. Each must exit 1. `tests/fixtures/good/clean-panel.html` must survive all sixteen render gates in light and dark.
- **A missing browser no longer reads as a pass.** Fourteen of the fifteen render gates printed `SKIPPED` and exited 0 when Playwright could not be imported — on a clean CI runner or a fresh install, `accuracy_report.mjs` would have reported 100% with fourteen gates having measured nothing. `DS_REQUIRE_BROWSER=1` turns that into exit 1, and `accuracy_report.mjs`, `evals/run.mjs` and CI's render job all set it. Without the flag the gates stay skippable for local convenience.
- **`check_no_emoji.py` and `lint_hardcodes.py` returned OK for a path that does not exist.** Scanning zero files read as clean, so a renamed directory in CI would have passed silently. Both now error on a missing path, and on a path that exists but holds nothing scannable.
- **Gate counts in prose had drifted and nothing checked them.** `ci.yml` said "12 objective gates" where the array had 14, and the README said "thirteen" and "34-check gate". `tests/meta/registry.test.mjs` now counts the real arrays and holds every claim in CI, the README and `accuracy_report.mjs` to them.
- **`init` installs a new area (`rules`)**, and the package now ships `templates/`, `.claude/rules/`, `.claude/commands/`.
- Five render-based gates for rules the kit preached and nothing checked: `verify_target_size.mjs` (WCAG 2.5.8 with the spec's real spacing / inline / label-hit-area exceptions), `verify_reduced_motion.mjs` (policy present, motion stopped, and **no content lost** — catches content only an entrance animation reveals), `verify_keyboard.mjs` (WCAG 2.1.1, ARIA-aware: roving `tabindex` and `aria-activedescendant` widgets judged by orphan-widget and dead-arrow signals, not by Tab), `lint_intent.mjs` (token **by intent**, measured on the render: a destructive action wearing `action.primary` fails), `verify_overflow.mjs` (silently clipped text and overlapping controls, with screen-reader-only text correctly exempt). `slop_tells.mjs` became a hard gate.

===== google-labs-code__stitch-skills README =====
PATH=README.md
A collection of agent skills and plugins for [Google Stitch](https://stitch.withgoogle.com), following the [Agent Skills](https://agentskills.io) open standard. Compatible with coding agents such as Codex, Antigravity, Gemini CLI, Claude Code, Cursor, and OpenCode (manual install).
### 1. Install Plugins (Recommended)
Add the Stitch Skills marketplace, then install the plugins you need.
Once the marketplace is registered, install any combination of:
# Claude Code — installs into the current project
# Cursor — installs into the current workspace
Install skills and the Stitch MCP server manually:
### 2. Install Skills Selectively
Choose only the specific skills you need.
> Stitch Design Skills often have inter-dependencies. If you choose to install skills selectively, ensure you include all required dependencies.
| [stitch::react-native](plugins/stitch-build/skills/react-native/) | Convert Stitch HTML designs to production-ready React Native components with StyleSheet and platform-specific code | · *"Convert the Stitch design to React Native components with proper theme and navigation."*<br>· *"Sync the app to the last updates of the Stitch project `13039335308618232534`."* |
Supporting tools for enhancing prompts, generating design specs, and enforcing design standards.
| [taste-design](plugins/stitch-utilities/skills/taste-design/) | Generate DESIGN.md files enforcing premium, anti-generic UI standards | *"Generate a premium DESIGN.md with strict typography and calibrated colors."* |
This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).

===== addyosmani__web-quality-skills README =====
PATH=README.md
An (unofficial) measurement-first collection of [Agent Skills](https://agentskills.io/) for optimizing web projects with [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/), Chrome DevTools for agents, Core Web Vitals, WCAG, and search guidance.
- **WCAG 2.2** accessibility standards
| **[accessibility](#accessibility)** | WCAG compliance, screen reader support, keyboard navigation | "Improve accessibility", "WCAG audit", "a11y review" |
The performance skills keep four evidence types explicit:
### Installation
add-skill is a powerful CLI tool that lets you install agent skills onto your coding agents from git repositories. Whether you're using OpenCode, Claude Code, Codex, or Cursor, the add-skill tool makes it simple to extend your agent's capabilities with specialized instruction sets. Use add-skill to automate release notes, create pull requests, integrate with external tools, and more. Simply run npx add-skill to get started.
Install as a versioned, namespaced plugin from inside Claude Code:
/plugin install web-quality-skills@addy-web-quality-skills
Install directly via the Codex plugin marketplace (Codex CLI v0.122+):
Once installed, invoke skills in chat using `@` (e.g. `@performance`, `@accessibility`). See [docs/codex-setup.md](docs/codex-setup.md) for local installation and troubleshooting.
Install directly via Gemini CLI extensions:
gemini extensions install https://github.com/addyosmani/web-quality-skills
- Agentic Browsing signals such as agent-facing semantics and optional WebMCP/`llms.txt` checks
Specialized skill for the three Core Web Vitals that describe loading, responsiveness, and visual stability. Google uses Core Web Vitals in its page-experience systems, but a passing score does not promise a ranking change.
Comprehensive accessibility audit following WCAG 2.2 guidelines.
**Trigger phrases:** "accessibility", "a11y", "WCAG", "screen reader", "keyboard navigation"
Scores help catch regressions but do not prove accessibility, security, SEO ranking, or user experience. Preserve project-specific targets and compare runs made with the same tool version and conditions.
## Framework-specific notes
Contributions welcome! Please follow the [Agent Skills specification](https://agentskills.io/specification).
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Agent Skills Specification](https://agentskills.io/specification)

===== AccessLint__skills README =====
PATH=README.md
Agent Skills for finding and fixing web accessibility issues, powered by [`@accesslint/core`](https://github.com/AccessLint/accesslint/tree/main/core). They cover the WCAG 2.2 audit workflow end to end: automated scanning, hands-on keyboard and screen-reader checks, WCAG-EM conformance auditing, remediation, and regression diffing.
**Keywords:** accessibility · a11y · WCAG 2.2 · Section 508 · screen reader · keyboard navigation · color contrast · ARIA · inclusive design
| `accessibility-inspect` | one page | Drives the page through what the engine can't decide: keyboard and focus order, names/roles/states, reflow and zoom, reduced motion, form errors, target size. Assesses; doesn't edit. |
| `accessibility-audit` | whole site | WCAG-EM: defines scope, samples representative pages and flows, runs the other two per page, reports per-criterion conformance as pass, fail, or undetermined. |
accessibility-inspect (manual)    ┘   (WCAG-EM)              (edit→verify)       (regression)
The methodology they follow — WCAG-EM, the two grading axes, the boundary against standing in for real assistive-technology users — is in [`plugins/accesslint/skills/shared/methodology.md`](plugins/accesslint/skills/shared/methodology.md).
## Install
Installs the five skills. `accessibility-scan` and `accessibility-diff` work immediately (they shell out to [`@accesslint/cli`](https://www.npmjs.com/package/@accesslint/cli)). `accessibility-fix` needs the MCP server below; `accessibility-audit` and `accessibility-inspect` also use it for rule metadata (`list_rules` / `explain_rule`) when it's available.
claude plugin install accesslint@accesslint
| `--disable <rules>` | scan | Skip specific rules |
| `explain_rule` | One rule in full: WCAG criterion, fixability, remediation guidance |
Installed standalone they are `mcp__accesslint__<tool>`; installed as a Claude Code plugin, `mcp__plugin_accesslint_accesslint__<tool>`.
connector rather than installing it from npm, and it signs you in to an
## WCAG coverage
Level A and AA — perceivable (alt text, contrast, structure), operable (keyboard, focus), understandable (labels, language), robust (ARIA, accessible names). AAA rules are opt-in via `--include-aaa`. Run `list_rules` for the active set in your installed version.
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG-EM evaluation methodology](https://www.w3.org/TR/WCAG-EM/)

===== Owl-Listener__designer-skills README =====
PATH=README.md
**273 skills and 76 commands across 33 plugins, in five collections**, for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [Gemini CLI](https://github.com/google-gemini/gemini-cli).
This just tells Claude where the skills live. Nothing installs yet.
**3. Pick what you want.** Type `/plugin` and press enter, then open the **Discover** tab. You'll see all the collections. Move with the arrow keys, press space to tick the ones you want, and enter to install. That's it.
Same three steps. On the Discover list in step 3, just tick the design ones, design-research, design-systems, ui-design, interaction-design, and so on, and leave the rest. Install as few or as many as you like, and come back for more any time.
### I only want one specific collection
| [Inclusive design](https://github.com/Owl-Listener/inclusive-design-skills) | 6 | Accessible by default: cognitive accessibility, inclusive interaction, accessible content, inclusive personas, adaptive interfaces, accessibility decisions. |
The other four collections each live in their own repo, with their own stars and full detail, and this marketplace pulls their plugins in for you — so the one install above covers all five. This repo is the front door, and the home of the design-practice collection below.
Agentic skills, commands, and plugins for design, from research to systems, UI, interaction, and delivery. **111 skills and 34 commands across 9 plugins.**
| ux-strategy | 12 | 3 | Shape product direction: competitive analysis, design principles, experience mapping, information architecture, content strategy, and service blueprints. |
| ui-design | 19 | 5 | Craft polished interfaces: layout grids, color systems, typography, responsive design, data viz, Gestalt/perceptual principles, and platform conventions. |
These nine plugins ship from **this** repo — none of them has a separate repo, and there is nothing to clone. After adding the marketplace, install one by name:
/plugin install ux-strategy@designer-skills
| `/design-ops:plan-sprint` | design-ops | Run a design sprint end to end — challenge framing, schedule, exercises, and prototype test plan. |
| `/design-ops:setup-workflow` | design-ops | Set up a team's operating rhythm end to end — rituals, task flow, tooling, review gates, and version control. |
| `/design-research:test-plan` | design-research | Run the full usability study workflow — research questions, participant criteria, tasks, metrics, and facilitation guide. |
| `/design-systems:create-component` | design-systems | Scaffold a full component specification end to end — props, states, variants, accessibility, and documentation. |
| `/designer-toolkit:write-rationale` | designer-toolkit | Write design rationale for a set of decisions, linking each to user needs, business goals, and principles. |
| `/interaction-design:design-form` | interaction-design | Design a form end to end — structure, decision points, chunking, validation, errors, and completion. |
| `/prototyping-testing:explore-options` | prototyping-testing | Run a parallel exploration end to end — frame the decision, build a spread of behaviourally distinct concepts, pressure-test each, and converge with a decision record. |
| `/ui-design:platform-audit` | ui-design | Audit a design for iOS and Android convention compliance — navigation, controls, typography, and platform-specific gaps. |
**Minimum install for this path:** design-research, ux-strategy, ui-design, interaction-design
**Minimum install for this path:** visual-critique, prototyping-testing, design-ops
### I have a specific deliverable to produce
That covers the most common asks. For all 107 skills — including the ones without a command in front of them — see the [skill index](./INDEX.md).
This collection covers conventional design. For designing AI products specifically — model interaction, alignment reasoning, error personality, agent orchestration — use the companion collection:
## Recommended install for most designers
If you're not sure where to start, install these five and you'll have coverage across the full design cycle, plus the router that tells you where to begin:
/plugin install design-research@designer-skills
/plugin install ux-strategy@designer-skills
/plugin install ui-design@designer-skills
/plugin install design-ops@designer-skills
/plugin install designer-toolkit@designer-skills
`designer-toolkit` is the one carrying `/start-here`, so install it even if you want nothing else from it.
Add others as you need them. The plugins are lightweight — installing more doesn't slow things down.
Research informs strategy. Strategy shapes UI decisions. Patterns in UI become system components. Systems flow into ops. Working against this grain is fine — but if something feels hard, it's often because a step earlier in the sequence was skipped.


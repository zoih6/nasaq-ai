#!/usr/bin/env bash
# Workspace hygiene for Nasaq AI.
#
# Why: dependencies, browser binaries, and build/test output are large and
# transient. If they pile up inside the workspace, the file tree becomes slow
# or impossible to open even though the repository itself is small (~30 MB).
# This script reports and cleans that weight without touching tracked sources.
#
# Usage:
#   bash tools/workspace-hygiene.sh status        # read-only weight report
#   bash tools/workspace-hygiene.sh clean         # remove generated output
#   bash tools/workspace-hygiene.sh clean --deps  # also remove node_modules
#   bash tools/workspace-hygiene.sh clean --all   # deps + playwright browser cache
#   bash tools/workspace-hygiene.sh browsers      # print the outside-workspace install commands

set -u

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT" || exit 1

# Generated paths, relative to the repository root. All are git-ignored.
GENERATED_DIRS=(
  "apps/web/test-results"
  "apps/web/playwright-report"
  "apps/web/.next"
  "coverage"
  ".turbo"
  "apps/web/.turbo"
)
GENERATED_GLOBS=(
  "apps/web/tsconfig.tsbuildinfo"
  "tsconfig.tsbuildinfo"
)

# Playwright browsers belong OUTSIDE the workspace; ~1 GB for three engines.
# /tmp is writable and never appears in the workspace tree.
BROWSERS_PATH_DEFAULT="/tmp/nasaq-playwright"

human() {
  du -sh "$1" 2>/dev/null | cut -f1
}

count_files() {
  find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

report_path() {
  local path="$1" label="$2"
  if [ -e "$path" ]; then
    printf '  %-28s %8s  %8s files\n' "$label" "$(human "$path")" "$(count_files "$path")"
    return 0
  fi
  printf '  %-28s %8s\n' "$label" "absent"
  return 1
}

workspace_total() {
  local files size
  files="$(find "$REPO_ROOT" -path '*/node_modules' -prune -o -type f -print 2>/dev/null | wc -l | tr -d ' ')"
  size="$(du -sh --exclude=node_modules "$REPO_ROOT" 2>/dev/null | cut -f1)"
  printf '%s' "${size:-?}|${files:-?}"
}

cmd_status() {
  local heavy=0 total
  total="$(workspace_total)"
  echo "Repository:  $REPO_ROOT"
  echo "Working tree (excluding node_modules): ${total%%|*} across ${total##*|} files"
  echo "Transient weight:"
  for d in "${GENERATED_DIRS[@]}"; do
    report_path "$d" "$d" && heavy=$((heavy + 1))
  done
  for g in "${GENERATED_GLOBS[@]}"; do
    [ -e "$g" ] && { printf '  %-28s %8s\n' "$g" "$(human "$g")"; heavy=$((heavy + 1)); }
  done
  report_path "$REPO_ROOT/node_modules" "node_modules" && heavy=$((heavy + 1))
  for bp in "${PLAYWRIGHT_BROWSERS_PATH:-$BROWSERS_PATH_DEFAULT}" "${HOME}/.cache/ms-playwright"; do
    report_path "$bp" "browsers: $(basename "$bp")" && heavy=$((heavy + 1))
  done

  echo
  if [ "$heavy" -eq 0 ]; then
    echo "Verdict: LIGHT — safe to browse the workspace."
  else
    echo "Verdict: HEAVY ($heavy transient path(s) present)."
    echo "Run: bash tools/workspace-hygiene.sh clean          # generated output only"
    echo "Run: bash tools/workspace-hygiene.sh clean --deps   # plus node_modules"
    echo "Run: bash tools/workspace-hygiene.sh clean --all    # plus browser binaries"
    echo "Every task must end LIGHT; reinstall only what the next task needs."
  fi
}

cmd_clean() {
  local with_deps="no" with_browsers="no"
  for arg in "$@"; do
    case "$arg" in
      --deps) with_deps="yes" ;;
      --browsers) with_browsers="yes" ;;
      --all) with_deps="yes"; with_browsers="yes" ;;
    esac
  done
  local removed=0

  for d in "${GENERATED_DIRS[@]}"; do
    if [ -d "$d" ]; then
      # Refuse to delete a tracked path; everything here is git-ignored output.
      if git ls-files --error-unmatch "$d" >/dev/null 2>&1; then
        echo "skip (tracked): $d"
        continue
      fi
      rm -rf "$d" && echo "removed: $d" && removed=$((removed + 1))
    fi
  done
  for g in "${GENERATED_GLOBS[@]}"; do
    [ -f "$g" ] && rm -f "$g" && echo "removed: $g" && removed=$((removed + 1))
  done
  if [ "$with_deps" = "yes" ] && [ -d "node_modules" ]; then
    rm -rf node_modules apps/web/node_modules packages/*/node_modules 2>/dev/null
    echo "removed: node_modules (reinstall with npx npm@11.6.4 ci when resuming)"
    removed=$((removed + 1))
  fi
  if [ "$with_browsers" = "yes" ]; then
    local bp="${PLAYWRIGHT_BROWSERS_PATH:-$BROWSERS_PATH_DEFAULT}"
    for b in "$bp" "${HOME}/.cache/ms-playwright"; do
      [ -e "$b" ] && rm -rf "$b" && echo "removed: $b (outside the workspace)" && removed=$((removed + 1))
    done
  fi
  [ "$removed" -eq 0 ] && echo "nothing to clean"
  cmd_status
}

cmd_browsers() {
  cat <<EOF
Playwright browsers are ~1 GB for three engines and must stay outside the workspace.

  export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-$BROWSERS_PATH_DEFAULT}
  npx playwright install chromium                 # default gate (Chromium only)
  sudo -n npx playwright install-deps chromium    # system libraries

Install Firefox and WebKit only for the single cross-browser close-out gate:

  npx playwright install firefox webkit
  sudo -n npx playwright install-deps firefox webkit

Then remove the browser cache when the gate is done (it is outside the workspace,
so it never reaches the saved snapshot, but it still costs sandbox disk):

  rm -rf \${PLAYWRIGHT_BROWSERS_PATH}
EOF
}

case "${1:-status}" in
  status) cmd_status ;;
  clean) shift; cmd_clean "$@" ;;
  browsers) cmd_browsers ;;
  *)
    echo "usage: bash tools/workspace-hygiene.sh {status|clean [--deps|--browsers|--all]|browsers}" >&2
    exit 2
    ;;
esac

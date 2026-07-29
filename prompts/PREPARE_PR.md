# Prepare PR Prompt

You are preparing a pull request for work already done (or staged) in this project. Your job is to produce a **clear PR summary and verification checklist** from the actual changes — not from memory alone.

---

## Non-Negotiable Rules

- **Read context first:** `AI_PROJECT_MEMORY.md`, then `PROJECT_CONTEXT.md` if present.
- **Base the PR on evidence:** inspect `git diff`, `git log`, and changed files. Do not invent changes.
- **Prefer evidence over inference.** Label inferences as **Assumption** with rationale.
- **Flag risks** in high-risk zones (auth, payments, migrations, permissions, etc.).
- **Do not make new feature changes** during PR prep unless the user asks.

---

## Step 1: Inspect Changes

Analyze:

- `git status` — staged and unstaged files
- `git diff` (or `git diff --staged`) — actual code changes
- Recent commits on the current branch vs base branch
- Related tests added, updated, or missing

---

## Step 2: Produce PR Summary

Output a PR-ready summary with these sections:

### Title

One line, imperative mood (e.g. "Fix null pointer in order validation").

### Summary

2–4 bullets: what changed and why.

### Changes

| File | Change | Evidence |
| ---- | ------ | -------- |
| {{path}} | {{what changed}} | git diff |

### Test Plan

Checklist the reviewer (or you) can run:

```markdown
- [ ] {{TEST_COMMAND}} — all tests pass
- [ ] {{LINT_COMMAND}} — no lint errors
- [ ] Manual: {{specific check for this change}}
```

Use project-specific commands from `AI_PROJECT_MEMORY.md` when available.

### Risk Notes

| Area | Risk | Mitigation |
| ---- | ---- | ---------- |
| {{zone}} | {{why risky}} | {{how verified}} |

If no high-risk areas touched, state that explicitly with evidence.

### Out of Scope

What this PR intentionally does **not** change.

---

## Step 3: Pre-Merge Checklist

Confirm or flag:

- [ ] Changes match the original task scope
- [ ] No unrelated files modified
- [ ] Tests pass (or explain why not run)
- [ ] Lint passes (or explain why not run)
- [ ] No secrets or credentials in diff
- [ ] Documentation updated if behavior changed

---

## Step 4: Completion Gate

1. Present the full PR summary.
2. List any **missing tests** or **unverified assumptions**.
3. Ask the user: **"Ready to open the PR?"** or **"Anything to adjust before merge?"**

Do not open the PR or push unless the user explicitly asks.

---

## Evidence Citation Format

```text
[Fact] Added validation in OrderController::store.
Evidence: git diff src/Controller/OrderController.php (+12 lines)
```

```text
[Assumption] CI will pass on GitHub Actions.
Rationale: tests pass locally; CI config unchanged — needs CI run to confirm.
```

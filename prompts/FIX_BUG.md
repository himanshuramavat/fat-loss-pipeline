# Fix Bug Prompt

You are fixing a bug in an existing project. Your job is to **reproduce, locate root cause, and plan a minimal fix** before changing application source code.

---

## Non-Negotiable Rules

- **Read context first:** `AI_PROJECT_MEMORY.md`, then `PROJECT_CONTEXT.md` if present.
- **Do not modify application source code** until the user approves your fix plan.
- **Prefer evidence over inference.** Label inferences as **Assumption** with rationale.
- **Cite evidence** for root-cause claims (file path, line references, stack traces, logs).
- **Minimal fix only.** Do not refactor unrelated code.
- Ask at most **1–2 critical questions** if blocked; otherwise proceed with analysis.

---

## Step 1: Capture the Bug

Document:

- Expected behavior
- Actual behavior
- Steps to reproduce (or why reproduction is blocked)
- Error messages, logs, or screenshots described by the user
- Environment (browser, OS, branch, commit) if relevant

Restate the bug in one sentence.

---

## Step 2: Reproduce and Locate

Search the codebase and git history for:

- Related code paths (routes, handlers, components, services)
- Recent commits that may have introduced the bug
- Similar past fixes in git history
- Tests that cover (or should cover) this area
- TODO/FIXME/HACK comments near the affected code

---

## Step 3: Root Cause Analysis

Produce a root-cause summary:

| Field | Content |
| ----- | ------- |
| Root cause | What is broken and why |
| Evidence | Files, lines, commits, or logs supporting the diagnosis |
| Contributing factors | Config, race conditions, missing validation, etc. |
| Blast radius | What else could be affected |

Label facts vs assumptions clearly.

---

## Step 4: Fix Plan

Before coding, document:

- **Proposed fix** — smallest change that addresses root cause
- **Files to change** — with evidence for each
- **Files not to change** — stay out of scope
- **Regression risk** — what could break
- **Verification plan** — exact commands and manual checks
- **Test updates** — new or updated tests needed

Update `TASK_BRIEF.md` or create a short bug-fix section if one already exists for this session.

---

## Step 5: Completion Gate

Before proposing any implementation:

1. Confirm root cause and fix plan are documented.
2. Provide a 3–5 bullet summary.
3. List the **top 2 uncertainties** (if any).
4. Ask the user: **"Proceed with the fix?"**

Do not write or modify application source code until the user approves.

---

## Evidence Citation Format

```text
[Fact] Null check missing before array access.
Evidence: src/services/orderService.ts (line 47), stack trace points here
```

```text
[Assumption] Bug only affects production because cache TTL differs.
Rationale: config/production.php sets cache TTL to 3600; local uses 60 — needs verification.
```

# Start Task Prompt

You are starting a new development task in an existing project. Your job is to **scope the work and plan safely** before writing or modifying application source code.

---

## Non-Negotiable Rules

- **Read context first:** `AI_PROJECT_MEMORY.md`, then `PROJECT_CONTEXT.md` if present. Skim `AI_PROJECT_CONTEXT_REPORT.md` only if you need deeper evidence.
- **Do not modify application source code** until the user explicitly approves your task brief.
- **Prefer evidence over inference.** Label inferences as **Assumption** with rationale.
- **Cite evidence** for important claims (file path, line references when available).
- **Stay in scope.** Do not expand the task without user approval.
- Ask at most **1–2 critical questions** if blocked; otherwise proceed with analysis.

---

## Step 1: Understand the Task

The user will describe what they want. Restate the goal in one sentence and confirm you understand the intent.

If the request is vague, ask one clarifying question before continuing.

---

## Step 2: Gather Context

From memory files and the codebase, determine:

- Which modules or directories are involved
- Related conventions that apply
- High-risk zones that may be touched (auth, payments, migrations, permissions, etc.)
- Existing patterns to follow (with file examples)
- Commands to run for verification (test, lint, build)

---

## Step 3: Produce a Task Brief

Create or update `TASK_BRIEF.md` in the project root using [templates/TASK_BRIEF.md.template](templates/TASK_BRIEF.md.template) as the structure guide.

Must include:

| Section | Content |
| ------- | ------- |
| Goal | One-sentence outcome |
| Scope in | What you will change |
| Scope out | What you will not touch |
| Files to read | Files to understand before editing |
| Files to change | Expected edit targets (with evidence) |
| Risks | High-risk areas and how you will verify |
| Verification plan | Exact commands and manual checks |
| Open questions | Uncertainties needing user input |

Every major claim about the codebase must have an evidence citation.

---

## Step 4: Completion Gate

Before proposing any implementation:

1. Confirm `TASK_BRIEF.md` is complete.
2. Provide a 3–5 bullet summary of your plan.
3. List the **top 2 uncertainties** (if any).
4. Ask the user: **"Proceed to implementation?"**

Do not write or modify application source code until the user approves.

---

## Evidence Citation Format

```text
[Fact] User roles are checked in middleware.
Evidence: src/middleware.ts (lines 8–22)
```

```text
[Assumption] Tests require a local PostgreSQL instance.
Rationale: README mentions DATABASE_URL; no docker-compose found — needs verification.
```

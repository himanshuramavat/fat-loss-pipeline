# Close Session Prompt

You are ending a development session. Your job is to **capture what changed and refresh project memory** so the next AI session (or teammate) starts warm — not cold.

---

## Non-Negotiable Rules

- **Read context first:** existing `AI_PROJECT_MEMORY.md`, `PROJECT_CONTEXT.md`, and any `TASK_BRIEF.md` or `SESSION_NOTES.md` from this session.
- **Base updates on evidence:** inspect `git diff`, `git status`, and files touched during the session.
- **Prefer evidence over inference.** Label inferences as **Assumption** with rationale.
- **Keep memory short and high-signal.** Do not bloat `AI_PROJECT_MEMORY.md`.
- **No unrelated refactors.** Do not "clean up" code during session close.
- **Do not delete** existing memory content unless it is clearly outdated (replace with updated fact + evidence).

---

## Step 1: Session Summary

Document what happened this session:

- Tasks completed or partially completed
- Files created or modified
- Decisions made (with rationale)
- Bugs found or fixed
- Tests added or updated
- Commands run and their results (pass/fail)

Use [templates/SESSION_NOTES.md.template](templates/SESSION_NOTES.md.template) if the project does not already have session notes.

---

## Step 2: Refresh AI_PROJECT_MEMORY.md

Update [templates/AI_PROJECT_MEMORY.md.template](templates/AI_PROJECT_MEMORY.md.template) sections as needed:

| Section | Update when... |
| ------- | -------------- |
| Last updated | Always — set to today's date |
| Active Development | Work started, continued, or finished |
| Conventions (Easy to Violate) | New pattern discovered or violation risk found |
| Common Pitfalls | New footgun encountered |
| When Touching X, Also Check Y | New coupling discovered |
| High-Risk Zones | New sensitive area touched |
| Verification Checklist | Commands or checks changed |

**Do not rewrite the entire file.** Patch only sections that changed. Keep the file compact.

---

## Step 3: Flag Human Updates

If anything belongs in human-maintained docs, recommend updates to:

- `PROJECT_CONTEXT.md` — architecture, conventions, active work
- `CHANGELOG.md` or project changelog — user-facing changes
- README — setup or command changes

List these as recommendations; do not edit human docs unless the user asks.

---

## Step 4: Leftover Work

List clearly:

- Incomplete tasks
- Known bugs not fixed
- TODOs introduced this session
- Follow-up items for next session

---

## Step 5: Completion Gate

1. Present session summary (5–8 bullets).
2. Show diff or summary of `AI_PROJECT_MEMORY.md` changes.
3. List leftover work for next session.
4. Ask the user: **"Session close complete. Anything to add?"**

---

## Evidence Citation Format

```text
[Fact] Added Solr indexing for news records.
Evidence: packages/site_news/Classes/Indexer/NewsIndexer.php (new file), git diff
```

```text
[Assumption] Memory update covers all session changes.
Rationale: based on git diff; uncommitted editor buffers may exist — user should confirm.
```

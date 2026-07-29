# Daily Ops Cheatsheet

Use this after initial onboarding. Pick the prompt that matches what you need right now, paste it into your AI assistant, and follow the completion gate before moving on.

**Prerequisite:** `AI_PROJECT_MEMORY.md` should exist (run [PROJECT_ONBOARDING_PROMPT.md](PROJECT_ONBOARDING_PROMPT.md) once if it does not).

---

## Which Prompt When?

| I need to... | Paste this prompt | Expected output |
| ------------ | ----------------- | --------------- |
| Start a new feature or task | [prompts/START_TASK.md](prompts/START_TASK.md) | `TASK_BRIEF.md` + approval gate |
| Fix a bug | [prompts/FIX_BUG.md](prompts/FIX_BUG.md) | Root-cause analysis + fix plan + approval gate |
| Prepare a pull request | [prompts/PREPARE_PR.md](prompts/PREPARE_PR.md) | PR title, summary, test plan, risk notes |
| End my session / refresh memory | [prompts/CLOSE_SESSION.md](prompts/CLOSE_SESSION.md) | Updated `AI_PROJECT_MEMORY.md` + session notes |

---

## Typical Day

```text
1. Open AI session in your project
2. Paste START_TASK or FIX_BUG
3. Review plan → say "Proceed"
4. Implement with your assistant
5. Paste PREPARE_PR before opening the PR
6. Paste CLOSE_SESSION at end of day
```

---

## Copy/Paste Shortcuts

Tell your agent one of these (adjust the path if you use a submodule):

```text
Follow prompts/START_TASK.md for this task: [describe what you want]
```

```text
Follow prompts/FIX_BUG.md. Bug: [describe expected vs actual]
```

```text
Follow prompts/PREPARE_PR.md for my current branch changes.
```

```text
Follow prompts/CLOSE_SESSION.md. Summarize this session and refresh AI_PROJECT_MEMORY.md.
```

If prompts live in a submodule at `.ai-onboarding/`:

```text
Follow .ai-onboarding/prompts/START_TASK.md for this task: [describe what you want]
```

---

## Artifacts by Phase

| Phase | Primary artifact | Template |
| ----- | ---------------- | -------- |
| Onboard (once) | `AI_PROJECT_CONTEXT_REPORT.md`, `AI_PROJECT_MEMORY.md` | [templates/](templates/) |
| Start task | `TASK_BRIEF.md` | [TASK_BRIEF.md.template](templates/TASK_BRIEF.md.template) |
| Close session | Updated `AI_PROJECT_MEMORY.md`, optional `SESSION_NOTES.md` | [SESSION_NOTES.md.template](templates/SESSION_NOTES.md.template) |

---

## Rules (All Daily Prompts)

- Read `AI_PROJECT_MEMORY.md` first
- Cite evidence for important claims
- Label assumptions clearly
- Do not change application code until the prompt's completion gate is passed
- Stay tool-agnostic — works with Cursor, Claude Code, Aider, Cline, and others

---

## Examples

- [Universal example](examples/universal-example.md)
- [Next.js example](examples/web-example-nextjs.md)
- [TYPO3 example](examples/typo3-example.md)

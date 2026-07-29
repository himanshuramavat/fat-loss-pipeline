# AI Project Memory

> Short, high-signal context for future AI sessions. Update when architecture or conventions change.

**Last updated:** 2026-07-29
**Source report:** AI_PROJECT_CONTEXT_REPORT.md

---

## What This Project Is

A personal **28-day fat-loss / body-recomposition tracker** presented as a “CI/CD pipeline” UI. One static page (`index.html`) with checklists, desk tips, nutrition rules, walk timer, and schedule. Progress lives in browser `localStorage`. Live on **GitHub Pages** at https://himanshuramavat.github.io/fat-loss-pipeline/.

## Stack at a Glance

- **Language:** HTML / CSS / vanilla JavaScript (single file)
- **Framework:** None
- **Database:** None (`localStorage` key `fitpipe-days-v1`)
- **Auth:** None
- **Deploy:** GitHub Actions → GitHub Pages (`https://himanshuramavat.github.io/fat-loss-pipeline/`)

## Structure

```text
fat-loss-pipeline/
├── index.html                 # entire app (UI + logic)
├── .github/workflows/static.yml
├── AI_PROJECT_CONTEXT_REPORT.md
├── AI_PROJECT_MEMORY.md
├── PROJECT_ONBOARDING_PROMPT.md / DAILY_OPS.md / prompts/ / templates/ / examples/
└── (no package manager, tests, or README yet)
```

| Path | Purpose |
| ---- | ------- |
| `index.html` | App: 28-day plan, progress, timer, static guidance panels |
| `.github/workflows/static.yml` | Deploy repo root to Pages |
| `DAILY_OPS.md` + `prompts/` | Post-onboarding AI workflows |

## Critical Decisions

- Zero-build static site: edit `index.html`, open locally or push to deploy.
- Plan data is generated in JS (`buildDays` / `tasksFor` / week patterns), not a separate data file.
- Checkbox state is `{ [dayId]: { [taskIndex]: boolean } }` — **task order is the schema**.
- Deploy artifact path is `.` (whole repo) — onboarding docs are committed on purpose and will be public on Pages.
- Ignore only local junk / session artifacts via `.gitignore` (`TASK_BRIEF.md`, `SESSION_NOTES.md`, editor/OS files) — not the onboarding kit.
- Streak: keep current plan-day logic; owner has no preferred redesign yet — do not change without an explicit ask.

## Conventions (Easy to Violate)

- Keep product changes in `index.html` unless deploy/docs intentionally change.
- Prefer camelCase JS, kebab-case CSS, versioned storage keys (`…-v1`).
- Schedule panel copy must stay consistent with `week12Pattern` / `week34Pattern`.
- Do not reorder or insert tasks mid-list without bumping `STORAGE_KEY` or migrating state.
- No bundler/modules — avoid introducing a build step without an explicit decision.

## Common Pitfalls

- Changing task strings/order silently breaks meaning of saved checkbox indices.
- “Streak” currently counts consecutive completed plan days from the program start logic in `updateHeader` — not a calendar streak; leave as-is unless asked.
- Timer state is **not** persisted; only day checkboxes are.
- `renderAll()` rebuilds DOM and rebinds listeners on every checkbox change.
- Pushing to `master` deploys immediately.

## Active Development

- Product app appears complete for v1 (HTML app + Pages workflow).
- AI onboarding kit + `AI_PROJECT_*.md` are first-class repo docs (committed, not ignored).
- No automated tests or README yet.

## When Touching X, Also Check Y

| If you change... | Also verify... |
| ---------------- | -------------- |
| `tasksFor` / day patterns | Schedule panel HTML + storage key compatibility |
| Header / streak / progress math | Empty, partial, full 28-day, and reset scenarios |
| Walk timer phases | 30 and 40 min totals; pause/resume/reset; beeps |
| `static.yml` path or triggers | What actually gets published on Pages |
| Visual theme / tabs | All six panels still switch and render |

## High-Risk Zones

Do not modify without extra care:

- `STORAGE_KEY` and `state` shape / task index mapping
- `week12Pattern`, `week34Pattern`, `buildDays`, `tasksFor`
- Walk timer interval / phase transition (`tick`, `buildPhases`)
- Destructive reset (`resetBtn`)
- GitHub Pages workflow (production publish)

## Verification Checklist

```bash
# install — none
xdg-open index.html    # or python3 -m http.server 8080
# tests — none automated
# lint — none configured
```

Before claiming done:

- [ ] Checkboxes persist across refresh
- [ ] Week 1–2 vs 3–4 patterns match Schedule tab
- [ ] Walk timer 30/40 works (start/pause/reset/done)
- [ ] Reset confirms and clears progress
- [ ] No unrelated files changed
- [ ] If deploying: Pages artifact contents are intentional

## Quick Links

- Live site: https://himanshuramavat.github.io/fat-loss-pipeline/
- Full report: [AI_PROJECT_CONTEXT_REPORT.md](./AI_PROJECT_CONTEXT_REPORT.md)
- Daily ops: [DAILY_OPS.md](./DAILY_OPS.md)
- Onboarding prompt: [PROJECT_ONBOARDING_PROMPT.md](./PROJECT_ONBOARDING_PROMPT.md)
- Deploy: [.github/workflows/static.yml](./.github/workflows/static.yml)

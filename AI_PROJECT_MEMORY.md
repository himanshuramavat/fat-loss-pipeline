# AI Project Memory

> Short, high-signal context for future AI sessions. Update when architecture or convention changes occur.

**Last updated:** 2026-07-29
**Source report:** AI_PROJECT_CONTEXT_REPORT.md

---

## What This Project Is

A personal **28-day fat-loss / body-recomposition tracker** presented as a “CI/CD pipeline” UI.

- **Web:** single static page ([`index.html`](./index.html)) on GitHub Pages.
- **Mobile:** Expo React Native app in [`mobile/`](./mobile/) (managed workflow, Expo Go + EAS APK).

Progress keys share the same shape/`fitpipe-days-v1` name but are **not synced** between web and phone.

## Stack at a Glance

- **Web:** HTML / CSS / vanilla JS → GitHub Pages (`https://himanshuramavat.github.io/fat-loss-pipeline/`)
- **Mobile:** Expo SDK **54**, React Native, TypeScript, React Navigation material top tabs
- **Mobile storage:** `@react-native-async-storage/async-storage` (`fitpipe-days-v1`)
- **Mobile alerts:** `expo-notifications` (local only), `expo-av` beep, `expo-keep-awake` during walks
- **Mobile deploy:** Expo Go for dev; `eas build -p android --profile preview` for APK

## Structure

```text
fat-loss-pipeline/
├── index.html                 # web app (Pages)
├── .github/workflows/static.yml
├── mobile/                    # Expo RN app
│   ├── App.tsx
│   ├── app.json / eas.json
│   ├── README.md              # Expo Go + EAS instructions
│   └── src/
├── AI_PROJECT_*.md / DAILY_OPS.md / prompts/ / templates/
└── .gitignore                 # OS/editor + session notes + mobile/node_modules/.expo
```

| Path | Purpose |
| ---- | ------- |
| `index.html` | Web tracker |
| `mobile/` | Phone app (port of the web UI) |
| `mobile/src/data/plan.ts` | Shared plan logic (patterns, tasks, phases) |
| `.github/workflows/static.yml` | Pages deploy (repo root; `node_modules` gitignored) |

## Critical Decisions

- Keep Pages site and Expo app **side by side** (`mobile/` subdirectory).
- Storage key/task order must stay aligned with web if sync is ever added.
- Streak: keep current plan-day logic; no redesign unless explicitly requested.
- Walk timer: wall-clock sync + local phase notifications (JS timers pause in background).
- Local notifications only — never call Expo push token APIs (breaks Expo Go Android).

## Conventions (Easy to Violate)

- Web product changes: `index.html`. Mobile: `mobile/src/**`.
- Do not reorder checklist tasks without bumping storage key / migration.
- Schedule copy must match `week12Pattern` / `week34Pattern`.
- Ignore session artifacts via `.gitignore` (`TASK_BRIEF.md`, `SESSION_NOTES.md`); do not ignore the onboarding kit.

## Common Pitfalls

- Editing only the web app leaves the phone app stale (and vice versa).
- Committing `mobile/node_modules` — must stay gitignored.
- Relying on `setInterval` alone for walk phases while backgrounded.
- Pushing to `master` redeploys Pages (web only).

## Active Development

- Mobile Expo port implemented under `mobile/`.
- Web v1 remains live on Pages.
- No automated tests yet.

## When Touching X, Also Check Y

| If you change... | Also verify... |
| ---------------- | -------------- |
| `tasksFor` / patterns (web or mobile) | Both UIs + schedule copy + storage compatibility |
| Walk timer phases | Foreground beep, background notification, 30/40 totals |
| Notification schedule | Wake 05:45, weekday desk 10–19, Android channels |
| `static.yml` / Pages | Do not upload `node_modules` (gitignore) |
| `app.json` plugins | Rebuild / Expo Go compatibility |

## High-Risk Zones

- Storage key / task index mapping (web + mobile)
- Walk timer wall-clock + notification cancellation
- GitHub Pages workflow
- EAS/`app.json` package ids once published

## Verification Checklist

```bash
# Web
xdg-open index.html

# Mobile
cd mobile && npm install && npx expo start
npx tsc --noEmit
# Later: eas build -p android --profile preview
```

Before claiming done:

- [ ] Web and/or mobile checkboxes persist
- [ ] Week patterns match Schedule tab
- [ ] Walk timer 30/40 + background phase alerts
- [ ] No unrelated files changed

## Quick Links

- Live site: https://himanshuramavat.github.io/fat-loss-pipeline/
- Mobile README: [mobile/README.md](./mobile/README.md)
- Full report: [AI_PROJECT_CONTEXT_REPORT.md](./AI_PROJECT_CONTEXT_REPORT.md)
- Daily ops: [DAILY_OPS.md](./DAILY_OPS.md)

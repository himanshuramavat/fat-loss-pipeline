# ShipFit Visual Redesign

**Date:** 2026-07-31  
**Scope:** Visual-only redesign of the Expo React Native app in `mobile/`.  
**Out of scope:** Timer logic, notification triggers, AsyncStorage keys, progress algorithms, day/task data content (except UI-facing copy scrub where pipeline jargon appears).

## Goals

Replace the CI/pipeline “terminal” theme with a clean modern fitness look branded **ShipFit**. Keep all underlying behavior identical.

## Decisions (approved)

| Topic | Choice |
|--------|--------|
| Approach | Full fitness shell (bottom tabs + new header) |
| Home weeks | Segmented control: Weeks 1–2 \| Weeks 3–4 |
| Font | Poppins (`@expo-google-fonts/poppins`) |
| App icon mark | Coral flame on charcoal |
| Tips | Merge Desk + Nutrition into one Tips tab |

## Visual system

### Color palette

| Token | Hex | Use |
|--------|-----|-----|
| Background | `#121212` | App bg, splash bg |
| Card surface | `#1E1E1E` | Cards, tab bar surface |
| Primary accent | `#FF6B4A` | Buttons, active tabs, progress ring, CTAs |
| Success | `#4ADE80` | Completed days, checked items, walk accents |
| Rest | `#7B8794` | Rest-day icon chip |
| Text primary | `#F5F5F5` | Headers, body |
| Text muted | `#9CA3AF` | Secondary labels, inactive tabs |

Supporting tokens (derived, not prescribed by user): subtle borders/dividers on charcoal (e.g. slightly lighter than card), dim tints of coral/green for chip backgrounds.

### Typography

- **Family:** Poppins (drop JetBrains Mono everywhere).
- **Weights:** Bold for numbers and headers; regular/medium for body and checklist labels.
- Inter may be removed once Poppins covers all roles.

### Branding

- Display name: **ShipFit** (`app.json` `expo.name`, header, splash).
- Package / bundle identifiers unchanged (`com.himanshuramavat.fatlosspipeline`) to avoid breaking installs and notification config.
- Icon: charcoal background, coral flame, rounded square; Android adaptive icon (foreground flame, charcoal background).
- Splash: charcoal background, “ShipFit” in Poppins (or static image with that treatment), coral accent underline or flame.

### Copy rules

Remove pipeline/build/commit/terminal language from UI. Prefer:

- “Day X of 28”, “Progress”, “Completed”, “Current streak”
- Plain coaching tone on Tips/Schedule (no `//` tags, no “between builds” jokes)

Status display remap (logic values may stay; labels change):

| Internal | UI label |
|----------|----------|
| `not started` | Not started |
| `passing` | In progress |
| `shipped` | Completed |

Do not show `buildNumber` in the UI. Use completed-day stats for “Day X of 28” and the existing `pct` for the ring.

## Navigation & screens

### Bottom tabs (4)

1. **Home** — checklist + progress header + week switcher  
2. **Timer** — walk timer (warm-up / brisk / cool-down unchanged)  
3. **Schedule** — weekly matrix + daily timeline  
4. **Tips** — Desk content + Nutrition content in one scroll  

Active tab tint: coral. Inactive: muted. Icons: home/checklist, timer, calendar, tips (e.g. lightbulb).

### Home

- **ProgressHeader** (replaces `PipelineHeader` + deletes `TerminalBar`): large circular progress ring for `%` of 28-day plan completed; “Day X of 28”; status chip; “Current streak: N days”.
- Segmented control: Weeks 1–2 | Weeks 3–4 filtering the same day list.
- **DayCard:** 16px corner radius, larger padding and checkboxes; type shown as icon chips (dumbbell / walking figure / moon) with color-coded backgrounds — not text tags.

### Timer / Schedule / Tips

- Same data and behavior; restyle to palette, Poppins, 16px cards.
- Tips: combine existing Desk + Nutrition sections without changing advice substance beyond jargon scrub.

### Chrome

- Reset progress control and footer notes kept, restyled (no monospace / pipeline tone).

## Technical plan

### Dependencies

- Add: `@expo-google-fonts/poppins`, `@react-navigation/bottom-tabs`, `react-native-svg` (ring + simple vector icons).
- Stop using JetBrains Mono; remove material-top-tabs from the main shell wiring.

### Files (expected)

| Area | Change |
|------|--------|
| `src/theme.ts` | New colors + Poppins font tokens |
| `App.tsx` | Bottom tabs, font loading, theme, remove top-tab shell |
| `PipelineHeader.tsx` | Replace with fitness `ProgressHeader` (rename/replace file) |
| `TerminalBar.tsx` | Delete |
| `DayCard.tsx`, `DeskCard.tsx` | Card radius, icons, typography, colors |
| Screens | Visual/copy polish; Tips wrapper or merged screen; Home week switcher |
| `app.json` | Name ShipFit; splash/icon colors; notification plugin accent color |
| `assets/*` | Regenerate icon, adaptive icons, splash, favicon |

### Explicit non-changes

- `src/storage/progress.ts` keys and persistence  
- `src/hooks/useWalkTimer.ts` and phase timing  
- `src/notifications/*` scheduling/triggers  
- `src/data/plan.ts` day generation and task lists (header **display** labels only if needed; prefer map in UI)  
- `src/context/ProgressContext.tsx` behavior  

### Verification / release

After UI changes: from `mobile/`, run:

```bash
eas build -p android --profile preview
```

## Success criteria

- No monospace or terminal/pipeline chrome in the UI.
- Bottom tabs + circular progress ring + icon day-type chips + Poppins + ShipFit branding assets.
- Existing progress, timer, and notifications behave as before.
- Preview Android build command documented and runnable.

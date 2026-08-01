# ShipFit Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the CI/pipeline visual theme of the Expo app with a clean ShipFit fitness UI (colors, Poppins, bottom tabs, progress ring, icon chips, new icon/splash) without changing timer, notifications, or AsyncStorage behavior.

**Architecture:** Centralize tokens in `src/theme.ts`. Swap material top tabs for a 4-tab bottom navigator. Replace pipeline header chrome with a fitness `ProgressHeader` (SVG ring). Restyle cards/screens and scrub copy. Regenerate branding assets. Logic modules stay untouched.

**Tech Stack:** Expo SDK 54, React Native 0.81, React Navigation bottom tabs, `@expo-google-fonts/poppins`, `react-native-svg`, `@expo/vector-icons` (bundled with Expo).

## Global Constraints

- Visual-only: do not change AsyncStorage keys, walk timer phase math, notification scheduling, or day/task data generation.
- Palette: bg `#121212`, card `#1E1E1E`, accent `#FF6B4A`, success `#4ADE80`, rest `#7B8794`, text `#F5F5F5`, muted `#9CA3AF`.
- Font: Poppins only in UI (no JetBrains Mono).
- Cards: 16px border radius; larger checklist hit targets.
- Brand display name: ShipFit; package/bundle IDs unchanged.
- Do not create git commits unless the user explicitly asks.
- Expo docs for this project: SDK 54 (`https://docs.expo.dev/versions/v54.0.0/`).

---

## File map

| File | Responsibility |
|------|----------------|
| `mobile/src/theme.ts` | Colors + Poppins font tokens |
| `mobile/src/components/ProgressRing.tsx` | SVG circular progress |
| `mobile/src/components/ProgressHeader.tsx` | Home header (ring, day, status, streak) |
| `mobile/src/components/TypeChip.tsx` | Day-type icon chip |
| `mobile/src/components/DayCard.tsx` | Checklist day card |
| `mobile/src/components/DeskCard.tsx` | Tip/content card |
| `mobile/src/screens/HomeScreen.tsx` | Week switcher + DaysScreen |
| `mobile/src/screens/TipsScreen.tsx` | Merged desk + nutrition |
| `mobile/src/screens/*` | Restyle existing screens |
| `mobile/App.tsx` | Bottom tabs shell, fonts |
| `mobile/app.json` | Name, splash/icon colors |
| `mobile/assets/*` | Icon, adaptive, splash |
| Delete | `TerminalBar.tsx`, `PipelineHeader.tsx` |

---

### Task 1: Theme tokens + dependencies

**Files:**
- Modify: `mobile/src/theme.ts`
- Modify: `mobile/package.json` (via `npx expo install`)

- [ ] **Step 1: Install deps from `mobile/`**

```bash
cd /home/lenovvo/Documents/fat-loss-pipeline/mobile
npx expo install @expo-google-fonts/poppins react-native-svg @react-navigation/bottom-tabs
npm uninstall @expo-google-fonts/jetbrains-mono @expo-google-fonts/inter @react-navigation/material-top-tabs react-native-tab-view
```

Keep `react-native-pager-view` if still required by other deps; otherwise it can remain unused harmlessly.

- [ ] **Step 2: Replace `src/theme.ts`**

```ts
export const colors = {
  bg: '#121212',
  card: '#1E1E1E',
  accent: '#FF6B4A',
  accentDim: 'rgba(255,107,74,0.18)',
  success: '#4ADE80',
  successDim: 'rgba(74,222,128,0.18)',
  rest: '#7B8794',
  restDim: 'rgba(123,135,148,0.22)',
  text: '#F5F5F5',
  muted: '#9CA3AF',
  line: '#2A2A2A',
  danger: '#F87171',
  warmup: '#FBBF24',
  warmupDim: 'rgba(251,191,36,0.18)',
} as const;

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const radii = { card: 16 } as const;
```

- [ ] **Step 3: Verify TypeScript still resolves theme imports after later tasks update call sites**

Run after Task 4+: `npx tsc --noEmit`

---

### Task 2: Progress ring + ProgressHeader

**Files:**
- Create: `mobile/src/components/ProgressRing.tsx`
- Create: `mobile/src/components/ProgressHeader.tsx`
- Delete: `mobile/src/components/TerminalBar.tsx`
- Delete: `mobile/src/components/PipelineHeader.tsx`

**Interfaces:**
- Consumes: `useProgress().header` (`pct`, `completedDays`, `streak`, `status`)
- Produces: `<ProgressHeader />`, `<ProgressRing size={number} progress={0-100} />`

- [ ] **Step 1: Create `ProgressRing.tsx`** using `react-native-svg` `Circle` with `strokeDasharray` / `strokeDashoffset`, track color `colors.line`, fill `colors.accent`, center children for percent label.

- [ ] **Step 2: Create `ProgressHeader.tsx`**
  - Title: ShipFit
  - Subtitle: Day `{Math.min(completedDays + 1, 28)} of 28` when not complete; when `completedDays === 28` show `Day 28 of 28`
  - Status label map: `not started` → `Not started`, `passing` → `In progress`, `shipped` → `Completed`
  - Streak: `Current streak: {n} days`
  - Ring showing `header.pct`
  - No terminal bar, no build number

- [ ] **Step 3: Delete `TerminalBar.tsx` and `PipelineHeader.tsx`**

---

### Task 3: Day cards, type chips, Home + Tips screens

**Files:**
- Create: `mobile/src/components/TypeChip.tsx`
- Modify: `mobile/src/components/DayCard.tsx`
- Modify: `mobile/src/components/DeskCard.tsx`
- Create: `mobile/src/screens/HomeScreen.tsx`
- Create: `mobile/src/screens/TipsScreen.tsx`
- Modify: `mobile/src/screens/DaysScreen.tsx` (fonts/colors only)
- Modify: `mobile/src/screens/DeskScreen.tsx` / `NutritionScreen.tsx` content used by Tips (or inline into TipsScreen)

- [ ] **Step 1: `TypeChip`** — MaterialCommunityIcons: circuit=`dumbbell`, walk=`walk`, rest=`moon-waning-crescent`. Backgrounds: accentDim/successDim/restDim; icon colors accent/success/rest.

- [ ] **Step 2: Restyle `DayCard`** — `borderRadius: 16`, padding ≥14, checkbox ≥24px, Poppins, TypeChip instead of text tag, completed border/success tint.

- [ ] **Step 3: Restyle `DeskCard`** — drop mono tag styling; optional muted eyebrow; Poppins title/body; 16px radius.

- [ ] **Step 4: `HomeScreen`** — local state `weeks: '12' | '34'`; segmented control; render `<DaysScreen weeks={weeks} />`.

- [ ] **Step 5: `TipsScreen`** — single ScrollView: Desk tips (jargon-scrubbed) then Nutrition rows (keep/cut/reduce with success/danger colors). Can compose scrubbed content from former screens.

---

### Task 4: Restyle Timer + Schedule; bottom tab App shell

**Files:**
- Modify: `mobile/src/screens/WalkTimerScreen.tsx`
- Modify: `mobile/src/screens/ScheduleScreen.tsx`
- Modify: `mobile/App.tsx`

- [ ] **Step 1: WalkTimerScreen** — Poppins, coral primary button, card radius 16, phase colors using new tokens; keep timer hook API identical.

- [ ] **Step 2: ScheduleScreen** — TypeChip or icon+label rows; scrub `//` tags in DeskCard tags to plain labels; Poppins.

- [ ] **Step 3: Rewrite `App.tsx`**
  - Load Poppins via `useFonts` from `@expo-google-fonts/poppins`
  - `createBottomTabNavigator` with screens: Home, Timer, Schedule, Tips
  - Tab icons via `@expo/vector-icons` (Ionicons/MaterialCommunityIcons)
  - `ProgressHeader` above tab content OR only on Home — **place header inside HomeScreen** so Timer/Schedule/Tips are full-bleed content; optional slim top safe area brand is unnecessary if Home owns the ring.
  - Reset + footer under navigator, restyled
  - Remove material top tabs

---

### Task 5: App icon, splash, app.json

**Files:**
- Modify: `mobile/app.json`
- Regenerate: `mobile/assets/icon.png`, `splash-icon.png`, `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png`, `favicon.png`

- [ ] **Step 1: Generate assets** with a Node script + `sharp` (install temporarily) or Python PIL: 1024 icon charcoal + coral flame; adaptive foreground transparent + flame; background solid `#121212`; splash image with ShipFit wordmark or flame + name; monochrome flame silhouette.

- [ ] **Step 2: Update `app.json`**
  - `name`: `ShipFit`
  - splash `backgroundColor`: `#121212`
  - android adaptive `backgroundColor`: `#121212`
  - notifications plugin `color`: `#FF6B4A`
  - Keep `slug`, `scheme`, package/bundle IDs unchanged

---

### Task 6: Verify + EAS preview build command

- [ ] **Step 1: Typecheck**

```bash
cd /home/lenovvo/Documents/fat-loss-pipeline/mobile && npx tsc --noEmit
```

Expected: exit 0

- [ ] **Step 2: Grep for leftover pipeline UI chrome**

```bash
rg -n "JetBrains|pipeline|TerminalBar|PipelineHeader|build #|// deployment|fat-loss-pipeline|monospace|fonts\.mono" mobile/src mobile/App.tsx || true
```

Expected: no UI hits (logic comments in notifications ok if any; prefer clean)

- [ ] **Step 3: Start EAS preview build (requires network/auth)**

```bash
cd /home/lenovvo/Documents/fat-loss-pipeline/mobile && eas build -p android --profile preview
```

Report that exact command to the user (and run it if credentials allow).

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Palette / Poppins | 1 |
| Progress ring header | 2 |
| Icon day chips, card padding | 3 |
| Week segmented control | 3 |
| Bottom tabs + Tips merge | 3–4 |
| Timer/Schedule restyle | 4 |
| Icon/splash/ShipFit name | 5 |
| No logic changes | All |
| EAS preview command | 6 |

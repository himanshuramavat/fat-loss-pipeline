# Fat Loss Pipeline — Mobile (Expo)

React Native (Expo) port of the web tracker in `../index.html`.

See also the short checklist in the **[root README](../README.md)** so you don’t lose the Expo Go / EAS steps.

**For PHP/TYPO3 folks:** this is like a TYPO3 extension, but the “frontend” runs on your phone. You write TypeScript/React; Expo packages it. You do **not** need Android Studio for day-to-day testing or for cloud APK builds.

---

## Don’t forget — run on Android (Expo Go)

This project targets **Expo SDK 54** — your Expo Go app must also be SDK 54 (check: Expo Go → Profile → app info).

```bash
cd mobile
npm install
npx expo start -c
```

(`-c` clears the Metro cache — use it after SDK changes.)

1. Install **Expo Go** from the Play Store (SDK 54).
2. Scan the terminal QR code (same Wi‑Fi as the PC).
3. If LAN fails:

```bash
npx expo start --tunnel -c
```

4. Grant notification permission when prompted.

---

## Don’t forget — build an APK (EAS, no Android Studio)

```bash
npm i -g eas-cli
eas login
cd mobile
eas init
eas build -p android --profile preview
```

Download the APK from [expo.dev](https://expo.dev) and sideload it.

Play Store bundle later:

```bash
eas build -p android --profile production
```

---

## Concepts (quick)

| Idea | Meaning |
| ---- | ------- |
| Component | A reusable UI function (like a Fluid partial) |
| Screen | A full page inside a tab |
| Hook (`use…`) | Stateful logic you can reuse (timer, progress) |
| AsyncStorage | Phone key/value storage (like `localStorage`, but `await`) |
| Expo Go | Free app that loads your project over Wi‑Fi while you develop |
| EAS Build | Expo’s cloud builder — produces a real APK without a local Android SDK |

## Notifications

This app uses **local** notifications only (wake / desk / walk phases). Remote push is never used.

In Expo Go you may still see a soft library note that `expo-notifications` is limited — that is expected. We import only local APIs so the Android **push removed** ERROR should not appear. Full notification reliability is best in an EAS/`preview` APK build.

### Background walk timer (important)

`setInterval` **pauses** when Android backgrounds the app. This app:

- Keeps the screen awake while the timer runs (`expo-keep-awake`)
- Syncs from wall-clock time when you return
- Schedules **local notifications** for phase changes so you still get alerts if the phone locks

## Project layout

```text
mobile/
  App.tsx                 # fonts, tabs, notification bootstrap
  app.json                # Expo config + notifications plugin
  eas.json                # EAS Build profiles (preview = APK)
  src/
    theme.ts
    data/plan.ts          # 28-day plan (same as web)
    storage/progress.ts   # AsyncStorage fitpipe-days-v1
    hooks/useWalkTimer.ts
    notifications/        # local reminders
    components/
    screens/
```

## Scripts

```bash
npm start          # same as npx expo start
npm run android    # start and try to open Android
npx tsc --noEmit   # typecheck
```

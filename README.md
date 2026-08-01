# Fat Loss Pipeline

Personal 28-day fat-loss tracker (CI/CD “pipeline” UI).

| Surface | Where | Live / how to run |
| ------- | ----- | ----------------- |
| **Web** | [`index.html`](./index.html) | https://himanshuramavat.github.io/fat-loss-pipeline/ |
| **Mobile** | [`mobile/`](./mobile/) | Expo Go on phone, or APK via EAS (see below) |

You do **not** need Android Studio for phone testing or for cloud APK builds.

---

## Don’t forget — mobile on your phone (Expo Go)

Project uses **Expo SDK 54** (must match Expo Go’s supported SDK).

1. Install **Expo Go** from the Play Store (SDK 54).
2. On your PC, same Wi‑Fi as the phone:

```bash
cd mobile
npm install
npx expo start -c
```

3. Scan the QR code with Expo Go.
4. If the phone can’t reach your PC:

```bash
npx expo start --tunnel -c
```

5. Allow notifications when asked (wake reminder, desk stand-up, walk phase alerts).

More detail: [`mobile/README.md`](./mobile/README.md).

---

## Don’t forget — real APK later (EAS Build, cloud)

No local Android SDK required.

```bash
# one-time
npm i -g eas-cli
eas login
cd mobile
eas init          # links project on expo.dev; writes projectId into app config

# whenever you want an APK
eas build -p android --profile preview
```

Then download the APK from the [Expo dashboard](https://expo.dev) and install it on the phone (allow “install unknown apps” if prompted).

Play Store bundle (later):

```bash
eas build -p android --profile production
```

---

## Web site

- Edit [`index.html`](./index.html)
- Push to `master` → GitHub Actions deploys Pages
- Progress is stored in browser `localStorage` (not synced with the phone app)

Open locally:

```bash
xdg-open index.html
# or: python3 -m http.server 8080
```

---

## Repo layout (short)

```text
index.html          # web app
mobile/             # Expo React Native app
.github/workflows/  # Pages deploy
AI_PROJECT_MEMORY.md
```

---

## AI / daily workflows

After onboarding, use [`DAILY_OPS.md`](./DAILY_OPS.md) and the prompts in [`prompts/`](./prompts/).

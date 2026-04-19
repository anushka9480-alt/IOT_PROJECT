# IoT Medication Reminder App

An IoT medication adherence assistant with an Expo mobile workflow and a Vite web landing page for the product experience.

## Live Demo

Web application: https://iot-medication-reminder-app.vercel.app

APK release link: https://github.com/anushka9480-alt/IOT_PROJECT/releases/latest/download/medicine-adherence-assistant.apk

## Repository

GitHub: https://github.com/anushka9480-alt/IOT_PROJECT

## Project Structure

```
IOT_PROJECT/
├── frontend/
│   ├── mobile/          # Expo React Native medication assistant
│   │   ├── App.tsx
│   │   ├── src/
│   │   ├── assets/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── ...
│   └── web/             # Vite React landing page (deployed on Vercel)
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── ...
├── backend/             # Express API with Prisma & SQLite
│   ├── src/
│   ├── prisma/
│   ├── scripts/
│   ├── package.json
│   └── ...
├── tools/               # Documentation & infrastructure
│   ├── docs/            # Phase guides & release checklist
│   ├── supabase/        # Edge functions & migrations
│   ├── dd.md            # System design document
│   ├── prd.md           # Product requirements document
│   ├── techs.md         # Tech stack document
│   └── Todo.md          # Project todo list
├── .env.example
├── .gitignore
└── README.md
```

## Run Locally

### Mobile App (Expo)

```bash
cd frontend/mobile
npm install
npm run start
```

### Web Landing Page (Vite)

```bash
cd frontend/web
npm install
npm run dev
```

### Backend API

```bash
cd backend
npm install
npm run dev
```

### Preview mobile app on laptop

```bash
cd frontend/mobile
npm run preview:laptop
```

### Build Android APK with Expo EAS

```bash
cd frontend/mobile
npx eas build --platform android --profile preview
```

## APK Release Workflow

GitHub Actions now includes `.github/workflows/build-android-apk.yml`.

To make the APK link work as a real downloadable file on GitHub Releases:

1. Add an `EXPO_TOKEN` secret in the GitHub repository settings.
2. Push to `main` or run the workflow manually from the Actions tab.
3. The workflow builds the preview APK with EAS, uploads it to the `latest-apk` GitHub release, and keeps this download URL current:

```text
https://github.com/anushka9480-alt/IOT_PROJECT/releases/latest/download/medicine-adherence-assistant.apk
```

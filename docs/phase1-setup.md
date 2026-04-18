# Phase 1 Setup

## Initialization commands

```bash
npx create-expo-app@latest medicine-adherence-assistant --template blank-typescript
cd medicine-adherence-assistant
npx expo install expo-notifications expo-speech expo-camera expo-audio expo-file-system
npm install @google/generative-ai
npm install -D vitest
```

## Environment variables

Copy `.env.example` to `.env` and fill in the project credentials:

```bash
copy .env.example .env
```

## Prisma backend

Initialize the backend service and Prisma schema from the `backend/` folder:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Follow-on workspace files

The remaining phases are scaffolded in:

- `src/state/MedicineAssistantProvider.tsx`
- `src/components/`
- `src/screens/`
- `backend/prisma/schema.prisma`
- `backend/src/`
- `tests/`

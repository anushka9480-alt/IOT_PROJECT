# Phase 2-7 Workspace Notes

This workspace now contains code and scaffolding for the remaining to-do phases:

## Phase 2

- Medication schedule form: `src/components/medication/MedicationForm.tsx`
- Reminder engine: `src/components/workflow/ReminderPanel.tsx`
- Local notifications and TTS: `src/services/reminders.ts`, `src/services/tts.ts`

## Phase 3

- Camera UI: `src/screens/CameraVerificationScreen.tsx`
- Gemini vision prompt and parser: `src/services/gemini.ts`

## Phase 4

- Voice recording UI: `src/screens/VoiceVerificationScreen.tsx`
- Audio-to-Gemini flow: `src/services/fileEncoding.ts`, `src/services/gemini.ts`

## Phase 5

- Verification merge logic: `src/services/evaluation.ts`
- Risk scoring engine: `src/services/riskScore.ts`
- App workflow state: `src/state/MedicineAssistantProvider.tsx`
- Prisma-backed persistence API: `backend/src/routes/api.ts`

## Phase 6

- Caregiver alert endpoint: `backend/src/routes/api.ts`

## Phase 7

- Prompt/risk unit tests: `tests/geminiPrompts.test.ts`, `tests/riskScore.test.ts`
- Build checklist: `docs/release-checklist.md`

## Install commands

```bash
npm install
cd backend && npm install
```

## Test commands

```bash
npx vitest run
```

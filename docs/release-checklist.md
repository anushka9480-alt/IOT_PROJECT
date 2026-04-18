# Release Checklist

## Phase 7 Testing

- Run risk scoring and Gemini prompt tests with `npx vitest run`
- Perform device tests for:
  - medication schedule entry
  - local reminder firing
  - camera capture
  - microphone recording
  - Gemini JSON parsing on image and audio results
  - caregiver alert webhook forwarding
- Conduct elderly-focused usability checks for:
  - readable text sizes
  - large tap targets
  - clear reminder language
  - simple camera and microphone flow

## Export

Use Expo Application Services for platform builds:

```bash
npx expo install eas-cli
npx eas build --platform android
npx eas build --platform ios
```

Android output is the APK/AAB build artifact from EAS, and iOS output is the IPA build artifact from EAS.

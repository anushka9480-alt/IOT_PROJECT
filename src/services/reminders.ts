export type ReminderPayload = {
  medicationId: string;
  scheduledAt: string;
  medicationName: string;
  dosage: string;
};

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleMedicationReminder(payload: ReminderPayload) {
  await Notifications.setNotificationChannelAsync('medication-reminders', {
    name: 'Medication Reminders',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
  });

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medication Reminder',
      body: `Time to take ${payload.medicationName} (${payload.dosage}).`,
      data: {
        medicationId: payload.medicationId,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(payload.scheduledAt),
    },
  });
}

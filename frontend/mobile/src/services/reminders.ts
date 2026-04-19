export type ReminderPayload = {
  medicationId: string;
  scheduledAt: string;
  medicationName: string;
  dosage: string;
};

export type CourseReminderPayload = {
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduleTime: string;
  courseStartDate: string;
  courseEndDate: string;
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

function buildScheduledDate(dateString: string, scheduleTime: string) {
  const [hours, minutes] = scheduleTime.split(':').map((value) => Number(value));
  const date = new Date(`${dateString}T00:00:00`);
  date.setHours(Number.isFinite(hours) ? hours : 8);
  date.setMinutes(Number.isFinite(minutes) ? minutes : 0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export async function scheduleMedicationCourse(payload: CourseReminderPayload) {
  await Notifications.setNotificationChannelAsync('medication-reminders', {
    name: 'Medication Reminders',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
  });

  const startDate = new Date(`${payload.courseStartDate}T00:00:00`);
  const endDate = new Date(`${payload.courseEndDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderIds: string[] = [];

  for (
    let cursor = new Date(startDate);
    cursor <= endDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateLabel = cursor.toISOString().slice(0, 10);
    const scheduledDate = buildScheduledDate(dateLabel, payload.scheduleTime);

    if (scheduledDate <= new Date()) {
      continue;
    }

    const reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine course reminder',
        body: `Take ${payload.medicationName} ${payload.dosage} ${payload.scheduleTime}.`,
        data: { medicationId: payload.medicationId, type: 'dose-reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledDate,
      },
    });

    reminderIds.push(reminderId);
  }

  if (endDate >= today) {
    const courseEndReminder = new Date(`${payload.courseEndDate}T18:00:00`);

    if (courseEndReminder > new Date()) {
      const courseEndId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Medicine course ending',
          body: `${payload.medicationName} is scheduled to end today. Review or end the course in the app.`,
          data: { medicationId: payload.medicationId, type: 'course-ending' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: courseEndReminder,
        },
      });

      reminderIds.push(courseEndId);
    }
  }

  return reminderIds;
}

export async function cancelMedicationReminders(notificationIds: string[]) {
  await Promise.all(
    notificationIds.map(async (notificationId) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      } catch {
        // Ignore cancellation failures for notifications that already fired or no longer exist.
      }
    }),
  );
}

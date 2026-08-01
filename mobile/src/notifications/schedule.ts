import {
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
} from './local';
import { CHANNELS } from './setup';

const WAKE_TAG = 'fitpipe-wake';
const DESK_TAG_PREFIX = 'fitpipe-desk';

/** Daily wake at 05:45 — matches schedule copy in the HTML app. */
export async function scheduleWakeReminder(): Promise<void> {
  await cancelTaggedNotifications(WAKE_TAG);

  await scheduleNotificationAsync({
    content: {
      title: 'ShipFit',
      body: "05:45 — time to start today's workout block",
      sound: true,
      data: { type: 'wake' },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 5,
      minute: 45,
      channelId: CHANNELS.wake,
    },
    identifier: WAKE_TAG,
  });
}

/**
 * Weekday hourly desk stand-up, 10:00–19:00 inclusive.
 * Expo weekday: 1 = Sunday … 7 = Saturday → Mon–Fri = 2..6
 */
export async function scheduleDeskReminders(): Promise<void> {
  const existing = await getAllScheduledNotificationsAsync();
  await Promise.all(
    existing
      .filter((n) => n.identifier.startsWith(DESK_TAG_PREFIX))
      .map((n) => cancelScheduledNotificationAsync(n.identifier)),
  );

  const weekdays = [2, 3, 4, 5, 6]; // Mon–Fri
  const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  for (const weekday of weekdays) {
    for (const hour of hours) {
      const id = `${DESK_TAG_PREFIX}-${weekday}-${hour}`;
      await scheduleNotificationAsync({
        content: {
          title: 'Desk mode',
          body: 'Get up — stand, drink water, look far away',
          sound: true,
          data: { type: 'desk' },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute: 0,
          channelId: CHANNELS.desk,
        },
        identifier: id,
      });
    }
  }
}

export async function scheduleRecurringReminders(): Promise<void> {
  await scheduleWakeReminder();
  await scheduleDeskReminders();
}

async function cancelTaggedNotifications(identifier: string): Promise<void> {
  try {
    await cancelScheduledNotificationAsync(identifier);
  } catch {
    // ignore missing
  }
}

let walkNotificationIds: string[] = [];

export async function cancelWalkPhaseNotifications(): Promise<void> {
  await Promise.all(
    walkNotificationIds.map((id) =>
      cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
  walkNotificationIds = [];
}

/**
 * Schedule one-shot local notifications for remaining phase boundaries.
 * Needed because setInterval pauses when the app is backgrounded.
 */
export async function scheduleWalkPhaseNotifications(
  phaseEndTimestamps: { at: Date; title: string; body: string }[],
): Promise<void> {
  await cancelWalkPhaseNotifications();
  const now = Date.now();

  for (let i = 0; i < phaseEndTimestamps.length; i++) {
    const item = phaseEndTimestamps[i];
    const ms = item.at.getTime() - now;
    if (ms < 500) continue;

    const id = `fitpipe-walk-phase-${i}-${item.at.getTime()}`;
    await scheduleNotificationAsync({
      content: {
        title: item.title,
        body: item.body,
        sound: true,
        data: { type: 'walk-phase' },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: item.at,
        channelId: CHANNELS.walk,
      },
      identifier: id,
    });
    walkNotificationIds.push(id);
  }
}

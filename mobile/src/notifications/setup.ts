import { Platform } from 'react-native';
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from './local';

export const CHANNELS = {
  default: 'default',
  wake: 'wake-reminders',
  desk: 'desk-reminders',
  walk: 'walk-timer',
} as const;

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await setNotificationChannelAsync(CHANNELS.default, {
    name: 'General',
    importance: AndroidImportance.DEFAULT,
  });
  await setNotificationChannelAsync(CHANNELS.wake, {
    name: 'Wake reminders',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
  await setNotificationChannelAsync(CHANNELS.desk, {
    name: 'Desk stand-up',
    importance: AndroidImportance.DEFAULT,
  });
  await setNotificationChannelAsync(CHANNELS.walk, {
    name: 'Walk timer',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 100, 200],
  });
}

/** Request local notification permission. Does not use remote push tokens. */
export async function requestNotificationPermissions(): Promise<boolean> {
  await setupNotificationChannels();
  const { status: existing } = await getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await requestPermissionsAsync();
  return status === 'granted';
}

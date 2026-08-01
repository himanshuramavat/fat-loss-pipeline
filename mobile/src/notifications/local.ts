/**
 * Local-notification-only imports.
 *
 * Avoid `import … from 'expo-notifications'` barrel — it loads
 * DevicePushTokenAutoRegistration.fx, which registers a push-token listener and
 * logs ERROR in Expo Go on Android (remote push was removed from Expo Go).
 * This app only schedules local notifications.
 */
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import cancelScheduledNotificationAsync from 'expo-notifications/build/cancelScheduledNotificationAsync';
import getAllScheduledNotificationsAsync from 'expo-notifications/build/getAllScheduledNotificationsAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';

export {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  setNotificationChannelAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationHandler,
  AndroidImportance,
  SchedulableTriggerInputTypes,
};

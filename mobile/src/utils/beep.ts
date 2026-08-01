import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';

let lastBeepAt = 0;

/**
 * Phase-change feedback without expo-av (deprecated in SDK 54).
 * Uses haptics + a short vibration — works in Expo Go.
 */
export async function playBeep(freqHint: 'phase' | 'done' = 'phase'): Promise<void> {
  const now = Date.now();
  if (now - lastBeepAt < 200) return;
  lastBeepAt = now;

  try {
    if (freqHint === 'done') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (Platform.OS === 'android') Vibration.vibrate([0, 80, 60, 120]);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (Platform.OS === 'android') Vibration.vibrate(60);
    }
  } catch (e) {
    console.warn('beep/haptics failed', e);
  }
}

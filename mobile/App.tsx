import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScheduleScreen } from './src/screens/ScheduleScreen';
import { TipsScreen } from './src/screens/TipsScreen';
import { WalkTimerScreen } from './src/screens/WalkTimerScreen';
import { requestNotificationPermissions } from './src/notifications/setup';
import { scheduleRecurringReminders } from './src/notifications/schedule';
import { colors, fonts } from './src/theme';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.line,
    primary: colors.accent,
  },
};

function AppShell() {
  const { resetAll } = useProgress();
  const [notifStatus, setNotifStatus] = useState<'pending' | 'ok' | 'denied'>('pending');

  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleRecurringReminders();
        setNotifStatus('ok');
      } else {
        setNotifStatus('denied');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.wrap}>
        <View style={styles.tabsWrap}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarActiveTintColor: colors.accent,
              tabBarInactiveTintColor: colors.muted,
              tabBarLabelStyle: styles.tabLabel,
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="checkbox-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Timer"
              component={WalkTimerScreen}
              options={{
                title: 'Timer',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="timer-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{
                title: 'Schedule',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Tips"
              component={TipsScreen}
              options={{
                title: 'Tips',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="lightbulb-outline" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </View>
        <Pressable onPress={resetAll} style={styles.reset}>
          <Text style={styles.resetText}>Reset all progress</Text>
        </Pressable>
        <Text style={styles.footer}>
          Train daily · rest days skip workouts, not water or protein
          {notifStatus === 'denied'
            ? '\nNotifications denied — enable in system settings for reminders'
            : ''}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <NavigationContainer theme={navTheme}>
          <AppShell />
        </NavigationContainer>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, paddingTop: 4 },
  tabsWrap: { flex: 1 },
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    height: 62,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  reset: { alignItems: 'center', marginTop: 10 },
  resetText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});

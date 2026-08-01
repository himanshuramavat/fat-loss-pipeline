import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ALL_DAYS } from '../data/plan';
import { DayCard } from '../components/DayCard';
import { colors, fonts } from '../theme';

export function DaysScreen({ weeks }: { weeks: '12' | '34' }) {
  const days = useMemo(
    () => ALL_DAYS.filter((d) => (weeks === '12' ? d.week <= 2 : d.week > 2)),
    [weeks],
  );

  let currentWeek: number | null = null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {days.map((day) => {
        const showWeek = day.week !== currentWeek;
        if (showWeek) currentWeek = day.week;
        return (
          <View key={day.id}>
            {showWeek ? <Text style={styles.weekTitle}>Week {day.week}</Text> : null}
            <DayCard day={day} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14, paddingBottom: 24 },
  weekTitle: {
    fontFamily: fonts.semi,
    fontSize: 13,
    color: colors.muted,
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
});

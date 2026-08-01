import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../context/ProgressContext';
import { colors, fonts, radii } from '../theme';
import { ProgressRing } from './ProgressRing';

const STATUS_LABEL: Record<string, string> = {
  'not started': 'Not started',
  passing: 'In progress',
  shipped: 'Completed',
};

export function ProgressHeader() {
  const { header } = useProgress();
  const dayOf = header.completedDays >= 28 ? 28 : header.completedDays + 1;
  const statusLabel = STATUS_LABEL[header.status] ?? header.status;
  const statusTone =
    header.status === 'shipped'
      ? { bg: colors.successDim, fg: colors.success }
      : header.status === 'not started'
        ? { bg: colors.restDim, fg: colors.rest }
        : { bg: colors.accentDim, fg: colors.accent };

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text style={styles.brand}>ShipFit</Text>
          <Text style={styles.day}>Day {dayOf} of 28</Text>
          <View style={[styles.badge, { backgroundColor: statusTone.bg }]}>
            <Text style={[styles.badgeText, { color: statusTone.fg }]}>{statusLabel}</Text>
          </View>
          <Text style={styles.streak}>
            Current streak: <Text style={styles.streakBold}>{header.streak}</Text> days
          </Text>
        </View>
        <ProgressRing progress={header.pct} size={132} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  copy: { flex: 1, paddingRight: 4 },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.text,
    marginBottom: 4,
  },
  day: {
    fontFamily: fonts.semi,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: { fontFamily: fonts.semi, fontSize: 12 },
  streak: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  streakBold: { fontFamily: fonts.bold, color: colors.accent },
});

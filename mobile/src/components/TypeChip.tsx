import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DayType } from '../data/plan';
import { colors } from '../theme';

const META: Record<
  DayType,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; bg: string; fg: string }
> = {
  circuit: { icon: 'dumbbell', bg: colors.accentDim, fg: colors.accent },
  walk: { icon: 'walk', bg: colors.successDim, fg: colors.success },
  rest: { icon: 'moon-waning-crescent', bg: colors.restDim, fg: colors.rest },
};

export function TypeChip({ type }: { type: DayType }) {
  const m = META[type];
  return (
    <View style={[styles.chip, { backgroundColor: m.bg }]}>
      <MaterialCommunityIcons name={m.icon} size={16} color={m.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressHeader } from '../components/ProgressHeader';
import { colors, fonts, radii } from '../theme';
import { DaysScreen } from './DaysScreen';

export function HomeScreen() {
  const [weeks, setWeeks] = useState<'12' | '34'>('12');

  return (
    <View style={styles.root}>
      <View style={styles.headerPad}>
        <ProgressHeader />
        <View style={styles.segment}>
          {(
            [
              { key: '12', label: 'Weeks 1–2' },
              { key: '34', label: 'Weeks 3–4' },
            ] as const
          ).map((opt) => {
            const active = weeks === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[styles.segBtn, active && styles.segBtnActive]}
                onPress={() => setWeeks(opt.key)}
              >
                <Text style={[styles.segText, active && styles.segTextActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <DaysScreen weeks={weeks} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerPad: { paddingHorizontal: 14, paddingTop: 4 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  segBtnActive: { backgroundColor: colors.accentDim },
  segText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  segTextActive: { color: colors.accent, fontFamily: fonts.semi },
});

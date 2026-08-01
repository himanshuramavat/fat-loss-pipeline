import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeskCard } from '../components/DeskCard';
import { colors, fonts, radii } from '../theme';

const NUTRITION: { text: string; flag: 'keep' | 'cut' | 'reduce' }[] = [
  { text: 'Protein in every meal — dal, paneer, curd, sprouts', flag: 'keep' },
  { text: 'Sugar in tea/coffee', flag: 'cut' },
  { text: 'Fried snacks & cold drinks', flag: 'cut' },
  { text: 'Maida items (bread, bakery)', flag: 'reduce' },
  { text: 'Water — 3+ litres/day', flag: 'keep' },
  { text: 'Home food, smaller portions', flag: 'keep' },
];

export function TipsScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.section}>Desk habits</Text>
      <DeskCard tag="Every 45–60 min" title="Get up, no exceptions">
        Set a silent phone alarm every 45–60 minutes while you work. Stand, walk to get water, look at
        something far away. Sitting for hours straight is its own risk factor, separate from diet.
      </DeskCard>
      <DeskCard tag="Posture" title="Feet flat, screen at eye level">
        Feet flat on the floor, knees at roughly 90°, screen top edge at eye level so you are not
        hunching forward. If your setup forces you to look down all day, a stack of books under the
        monitor fixes it for free.
      </DeskCard>
      <DeskCard tag="Micro-stretch" title="60 seconds between tasks">
        While something loads or you wait: neck rolls, shoulder rolls back, and a standing back-bend.
        Small, but it adds up over an 8–10 hour sitting day.
      </DeskCard>
      <DeskCard tag="Snacks" title="Keep desk snacking intentional">
        Mindless snacking while focused is an easy calorie leak. Keep roasted chana, makhana, or fruit
        at your desk instead of biscuits or chips, so the default reach is a better one.
      </DeskCard>

      <Text style={styles.section}>Nutrition</Text>
      {NUTRITION.map((row) => (
        <View key={row.text} style={styles.row}>
          <Text style={styles.text}>{row.text}</Text>
          <Text
            style={[
              styles.flag,
              row.flag === 'keep' ? styles.keep : row.flag === 'cut' ? styles.cut : styles.reduce,
            ]}
          >
            {row.flag}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14, paddingBottom: 28, paddingTop: 8 },
  section: {
    fontFamily: fonts.semi,
    fontSize: 13,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    marginBottom: 10,
  },
  text: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text, lineHeight: 20 },
  flag: { fontFamily: fonts.semi, fontSize: 12, textTransform: 'capitalize' },
  keep: { color: colors.success },
  cut: { color: colors.danger },
  reduce: { color: colors.warmup },
});

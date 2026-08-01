import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeskCard } from '../components/DeskCard';
import { TypeChip } from '../components/TypeChip';
import { colors, fonts, radii } from '../theme';

const ROWS: {
  day: string;
  w12: string;
  w34: string;
  t12: 'circuit' | 'walk' | 'rest';
  t34: 'circuit' | 'walk' | 'rest';
}[] = [
  { day: 'Mon', w12: 'Circuit', w34: 'Circuit', t12: 'circuit', t34: 'circuit' },
  { day: 'Tue', w12: 'Walk', w34: 'Circuit', t12: 'walk', t34: 'circuit' },
  { day: 'Wed', w12: 'Circuit', w34: 'Walk', t12: 'circuit', t34: 'walk' },
  { day: 'Thu', w12: 'Walk', w34: 'Circuit', t12: 'walk', t34: 'circuit' },
  { day: 'Fri', w12: 'Circuit', w34: 'Circuit', t12: 'circuit', t34: 'circuit' },
  { day: 'Sat', w12: 'Walk', w34: 'Walk', t12: 'walk', t34: 'walk' },
  { day: 'Sun', w12: 'Rest', w34: 'Rest', t12: 'rest', t34: 'rest' },
];

export function ScheduleScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.weekTitle}>Weekly plan</Text>
      <View style={styles.table}>
        <View style={styles.head}>
          <Text style={styles.headCell}>Day</Text>
          <Text style={styles.headCell}>Weeks 1–2</Text>
          <Text style={styles.headCell}>Weeks 3–4</Text>
        </View>
        {ROWS.map((r) => (
          <View key={r.day} style={styles.row}>
            <Text style={styles.day}>{r.day}</Text>
            <View style={styles.cell}>
              <TypeChip type={r.t12} />
              <Text style={styles.cellLabel}>{r.w12}</Text>
            </View>
            <View style={styles.cell}>
              <TypeChip type={r.t34} />
              <Text style={styles.cellLabel}>{r.w34}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.weekTitle}>Daily timeline</Text>
      <DeskCard
        tag="Circuit day — Mon / Wed / Fri (wk 1–2), Mon / Tue / Thu / Fri (wk 3–4)"
        title="~50–55 min morning block"
      >
        {`5:45–6:00 — wake up
6:00–6:35 — brisk walk (30–35 min)
6:35–6:55 — bodyweight circuit (15–20 min)
6:55–7:15 — shower
7:15–7:45 — protein breakfast + black coffee
7:45–9:15 — get ready + commute`}
      </DeskCard>
      <DeskCard
        tag="Walk-only day — Tue / Sat (wk 1–2), Wed / Sat (wk 3–4)"
        title="~35–40 min morning block"
      >
        {`5:45–6:00 — wake up
6:00–6:40 — brisk walk (30–40 min, full length)
6:40–7:00 — shower
7:00–7:30 — protein breakfast + black coffee
7:30–9:15 — get ready + commute`}
      </DeskCard>
      <DeskCard tag="Rest day — Sunday" title="No walk, no circuit">
        Sleep in a bit if needed, but keep meal timing and water intake the same. Full rest from
        workouts, not from the rest of the routine.
      </DeskCard>
      <DeskCard tag="Every evening" title="~9 PM onward">
        {`9:00–9:30 — reach home, light dinner
9:30–10:15 — wind down, desk stretches, lighter screen time
10:30–11:00 — sleep`}
      </DeskCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14, paddingBottom: 24, paddingTop: 8 },
  weekTitle: {
    fontFamily: fonts.semi,
    fontSize: 13,
    color: colors.muted,
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  table: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: 6,
  },
  head: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headCell: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  day: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  cell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cellLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.text },
});

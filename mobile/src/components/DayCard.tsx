import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DayPlan } from '../data/plan';
import { isDayComplete } from '../data/plan';
import { useProgress } from '../context/ProgressContext';
import { colors, fonts, radii } from '../theme';
import { TypeChip } from './TypeChip';

export function DayCard({ day }: { day: DayPlan }) {
  const { state, toggleTask } = useProgress();
  const dayState = state[String(day.id)] || {};
  const done = isDayComplete(day, state);

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.head}>
        <Text style={styles.title}>Day {day.id}</Text>
        <TypeChip type={day.type} />
      </View>
      {day.tasks.map((task, i) => {
        const checked = !!dayState[String(i)];
        return (
          <Pressable
            key={`${day.id}-${i}`}
            style={styles.task}
            onPress={() => toggleTask(day.id, i)}
          >
            <View style={[styles.checkbox, checked && styles.checkboxOn]}>
              <Text style={styles.checkMark}>{checked ? '✓' : ''}</Text>
            </View>
            <Text style={[styles.label, checked && styles.labelDone]}>{task}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 12,
  },
  cardDone: {
    borderColor: colors.success,
    backgroundColor: '#16241C',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { borderColor: colors.success, backgroundColor: colors.successDim },
  checkMark: { fontSize: 14, color: colors.success, lineHeight: 16 },
  label: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, lineHeight: 22 },
  labelDone: { color: colors.muted, textDecorationLine: 'line-through' },
});

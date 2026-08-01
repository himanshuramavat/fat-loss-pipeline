import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeskCard } from '../components/DeskCard';
import { useWalkTimer } from '../hooks/useWalkTimer';
import { formatClock } from '../data/plan';
import { colors, fonts, radii } from '../theme';

export function WalkTimerScreen() {
  const timer = useWalkTimer();
  const totalSecs = timer.phases.reduce((a, p) => a + p.secs, 0);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.durationRow}>
          {[30, 40].map((mins) => {
            const active = timer.totalMinutes === mins;
            return (
              <Pressable
                key={mins}
                style={[styles.durBtn, active && styles.durBtnActive]}
                onPress={() => timer.setDuration(mins)}
                disabled={timer.isRunning}
              >
                <Text style={[styles.durText, active && styles.durTextActive]}>{mins} min</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.phase}>{timer.phaseLabel}</Text>
        <Text style={styles.clock}>{formatClock(timer.secondsLeftInPhase)}</Text>
        <Text style={styles.sub}>{timer.phaseSub}</Text>

        <View style={styles.track}>
          {timer.phases.map((p, i) => {
            let fill = 0;
            if (i < timer.phaseIndex) fill = 100;
            else if (i === timer.phaseIndex && p.secs > 0) {
              fill = Math.round(((p.secs - timer.secondsLeftInPhase) / p.secs) * 100);
            }
            const bg =
              p.cls === 'warmup'
                ? colors.warmupDim
                : p.cls === 'brisk'
                  ? colors.successDim
                  : colors.accentDim;
            const fg =
              p.cls === 'warmup'
                ? colors.warmup
                : p.cls === 'brisk'
                  ? colors.success
                  : colors.accent;
            return (
              <View
                key={p.cls}
                style={[styles.seg, { flex: p.secs / totalSecs, backgroundColor: bg }]}
              >
                <View style={[styles.segFill, { width: `${fill}%`, backgroundColor: fg }]} />
              </View>
            );
          })}
        </View>

        <View style={styles.controls}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={timer.toggleStartPause}>
            <Text style={[styles.btnText, styles.btnPrimaryText]}>{timer.startLabel}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={timer.reset}>
            <Text style={styles.btnText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <DeskCard tag="Pace check" title="Talk test">
        During the brisk phase you should be able to talk in short sentences, not sing. If you can chat
        easily, speed up. If you can not get a sentence out, slow down slightly.
      </DeskCard>

      <Text style={styles.note}>
        Tip: if you lock the phone, phase changes still fire as local notifications (timers pause in
        the background).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14, paddingBottom: 24, paddingTop: 8 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 12,
    alignItems: 'center',
  },
  durationRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  durBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  durBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  durText: { fontFamily: fonts.semi, fontSize: 13, color: colors.muted },
  durTextActive: { color: colors.accent },
  phase: {
    fontFamily: fonts.semi,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.warmup,
    marginBottom: 6,
  },
  clock: {
    fontFamily: fonts.bold,
    fontSize: 52,
    color: colors.text,
    lineHeight: 60,
    marginBottom: 6,
  },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginBottom: 18 },
  track: {
    flexDirection: 'row',
    width: '100%',
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  seg: { height: '100%', overflow: 'hidden' },
  segFill: { height: '100%' },
  controls: { flexDirection: 'row', gap: 10 },
  btn: {
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  btnText: { fontFamily: fonts.semi, fontSize: 14, color: colors.text },
  btnPrimaryText: { color: colors.text },
  note: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginTop: 4,
  },
});

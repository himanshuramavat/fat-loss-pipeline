import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { buildPhases, type PhaseDef } from '../data/plan';
import { playBeep } from '../utils/beep';
import {
  cancelWalkPhaseNotifications,
  scheduleWalkPhaseNotifications,
} from '../notifications/schedule';

const KEEP_AWAKE_TAG = 'walk-timer';

function initialFromMinutes(mins: number) {
  const phases = buildPhases(mins);
  return {
    totalMinutes: mins,
    phases,
    phaseIndex: 0,
    secondsLeftInPhase: phases[0].secs,
    isRunning: false,
    isDone: false,
    phaseLabel: phases[0].name,
    phaseSub: phases[0].sub,
  };
}

function phaseEndTimestamps(
  phases: PhaseDef[],
  phaseIndex: number,
  secondsLeftInPhase: number,
): { at: Date; title: string; body: string }[] {
  const out: { at: Date; title: string; body: string }[] = [];
  let cursor = Date.now() + secondsLeftInPhase * 1000;

  for (let i = phaseIndex; i < phases.length; i++) {
    const isLast = i === phases.length - 1;
    const next = phases[i + 1];
    out.push({
      at: new Date(cursor),
      title: isLast ? 'Walk complete' : 'Phase change',
      body: isLast
        ? 'Walk complete — nice work'
        : `Next: ${next.name} — ${next.sub}`,
    });
    if (!isLast) {
      cursor += next.secs * 1000;
    }
  }
  return out;
}

function buttonLabel(isRunning: boolean, isDone: boolean, wasStarted: boolean): string {
  if (isRunning) return 'pause';
  if (isDone) return 'start';
  if (wasStarted) return 'resume';
  return 'start';
}

export function useWalkTimer() {
  const [state, setState] = useState(() => initialFromMinutes(30));
  const [wasStarted, setWasStarted] = useState(false);
  const phaseEndsAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const syncFromWallClock = useCallback(() => {
    if (!runningRef.current || phaseEndsAtRef.current == null) return;

    setState((prev) => {
      if (!prev.isRunning || phaseEndsAtRef.current == null) return prev;

      let endsAt = phaseEndsAtRef.current;
      let phaseIndex = prev.phaseIndex;
      const phases = prev.phases;
      const now = Date.now();

      while (now >= endsAt && phaseIndex < phases.length) {
        if (phaseIndex < phases.length - 1) {
          phaseIndex += 1;
          endsAt += phases[phaseIndex].secs * 1000;
          playBeep('phase');
        } else {
          phaseEndsAtRef.current = null;
          runningRef.current = false;
          playBeep('done');
          cancelWalkPhaseNotifications();
          deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
          clearTick();
          setWasStarted(false);
          return {
            ...prev,
            phaseIndex,
            secondsLeftInPhase: 0,
            isRunning: false,
            isDone: true,
            phaseLabel: 'done',
            phaseSub: 'walk complete — nice work',
          };
        }
      }

      phaseEndsAtRef.current = endsAt;
      const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
      const phase = phases[phaseIndex];
      return {
        ...prev,
        phaseIndex,
        secondsLeftInPhase: secondsLeft,
        phaseLabel: phase.name,
        phaseSub: phase.sub,
      };
    });
  }, [clearTick]);

  const startTick = useCallback(() => {
    clearTick();
    intervalRef.current = setInterval(() => {
      syncFromWallClock();
    }, 250);
  }, [clearTick, syncFromWallClock]);

  const setDuration = useCallback(
    async (mins: number) => {
      clearTick();
      runningRef.current = false;
      phaseEndsAtRef.current = null;
      setWasStarted(false);
      await cancelWalkPhaseNotifications();
      await deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
      setState(initialFromMinutes(mins));
    },
    [clearTick],
  );

  const reset = useCallback(async () => {
    clearTick();
    runningRef.current = false;
    phaseEndsAtRef.current = null;
    setWasStarted(false);
    await cancelWalkPhaseNotifications();
    await deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
    setState((prev) => initialFromMinutes(prev.totalMinutes));
  }, [clearTick]);

  const pause = useCallback(async () => {
    syncFromWallClock();
    clearTick();
    runningRef.current = false;
    phaseEndsAtRef.current = null;
    await cancelWalkPhaseNotifications();
    await deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
    setState((prev) => ({ ...prev, isRunning: false }));
  }, [clearTick, syncFromWallClock]);

  const start = useCallback(async () => {
    let snapshot = state;
    if (
      snapshot.isDone ||
      (snapshot.secondsLeftInPhase === 0 &&
        snapshot.phaseIndex === snapshot.phases.length - 1)
    ) {
      snapshot = initialFromMinutes(snapshot.totalMinutes);
      setWasStarted(false);
    }

    const endsAt = Date.now() + snapshot.secondsLeftInPhase * 1000;
    phaseEndsAtRef.current = endsAt;
    runningRef.current = true;
    setWasStarted(true);

    await scheduleWalkPhaseNotifications(
      phaseEndTimestamps(snapshot.phases, snapshot.phaseIndex, snapshot.secondsLeftInPhase),
    );
    await activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);

    setState({
      ...snapshot,
      isRunning: true,
      isDone: false,
      phaseLabel: snapshot.phases[snapshot.phaseIndex].name,
      phaseSub: snapshot.phases[snapshot.phaseIndex].sub,
    });
    startTick();
  }, [startTick, state]);

  const toggleStartPause = useCallback(async () => {
    if (runningRef.current || state.isRunning) {
      await pause();
    } else {
      await start();
    }
  }, [pause, start, state.isRunning]);

  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === 'active') syncFromWallClock();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      sub.remove();
      clearTick();
      cancelWalkPhaseNotifications();
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
    };
  }, [clearTick, syncFromWallClock]);

  return {
    ...state,
    setDuration,
    reset,
    toggleStartPause,
    startLabel: buttonLabel(state.isRunning, state.isDone, wasStarted && !state.isDone),
  };
}

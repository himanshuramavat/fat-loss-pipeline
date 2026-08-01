import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { ALL_DAYS, computeHeaderStats, type ProgressState } from '../data/plan';
import { clearProgress, loadProgress, saveProgress } from '../storage/progress';

type ProgressContextValue = {
  state: ProgressState;
  ready: boolean;
  toggleTask: (dayId: number, taskIndex: number) => void;
  resetAll: () => void;
  header: ReturnType<typeof computeHeaderStats>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadProgress().then((s) => {
      setState(s);
      setReady(true);
    });
  }, []);

  const toggleTask = useCallback((dayId: number, taskIndex: number) => {
    setState((prev) => {
      const key = String(dayId);
      const idx = String(taskIndex);
      const day = { ...(prev[key] || {}) };
      day[idx] = !day[idx];
      if (!day[idx]) delete day[idx];
      const next = { ...prev, [key]: day };
      if (Object.keys(day).length === 0) delete next[key];
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    Alert.alert(
      'Reset progress?',
      'Reset all 28 days of progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearProgress();
            setState({});
          },
        },
      ],
    );
  }, []);

  const header = useMemo(() => computeHeaderStats(state), [state]);

  const value = useMemo(
    () => ({ state, ready, toggleTask, resetAll, header }),
    [state, ready, toggleTask, resetAll, header],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export { ALL_DAYS };

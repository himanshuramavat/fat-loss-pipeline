export type DayType = 'circuit' | 'walk' | 'rest';

export type DayPlan = {
  id: number;
  week: number;
  type: DayType;
  tasks: string[];
};

/** Progress shape matches web localStorage: dayId -> taskIndex -> checked */
export type ProgressState = Record<string, Record<string, boolean>>;

export const week12Pattern: DayType[] = [
  'circuit',
  'walk',
  'circuit',
  'walk',
  'circuit',
  'walk',
  'rest',
];

export const week34Pattern: DayType[] = [
  'circuit',
  'circuit',
  'walk',
  'circuit',
  'circuit',
  'walk',
  'rest',
];

export function tasksFor(type: DayType, week: number): string[] {
  if (type === 'rest') {
    return [
      'Full rest — no walk, no circuit',
      '3+ litres water',
      'Protein in every meal',
    ];
  }
  const walkMin = week <= 2 ? '30 min' : '40 min';
  const rounds = week <= 2 ? '3 rounds' : '4 rounds';
  const t = [`Walk ${walkMin}`];
  if (type === 'circuit') {
    t.push(`Bodyweight circuit — ${rounds}`);
  }
  t.push('3+ litres water', 'Protein in every meal', 'No sugar tea / fried snacks');
  return t;
}

export function buildDays(): DayPlan[] {
  const days: DayPlan[] = [];
  for (let d = 1; d <= 28; d++) {
    const week = Math.ceil(d / 7);
    const pattern = week <= 2 ? week12Pattern : week34Pattern;
    const type = pattern[(d - 1) % 7];
    days.push({ id: d, week, type, tasks: tasksFor(type, week) });
  }
  return days;
}

export const ALL_DAYS = buildDays();

export function isDayComplete(day: DayPlan, state: ProgressState): boolean {
  const dayState = state[String(day.id)] || {};
  if (day.tasks.length === 0) return false;
  return day.tasks.every((_, i) => dayState[String(i)]);
}

export function computeHeaderStats(state: ProgressState) {
  let completedDays = 0;
  let streak = 0;
  let streakBroken = false;

  ALL_DAYS.forEach((day) => {
    const dayState = state[String(day.id)] || {};
    const doneCount = day.tasks.filter((_, i) => dayState[String(i)]).length;
    const isDone = doneCount === day.tasks.length && doneCount > 0;
    if (isDone) completedDays++;
    if (isDone && !streakBroken) {
      streak++;
    } else if (!isDone && Object.keys(dayState).length === 0) {
      // untouched day — do not break streak from the start
    } else if (!isDone) {
      streakBroken = true;
    }
  });

  const pct = Math.round((completedDays / 28) * 100);
  let status: 'not started' | 'passing' | 'shipped' = 'passing';
  if (completedDays === 0) status = 'not started';
  else if (completedDays === 28) status = 'shipped';

  return {
    completedDays,
    streak,
    pct,
    status,
    buildNumber: completedDays + 1,
  };
}

export type PhaseDef = {
  name: string;
  sub: string;
  secs: number;
  cls: 'warmup' | 'brisk' | 'cooldown';
};

export function buildPhases(mins: number): PhaseDef[] {
  const warmup = 5;
  const cooldown = mins >= 40 ? 4 : 3;
  const brisk = mins - warmup - cooldown;
  return [
    { name: 'warm-up', sub: 'easy pace · settle in', secs: warmup * 60, cls: 'warmup' },
    {
      name: 'brisk pace',
      sub: 'talk-test breathless, keep it steady',
      secs: brisk * 60,
      cls: 'brisk',
    },
    {
      name: 'cool-down',
      sub: 'slow it down, let heart rate settle',
      secs: cooldown * 60,
      cls: 'cooldown',
    },
  ];
}

export function formatClock(secs: number): string {
  const safe = Math.max(0, Math.floor(secs));
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(safe % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

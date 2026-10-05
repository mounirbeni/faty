// ─── Cycle tracker helpers (stored only in her browser) ───────────────────────

export interface CycleData {
  starts: string[];               // ISO dates (YYYY-MM-DD) her period started, sorted
  pain: Record<string, number>;   // ISO date → pain level 0..4
}

export type CyclePhase = 'period' | 'follicular' | 'ovulation' | 'luteal' | 'late';

const KEY = 'haven_cycle';
const DAY = 86_400_000;
const PERIOD_DAYS = 5;

export function loadCycle(): CycleData {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && Array.isArray(d.starts)) return { starts: d.starts, pain: d.pain ?? {} };
  } catch { /* ignore */ }
  return { starts: [], pain: {} };
}

export function saveCycle(d: CycleData) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* ignore */ }
  syncCycle(d);
}

/** Send her period dates to the server so phone reminders can be scheduled. */
export function syncCycle(d: CycleData) {
  if (typeof fetch === 'undefined' || d.starts.length === 0) return;
  fetch('/api/push/cycle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ starts: d.starts }),
  }).catch(() => { /* offline — next save will retry */ });
}

export function fmtDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parse(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function cycleInfo(data: CycleData) {
  if (data.starts.length === 0) return null;

  // Average of recent gaps that look like real cycles (18–45 days), default 28
  const gaps: number[] = [];
  for (let i = 1; i < data.starts.length; i++) {
    const g = Math.round((parse(data.starts[i]).getTime() - parse(data.starts[i - 1]).getTime()) / DAY);
    if (g >= 18 && g <= 45) gaps.push(g);
  }
  const recent = gaps.slice(-6);
  const avgLength = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) : 28;

  const last = parse(data.starts[data.starts.length - 1]);
  const today = parse(fmtDate(new Date()));
  const day = Math.round((today.getTime() - last.getTime()) / DAY) + 1;
  const nextStart = new Date(last.getTime() + avgLength * DAY);
  const daysUntilNext = Math.round((nextStart.getTime() - today.getTime()) / DAY);

  const ovulationDay = avgLength - 14;
  let phase: CyclePhase;
  if (day <= PERIOD_DAYS) phase = 'period';
  else if (day > avgLength) phase = 'late';
  else if (Math.abs(day - ovulationDay) <= 1) phase = 'ovulation';
  else if (day < ovulationDay) phase = 'follicular';
  else phase = 'luteal';

  return { day, avgLength, nextStart, daysUntilNext, phase };
}

export const PHASE_INFO: Record<CyclePhase, { name: string; emoji: string; tip: string }> = {
  period: {
    name: 'Period days', emoji: '🌸',
    tip: 'Your body is working hard. Heat on your tummy, warm drinks, iron-rich food (lentils, dates, spinach) and lots of rest. Nothing is required of you right now.',
  },
  follicular: {
    name: 'Fresh energy', emoji: '🌱',
    tip: 'Energy usually comes back now — a good time for plans, walks and new things. Enjoy feeling lighter, my love.',
  },
  ovulation: {
    name: 'Glow days', emoji: '✨',
    tip: 'Many people feel their most confident and social around now. You’re glowing (you always are, but especially now).',
  },
  luteal: {
    name: 'Slow-down days', emoji: '🌙',
    tip: 'Mood swings, cravings, bloating or feeling extra sensitive are normal in this phase. Sleep more, eat warm food, and be gentle with yourself.',
  },
  late: {
    name: 'Any day now', emoji: '⏳',
    tip: 'Your period is a little later than predicted — stress, travel and sleep can shift it. Keep a hot-water bottle and snacks close.',
  },
};

export const PAIN_LEVELS: { emoji: string; label: string }[] = [
  { emoji: '😌', label: 'None' },
  { emoji: '🙂', label: 'Light' },
  { emoji: '😕', label: 'Medium' },
  { emoji: '😣', label: 'Strong' },
  { emoji: '😭', label: 'Very bad' },
];

// ─── Calculator: predicted periods / ovulation / fertile window ──────────────

export interface CalcInput { lastStart: string; cycleLen: number; periodLen: number }
export type DayKind = 'period' | 'fertile' | 'ovulation' | null;


export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** The next `count` predicted cycles starting from the last period. */
export function predictCycles({ lastStart, cycleLen, periodLen }: CalcInput, count = 3) {
  const first = parse(lastStart);
  const today = parse(fmtDate(new Date()));
  // Start from the period happening now, or the next upcoming one
  let k = Math.max(0, Math.floor((today.getTime() - first.getTime()) / DAY / cycleLen));
  if (addDays(first, k * cycleLen + periodLen - 1) < today) k++;
  const out: { start: Date; end: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date }[] = [];
  for (let i = 0; i < count; i++, k++) {
    const start = addDays(first, k * cycleLen);
    const ovulation = addDays(start, cycleLen - 14);
    out.push({
      start,
      end: addDays(start, periodLen - 1),
      ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
    });
  }
  return out;
}

/** Classify a calendar day relative to the predicted cycles (also covers earlier ones). */
export function dayKind(day: Date, { lastStart, cycleLen, periodLen }: CalcInput): DayKind {
  const first = parse(lastStart);
  const diff = Math.round((day.getTime() - first.getTime()) / DAY);
  if (diff < 0) return null;
  const pos = diff % cycleLen;              // 0-based day inside its cycle
  const ov = cycleLen - 14;
  if (pos < periodLen) return 'period';
  if (pos === ov) return 'ovulation';
  if (pos >= ov - 5 && pos <= ov + 1) return 'fertile';
  return null;
}

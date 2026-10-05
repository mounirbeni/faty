'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Wind, Sparkles, Check, Map, Send, Feather, Cookie } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { useTimeContext } from '@/lib/timeSystem';
import { softTap, heartbeat, successVibe } from '@/lib/useHaptics';
import { EASE, SPRING } from '@/lib/motion';
import { HAVEN_LINES, FEELINGS, NEEDS, COMFORT_NOTES, SELF_CARE, LET_GO_REPLIES } from '@/data/haven';
import { loadCycle, saveCycle, cycleInfo, PHASE_INFO, PAIN_LEVELS, fmtDate, type CycleData } from '@/lib/cycle';

type View = 'hub' | 'breathe' | 'jar' | 'care' | 'letgo' | 'vent' | 'cycle';

// ── Haven palette: warm dusk — plum, rose, peach, cream ──
const C = {
  bg: 'linear-gradient(165deg, #2A1530 0%, #3B1A35 38%, #5A2440 72%, #6E3A47 100%)',
  card: 'rgba(255, 236, 228, 0.07)',
  cardBorder: 'rgba(255, 214, 196, 0.16)',
  peach: '#FFC9A8',
  rose: '#FF9DB4',
  lavender: '#CDB4FF',
  cream: '#FFF3EA',
  muted: 'rgba(255, 238, 228, 0.6)',
  faint: 'rgba(255, 238, 228, 0.38)',
};

const TITLES: Record<View, [string, string]> = {
  hub:     ['', ''],
  breathe: ['Breathe with me 🌬️', 'Follow the circle. I’m right here.'],
  jar:     ['Comfort jar 🫙', 'Tap the jar whenever you need me'],
  care:    ['Take care of you 🫖', 'Little things, one at a time'],
  letgo:   ['Let it go 🎈', 'Write it, then pop it away'],
  vent:    ['Say anything ✍️', 'No filter. No judgement. Ever.'],
  cycle:   ['My cycle 🌙', 'Know what’s coming — and so will I'],
};

function todayKey() {
  const d = new Date();
  return `haven_care_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function loadList(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function saveList(key: string, ids: string[]) {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* ignore */ }
}

export default function HavenScreen() {
  const [view, setView] = useState<View>('hub');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: C.bg }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HavenGlow />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        {view !== 'hub' && (
          <div className="flex items-center gap-3 px-4 pb-4 shrink-0"
            style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}>
            <button onClick={() => { softTap(); setView('hub'); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
              <ArrowLeft size={16} style={{ color: C.cream }} />
            </button>
            <div>
              <h1 className="text-[18px] font-black" style={{ color: C.cream }}>{TITLES[view][0]}</h1>
              <p className="text-[11px]" style={{ color: C.faint }}>{TITLES[view][1]}</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'hub'     && <Hub key="hub" onPick={setView} toast={showToast} />}
          {view === 'breathe' && <Breathe key="breathe" />}
          {view === 'jar'     && <Jar key="jar" />}
          {view === 'care'    && <Care key="care" toast={showToast} />}
          {view === 'letgo'   && <LetGo key="letgo" />}
          {view === 'vent'    && <Vent key="vent" toast={showToast} />}
          {view === 'cycle'   && <Cycle key="cycle" toast={showToast} />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="absolute left-1/2 z-30 px-5 py-3 rounded-2xl text-[13px] font-semibold text-center max-w-[86vw]"
            style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))', x: '-50%', background: C.cream, color: '#4A1D3A', boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={SPRING.gentle}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Ambient warm glow + slow floating petals ────────────────────────────────

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 6 + ((i * 13) % 10),
  dur: 16 + ((i * 7) % 14),
  delay: -((i * 5) % 20),
  hue: i % 3,
}));

function HavenGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute rounded-full" style={{ top: '-18%', left: '-20%', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(255,170,140,0.28) 0%, transparent 65%)', filter: 'blur(40px)', animation: 'breathe-glow 9s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ bottom: '-20%', right: '-25%', width: '90vw', height: '90vw', background: 'radial-gradient(circle, rgba(205,180,255,0.22) 0%, transparent 65%)', filter: 'blur(50px)', animation: 'breathe-glow 12s ease-in-out infinite' }} />
      {PETALS.map((p, i) => (
        <span key={i} className="absolute rounded-full" style={{
          left: `${p.left}%`, bottom: '-5%', width: p.size, height: p.size,
          background: [C.peach, C.rose, C.lavender][p.hue], opacity: 0.35, filter: 'blur(1px)',
          animation: `float-up ${p.dur}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Small building blocks ───────────────────────────────────────────────────

function Card({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={`rounded-[22px] p-4 ${className}`}
      style={{ background: C.card, border: `1px solid ${C.cardBorder}`, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: EASE.smooth } }}>
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: C.peach }}>{children}</p>;
}

const viewMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.smooth } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

// ─── Hub ─────────────────────────────────────────────────────────────────────

function Hub({ onPick, toast }: { onPick: (v: View) => void; toast: (m: string) => void }) {
  const setPhase = useGameStore(s => s.setPhase);
  const time = useTimeContext();
  const [lineIdx, setLineIdx] = useState(0);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [sentNeeds, setSentNeeds] = useState<string[]>([]);

  useEffect(() => {
    const t = setInterval(() => setLineIdx(i => (i + 1) % HAVEN_LINES.length), 8000);
    return () => clearInterval(t);
  }, []);

  const pickFeeling = (id: string) => {
    heartbeat();
    setFeeling(id);
    const f = FEELINGS.find(x => x.id === id)!;
    notifyOwner(`🌸 <b>Haven check-in</b>\n\nShe’s feeling: ${f.emoji} <b>${f.label}</b>\n\n<i>Be extra gentle with her today.</i>`);
  };

  const sendNeed = (id: string) => {
    if (sentNeeds.includes(id)) return;
    successVibe();
    const n = NEEDS.find(x => x.id === id)!;
    notifyOwner(`🚨💗 <b>She needs you</b>\n\n${n.telegram}`);
    setSentNeeds(s => [...s, id]);
    toast(`Sent to him ${n.emoji} — he’s on his way to you`);
  };

  const current = FEELINGS.find(f => f.id === feeling);
  const [cycle] = useState<CycleData>(loadCycle);
  const info = cycleInfo(cycle);

  // Heads-up to him once per cycle when her period is ≤ 2 days away
  useEffect(() => {
    if (!info || info.daysUntilNext > 2 || info.daysUntilNext < 0) return;
    const flag = `haven_heads_up_${fmtDate(info.nextStart)}`;
    try {
      if (localStorage.getItem(flag)) return;
      localStorage.setItem(flag, '1');
    } catch { return; }
    notifyOwner(`🌙 <b>Heads-up</b>\n\nHer period is expected ${info.daysUntilNext === 0 ? '<b>today</b>' : `in <b>${info.daysUntilNext} day${info.daysUntilNext === 1 ? '' : 's'}</b>`} (${fmtDate(info.nextStart)}).\n\n<i>Be extra sweet, extra patient — maybe send chocolate 🍫</i>`);
  }, [info]);

  const tiles: { id: View; icon: React.ReactNode; label: string; sub: string; grad: string }[] = [
    { id: 'breathe', icon: <Wind size={22} />,     label: 'Breathe with me', sub: 'For cramps & heavy moments', grad: 'linear-gradient(135deg, #8E7CC3, #C3A6E8)' },
    { id: 'jar',     icon: <Heart size={22} />,    label: 'Comfort jar',     sub: 'A note from me, any time',   grad: 'linear-gradient(135deg, #E8789A, #FFB0A8)' },
    { id: 'care',    icon: <Cookie size={22} />,   label: 'Take care of you', sub: 'Your soft checklist',       grad: 'linear-gradient(135deg, #E59A6B, #FFCB8E)' },
    { id: 'letgo',   icon: <Sparkles size={22} />, label: 'Let it go',       sub: 'Pop your worries away',      grad: 'linear-gradient(135deg, #6FA8C8, #A9D3E3)' },
  ];

  return (
    <motion.div {...viewMotion} className="flex flex-col gap-4 px-4"
      style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF9DB4, #FFC9A8)', boxShadow: '0 6px 22px rgba(255,157,180,0.4)' }}>
            <Feather size={16} className="text-white" />
          </div>
          <span className="text-[13px] font-black uppercase tracking-[0.18em]" style={{ color: C.muted }}>Your Haven</span>
        </div>
        <button onClick={() => { softTap(); setPhase('map'); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
          style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.muted }}>
          <Map size={13} /> Our world
        </button>
      </div>

      {/* Hero */}
      <Card>
        <h1 className="text-[24px] font-black leading-tight" style={{ color: C.cream }}>
          {time.greeting} <span className="inline-block animate-heartbeat">🤍</span>
        </h1>
        <p className="text-[13px] mt-1" style={{ color: C.muted }}>This place is soft, slow and only yours. Nothing to answer, nothing to do.</p>
        <div className="mt-4 min-h-[44px]">
          <AnimatePresence mode="wait">
            <motion.p key={lineIdx} className="text-[14px] italic leading-relaxed" style={{ color: C.peach }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.6 }}>
              “{HAVEN_LINES[lineIdx]}”
            </motion.p>
          </AnimatePresence>
        </div>
      </Card>

      {/* Feelings */}
      <Card delay={0.08}>
        <Label>How are you feeling right now?</Label>
        <div className="flex flex-wrap gap-2">
          {FEELINGS.map(f => {
            const on = feeling === f.id;
            return (
              <motion.button key={f.id} onClick={() => pickFeeling(f.id)} whileTap={{ scale: 0.94 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold"
                style={{
                  background: on ? C.cream : 'rgba(255,255,255,0.06)',
                  color: on ? '#4A1D3A' : C.cream,
                  border: `1px solid ${on ? C.cream : C.cardBorder}`,
                }}>
                <span>{f.emoji}</span>{f.label}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={current.id} className="mt-4 rounded-2xl p-3.5"
              style={{ background: 'rgba(255,201,168,0.1)', border: '1px solid rgba(255,201,168,0.22)' }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <p className="text-[13px] leading-relaxed" style={{ color: C.cream }}>{current.reply}</p>
              <p className="text-[11px] mt-2 text-right" style={{ color: C.faint }}>— him, who loves you 💗</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* I need you */}
      <Card delay={0.14}>
        <Label>I need you to… (I’ll get it instantly)</Label>
        <div className="grid grid-cols-2 gap-2">
          {NEEDS.map(n => {
            const sent = sentNeeds.includes(n.id);
            return (
              <motion.button key={n.id} onClick={() => sendNeed(n.id)} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left text-[12.5px] font-semibold"
                style={{
                  background: sent ? 'rgba(255,157,180,0.22)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${sent ? 'rgba(255,157,180,0.5)' : C.cardBorder}`,
                  color: C.cream,
                }}>
                <span className="text-[18px]">{sent ? '✓' : n.emoji}</span>
                <span className="leading-tight">{sent ? 'Sent — coming' : n.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Cycle */}
      <motion.button onClick={() => { softTap(); onPick('cycle'); }}
        className="w-full flex items-center gap-3.5 p-4 rounded-[22px] text-left"
        style={{ background: 'linear-gradient(135deg, rgba(255,157,180,0.22), rgba(205,180,255,0.18))', border: '1px solid rgba(255,157,180,0.35)', color: C.cream }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.6, ease: EASE.smooth } }}
        whileTap={{ scale: 0.98 }}>
        <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>🌙</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-black">My cycle</span>
          <span className="block text-[12px] mt-0.5" style={{ color: C.muted }}>
            {info
              ? `Day ${info.day} · ${PHASE_INFO[info.phase].name} · next ≈ ${info.daysUntilNext <= 0 ? 'any day now' : `in ${info.daysUntilNext} days`}`
              : 'Track it in one tap — I’ll know when to be extra gentle'}
          </span>
        </span>
        <span className="text-[20px]">›</span>
      </motion.button>

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <motion.button key={t.id} onClick={() => { softTap(); onPick(t.id); }}
            className="flex flex-col gap-2 p-4 rounded-[22px] text-left min-h-[124px] text-white"
            style={{ background: t.grad, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.06, duration: 0.5, ease: EASE.smooth } }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
            {t.icon}
            <div className="mt-auto">
              <div className="text-[15px] font-black leading-tight">{t.label}</div>
              <div className="text-[11px] text-white/80 mt-0.5">{t.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button onClick={() => { softTap(); onPick('vent'); }}
        className="w-full flex items-center justify-between p-4 rounded-[22px]"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.cream }}
        whileTap={{ scale: 0.98 }}>
        <span className="text-left">
          <span className="block text-[15px] font-black">Say anything ✍️</span>
          <span className="block text-[11px]" style={{ color: C.faint }}>Vent, rant, cry in words — keep it or send it to me</span>
        </span>
        <span className="text-[20px]">›</span>
      </motion.button>

      <p className="text-center text-[11px] mt-2" style={{ color: C.faint }}>Made with all my love, for your soft days 🌸</p>
    </motion.div>
  );
}

// ─── Breathe ─────────────────────────────────────────────────────────────────

const BREATH = [
  { label: 'Breathe in…',  sec: 4, scale: 1.45 },
  { label: 'Hold softly…', sec: 4, scale: 1.45 },
  { label: 'Let it out…',  sec: 6, scale: 0.85 },
];

function Breathe() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      setStep(s => {
        if (s === BREATH.length - 1) { setRounds(r => r + 1); return 0; }
        return s + 1;
      });
    }, BREATH[step].sec * 1000);
    return () => clearTimeout(t);
  }, [running, step]);

  const cur = BREATH[step];
  return (
    <motion.div {...viewMotion} className="flex flex-col items-center px-4 pb-10 gap-8">
      <div className="relative w-[260px] h-[260px] flex items-center justify-center mt-6">
        <motion.div className="absolute rounded-full"
          style={{ width: 150, height: 150, background: 'radial-gradient(circle, rgba(255,201,168,0.55), rgba(205,180,255,0.25) 70%, transparent)', boxShadow: '0 0 80px rgba(255,170,160,0.35)' }}
          animate={{ scale: running ? cur.scale : 1 }}
          transition={{ duration: running ? cur.sec : 0.6, ease: 'easeInOut' }} />
        <p className="relative text-[18px] font-bold text-center" style={{ color: C.cream }}>
          {running ? cur.label : 'Ready when you are'}
        </p>
      </div>
      <p className="text-[13px] text-center max-w-[300px]" style={{ color: C.muted }}>
        Put one hand on your tummy. Breathe slowly with the circle — it helps the cramps loosen. I’m breathing with you. 🤍
      </p>
      <button onClick={() => { softTap(); setRunning(r => !r); setStep(0); }}
        className="px-8 py-3.5 rounded-full text-[14px] font-black"
        style={{ background: C.cream, color: '#4A1D3A' }}>
        {running ? 'Pause' : 'Start breathing'}
      </button>
      {rounds > 0 && <p className="text-[12px]" style={{ color: C.peach }}>{rounds} calm {rounds === 1 ? 'breath' : 'breaths'} together 💗</p>}
    </motion.div>
  );
}

// ─── Comfort jar ─────────────────────────────────────────────────────────────

function Jar() {
  const [idx, setIdx] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const pull = () => {
    heartbeat();
    setIdx(prev => {
      let n = Math.floor(Math.random() * COMFORT_NOTES.length);
      if (n === prev) n = (n + 1) % COMFORT_NOTES.length;
      return n;
    });
    setCount(c => c + 1);
  };

  return (
    <motion.div {...viewMotion} className="flex flex-col items-center px-4 pb-10 gap-6">
      <motion.button onClick={pull} whileTap={{ scale: 0.9, rotate: -4 }} animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        className="text-[110px] leading-none mt-4" aria-label="Pull a note">
        🫙
      </motion.button>
      <p className="text-[12px]" style={{ color: C.faint }}>{count === 0 ? 'Tap the jar' : 'Tap again for another one'}</p>
      <div className="w-full min-h-[150px]">
        <AnimatePresence mode="wait">
          {idx !== null && (
            <motion.div key={`${idx}-${count}`} className="rounded-[22px] p-5"
              style={{ background: C.cream, boxShadow: '0 14px 40px rgba(0,0,0,0.3)', rotate: count % 2 ? 1.5 : -1.5 }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={SPRING.gentle}>
              <p className="text-[15px] leading-relaxed font-medium" style={{ color: '#4A1D3A' }}>{COMFORT_NOTES[idx]}</p>
              <p className="text-[11px] mt-3 text-right" style={{ color: '#9A5A72' }}>— me 💌</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Self-care checklist (resets every day) ──────────────────────────────────

function Care({ toast }: { toast: (m: string) => void }) {
  const [key] = useState(todayKey);
  const [done, setDone] = useState<string[]>(() => loadList(key));

  const toggle = (id: string) => {
    softTap();
    const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    setDone(next);
    saveList(key, next);
    if (next.length === SELF_CARE.length && !done.includes(id)) {
      successVibe();
      toast('All done! I’m so proud of you 🥹💗');
      notifyOwner('🫖 <b>She finished her whole self-care list today</b> 💗');
    }
  };

  const pct = done.length / SELF_CARE.length;
  return (
    <motion.div {...viewMotion} className="flex flex-col px-4 pb-10 gap-3">
      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #FFC9A8, #FF9DB4)' }}
          animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.6, ease: EASE.smooth }} />
      </div>
      {SELF_CARE.map(item => {
        const on = done.includes(item.id);
        return (
          <motion.button key={item.id} onClick={() => toggle(item.id)} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl text-left"
            style={{ background: on ? 'rgba(255,201,168,0.14)' : C.card, border: `1px solid ${on ? 'rgba(255,201,168,0.4)' : C.cardBorder}` }}>
            <span className="text-[22px]">{item.emoji}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14px] font-bold" style={{ color: C.cream, textDecoration: on ? 'line-through' : 'none', opacity: on ? 0.7 : 1 }}>{item.label}</span>
              <span className="block text-[11px] mt-0.5" style={{ color: C.faint }}>{item.tip}</span>
            </span>
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: on ? C.peach : 'transparent', border: `1.5px solid ${on ? C.peach : C.cardBorder}` }}>
              {on && <Check size={14} style={{ color: '#4A1D3A' }} />}
            </span>
          </motion.button>
        );
      })}
      <p className="text-[11px] text-center mt-2" style={{ color: C.faint }}>No pressure. Even one is enough today.</p>
    </motion.div>
  );
}

// ─── Let it go — worry bubbles ───────────────────────────────────────────────

type Worry = { id: number; text: string; x: number };
const WORRIES_KEY = 'haven_worries';

function esc(t: string) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function loadWorries(): Worry[] {
  try { const w = JSON.parse(localStorage.getItem(WORRIES_KEY) || '[]'); return Array.isArray(w) ? w : []; } catch { return []; }
}

function LetGo() {
  const [text, setText] = useState('');
  const [bubbles, setBubbles] = useState<Worry[]>(loadWorries);
  const [reply, setReply] = useState<string | null>(null);
  const [pops, setPops] = useState(0);

  // Keep her worries saved until she pops them, even after leaving the site
  const save = (next: Worry[]) => {
    setBubbles(next);
    try { localStorage.setItem(WORRIES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const add = () => {
    const t = text.trim();
    if (!t) return;
    softTap();
    save([...bubbles, { id: Date.now(), text: t, x: 10 + Math.random() * 55 }]);
    setText('');
    notifyOwner(`🎈 <b>Something is bothering her</b>\n\n<i>“${esc(t)}”</i>\n\n💗 <i>Check on her gently.</i>`);
  };
  const pop = (id: number) => {
    heartbeat();
    const w = bubbles.find(x => x.id === id);
    save(bubbles.filter(x => x.id !== id));
    setReply(LET_GO_REPLIES[pops % LET_GO_REPLIES.length]);
    setPops(n => n + 1);
    if (w) notifyOwner(`🫧 <b>She let go of:</b> <i>“${esc(w.text)}”</i>`);
  };

  return (
    <motion.div {...viewMotion} className="flex flex-col px-4 pb-10 gap-4">
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="What’s bothering you?" maxLength={60}
          className="flex-1 px-4 py-3 rounded-2xl text-[14px] outline-none select-text"
          style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.cream }} />
        <button onClick={add} className="px-4 rounded-2xl text-[13px] font-black" style={{ background: C.cream, color: '#4A1D3A' }}>Add</button>
      </div>
      <div className="relative h-[360px] rounded-[22px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px dashed ${C.cardBorder}` }}>
        {bubbles.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-center px-8 text-[13px]" style={{ color: C.faint }}>
            Write a worry, a pain, an annoying person… then tap its bubble to pop it.
          </p>
        )}
        <AnimatePresence>
          {bubbles.map((b, i) => (
            <motion.button key={b.id} onClick={() => pop(b.id)}
              className="absolute px-4 py-3 rounded-full text-[12px] font-semibold max-w-[70%]"
              style={{ left: `${b.x}%`, top: `${12 + (i % 5) * 16}%`, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(169,211,227,0.18))', border: '1px solid rgba(255,255,255,0.35)', color: C.cream, backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              exit={{ opacity: 0, scale: 1.8, transition: { duration: 0.35 } }}
              transition={{ y: { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }, default: SPRING.bouncy }}>
              {b.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {reply && (
          <motion.p key={pops} className="text-center text-[14px] font-semibold" style={{ color: C.peach }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {reply}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Vent box ────────────────────────────────────────────────────────────────

function Vent({ toast }: { toast: (m: string) => void }) {
  const [text, setText] = useState('');

  const keep = () => {
    if (!text.trim()) return;
    softTap();
    setText('');
    toast('Released. It’s out of you now 🤍');
  };
  const send = () => {
    const t = text.trim();
    if (!t) return;
    successVibe();
    notifyOwner(`✍️ <b>She wanted to tell you something</b>\n\n<i>${esc(t)}</i>`);
    setText('');
    toast('Sent to him 💌 — he’s reading it');
  };

  return (
    <motion.div {...viewMotion} className="flex flex-col px-4 pb-10 gap-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={10}
        placeholder="Write anything… angry, sad, silly, nothing makes sense? Perfect. Write it."
        className="w-full p-4 rounded-[22px] text-[15px] leading-relaxed outline-none resize-none select-text"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.cream }} />
      <div className="grid grid-cols-2 gap-3">
        <button onClick={keep} className="py-3.5 rounded-2xl text-[13px] font-bold"
          style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.cream }}>
          Just let it out 🌬️
        </button>
        <button onClick={send} className="py-3.5 rounded-2xl text-[13px] font-black flex items-center justify-center gap-1.5"
          style={{ background: C.cream, color: '#4A1D3A' }}>
          <Send size={14} /> Send to him
        </button>
      </div>
      <p className="text-[11px] text-center" style={{ color: C.faint }}>“Just let it out” deletes it forever — nobody sees it, not even me.</p>
    </motion.div>
  );
}

// ─── Cycle tracker ───────────────────────────────────────────────────────────

function Cycle({ toast }: { toast: (m: string) => void }) {
  const [data, setData] = useState<CycleData>(loadCycle);
  const [pickDate, setPickDate] = useState('');
  const info = cycleInfo(data);

  const update = (next: CycleData) => { setData(next); saveCycle(next); };

  const addStart = (iso: string) => {
    if (data.starts.includes(iso)) { toast('Already saved 🤍'); return; }
    successVibe();
    const starts = [...data.starts, iso].sort().slice(-12);
    update({ ...data, starts });
    const isToday = iso === fmtDate(new Date());
    notifyOwner(`🩸 <b>Her period ${isToday ? 'started today' : `started on ${iso}`}</b>\n\n<i>Time to be the softest version of you. Check on her 💗</i>`);
    toast('Saved — and he knows 💗');
  };

  const logPain = (lvl: number) => {
    heartbeat();
    const today = fmtDate(new Date());
    update({ ...data, pain: { ...data.pain, [today]: lvl } });
    const p = PAIN_LEVELS[lvl];
    notifyOwner(`🌡️ <b>Pain today:</b> ${p.emoji} ${p.label} (${lvl}/4)${lvl >= 3 ? '\n\n<i>She’s hurting a lot — call her 📞</i>' : ''}`);
    toast(lvl >= 3 ? 'I’m so sorry, my love. He’s been told 🤍' : 'Noted 🤍');
  };

  const removeLast = () => {
    softTap();
    update({ ...data, starts: data.starts.slice(0, -1) });
  };

  const todayPain = data.pain[fmtDate(new Date())];
  const phase = info ? PHASE_INFO[info.phase] : null;

  return (
    <motion.div {...viewMotion} className="flex flex-col px-4 pb-10 gap-4">
      {info && phase ? (
        <Card>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke={C.rose} strokeWidth="4" strokeLinecap="round"
                  pathLength="100" strokeDasharray={`${Math.min(100, (info.day / info.avgLength) * 100)} 100`} />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: C.cream }}>
                <span className="text-[9px] uppercase tracking-wider" style={{ color: C.faint }}>Day</span>
                <span className="text-[20px] font-black leading-none">{info.day}</span>
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-black" style={{ color: C.cream }}>{phase.emoji} {phase.name}</p>
              <p className="text-[12px] mt-0.5" style={{ color: C.muted }}>
                Next period ≈ <b style={{ color: C.peach }}>{fmtDate(info.nextStart)}</b>
                {' '}({info.daysUntilNext <= 0 ? 'any day now' : `in ${info.daysUntilNext} days`})
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: C.faint }}>Average cycle: {info.avgLength} days</p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed mt-4" style={{ color: C.cream }}>{phase.tip}</p>
        </Card>
      ) : (
        <Card>
          <p className="text-[14px] leading-relaxed" style={{ color: C.cream }}>
            Tell me when your period starts, and this page will predict the next one, explain how your body feels in each phase —
            and quietly let me know when to be extra gentle. 🤍
          </p>
        </Card>
      )}

      <button onClick={() => addStart(fmtDate(new Date()))}
        className="w-full py-4 rounded-2xl text-[15px] font-black" style={{ background: C.cream, color: '#4A1D3A' }}>
        🩸 My period started today
      </button>

      <Card>
        <Label>Started another day?</Label>
        <div className="flex gap-2">
          <input type="date" value={pickDate} max={fmtDate(new Date())} onChange={e => setPickDate(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl text-[14px] outline-none select-text"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.cardBorder}`, color: C.cream, colorScheme: 'dark' }} />
          <button onClick={() => { if (pickDate) { addStart(pickDate); setPickDate(''); } }}
            className="px-4 rounded-xl text-[13px] font-black" style={{ background: C.peach, color: '#4A1D3A' }}>Save</button>
        </div>
      </Card>

      <Card>
        <Label>How much does it hurt today?</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {PAIN_LEVELS.map((p, lvl) => {
            const on = todayPain === lvl;
            return (
              <motion.button key={lvl} onClick={() => logPain(lvl)} whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl"
                style={{ background: on ? C.cream : 'rgba(255,255,255,0.05)', border: `1px solid ${on ? C.cream : C.cardBorder}`, color: on ? '#4A1D3A' : C.cream }}>
                <span className="text-[20px]">{p.emoji}</span>
                <span className="text-[9.5px] font-bold leading-tight text-center">{p.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {data.starts.length > 0 && (
        <Card>
          <Label>Past periods</Label>
          <div className="flex flex-wrap gap-2">
            {[...data.starts].reverse().map(d => (
              <span key={d} className="px-3 py-1.5 rounded-full text-[12px]" style={{ background: 'rgba(255,255,255,0.06)', color: C.muted }}>{d}</span>
            ))}
          </div>
          <button onClick={removeLast} className="mt-3 text-[11px] underline" style={{ color: C.faint }}>Remove the latest date</button>
        </Card>
      )}

      <p className="text-[11px] text-center" style={{ color: C.faint }}>Predictions are estimates, not medical advice. Saved only on this phone.</p>
    </motion.div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Timer as TimerIcon, Pause, Play } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';
import { HEAT_META, HEAT_ORDER, type HeatLevel, type PlayMode } from '@/data/together';
import { useTogetherStore, type Seat } from '@/store/togetherStore';

/* Shared chrome for every Together game — one header, one scoreboard,
   one countdown, so all four games feel like the same night. */

// ─── Header ───────────────────────────────────────────────────────────────────

export function TogetherHeader({
  title, sub, onBack, right,
}: { title: string; sub: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0">
      <button onClick={onBack} aria-label="Back"
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
        <ArrowLeft size={16} className="text-white/70" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-[18px] font-black text-white leading-tight truncate">{title}</h1>
        <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub}</p>
      </div>
      {right}
    </div>
  );
}

// ─── Heat pill + picker ───────────────────────────────────────────────────────

export function HeatPill({ onClick }: { onClick?: () => void }) {
  const heat = useTogetherStore(s => s.heat);
  const meta = HEAT_META[heat];
  return (
    <button onClick={onClick} disabled={!onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shrink-0"
      style={{ background: meta.surface, border: `1px solid ${meta.color}55` }}>
      <span className="text-[12px]">{meta.emoji}</span>
      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: meta.color }}>
        {meta.name}
      </span>
    </button>
  );
}

export function HeatPicker() {
  const heat = useTogetherStore(s => s.heat);
  const setHeat = useTogetherStore(s => s.setHeat);
  return (
    <div className="grid grid-cols-2 gap-2">
      {HEAT_ORDER.map((lvl: HeatLevel) => {
        const meta = HEAT_META[lvl];
        const on = heat === lvl;
        return (
          <motion.button key={lvl} onClick={() => setHeat(lvl)} whileTap={{ scale: 0.95 }}
            className="rounded-2xl py-3 px-2 flex flex-col items-center gap-1"
            style={{
              background: on ? meta.surface : '#141414',
              border: on ? `1.5px solid ${meta.color}` : '1px solid rgba(255,255,255,0.07)',
              boxShadow: on ? `0 6px 26px ${meta.glow}` : 'none',
            }}>
            <span className="text-[18px]">{meta.emoji}</span>
            <span className="text-[12px] font-black" style={{ color: on ? meta.color : 'rgba(255,255,255,0.55)' }}>
              {meta.name}
            </span>
            <span className="text-[9px] leading-tight text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {meta.blurb}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Mode toggle (same room tonight, or a country apart) ──────────────────────

const MODES: { id: PlayMode; emoji: string; label: string; sub: string }[] = [
  { id: 'same-room', emoji: '🛏️', label: 'Same room', sub: 'One phone, passed between us' },
  { id: 'apart',     emoji: '📱', label: 'Apart tonight', sub: 'On a call — photos, voice, words' },
];

export function ModeToggle() {
  const mode = useTogetherStore(s => s.mode);
  const setMode = useTogetherStore(s => s.setMode);
  return (
    <div className="flex gap-2">
      {MODES.map(m => {
        const on = mode === m.id;
        return (
          <motion.button key={m.id} onClick={() => setMode(m.id)} whileTap={{ scale: 0.95 }}
            className="flex-1 rounded-2xl py-3 px-3 text-left"
            style={{
              background: on ? '#161624' : '#141414',
              border: on ? '1.5px solid #5856D6' : '1px solid rgba(255,255,255,0.07)',
              boxShadow: on ? '0 6px 26px rgba(88,86,214,0.28)' : 'none',
            }}>
            <div className="text-[15px]">{m.emoji}</div>
            <div className="text-[12px] font-black mt-0.5" style={{ color: on ? '#A5A3FF' : 'rgba(255,255,255,0.55)' }}>
              {m.label}
            </div>
            <div className="text-[9px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.sub}</div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Scoreboard ───────────────────────────────────────────────────────────────

export function Scoreboard({ accent = '#FF2060' }: { accent?: string }) {
  const { p1, p2, scores, turn, rounds } = useTogetherStore();
  return (
    <div className="flex items-stretch gap-2">
      <SeatScore name={p1} points={scores.p1} active={turn === 'p1'} accent={accent} />
      <div className="flex flex-col items-center justify-center px-1 shrink-0">
        <Trophy size={12} className="text-white/25" />
        <span className="text-[9px] font-bold text-white/30 tabular-nums mt-0.5">{rounds}</span>
      </div>
      <SeatScore name={p2} points={scores.p2} active={turn === 'p2'} accent={accent} />
    </div>
  );
}

function SeatScore({ name, points, active, accent }: { name: string; points: number; active: boolean; accent: string }) {
  return (
    <motion.div className="flex-1 rounded-2xl px-3 py-2.5 min-w-0"
      animate={{ scale: active ? 1 : 0.97 }} transition={SPRING.gentle}
      style={{
        background: active ? '#161616' : '#111111',
        border: active ? `1px solid ${accent}66` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: active ? `0 4px 22px ${accent}22` : 'none',
      }}>
      <div className="text-[10px] font-black uppercase tracking-wider truncate"
        style={{ color: active ? accent : 'rgba(255,255,255,0.35)' }}>
        {name}
      </div>
      <div className="text-[20px] font-black text-white tabular-nums leading-none mt-1">{points}</div>
    </motion.div>
  );
}

// ─── Turn banner ──────────────────────────────────────────────────────────────

export function TurnBanner({ seat, accent, line }: { seat: Seat; accent: string; line?: string }) {
  const name = useTogetherStore(s => (seat === 'p1' ? s.p1 : s.p2));
  return (
    <motion.div key={seat + (line ?? '')} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE.smooth }}
      className="flex items-center justify-center gap-2 py-2 rounded-2xl"
      style={{ background: `${accent}12`, border: `1px solid ${accent}33` }}>
      <Users size={12} style={{ color: accent }} />
      <span className="text-[12px] font-black text-white">{name}&rsquo;s turn</span>
      {line && <span className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.35)' }}>· {line}</span>}
    </motion.div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

/**
 * Circular countdown. Starts paused; the pair press play when they're ready.
 * Uses wall-clock time so a backgrounded phone doesn't cheat the clock.
 * Mount it under a key that changes with the card — it resets by remounting.
 */
export function Countdown({
  seconds, accent, onDone, autoStart = false,
}: { seconds: number; accent: string; onDone?: () => void; autoStart?: boolean }) {
  const [running, setRunning] = useState(autoStart);
  const [left, setLeft] = useState(seconds);
  const endRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + left * 1000;
    const tick = setInterval(() => {
      const remaining = Math.max(0, (endRef.current - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true;
        setRunning(false);
        onDone?.();
      }
    }, 100);
    return () => clearInterval(tick);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const percent = seconds > 0 ? (left / seconds) * 100 : 0;
  const display = Math.ceil(left);
  const finished = left <= 0;

  return (
    <button onClick={() => { if (!finished) setRunning(r => !r); else { setLeft(seconds); doneRef.current = false; setRunning(true); } }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
      style={{ background: '#141414', border: `1px solid ${finished ? accent : 'rgba(255,255,255,0.08)'}` }}>
      <div className="relative w-11 h-11 shrink-0">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="3.5" />
          <circle cx="22" cy="22" r="18" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${percent} 100`} pathLength="100" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white tabular-nums">
          {display}
        </span>
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-[12px] font-black text-white flex items-center gap-1.5">
          <TimerIcon size={12} style={{ color: accent }} />
          {finished ? 'Time\u2019s up' : running ? 'Running…' : left === seconds ? `${seconds}s on the clock` : 'Paused'}
        </div>
        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {finished ? 'Tap to run it again' : running ? 'Tap to pause' : 'Tap to start'}
        </div>
      </div>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
        {running ? <Pause size={13} style={{ color: accent }} /> : <Play size={13} style={{ color: accent }} />}
      </div>
    </button>
  );
}

// ─── Empty-deck note ──────────────────────────────────────────────────────────

export function DeckNote({ show, accent }: { show: boolean; accent: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-[10px] text-center italic" style={{ color: accent }}>
          Deck reshuffled — you two went through every card. 🔥
        </motion.p>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { questionsData } from '@/data/questions';
import { loveNotes } from '@/data/meta';

/* ────────────────────────────────────────────────────────────────────────────
   OUR CONSTELLATION
   Every answer she has ever given becomes a real star in our sky.
   Those stars draw a glowing heart — and it fills as our story grows.
   ──────────────────────────────────────────────────────────────────────────── */

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

const TOTAL = questionsData.length || 70;

// ── Heart parametric anchor points (the constellation skeleton) ──
const ANCHOR_COUNT = 26;
const ANCHORS = (() => {
  const raw = Array.from({ length: ANCHOR_COUNT }, (_, i) => {
    const t = (i / ANCHOR_COUNT) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x, y };
  });
  const xs = raw.map(p => p.x), ys = raw.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 0.14, span = 1 - pad * 2;
  return raw.map((p, i) => ({
    id: i,
    // normalize into 0..100 box, invert Y for screen space
    nx: (pad + ((p.x - minX) / (maxX - minX)) * span) * 100,
    ny: (pad + (1 - (p.y - minY) / (maxY - minY)) * span) * 100,
    twinkle: 2 + pr(i + 700) * 3,
    word: loveNotes[i % loveNotes.length],
  }));
})();

const HEART_PATH = 'M ' + ANCHORS.map(a => `${a.nx.toFixed(2)} ${a.ny.toFixed(2)}`).join(' L ') + ' Z';

// ── Ambient background starfield (depth layers for parallax) ──
const AMBIENT = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  x: pr(i + 10) * 100,
  y: pr(i + 210) * 100,
  size: 0.8 + pr(i + 410) * 2.4,
  delay: pr(i + 610) * 4,
  dur: 2.2 + pr(i + 810) * 3.5,
  depth: 0.4 + pr(i + 1010) * 1.6, // parallax strength
  gold: i % 7 === 0,
}));

export default function ConstellationScreen() {
  const answers = useGameStore(s => s.answers);
  const reversed = useGameStore(s => s.reversed);
  const setPhase = useGameStore(s => s.setPhase);

  const answered = useMemo(
    () => Object.values(answers).filter(v => v?.trim()).length + reversed.length,
    [answers, reversed]
  );
  const fraction = Math.min(1, answered / TOTAL);
  const litCount = Math.max(1, Math.round(fraction * ANCHOR_COUNT));
  const complete = answered >= TOTAL;

  const [mounted, setMounted] = useState(false);
  const [beat, setBeat] = useState(false);
  const [noteIdx, setNoteIdx] = useState<number | null>(null);
  const [shooting, setShooting] = useState<{ id: number; top: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef(0);

  // Parallax is written to CSS variables on the root so pointer/tilt motion
  // never triggers a React re-render of the ~90 animated star elements.
  const setParallax = useCallback((x: number, y: number) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--px', x.toFixed(3));
    el.style.setProperty('--py', y.toFixed(3));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // ── Periodic shooting star ──
  useEffect(() => {
    const fire = () => {
      shotRef.current += 1;
      setShooting({ id: shotRef.current, top: 8 + pr(shotRef.current + 5) * 45 });
      setTimeout(() => setShooting(null), 1600);
    };
    const t = setInterval(fire, 6500);
    const first = setTimeout(fire, 2200);
    return () => { clearInterval(t); clearTimeout(first); };
  }, []);

  // ── Parallax from pointer + device tilt ──
  const onPointer = useCallback((e: React.PointerEvent) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    setParallax((e.clientX - cx) / cx, (e.clientY - cy) / cy);
  }, [setParallax]);

  useEffect(() => {
    const onTilt = (e: DeviceOrientationEvent) => {
      const gx = (e.gamma ?? 0) / 45; // left/right
      const gy = (e.beta ?? 0) / 90;  // front/back
      setParallax(Math.max(-1, Math.min(1, gx)), Math.max(-1, Math.min(1, gy - 0.4)));
    };
    window.addEventListener('deviceorientation', onTilt);
    return () => window.removeEventListener('deviceorientation', onTilt);
  }, [setParallax]);

  const pulse = useCallback(() => {
    setBeat(true);
    setNoteIdx(i => (i === null ? 0 : (i + 1) % loveNotes.length));
    setTimeout(() => setBeat(false), 900);
    if (complete) {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.45 },
          colors: ['#FF2060', '#FF4D80', '#FFB300', '#7B79FF', '#ffffff'],
          scalar: 0.9,
          ticks: 220,
        });
      }).catch(() => {});
    }
  }, [complete]);

  return (
    <motion.div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden"
      onPointerMove={onPointer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6 }}
      style={{
        ['--px' as string]: 0, ['--py' as string]: 0,
        background:
          'radial-gradient(ellipse 130% 90% at 50% 18%, rgba(88,86,214,0.22) 0%, transparent 55%), radial-gradient(ellipse 100% 70% at 50% 95%, rgba(255,32,96,0.16) 0%, transparent 60%), #04020A',
      }}
    >
      {/* ── Deep nebula that intensifies with progress ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '40%', width: '120vw', height: '90vh',
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(ellipse, rgba(255,32,96,${0.05 + fraction * 0.14}) 0%, rgba(123,121,255,${0.04 + fraction * 0.08}) 38%, transparent 68%)`,
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Ambient starfield (parallax) ──
          Outer wrapper owns the parallax translate (CSS vars → no re-renders);
          inner motion element owns the twinkle, so the two transforms don't collide. */}
      {mounted && AMBIENT.map(s => (
        <div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            transform: `translate(calc(var(--px) * ${(s.depth * 16).toFixed(1)}px), calc(var(--py) * ${(s.depth * 16).toFixed(1)}px))`,
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform',
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: s.size, height: s.size,
              background: s.gold ? '#FFD36E' : '#fff',
              boxShadow: s.gold ? '0 0 6px rgba(255,211,110,0.8)' : '0 0 5px rgba(255,255,255,0.6)',
            }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      ))}

      {/* ── Shooting star ── */}
      <AnimatePresence>
        {shooting && (
          <motion.div
            key={shooting.id}
            className="absolute pointer-events-none"
            style={{ top: `${shooting.top}%`, left: '-12%', height: 2, width: 130, borderRadius: 999,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(255,77,141,0.6))',
              transformOrigin: 'left center', rotate: '18deg',
              boxShadow: '0 0 14px rgba(255,255,255,0.7)' }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: '120vw', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
        <button
          onClick={() => setPhase('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <ArrowLeft size={18} className="text-white/80" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <Sparkles size={12} style={{ color: '#FFD36E' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Our Sky</span>
        </div>
        <div className="w-10" />
      </div>

      {/* ── Title ── */}
      <motion.div
        className="absolute left-0 right-0 z-20 text-center px-6"
        style={{ top: 'max(4.5rem, calc(env(safe-area-inset-top, 0px) + 3.5rem))' }}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <h1 className="text-[26px] font-black tracking-tight"
          style={{
            backgroundImage: 'linear-gradient(135deg, #FFB3C7 0%, #FF7AA2 40%, #FFD36E 80%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
          Our Constellation
        </h1>
        <p className="text-[12px] mt-1 italic" style={{ color: 'rgba(255,230,242,0.55)' }}>
          {complete ? 'Our sky is whole — every star is yours' : 'Every answer you give becomes a star'}
        </p>
      </motion.div>

      {/* ── The constellation stage ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            transform: 'translate(calc(var(--px) * -10px), calc(var(--py) * -10px))',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform',
          }}
        >
        <motion.div
          className="relative"
          style={{ width: 'min(86vw, 420px)', aspectRatio: '1 / 1' }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: beat ? 1.05 : 1, opacity: 1 }}
          transition={{ scale: { duration: beat ? 0.3 : 0.9, ease: beat ? 'easeOut' : [0.16, 1, 0.3, 1] }, opacity: { duration: 1 } }}
        >
          {/* SVG constellation lines */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="heartline" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7AA2" />
                <stop offset="50%" stopColor="#FFD36E" />
                <stop offset="100%" stopColor="#7B79FF" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* faint full heart */}
            <path d={HEART_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeLinejoin="round" />
            {/* lit progress heart */}
            <motion.path
              d={HEART_PATH} fill="none" stroke="url(#heartline)"
              strokeWidth={complete ? 1.5 : 1} strokeLinecap="round" strokeLinejoin="round"
              filter="url(#glow)" pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: litCount / ANCHOR_COUNT,
                opacity: 1,
                strokeWidth: complete && beat ? [1.5, 2.4, 1.5] : complete ? 1.5 : 1,
              }}
              transition={{ pathLength: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }, strokeWidth: { duration: 0.6 } }}
            />
          </svg>

          {/* Anchor stars */}
          {ANCHORS.map((a, i) => {
            const lit = i < litCount;
            return (
              <motion.div
                key={a.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${a.nx}%`, top: `${a.ny}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.035, type: 'spring', stiffness: 200, damping: 14 }}
              >
                <motion.div
                  className="rounded-full"
                  style={{
                    width: lit ? 7 : 3.5, height: lit ? 7 : 3.5,
                    background: lit ? '#fff' : 'rgba(255,255,255,0.25)',
                    boxShadow: lit
                      ? `0 0 10px 2px rgba(255,122,162,0.9), 0 0 22px 4px rgba(255,211,110,0.5)`
                      : 'none',
                  }}
                  animate={lit ? { scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] } : {}}
                  transition={{ duration: a.twinkle, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            );
          })}

          {/* Central heart core — tap target */}
          <motion.button
            onClick={pulse}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
            style={{
              width: 78, height: 78,
              background: complete
                ? 'radial-gradient(circle, rgba(255,211,110,0.35), rgba(255,32,96,0.18))'
                : 'radial-gradient(circle, rgba(255,32,96,0.28), rgba(123,121,255,0.12))',
              backdropFilter: 'blur(2px)',
            }}
            whileTap={{ scale: 0.88 }}
            animate={{ scale: complete ? [1, 1.08, 1] : [1, 1.04, 1] }}
            transition={{ duration: complete ? 1.3 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart
              size={complete ? 46 : 40}
              fill={complete ? '#FFD36E' : '#FF4D80'}
              className={beat ? 'animate-heartbeat' : ''}
              style={{
                color: complete ? '#FFD36E' : '#FF4D80',
                filter: `drop-shadow(0 0 16px ${complete ? 'rgba(255,211,110,0.9)' : 'rgba(255,77,141,0.85)'})`,
              }}
            />
            {/* tap ripple */}
            <AnimatePresence>
              {beat && (
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: '1.5px solid rgba(255,122,162,0.7)' }}
                  initial={{ scale: 0.7, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
        </div>
      </div>

      {/* ── Revealed love word ── */}
      <AnimatePresence mode="wait">
        {noteIdx !== null && (
          <motion.div
            key={noteIdx}
            className="absolute left-0 right-0 z-20 flex justify-center px-8"
            style={{ bottom: 'max(8.5rem, calc(env(safe-area-inset-bottom, 0px) + 7.5rem))' }}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[14px] text-center font-medium italic max-w-[300px]"
              style={{ color: 'rgba(255,230,242,0.92)', textShadow: '0 2px 18px rgba(255,77,141,0.4)' }}>
              “{loveNotes[noteIdx]}”
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom progress dock ── */}
      <motion.div
        className="absolute left-0 right-0 z-20 flex flex-col items-center px-6"
        style={{ bottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))' }}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
      >
        <div className="w-full max-w-[330px] rounded-2xl px-4 py-3.5"
          style={{ background: 'rgba(20,16,30,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Star size={12} fill="#FFD36E" style={{ color: '#FFD36E' }} />
              <span className="text-[12px] font-bold text-white">
                {answered} <span className="text-white/40 font-medium">/ {TOTAL} stars lit</span>
              </span>
            </div>
            <span className="text-[12px] font-black"
              style={{ color: complete ? '#FFD36E' : '#FF7AA2' }}>
              {Math.round(fraction * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: 'linear-gradient(90deg, #FF2060, #FFD36E, #7B79FF)' }}
              initial={{ width: 0 }} animate={{ width: `${fraction * 100}%` }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 w-1/3 -skew-x-12"
                style={{ background: 'rgba(255,255,255,0.45)' }}
                animate={{ x: ['-150%', '450%'] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
          <p className="text-[10.5px] text-center mt-2.5 italic" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {complete
              ? 'Tap the heart — our whole sky is yours ✦'
              : answered === 0
                ? 'Answer anything and watch a star ignite'
                : 'Tap the heart to hear what I feel ♥'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTimeContext } from '@/lib/timeSystem';

/* ── Deterministic pseudo-random — avoids hydration mismatch ── */
const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* ── Star field — 16 CSS-animated stars ── */
const STARS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 8,
  size: 0.8 + pr(i + 400) * 2.2,
  duration: 3 + pr(i + 500) * 4,
  layer: i % 3,
  op: 0.3 + pr(i + 550) * 0.7,
}));

/* ── Floating particles — 6 CSS-animated ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: pr(i + 1600) * 100,
  delay: pr(i + 1620) * 12,
  duration: 14 + pr(i + 1640) * 8,
  size: 8 + pr(i + 1660) * 12,
  op: 0.05 + pr(i + 1680) * 0.10,
  isHeart: i % 3 !== 0,
  isStar: i % 7 === 0,
}));

/* ── Rain drops — 10 CSS-animated, mood-only ── */
const RAIN = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: pr(i + 3000) * 105 - 2,
  delay: pr(i + 3050) * 2.5,
  duration: 1.5 + pr(i + 3100) * 1.0,
  height: 16 + pr(i + 3150) * 12,
  opacity: 0.05 + pr(i + 3200) * 0.06,
}));

interface Props {
  warmth?: number;
  mood?: string | null;
}

export default function AnimatedBackground({ warmth = 0, mood = null }: Props) {
  const [mounted, setMounted] = useState(false);
  const time = useTimeContext();

  /* ── Mood-derived state ── */
  const isMissingMood = mood?.includes('Miss') ?? false;
  const isSadMood     = mood?.includes('Sad') ?? false;
  const isLoveMood    = mood?.includes('Loved') ?? false;
  const isDreamyMood  = mood?.includes('Dreamy') ?? false;
  const isExcitedMood = mood?.includes('Excited') ?? false;
  const isHappyMood   = mood?.includes('Happy') ?? false;
  const showRain      = isMissingMood || isSadMood;

  const isMidnight = time.period === 'midnight';
  const isNight    = time.period === 'night' || isMidnight;

  useEffect(() => { setMounted(true); }, []);

  const starOpacityMax = isMidnight ? 0.95 : isNight ? 0.8 : time.period === 'evening' ? 0.55 : time.period === 'dawn' ? 0.2 : 0.1;
  const pMult = Math.min(1.4, time.particleMult + (isMidnight ? 0.3 : 0) + (warmth * 0.2));

  const moodExtraGlow = isLoveMood
    ? `rgba(255,77,141,${0.12 + warmth * 0.06})`
    : isDreamyMood
    ? `rgba(167,139,250,0.14)`
    : isExcitedMood
    ? `rgba(255,184,77,0.10)`
    : isHappyMood
    ? `rgba(255,130,100,0.10)`
    : null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">

      {/* ── Time-of-day sky tint ── */}
      <div className="absolute inset-0 transition-all duration-[120000ms]"
        style={{ background: time.skyOverlay }} />

      {/* ── Aurora A — static, no animation ── */}
      <div className="absolute" style={{
        top: '-30%', left: '-15%',
        width: '92vw', height: '82vh',
        background: `radial-gradient(ellipse, ${time.auroraA} 0%, transparent 68%)`,
        opacity: 0.65,
      }} />

      {/* ── Aurora B ── */}
      <div className="absolute" style={{
        top: '-14%', right: '-20%',
        width: '78vw', height: '72vh',
        background: `radial-gradient(ellipse, ${time.auroraB} 0%, transparent 65%)`,
        opacity: 0.55,
      }} />

      {/* ── Aurora C ── */}
      <div className="absolute" style={{
        bottom: '-14%', left: '26%',
        width: '64vw', height: '54vh',
        background: `radial-gradient(ellipse, ${time.auroraC} 0%, transparent 62%)`,
        opacity: 0.45,
      }} />

      {/* ── Midnight deep glow ── */}
      {isMidnight && (
        <div className="absolute" style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '70vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(60,20,160,0.2) 0%, rgba(80,40,200,0.08) 40%, transparent 70%)',
          opacity: 0.7,
        }} />
      )}

      {/* ── Warmth bloom — static ── */}
      <div className="absolute" style={{
        top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: `${50 + warmth * 16}vw`, height: '50vh',
        background: `radial-gradient(ellipse, rgba(167,139,250,${0.08 + warmth * 0.12}) 0%, transparent 62%)`,
        opacity: 0.8,
      }} />

      {/* ── Bottom warmth radial — static ── */}
      <div className="absolute" style={{
        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: '44vh',
        background: `radial-gradient(ellipse, rgba(255,77,141,${0.05 + warmth * 0.09}) 0%, rgba(123,92,255,0.03) 50%, transparent 65%)`,
        opacity: 0.8,
      }} />

      {/* ── Mood overlay — static ── */}
      {moodExtraGlow && (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 45%, ${moodExtraGlow} 0%, transparent 70%)`,
        }} />
      )}

      {/* ── Stars — pure CSS keyframes, GPU only ── */}
      {mounted && STARS.map(s => {
        const depthOp  = s.layer === 0 ? starOpacityMax : s.layer === 1 ? starOpacityMax * 0.65 : starOpacityMax * 0.35;
        const finalOp  = depthOp * s.op;
        const depthSz  = s.layer === 0 ? s.size : s.layer === 1 ? s.size * 0.8 : s.size * 0.55;
        return (
          <div
            key={`star-${s.id}`}
            className="absolute rounded-full bg-white animate-star-pulse"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: depthSz, height: depthSz,
              '--op': finalOp,
              '--dur': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            } as React.CSSProperties}
          />
        );
      })}

      {/* ── Floating particles — pure CSS ── */}
      {mounted && PARTICLES.map(p => {
        const color = p.isStar
          ? `rgba(255,211,110,${(p.op + 0.06) * pMult})`
          : p.isHeart
          ? `rgba(255,77,141,${p.op * pMult})`
          : `rgba(167,139,250,${p.op * pMult})`;
        return (
          <div
            key={`p-${p.id}`}
            className="absolute pointer-events-none select-none animate-particle-rise"
            style={{
              left: `${p.x}%`,
              fontSize: p.size,
              color,
              '--op': p.op * pMult,
              '--dur': `${p.duration}s`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties}
          >
            {p.isStar ? '✦' : p.isHeart ? '♥' : '·'}
          </div>
        );
      })}

      {/* ── Rain drops — pure CSS, Miss You / Sad only ── */}
      {mounted && showRain && RAIN.map(r => (
        <div
          key={`rain-${r.id}`}
          className="absolute pointer-events-none animate-rain-drop-fall"
          style={{
            left: `${r.x}%`, top: 0,
            width: 1.5, height: r.height,
            background: 'linear-gradient(180deg, transparent 0%, rgba(180,200,255,0.5) 40%, rgba(200,220,255,0.7) 60%, transparent 100%)',
            borderRadius: 999,
            opacity: r.opacity,
            '--dur': `${r.duration}s`,
            '--delay': `${r.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

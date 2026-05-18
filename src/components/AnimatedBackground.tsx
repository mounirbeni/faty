'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimeContext } from '@/lib/timeSystem';

/* ── Deterministic pseudo-random — avoids hydration mismatch ── */
const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* ── Star field — 20 CSS-animated stars (was 72 Framer Motion) ── */
const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 8,
  size: 0.8 + pr(i + 400) * 2.2,
  duration: 3 + pr(i + 500) * 4,
  layer: i % 3,
  op: 0.3 + pr(i + 550) * 0.7,
}));

/* ── Fireflies — 5 Framer Motion (need 2D path) ── */
const FIREFLIES = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  x: 8 + pr(i + 600) * 84,
  y: 8 + pr(i + 700) * 84,
  delay: pr(i + 800) * 10,
  duration: 9 + pr(i + 900) * 7,
  size: 3 + pr(i + 1000) * 4,
  isPink: pr(i + 1100) > 0.45,
  isGold: pr(i + 1150) > 0.78,
  mx:  (pr(i + 1200) - 0.5) * 120,
  my:  (pr(i + 1300) - 0.5) * 90,
}));

/* ── Particles — 8 CSS-animated (was 24 Framer Motion) ── */
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: pr(i + 1600) * 100,
  delay: pr(i + 1620) * 12,
  duration: 14 + pr(i + 1640) * 8,
  size: 8 + pr(i + 1660) * 12,
  op: 0.05 + pr(i + 1680) * 0.12,
  isHeart: i % 3 !== 0,
  isStar: i % 7 === 0,
}));

/* ── Rain drops — 12 CSS-animated (was 36 Framer Motion) ── */
const RAIN = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: pr(i + 3000) * 105 - 2,
  delay: pr(i + 3050) * 2.5,
  duration: 1.5 + pr(i + 3100) * 1.0,
  height: 16 + pr(i + 3150) * 12,
  opacity: 0.05 + pr(i + 3200) * 0.07,
}));

interface Props {
  warmth?: number;
  mood?: string | null;
}

export default function AnimatedBackground({ warmth = 0, mood = null }: Props) {
  const [mounted, setMounted] = useState(false);
  const shootingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const ssId = useRef(0);
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

  useEffect(() => {
    setMounted(true);

    const minMs = isMidnight ? 5000 : isNight ? 8000 : 14000;
    const maxMs = isMidnight ? 11000 : isNight ? 18000 : 28000;

    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs);
      shootingRef.current = setTimeout(() => {
        const id = ssId.current++;
        const angle = -28 - Math.random() * 18;
        setShootingStars(s => [...s, { id, x: 3 + Math.random() * 65, y: 2 + Math.random() * 35, angle }]);
        setTimeout(() => setShootingStars(s => s.filter(ss => ss.id !== id)), 2400);
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (shootingRef.current) clearTimeout(shootingRef.current); };
  }, [time.period]); // eslint-disable-line react-hooks/exhaustive-deps

  const starOpacityMax = isMidnight ? 0.95 : isNight ? 0.8 : time.period === 'evening' ? 0.55 : time.period === 'dawn' ? 0.2 : 0.1;
  const pMult = Math.min(1.6, time.particleMult + (isMidnight ? 0.3 : 0) + (warmth * 0.25));

  const auroraSpeedA = isMidnight ? 28 : 18;
  const auroraSpeedB = isMidnight ? 34 : 22;
  const auroraSpeedC = isMidnight ? 42 : 28;

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

      {/* ── Aurora A ── */}
      <div className="absolute" style={{
        top: '-30%', left: '-15%',
        width: '92vw', height: '82vh',
        background: `radial-gradient(ellipse, ${time.auroraA} 0%, transparent 68%)`,
        filter: 'blur(48px)',
        animation: `aurora-wave ${auroraSpeedA}s ease-in-out infinite`,
      }} />

      {/* ── Aurora B ── */}
      <div className="absolute" style={{
        top: '-14%', right: '-20%',
        width: '78vw', height: '72vh',
        background: `radial-gradient(ellipse, ${time.auroraB} 0%, transparent 65%)`,
        filter: 'blur(52px)',
        animation: `aurora-wave-b ${auroraSpeedB}s ease-in-out infinite`,
      }} />

      {/* ── Aurora C ── */}
      <div className="absolute" style={{
        bottom: '-14%', left: '26%',
        width: '64vw', height: '54vh',
        background: `radial-gradient(ellipse, ${time.auroraC} 0%, transparent 62%)`,
        filter: 'blur(56px)',
        animation: `aurora-wave-c ${auroraSpeedC}s ease-in-out infinite`,
      }} />

      {/* ── Midnight extra aurora ── */}
      {isMidnight && (
        <div className="absolute" style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '70vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(60,20,160,0.18) 0%, rgba(80,40,200,0.1) 40%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'midnight-breathe 9s ease-in-out infinite',
        }} />
      )}

      {/* ── Warmth bloom ── */}
      <div className="absolute animate-breathe-glow" style={{
        top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: `${50 + warmth * 16}vw`, height: '50vh',
        background: `radial-gradient(ellipse, rgba(167,139,250,${0.07 + warmth * 0.12}) 0%, transparent 62%)`,
        filter: 'blur(60px)',
      }} />

      {/* ── Bottom warmth radial ── */}
      <div className="absolute" style={{
        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: '44vh',
        background: `radial-gradient(ellipse, rgba(255,77,141,${0.05 + warmth * 0.09}) 0%, rgba(123,92,255,0.03) 50%, transparent 65%)`,
        filter: 'blur(50px)',
        animation: `aurora-wave-c ${auroraSpeedC + 6}s ease-in-out infinite`,
      }} />

      {/* ── Mood overlay ── */}
      {moodExtraGlow && (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 45%, ${moodExtraGlow} 0%, transparent 70%)`,
          animation: 'breathe-glow 5s ease-in-out infinite',
        }} />
      )}

      {/* ── High-warmth bloom ── */}
      {warmth > 0.35 && (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 55% 38% at 50% 50%, rgba(255,77,141,${warmth * 0.09}) 0%, transparent 70%)`,
          animation: 'breathe-glow 6s ease-in-out infinite',
        }} />
      )}

      {/* ── Stars — pure CSS, GPU only ── */}
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

      {/* ── Shooting stars ── */}
      {shootingStars.map(ss => (
        <div key={ss.id} className="absolute pointer-events-none" style={{
          left: `${ss.x}%`, top: `${ss.y}%`,
          width: 150, height: 1.5,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,180,220,0.9) 35%, white 65%, transparent 100%)',
          borderRadius: 999,
          animation: 'shooting-star 2s ease-out forwards',
          boxShadow: '0 0 10px 1px rgba(255,180,220,0.5)',
          transform: `rotate(${ss.angle}deg)`,
          transformOrigin: 'left center',
        }} />
      ))}

      {/* ── Fireflies — Framer Motion (need organic 2D movement) ── */}
      {mounted && FIREFLIES.map(f => {
        const color = f.isGold ? '#FFB84D' : f.isPink ? '#FF4D8D' : '#A78BFA';
        const glow  = f.isGold ? 'rgba(255,184,77,0.45)' : f.isPink ? 'rgba(255,77,141,0.45)' : 'rgba(167,139,250,0.45)';
        const fSize = f.size * pMult * 0.65;
        return (
          <motion.div
            key={`fly-${f.id}`}
            className="absolute rounded-full"
            style={{
              left: `${f.x}%`, top: `${f.y}%`,
              width: fSize, height: fSize,
              background: color,
              boxShadow: `0 0 ${f.size * 3}px ${f.size * 1.4}px ${glow}`,
            }}
            animate={{
              x: [0, f.mx, 0],
              y: [0, f.my, 0],
              opacity: [0, 0.75 * pMult, 0],
            }}
            transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
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

      {/* ── Rain drops — pure CSS, only Miss You / Sad mood ── */}
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

      {/* ── Rain mist overlay ── */}
      {mounted && showRain && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, transparent 30%, rgba(100,120,255,0.03) 70%, rgba(80,100,255,0.05) 100%)',
          animation: 'mist-drift 12s ease-in-out infinite',
        }} />
      )}

      {/* ── Candle warm glow — night only ── */}
      {isNight && (
        <div className="absolute animate-candle" style={{
          bottom: '-8%', left: '50%', transform: 'translateX(-50%)',
          width: '50vw', height: '35vh',
          background: `radial-gradient(ellipse at 50% 100%, rgba(255,140,60,${0.06 + warmth * 0.04}) 0%, rgba(255,100,40,0.02) 55%, transparent 75%)`,
          filter: 'blur(36px)',
        }} />
      )}
    </div>
  );
}

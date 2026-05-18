'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimeContext } from '@/lib/timeSystem';

/* ── Deterministic pseudo-random — avoids hydration mismatch ── */
const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* ── Star field — 72 stars of varying brightness ── */
const STARS = Array.from({ length: 72 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 8,
  size: 0.6 + pr(i + 400) * 2.8,
  duration: 2.5 + pr(i + 500) * 5,
  layer: i % 3, // 0=front 1=mid 2=back — depth parallax feel
}));

/* ── Fireflies ── */
const FIREFLIES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 5 + pr(i + 600) * 90,
  y: 5 + pr(i + 700) * 90,
  delay: pr(i + 800) * 12,
  duration: 7 + pr(i + 900) * 9,
  size: 2.5 + pr(i + 1000) * 4.5,
  isPink: pr(i + 1100) > 0.45,
  isGold: pr(i + 1150) > 0.82,
  mx:  (pr(i + 1200) - 0.5) * 160,
  my:  (pr(i + 1300) - 0.5) * 130,
  mx2: (pr(i + 1400) - 0.5) * 100,
  my2: (pr(i + 1500) - 0.5) * 80,
}));

/* ── Floating hearts + sparkles ── */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: pr(i + 1600) * 100,
  delay: pr(i + 1620) * 12,
  duration: 12 + pr(i + 1640) * 10,
  size: 7 + pr(i + 1660) * 14,
  opacity: 0.04 + pr(i + 1680) * 0.14,
  isHeart: i % 3 !== 0,
  isStar: i % 7 === 0,
}));

/* ── Atmospheric dust — tiny drifting specs ── */
const DUST = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: pr(i + 2000) * 100,
  y: pr(i + 2050) * 100,
  size: 0.8 + pr(i + 2100) * 1.8,
  delay: pr(i + 2150) * 15,
  duration: 18 + pr(i + 2200) * 14,
  driftX: (pr(i + 2250) - 0.5) * 60,
  driftY: -40 - pr(i + 2300) * 50,
  opacity: 0.04 + pr(i + 2350) * 0.09,
}));

/* ── Rain drops ── */
const RAIN = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: pr(i + 3000) * 105 - 2,
  delay: pr(i + 3050) * 3,
  duration: 1.4 + pr(i + 3100) * 1.2,
  height: 16 + pr(i + 3150) * 14,
  opacity: 0.04 + pr(i + 3200) * 0.07,
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
  const isMissingMood  = mood?.includes('Miss') ?? false;
  const isLoveMood     = mood?.includes('Loved') ?? false;
  const isDreamyMood   = mood?.includes('Dreamy') ?? false;
  const isExcitedMood  = mood?.includes('Excited') ?? false;
  const isHappyMood    = mood?.includes('Happy') ?? false;
  const showRain       = isMissingMood;

  const isMidnight = time.period === 'midnight';
  const isNight    = time.period === 'night' || isMidnight;

  useEffect(() => {
    setMounted(true);

    /* Shooting stars — more frequent at night */
    const minMs = isMidnight ? 4000 : isNight ? 6000 : 10000;
    const maxMs = isMidnight ? 9000 : isNight ? 14000 : 22000;

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

  /* ── Star brightness by time ── */
  const starOpacityMax = isMidnight ? 0.95 : isNight ? 0.8 : time.period === 'evening' ? 0.55 : time.period === 'dawn' ? 0.2 : 0.1;

  /* ── Particle density ── */
  const pMult = Math.min(1.8, time.particleMult + (isMidnight ? 0.4 : 0) + (warmth * 0.3));

  /* ── Aurora animation speed — midnight is 40% slower ── */
  const auroraSpeedA = isMidnight ? 28 : 18;
  const auroraSpeedB = isMidnight ? 34 : 22;
  const auroraSpeedC = isMidnight ? 42 : 28;

  /* ── Mood overlays ── */
  const moodExtraGlow = isLoveMood
    ? `rgba(255,77,141,${0.12 + warmth * 0.06})`
    : isDreamyMood
    ? `rgba(167,139,250,${0.14})`
    : isExcitedMood
    ? `rgba(255,184,77,${0.1})`
    : isHappyMood
    ? `rgba(255,130,100,${0.1})`
    : null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">

      {/* ── Time-of-day sky tint ── */}
      <div className="absolute inset-0 transition-all duration-[120000ms]"
        style={{ background: time.skyOverlay }} />

      {/* ── Aurora A — primary, slow breathing ── */}
      <div className="absolute" style={{
        top: '-30%', left: '-15%',
        width: '92vw', height: '82vh',
        background: `radial-gradient(ellipse, ${time.auroraA} 0%, transparent 68%)`,
        filter: 'blur(60px)',
        animation: `aurora-wave ${auroraSpeedA}s ease-in-out infinite`,
      }} />

      {/* ── Aurora B ── */}
      <div className="absolute" style={{
        top: '-14%', right: '-20%',
        width: '78vw', height: '72vh',
        background: `radial-gradient(ellipse, ${time.auroraB} 0%, transparent 65%)`,
        filter: 'blur(64px)',
        animation: `aurora-wave-b ${auroraSpeedB}s ease-in-out infinite`,
      }} />

      {/* ── Aurora C — warm accent ── */}
      <div className="absolute" style={{
        bottom: '-14%', left: '26%',
        width: '64vw', height: '54vh',
        background: `radial-gradient(ellipse, ${time.auroraC} 0%, transparent 62%)`,
        filter: 'blur(70px)',
        animation: `aurora-wave-c ${auroraSpeedC}s ease-in-out infinite`,
      }} />

      {/* ── Midnight extra deep aurora ── */}
      {isMidnight && (
        <div className="absolute" style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '70vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(60,20,160,0.18) 0%, rgba(80,40,200,0.1) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'midnight-breathe 9s ease-in-out infinite',
        }} />
      )}

      {/* ── Warmth-reactive center bloom ── */}
      <div className="absolute animate-breathe-glow" style={{
        top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: `${50 + warmth * 16}vw`, height: '50vh',
        background: `radial-gradient(ellipse, rgba(167,139,250,${0.07 + warmth * 0.12}) 0%, transparent 62%)`,
        filter: 'blur(72px)',
      }} />

      {/* ── Bottom warmth radial ── */}
      <div className="absolute" style={{
        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: '44vh',
        background: `radial-gradient(ellipse, rgba(255,77,141,${0.05 + warmth * 0.09}) 0%, rgba(123,92,255,0.03) 50%, transparent 65%)`,
        filter: 'blur(62px)',
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

      {/* ── Mist layer — subtle horizontal bands ── */}
      {isNight && (
        <>
          <div className="absolute animate-mist" style={{
            bottom: '18%', left: '-5%', width: '110%', height: '80px',
            background: 'linear-gradient(0deg, transparent 0%, rgba(123,92,255,0.04) 50%, transparent 100%)',
            filter: 'blur(20px)',
          }} />
          <div className="absolute animate-mist" style={{
            bottom: '38%', left: '-5%', width: '110%', height: '60px',
            background: 'linear-gradient(0deg, transparent 0%, rgba(255,77,141,0.03) 50%, transparent 100%)',
            filter: 'blur(16px)',
            animationDelay: '6s',
          }} />
        </>
      )}

      {/* ── Stars — layered depth ── */}
      {mounted && STARS.map(s => {
        const depthOpacity = s.layer === 0 ? starOpacityMax : s.layer === 1 ? starOpacityMax * 0.65 : starOpacityMax * 0.35;
        const depthSize   = s.layer === 0 ? s.size : s.layer === 1 ? s.size * 0.8 : s.size * 0.55;
        return (
          <motion.div
            key={`star-${s.id}`}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: depthSize, height: depthSize }}
            animate={{ opacity: [0, depthOpacity * (0.4 + pr(s.id) * 0.6), 0], scale: [0.2, 1, 0.2] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
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

      {/* ── Fireflies ── */}
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
              x: [0, f.mx, f.mx2, 0],
              y: [0, f.my, f.my2 * 0.6, 0],
              opacity: [0, 0.8 * pMult, 0.45, 0.85 * pMult, 0],
              scale:   [0.4, 1.4, 0.9, 1.3, 0.4],
            }}
            transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}

      {/* ── Floating hearts + sparkles ── */}
      {mounted && PARTICLES.map(p => (
        <motion.div
          key={`p-${p.id}`}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            color: p.isStar
              ? `rgba(255,211,110,${(p.opacity + 0.08) * pMult})`
              : p.isHeart
              ? `rgba(255,77,141,${p.opacity * pMult})`
              : `rgba(167,139,250,${p.opacity * pMult})`,
          }}
          initial={{ y: '110dvh', opacity: 0 }}
          animate={{ y: '-10dvh', opacity: [0, p.opacity * pMult, p.opacity * pMult, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {p.isStar ? '✦' : p.isHeart ? '♥' : '·'}
        </motion.div>
      ))}

      {/* ── Atmospheric dust — always present, ultra-subtle ── */}
      {mounted && DUST.map(d => (
        <motion.div
          key={`d-${d.id}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
          animate={{ x: [0, d.driftX * 0.4, d.driftX], y: [0, d.driftY * 0.4, d.driftY], opacity: [0, d.opacity, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Rain drops — when mood is "Miss You" ── */}
      {mounted && showRain && RAIN.map(r => (
        <motion.div
          key={`rain-${r.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${r.x}%`, top: 0,
            width: 1.5, height: r.height,
            background: 'linear-gradient(180deg, transparent 0%, rgba(180,200,255,0.5) 40%, rgba(200,220,255,0.7) 60%, transparent 100%)',
            borderRadius: 999,
          }}
          animate={{ y: ['-30px', '105vh'] }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* ── Rain mist overlay ── */}
      {mounted && showRain && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, transparent 30%, rgba(100,120,255,0.03) 70%, rgba(80,100,255,0.05) 100%)',
          animation: 'mist-drift 12s ease-in-out infinite',
        }} />
      )}

      {/* ── Candle warm glow at bottom — midnight & night ── */}
      {isNight && (
        <div className="absolute animate-candle" style={{
          bottom: '-8%', left: '50%', transform: 'translateX(-50%)',
          width: '50vw', height: '35vh',
          background: `radial-gradient(ellipse at 50% 100%, rgba(255,140,60,${0.06 + warmth * 0.04}) 0%, rgba(255,100,40,0.02) 55%, transparent 75%)`,
          filter: 'blur(40px)',
        }} />
      )}
    </div>
  );
}

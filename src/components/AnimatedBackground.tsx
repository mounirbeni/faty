'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimeContext } from '@/lib/timeSystem';

/* Deterministic pseudo-random — avoids hydration mismatch */
const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* Star field */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 6,
  size: 0.8 + pr(i + 400) * 2.4,
  duration: 2 + pr(i + 500) * 4,
}));

/* Fireflies */
const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 5 + pr(i + 600) * 90,
  y: 5 + pr(i + 700) * 90,
  delay: pr(i + 800) * 10,
  duration: 6 + pr(i + 900) * 8,
  size: 2.5 + pr(i + 1000) * 4,
  isPink: pr(i + 1100) > 0.5,
  mx: (pr(i + 1200) - 0.5) * 130,
  my: (pr(i + 1300) - 0.5) * 110,
  mx2: (pr(i + 1400) - 0.5) * 90,
  my2: (pr(i + 1500) - 0.5) * 70,
}));

/* Floating particles */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: pr(i + 1600) * 100,
  delay: pr(i + 1620) * 10,
  duration: 10 + pr(i + 1640) * 9,
  size: 7 + pr(i + 1660) * 13,
  opacity: 0.05 + pr(i + 1680) * 0.16,
  isHeart: i % 3 !== 0,
}));

interface Props { warmth?: number }

export default function AnimatedBackground({ warmth = 0 }: Props) {
  const [mounted, setMounted] = useState(false);
  const shootingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const ssId = useRef(0);
  const time = useTimeContext();

  useEffect(() => {
    setMounted(true);

    /* Shooting stars — frequency based on time of day */
    const minMs = time.period === 'midnight' || time.period === 'night' ? 5000 : 9000;
    const maxMs = time.period === 'midnight' || time.period === 'night' ? 12000 : 20000;

    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs);
      shootingRef.current = setTimeout(() => {
        const id = ssId.current++;
        setShootingStars(s => [...s, { id, x: 5 + Math.random() * 65, y: 3 + Math.random() * 38 }]);
        setTimeout(() => setShootingStars(s => s.filter(ss => ss.id !== id)), 2200);
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (shootingRef.current) clearTimeout(shootingRef.current); };
  }, [time.period]);

  /* Star visibility — brighter at night, dimmer in morning */
  const starOpacityMax = time.period === 'midnight' || time.period === 'night' ? 0.8
    : time.period === 'evening' ? 0.55
    : time.period === 'dawn' ? 0.25
    : 0.12;

  /* Particle multiplier */
  const pMult = Math.min(1.6, time.particleMult);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">

      {/* ── Time-of-day sky overlay ── */}
      <div className="absolute inset-0 transition-all duration-[120000ms]"
        style={{ background: time.skyOverlay }} />

      {/* ── Aurora A — primary color from time context ── */}
      <div className="animate-aurora absolute" style={{
        top: '-30%', left: '-15%',
        width: '90vw', height: '80vh',
        background: `radial-gradient(ellipse, ${time.auroraA} 0%, transparent 68%)`,
        filter: 'blur(58px)',
      }} />

      {/* ── Aurora B ── */}
      <div className="animate-aurora-b absolute" style={{
        top: '-12%', right: '-18%',
        width: '75vw', height: '70vh',
        background: `radial-gradient(ellipse, ${time.auroraB} 0%, transparent 65%)`,
        filter: 'blur(62px)',
      }} />

      {/* ── Aurora C — accent warmth ── */}
      <div className="animate-aurora-c absolute" style={{
        bottom: '-12%', left: '28%',
        width: '62vw', height: '52vh',
        background: `radial-gradient(ellipse, ${time.auroraC} 0%, transparent 62%)`,
        filter: 'blur(68px)',
      }} />

      {/* ── Warmth warmth-reactive overlay ── */}
      <div className="animate-breathe-glow absolute" style={{
        top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: '58vw', height: '48vh',
        background: `radial-gradient(ellipse, rgba(167,139,250,${0.08 + warmth * 0.1}) 0%, transparent 62%)`,
        filter: 'blur(72px)',
      }} />

      {/* ── Bottom warmth ── */}
      <div className="absolute" style={{
        bottom: '-18%', left: '50%', transform: 'translateX(-50%)',
        width: '68vw', height: '42vh',
        background: `radial-gradient(ellipse, rgba(255,77,141,${0.06 + warmth * 0.08}) 0%, rgba(123,92,255,0.04) 50%, transparent 65%)`,
        filter: 'blur(62px)',
        animation: 'aurora-wave-c 34s ease-in-out infinite',
      }} />

      {/* ── Stars (brightness driven by time) ── */}
      {mounted && STARS.map(s => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, starOpacityMax * (0.4 + pr(s.id) * 0.6), 0], scale: [0.3, 1, 0.3] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Shooting stars ── */}
      {shootingStars.map(ss => (
        <div key={ss.id} className="absolute" style={{
          left: `${ss.x}%`, top: `${ss.y}%`,
          width: 130, height: 1.5,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,180,220,0.9) 40%, white 70%, transparent 100%)',
          borderRadius: 999,
          animation: 'shooting-star 1.8s ease-out forwards',
          boxShadow: '0 0 8px 1px rgba(255,180,220,0.55)',
        }} />
      ))}

      {/* ── Fireflies ── */}
      {mounted && FIREFLIES.map(f => (
        <motion.div
          key={`fly-${f.id}`}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            width: f.size * pMult * 0.7, height: f.size * pMult * 0.7,
            background: f.isPink ? '#FF4D8D' : '#A78BFA',
            boxShadow: `0 0 ${f.size * 2.5}px ${f.size * 1.2}px ${f.isPink ? 'rgba(255,77,141,0.45)' : 'rgba(167,139,250,0.45)'}`,
          }}
          animate={{
            x: [0, f.mx, f.mx2, 0],
            y: [0, f.my, f.my2 * 0.6, 0],
            opacity: [0, 0.75 * pMult, 0.45, 0.8 * pMult, 0],
            scale: [0.5, 1.3, 0.8, 1.2, 0.5],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Floating hearts + sparkles ── */}
      {mounted && PARTICLES.map(p => (
        <motion.div
          key={`p-${p.id}`}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            color: p.isHeart
              ? `rgba(255,77,141,${p.opacity * pMult})`
              : `rgba(255,184,77,${(p.opacity + 0.08) * pMult})`,
          }}
          initial={{ y: '110dvh', opacity: 0 }}
          animate={{ y: '-10dvh', opacity: [0, p.opacity * pMult, p.opacity * pMult, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {p.isHeart ? '♥' : '✦'}
        </motion.div>
      ))}

      {/* ── High-warmth bloom ── */}
      {warmth > 0.4 && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 55% 38% at 50% 50%, rgba(255,77,141,${warmth * 0.08}) 0%, transparent 70%)`,
          animation: 'breathe-glow 6s ease-in-out infinite',
        }} />
      )}

      {/* ── Midnight extra glow ── */}
      {(time.period === 'midnight' || time.period === 'night') && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(123,92,255,0.07) 0%, transparent 65%)',
          animation: 'breathe-glow 8s ease-in-out infinite',
        }} />
      )}
    </div>
  );
}

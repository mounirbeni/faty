'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/* Deterministic pseudo-random — avoids hydration mismatch */
const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* Floating heart / star particles */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: pr(i) * 100,
  delay: pr(i + 18) * 10,
  duration: 9 + pr(i + 36) * 8,
  size: 6 + pr(i + 54) * 12,
  opacity: 0.06 + pr(i + 72) * 0.16,
  isHeart: i % 3 !== 0,
}));

/* Twinkling star field */
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 6,
  size: 1 + pr(i + 400) * 2.2,
  duration: 2 + pr(i + 500) * 4,
}));

/* Fireflies */
const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 10 + pr(i + 600) * 80,
  y: 10 + pr(i + 700) * 80,
  delay: pr(i + 800) * 8,
  duration: 5 + pr(i + 900) * 6,
  size: 3 + pr(i + 1000) * 4,
  hue: pr(i + 1100) > 0.5 ? '#FF4D8D' : '#A78BFA',
}));

interface Props { warmth?: number }

export default function AnimatedBackground({ warmth = 0 }: Props) {
  const [mounted, setMounted] = useState(false);
  const shootingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const ssId = useRef(0);

  useEffect(() => {
    setMounted(true);

    // Random shooting star every 7–18s
    const scheduleStar = () => {
      const delay = 7000 + Math.random() * 11000;
      shootingRef.current = setTimeout(() => {
        const id = ssId.current++;
        const x = 10 + Math.random() * 60;
        const y = 5 + Math.random() * 35;
        setShootingStars(s => [...s, { id, x, y }]);
        setTimeout(() => setShootingStars(s => s.filter(ss => ss.id !== id)), 2200);
        scheduleStar();
      }, delay);
    };
    scheduleStar();

    return () => { if (shootingRef.current) clearTimeout(shootingRef.current); };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">

      {/* ── Aurora layer A — primary pink bloom ── */}
      <div
        className="animate-aurora absolute"
        style={{
          top: '-30%', left: '-15%',
          width: '90vw', height: '80vh',
          background: `radial-gradient(ellipse, rgba(255,77,141,${0.22 + warmth * 0.12}) 0%, rgba(200,40,120,${0.1 + warmth * 0.06}) 45%, transparent 70%)`,
          filter: 'blur(55px)',
        }}
      />

      {/* ── Aurora layer B — violet bloom ── */}
      <div
        className="animate-aurora-b absolute"
        style={{
          top: '-10%', right: '-20%',
          width: '75vw', height: '70vh',
          background: `radial-gradient(ellipse, rgba(123,92,255,${0.18 + warmth * 0.1}) 0%, rgba(100,60,255,0.08) 48%, transparent 68%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* ── Aurora layer C — gold warmth ── */}
      <div
        className="animate-aurora-c absolute"
        style={{
          bottom: '-10%', left: '30%',
          width: '60vw', height: '50vh',
          background: `radial-gradient(ellipse, rgba(255,184,77,${0.06 + warmth * 0.1}) 0%, transparent 60%)`,
          filter: 'blur(65px)',
        }}
      />

      {/* ── Deep center connection ── */}
      <div
        className="animate-breathe-glow absolute"
        style={{
          top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '55vw', height: '45vh',
          background: `radial-gradient(ellipse, rgba(167,139,250,${0.1 + warmth * 0.08}) 0%, transparent 60%)`,
          filter: 'blur(70px)',
        }}
      />

      {/* ── Bottom warmth ── */}
      <div
        className="absolute"
        style={{
          bottom: '-15%', left: '50%',
          transform: 'translateX(-50%)',
          width: '65vw', height: '40vh',
          background: `radial-gradient(ellipse, rgba(255,77,141,${0.07 + warmth * 0.05}) 0%, rgba(123,92,255,0.04) 50%, transparent 65%)`,
          filter: 'blur(60px)',
          animation: 'aurora-wave-c 32s ease-in-out infinite',
        }}
      />

      {/* ── Star field ── */}
      {mounted && STARS.map(s => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.65, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Shooting stars ── */}
      {shootingStars.map(ss => (
        <div
          key={ss.id}
          className="absolute"
          style={{
            left: `${ss.x}%`, top: `${ss.y}%`,
            width: 120, height: 1.5,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,180,220,0.9) 40%, white 70%, transparent 100%)',
            borderRadius: 999,
            animation: 'shooting-star 1.8s ease-out forwards',
            boxShadow: '0 0 6px 1px rgba(255,180,220,0.6)',
          }}
        />
      ))}

      {/* ── Fireflies ── */}
      {mounted && FIREFLIES.map(f => (
        <motion.div
          key={`fly-${f.id}`}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            width: f.size, height: f.size,
            background: f.hue,
            boxShadow: `0 0 ${f.size * 2}px ${f.size}px ${f.hue}55`,
          }}
          animate={{
            x: [0, (pr(f.id + 1200) - 0.5) * 120, (pr(f.id + 1300) - 0.5) * 80, 0],
            y: [0, (pr(f.id + 1400) - 0.5) * 100, (pr(f.id + 1500) - 0.5) * 60, 0],
            opacity: [0, 0.7, 0.4, 0.8, 0],
            scale: [0.6, 1.2, 0.8, 1.1, 0.6],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Floating hearts & sparkles ── */}
      {mounted && PARTICLES.map(p => (
        <motion.div
          key={`p-${p.id}`}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            color: p.isHeart
              ? `rgba(255,77,141,${p.opacity})`
              : `rgba(255,184,77,${p.opacity + 0.1})`,
            fontSize: p.size,
          }}
          initial={{ y: '110dvh', opacity: 0 }}
          animate={{ y: '-10dvh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {p.isHeart ? '♥' : '✦'}
        </motion.div>
      ))}

      {/* ── Warmth overlay — pulses stronger when warmth is high ── */}
      {warmth > 0.3 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,77,141,${warmth * 0.06}) 0%, transparent 70%)`,
            animation: 'breathe-glow 5s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}

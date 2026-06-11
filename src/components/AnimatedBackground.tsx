'use client';

import { useEffect, useState } from 'react';

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

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

  const isMissingMood = mood?.includes('Miss') ?? false;
  const isSadMood     = mood?.includes('Sad')  ?? false;
  const showRain      = isMissingMood || isSadMood;

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">

      {/* Subtle top accent glow */}
      <div className="absolute" style={{
        top: '-15%', left: '50%', transform: 'translateX(-50%)',
        width: '90vw', height: '55vh',
        background: `radial-gradient(ellipse, rgba(255,32,96,${0.05 + warmth * 0.04}) 0%, transparent 65%)`,
        filter: 'blur(50px)',
      }} />

      {/* Subtle bottom violet accent */}
      <div className="absolute" style={{
        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '40vh',
        background: `radial-gradient(ellipse, rgba(88,86,214,${0.04 + warmth * 0.03}) 0%, transparent 65%)`,
        filter: 'blur(40px)',
      }} />

      {/* Rain — sad / missing mood only */}
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

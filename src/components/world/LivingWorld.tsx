'use client';

import { useEffect, useRef } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import WeatherOverlay from '@/components/world/WeatherOverlay';
import HiddenStars from '@/components/world/HiddenStars';
import MidnightBanner from '@/components/world/MidnightBanner';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';

interface Props {
  warmth?: number;
}

/** Always-alive universe layer — auroras, weather, secrets, breathing dust */
export default function LivingWorld({ warmth = 0 }: Props) {
  const evolution = useEmotionalEngine((s) => s.evolution);
  const getAnimationSpeed = useEmotionalEngine((s) => s.getAnimationSpeed);
  const dustRef = useRef<HTMLCanvasElement>(null);

  const speed = getAnimationSpeed();
  const evolvedWarmth = Math.min(1, warmth + evolution.auroraIntensity * 0.25);

  // Floating dust via rAF
  useEffect(() => {
    const canvas = dustRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; a: number; s: number }[] = [];
    const count = 18;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15 * speed,
        vy: -0.08 - Math.random() * 0.12 * speed,
        a: 0.03 + Math.random() * 0.06,
        s: 1 + Math.random() * 2,
      });
    }

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,220,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [speed]);

  return (
    <>
      <AnimatedBackground warmth={evolvedWarmth} evolution={evolution} animSpeed={speed} />
      <WeatherOverlay />
      <canvas
        ref={dustRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, opacity: 0.7 }}
        aria-hidden
      />
      <HiddenStars />
      <MidnightBanner />
    </>
  );
}

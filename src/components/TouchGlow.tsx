'use client';

import { useEffect, useRef } from 'react';

interface Pt {
  x: number; y: number;
  life: number;       // 1 → 0
  size: number;
  hue: number;        // 0=pink 0.5=violet 1=gold
  isHeart: boolean;   // if true, draw ♥ glyph
  heartSize: number;
}

interface Sparkle {
  x: number; y: number;
  life: number;       // 1 → 0
  angle: number;
  dist: number;
  size: number;
  hue: number;
}

export default function TouchGlow() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const pts         = useRef<Pt[]>([]);
  const sparkles    = useRef<Sparkle[]>([]);
  const rafId       = useRef(0);
  const lastXY      = useRef<{ x: number; y: number } | null>(null);
  const moveCount   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    /* ── Push a glow/heart point ── */
    const push = (x: number, y: number) => {
      const last = lastXY.current;
      if (last && Math.hypot(x - last.x, y - last.y) < 9) return;
      lastXY.current = { x, y };
      moveCount.current += 1;

      // Every ~9 moves spawn a tiny heart emoji particle
      const isHeart = moveCount.current % 9 === 0;
      const hue = isHeart
        ? (Math.random() > 0.5 ? 0 : 1)          // pink or gold heart
        : Math.random();                           // random glow color

      pts.current.push({
        x, y,
        life: 1,
        size: isHeart ? 18 + Math.random() * 10 : 22 + Math.random() * 18,
        hue,
        isHeart,
        heartSize: 9 + Math.random() * 7,
      });
      if (pts.current.length > 55) pts.current.shift();
    };

    /* ── Tap sparkle burst ── */
    const burst = (x: number, y: number) => {
      const count = 8 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        sparkles.current.push({
          x, y,
          life: 1,
          angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
          dist: 0,
          size: 2 + Math.random() * 3,
          hue: Math.random() > 0.6 ? 1 : 0,  // mostly pink, occasional gold
        });
      }
    };

    const onTouch     = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) push(e.touches[i].clientX, e.touches[i].clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) burst(e.touches[i].clientX, e.touches[i].clientY);
    };
    const onMouse     = (e: MouseEvent) => push(e.clientX, e.clientY);
    const onMouseDown = (e: MouseEvent) => burst(e.clientX, e.clientY);

    window.addEventListener('touchmove',  onTouch,      { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mousemove',  onMouse,      { passive: true });
    window.addEventListener('mousedown',  onMouseDown,  { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ── Glow trail ── */
      for (let i = pts.current.length - 1; i >= 0; i--) {
        const p = pts.current[i];
        p.life -= p.isHeart ? 0.022 : 0.028;   // hearts fade slower
        if (p.life <= 0) { pts.current.splice(i, 1); continue; }

        if (p.isHeart) {
          /* Floating heart glyph */
          const a   = p.life * 0.75;
          const col = p.hue < 0.5
            ? `rgba(255,77,141,${a})`
            : `rgba(255,184,77,${a})`;
          ctx.font      = `${p.heartSize * (0.5 + p.life * 0.5)}px serif`;
          ctx.fillStyle = col;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Float upward as life decreases
          ctx.fillText('♥', p.x, p.y - (1 - p.life) * 28);
        } else {
          /* Radial glow blob */
          const r    = p.size * (0.35 + p.life * 0.65);
          const a    = p.life * 0.25;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);

          if (p.hue < 0.38) {
            grad.addColorStop(0,   `rgba(255,77,141,${a})`);
            grad.addColorStop(0.5, `rgba(220,60,160,${a * 0.45})`);
          } else if (p.hue < 0.76) {
            grad.addColorStop(0,   `rgba(167,139,250,${a})`);
            grad.addColorStop(0.5, `rgba(123,92,255,${a * 0.45})`);
          } else {
            // gold — appears ~24% of the time
            grad.addColorStop(0,   `rgba(255,184,77,${a * 0.9})`);
            grad.addColorStop(0.5, `rgba(255,140,50,${a * 0.4})`);
          }
          grad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      /* ── Tap sparkles ── */
      for (let i = sparkles.current.length - 1; i >= 0; i--) {
        const s = sparkles.current[i];
        s.life -= 0.045;
        if (s.life <= 0) { sparkles.current.splice(i, 1); continue; }

        s.dist += 2.2;
        const sx = s.x + Math.cos(s.angle) * s.dist;
        const sy = s.y + Math.sin(s.angle) * s.dist;
        const a  = s.life * 0.85;
        const col = s.hue > 0.6
          ? `rgba(255,184,77,${a})`
          : `rgba(255,100,160,${a})`;

        ctx.beginPath();
        ctx.arc(sx, sy, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        // Tiny star cross
        if (s.life > 0.5) {
          ctx.strokeStyle = col;
          ctx.lineWidth   = 0.8;
          const r = s.size * s.life * 1.8;
          ctx.beginPath();
          ctx.moveTo(sx - r, sy); ctx.lineTo(sx + r, sy);
          ctx.moveTo(sx, sy - r); ctx.lineTo(sx, sy + r);
          ctx.stroke();
        }
      }

      rafId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      ro.disconnect();
      window.removeEventListener('touchmove',  onTouch);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove',  onMouse);
      window.removeEventListener('mousedown',  onMouseDown);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 12, mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}

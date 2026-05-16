'use client';

import { useEffect, useRef } from 'react';

interface Pt {
  x: number; y: number;
  life: number;    // 0→1 (fades to 0)
  size: number;
  hue: number;     // 0=pink, 1=violet
}

export default function TouchGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const rafId = useRef(0);
  const lastXY = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const push = (x: number, y: number) => {
      const last = lastXY.current;
      if (last && Math.hypot(x - last.x, y - last.y) < 10) return;
      lastXY.current = { x, y };
      pts.current.push({
        x, y, life: 1,
        size: 22 + Math.random() * 18,
        hue: Math.random(),
      });
      if (pts.current.length > 45) pts.current.shift();
    };

    const onTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) push(e.touches[i].clientX, e.touches[i].clientY);
    };
    const onMouse = (e: MouseEvent) => push(e.clientX, e.clientY);

    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = pts.current.length - 1; i >= 0; i--) {
        const p = pts.current[i];
        p.life -= 0.038;
        if (p.life <= 0) { pts.current.splice(i, 1); continue; }

        const r = p.size * (0.4 + p.life * 0.6);
        const a = p.life * 0.28;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);

        // Interpolate between pink (#FF4D8D) and violet (#A78BFA)
        if (p.hue < 0.5) {
          grad.addColorStop(0, `rgba(255,77,141,${a})`);
          grad.addColorStop(0.5, `rgba(220,80,180,${a * 0.5})`);
        } else {
          grad.addColorStop(0, `rgba(167,139,250,${a})`);
          grad.addColorStop(0.5, `rgba(123,92,255,${a * 0.5})`);
        }
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      ro.disconnect();
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mousemove', onMouse);
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

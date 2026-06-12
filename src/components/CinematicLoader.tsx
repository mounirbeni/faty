'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { playWelcome } from '@/lib/sounds';
import { EASE, SPRING } from '@/lib/motion';

const pr = (s: number) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };

const STARS = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  x: pr(i) * 100, y: pr(i + 40) * 100,
  size: 1 + pr(i + 80) * 2.2,
  delay: 0.3 + pr(i + 120) * 1.2,
  dur: 1.6 + pr(i + 160) * 2,
}));

// embers that drift up past the heart during the reveal
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 38 + pr(i + 300) * 24,
  size: 2 + pr(i + 320) * 3,
  delay: 0.4 + pr(i + 340) * 1.1,
  dur: 2.2 + pr(i + 360) * 1.6,
  drift: (pr(i + 380) - 0.5) * 60,
}));

interface Props {
  onDone: () => void;
}

export default function CinematicLoader({ onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('hold'); playWelcome(); }, 350);
    const t2 = setTimeout(() => setPhase('out'), 2350);
    const t3 = setTimeout(() => onDone(), 2980);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,77,141,0.20) 0%, transparent 52%), #06010C', zIndex: 200 }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.09, filter: 'blur(10px)' }}
          transition={{ duration: 0.75, ease: EASE.smooth }}
        >
          {/* ── Letterbox framing ── */}
          <motion.div className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
            style={{ background: '#000', height: '8vh' }}
            initial={{ y: '-100%' }} animate={{ y: 0 }}
            exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: EASE.smooth }} />
          <motion.div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
            style={{ background: '#000', height: '8vh' }}
            initial={{ y: '100%' }} animate={{ y: 0 }}
            exit={{ y: '100%' }} transition={{ duration: 0.6, ease: EASE.smooth }} />

          {/* ── Stars ── */}
          {STARS.map(s => (
            <motion.div key={s.id} className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1, 0.4] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
          ))}

          {/* ── Aurora layers ── */}
          <div className="absolute pointer-events-none" style={{
            top: '-25%', left: '-15%', width: '80vw', height: '70vh',
            background: 'radial-gradient(ellipse, rgba(255,77,141,0.24) 0%, transparent 65%)',
            filter: 'blur(55px)', animation: 'aurora-wave 8s ease-in-out infinite' }} />
          <div className="absolute pointer-events-none" style={{
            bottom: '-20%', right: '-10%', width: '65vw', height: '60vh',
            background: 'radial-gradient(ellipse, rgba(123,92,255,0.20) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'aurora-wave-b 10s ease-in-out infinite' }} />

          {/* ── Vertical light beam behind the heart ── */}
          <motion.div className="absolute pointer-events-none"
            style={{ width: 3, height: '64vh', top: '8%',
              background: 'linear-gradient(180deg, transparent, rgba(255,150,190,0.35), rgba(255,150,190,0.08), transparent)',
              filter: 'blur(3px)' }}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: [0, 0.8, 0.4], scaleY: 1 }}
            transition={{ duration: 1.4, delay: 0.25, ease: EASE.smooth }} />

          {/* ── Drifting embers ── */}
          {EMBERS.map(e => (
            <motion.div key={`e-${e.id}`} className="absolute rounded-full"
              style={{ left: `${e.x}%`, top: '60%', width: e.size, height: e.size,
                background: 'rgba(255,180,120,0.9)', boxShadow: '0 0 6px rgba(255,150,90,0.8)' }}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -260, x: e.drift }}
              transition={{ duration: e.dur, delay: e.delay, repeat: Infinity, ease: 'easeOut' }} />
          ))}

          {/* ── Heart formation ── */}
          <div className="relative flex items-center justify-center" style={{ marginBottom: 8 }}>
            {/* radial bloom */}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width: 320, height: 320, background: 'radial-gradient(circle, rgba(255,77,141,0.4) 0%, transparent 60%)', filter: 'blur(18px)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 1, 0.6] }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE.smooth }} />

            {/* expanding ignition ring */}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width: 96, height: 96, border: '2px solid rgba(255,120,160,0.6)' }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 3.4, opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE.smooth }} />
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width: 96, height: 96, border: '1px solid rgba(167,139,250,0.5)' }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 4.2, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.4, delay: 0.45, ease: EASE.smooth }} />

            {/* the orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ ...SPRING.bouncy, delay: 0.2 }}
            >
              <motion.div
                className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF4D8D 0%, #C9245F 100%)',
                  boxShadow: '0 0 0 1px rgba(255,77,141,0.3), 0 0 60px rgba(255,77,141,0.65), 0 0 120px rgba(255,77,141,0.28)' }}
                animate={{ boxShadow: [
                  '0 0 60px rgba(255,77,141,0.55)',
                  '0 0 95px rgba(255,77,141,0.9)',
                  '0 0 60px rgba(255,77,141,0.55)',
                ] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* ignition core flash */}
                <motion.div className="absolute inset-0 rounded-full bg-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.95, 0], scale: [0, 1.1, 1.4] }}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE.smooth }} />
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Heart size={40} fill="white" className="text-white relative z-10" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Title ── */}
          <div className="mt-8 flex flex-col items-center gap-1.5 px-8">
            <div className="overflow-hidden sheen rounded-md">
              <motion.p
                className="text-[26px] font-black tracking-tight"
                style={{ backgroundImage: 'linear-gradient(135deg, #FFB3C7 0%, #FF7AA2 45%, #FFD36E 90%)',
                  backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.75, delay: 0.7, ease: EASE.smooth }}
              >
                Our Universe
              </motion.p>
            </div>
            <motion.p className="text-[11.5px] italic tracking-wide"
              style={{ color: 'rgba(255,179,199,0.5)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05, ease: EASE.smooth }}>
              entering your safe place…
            </motion.p>
          </div>

          {/* ── Progress line ── */}
          <div className="absolute bottom-[calc(8vh+34px)] w-[140px] h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF4D8D, #FFD36E, #7B79FF)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.9, delay: 0.6, ease: EASE.soft }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

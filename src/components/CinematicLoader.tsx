'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { playWelcome } from '@/lib/sounds';

const pr = (s: number) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: pr(i) * 100, y: pr(i + 40) * 100,
  size: 1 + pr(i + 80) * 2.2,
  delay: pr(i + 120) * 1.5,
  dur: 1.5 + pr(i + 160) * 2,
}));

interface Props {
  onDone: () => void;
}

export default function CinematicLoader({ onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // Play welcome sound once user has interacted (needed for AudioContext)
    const t1 = setTimeout(() => {
      setPhase('hold');
      playWelcome();
    }, 300);
    const t2 = setTimeout(() => setPhase('out'), 1800);
    const t3 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,77,141,0.22) 0%, transparent 55%), #0D0015', zIndex: 200 }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Stars */}
          {STARS.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1, 0.4] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Aurora layers */}
          <div className="absolute pointer-events-none" style={{
            top: '-25%', left: '-15%', width: '80vw', height: '70vh',
            background: 'radial-gradient(ellipse, rgba(255,77,141,0.26) 0%, transparent 65%)',
            filter: 'blur(55px)', animation: 'aurora-wave 8s ease-in-out infinite',
          }} />
          <div className="absolute pointer-events-none" style={{
            bottom: '-20%', right: '-10%', width: '65vw', height: '60vh',
            background: 'radial-gradient(ellipse, rgba(123,92,255,0.22) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'aurora-wave-b 10s ease-in-out infinite',
          }} />

          {/* Heart orb */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF4D8D 0%, #C9245F 100%)',
                boxShadow: '0 0 0 1px rgba(255,77,141,0.3), 0 0 60px rgba(255,77,141,0.65), 0 0 120px rgba(255,77,141,0.28)',
              }}
              animate={{ scale: [1, 1.08, 1], boxShadow: [
                '0 0 60px rgba(255,77,141,0.65)',
                '0 0 90px rgba(255,77,141,0.85)',
                '0 0 60px rgba(255,77,141,0.65)',
              ]}}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={38} fill="white" className="text-white" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="mt-7 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-[15px] font-semibold tracking-wide" style={{ color: 'rgba(255,230,242,0.85)' }}>
              Our Universe
            </p>
            <p className="text-[11px] italic" style={{ color: 'rgba(255,179,199,0.45)' }}>
              entering your safe place…
            </p>
          </motion.div>

          {/* Loading dots */}
          <div className="absolute bottom-16 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgba(255,77,141,0.6)' }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

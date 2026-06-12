'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

const MINI_STARS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: pr(i + 50) * 100,
  y: pr(i + 150) * 100,
  size: 1 + pr(i + 250) * 2,
  delay: pr(i + 350) * 3,
  dur: 2 + pr(i + 450) * 2.5,
}));

export default function ConstellationBanner({
  answered, total, onOpen,
}: { answered: number; total: number; onOpen: () => void }) {
  const fraction = Math.min(1, answered / total);
  const complete = answered >= total;

  return (
    <motion.button
      onClick={onOpen}
      className="sheen relative w-full rounded-[22px] overflow-hidden text-left"
      style={{
        background: 'linear-gradient(135deg, #0B0820 0%, #160A24 55%, #0A0612 100%)',
        border: '1px solid rgba(123,121,255,0.22)',
        boxShadow: '0 10px 44px rgba(88,86,214,0.18), 0 2px 10px rgba(0,0,0,0.5)',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.5, ease: EASE.smooth } }}
      whileHover={{ y: -4, scale: 1.012 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING.gentle}
    >
      {/* top accent line */}
      <div className="h-[3px] w-full" style={{
        background: 'linear-gradient(90deg, #FF2060, #FFD36E, #7B79FF, #FF2060)',
        backgroundSize: '200% 100%', animation: 'gradient-x 5s linear infinite',
      }} />

      {/* mini starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {MINI_STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* glow */}
        <div className="absolute" style={{
          right: '-10%', top: '-30%', width: '55%', height: '160%',
          background: 'radial-gradient(ellipse, rgba(255,32,96,0.18) 0%, transparent 65%)',
          filter: 'blur(28px)',
        }} />
      </div>

      <div className="relative flex items-center gap-3.5 p-4">
        {/* heart orb */}
        <div className="relative shrink-0">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: complete
                ? 'linear-gradient(135deg, #FFD36E, #FF6FA0)'
                : 'linear-gradient(135deg, #FF4D80, #7B79FF)',
              boxShadow: complete
                ? '0 6px 26px rgba(255,179,0,0.4)'
                : '0 6px 26px rgba(123,121,255,0.4)',
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={26} fill="white" className="text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-1.5 -right-1.5"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={15} style={{ color: '#FFD36E', filter: 'drop-shadow(0 0 6px rgba(255,211,110,0.9))' }} />
          </motion.div>
        </div>

        {/* text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.18em]"
              style={{ color: 'rgba(176,174,255,0.7)' }}>New ✦ Our Sky</span>
          </div>
          <h3 className="text-[16px] font-black text-white leading-tight mt-0.5">Our Constellation</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {complete
              ? 'Our sky is complete — come see it glow'
              : `${answered} of ${total} stars already lit for you`}
          </p>
          {/* slim progress */}
          <div className="mt-2 h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF2060, #FFD36E, #7B79FF)' }}
              initial={{ width: 0 }} animate={{ width: `${fraction * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </div>

        <ChevronRight size={18} className="text-white/40 shrink-0" />
      </div>
    </motion.button>
  );
}

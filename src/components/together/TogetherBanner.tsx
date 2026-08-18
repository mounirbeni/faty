'use client';

import { motion } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

const EMBERS = Array.from({ length: 9 }, (_, i) => ({
  id: i, x: 55 + pr(i + 3) * 42, y: 10 + pr(i + 13) * 80, size: 6 + pr(i + 23) * 9,
  delay: pr(i + 33) * 3, dur: 3.5 + pr(i + 43) * 3,
}));

/** The one entry point on the map to the two-player half of the app. */
export default function TogetherBanner({ onOpen, rounds }: { onOpen: () => void; rounds: number }) {
  return (
    <motion.button onClick={onOpen}
      whileHover={{ y: -4, scale: 1.012 }} whileTap={{ scale: 0.98 }} transition={SPRING.gentle}
      className="sheen relative w-full rounded-[22px] overflow-hidden text-left"
      style={{ background: 'linear-gradient(135deg, #180620 0%, #2A0A1E 55%, #100410 100%)',
        border: '1px solid rgba(192,38,211,0.3)',
        boxShadow: '0 10px 44px rgba(192,38,211,0.18), 0 2px 10px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.14, duration: 0.5, ease: EASE.smooth } }}>
      <div className="h-[3px] w-full" style={{
        background: 'linear-gradient(90deg, #C026D3, #FF2060, #FF9F45, #C026D3)',
        backgroundSize: '200% 100%', animation: 'gradient-x 5s linear infinite' }} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {EMBERS.map(e => (
          <motion.span key={e.id} className="absolute" style={{ left: `${e.x}%`, top: `${e.y}%`, fontSize: e.size, color: 'rgba(255,120,80,0.45)' }}
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.65, 0.15] }}
            transition={{ duration: e.dur, delay: e.delay, repeat: Infinity, ease: 'easeInOut' }}>✦</motion.span>
        ))}
        <div className="absolute" style={{ right: '-8%', top: '-30%', width: '50%', height: '160%',
          background: 'radial-gradient(ellipse, rgba(192,38,211,0.24) 0%, transparent 65%)', filter: 'blur(26px)' }} />
      </div>

      <div className="relative flex items-center gap-3.5 p-4">
        <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF2060, #C026D3)', boxShadow: '0 6px 26px rgba(192,38,211,0.5)' }}
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Flame size={25} className="text-white" fill="currentColor" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(240,171,252,0.8)' }}>
            New ✦ Two players
          </span>
          <h3 className="text-[16px] font-black text-white leading-tight mt-0.5">Together Tonight 😈</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {rounds > 0
              ? `Dare Duel · Never Have I Ever · Spin · Dice — ${rounds} rounds so far`
              : 'Four games we play against each other — one phone, one heat dial'}
          </p>
        </div>
        <ChevronRight size={18} className="text-white/40 shrink-0" />
      </div>
    </motion.button>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Mail, ChevronRight } from 'lucide-react';

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

const HEARTS = Array.from({ length: 8 }, (_, i) => ({
  id: i, x: 60 + pr(i + 9) * 38, y: pr(i + 19) * 100, size: 8 + pr(i + 29) * 10,
  delay: pr(i + 39) * 3, dur: 4 + pr(i + 49) * 3,
}));

export default function ForYouBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button onClick={onOpen} whileTap={{ scale: 0.98 }}
      className="relative w-full rounded-[22px] overflow-hidden text-left"
      style={{ background: 'linear-gradient(135deg, #20060F 0%, #2A0A18 55%, #140510 100%)',
        border: '1px solid rgba(255,32,96,0.28)', boxShadow: '0 10px 44px rgba(255,32,96,0.18), 0 2px 10px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #FF2060, #FFB300, #7B79FF, #FF2060)', backgroundSize: '200% 100%', animation: 'gradient-x 5s linear infinite' }} />

      {/* floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HEARTS.map(h => (
          <motion.span key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%`, fontSize: h.size, color: 'rgba(255,77,141,0.4)' }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}>♥</motion.span>
        ))}
        <div className="absolute" style={{ right: '-8%', top: '-30%', width: '50%', height: '160%', background: 'radial-gradient(ellipse, rgba(255,32,96,0.22) 0%, transparent 65%)', filter: 'blur(26px)' }} />
      </div>

      <div className="relative flex items-center gap-3.5 p-4">
        <div className="relative shrink-0">
          <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF4D80, #D9266B)', boxShadow: '0 6px 26px rgba(255,32,96,0.45)' }}
            animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Mail size={25} className="text-white" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,179,199,0.75)' }}>New ✦ From Me to You</span>
          <h3 className="text-[16px] font-black text-white leading-tight mt-0.5">For You 💌</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Open-when letters, reasons I love you & coupons — for when you need me
          </p>
        </div>
        <ChevronRight size={18} className="text-white/40 shrink-0" />
      </div>
    </motion.button>
  );
}

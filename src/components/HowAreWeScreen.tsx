'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const DIMENSIONS = [
  {
    id: 0,
    question: 'How connected do you feel to him right now?',
    low: 'Distant today',
    high: 'Completely connected',
  },
  {
    id: 1,
    question: 'How certain do you feel about your future together?',
    low: 'Still figuring it out',
    high: 'Completely certain',
  },
  {
    id: 2,
    question: 'How loved do you feel across this distance?',
    low: 'Less than I want',
    high: 'Deeply, overwhelmingly loved',
  },
  {
    id: 3,
    question: 'How strong do you feel your bond is right now?',
    low: 'A little fragile',
    high: 'Unbreakable',
  },
  {
    id: 4,
    question: 'How much do you miss him right now?',
    low: 'A little',
    high: 'Unbearably much',
  },
];

const GLOW_DROPS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: (i * 127.3) % 100,
  y: (i * 91.7) % 100,
  dur: 7 + (i % 4) * 2,
  delay: i * 0.5,
}));

export default function HowAreWeScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const allRated = DIMENSIONS.every(d => ratings[d.id] !== undefined);

  const handleSend = () => {
    const lines = DIMENSIONS.map(d => {
      const r = ratings[d.id] ?? 0;
      const hearts = '❤️'.repeat(r) + '🤍'.repeat(5 - r);
      return `${hearts} ${d.question}`;
    }).join('\n');
    const avg = DIMENSIONS.reduce((sum, d) => sum + (ratings[d.id] ?? 0), 0) / DIMENSIONS.length;
    notifyOwner(`💞 <b>How are we doing? — She just checked in</b>\n\n${lines}\n\n<b>Overall: ${avg.toFixed(1)} / 5 ❤️</b>`);
    setDone(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0010 0%, #180018 45%, #0f000f 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.11) 0%, transparent 62%)' }} />

      {GLOW_DROPS.map(d => (
        <motion.div key={d.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: 3, height: 3, background: 'rgba(236,72,153,0.25)', filter: 'blur(1px)' }}
          animate={{ y: [0, 12, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.6, 1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(236,72,153,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div>
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,200,230,0.95)' }}>How Are We?</h1>
            <p className="text-[11px]" style={{ color: 'rgba(236,72,153,0.45)' }}>Check in on us right now</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-3">

                <p className="text-[12px] text-center mb-1" style={{ color: 'rgba(236,72,153,0.5)' }}>
                  Rate with hearts — 1 is low, 5 is everything
                </p>

                {DIMENSIONS.map((dim, idx) => {
                  const rating = ratings[dim.id] ?? 0;
                  return (
                    <motion.div
                      key={dim.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="rounded-[22px] p-4 transition-all"
                      style={{
                        background: 'linear-gradient(145deg, rgba(22,0,25,0.97), rgba(12,0,15,0.97))',
                        border: rating > 0 ? '1px solid rgba(236,72,153,0.28)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: rating > 0 ? '0 4px 16px rgba(236,72,153,0.1)' : 'none',
                      }}>
                      <p className="text-[13.5px] font-semibold mb-3 leading-snug" style={{ color: 'rgba(255,200,230,0.88)' }}>
                        {dim.question}
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            onClick={() => setRatings(prev => ({ ...prev, [dim.id]: n }))}
                            className="transition-transform"
                            style={{ transform: rating >= n ? 'scale(1.15)' : 'scale(1)' }}>
                            <Heart
                              size={28}
                              fill={rating >= n ? '#ec4899' : 'none'}
                              style={{ color: rating >= n ? '#ec4899' : 'rgba(236,72,153,0.25)', transition: 'all 0.2s' }}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] mt-2"
                          style={{ color: 'rgba(236,72,153,0.45)' }}>
                          {rating <= 2 ? dim.low : rating >= 4 ? dim.high : 'Somewhere in between'}
                        </motion.p>
                      )}
                    </motion.div>
                  );
                })}

                <button
                  onClick={handleSend}
                  disabled={!allRated}
                  className="w-full py-4 rounded-2xl text-[14px] font-bold text-white mt-2 transition-all"
                  style={{
                    background: allRated ? 'linear-gradient(135deg, #be185d, #ec4899)' : 'rgba(255,255,255,0.06)',
                    boxShadow: allRated ? '0 4px 24px rgba(190,24,93,0.4)' : 'none',
                    border: allRated ? 'none' : '1px solid rgba(255,255,255,0.09)',
                    color: allRated ? 'white' : 'rgba(236,72,153,0.4)',
                    opacity: allRated ? 1 : 0.75,
                  }}>
                  {allRated ? 'Send him our check-in 💞' : `Rate all ${DIMENSIONS.length} to send`}
                </button>
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: 56 }}>
                  💞
                </motion.div>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(255,200,230,0.95)' }}>
                    He sees us clearly now
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(236,72,153,0.6)' }}>
                    Every heart you gave him tells him where you are. And he'll meet you there.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #be185d, #ec4899)', boxShadow: '0 4px 24px rgba(190,24,93,0.4)' }}>
                  Back to Our Universe
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

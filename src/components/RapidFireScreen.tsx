'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import { rapidFirePairs } from '@/data/rapidFirePairs';
import { useGameStore } from '@/store/gameStore';
import { softTap, successVibe } from '@/lib/useHaptics';

export default function RapidFireScreen() {
  const { setRapidFireChoice, setPhase } = useGameStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [isDone, setIsDone] = useState(false);

  const current = rapidFirePairs[currentIdx];

  const handleChoice = (choice: 'a' | 'b') => {
    if (selected) return; // already chosen
    softTap();
    setSelected(choice);
    setRapidFireChoice(current.id, choice === 'a' ? current.a : current.b);

    // Auto-advance after 420ms
    setTimeout(() => {
      setSelected(null);
      if (currentIdx >= rapidFirePairs.length - 1) {
        successVibe();
        setIsDone(true);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    }, 420);
  };

  // Timer bar (for rapid-fire feel) uses currentIdx as key directly.

  if (isDone) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <CheckCircle2 size={44} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Rapid fire done! <Zap className="inline text-amber-400" size={28} />
        </h2>
        <p className="text-[15px] text-white/60 mb-8 leading-relaxed max-w-xs">
          Quick decisions reveal deep truths. I love learning your instincts.
        </p>
        <motion.button
          onClick={() => setPhase('home')}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 active:scale-95 transition-transform cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Back to Map 🗺️
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-gradient-to-b from-orange-600/20 to-transparent blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Zap size={11} className="text-amber-400" /> Rapid Fire
          </p>
          <p className="text-sm font-bold text-white">{currentIdx + 1} / {rapidFirePairs.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Timer bar */}
      <div className="px-5 mb-2 shrink-0">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            key={currentIdx}
            className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 6, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="relative z-10 flex flex-col flex-1 items-center justify-center px-5 gap-4"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">
            This or That?
          </p>

          {/* Option A */}
          <motion.button
            onClick={() => handleChoice('a')}
            className={`
              w-full max-w-sm py-7 rounded-3xl font-bold text-lg text-center
              border transition-all active:scale-95 cursor-pointer
              flex flex-col items-center gap-2
              ${selected === 'a'
                ? 'bg-gradient-to-br from-orange-400 to-amber-500 border-transparent text-white shadow-2xl shadow-orange-500/40 scale-[1.02]'
                : selected === 'b'
                ? 'glass opacity-30 border-white/10 text-white/50'
                : 'glass-strong border-white/15 text-white hover:border-orange-400/40'
              }
            `}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-3xl">{current.emojiA}</span>
            <span className="text-[16px]">{current.a}</span>
          </motion.button>

          {/* VS badge */}
          <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-white/50">VS</span>
          </div>

          {/* Option B */}
          <motion.button
            onClick={() => handleChoice('b')}
            className={`
              w-full max-w-sm py-7 rounded-3xl font-bold text-lg text-center
              border transition-all active:scale-95 cursor-pointer
              flex flex-col items-center gap-2
              ${selected === 'b'
                ? 'bg-gradient-to-br from-rose-500 to-pink-600 border-transparent text-white shadow-2xl shadow-rose-500/40 scale-[1.02]'
                : selected === 'a'
                ? 'glass opacity-30 border-white/10 text-white/50'
                : 'glass-strong border-white/15 text-white hover:border-rose-400/40'
              }
            `}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-3xl">{current.emojiB}</span>
            <span className="text-[16px]">{current.b}</span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 pb-8 pt-4 shrink-0">
        {rapidFirePairs.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < currentIdx
                ? 'w-4 h-1.5 bg-amber-400'
                : i === currentIdx
                ? 'w-4 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

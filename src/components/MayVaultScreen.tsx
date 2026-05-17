'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Unlock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';
import CinematicMemoryViewer from '@/components/memory/CinematicMemoryViewer';
import { playBloom } from '@/lib/sounds';

export default function MayVaultScreen() {
  const { setPhase } = useGameStore();
  const [revealed, setRevealed] = useState(false);
  const [cinemaOpen, setCinemaOpen] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-700/25 to-rose-700/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-gradient-to-t from-rose-600/20 to-transparent blur-[80px]" />
      </div>

      {/* Back button */}
      <div className="absolute top-10 left-5 z-20">
        <button
          onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} /> Map
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full gap-6">

        {/* Vault icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.15 }}
          onAnimationComplete={() => heartbeat()}
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-violet-700/50">
            <Unlock size={48} className="text-white animate-heartbeat" />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-violet-400/25 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-3xl border border-violet-400/15 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.25em] mb-2">
            The May 11 Memory
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
            The Vault Is Open
          </h1>
          <p className="text-[14px] text-white/55 leading-relaxed">
            This vault was sealed before we met.
            <br />It opened on{' '}
            <span className="text-rose-400 font-semibold">May 11, 2026</span>
            {' '}— the day we finally{' '}
            <span className="text-violet-400 font-semibold">saw each other face to face</span>.
          </p>
        </motion.div>

        {/* Unlocked message */}
        <motion.div
          className="w-full glass-warm rounded-3xl p-6 ring-1 ring-rose-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {!revealed ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
                A message I wrote before we met
              </p>
              <p className="text-[13px] text-white/55 leading-relaxed italic">
                This is what I wanted to tell you, before I had ever seen your face.
              </p>
              <motion.button
                onClick={() => {
                  heartbeat();
                  playBloom();
                  setRevealed(true);
                  setCinemaOpen(true);
                  notifyOwner(`🔓 <b>Your angel just opened the Memory Vault!</b>\n\nShe tapped "Open the Vault" and read the letter you wrote before you ever met. 💜`);
                }}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform cursor-pointer shadow-lg shadow-violet-500/25"
                whileTap={{ scale: 0.97 }}
              >
                Open the Vault
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[15px] text-white/85 leading-relaxed italic">
                &quot;My angel, I am writing this before I have ever stood in the same room as you. I do not know how that day will feel exactly — but I know it will change everything. If you are reading this after May 11, then it happened. We met. And I hope it was everything I imagined. I hope I made you feel safe. I hope you smiled. I hope you went home knowing that what we have is real. Because it is. It always was. ❤️&quot;
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Romantic footer */}
        <motion.p
          className="text-[12px] text-white/25 italic flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Heart size={10} className="text-rose-400/50" fill="currentColor" />
          Written with love, before the day we finally met
          <Heart size={10} className="text-rose-400/50" fill="currentColor" />
        </motion.p>

      </div>

      <CinematicMemoryViewer
        open={cinemaOpen && revealed}
        onClose={() => setCinemaOpen(false)}
        title="The May 11 Memory"
        subtitle="Written before we ever met"
        timestamp="May 11, 2026"
      >
        <p className="text-[15px] text-white/85 leading-relaxed italic">
          &quot;My angel, I am writing this before I have ever stood in the same room as you. I do not know how that day will feel exactly — but I know it will change everything. If you are reading this after May 11, then it happened. We met. And I hope it was everything I imagined. I hope I made you feel safe. I hope you smiled. I hope you went home knowing that what we have is real. Because it is. It always was. ❤️&quot;
        </p>
      </CinematicMemoryViewer>
    </motion.div>
  );
}

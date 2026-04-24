'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { sendTelegramNotification } from '@/app/actions/notify';
import { softTap, successVibe } from '@/lib/useHaptics';

const MOODS = [
  { emoji: '🥰', label: 'Loved' },
  { emoji: '✨', label: 'Excited' },
  { emoji: '🥺', label: 'Miss You' },
  { emoji: '😂', label: 'Happy' },
  { emoji: '🌙', label: 'Dreamy' },
] as const;

type MoodEmoji = (typeof MOODS)[number]['emoji'];

export default function MoodTracker() {
  const { currentMood, setCurrentMood } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const handleMoodPick = (emoji: MoodEmoji, label: string) => {
    softTap();
    setCurrentMood(`${emoji} ${label}`);
    setJustSelected(true);

    // Fire-and-forget — never blocks UI, never throws to client
    sendTelegramNotification(
      `💖 <b>Faty just updated her mood!</b>\n\n${emoji} <b>${label}</b>\n\n<i>She is feeling something beautiful right now.</i>`
    ).catch(console.error);

    setTimeout(() => {
      successVibe();
      setIsExpanded(false);
      setJustSelected(false);
    }, 800);
  };

  return (
    <div className="w-full px-4">
      <motion.div
        className="glass-strong rounded-3xl border border-white/10 overflow-hidden"
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header tap target */}
        <button
          onClick={() => { softTap(); setIsExpanded(v => !v); }}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentMood?.split(' ')[0] ?? '🤍'}</span>
            <div className="text-left">
              <p className="text-[13px] font-bold text-white/90 leading-tight">
                {currentMood ? `Feeling ${currentMood.split(' ').slice(1).join(' ')}` : 'How is your heart?'}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
                Tap to update
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-white/30 text-xl leading-none select-none"
          >
            ›
          </motion.div>
        </button>

        {/* Emoji grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-center text-[11px] text-white/40 uppercase tracking-widest pb-3">
                How is your heart feeling right now? 🤍
              </p>
              <div className="grid grid-cols-5 gap-2 px-4 pb-5">
                {MOODS.map(({ emoji, label }) => {
                  const isSelected = currentMood === `${emoji} ${label}`;
                  return (
                    <motion.button
                      key={emoji}
                      onClick={() => handleMoodPick(emoji, label)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl cursor-pointer transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-rose-500/30 border border-rose-400/50 shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                          : 'glass border border-white/5'
                      }`}
                      whileTap={{ scale: 0.88 }}
                      animate={isSelected && justSelected ? { scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="text-2xl leading-none">{emoji}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight text-center ${
                        isSelected ? 'text-rose-300' : 'text-white/40'
                      }`}>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

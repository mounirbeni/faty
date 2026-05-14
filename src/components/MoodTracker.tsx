'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Plane, Smile, Moon, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { sendTelegramNotification } from '@/app/actions/notify';
import { softTap, successVibe } from '@/lib/useHaptics';

const MOODS: { label: string; Icon: LucideIcon; color: string; bg: string; fillable?: boolean }[] = [
  { label: 'Loved',    Icon: Heart,    color: 'text-rose-400',   bg: 'bg-rose-500/20',   fillable: true },
  { label: 'Excited',  Icon: Sparkles, color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
  { label: 'Miss You', Icon: Plane,    color: 'text-sky-400',    bg: 'bg-sky-500/20'    },
  { label: 'Happy',    Icon: Smile,    color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { label: 'Dreamy',   Icon: Moon,     color: 'text-violet-400', bg: 'bg-violet-500/20', fillable: true },
];

export default function MoodTracker() {
  const { currentMood, setCurrentMood } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  // Handles both old "🥰 Loved" format and new "Loved" format
  const activeMood = MOODS.find(m => currentMood?.includes(m.label));

  const handleMoodPick = (label: string) => {
    softTap();
    setCurrentMood(label);
    setJustSelected(true);

    sendTelegramNotification(
      `💖 <b>Faty just updated her mood!</b>\n\n<b>${label}</b>\n\n<i>She is feeling something beautiful right now.</i>`
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
            {activeMood ? (
              <div className={`w-9 h-9 rounded-xl ${activeMood.bg} flex items-center justify-center shrink-0`}>
                <activeMood.Icon
                  size={18}
                  className={activeMood.color}
                  {...(activeMood.fillable ? { fill: 'currentColor' } : {})}
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center shrink-0">
                <Heart size={16} className="text-white/30" />
              </div>
            )}
            <div className="text-left">
              <p className="text-[13px] font-bold text-white/90 leading-tight">
                {activeMood ? `Feeling ${activeMood.label}` : 'How is your heart?'}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
                Tap to update
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={16} className="text-white/30" />
          </motion.div>
        </button>

        {/* Icon grid */}
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
                How is your heart feeling right now?
              </p>
              <div className="grid grid-cols-5 gap-2 px-4 pb-5">
                {MOODS.map(({ label, Icon, color, bg, fillable }) => {
                  const isSelected = currentMood?.includes(label);
                  return (
                    <motion.button
                      key={label}
                      onClick={() => handleMoodPick(label)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl cursor-pointer transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-rose-500/30 border border-rose-400/50 shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                          : 'glass border border-white/5'
                      }`}
                      whileTap={{ scale: 0.88 }}
                      animate={isSelected && justSelected ? { scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-rose-500/20' : bg}`}>
                        <Icon
                          size={17}
                          className={isSelected ? 'text-rose-300' : color}
                          {...(fillable ? { fill: 'currentColor' } : {})}
                        />
                      </div>
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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Plane, Smile, Moon, ChevronDown, Star, Coffee, Zap, HeartHandshake, Shield, Cloud, Flower2, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { softTap, successVibe } from '@/lib/useHaptics';
import { playChime } from '@/lib/sounds';
import { trackInteraction } from '@/lib/sessionTracker';

const MOODS: { label: string; Icon: LucideIcon; color: string; bg: string; fillable?: boolean }[] = [
  { label: 'Loved',      Icon: Heart,         color: 'text-rose-400',    bg: 'bg-rose-500/20',    fillable: true },
  { label: 'Excited',    Icon: Sparkles,      color: 'text-amber-400',   bg: 'bg-amber-500/20'   },
  { label: 'Miss You',   Icon: Plane,         color: 'text-sky-400',     bg: 'bg-sky-500/20'     },
  { label: 'Happy',      Icon: Smile,         color: 'text-yellow-400',  bg: 'bg-yellow-500/20'  },
  { label: 'Dreamy',     Icon: Moon,          color: 'text-violet-400',  bg: 'bg-violet-500/20',  fillable: true },
  { label: 'Grateful',   Icon: Star,          color: 'text-amber-300',   bg: 'bg-amber-400/20',  fillable: true },
  { label: 'Cozy',       Icon: Coffee,        color: 'text-orange-400',  bg: 'bg-orange-500/20'  },
  { label: 'Playful',    Icon: Zap,           color: 'text-yellow-300',  bg: 'bg-yellow-400/20'  },
  { label: 'Tender',     Icon: HeartHandshake,color: 'text-pink-400',    bg: 'bg-pink-500/20'    },
  { label: 'Safe',       Icon: Shield,        color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { label: 'Soft',       Icon: Cloud,         color: 'text-slate-300',   bg: 'bg-slate-400/20'   },
  { label: 'Blushing',   Icon: Flower2,       color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
  { label: 'Nostalgic',  Icon: Clock,         color: 'text-indigo-300',  bg: 'bg-indigo-500/20'  },
];

export default function MoodTracker() {
  const { currentMood, setCurrentMood } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  // Handles both old "🥰 Loved" format and new "Loved" format
  const activeMood = MOODS.find(m => currentMood?.includes(m.label));

  const handleMoodPick = (label: string) => {
    softTap(); playChime();
    setCurrentMood(label);
    setJustSelected(true);

    trackInteraction('mood-update', label);
    notifyOwner(`💖 <b>Your angel just updated her mood!</b>\n\n<b>${label}</b>\n\n<i>She is feeling something beautiful right now.</i>`);

    setTimeout(() => {
      successVibe();
      setIsExpanded(false);
      setJustSelected(false);
    }, 800);
  };

  return (
    <div className="w-full px-4">
      <motion.div
        className="rounded-[22px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,77,141,0.07) 0%, rgba(123,92,255,0.05) 100%)',
          backdropFilter: 'blur(44px) saturate(165%)',
          WebkitBackdropFilter: 'blur(44px) saturate(165%)',
          border: '1px solid rgba(255,77,141,0.14)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.42), 0 0 30px rgba(255,77,141,0.05), inset 0 1px 0 rgba(255,180,210,0.1)',
        }}
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
                          ? 'border shadow-[0_0_20px_rgba(255,77,141,0.3)]'
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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, MapPin, Clock, Utensils, Music, Sun } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { successVibe, softTap } from '@/lib/useHaptics';
import { playBloom, playSparkle, playPop, playSuccess } from '@/lib/sounds';
import { trackInteraction } from '@/lib/sessionTracker';

const SECTIONS = [
  {
    key: 'place',
    icon: MapPin,
    label: 'Where?',
    color: '#FF4D8D',
    question: 'Where would our perfect date take place?',
    options: [
      { emoji: '🌊', label: 'The beach at sunset' },
      { emoji: '🏙️', label: 'A rooftop in the city' },
      { emoji: '🌲', label: 'A quiet forest trail' },
      { emoji: '🏠', label: 'Cozy at home together' },
      { emoji: '🎡', label: 'A fairground at night' },
      { emoji: '☁️', label: 'Somewhere far away' },
    ],
  },
  {
    key: 'time',
    icon: Clock,
    label: 'When?',
    color: '#A78BFA',
    question: 'What time of day feels most magical for us?',
    options: [
      { emoji: '🌅', label: 'Golden hour sunrise' },
      { emoji: '☀️', label: 'Lazy Sunday afternoon' },
      { emoji: '🌆', label: 'The blue hour, just before dark' },
      { emoji: '🌙', label: 'Late night, just us' },
      { emoji: '⭐', label: 'Under the midnight stars' },
      { emoji: '🌤️', label: 'Any time, as long as you\'re there' },
    ],
  },
  {
    key: 'food',
    icon: Utensils,
    label: 'What to eat?',
    color: '#FFB84D',
    question: 'What would we eat on our dream date?',
    options: [
      { emoji: '🍕', label: 'Pizza and something cold' },
      { emoji: '🕯️', label: 'Fancy restaurant, candle between us' },
      { emoji: '🧺', label: 'A picnic with too much food' },
      { emoji: '🍦', label: 'Ice cream walking around' },
      { emoji: '🍜', label: 'Something warm, cooked together' },
      { emoji: '🍓', label: 'Fruit, chocolate, things we can share' },
    ],
  },
  {
    key: 'vibe',
    icon: Music,
    label: 'The vibe?',
    color: '#FF4D8D',
    question: 'What feeling do you want us to have?',
    options: [
      { emoji: '💫', label: 'Butterflies and nervous smiles' },
      { emoji: '😌', label: 'Calm and completely safe' },
      { emoji: '🎉', label: 'Laughing until our stomachs hurt' },
      { emoji: '💞', label: 'So in love it hurts (the good kind)' },
      { emoji: '🌙', label: 'Deep talks until we lose track of time' },
      { emoji: '🔥', label: 'Electric — we can\'t stop looking at each other' },
    ],
  },
  {
    key: 'activity',
    icon: Sun,
    label: 'What would we do?',
    color: '#A78BFA',
    question: 'What would we actually be doing together?',
    options: [
      { emoji: '🎬', label: 'Watch something and forget the world' },
      { emoji: '🚶', label: 'Walk with nowhere to be' },
      { emoji: '💃', label: 'Dance, even if we\'re bad at it' },
      { emoji: '🎮', label: 'Play something competitive and fun' },
      { emoji: '📸', label: 'Take photos and just explore' },
      { emoji: '🌌', label: 'Lie down and look at the stars' },
    ],
  },
] as const;

type Picks = Partial<Record<string, string>>;

export default function DreamDateScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [done, setDone] = useState(false);

  const section = SECTIONS[step];

  const pick = (label: string) => {
    softTap(); playPop(); playSparkle();
    const newPicks = { ...picks, [section.key]: label };
    setPicks(newPicks);

    if (step < SECTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 320);
    } else {
      successVibe(); playBloom(); playSuccess();
      trackInteraction('dream-date-built');
      setTimeout(() => {
        setDone(true);
        const summary = SECTIONS.map(s => `<b>${s.label}</b> ${newPicks[s.key] ?? '?'}`).join('\n');
        notifyOwner(`🌹 <b>Dream Date Builder!</b>\n\nShe just built her dream date with you:\n\n${summary}\n\n<i>Make it happen 💕</i>`);
      }, 350);
    }
  };

  if (done) return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,77,141,0.16) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg,#FF4D8D,#A78BFA)', boxShadow: '0 0 60px rgba(255,77,141,0.6)' }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
        <Heart size={36} fill="white" className="text-white" />
      </motion.div>
      <motion.h2 className="text-2xl font-black text-white text-center mb-5"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        Your dream date 💕
      </motion.h2>
      <motion.div className="glass-cinema rounded-[24px] p-5 w-full max-w-sm mb-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        {SECTIONS.map((s, i) => (
          <motion.div key={s.key} className="flex items-start gap-3 mb-3 last:mb-0"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${s.color}22` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,179,199,0.4)' }}>{s.label}</div>
              <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,230,242,0.9)' }}>{picks[s.key]}</div>
            </div>
          </motion.div>
        ))}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5">
          <Heart size={9} fill="currentColor" style={{ color: '#FFB84D' }} />
          <p className="text-[11px] italic" style={{ color: 'rgba(255,179,199,0.4)' }}>He already saw this 💌</p>
        </div>
      </motion.div>
      <motion.button onClick={() => setPhase('home')}
        className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 8px 36px rgba(255,77,141,0.4)' }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Heart size={15} fill="currentColor" /> Back to Map
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}>

      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${section.color}18 0%, transparent 65%)`, filter: 'blur(60px)', transition: 'all 0.6s ease' }} />

      <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
            style={{ color: 'rgba(255,230,242,0.6)' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: '#FFB84D' }} />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Dream Date</span>
          </div>
          <div className="text-[11px] font-bold" style={{ color: 'rgba(255,179,199,0.5)' }}>
            {step + 1}/{SECTIONS.length}
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${section.color}, ${section.color}88)` }}
            animate={{ width: `${((step + 1) / SECTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }} />
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}>

            {/* Icon + label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center"
                style={{ background: `${section.color}22`, border: `1px solid ${section.color}33` }}>
                <section.icon size={22} style={{ color: section.color }} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,179,199,0.45)' }}>{section.label}</div>
                <h2 className="text-[16px] font-black text-white leading-tight">{section.question}</h2>
              </div>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3">
              {section.options.map((opt, i) => {
                const isSelected = picks[section.key] === opt.label;
                return (
                  <motion.button key={opt.label}
                    onClick={() => pick(opt.label)}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055 }}
                    className="relative flex flex-col items-start gap-2 p-4 rounded-[18px] text-left active:scale-95 transition-all cursor-pointer"
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${section.color}30, ${section.color}18)` : 'rgba(255,255,255,0.05)',
                      border: isSelected ? `1px solid ${section.color}55` : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isSelected ? `0 0 24px ${section.color}33` : 'none',
                    }}
                    whileTap={{ scale: 0.93 }}>
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-[12px] font-semibold leading-tight" style={{ color: isSelected ? 'rgba(255,230,242,0.95)' : 'rgba(255,230,242,0.65)' }}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <motion.div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: section.color }}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Heart size={10} fill="white" className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {SECTIONS.map((s, i) => (
            <div key={s.key} className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i <= step ? s.color : 'rgba(255,255,255,0.1)',
              }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

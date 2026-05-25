'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, ChevronRight, RotateCcw, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

interface Scenario {
  id: number;
  a: string;
  b: string;
}

const SCENARIOS: Scenario[] = [
  { id: 1, a: 'Always know what I\'m thinking', b: 'Have me always know what you\'re thinking' },
  { id: 2, a: 'Go on a spontaneous road trip with no destination', b: 'Have a perfectly planned vacation together' },
  { id: 3, a: 'Cook dinner together every night at home', b: 'Order from your favorite place whenever you want' },
  { id: 4, a: 'I surprise you with random little gifts', b: 'We plan special experiences and adventures together' },
  { id: 5, a: 'Stay in on a cozy night watching movies', b: 'Go out to a nice restaurant just the two of us' },
  { id: 6, a: 'I write you love letters every week', b: 'I send you voice notes telling you how I feel' },
  { id: 7, a: 'Live in a busy exciting city together', b: 'Live in a quiet town close to nature' },
  { id: 8, a: 'Have a big romantic anniversary celebration every year', b: 'Have a quiet intimate dinner just the two of us' },
  { id: 9, a: 'Have a no-phones date every week', b: 'Always be completely reachable to each other' },
  { id: 10, a: 'I remember every small thing you ever mention to me', b: 'I always manage to make you laugh no matter what' },
  { id: 11, a: 'We share the same travel bucket list', b: 'We have different adventures and share the stories with each other' },
  { id: 12, a: 'Know how our story ends', b: 'Live it one beautiful page at a time' },
  { id: 13, a: 'Be the one who loves more', b: 'Be loved more than you love' },
  { id: 14, a: 'Have deep conversations until 3am every night', b: 'Fall asleep together in comfortable silence' },
  { id: 15, a: 'Slow dance in the kitchen at midnight', b: 'Watch the sunrise together in silence' },
];

type Choice = 'a' | 'b';

export default function WouldYouRatherScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [choices, setChoices] = useState<Record<number, Choice>>({});
  const [picked, setPicked] = useState<Choice | null>(null);
  const [direction, setDirection] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const scenario = SCENARIOS[currentIdx];
  const total = SCENARIOS.length;
  const isLast = currentIdx === total - 1;

  const handlePick = (choice: Choice) => {
    if (picked) return;
    setPicked(choice);
    setChoices(prev => ({ ...prev, [scenario.id]: choice }));
    notifyOwner(
      `🤔 <b>Your angel answered a Would You Rather!</b>\n\nQ${currentIdx + 1} of ${total}\n\nShe chose <b>${choice.toUpperCase()}</b>:\n"${choice === 'a' ? scenario.a : scenario.b}"\n\nOver: "${choice === 'a' ? scenario.b : scenario.a}"`
    );

    setTimeout(() => {
      if (isLast) {
        setIsDone(true);
      } else {
        setDirection(1);
        setCurrentIdx(i => i + 1);
        setAnimKey(k => k + 1);
        setPicked(null);
      }
    }, 700);
  };

  const reset = () => {
    setCurrentIdx(0);
    setChoices({});
    setPicked(null);
    setDirection(1);
    setAnimKey(k => k + 1);
    setIsDone(false);
  };

  if (isDone) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-5 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-600/15 to-transparent blur-[130px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/40"
          >
            <Heart size={36} className="text-white animate-heartbeat" fill="white" />
          </motion.div>

          <motion.h2
            className="text-2xl font-extrabold text-white text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            You answered all {total}!
          </motion.h2>

          <motion.div
            className="glass-rose rounded-3xl overflow-hidden w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500" />
            <div className="p-5">
              <p className="text-[14px] text-white/70 leading-relaxed mb-3">
                Every choice you made tells me something about you. And I love every answer — even the ones that surprised me.
              </p>
              <p className="text-[14px] text-white/70 leading-relaxed">
                I want to go through every single one of these with you in person, and tell you exactly which ones I would have picked too.
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-3">
                <Heart size={10} className="text-rose-400/70" fill="currentColor" />
                <p className="text-xs text-white/40 italic">Always yours</p>
              </div>
            </div>
          </motion.div>

          <div className="flex w-full gap-3">
            <motion.button
              onClick={reset}
              className="flex-1 py-3.5 glass-premium rounded-2xl text-[14px] font-semibold text-white/70 flex items-center justify-center gap-2 transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <RotateCcw size={15} />
              Play Again
            </motion.button>
            <motion.button
              onClick={() => setPhase('home')}
              className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-transform cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                boxShadow: '0 0 0 1px rgba(244,63,94,0.35), 0 8px 24px rgba(244,63,94,0.3)',
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Heart size={15} fill="currentColor" />
              Back to Map
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center px-5 pt-8 pb-6 overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/12 via-rose-500/8 to-transparent blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPhase('home')}
            className="flex items-center gap-2 px-3 py-2 glass-premium rounded-xl text-sm text-white/60 transition-transform cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-violet-400" />
            <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Would You Rather</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-white/30 font-medium">
            <span>{currentIdx + 1} of {total}</span>
            <span>{Math.round(((currentIdx) / total) * 100)}% done</span>
          </div>
          <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIdx / total) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, x: direction * 60, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -60, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col gap-3"
          >
            {/* Question badge */}
            <div className="flex items-center justify-center gap-2">
              <Star size={10} className="text-amber-400/60" fill="currentColor" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Would You Rather</span>
              <Star size={10} className="text-amber-400/60" fill="currentColor" />
            </div>

            {/* Option A */}
            <motion.button
              onClick={() => handlePick('a')}
              disabled={!!picked}
              className={`
                relative w-full p-5 rounded-2xl text-start text-[14px] font-semibold leading-snug
                transition-all cursor-pointer overflow-hidden
                ${picked === 'a'
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-violet-500/30 ring-2 ring-violet-400/40'
                  : picked === 'b'
                  ? 'glass-premium opacity-40 text-white/50'
                  : 'glass-premium text-white hover:bg-white/10'
                }
              `}
            >
              {picked === 'a' && (
                <motion.div
                  className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
                  initial={{ x: '-150%' }}
                  animate={{ x: '350%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              )}
              <div className="relative z-10 flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${picked === 'a' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                  A
                </span>
                <span>{scenario.a}</span>
              </div>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <div className="w-8 h-8 rounded-full glass-premium flex items-center justify-center">
                <span className="text-[10px] font-black text-white/40">OR</span>
              </div>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Option B */}
            <motion.button
              onClick={() => handlePick('b')}
              disabled={!!picked}
              className={`
                relative w-full p-5 rounded-2xl text-start text-[14px] font-semibold leading-snug
                transition-all cursor-pointer overflow-hidden
                ${picked === 'b'
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/30 ring-2 ring-rose-400/40'
                  : picked === 'a'
                  ? 'glass-premium opacity-40 text-white/50'
                  : 'glass-premium text-white hover:bg-white/10'
                }
              `}
            >
              {picked === 'b' && (
                <motion.div
                  className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
                  initial={{ x: '-150%' }}
                  animate={{ x: '350%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              )}
              <div className="relative z-10 flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${picked === 'b' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                  B
                </span>
                <span>{scenario.b}</span>
              </div>
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Tap hint */}
        {!picked && (
          <motion.p
            className="text-center text-[11px] text-white/25 italic"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap your answer
          </motion.p>
        )}

        {/* Next arrow when picked */}
        {picked && !isLast && (
          <motion.div
            className="flex items-center justify-center gap-2 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-[12px]">Next question</span>
            <ChevronRight size={14} />
          </motion.div>
        )}

        {/* Previous answers strip */}
        {currentIdx > 0 && (
          <div className="flex flex-wrap gap-1 justify-center pt-1">
            {SCENARIOS.slice(0, currentIdx).map((s, i) => (
              <div
                key={s.id}
                className={`w-5 h-1.5 rounded-full ${choices[s.id] === 'a' ? 'bg-violet-500/60' : 'bg-rose-500/60'}`}
                title={`Q${i + 1}: ${choices[s.id] === 'a' ? 'A' : 'B'}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

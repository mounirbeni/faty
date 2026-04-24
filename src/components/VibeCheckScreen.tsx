'use client';

import { useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { Heart, X, ArrowLeft, CheckCircle2, Map, RotateCcw } from 'lucide-react';
import { vibeScenarios } from '@/data/vibeScenarios';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, swipeLove, swipeNope } from '@/lib/useHaptics';
import IconFromName from './IconFromName';

const SWIPE_THRESHOLD = 90;

export default function VibeCheckScreen() {
  const { setVibeChoice, setPhase } = useGameStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    heartbeat();
  }, []);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const loveOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-250, -150, 0, 150, 250], [0.5, 1, 1, 1, 0.5]);

  const current = vibeScenarios[currentIdx];

  const handleSwipe = (dir: 'love' | 'nope') => {
    if (!current) return;
    if (dir === 'love') {
      swipeLove();
    } else {
      swipeNope();
    }
    setVibeChoice(current.id, dir);
    setExitDir(dir === 'love' ? 'right' : 'left');

    setTimeout(() => {
      x.set(0);
      setExitDir(null);
      if (currentIdx >= vibeScenarios.length - 1) {
        setIsDone(true);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    }, 300);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > SWIPE_THRESHOLD) handleSwipe('love');
    else if (info.offset.x < -SWIPE_THRESHOLD) handleSwipe('nope');
    else x.set(0);
  };

  if (isDone) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/40 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          onAnimationComplete={() => heartbeat()}
        >
          <CheckCircle2 size={44} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-3">Vibes noted!</h2>
        <p className="text-[15px] text-white/60 mb-8 leading-relaxed max-w-xs">
          I now know exactly what makes your heart flutter. 
          <br /><span className="text-rose-400 font-semibold">That&apos;s everything to me.</span>
        </p>
        <motion.button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95 transition-transform cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Back to Map <Map size={16} className="ml-1" />
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
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => { swipeNope(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold">Vibe Check</p>
          <p className="text-sm font-bold text-white">{currentIdx + 1} / {vibeScenarios.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Swipe instruction */}
      <div className="flex justify-between px-8 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400/70">
          <X size={12} /> Not for me
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-400/70">
          Love it <Heart size={12} fill="currentColor" />
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Background ghost cards */}
        {vibeScenarios.slice(currentIdx + 1, currentIdx + 3).reverse().map((s, i) => (
          <div
            key={s.id}
            className="absolute glass-strong rounded-3xl p-6 w-full max-w-[320px] will-change-transform"
            style={{
              transform: `scale(${0.9 + i * 0.04}) translateY(${(1 - i) * -16}px)`,
              opacity: 0.4 + i * 0.2,
              zIndex: i,
            }}
          />
        ))}

        {/* Active draggable card */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              className="absolute w-full max-w-[320px] z-10 cursor-grab active:cursor-grabbing will-change-transform"
              style={{ x, rotate, opacity: cardOpacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.85}
              onDragEnd={handleDragEnd}
              animate={
                exitDir === 'right'
                  ? { x: 400, rotate: 20, opacity: 0 }
                  : exitDir === 'left'
                  ? { x: -400, rotate: -20, opacity: 0 }
                  : {}
              }
              transition={{ duration: 0.28, ease: 'easeOut' }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
            >
              {/* Swipe indicators */}
              <motion.div
                className="absolute top-6 left-6 px-3 py-1.5 bg-green-500 rounded-xl font-black text-white text-sm rotate-[-20deg] z-20"
                style={{ opacity: loveOpacity }}
              >
                LOVE IT <Heart size={16} className="ml-1" fill="currentColor" />
              </motion.div>
              <motion.div
                className="absolute top-6 right-6 px-3 py-1.5 bg-rose-500 rounded-xl font-black text-white text-sm rotate-[20deg] z-20"
                style={{ opacity: nopeOpacity }}
              >
                NOPE <X size={16} className="ml-1" />
              </motion.div>

              {/* Card content */}
              <div className="glass-strong rounded-3xl p-8 text-center shadow-2xl shadow-black/30 select-none">
                <div className="mb-6 drop-shadow-2xl">
                  <IconFromName name={current.icon} size={96} className="text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
                  {current.text}
                </h3>
                <p className="text-[13px] text-white/50 italic">{current.subtext}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tap buttons */}
      <div className="flex gap-4 px-8 pb-10 pt-4 shrink-0">
        <motion.button
          onClick={() => handleSwipe('nope')}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold active:scale-95 transition-transform cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} /> Not me
        </motion.button>
        <motion.button
          onClick={() => handleSwipe('love')}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold active:scale-95 transition-transform cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={20} fill="currentColor" /> Love it
        </motion.button>
      </div>

      {/* Footer controls */}
      <div className="flex flex-col items-center gap-4 pb-6 shrink-0">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 w-full">
          {vibeScenarios.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentIdx
                  ? 'w-4 h-1.5 bg-rose-400'
                  : i === currentIdx
                  ? 'w-4 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Back button */}
        <AnimatePresence>
          {currentIdx > 0 && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => {
                setCurrentIdx(i => i - 1);
              }}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs font-semibold active:scale-95 cursor-pointer uppercase tracking-widest mt-2"
            >
              <RotateCcw size={12} />
              Undo
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RefreshCw, Shuffle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { DESIRE_QUESTIONS, DesireCategory } from '@/data/desireQuestions';
import { notifyOwner } from '@/lib/notify';

type CatMeta = { label: string; emoji: string; color: string; glow: string; border: string; description: string };

const CATEGORY_META: Record<DesireCategory, CatMeta> = {
  heart: {
    label: 'Heart',
    emoji: '💗',
    color: 'from-rose-600 to-pink-700',
    glow: 'rgba(244,114,182,0.5)',
    border: 'rgba(251,113,133,0.4)',
    description: 'What you feel and need emotionally',
  },
  body: {
    label: 'Body',
    emoji: '🔥',
    color: 'from-red-600 to-rose-800',
    glow: 'rgba(239,68,68,0.5)',
    border: 'rgba(248,113,113,0.4)',
    description: 'What your body craves and desires',
  },
  us: {
    label: 'Us',
    emoji: '💋',
    color: 'from-purple-600 to-pink-800',
    glow: 'rgba(168,85,247,0.45)',
    border: 'rgba(192,132,252,0.4)',
    description: 'What you want from our future together',
  },
};

export default function DesireQuestionsScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const logActivity = useGameStore((s) => s.logActivity);

  const [activeCategory, setActiveCategory] = useState<DesireCategory>('heart');
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [notified, setNotified] = useState(false);

  const questions = useMemo(
    () => DESIRE_QUESTIONS.filter((q) => q.category === activeCategory),
    [activeCategory]
  );
  const unseen = questions.filter((q) => !seenIds.includes(q.id));
  const shuffled = useMemo(() => [...unseen].sort(() => Math.random() - 0.5), [unseen.length]);
  const topQ = shuffled[0] ?? unseen[0];
  const totalSeen = questions.length - unseen.length;
  const allDone = unseen.length === 0;

  const meta = CATEGORY_META[activeCategory];

  const handleCategoryChange = (cat: DesireCategory) => {
    setActiveCategory(cat);
    setRevealed(false);
  };

  const handleReveal = () => {
    if (!topQ || revealed) return;
    setRevealed(true);
    if (!notified) {
      setNotified(true);
      logActivity('mini-game', 'Played Desire Questions');
      notifyOwner(
        `💗 <b>She opened Desire Questions</b>\n\nCategory: ${meta.label} ${meta.emoji}\n\n<i>She's sitting with real questions about what she wants from you…</i>`
      );
    }
  };

  const handleNext = () => {
    if (!topQ) return;
    setSeenIds((prev) => [...prev, topQ.id]);
    setRevealed(false);
  };

  const handleReset = () => {
    setSeenIds((prev) => prev.filter((id) => !questions.map((q) => q.id).includes(id)));
    setRevealed(false);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0008 0%, #2a0015 40%, #160010 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 40% 25%, ${meta.glow.replace('0.', '0.1')}, transparent 60%)`,
        }}
      />

      {/* Floating particles */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            left: `${12 + i * 13}%`,
            top: `${10 + (i % 3) * 25}%`,
            background: `rgba(255,77,141,0.35)`,
            filter: 'blur(1px)',
          }}
          animate={{ y: [0, -12, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 2.8 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button
            onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,210,228,0.95)' }}>
              What I Want 💗
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,140,175,0.5)' }}>
              Questions that deserve honest answers
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          {(Object.keys(CATEGORY_META) as DesireCategory[]).map((cat) => {
            const m = CATEGORY_META[cat];
            const catQs = DESIRE_QUESTIONS.filter((q) => q.category === cat);
            const catSeen = catQs.filter((q) => seenIds.includes(q.id)).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="flex-1 py-2.5 rounded-2xl text-center transition-all"
                style={{
                  background: isActive ? 'rgba(255,77,141,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isActive ? `0 0 18px ${m.glow}` : 'none',
                }}
              >
                <div className="text-lg">{m.emoji}</div>
                <div className="text-[10px] font-bold mt-0.5"
                  style={{ color: isActive ? 'rgba(255,210,228,0.9)' : 'rgba(255,255,255,0.4)' }}>
                  {m.label}
                </div>
                <div className="text-[9px] mt-0.5"
                  style={{ color: isActive ? 'rgba(255,140,175,0.65)' : 'rgba(255,255,255,0.22)' }}>
                  {catSeen}/{catQs.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Category description */}
        <p className="px-4 pb-3 text-[11px] italic text-center" style={{ color: 'rgba(255,140,175,0.4)' }}>
          {meta.description}
        </p>

        {/* Progress */}
        <div className="px-4 pb-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
              animate={{ width: `${(totalSeen / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: 'rgba(255,140,175,0.45)' }}>
              {totalSeen} of {questions.length} answered
            </span>
          </div>
        </div>

        {/* Card area */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5 text-center px-6"
              >
                <div className="text-5xl">{meta.emoji}</div>
                <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,210,228,0.95)' }}>
                  You answered them all
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,140,175,0.6)' }}>
                  These aren't easy questions. The fact that you sat with them matters.
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                    boxShadow: '0 4px 20px rgba(201,36,95,0.4)',
                  }}
                >
                  <RefreshCw size={14} /> Go Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${unseen.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full"
                style={{ height: 380 }}
              >
                {/* Back cards */}
                {unseen.slice(1, 3).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-4 rounded-[26px]"
                    style={{
                      top: `${(i + 1) * 10}px`,
                      height: 290,
                      background: `rgba(180,0,60,${0.08 - i * 0.02})`,
                      border: `1px solid rgba(255,77,141,${0.1 - i * 0.03})`,
                      transform: `scale(${1 - (i + 1) * 0.04})`,
                      zIndex: 2 - i,
                    }}
                  />
                ))}

                {/* Top card */}
                <motion.div
                  key={topQ?.id}
                  className="absolute inset-x-4"
                  style={{ top: 0, zIndex: 10 }}
                  animate={revealed ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 2.8, repeat: revealed ? 0 : Infinity, ease: 'easeInOut' }}
                >
                  <AnimatePresence mode="wait">
                    {!revealed ? (
                      <motion.div
                        key="front"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-[26px] flex flex-col items-center justify-center gap-5 py-16 px-6 cursor-pointer"
                        style={{
                          background: 'linear-gradient(160deg, #2a0014, #180010)',
                          border: `1px solid ${meta.border}`,
                          boxShadow: `0 8px 44px ${meta.glow}, inset 0 1px 0 rgba(255,180,210,0.08)`,
                          minHeight: 280,
                        }}
                        onClick={handleReveal}
                      >
                        <div className="text-5xl">{meta.emoji}</div>
                        <p className="text-[14px] font-semibold text-center" style={{ color: 'rgba(255,150,180,0.6)' }}>
                          Tap to reveal the question
                        </p>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                          style={{
                            background: 'rgba(255,77,141,0.1)',
                            border: '1px solid rgba(255,77,141,0.2)',
                          }}>
                          <Shuffle size={10} className="text-rose-400" />
                          <span className="text-[10px] font-bold" style={{ color: 'rgba(255,140,175,0.6)' }}>
                            {meta.label} question
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-[26px] flex flex-col gap-6 px-7 py-8"
                        style={{
                          background: 'linear-gradient(160deg, #380018, #200010)',
                          border: `1px solid ${meta.border}`,
                          boxShadow: `0 10px 52px ${meta.glow}`,
                          minHeight: 280,
                        }}
                      >
                        <div className="text-2xl text-center">{meta.emoji}</div>
                        <p
                          className="text-[18px] font-bold leading-snug text-center"
                          style={{ color: 'rgba(255,228,240,0.96)' }}
                        >
                          {topQ?.question}
                        </p>
                        {topQ?.hint && (
                          <p className="text-[12px] text-center italic" style={{ color: 'rgba(255,140,175,0.45)' }}>
                            {topQ.hint}
                          </p>
                        )}
                        <button
                          onClick={handleNext}
                          className="flex items-center justify-center gap-1.5 mt-auto px-5 py-3 rounded-2xl text-[12px] font-bold text-white w-full"
                          style={{
                            background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                            boxShadow: '0 4px 16px rgba(201,36,95,0.4)',
                          }}
                        >
                          Next Question <ChevronRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

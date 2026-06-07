'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { TONIGHT_CARDS, TonightCategory } from '@/data/togetherTonight';
import { notifyOwner } from '@/lib/notify';

type Meta = { label: string; emoji: string; color: string; glow: string; border: string; bg: string };

const CATEGORY_META: Record<TonightCategory, Meta> = {
  sweet: {
    label: 'Sweet',
    emoji: '🌸',
    color: 'from-rose-600 to-pink-700',
    glow: 'rgba(244,114,182,0.45)',
    border: 'rgba(251,113,133,0.4)',
    bg: 'linear-gradient(160deg, #2d001a 0%, #1a0012 100%)',
  },
  bold: {
    label: 'Bold',
    emoji: '🔥',
    color: 'from-orange-600 to-rose-700',
    glow: 'rgba(249,115,22,0.4)',
    border: 'rgba(251,146,60,0.4)',
    bg: 'linear-gradient(160deg, #1f0a00 0%, #2d0a10 100%)',
  },
  fire: {
    label: 'Fire',
    emoji: '💋',
    color: 'from-red-700 to-rose-900',
    glow: 'rgba(220,38,38,0.5)',
    border: 'rgba(248,113,113,0.4)',
    bg: 'linear-gradient(160deg, #1a0005 0%, #2d0012 100%)',
  },
};

export default function TogetherTonightScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const logActivity = useGameStore((s) => s.logActivity);

  const [activeCategory, setActiveCategory] = useState<TonightCategory>('sweet');
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [notified, setNotified] = useState(false);

  const cards = useMemo(
    () => TONIGHT_CARDS.filter((c) => c.category === activeCategory),
    [activeCategory]
  );
  const unseen = cards.filter((c) => !seenIds.includes(c.id));
  const topCard = unseen[0];
  const totalSeen = cards.length - unseen.length;
  const allDone = unseen.length === 0;

  const meta = CATEGORY_META[activeCategory];

  const handleCategoryChange = (cat: TonightCategory) => {
    setActiveCategory(cat);
    setRevealed(false);
  };

  const handleReveal = () => {
    if (!topCard || revealed) return;
    setRevealed(true);
    if (!notified) {
      setNotified(true);
      logActivity('mini-game', 'Played Together Tonight');
      notifyOwner(
        `🌙 <b>She opened "Together Tonight"</b>\n\nCategory: ${meta.label} ${meta.emoji}\n\n<i>She's reading what you'd do if you were together right now…</i>`
      );
    }
  };

  const handleNext = () => {
    if (!topCard) return;
    setSeenIds((prev) => [...prev, topCard.id]);
    setRevealed(false);
  };

  const handleReset = () => {
    setSeenIds((prev) => prev.filter((id) => !cards.map((c) => c.id).includes(id)));
    setRevealed(false);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: meta.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${10 + i * 11}%`,
            top: `${8 + (i % 4) * 22}%`,
            background: meta.glow.replace('0.', '0.').replace(')', ', 0.5)').replace('rgba(', 'rgba('),
            filter: 'blur(1px)',
          }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5 + i * 0.35, repeat: Infinity, delay: i * 0.25 }}
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
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,220,230,0.95)' }}>
              Together Tonight 🌙
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,160,185,0.55)' }}>
              If we were together right now…
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-4 pb-4">
          {(Object.keys(CATEGORY_META) as TonightCategory[]).map((cat) => {
            const m = CATEGORY_META[cat];
            const catCards = TONIGHT_CARDS.filter((c) => c.category === cat);
            const catSeen = catCards.filter((c) => seenIds.includes(c.id)).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="flex-1 py-2.5 rounded-2xl text-center transition-all"
                style={{
                  background: isActive
                    ? `rgba(255,77,141,0.18)`
                    : 'rgba(255,255,255,0.05)',
                  border: isActive ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isActive ? `0 0 18px ${m.glow}` : 'none',
                }}
              >
                <div className="text-base">{m.emoji}</div>
                <div className="text-[10px] font-bold mt-0.5"
                  style={{ color: isActive ? 'rgba(255,210,225,0.9)' : 'rgba(255,255,255,0.4)' }}>
                  {m.label}
                </div>
                <div className="text-[9px] mt-0.5"
                  style={{ color: isActive ? 'rgba(255,160,185,0.7)' : 'rgba(255,255,255,0.25)' }}>
                  {catSeen}/{catCards.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
              animate={{ width: `${(totalSeen / cards.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: 'rgba(255,150,175,0.5)' }}>
              {totalSeen} of {cards.length} revealed
            </span>
            {allDone && (
              <span className="text-[10px] font-bold" style={{ color: 'rgba(255,180,200,0.8)' }}>
                All done {meta.emoji}
              </span>
            )}
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
                <div className="text-6xl">{meta.emoji}</div>
                <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,210,225,0.95)' }}>
                  You read them all
                </h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,150,175,0.6)' }}>
                  Every single one of those is true. I mean them all, for you.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, #c9245f, #ff4d8d)`,
                    boxShadow: '0 4px 20px rgba(201,36,95,0.4)',
                  }}
                >
                  <RefreshCw size={14} /> Read Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-stack`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full"
                style={{ height: 340 }}
              >
                {/* Back cards */}
                {unseen.slice(1, 3).map((card, i) => (
                  <div
                    key={card.id}
                    className="absolute inset-x-4 rounded-[26px]"
                    style={{
                      top: `${(i + 1) * 10}px`,
                      height: 260,
                      background: `rgba(255,77,141,${0.06 - i * 0.02})`,
                      border: `1px solid ${meta.border.replace('0.4', String(0.12 - i * 0.04))}`,
                      transform: `scale(${1 - (i + 1) * 0.04})`,
                      zIndex: 2 - i,
                    }}
                  />
                ))}

                {/* Top card */}
                <motion.div
                  key={topCard?.id}
                  className="absolute inset-x-4"
                  style={{ top: 0, height: 280, zIndex: 10 }}
                  animate={revealed ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 2.8, repeat: revealed ? 0 : Infinity, ease: 'easeInOut' }}
                >
                  <AnimatePresence mode="wait">
                    {!revealed ? (
                      <motion.div
                        key="front"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 rounded-[26px] flex flex-col items-center justify-center gap-4 cursor-pointer"
                        style={{
                          background: 'linear-gradient(160deg, #2d001a, #180010)',
                          border: `1px solid ${meta.border}`,
                          boxShadow: `0 8px 40px ${meta.glow}, inset 0 1px 0 rgba(255,180,210,0.1)`,
                        }}
                        onClick={handleReveal}
                      >
                        <div className="text-5xl">{meta.emoji}</div>
                        <p className="text-[14px] font-semibold" style={{ color: 'rgba(255,150,175,0.6)' }}>
                          Tap to read
                        </p>
                        <div
                          className="px-4 py-1.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: 'rgba(255,77,141,0.12)',
                            border: '1px solid rgba(255,77,141,0.22)',
                            color: 'rgba(255,150,175,0.65)',
                          }}
                        >
                          If we were together…
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-[26px] flex flex-col items-center justify-center gap-6 px-7 text-center"
                        style={{
                          background: 'linear-gradient(160deg, #3a0020, #200012)',
                          border: `1px solid ${meta.border}`,
                          boxShadow: `0 10px 48px ${meta.glow}`,
                        }}
                      >
                        <div className="text-2xl">{meta.emoji}</div>
                        <p
                          className="text-[18px] font-bold leading-snug"
                          style={{ color: 'rgba(255,228,235,0.96)' }}
                        >
                          {topCard?.text}
                        </p>
                        <button
                          onClick={handleNext}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-[12px] font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                            boxShadow: '0 4px 16px rgba(201,36,95,0.4)',
                          }}
                        >
                          Next <ChevronRight size={14} />
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

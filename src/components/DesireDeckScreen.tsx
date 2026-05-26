'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { DESIRE_CARDS, DesireCard } from '@/data/desireDeck';

type Category = 'tender' | 'bold' | 'daring';

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string; glow: string; border: string }> = {
  tender: {
    label: 'Tender',
    emoji: '🌹',
    color: 'from-rose-700 to-pink-800',
    glow: 'rgba(244,63,94,0.4)',
    border: 'rgba(244,114,182,0.4)',
  },
  bold: {
    label: 'Bold',
    emoji: '🔥',
    color: 'from-red-700 to-rose-900',
    glow: 'rgba(239,68,68,0.4)',
    border: 'rgba(248,113,113,0.4)',
  },
  daring: {
    label: 'Daring',
    emoji: '💋',
    color: 'from-pink-800 to-rose-950',
    glow: 'rgba(190,18,60,0.5)',
    border: 'rgba(251,113,133,0.4)',
  },
};

export default function DesireDeckScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [activeCategory, setActiveCategory] = useState<Category>('tender');
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const categoryCards = useMemo(
    () => DESIRE_CARDS.filter((c) => c.category === activeCategory),
    [activeCategory]
  );

  const unseenCards = categoryCards.filter((c) => !seenIds.includes(c.id));
  const topCard: DesireCard | undefined = unseenCards[0];
  const totalSeen = categoryCards.length - unseenCards.length;
  const allDone = unseenCards.length === 0;

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setFlipped(false);
    setCelebrating(false);
  };

  const handleFlip = () => {
    if (!topCard || flipped) return;
    setFlipped(true);
  };

  const handleNext = () => {
    if (!topCard) return;
    setSeenIds((prev) => [...prev, topCard.id]);
    setFlipped(false);
    if (unseenCards.length === 1) {
      setCelebrating(true);
    }
  };

  const handleReset = () => {
    setSeenIds((prev) => prev.filter((id) => !categoryCards.map((c) => c.id).includes(id)));
    setFlipped(false);
    setCelebrating(false);
  };

  const meta = CATEGORY_META[activeCategory];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0007 0%, #2d0010 40%, #1a0512 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(180,0,50,0.18) 0%, transparent 65%)`,
        }}
      />

      {/* Candlelight flicker particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 20}%`,
            background: `rgba(255,${100 + i * 20},50,0.4)`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
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
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,200,210,0.95)' }}>
              Desire Deck 🔥
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,150,170,0.5)' }}>
              Cards for two — be honest
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-4 pb-4">
          {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
            const m = CATEGORY_META[cat];
            const catCards = DESIRE_CARDS.filter((c) => c.category === cat);
            const catSeen = catCards.filter((c) => seenIds.includes(c.id)).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="flex-1 py-2 rounded-2xl text-center transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${m.glow.replace('0.4', '0.3')}, rgba(0,0,0,0.2))`
                    : 'rgba(255,255,255,0.05)',
                  border: isActive ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isActive ? `0 0 16px ${m.glow}` : 'none',
                }}
              >
                <div className="text-base">{m.emoji}</div>
                <div
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: isActive ? 'rgba(255,200,210,0.9)' : 'rgba(255,255,255,0.4)' }}
                >
                  {m.label}
                </div>
                <div
                  className="text-[9px] mt-0.5"
                  style={{ color: isActive ? 'rgba(255,150,170,0.7)' : 'rgba(255,255,255,0.25)' }}
                >
                  {catSeen}/{catCards.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,150,170,0.6)' }}>
              {totalSeen} / {categoryCards.length} explored
            </span>
            {allDone && (
              <span className="text-[10px] font-bold" style={{ color: 'rgba(255,180,190,0.8)' }}>
                All done 💋
              </span>
            )}
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #c9245f, #ff4d8d)` }}
              animate={{ width: `${(totalSeen / categoryCards.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Card Stack Area */}
        <div className="flex-1 flex items-center justify-center px-4 pb-6">
          <AnimatePresence mode="wait">
            {celebrating || allDone ? (
              <motion.div
                key="celebration"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5 text-center px-6"
              >
                <div className="text-6xl">💋</div>
                <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,200,210,0.95)' }}>
                  {`You've explored all cards tonight`}
                </h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,150,170,0.6)' }}>
                  Every question answered. Every desire heard. 🌹
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                    boxShadow: '0 4px 20px rgba(201,36,95,0.4)',
                  }}
                >
                  Play Again 🔥
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`stack-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full"
                style={{ height: 340 }}
              >
                {/* Back cards (depth illusion) */}
                {unseenCards.slice(1, 3).map((card, i) => (
                  <div
                    key={card.id}
                    className="absolute inset-x-4 rounded-[24px]"
                    style={{
                      top: `${(i + 1) * 10}px`,
                      height: 260,
                      background: `linear-gradient(160deg, rgba(180,0,50,${0.12 - i * 0.03}), rgba(100,0,30,${0.08 - i * 0.02}))`,
                      border: `1px solid rgba(244,114,182,${0.15 - i * 0.05})`,
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
                  animate={flipped ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: flipped ? 0 : Infinity, ease: 'easeInOut' }}
                >
                  {/* Card flip container */}
                  <motion.div
                    className="w-full h-full relative"
                    style={{ perspective: 1000 }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-[24px] flex flex-col items-center justify-center gap-4"
                      style={{
                        background: `linear-gradient(160deg, #3d0016, #1e000a)`,
                        border: `1px solid ${meta.border}`,
                        boxShadow: `0 8px 40px ${meta.glow}, inset 0 1px 0 rgba(255,180,210,0.12)`,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                      onClick={handleFlip}
                    >
                      <div className="text-5xl">{meta.emoji}</div>
                      <p className="text-[14px] font-semibold" style={{ color: 'rgba(255,150,170,0.6)' }}>
                        Tap to reveal
                      </p>
                      <div
                        className="px-4 py-1.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: 'rgba(255,77,141,0.15)',
                          border: '1px solid rgba(255,77,141,0.25)',
                          color: 'rgba(255,150,170,0.7)',
                        }}
                      >
                        {meta.label} card
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 rounded-[24px] flex flex-col items-center justify-center gap-5 px-6 text-center"
                      style={{
                        background: `linear-gradient(160deg, #4a0020, #200012)`,
                        border: `1px solid ${meta.border}`,
                        boxShadow: `0 8px 40px ${meta.glow}`,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="text-2xl">{meta.emoji}</div>
                      <p
                        className="text-[17px] font-bold leading-snug"
                        style={{ color: 'rgba(255,220,230,0.95)' }}
                      >
                        {topCard?.text}
                      </p>
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-[12px] font-bold text-white mt-2"
                        style={{
                          background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                          boxShadow: '0 4px 16px rgba(201,36,95,0.4)',
                        }}
                      >
                        Next Card 🔥 <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { PILLOW_QUESTIONS, PillowQuestion } from '@/data/pillowTalk';
import { notifyOwner } from '@/lib/notify';

type Depth = 'all' | 'soft' | 'deep' | 'raw';

const DEPTH_META: Record<Exclude<Depth, 'all'>, { label: string; emoji: string; color: string; glow: string }> = {
  soft: { label: 'Soft',  emoji: '🌙', color: 'rgba(99,102,241,0.25)',  glow: 'rgba(99,102,241,0.4)' },
  deep: { label: 'Deep',  emoji: '💫', color: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.45)' },
  raw:  { label: 'Raw',   emoji: '🔥', color: 'rgba(244,63,94,0.2)',   glow: 'rgba(244,63,94,0.4)'  },
};

export default function PillowTalkScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [filter, setFilter] = useState<Depth>('all');
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    notifyOwner(`🌙 <b>She opened Pillow Talk</b>\n\n<i>She is reading your late-night questions…</i>`);
  }, []);

  const filteredQuestions: PillowQuestion[] = useMemo(() => {
    if (filter === 'all') return PILLOW_QUESTIONS;
    return PILLOW_QUESTIONS.filter((q) => q.depth === filter);
  }, [filter]);

  const currentQ = filteredQuestions[currentIdx % filteredQuestions.length];

  // Word-by-word reveal
  const words = currentQ?.text.split(' ') ?? [];
  useEffect(() => {
    setWordIndex(0);
    if (!currentQ) return;
    const totalWords = words.length;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setWordIndex(i);
      if (i >= totalWords) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id]);

  const handleNext = () => {
    if (!currentQ) return;
    setSeenIds((prev) => (prev.includes(currentQ.id) ? prev : [...prev, currentQ.id]));
    setCurrentIdx((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleShuffle = () => {
    const rand = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentIdx(rand);
  };

  const handleFilterChange = (d: Depth) => {
    setFilter(d);
    setCurrentIdx(0);
  };

  const seenCount = seenIds.filter((id) =>
    filteredQuestions.some((q) => q.id === id)
  ).length;

  const depthEmoji = currentQ
    ? DEPTH_META[currentQ.depth as Exclude<Depth, 'all'>].emoji
    : '🌙';
  const depthLabel = currentQ
    ? DEPTH_META[currentQ.depth as Exclude<Depth, 'all'>].label
    : '';
  const depthGlow = currentQ
    ? DEPTH_META[currentQ.depth as Exclude<Depth, 'all'>].glow
    : 'rgba(99,102,241,0.4)';

  // Star positions (stable)
  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: (i * 137.5) % 100,
      y: (i * 89.3) % 100,
      size: 1 + (i % 3),
      delay: (i * 0.2) % 3,
    })),
  []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #02020f 0%, #070720 40%, #0d0520 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'rgba(200,200,255,0.5)',
          }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2 + s.delay, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* Moon glow */}
      <div
        className="fixed top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button
            onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(200,210,255,0.95)' }}>
              Pillow Talk 🌙
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(150,160,220,0.5)' }}>
              Late night questions — be real
            </p>
          </div>
          <button
            onClick={handleShuffle}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            <Shuffle size={15} className="text-indigo-300" />
          </button>
        </div>

        {/* Depth filter */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => handleFilterChange('all')}
            className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
            style={{
              background: filter === 'all' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
              border: filter === 'all' ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
              color: filter === 'all' ? 'rgba(200,190,255,0.9)' : 'rgba(255,255,255,0.4)',
            }}
          >
            All ✨
          </button>
          {(Object.keys(DEPTH_META) as Exclude<Depth, 'all'>[]).map((d) => {
            const m = DEPTH_META[d];
            return (
              <button
                key={d}
                onClick={() => handleFilterChange(d)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background: filter === d ? m.color : 'rgba(255,255,255,0.05)',
                  border: filter === d ? `1px solid ${m.glow}` : '1px solid rgba(255,255,255,0.07)',
                  color: filter === d ? 'rgba(200,210,255,0.9)' : 'rgba(255,255,255,0.4)',
                }}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'rgba(150,160,220,0.5)' }}>
            {seenCount} / {filteredQuestions.length} explored
          </span>
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
            style={{
              background: `rgba(${currentQ?.depth === 'soft' ? '99,102,241' : currentQ?.depth === 'deep' ? '139,92,246' : '244,63,94'},0.15)`,
              border: `1px solid ${depthGlow}`,
              color: 'rgba(200,210,255,0.7)',
            }}
          >
            {depthEmoji} {depthLabel}
          </div>
        </div>

        {/* Question card */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-[28px] p-7 flex flex-col gap-5"
              style={{
                background: 'linear-gradient(160deg, rgba(15,10,50,0.95), rgba(5,3,30,0.98))',
                border: `1px solid ${depthGlow.replace('0.4', '0.25')}`,
                boxShadow: `0 16px 60px ${depthGlow.replace('0.4', '0.2')}, inset 0 1px 0 rgba(200,200,255,0.08)`,
              }}
            >
              {/* Tag */}
              <div className="flex items-center gap-2">
                <div
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: 'rgba(165,180,252,0.7)',
                  }}
                >
                  {currentQ?.tag}
                </div>
              </div>

              {/* Word-by-word text */}
              <p className="text-[20px] font-black leading-snug" style={{ color: 'rgba(220,225,255,0.95)', minHeight: 100 }}>
                {words.map((word, i) => (
                  <motion.span
                    key={`${currentQ?.id}-${i}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: i < wordIndex ? 1 : 0, y: i < wordIndex ? 0 : 4 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block mr-1"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleShuffle}
              className="flex-1 py-3 rounded-2xl text-[12px] font-bold flex items-center justify-center gap-2"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: 'rgba(165,180,252,0.7)',
              }}
            >
              <Shuffle size={13} /> Shuffle
            </button>
            <button
              onClick={handleNext}
              className="flex-[2] py-3 rounded-2xl text-[13px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              }}
            >
              Next Question ✨
            </button>
          </div>
        </div>

        <div className="pb-8" />
      </div>
    </motion.div>
  );
}

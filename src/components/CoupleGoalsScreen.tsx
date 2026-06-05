'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { COUPLE_GOALS, CoupleGoal } from '@/data/coupleGoals';
import { notifyOwner } from '@/lib/notify';

type Category = CoupleGoal['category'];

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string; glow: string; border: string }> = {
  romance:   { label: 'Romance',   emoji: '💑', color: 'from-rose-500 to-pink-600',   glow: 'rgba(244,63,94,0.35)',  border: 'rgba(251,113,133,0.35)' },
  adventure: { label: 'Adventure', emoji: '🌍', color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.35)', border: 'rgba(251,191,36,0.35)'  },
  intimate:  { label: 'Intimate',  emoji: '🔥', color: 'from-orange-500 to-red-500',   glow: 'rgba(249,115,22,0.35)', border: 'rgba(251,146,60,0.35)'  },
  dreams:    { label: 'Dreams',    emoji: '✨', color: 'from-yellow-400 to-amber-500', glow: 'rgba(251,191,36,0.35)', border: 'rgba(252,211,77,0.35)'  },
};

const CATEGORIES: Category[] = ['romance', 'adventure', 'intimate', 'dreams'];

export default function CoupleGoalsScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const completedGoals = useGameStore((s) => s.completedGoals);
  const toggleGoalStore = useGameStore((s) => s.toggleGoal);
  const [activeCategory, setActiveCategory] = useState<Category>('romance');

  const toggleGoal = (id: number) => {
    const goal = COUPLE_GOALS.find((g) => g.id === id);
    const wasCompleted = completedGoals.includes(id);
    toggleGoalStore(id);
    if (!wasCompleted && goal) {
      notifyOwner(`✨ <b>She completed a Couple Goal!</b>\n\n${CATEGORY_META[goal.category].emoji} ${goal.text}\n\n<i>${completedGoals.length + 1} goals unlocked together</i>`);
    }
  };

  const categoryGoals = COUPLE_GOALS.filter((g) => g.category === activeCategory);
  const categoryCompleted = categoryGoals.filter((g) => completedGoals.includes(g.id)).length;
  const categoryPercent = Math.round((categoryCompleted / categoryGoals.length) * 100);

  const totalCompleted = completedGoals.length;
  const totalGoals = COUPLE_GOALS.length;
  const overallPercent = Math.round((totalCompleted / totalGoals) * 100);

  const meta = CATEGORY_META[activeCategory];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #130800 0%, #1f0f00 40%, #2a1200 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Warm ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.12) 0%, transparent 60%)`,
        }}
      />

      {/* Floating light specks */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            left: `${10 + i * 11}%`,
            top: `${5 + (i % 4) * 22}%`,
            background: `rgba(251,191,36,0.3)`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-2 sticky top-0 z-20"
          style={{ background: 'linear-gradient(to bottom, rgba(31,15,0,0.95), rgba(31,15,0,0))', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,220,150,0.95)' }}>
              Couple Goals ✨
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,180,80,0.5)' }}>
              {totalCompleted} / {totalGoals} goals unlocked together
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="px-4 pt-3 pb-4">
          <div className="rounded-[18px] p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 4px 20px rgba(245,158,11,0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold" style={{ color: 'rgba(251,191,36,0.8)' }}>
                Overall Progress
              </span>
              <span className="text-[13px] font-black" style={{ color: 'rgba(255,220,100,0.9)' }}>
                {overallPercent}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)' }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const m = CATEGORY_META[cat];
            const catGoals = COUPLE_GOALS.filter((g) => g.category === cat);
            const catDone = catGoals.filter((g) => completedGoals.includes(g.id)).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 flex flex-col items-center px-3 py-2 rounded-2xl transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${m.glow.replace('0.35', '0.2')}, rgba(0,0,0,0.1))`
                    : 'rgba(255,255,255,0.04)',
                  border: isActive ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isActive ? `0 0 16px ${m.glow}` : 'none',
                  minWidth: 70,
                }}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="text-[9px] font-bold mt-0.5"
                  style={{ color: isActive ? 'rgba(255,220,150,0.9)' : 'rgba(255,255,255,0.4)' }}
                >
                  {m.label}
                </span>
                <span className="text-[8px] mt-0.5"
                  style={{ color: isActive ? 'rgba(255,190,80,0.6)' : 'rgba(255,255,255,0.25)' }}
                >
                  {catDone}/{catGoals.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category progress */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,180,80,0.5)' }}>
              {meta.emoji} {meta.label} — {categoryCompleted}/{categoryGoals.length}
            </span>
            <span className="text-[10px] font-bold" style={{ color: 'rgba(251,191,36,0.7)' }}>
              {categoryPercent}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
              animate={{ width: `${categoryPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Goals list */}
        <div className="px-4 pb-10 flex flex-col gap-2.5">
          <AnimatePresence>
            {categoryGoals.map((goal, idx) => {
              const isDone = completedGoals.includes(goal.id);
              return (
                <motion.button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-3 p-3.5 rounded-[18px] text-left transition-all w-full"
                  style={{
                    background: isDone
                      ? `linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))`
                      : 'rgba(255,255,255,0.04)',
                    border: isDone
                      ? `1px solid rgba(245,158,11,0.25)`
                      : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isDone ? '0 2px 12px rgba(245,158,11,0.12)' : 'none',
                  }}
                >
                  {/* Checkbox */}
                  <motion.div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    animate={isDone ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: isDone
                        ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                        : 'rgba(255,255,255,0.07)',
                      border: isDone
                        ? '1px solid rgba(251,191,36,0.5)'
                        : '1px solid rgba(255,255,255,0.12)',
                      boxShadow: isDone ? '0 0 12px rgba(245,158,11,0.4)' : 'none',
                    }}
                  >
                    {isDone && <Check size={13} className="text-white" />}
                  </motion.div>

                  {/* Emoji */}
                  <span className="text-xl shrink-0">{goal.emoji}</span>

                  {/* Text */}
                  <span
                    className="text-[13px] font-semibold flex-1 leading-snug"
                    style={{
                      color: isDone ? 'rgba(251,191,36,0.7)' : 'rgba(255,220,150,0.85)',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {goal.text}
                    {isDone && <span className="ml-1.5">❤️</span>}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

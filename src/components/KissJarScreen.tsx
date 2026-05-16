'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, successVibe, heartbeat } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';
import { trackInteraction } from '@/lib/sessionTracker';
import { getCachedPresence } from '@/lib/presenceContext';

const JAR_GOAL = 100;

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function KissJarScreen() {
  const { setPhase, kissCount, addKiss, logActivity } = useGameStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);
  const [justHitMilestone, setJustHitMilestone] = useState(false);

  const fillPercent = Math.min(1, kissCount / JAR_GOAL);
  const fillPct = Math.round(fillPercent * 100);

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      softTap();
      addKiss(1);
      const newCount = kissCount + 1;

      // Spawn a floating heart particle at tap position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = particleId + 1;
      setParticleId(id);
      setParticles((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 1200);

      // Track every kiss for session intelligence
      trackInteraction('kiss');

      // Milestones
      if (newCount % 10 === 0) {
        successVibe();
        setJustHitMilestone(true);
        setTimeout(() => setJustHitMilestone(false), 1500);
        logActivity('kiss-jar', `${newCount} kisses sent!`);
        const ctx = getCachedPresence();
        const timeNote = ctx ? `\n🕒 ${ctx.moroccoTime} Morocco time` : '';
        notifyOwner(`💋 <b>Your angel just sent ${newCount} kisses!</b>${timeNote}\n\nThe Kiss Jar is now <b>${Math.round((newCount / JAR_GOAL) * 100)}%</b> full 💗`);
      }
    },
    [kissCount, addKiss, logActivity, particleId]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-rose-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Heart size={11} fill="currentColor" /> Kiss Jar
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-8">
        {/* Jar visual */}
        <div className="relative flex flex-col items-center">
          {/* Progress ring */}
          <svg className="w-48 h-48 -rotate-90 absolute inset-0" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle
              cx="96" cy="96" r="80"
              fill="none"
              stroke="url(#kissGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${fillPct * 5.024} 502.4`}
              initial={false}
              animate={{ strokeDasharray: `${fillPct * 5.024} 502.4` }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            />
            <defs>
              <linearGradient id="kissGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tap button */}
          <motion.button
            onClick={handleTap}
            className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
            whileTap={{ scale: 0.9 }}
            animate={justHitMilestone ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {/* Particles */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none z-20"
                  style={{ left: p.x, top: p.y }}
                  initial={{ opacity: 1, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -60, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                >
                  <Heart size={18} className="text-rose-400" fill="currentColor" />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Jar content */}
            <div className="flex flex-col items-center gap-1">
              <Heart
                size={52}
                className={`transition-colors duration-300 ${fillPercent >= 1 ? 'text-rose-400' : fillPercent > 0.4 ? 'text-rose-500/80' : 'text-rose-600/50'}`}
                fill="currentColor"
              />
              <motion.span
                className="text-4xl font-extrabold text-white tabular-nums"
                key={kissCount}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {kissCount}
              </motion.span>
              <span className="text-[11px] text-white/40 uppercase tracking-widest">kisses</span>
            </div>
          </motion.button>
        </div>

        {/* Subtitle */}
        <div className="text-center max-w-xs">
          <p className="text-white/50 text-sm font-medium">
            {kissCount === 0
              ? 'Tap to send me your first kiss'
              : kissCount < 10
              ? 'Keep going, every tap is a kiss sent with love'
              : kissCount < JAR_GOAL
              ? `${JAR_GOAL - kissCount} more to fill the jar completely`
              : 'The jar is overflowing with love'}
          </p>
        </div>

        {/* Fill bar */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Jar fill</span>
            <span className="text-[10px] text-rose-300 font-bold">{fillPct}%</span>
          </div>
          <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400"
              initial={false}
              animate={{ width: `${fillPct}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-white/20">0</span>
            <span className="text-[9px] text-white/20">{JAR_GOAL} kisses</span>
          </div>
        </div>

        {/* Milestone message */}
        <AnimatePresence>
          {justHitMilestone && (
            <motion.div
              className="glass-rose rounded-2xl px-6 py-3 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <Sparkles size={14} className="text-rose-300" />
              <span className="text-sm text-rose-200 font-semibold">
                {kissCount} kisses! You are adorable.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Heart, Plane, Unlock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat } from '@/lib/useHaptics';

// May 11, 2026 — target unlock date
const UNLOCK_DATE = new Date('2026-05-11T10:00:00+01:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, done: false };
  };
  const [countdown, setCountdown] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(id);
  });
  return countdown;
}

export default function MayVaultScreen() {
  const { setPhase } = useGameStore();
  const { days, hours, minutes, seconds, done } = useCountdown(UNLOCK_DATE);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-700/25 to-rose-700/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-gradient-to-t from-rose-600/20 to-transparent blur-[80px]" />
      </div>

      {/* Back button */}
      <div className="absolute top-10 left-5 z-20">
        <button
          onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} /> Map
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full gap-6">

        {/* Vault icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.15 }}
          onAnimationComplete={() => heartbeat()}
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-violet-700/50">
            <Lock size={48} className="text-white animate-heartbeat" />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-violet-400/25 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-3xl border border-violet-400/15 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.25em] mb-2">
            The May 11 Vault
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
            A Secret Waiting for You
          </h1>
          <p className="text-[14px] text-white/55 leading-relaxed">
            This vault holds a secret voice note from me.
            <br />It will only unlock the moment we meet in{' '}
            <span className="text-rose-400 font-semibold">Meknes</span>.
          </p>
        </motion.div>

        {/* Countdown */}
        {!done ? (
          <motion.div
            className="w-full glass-strong rounded-3xl p-5 ring-1 ring-violet-500/25"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <Plane size={12} className="text-rose-400" />
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                Unlocks in
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: days, label: 'Days' },
                { val: hours, label: 'Hours' },
                { val: minutes, label: 'Mins' },
                { val: seconds, label: 'Secs' },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <motion.div
                    key={val}
                    className="w-full py-2.5 rounded-xl bg-white/[0.07] border border-white/10"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="block text-center text-xl font-black text-white tabular-nums">
                      {String(val).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <span className="text-[9px] text-white/30 font-semibold uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="w-full glass-warm rounded-3xl p-6 ring-1 ring-rose-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
              The vault is open! <Unlock size={20} className="text-white" />
            </p>
            <p className="text-[13px] text-white/60">
              Today is our day. I love you.
            </p>
          </motion.div>
        )}

        {/* Romantic footer */}
        <motion.p
          className="text-[12px] text-white/25 italic flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Heart size={10} className="text-rose-400/50" fill="currentColor" />
          Made with love, for the day we finally meet
          <Heart size={10} className="text-rose-400/50" fill="currentColor" />
        </motion.p>

      </div>
    </motion.div>
  );
}

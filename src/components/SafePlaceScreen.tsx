'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Flame, CloudRain } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';
import { COMFORT_MESSAGES } from '@/lib/emotional/whispers';
import { playGlow, playHeartbeat } from '@/lib/sounds';
import { softTap, heartbeat } from '@/lib/useHaptics';

export default function SafePlaceScreen() {
  const { setPhase } = useGameStore();
  const enterComfort = useEmotionalEngine((s) => s.enterComfort);
  const exitComfort = useEmotionalEngine((s) => s.exitComfort);
  const [msgIdx, setMsgIdx] = useState(0);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    enterComfort();
    playGlow();
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % COMFORT_MESSAGES.length), 8000);
    return () => {
      clearInterval(id);
      exitComfort();
    };
  }, [enterComfort, exitComfort]);

  useEffect(() => {
    if (!holding) return;
    playHeartbeat();
    const id = setInterval(() => playHeartbeat(), 1200);
    return () => clearInterval(id);
  }, [holding]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.7 }}
    >
      {/* Rainy window */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(15,5,25,0.95) 0%, rgba(25,10,35,0.9) 50%, rgba(40,15,30,0.85) 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-px animate-rain-drop"
              style={{
                left: `${(i * 13) % 100}%`,
                height: `${14 + (i % 6) * 6}px`,
                background: 'linear-gradient(180deg, transparent, rgba(180,160,220,0.4), transparent)',
                animationDelay: `${(i % 10) * 0.12}s`,
              }}
            />
          ))}
        </div>
        {/* Warm candle glows */}
        {[20, 75].map((left, i) => (
          <div
            key={i}
            className="absolute bottom-[28%] w-32 h-32 rounded-full animate-glow-breathe"
            style={{
              left: `${left}%`,
              transform: 'translateX(-50%)',
              background: `radial-gradient(circle, rgba(255,${140 + i * 20},${80 + i * 30},0.2) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
        <button
          type="button"
          onClick={() => { softTap(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Universe
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-rose-300/70 uppercase tracking-widest font-bold">
          <CloudRain size={12} />
          Our Safe Place
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-sm"
        >
          <div className="flex justify-center gap-3 mb-6">
            <Flame size={20} className="text-amber-400/80 animate-glow-breathe" />
            <Flame size={16} className="text-rose-400/60 animate-glow-breathe" style={{ animationDelay: '0.5s' }} />
            <Flame size={20} className="text-amber-400/80 animate-glow-breathe" style={{ animationDelay: '1s' }} />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">Our Safe Place</h1>
          <motion.p
            key={msgIdx}
            className="text-[14px] italic leading-relaxed"
            style={{ color: 'rgba(255,200,210,0.75)' }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
          >
            {COMFORT_MESSAGES[msgIdx]}
          </motion.p>
        </motion.div>

        <motion.div
          className="glass-warm rounded-3xl p-6 w-full max-w-xs text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-white/50 mb-4">Hold the heart — feel us breathing together</p>
          <motion.div
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: holding
                ? 'linear-gradient(135deg, #FF4D8D, #C9245F)'
                : 'rgba(255,77,141,0.15)',
              border: '1px solid rgba(255,77,141,0.35)',
              boxShadow: holding ? '0 0 48px rgba(255,77,141,0.45)' : 'none',
            }}
            onPointerDown={() => { setHolding(true); heartbeat(); }}
            onPointerUp={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            animate={holding ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: holding ? Infinity : 0 }}
          >
            <Heart size={40} fill={holding ? 'white' : 'none'} className={holding ? 'text-white' : 'text-rose-400/60'} />
          </motion.div>
        </motion.div>

        <p className="text-[10px] text-white/25 italic text-center">
          Rain on the window · soft light · only us
        </p>
      </div>
    </motion.div>
  );
}

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.abs(Math.sin(i * 9301 + 49297) * 233280) % 100,
  y: Math.abs(Math.sin(i * 7411 + 12345) * 233280) % 100,
  size: 2 + (Math.abs(Math.sin(i * 3141)) % 1) * 3,
  dur: 4 + (i % 5) * 1.2,
  delay: (i % 7) * 0.6,
}));

export default function InsideHisHeartScreen() {
  const setPhase = useGameStore(s => s.setPhase);

  useEffect(() => {
    notifyOwner(`💜 <b>She opened "Inside His Heart"</b>\n\n<i>She is waiting for your words with love…</i>`);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Deep violet ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.22) 0%, rgba(79,70,229,0.10) 45%, transparent 75%)',
        }}
      />

      {/* Floating dust dots */}
      {DOTS.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: 'rgba(167,139,250,0.55)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Back button */}
      <motion.button
        className="absolute top-6 left-5 flex items-center gap-1.5 text-violet-300/70 text-sm"
        onClick={() => setPhase('home')}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        back
      </motion.button>

      {/* Card */}
      <motion.div
        className="relative mx-5 max-w-sm w-full rounded-[32px] overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'linear-gradient(145deg, rgba(30,18,60,0.92) 0%, rgba(45,20,80,0.88) 50%, rgba(20,15,50,0.92) 100%)',
          boxShadow:
            '0 0 0 1px rgba(139,92,246,0.18), 0 30px 80px rgba(79,38,180,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }}
        />

        <div className="px-8 py-10 flex flex-col items-center text-center gap-6">

          {/* Pulsing heart icon */}
          <motion.div
            className="relative flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(79,38,180,0.35))',
              boxShadow: '0 0 30px rgba(139,92,246,0.3)',
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1.5px solid rgba(167,139,250,0.35)' }}
              animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <span style={{ fontSize: 36 }}>💜</span>
          </motion.div>

          {/* Title */}
          <div>
            <p className="text-violet-400/70 text-xs tracking-[0.2em] uppercase mb-2 font-light">
              coming soon
            </p>
            <h1
              className="text-white font-semibold text-2xl leading-snug"
              style={{ textShadow: '0 0 30px rgba(167,139,250,0.4)' }}
            >
              Inside His Heart
            </h1>
          </div>

          {/* Divider */}
          <div
            className="w-12 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)' }}
          />

          {/* Message */}
          <div className="flex flex-col gap-3">
            <p className="text-violet-200/90 text-[15px] leading-relaxed font-light">
              Your man is still thinking…
            </p>
            <p className="text-violet-300/70 text-[13.5px] leading-relaxed">
              He's carefully choosing every word, every answer — making sure everything he writes is true, honest, and just for you.
            </p>
            <p className="text-violet-200/80 text-[13.5px] leading-relaxed">
              His answers will appear here soon. 🌙
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center gap-2 pt-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Bottom label */}
          <p
            className="text-violet-500/50 text-[11px] tracking-widest uppercase"
          >
            a cinematic experience
          </p>

        </div>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)' }}
        />
      </motion.div>
    </motion.div>
  );
}

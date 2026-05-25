"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Play, RotateCcw, Lock, Star } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { playWhoosh, playBloom } from "@/lib/sounds";

const pr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

const ORBS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: pr(i) * 100,
  y: pr(i + 6) * 100,
  size: 180 + pr(i + 12) * 220,
  delay: pr(i + 18) * 4,
  dur: 8 + pr(i + 24) * 6,
  color: i % 2 === 0
    ? `rgba(255,77,141,${0.06 + pr(i + 30) * 0.08})`
    : `rgba(123,92,255,${0.05 + pr(i + 36) * 0.07})`,
}));

const TWINKLE = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: pr(i + 100) * 100,
  y: pr(i + 200) * 100,
  delay: pr(i + 300) * 5,
  size: 1.5 + pr(i + 400) * 2.5,
  dur: 2.5 + pr(i + 500) * 3,
}));

const FLOATERS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: pr(i + 600) * 100,
  delay: pr(i + 620) * 8,
  dur: 8 + pr(i + 640) * 7,
  size: 6 + pr(i + 660) * 14,
  opacity: 0.07 + pr(i + 680) * 0.18,
  isStar: i % 4 === 0,
}));

export default function WelcomeScreen() {
  const { setPhase, isReturningUser } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [heartPressed, setHeartPressed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6 }}
    >
      {/* -- Ambient orb glows -- */}
      {mounted && ORBS.map(o => (
        <motion.div
          key={o.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${o.x}%`, top: `${o.y}%`,
            width: o.size, height: o.size,
            background: `radial-gradient(ellipse, ${o.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* -- Star field -- */}
      {mounted && TWINKLE.map(s => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute pointer-events-none rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* -- Floating hearts + stars -- */}
      {mounted && FLOATERS.map(p => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            color: p.isStar
              ? `rgba(255,211,110,${p.opacity + 0.1})`
              : `rgba(255,77,141,${p.opacity})`,
          }}
          initial={{ y: '110dvh', opacity: 0 }}
          animate={{ y: '-10dvh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {p.isStar ? '?' : '?'}
        </motion.div>
      ))}

      {/* -- Main card -- */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[390px] w-full">

        {/* Hero Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 130, damping: 12, delay: 0.15 }}
        >
          {/* Orbit rings */}
          <div className="absolute -inset-8 rounded-full border border-dashed animate-[spin_30s_linear_infinite]"
            style={{ borderColor: 'rgba(255,77,141,0.1)' }} />
          <div className="absolute -inset-4 rounded-full border"
            style={{ borderColor: 'rgba(255,77,141,0.07)' }} />

          {/* Main orb */}
          <motion.div
            className="w-[116px] h-[116px] rounded-full flex items-center justify-center relative z-10"
            style={{
              background: 'linear-gradient(135deg, #FF4D8D 0%, #D9266B 50%, #B01A55 100%)',
              boxShadow: '0 0 0 1px rgba(255,77,141,0.3), 0 0 70px rgba(255,77,141,0.55), 0 0 130px rgba(255,77,141,0.22), 0 20px 50px rgba(0,0,0,0.5)',
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            onTapStart={() => setHeartPressed(true)}
            onTap={() => setTimeout(() => setHeartPressed(false), 600)}
          >
            <Heart size={50} className="text-white animate-heartbeat drop-shadow-lg" fill="white" />
          </motion.div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ border: '2px solid rgba(255,77,141,0.35)' }} />
          <div className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ border: '1px solid rgba(167,139,250,0.22)', animationDelay: '0.9s' }} />

          {/* Sparkle accents */}
          <motion.div className="absolute -top-4 -right-1 z-20"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.4, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            <Sparkles size={24} style={{ color: '#FFD36E', filter: 'drop-shadow(0 0 8px rgba(255,211,110,0.9))' }} />
          </motion.div>
          <motion.div className="absolute -bottom-1 -left-3 z-20"
            animate={{ scale: [1, 1.5, 1], rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
            <Star size={17} style={{ color: '#FFB3C7', filter: 'drop-shadow(0 0 6px rgba(255,179,199,0.8))' }} fill="currentColor" />
          </motion.div>
          <motion.div className="absolute top-3 -left-5 z-20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}>
            <Heart size={11} style={{ color: '#A78BFA' }} fill="currentColor" />
          </motion.div>

          {/* Tap burst */}
          <AnimatePresence>
            {heartPressed && (
              <motion.div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: i % 2 === 0 ? '#FF4D8D' : '#FFD36E' }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((i / 8) * Math.PI * 2) * 65,
                      y: Math.sin((i / 8) * Math.PI * 2) * 65,
                      scale: 0, opacity: 0,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-[44px] sm:text-[52px] font-black mb-2 leading-tight tracking-tight"
          style={{
            backgroundImage: 'linear-gradient(135deg, #FFB3C7 0%, #FF7AA2 40%, #FFD36E 75%, #FFB3C7 100%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 100%', animation: 'gradient-x 5s ease infinite',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          Hello my love{' '}
          <motion.span className="inline-block"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            ?
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[17px] font-medium mb-1"
          style={{ color: 'rgba(255,230,242,0.75)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          I made this just for you
        </motion.p>
        <motion.p
          className="text-[13px] mb-7 italic"
          style={{ color: 'rgba(255,179,199,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          Because you deserve more than just a text ?
        </motion.p>

        {/* Love letter card */}
        <motion.div
          className="w-full rounded-[26px] overflow-hidden mb-6 text-start glass-cinema"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.55 }}
        >
          <div className="h-[3px] w-full" style={{
            background: 'linear-gradient(90deg, #FF4D8D, #A78BFA, #FFB84D, #FF4D8D)',
            backgroundSize: '200% 100%', animation: 'gradient-x 4s linear infinite',
          }} />
          <div className="p-5">
            <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: 'rgba(255,230,242,0.78)' }}>
              I built this thinking of you every single day. We finally met — and now the distance feels different. Harder and sweeter at the same time.
            </p>
            <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: 'rgba(255,230,242,0.78)' }}>
              70 questions. 7 chapters. Some are fun, some go deep. Let me understand you completely — because{' '}
              <span className="font-semibold" style={{ color: '#FF7AA2' }}>the distance is nothing</span> compared to what we have.
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-2">
              <Heart size={9} style={{ color: 'rgba(255,184,77,0.7)' }} fill="currentColor" />
              <p className="text-[11px] italic" style={{ color: 'rgba(255,179,199,0.5)' }}>
                From your love, with everything ??
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {[
            {
              icon: <RotateCcw size={11} style={{ color: '#FFB84D' }} />,
              label: '3 Reverse Cards', desc: 'Skip for later',
              style: { background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.2)' },
            },
            {
              icon: <Heart size={11} style={{ color: '#FF7AA2' }} fill="currentColor" />,
              label: 'Love Meter', desc: 'Watch it glow',
              style: { background: 'rgba(255,77,141,0.1)', border: '1px solid rgba(255,77,141,0.22)' },
            },
            {
              icon: <Lock size={11} style={{ color: '#A78BFA' }} />,
              label: 'Time Capsule', desc: 'Secrets for later',
              style: { background: 'rgba(123,92,255,0.1)', border: '1px solid rgba(123,92,255,0.22)' },
            },
          ].map(f => (
            <div
              key={f.label}
              className="rounded-[14px] px-3 py-2 text-center flex-1 min-w-[90px] backdrop-blur-xl"
              style={f.style}
            >
              <div className="text-[11px] font-semibold flex items-center justify-center gap-1" style={{ color: 'rgba(255,240,248,0.85)' }}>
                {f.icon} {f.label}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,230,242,0.38)' }}>{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => { playWhoosh(); playBloom(); setPhase('home'); }}
          className="w-full relative px-8 py-[18px] rounded-[22px] text-white font-black text-[16px] transition-transform duration-150 cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FF4D8D 0%, #D9266B 55%, #B01A55 100%)',
            boxShadow: '0 0 0 1px rgba(255,77,141,0.4), 0 8px 40px rgba(255,77,141,0.45), 0 2px 10px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          
        >
          <motion.div
            className="absolute inset-0 w-1/3 h-full bg-white/20 -skew-x-12 pointer-events-none"
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <Play size={15} fill="currentColor" />
            {mounted && isReturningUser ? 'Back to Our World' : 'Enter Our Universe'}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={17} />
            </motion.div>
          </span>
        </motion.button>

        <motion.p
          className="mt-4 text-[10px] italic"
          style={{ color: 'rgba(255,179,199,0.28)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ? A private universe made only for you ?
        </motion.p>
      </div>
    </motion.div>
  );
}

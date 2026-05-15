"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Thermometer,
  Lock,
  Star,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";

// Deterministic pseudo-random for hydration matching
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const floatingParticles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: pseudoRandom(i) * 100,
  delay: pseudoRandom(i + 22) * 7,
  duration: 7 + pseudoRandom(i + 44) * 6,
  size: 5 + pseudoRandom(i + 66) * 14,
  opacity: 0.08 + pseudoRandom(i + 88) * 0.2,
  isStar: i % 5 === 0,
}));

const twinkleStars = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: pseudoRandom(i + 100) * 100,
  y: pseudoRandom(i + 200) * 100,
  delay: pseudoRandom(i + 300) * 5,
  size: 1.5 + pseudoRandom(i + 400) * 2.5,
  duration: 2.5 + pseudoRandom(i + 500) * 3,
}));

export default function WelcomeScreen() {
  const { setPhase, isReturningUser } = useGameStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Extra ambient layers specific to this screen ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep center bloom */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.14) 0%, transparent 65%)', filter: 'blur(70px)' }} />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(180,40,80,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        {/* Top-left accent */}
        <div className="absolute -top-20 -left-20 w-[350px] h-[350px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(60px)' }} />
      </div>

      {/* ── Twinkling star field ── */}
      {isMounted && twinkleStars.map((s) => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute pointer-events-none rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Floating Hearts & Stars ── */}
      {isMounted && floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            color: p.isStar
              ? `rgba(232, 184, 109, ${p.opacity + 0.12})`
              : `rgba(244, 63, 94, ${p.opacity})`,
          }}
          initial={{ y: "110dvh", opacity: 0 }}
          animate={{ y: "-10dvh", opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.isStar
            ? <Star size={p.size} fill="currentColor" />
            : <Heart size={p.size} fill="currentColor" />
          }
        </motion.div>
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[380px] w-full">

        {/* ── Hero Icon ── */}
        <motion.div
          className="relative mb-9"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 13, delay: 0.15 }}
        >
          {/* Outer dashed orbit ring */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-rose-400/12 animate-[spin_25s_linear_infinite]" />
          {/* Secondary orbit ring */}
          <div className="absolute -inset-3 rounded-full border border-rose-400/08" />

          {/* Main icon container */}
          <motion.div
            className="w-[108px] h-[108px] rounded-full flex items-center justify-center relative z-10"
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)',
              boxShadow: '0 0 0 1px rgba(244,63,94,0.3), 0 0 60px rgba(244,63,94,0.5), 0 0 120px rgba(244,63,94,0.2), 0 20px 40px rgba(0,0,0,0.4)',
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart size={46} className="text-white animate-heartbeat drop-shadow-lg" fill="white" />
          </motion.div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/35 animate-pulse-ring z-0" />
          <div className="absolute inset-0 rounded-full border border-pink-400/20 animate-pulse-ring z-0" style={{ animationDelay: "0.8s" }} />

          {/* Floating sparkles */}
          <motion.div
            className="absolute -top-3 -right-1 z-20"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.35, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={22} className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2 z-20"
            animate={{ scale: [1, 1.5, 1], rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Star size={16} className="text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute top-2 -left-4 z-20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          >
            <Heart size={10} className="text-pink-300" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* ── Title ── */}
        <motion.h1
          className="text-[42px] sm:text-[50px] font-black mb-1.5 leading-tight tracking-tight text-gradient"
          style={{ backgroundImage: 'linear-gradient(135deg, #fda4af 0%, #fcd34d 45%, #fda4af 100%)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <span className="flex items-center justify-center gap-2 flex-wrap">
            Hello my love
            <Heart size={28} className="text-rose-400 shrink-0 animate-heartbeat" fill="currentColor" />
          </span>
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          className="text-[17px] text-white/70 font-medium mb-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          I made this just for you
        </motion.p>
        <motion.p
          className="text-[13px] mb-7 italic"
          style={{ color: 'rgba(253, 164, 175, 0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          Because you deserve more than just a text
        </motion.p>

        {/* ── Love letter card ── */}
        <motion.div
          className="w-full rounded-[24px] overflow-hidden mb-6 text-start"
          style={{
            background: 'rgba(244, 63, 94, 0.09)',
            backdropFilter: 'blur(40px) saturate(160%)',
            WebkitBackdropFilter: 'blur(40px) saturate(160%)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            boxShadow: '0 8px 48px rgba(244, 63, 94, 0.2), inset 0 1px 0 rgba(255, 180, 195, 0.14)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.55 }}
        >
          {/* Colored top strip */}
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #f43f5e, #e8b86d, #f43f5e)' }} />
          <div className="p-5">
            <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: 'rgba(255,235,240,0.78)' }}>
              I made this for you — and now that we have finally met, I want to understand you even deeper. Your thoughts, your dreams, every part of your heart.
            </p>
            <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: 'rgba(255,235,240,0.78)' }}>
              60 questions. 6 chapters. Some are fun, some go deep. Answer honestly — there are no wrong answers, only{' '}
              <span className="font-semibold" style={{ color: '#fda4af' }}>real ones</span>.
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-2">
              <Heart size={9} className="text-rose-400/70" fill="currentColor" />
              <p className="text-[11px] italic" style={{ color: 'rgba(253, 164, 175, 0.55)' }}>
                From the one who finally got to see your smile
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Feature pills ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {[
            {
              icon: <RotateCcw size={11} className="text-amber-300" />,
              label: "3 Reverse Cards",
              desc: "Skip for later",
              style: { background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.22)' },
            },
            {
              icon: <Thermometer size={11} className="text-rose-400" />,
              label: "Vibe Meter",
              desc: "Watch it heat up",
              style: { background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.22)' },
            },
            {
              icon: <Lock size={11} className="text-violet-400" />,
              label: "Time Capsule",
              desc: "Secrets for later",
              style: { background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.22)' },
            },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-[14px] px-3 py-2 text-center flex-1 min-w-[90px] backdrop-blur-xl"
              style={f.style}
            >
              <div className="text-[11px] font-semibold flex items-center justify-center gap-1" style={{ color: 'rgba(255,240,245,0.85)' }}>
                {f.icon}
                {f.label}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,240,245,0.38)' }}>{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* ── CTA Button ── */}
        <motion.button
          onClick={() => setPhase("home")}
          className="group w-full relative px-8 py-[18px] rounded-2xl text-white font-black text-[16px] active:scale-[0.97] transition-transform duration-150 cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 60%, #c2184b 100%)',
            boxShadow: '0 0 0 1px rgba(244,63,94,0.45), 0 8px 36px rgba(244,63,94,0.42), 0 2px 10px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 w-1/3 h-full bg-white/20 -skew-x-12 pointer-events-none"
            initial={{ x: "-150%" }}
            animate={{ x: "350%" }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <Play size={15} fill="currentColor" />
            {(isMounted && isReturningUser) ? "Back to Home" : "Begin Our Story"}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={17} />
            </motion.div>
          </span>
        </motion.button>

      </div>
    </motion.div>
  );
}

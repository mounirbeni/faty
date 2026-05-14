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

const floatingParticles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: pseudoRandom(i) * 100,
  delay: pseudoRandom(i + 18) * 6,
  duration: 6 + pseudoRandom(i + 36) * 5,
  size: 6 + pseudoRandom(i + 54) * 16,
  opacity: 0.1 + pseudoRandom(i + 72) * 0.22,
  isStar: i % 4 === 0,
}));

const twinkleStars = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: pseudoRandom(i + 100) * 100,
  y: pseudoRandom(i + 200) * 100,
  delay: pseudoRandom(i + 300) * 4,
  size: 2 + pseudoRandom(i + 400) * 3,
  duration: 2 + pseudoRandom(i + 500) * 2.5,
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
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-rose-600/25 via-pink-500/12 to-transparent blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-violet-600/18 to-transparent blur-[110px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-rose-500/12 to-transparent blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-gradient-to-t from-pink-600/10 to-transparent blur-[80px] pointer-events-none" />

      {/* Twinkling star field */}
      {isMounted && twinkleStars.map((s) => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute pointer-events-none rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Hearts & Stars */}
      {isMounted && floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            color: p.isStar ? `rgba(251, 191, 36, ${p.opacity + 0.1})` : `rgba(244, 63, 94, ${p.opacity})`,
          }}
          initial={{ y: "110dvh", opacity: 0 }}
          animate={{
            y: "-10dvh",
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.isStar
            ? <Star size={p.size} fill="currentColor" />
            : <Heart size={p.size} fill="currentColor" />
          }
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Hero Icon */}
        <motion.div
          className="relative mb-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
        >
          {/* Outer decorative ring */}
          <div className="absolute -inset-5 rounded-full border border-dashed border-rose-400/15 animate-[spin_20s_linear_infinite]" />
          {/* Secondary ring */}
          <div className="absolute -inset-2.5 rounded-full border border-rose-400/10" />

          <motion.div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl relative z-10"
            style={{ boxShadow: "0 0 60px rgba(244,63,94,0.4), 0 0 120px rgba(244,63,94,0.15), 0 20px 40px rgba(0,0,0,0.3)" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart size={48} className="text-white animate-heartbeat" fill="white" />
          </motion.div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/30 animate-pulse-ring z-0" />
          <div className="absolute inset-0 rounded-full border border-pink-400/20 animate-pulse-ring z-0" style={{ animationDelay: "0.7s" }} />

          {/* Floating sparkles */}
          <motion.div
            className="absolute -top-4 -right-2 z-20"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={24} className="text-amber-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-3 z-20"
            animate={{ scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Star size={18} className="text-amber-300" fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute top-1 -left-5 z-20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Heart size={12} className="text-pink-300" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Personal greeting */}
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-2 leading-tight bg-gradient-to-r from-rose-300 via-pink-200 to-red-300 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="flex items-center justify-center gap-2 flex-wrap">
            Hello my love
            <Heart size={28} className="text-rose-400 shrink-0 animate-heartbeat" fill="currentColor" />
          </span>
        </motion.h1>

        {/* Love message */}
        <motion.p
          className="text-lg text-white/75 font-medium mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          I made this just for you
        </motion.p>

        {/* Romantic subtext */}
        <motion.p
          className="text-sm text-rose-300/60 italic mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Because you deserve more than just a text
        </motion.p>

        {/* Love letter card */}
        <motion.div
          className="w-full glass-rose rounded-3xl overflow-hidden mb-6 text-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500" />
          <div className="p-5">
            <p className="text-[14px] text-white/75 leading-relaxed mb-3">
              I know we haven&apos;t met yet, but you already mean the world to me. This little game is my way of understanding you deeper — your thoughts, your dreams, your heart.
            </p>
            <p className="text-[14px] text-white/75 leading-relaxed mb-3">
              60 questions. 6 chapters that go from fun to intimate. Answer honestly — there are no wrong answers, only <span className="text-rose-300 font-semibold">real ones</span>.
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-2">
              <Heart size={10} className="text-rose-400/70" fill="currentColor" />
              <p className="text-xs text-white/40 italic">
                From someone who can&apos;t wait to see your smile
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {[
            {
              icon: <RotateCcw size={12} className="text-amber-400" />,
              label: "3 Reverse Cards",
              desc: "Skip for later",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              icon: <Thermometer size={12} className="text-rose-400" />,
              label: "Vibe Meter",
              desc: "Watch it heat up",
              bg: "bg-rose-500/10 border-rose-500/20",
            },
            {
              icon: <Lock size={12} className="text-violet-400" />,
              label: "Time Capsule",
              desc: "Secrets for later",
              bg: "bg-violet-500/10 border-violet-500/20",
            },
          ].map((f) => (
            <div
              key={f.label}
              className={`rounded-xl px-3 py-2 text-center flex-1 min-w-[90px] border backdrop-blur-xl ${f.bg}`}
            >
              <div className="text-[11px] font-semibold text-white/85 flex items-center justify-center gap-1">
                {f.icon}
                {f.label}
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.button
          onClick={() => setPhase("home")}
          className="group w-full relative px-8 py-4 rounded-2xl text-white font-bold text-[16px] active:scale-95 transition-transform duration-200 cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #f43f5e 100%)",
            backgroundSize: "200% 200%",
            boxShadow: "0 0 0 1px rgba(244,63,94,0.4), 0 8px 32px rgba(244,63,94,0.35), 0 2px 8px rgba(0,0,0,0.3)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 w-1/3 h-full bg-white/20 -skew-x-12 pointer-events-none"
            initial={{ x: "-150%" }}
            animate={{ x: "350%" }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Play size={16} fill="currentColor" />
            {(isMounted && isReturningUser) ? "Back to Home" : "Begin Our Story"}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

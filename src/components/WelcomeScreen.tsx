"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  ArrowLeft,
  Play,
  RotateCcw,
  Thermometer,
  Lock,
} from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const floatingParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 4,
  size: 8 + Math.random() * 14,
  opacity: 0.15 + Math.random() * 0.25,
}));

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      className="relative min-h-dvh flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-600/20 via-pink-500/10 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-600/15 to-transparent blur-[80px] pointer-events-none" />

      {/* Floating Hearts */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            color: `rgba(244, 63, 94, ${p.opacity})`,
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Heart size={p.size} fill="currentColor" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Icon */}
        <motion.div
          className="relative mb-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-float">
            <Heart size={44} className="text-white" fill="white" />
          </div>
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={22} className="text-amber-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -right-3"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Heart size={16} className="text-pink-400" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="flex items-center justify-center gap-3">
            Hey Faty
            <Heart size={36} className="text-rose-400 shrink-0" fill="currentColor" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-white/70 font-medium mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          I made something special for us
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base text-white/45 leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          50 questions. 5 levels. From icebreakers to the things that really
          matter. Answer honestly — there are no wrong answers, only{" "}
          <span className="text-rose-400 font-semibold">real ones</span>.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {[
            {
              icon: <RotateCcw size={13} className="text-amber-400" />,
              label: "3 Reverse Cards",
              desc: "Skip & tag for later",
            },
            {
              icon: <Thermometer size={13} className="text-rose-400" />,
              label: "Vibe Meter",
              desc: "Watch it heat up",
            },
            {
              icon: <Lock size={13} className="text-red-400" />,
              label: "Time Capsule",
              desc: "Secrets for when we meet",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="glass rounded-xl px-3 py-2 text-center"
            >
              <div className="text-xs font-semibold text-white/80 flex items-center justify-center gap-1.5">
                {f.icon}
                {f.label}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          className="group relative px-10 py-4 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-rose-600/30 hover:shadow-rose-500/50 transition-shadow duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="flex items-center gap-2">
            <Play size={20} fill="currentColor" />
            Start the Journey
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </span>
        </motion.button>

        {/* Footer */}
        <motion.p
          className="mt-8 text-xs text-white/25 flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          50 questions
          <span className="text-white/15">·</span>
          ~15 minutes
          <span className="text-white/15">·</span>
          <Heart size={10} className="text-rose-400/50" fill="currentColor" />
          lots of love
        </motion.p>
      </div>
    </motion.div>
  );
}

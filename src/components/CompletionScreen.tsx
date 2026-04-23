"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  PartyPopper,
  Plane,
  Sparkles,
  Lock,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Answer } from "@/lib/questions";

interface CompletionScreenProps {
  answers: Answer[];
}

export default function CompletionScreen({ answers }: CompletionScreenProps) {
  const hasLaunched = useRef(false);

  const answeredCount = answers.filter((a) => !a.reversed && a.value).length;
  const reversedCount = answers.filter((a) => a.reversed).length;
  const capsuleCount = answers.filter(
    (a) => !a.reversed && a.value && a.questionId > 40
  ).length;

  useEffect(() => {
    if (hasLaunched.current) return;
    hasLaunched.current = true;

    const duration = 3500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fb7185", "#f43f5e", "#e879f9", "#fbbf24", "#f472b6"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fb7185", "#f43f5e", "#e879f9", "#fbbf24", "#f472b6"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#f43f5e", "#e879f9", "#fbbf24", "#f472b6"],
      });
    }, 600);
  }, []);

  return (
    <motion.div
      className="relative min-h-dvh flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-600/25 via-pink-500/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-amber-500/15 to-transparent blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Celebration icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-float">
            <PartyPopper size={48} className="text-white" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={24} className="text-amber-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <Heart size={18} className="text-rose-400" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          You&rsquo;re amazing, Faty!
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-lg text-white/60 font-medium mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Thank you for playing this with me
        </motion.p>

        <motion.p
          className="text-base text-white/40 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Every answer you gave makes me even more excited to finally see you,
          hear your laugh, and share real moments together. Next month
          can&rsquo;t come soon enough.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="w-full grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart size={18} className="text-rose-400" fill="currentColor" />
            </div>
            <div className="text-2xl font-bold text-white">{answeredCount}</div>
            <div className="text-[11px] text-white/40 mt-1">Answered</div>
          </div>
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <RotateCcw size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{reversedCount}</div>
            <div className="text-[11px] text-white/40 mt-1">Reversed</div>
          </div>
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Lock size={18} className="text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">{capsuleCount}</div>
            <div className="text-[11px] text-white/40 mt-1">Locked</div>
          </div>
        </motion.div>

        {/* Countdown card */}
        <motion.div
          className="w-full glass-strong rounded-3xl p-6 mb-8 ring-1 ring-rose-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Plane size={18} className="text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Countdown to Us
            </span>
          </div>
          <p className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
            See you next month!
            <Plane size={18} className="text-white/60" />
          </p>
          <p className="text-sm text-white/35">
            Our first chapter together starts soon…
          </p>
        </motion.div>

        {/* Restart */}
        <motion.button
          onClick={() => window.location.reload()}
          className="px-8 py-3 glass rounded-2xl text-sm font-semibold text-rose-400 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCw size={14} />
          Play again
        </motion.button>
      </div>
    </motion.div>
  );
}

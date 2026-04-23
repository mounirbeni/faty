"use client";

import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { levels, levelIntros } from "@/lib/questions";
import IconFromName from "./IconFromName";

interface LevelIntroProps {
  level: number;
  onContinue: () => void;
}

export default function LevelIntro({ level, onContinue }: LevelIntroProps) {
  const meta = levels[level - 1];
  const intro = levelIntros[level];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ background: meta.accentHex }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      >
        {/* Level icon orb */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
        >
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${meta.colorFrom} ${meta.colorTo} flex items-center justify-center shadow-2xl`}
            style={{ boxShadow: `0 0 60px ${meta.accentHex}40` }}
          >
            <IconFromName name={meta.icon} size={32} className="text-white" />
          </div>
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ border: `2px solid ${meta.accentHex}` }}
          />
        </motion.div>

        {/* Chapter title */}
        <motion.p
          className="text-sm font-bold uppercase tracking-[0.25em] text-white/40 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {intro.title}
        </motion.p>

        {/* Level title */}
        <motion.h2
          className={`text-3xl sm:text-4xl font-extrabold mb-4 leading-tight bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo} text-gradient`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {intro.subtitle}
        </motion.h2>

        {/* Romantic message */}
        <motion.p
          className="text-base text-white/50 leading-relaxed mb-10 italic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          &ldquo;{intro.message}&rdquo;
        </motion.p>

        {/* Continue button */}
        <motion.button
          onClick={onContinue}
          className={`
            group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white
            bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo}
            shadow-lg transition-shadow duration-300 cursor-pointer
          `}
          style={{ boxShadow: `0 8px 30px ${meta.accentHex}30` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Heart size={16} fill="currentColor" />
          I&apos;m ready
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        </motion.button>

        {/* Question count hint */}
        <motion.p
          className="mt-6 text-[11px] text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          10 questions in this chapter
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

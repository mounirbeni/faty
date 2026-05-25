"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Star } from "lucide-react";
import { categoriesMeta, categoryIntros } from "@/data/meta";
import IconFromName from "./IconFromName";

interface LevelIntroProps {
  category: number;
  onContinue: () => void;
}

export default function LevelIntro({ category, onContinue }: LevelIntroProps) {
  const meta = categoriesMeta[category - 1];
  const intro = categoryIntros[category];

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
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      >
        {/* Level icon orb */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        >
          <motion.div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${meta.colorFrom} ${meta.colorTo} flex items-center justify-center shadow-2xl relative z-10`}
            style={{ boxShadow: `0 0 60px ${meta.accentHex}40` }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconFromName name={meta.icon} size={40} className="text-white" />
          </motion.div>
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring z-0"
            style={{ border: `2px solid ${meta.accentHex}` }}
          />

          {/* Floating fun particles */}
          <motion.div
            className="absolute -top-4 -right-4 text-amber-300 pointer-events-none"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={24} />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-2 -left-4 text-rose-300 pointer-events-none z-20"
            animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 -left-8 text-amber-200/70 pointer-events-none"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Star size={14} fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Chapter title */}
        <motion.p
          className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2"
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
          className="text-[15px] text-white/60 leading-relaxed mb-10 italic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          &quot;{intro.message}&quot;
        </motion.p>

        {/* Continue button */}
        <motion.button
          onClick={onContinue}
          className={`
            w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[16px] font-bold text-white
            bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo} overflow-hidden relative
            transition-transform duration-200 cursor-pointer shadow-xl
          `}
          style={{ boxShadow: `0 10px 30px -10px ${meta.accentHex}60` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12"
            initial={{ x: '-200%' }}
            animate={{ x: '300%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
          />
          <span className="relative z-10">Continue Journey</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={18} className="relative z-10" />
          </motion.div>
        </motion.button>

        {/* Question count hint */}
        <motion.p
          className="mt-6 text-[11px] text-white/30"
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

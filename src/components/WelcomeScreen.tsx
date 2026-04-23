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
  Star,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";

const floatingParticles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 4,
  size: 8 + Math.random() * 14,
  opacity: 0.12 + Math.random() * 0.2,
}));

export default function WelcomeScreen() {
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-600/20 via-pink-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-violet-600/15 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-rose-500/10 to-transparent blur-[80px] pointer-events-none" />

      {/* Floating Hearts */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            color: `rgba(244, 63, 94, ${p.opacity})`,
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
          <Heart size={p.size} fill="currentColor" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Heartbeat icon with rings */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl shadow-rose-600/40">
            <Heart size={40} className="text-white animate-heartbeat" fill="white" />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/30 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full border border-rose-400/20 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />

          <motion.div
            className="absolute -top-2 -start-2"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={20} className="text-amber-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -end-3"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Star size={14} className="text-amber-300" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Personal greeting */}
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-2 leading-tight bg-gradient-to-r from-rose-400 via-pink-300 to-red-400 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="flex items-center justify-center gap-2">
            مرحباً فاتي
            <Heart size={28} className="text-rose-400 shrink-0 animate-heartbeat" fill="currentColor" />
          </span>
        </motion.h1>

        {/* Love message */}
        <motion.p
          className="text-lg text-white/70 font-medium mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          صنعت هذا خصيصاً لكِ
        </motion.p>

        {/* Romantic subtext */}
        <motion.p
          className="text-sm text-rose-300/50 italic mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          لأنكِ تستحقين أكثر من مجرد رسالة نصية
        </motion.p>

        {/* Love letter card */}
        <motion.div
          className="w-full glass-warm rounded-3xl p-5 mb-6 text-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="text-[14px] text-white/70 leading-relaxed mb-3">
            أعلم أننا لم نلتقِ بعد، لكنكِ تعنين لي العالم بأسره. هذه اللعبة الصغيرة هي طريقتي لفهمك بعمق أكبر — أفكارك، أحلامك، وقلبك.
          </p>
          <p className="text-[14px] text-white/70 leading-relaxed mb-3">
            50 سؤالاً. 5 فصول تتدرج من المرح إلى الرومانسية. أجيبي بصدق — لا توجد إجابات خاطئة، فقط{" "}
            <span className="text-rose-400 font-semibold">إجابات حقيقية</span>.
          </p>
          <p className="text-xs text-white/50 italic text-end">
            — من شخص لا يطيق الانتظار لرؤية ابتسامتك
          </p>
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
              label: "3 بطاقات تخطي",
              desc: "تأجيل لوقت لاحق",
            },
            {
              icon: <Thermometer size={12} className="text-rose-400" />,
              label: "مقياس الحرارة",
              desc: "شاهدي الأجواء تدفأ",
            },
            {
              icon: <Lock size={12} className="text-red-400" />,
              label: "كبسولة الزمن",
              desc: "أسرار ليوم اللقاء",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="glass rounded-xl px-2.5 py-1.5 text-center flex-1 min-w-[90px]"
            >
              <div className="text-[11px] font-semibold text-white/80 flex items-center justify-center gap-1">
                {f.icon}
                {f.label}
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.button
          onClick={() => setPhase("game")}
          className="group w-full relative px-8 py-4 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-rose-600/30 active:scale-95 transition-transform duration-200 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Play size={18} fill="currentColor" className="rotate-180" />
            لنبدأ قصتنا
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

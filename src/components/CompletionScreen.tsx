"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  PartyPopper,
  Plane,
  Sparkles,
  Lock,
  RotateCcw,
  Star,
  Loader2,
  CheckCircle2,
  Map,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useGameStore } from "@/store/gameStore";
import { submitGameAction } from "@/app/actions/submitGame";
import Toast from "./Toast";

export default function CompletionScreen() {
  const answers = useGameStore((s) => s.answers);
  const reversed = useGameStore((s) => s.reversed);
  const isSubmitting = useGameStore((s) => s.isSubmitting);
  const isSuccess = useGameStore((s) => s.isSuccess);
  const setIsSubmitting = useGameStore((s) => s.setIsSubmitting);
  const setIsSuccess = useGameStore((s) => s.setIsSuccess);
  const setPhase = useGameStore((s) => s.setPhase);
  const fortuneResult = useGameStore((s) => s.fortuneResult);
  const heartSyncComplete = useGameStore((s) => s.heartSyncComplete);
  const hasLaunched = useRef(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const reversedArray = Array.from(reversed);
      const res = await submitGameAction(answers, reversedArray, fortuneResult, heartSyncComplete);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setToastMsg(res.error || "Failed to secure answers. Try again.");
        setToastVisible(true);
      }
    } catch {
      setToastMsg("Network error. Please try again.");
      setToastVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats based on Object.values(answers)
  const answersArray = Object.entries(answers).map(([id, value]) => ({
    questionId: Number(id),
    value,
    reversed: reversed.includes(Number(id)),
  }));

  const answeredCount = answersArray.filter((a) => !a.reversed && a.value).length;
  const reversedCount = reversed.length;
  const capsuleCount = answersArray.filter(
    (a) => !a.reversed && a.value && a.questionId > 40
  ).length;

  useEffect(() => {
    if (hasLaunched.current) return;
    hasLaunched.current = true;

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fb7185", "#f43f5e", "#e879f9", "#fbbf24", "#f472b6"],
      });
      confetti({
        particleCount: 3,
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
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#f43f5e", "#e879f9", "#fbbf24", "#f472b6"],
      });
    }, 600);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#fb7185", "#f43f5e", "#fbbf24"],
      });
    }, 1500);
  }, []);

  if (isSuccess) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 to-black pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 mb-8"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl font-extrabold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Secured & Locked!
          </motion.h2>

          <motion.p
            className="text-[15px] text-white/70 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your answers are now safely encrypted and sent. The Time Capsule is sealed until May 11. 
            <br/><br/>
            I can&apos;t wait to see your smile in person.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Heart size={24} className="text-rose-500 animate-heartbeat" fill="currentColor" />
            
            <button
              onClick={() => setPhase('home')}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              Back to Map <Map size={16} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-600/25 via-pink-500/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-amber-500/15 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-600/40">
            <PartyPopper size={40} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/20 animate-pulse-ring" />
          <motion.div
            className="absolute -top-2 -end-2"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-amber-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -start-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <Heart size={16} className="text-rose-400" fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute top-0 -start-4"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          >
            <Star size={12} className="text-amber-300" fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight bg-gradient-to-r from-rose-400 via-pink-300 to-amber-400 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          You are amazing, my beautiful angel
        </motion.h1>

        <motion.p
          className="text-[15px] text-white/60 font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Thank you for every answer and every word
        </motion.p>

        <motion.div
          className="w-full glass-warm rounded-3xl p-5 mb-6 text-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="text-[14px] text-white/60 leading-relaxed mb-3">
            Every word you wrote made my heart beat faster. I already knew you were special, but now I know you are <span className="text-rose-400 font-semibold">everything to me</span>.
          </p>
          <p className="text-[14px] text-white/60 leading-relaxed mb-3">
            Some of your answers are locked in the Time Capsule — and will only be revealed when I look into your eyes soon. And honestly? I cannot wait for that day.
          </p>
          <p className="text-xs text-white/40 italic flex items-center justify-end gap-1.5 mt-2">
            Always yours
            <Heart size={10} className="text-rose-400/60" fill="currentColor" />
          </p>
        </motion.div>

        <motion.div
          className="w-full grid grid-cols-3 gap-2.5 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <div className="glass-strong rounded-2xl py-3 px-2 text-center flex flex-col items-center">
            <Heart size={16} className="text-rose-400 mb-1.5" fill="currentColor" />
            <div className="text-xl font-bold text-white leading-none">{answeredCount}</div>
            <div className="text-[10px] text-white/40 mt-1">Answered</div>
          </div>
          <div className="glass-strong rounded-2xl py-3 px-2 text-center flex flex-col items-center">
            <RotateCcw size={16} className="text-amber-400 mb-1.5" />
            <div className="text-xl font-bold text-white leading-none">{reversedCount}</div>
            <div className="text-[10px] text-white/40 mt-1">Skipped</div>
          </div>
          <div className="glass-strong rounded-2xl py-3 px-2 text-center flex flex-col items-center">
            <Lock size={16} className="text-red-400 mb-1.5" />
            <div className="text-xl font-bold text-white leading-none">{capsuleCount}</div>
            <div className="text-[10px] text-white/40 mt-1">Locked</div>
          </div>
        </motion.div>

        <motion.div
          className="w-full glass-strong rounded-3xl p-5 mb-6 ring-1 ring-rose-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Plane size={14} className="text-rose-400" />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
              Meeting Countdown
            </span>
          </div>
          <p className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-2">
            We meet on May 11
            <Plane size={16} className="text-white/60" />
          </p>
          <p className="text-[13px] text-white/40 mb-3">
            The first chapter of our story together begins soon...
          </p>
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                size={12}
                className="text-rose-400/60"
                fill="currentColor"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl text-[15px] font-bold text-white shadow-xl shadow-rose-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Encrypting and sending...
            </>
          ) : (
            <>
              Lock Answers Securely <Lock size={18} className="ml-1 inline" />
            </>
          )}
        </motion.button>
      </div>
      
      <Toast message={toastMsg} visible={toastVisible} onDismiss={() => setToastVisible(false)} />
    </motion.div>
  );
}

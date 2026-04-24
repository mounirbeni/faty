'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, CalendarHeart, Heart, Sparkles, Plane } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, successVibe } from '@/lib/useHaptics';

const dailyMessages = [
  "Every single day that passes is one day closer to May 11. I am counting the hours until I can hold your hand. ⏳",
  "Your smile is the first thing I look for every morning, even from miles away. ☀️",
  "The distance between Marrakesh and Meknes is nothing compared to the bond we share. 🛤️",
  "I catch myself smiling at my phone just thinking about the last thing you said. 😊",
  "You are my peace in the chaos of every day. 🌙",
  "I cannot wait for the moment my eyes finally meet yours in person. 👁️",
  "Every voice note you send feels like a warm hug. 🎧",
  "I love how we can talk for hours and it only feels like minutes. ⏱️",
  "May 11 isn't just a date; it's the start of our real, tangible chapter. 📖",
  "You make me want to be the best version of myself, every single day. 💪",
  "I look at the stars at night and know you are looking at the exact same sky. 🌌",
  "Your laugh is my absolute favorite sound in the world. 🎵",
  "No matter how far apart we are right now, you are always right here in my heart. ❤️",
  "I am so proud of the woman you are, and I am so lucky to know you. 👑",
  "Sometimes I just pause and thank the universe for bringing you into my life. ✨",
  "Counting down the days until our screens are replaced by reality. 📱➡️🤝",
  "You are my favorite notification. Always. 🔔",
  "I love learning every little detail about your mind and your heart. 🧠💖",
  "May 11 is going to be the most beautiful day of my year. 🌸",
  "I promise to make every moment we share in person worth the wait. 🥂",
  "You have the kind of soul that makes everything else fade away. 🕊️",
  "I didn't know I was looking for anything until I found you. 🔍",
  "Your beauty is stunning, but your mind is what truly captured me. 🦋",
  "Every day I find a new reason to fall for you all over again. 🍂",
  "I can't wait to learn your favorite coffee order by heart. ☕",
  "The thought of seeing your smile in person gives me butterflies. 🦋",
  "We are building something so rare and so beautiful. 🏗️",
  "You are worth every single mile, every single second, every single wait. 🌍",
  "May 11: The day I finally get to tell you how amazing you are, face to face. 🗣️",
  "I love the way we understand each other without even trying. 🧩",
  "Today, just like yesterday, and just like tomorrow... you are my favorite thought. 💭"
];

export default function DailyNoteScreen() {
  const { setPhase, setLastReadDailyDate } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use day of the month (1-31) to pick a message
  const dayOfMonth = new Date().getDate();
  // Array is 0-indexed, so we subtract 1
  const messageIndex = dayOfMonth - 1;
  const todaysMessage = dailyMessages[messageIndex] || dailyMessages[0];

  useEffect(() => {
    // When she opens this screen, mark today as read
    setLastReadDailyDate(new Date().toLocaleDateString());
  }, [setLastReadDailyDate]);

  const handleOpen = () => {
    if (isOpen) return;
    successVibe();
    setIsOpen(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-emerald-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <CalendarHeart size={11} /> Daily Whisper
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center justify-center"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <p className="text-white/60 text-sm mb-12 font-medium tracking-wide text-center">
                A new thought, just for you, every single day.
              </p>
              
              <motion.button
                onClick={handleOpen}
                className="relative cursor-pointer select-none group"
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Glow behind envelope */}
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/40 blur-[40px] transition-all duration-300 group-hover:bg-emerald-400/60" />
                
                {/* Envelope */}
                <div className="w-64 h-48 rounded-3xl glass-strong border border-emerald-300/30 flex flex-col items-center justify-center shadow-[inset_0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1/2 border-b border-emerald-300/20 bg-emerald-500/10 skew-y-6 transform origin-top-left" />
                  <div className="absolute top-0 inset-x-0 h-1/2 border-b border-emerald-300/20 bg-emerald-500/10 -skew-y-6 transform origin-top-right" />
                  
                  <Heart size={48} className="text-emerald-300 drop-shadow-lg z-10 animate-pulse" fill="currentColor" />
                  <p className="text-xs font-bold text-emerald-200 mt-4 z-10 tracking-widest uppercase">Tap to open</p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              className="flex flex-col items-center justify-center w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, type: "spring", damping: 15 }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400/30">
                <Sparkles size={28} className="text-emerald-300" />
              </div>
              
              <h2 className="text-sm font-bold text-emerald-300 mb-6 tracking-widest uppercase">
                Day {dayOfMonth}
              </h2>
              
              <div className="glass-strong p-8 rounded-3xl w-full border border-emerald-500/30 shadow-2xl shadow-emerald-900/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <p className="text-[17px] text-white/95 leading-relaxed font-medium text-center italic">
                  &quot;{todaysMessage}&quot;
                </p>
              </div>

              <motion.button
                onClick={() => setPhase('home')}
                className="mt-10 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Keep this in mind <Heart size={16} fill="currentColor" className="text-emerald-100" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, CloudRain, Zap, Heart, Sparkles, SmilePlus } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, softTap } from '@/lib/useHaptics';

type Mood = 'missing' | 'stressed' | 'happy' | 'excited' | null;

const moodData = {
  missing: {
    icon: CloudRain,
    color: 'from-blue-400 to-indigo-500',
    shadow: 'shadow-blue-500/40',
    label: 'Missing You',
    response: "I'm right here. Every second that passes is one second closer to May 11. Close your eyes, take a breath, and know I am thinking about you exactly right now. 💙",
  },
  stressed: {
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
    shadow: 'shadow-purple-500/40',
    label: 'Stressed',
    response: "Take a deep breath, my beautiful angel. You are so strong and so capable. Whatever is heavy right now, you will get through it. I am so unbelievably proud of you. 💜",
  },
  happy: {
    icon: Sun,
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/40',
    label: 'Happy',
    response: "Your happiness is literally my favorite thing in the world. Knowing you're smiling makes me smile instantly. Keep glowing, my beautiful girl. 💛",
  },
  excited: {
    icon: Sparkles,
    color: 'from-pink-400 to-rose-500',
    shadow: 'shadow-pink-500/40',
    label: 'Excited',
    response: "Me too! The countdown to May 11 is on, and I promise you, it's going to be even more magical than we can imagine. I can't wait to share this excitement with you in person! 💖",
  },
};

export default function MoodRingScreen() {
  const { setPhase } = useGameStore();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);

  const handleMoodSelect = (mood: Mood) => {
    softTap();
    setSelectedMood(mood);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background ambient color depending on mood */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            key={selectedMood}
            className={`absolute inset-0 bg-gradient-to-br ${moodData[selectedMood].color} opacity-20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-yellow-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Sun size={11} /> Mood Ring
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            <motion.div
              key="selector"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] mb-6">
                <SmilePlus size={36} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-white mb-2 text-center">
                How is my angel feeling?
              </h2>
              <p className="text-sm text-white/60 mb-8 text-center max-w-[250px]">
                Tap the mood that best matches your heart right now.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                {(Object.keys(moodData) as Mood[]).map((mood) => {
                  if (!mood) return null;
                  const data = moodData[mood];
                  const Icon = data.icon;
                  return (
                    <motion.button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      className={`glass-strong p-5 rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10 active:scale-95 transition-all cursor-pointer`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center shadow-lg ${data.shadow}`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <span className="font-bold text-sm text-white/90">{data.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center w-full"
            >
              <motion.div 
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${moodData[selectedMood].color} flex items-center justify-center shadow-2xl ${moodData[selectedMood].shadow} mb-8 relative`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              >
                {(() => {
                  const Icon = moodData[selectedMood].icon;
                  return <Icon size={40} className="text-white" />;
                })()}
                <div className={`absolute inset-0 rounded-full border-2 border-white/30 animate-pulse-ring`} />
              </motion.div>

              <div className="glass-strong p-8 rounded-3xl w-full border border-white/20 relative overflow-hidden shadow-2xl">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${moodData[selectedMood].color}`} />
                <p className="text-[16px] text-white/95 leading-relaxed font-medium text-center italic">
                  &quot;{moodData[selectedMood].response}&quot;
                </p>
              </div>

              <motion.button
                onClick={() => setSelectedMood(null)}
                className="mt-8 text-white/50 text-sm font-semibold hover:text-white transition-colors uppercase tracking-widest active:scale-95"
              >
                Change Mood
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

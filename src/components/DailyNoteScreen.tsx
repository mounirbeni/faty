'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, CalendarHeart, Heart, Mic } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, successVibe } from '@/lib/useHaptics';
import { getDailyIndex } from '@/lib/dailyContent';
import ScratchCardWhisper from './ScratchCardWhisper';
import VoiceNotePlayer from './VoiceNotePlayer';

const dailyMessages = [
  "Every single day that passes is one day closer to May 11. I am counting the hours until I can hold your hand.",
  "Your smile is the first thing I look for every morning, even from miles away.",
  "The distance between Marrakesh and Meknes is nothing compared to the bond we share.",
  "I catch myself smiling at my phone just thinking about the last thing you said.",
  "You are my peace in the chaos of every day.",
  "I cannot wait for the moment my eyes finally meet yours in person.",
  "Every voice note you send feels like a warm hug.",
  "I love how we can talk for hours and it only feels like minutes.",
  "May 11 isn't just a date; it's the start of our real, tangible chapter.",
  "You make me want to be the best version of myself, every single day.",
  "I look at the stars at night and know you are looking at the exact same sky.",
  "Your laugh is my absolute favorite sound in the world.",
  "No matter how far apart we are right now, you are always right here in my heart.",
  "I am so proud of the woman you are, and I am so lucky to know you.",
  "Sometimes I just pause and thank the universe for bringing you into my life.",
  "Counting down the days until our screens are replaced by reality.",
  "You are my favorite notification. Always.",
  "I love learning every little detail about your mind and your heart.",
  "May 11 is going to be the most beautiful day of my year.",
  "I promise to make every moment we share in person worth the wait.",
  "You have the kind of soul that makes everything else fade away.",
  "I didn't know I was looking for anything until I found you.",
  "Your beauty is stunning, but your mind is what truly captured me.",
  "Every day I find a new reason to fall for you all over again.",
  "I can't wait to learn your favorite coffee order by heart.",
  "The thought of seeing your smile in person gives me butterflies.",
  "We are building something so rare and so beautiful.",
  "You are worth every single mile, every single second, every single wait.",
  "May 11: The day I finally get to tell you how amazing you are, face to face.",
  "I love the way we understand each other without even trying.",
  "Today, just like yesterday, and just like tomorrow... you are my favorite thought.",
];

export default function DailyNoteScreen() {
  const { setPhase } = useGameStore();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => { heartbeat(); }, []);

  // New message every day — deterministic, no localStorage needed
  const todayIdx = getDailyIndex(dailyMessages.length, 'whisper');
  const todaysMessage = dailyMessages[todayIdx];

  const handleRevealed = () => {
    successVibe();
    setIsRevealed(true);
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-sm mx-auto">
        <p className="text-white/60 text-sm mb-6 font-medium tracking-wide text-center">
          {isRevealed ? "A new thought, just for you." : "Scratch the card to reveal today's whisper."}
        </p>

        <ScratchCardWhisper onComplete={handleRevealed}>
          <div className="flex flex-col items-center justify-center w-full">
            {false ? (
              <div className="flex flex-col items-center">
                <Mic size={32} className="text-emerald-400 mb-4 animate-pulse" />
                <p className="text-xs font-bold text-emerald-200 mb-4 tracking-widest uppercase">Secret Audio</p>
                <VoiceNotePlayer src="/voice-notes/note-1.mp3" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Heart size={32} className="text-emerald-400 mb-4 animate-heartbeat" fill="currentColor" />
                <p className="text-[17px] text-white/95 leading-relaxed font-medium text-center italic">
                  &quot;{todaysMessage}&quot;
                </p>
              </div>
            )}
          </div>
        </ScratchCardWhisper>

        <AnimatePresence>
          {isRevealed && (
            <motion.button
              onClick={() => setPhase('home')}
              className="mt-10 px-8 py-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Keep this in mind <Heart size={16} fill="currentColor" className="text-emerald-100" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, CalendarHeart, Heart, Mic } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';
import { getDailyIndex } from '@/lib/dailyContent';
import ScratchCardWhisper from './ScratchCardWhisper';
import VoiceNotePlayer from './VoiceNotePlayer';

const dailyMessages = [
  "Seeing your face for the first time is a memory I will carry for the rest of my life.",
  "You are even more beautiful in person than in every version of you I had imagined.",
  "I keep replaying our first moments together. They feel too good to be real.",
  "I catch myself smiling for no reason, and then I realize — there is always a reason. It is always you.",
  "You are my peace in the chaos of every day.",
  "Now that I have finally looked into your eyes in person, everything makes complete sense.",
  "Every voice note you send feels different now. I know the smile it is coming from.",
  "I love how we can talk for hours and it still feels like we never have enough time.",
  "May 11 was not just a date. It was the start of the realest chapter of my life.",
  "You make me want to be the best version of myself, every single day.",
  "I look at the stars at night and smile, knowing you are somewhere looking at the same sky.",
  "Your laugh is my absolute favorite sound in the entire world.",
  "The distance still exists, but it cannot take from me what I already have — the memory of being next to you.",
  "I am so proud of the woman you are, and I am the luckiest person alive to know you.",
  "Sometimes I just pause and thank the universe for giving me the courage to message you first.",
  "Now I count the days until we see each other again. The wait is harder because I know what it feels like.",
  "You are my favorite notification. You always have been. Now you are my favorite memory too.",
  "I love learning every little detail about your mind and your heart — especially the things I only discovered in person.",
  "May 11 was the most beautiful day of my year. I need a second, a third, and a fourth.",
  "I promise every moment we share in person will keep getting better. We are only just beginning.",
  "You have the kind of soul that makes everything else fade away. I felt that the second I saw you.",
  "I did not know I was looking for anything — until I found you. Now I cannot imagine looking for anything else.",
  "Your beauty stopped me. Your heart made me stay.",
  "Every single day I find a new reason to fall for you all over again.",
  "I already know your favorite things. Now I just want to live all of them with you.",
  "Meeting you in person was not just a moment. It was proof of everything I already knew.",
  "We are building something so rare and so beautiful. I felt it the moment we were in the same room.",
  "You are worth every single mile, every single second, every single moment of the wait.",
  "I finally got to tell you how amazing you are — face to face. And I still did not say it enough.",
  "I love the way we understand each other — in texts, in calls, and now in person too.",
  "Today, just like every day since May 11 — you are my favorite thought.",
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
    notifyOwner(`🌿 <b>Your angel scratched today's Daily Whisper!</b>\n\nShe revealed today's message:\n\n"${todaysMessage}"`);
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

      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.14) 0%, transparent 65%)', filter: 'blur(70px)', zIndex: 0 }} />

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
              className="mt-10 px-8 py-[18px] w-full text-white font-black rounded-2xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
                boxShadow: '0 0 0 1px rgba(16,185,129,0.45), 0 8px 36px rgba(16,185,129,0.38), 0 2px 8px rgba(0,0,0,0.4)',
              }}
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

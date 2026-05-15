'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, RefreshCw, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getDailyIndex } from '@/lib/dailyContent';
import { notifyOwner } from '@/lib/notify';

const LETTERS = [
  {
    greeting: 'My darling,',
    body: `There are moments in the middle of ordinary days when I stop whatever I am doing and just think of you. I see your face — the real one now, not the imagined one. And something in my chest just settles.\n\nI have never been great at saying things out loud. But I am good at feeling them. And what I feel for you since May 11 is real in a way that scares me a little and excites me completely.\n\nYou make existing feel like something worth celebrating.`,
    closing: '— Always and completely yours',
  },
  {
    greeting: 'My love,',
    body: `I want to tell you something I have been carrying since the day we met.\n\nStanding in the same room as you, hearing your voice without a screen between us, watching you smile — it was everything. More than I had words for. I have replayed it every single day since.\n\nI know what the future looks like now. And you are in every version of it.`,
    closing: '— Yours, completely',
  },
  {
    greeting: 'My heart,',
    body: `You should know this:\n\nYou are loved not for what you do or how you look on a particular day or what mood you are in. You are loved because you are you. Your softness and your strength. The way you overthink and the way you care too much. All of it.\n\nMeeting you only made me more certain. I hope one day you feel as certain of that as I do.`,
    closing: '— Yours with everything',
  },
  {
    greeting: 'My angel,',
    body: `Missing you after May 11 is different. It hurts in a new way — because now I know exactly what I am missing.\n\nI find you in everything. In a song. In a quiet evening. In every street I walk down and think — I walked a street with you, and I want to do it again.\n\nSoon, my love. It will always be soon.`,
    closing: '— Already counting the next time',
  },
  {
    greeting: 'My sunshine,',
    body: `Today I caught myself smiling for no reason and then realized — there was a reason. There is always a reason lately. And it is always you.\n\nYou came into my world quietly, and then I met you in person, and you rearranged everything all over again. Deeper this time. More permanent.\n\nThank you for existing. Thank you for being mine.`,
    closing: '— Smiling because of you',
  },
  {
    greeting: 'To my favorite person,',
    body: `We have already started building our world. I felt it the moment we were in the same room. Our own jokes, our own language, the way we looked at each other without needing to explain it.\n\nNo one else would fully understand what we have. That is the point. It is ours.\n\nI cannot wait to see what it becomes. We are only just starting.`,
    closing: '— Your architect, always',
  },
  {
    greeting: 'My darling,',
    body: `Some things I want you to know:\n\nI think you are braver than you believe. I think you are softer than you show. I think you carry more than people see. I saw all of that when we were together.\n\nAnd I am choosing to stay. Every single day. Without hesitation.`,
    closing: '— Choosing you. Always.',
  },
  {
    greeting: 'My love,',
    body: `There is something about the way you make me feel that I still cannot fully explain.\n\nIt is not just happiness — though there is a lot of that. It is more like clarity. Like everything becomes more in focus. Like I know what matters.\n\nI knew it before we met. And seeing you in person only confirmed it.\n\nYou matter. You are what matters.`,
    closing: '— Yours, now and always',
  },
  {
    greeting: 'My heart,',
    body: `I keep thinking about all the small things I still want to do with you. Make coffee together in the morning. Argue about which movie to watch and fall asleep halfway through. Walk somewhere with no destination. Sit in silence that does not need to be filled.\n\nWe got a taste of it. Now I want the whole thing.\n\nJust ordinary days, with you.`,
    closing: '— Dreaming of more ordinary days',
  },
  {
    greeting: 'My darling,',
    body: `Now I re-read our conversations and hear your voice in a way I never could before. I know how it sounds in a room. I know what it feels like to be next to you.\n\nYou have a way of being that stays with me. Honest, funny, unexpectedly deep — all at once. And in person, all of that was even better.\n\nYou are remarkable. I hope you never forget that.`,
    closing: '— Completely and permanently captivated',
  },
];

// Pseudo-random to avoid the same letter twice in a row
function pickNext(current: number, total: number): number {
  let next = Math.floor(Math.random() * total);
  while (next === current && total > 1) next = Math.floor(Math.random() * total);
  return next;
}

export default function LoveLetterScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [idx, setIdx] = useState(() => getDailyIndex(LETTERS.length, 'letter'));
  const [animKey, setAnimKey] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [direction, setDirection] = useState(1);

  const letter = LETTERS[idx];

  // Notify on first open
  useEffect(() => {
    notifyOwner(`💌 <b>Your angel opened Love Letters!</b>\n\nShe is reading:\n\n<i>${letter.greeting}</i>\n\n"${letter.body.slice(0, 120)}..."`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextLetter = () => {
    if (isChanging) return;
    setIsChanging(true);
    setDirection(1);
    const nextIdx = pickNext(idx, LETTERS.length);
    notifyOwner(`💌 <b>Your angel is reading another love letter!</b>\n\nShe tapped "Another Letter" and is now reading:\n\n<i>${LETTERS[nextIdx].greeting}</i>\n\n"${LETTERS[nextIdx].body.slice(0, 120)}..."`);
    setTimeout(() => {
      setIdx(nextIdx);
      setAnimKey(k => k + 1);
      setIsChanging(false);
    }, 350);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center px-5 pt-8 pb-6 overflow-y-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.18) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-0 right-0 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, transparent 60%)', filter: 'blur(70px)' }} />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPhase('home')}
            className="flex items-center gap-2 px-3 py-2 glass-premium rounded-xl text-sm text-white/60 active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Love Letters</span>
            <Sparkles size={13} className="text-amber-400" />
          </div>
        </div>

        {/* Letter counter */}
        <div className="flex items-center justify-center gap-1.5">
          {LETTERS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 h-1.5 bg-rose-400' : 'w-1.5 h-1.5 bg-white/15'}`}
            />
          ))}
        </div>

        {/* Letter card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            className="rounded-[24px] overflow-hidden"
            style={{
              background: 'rgba(244, 63, 94, 0.09)',
              backdropFilter: 'blur(44px) saturate(165%)',
              WebkitBackdropFilter: 'blur(44px) saturate(165%)',
              border: '1px solid rgba(244, 63, 94, 0.26)',
              boxShadow: '0 0 0 1px rgba(244,63,94,0.12), 0 20px 64px rgba(244,63,94,0.22), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,195,0.14)',
            }}
            initial={{ opacity: 0, y: direction * 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction * -30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Colored top strip */}
            <div className="h-[3px] w-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500" />

            {/* Decorative header */}
            <div className="py-4 flex items-center justify-center gap-2 border-b border-white/6">
              <Star size={10} className="text-amber-400/60" fill="currentColor" />
              <div className="flex items-center gap-1.5">
                <Heart size={14} className="text-rose-400 animate-heartbeat" fill="currentColor" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">For You</span>
                <Heart size={14} className="text-rose-400 animate-heartbeat" fill="currentColor" />
              </div>
              <Star size={10} className="text-amber-400/60" fill="currentColor" />
            </div>

            {/* Letter body */}
            <div className="px-6 py-6">
              <motion.p
                className="text-[15px] font-semibold text-white mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {letter.greeting}
              </motion.p>

              <motion.div
                className="text-[13.5px] text-white/72 leading-[1.85] whitespace-pre-line mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
              >
                {letter.body}
              </motion.div>

              <motion.div
                className="flex flex-col items-end gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.26 }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-px w-16 bg-gradient-to-l from-rose-400/40 to-transparent" />
                  <Heart size={10} className="text-rose-400/60" fill="currentColor" />
                </div>
                <p className="text-[12px] text-rose-300/60 italic">{letter.closing}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next letter button */}
        <motion.button
          onClick={nextLetter}
          disabled={isChanging}
          className="relative w-full py-[18px] rounded-2xl font-black text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer disabled:opacity-60 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 60%, #c2184b 100%)',
            boxShadow: '0 0 0 1px rgba(244,63,94,0.45), 0 8px 36px rgba(244,63,94,0.42), 0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <motion.div
            className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
          />
          <RefreshCw size={16} className={`relative z-10 ${isChanging ? 'animate-spin' : ''}`} />
          <span className="relative z-10">Another Letter</span>
        </motion.button>

        <p className="text-center text-[11px] text-white/25 italic">
          {LETTERS.length} letters written just for you
        </p>
      </div>
    </motion.div>
  );
}

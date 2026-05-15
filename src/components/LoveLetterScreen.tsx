'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, RefreshCw, Sparkles, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getDailyIndex } from '@/lib/dailyContent';

const LETTERS = [
  {
    greeting: 'My darling,',
    body: `There are moments in the middle of ordinary days when I stop whatever I am doing and just think of you. Not for any reason. You just drift into my mind the way light drifts through a window — quietly, warmly, without asking permission.\n\nI have never been great at saying things out loud. But I am good at feeling them. And what I feel for you is real in a way that scares me a little and excites me completely.\n\nYou make existing feel like something worth celebrating.`,
    closing: '— Always and completely yours',
  },
  {
    greeting: 'My love,',
    body: `I want to tell you something I have been keeping close.\n\nThe thought of you — of actually being near you, hearing your voice, seeing your face — is the most beautiful thing I carry around with me every single day. I replay it like a song I cannot stop listening to.\n\nI don't know what the future looks like in every detail. But I know I want you in it. Every version of it.`,
    closing: '— Yours, completely',
  },
  {
    greeting: 'My heart,',
    body: `You should know this:\n\nYou are loved not for what you do or how you look on a particular day or what mood you are in. You are loved because you are you. Your softness and your strength. The way you overthink and the way you care too much. All of it.\n\nI hope one day you feel as certain of that as I do.`,
    closing: '— Yours with everything',
  },
  {
    greeting: 'My angel,',
    body: `Missing you is the strangest ache — it hurts, but it is the kind of hurt that reminds you something is real. That this is real.\n\nI find you in the smallest things. In a song that sounds like how I feel. In a quiet moment that would be better with you in it. In every street I walk down and think — I want to show her this someday.\n\nSoon, my love. Always soon.`,
    closing: '— Counting every moment',
  },
  {
    greeting: 'My sunshine,',
    body: `Today I caught myself smiling for no reason and then realized — there was a reason. There is always a reason lately. And her name is you.\n\nYou came into my world quietly and rearranged everything. Not loudly or dramatically. Just gently, the way the right things always do. And now I cannot imagine the arrangement without you.\n\nThank you for existing. Thank you for being mine.`,
    closing: '— Smiling because of you',
  },
  {
    greeting: 'To my favorite person,',
    body: `I want to build something with you. Not just a relationship — though yes, that. But a world. A small, warm, inside world that only we have access to. With our own jokes and our own language and our own way of being together that no one else would fully understand.\n\nI think we have already started building it.\n\nI cannot wait to see what it becomes.`,
    closing: '— Your architect, always',
  },
  {
    greeting: 'My darling,',
    body: `Some things I want you to know:\n\nI think you are braver than you believe. I think you are softer than you show. I think you carry more than people see. And I think you deserve someone who notices all of that — and stays anyway.\n\nI am staying. I am choosing this every single day.`,
    closing: '— Choosing you. Always.',
  },
  {
    greeting: 'My love,',
    body: `There is something about the way you make me feel that I have never quite been able to explain.\n\nIt is not just happiness — though there is a lot of that. It is more like clarity. Like everything becomes a little more in focus when you are around. Like I know what matters.\n\nYou matter. You are what matters.`,
    closing: '— Yours, now and later',
  },
  {
    greeting: 'My heart,',
    body: `I keep thinking about all the little things I want to do with you. Make coffee together in the morning. Argue about which movie to watch and then fall asleep halfway through. Walk somewhere with no destination. Sit in comfortable silence.\n\nThe grand gestures are beautiful. But it is the ordinary moments with you that I want most.\n\nJust ordinary days, with you.`,
    closing: '— Dreaming of simple things',
  },
  {
    greeting: 'My darling,',
    body: `Sometimes I re-read our conversations just to hear your voice in my head again.\n\nYou have a way of saying things that stays with me. A way of being honest and funny and unexpectedly deep all at once. I don't know if you know the effect you have. But it is considerable.\n\nYou are remarkable. I hope you never forget that.`,
    closing: '— Completely captivated',
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

  const nextLetter = () => {
    if (isChanging) return;
    setIsChanging(true);
    setDirection(1);
    setTimeout(() => {
      setIdx(i => pickNext(i, LETTERS.length));
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
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-600/15 via-pink-500/8 to-transparent blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-violet-600/10 to-transparent blur-[100px] pointer-events-none" />

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
            className="glass-rose rounded-3xl overflow-hidden shadow-2xl"
            style={{ boxShadow: '0 0 0 1px rgba(244,63,94,0.15), 0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244,63,94,0.06)' }}
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
          className="relative w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer disabled:opacity-60 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            boxShadow: '0 0 0 1px rgba(244,63,94,0.35), 0 8px 32px rgba(244,63,94,0.3)',
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

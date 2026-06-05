'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, RotateCcw, ChevronRight, Bomb } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { successVibe, softTap } from '@/lib/useHaptics';
import { playReveal, playBloom, playSparkle, playPop, playSuccess } from '@/lib/sounds';
import { trackInteraction } from '@/lib/sessionTracker';

const QUESTIONS = [
  { id: 1,  color: '#FF4D8D', q: 'What was the exact moment you knew you had real feelings for me — despite the distance between us?' },
  { id: 2,  color: '#A78BFA', q: 'What is one thing about loving someone from far away that nobody warned you about?' },
  { id: 3,  color: '#FFB84D', q: 'If you could change one thing about how we navigate this distance, what would it be?' },
  { id: 4,  color: '#FF4D8D', q: 'What is your biggest fear about what this distance might do to what we are building together?' },
  { id: 5,  color: '#A78BFA', q: 'What do I do — even from far away — that makes you feel the most loved and seen?' },
  { id: 6,  color: '#FFB84D', q: 'If you could tell me one thing you have been holding back about how you feel across this distance, what would it be?' },
  { id: 7,  color: '#FF4D8D', q: 'What does your ideal version of us look like on the day this distance finally ends?' },
  { id: 8,  color: '#A78BFA', q: 'In which moments do you feel closest to me — even when we are thousands of kilometers apart?' },
  { id: 9,  color: '#FFB84D', q: 'What is something you hope I always do for you, no matter how far we are from each other?' },
  { id: 10, color: '#FF4D8D', q: 'What made you decide to keep showing up for us, even through the hard days of being apart?' },
  { id: 11, color: '#A78BFA', q: 'What part of our long-distance story means the most to you right now?' },
  { id: 12, color: '#FFB84D', q: 'How do you feel right now — in this moment — about everything between us across all this distance?' },
  { id: 13, color: '#FF4D8D', q: 'What is a version of our future together — physically in the same place — that you secretly dream about?' },
  { id: 14, color: '#A78BFA', q: 'What is something small I do on our calls that you secretly love?' },
  { id: 15, color: '#FFB84D', q: 'If you could relive one moment of ours — even just a call — which one would you choose?' },
];

export default function TruthBombsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [active, setActive] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const handleFlip = (id: number) => {
    softTap(); playPop(); playReveal();
    setFlipped(s => new Set([...s, id]));
    setActive(id);
  };

  const handleSubmit = (q: typeof QUESTIONS[0]) => {
    const answer = answers[q.id]?.trim();
    if (!answer) return;
    successVibe(); playBloom(); playSuccess();
    setSubmitted(s => new Set([...s, q.id]));
    setActive(null);
    trackInteraction('truth-bomb-answer');
    notifyOwner(`💣 <b>Truth Bomb answered!</b>\n\n<b>Q:</b> ${q.q}\n\n<b>Her answer:</b>\n"${answer}"`);
    if (submitted.size + 1 >= QUESTIONS.length) setDone(true);
  };

  if (done) return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,77,141,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 0 60px rgba(255,77,141,0.6)' }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
        <Heart size={36} fill="white" className="text-white animate-heartbeat" />
      </motion.div>
      <motion.h2 className="text-2xl font-black text-white text-center mb-4"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        All {QUESTIONS.length} truths shared 💗
      </motion.h2>
      <motion.div className="glass-cinema rounded-[24px] p-5 mb-6 text-center w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.75)' }}>
          Every answer you gave me is a gift. Honesty like this is rare — and it makes me love you even more.
        </p>
        <div className="flex justify-end items-center gap-1.5 mt-3">
          <Heart size={9} fill="currentColor" style={{ color: '#FFB84D' }} />
          <p className="text-[11px] italic" style={{ color: 'rgba(255,179,199,0.45)' }}>Thank you for trusting me</p>
        </div>
      </motion.div>
      <motion.button onClick={() => setPhase('home')}
        className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 transition-transform cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 8px 36px rgba(255,77,141,0.4)' }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Heart size={15} fill="currentColor" /> Back to Map
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.45 }}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,77,141,0.1) 0%, rgba(123,92,255,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
            style={{ color: 'rgba(255,230,242,0.6)' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Bomb size={14} style={{ color: '#FF4D8D' }} />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Truth Bombs</span>
          </div>
          <div className="text-[11px] font-bold" style={{ color: 'rgba(255,179,199,0.5)' }}>
            {submitted.size}/{QUESTIONS.length}
          </div>
        </div>

        {/* Intro */}
        <div className="text-center px-2">
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.55)' }}>
            Tap a card to flip it. Read the question. Answer honestly from your heart. 💗
          </p>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#FF4D8D,#A78BFA)' }}
            animate={{ width: `${(submitted.size / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }} />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-3 gap-3">
          {QUESTIONS.map((q, i) => {
            const isFlipped = flipped.has(q.id);
            const isDone = submitted.has(q.id);
            const isActiveCard = active === q.id;

            return (
              <motion.div key={q.id}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="relative"
                style={{ perspective: 800 }}>

                <motion.div
                  className="relative w-full rounded-[18px] overflow-hidden cursor-pointer transition-transform"
                  style={{ height: 90, transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => !isFlipped && handleFlip(q.id)}
                >
                  {/* Front — bomb */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[18px]"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      background: isDone
                        ? 'linear-gradient(135deg,rgba(255,77,141,0.25),rgba(167,139,250,0.2))'
                        : 'rgba(255,255,255,0.07)',
                      border: isDone ? `1px solid rgba(255,77,141,0.35)` : '1px solid rgba(255,255,255,0.1)',
                    }}>
                    {isDone ? (
                      <Heart size={22} fill="currentColor" style={{ color: '#FF7AA2' }} className="animate-heartbeat" />
                    ) : (
                      <>
                        <Bomb size={22} style={{ color: q.color }} />
                        <span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.4)' }}>
                          #{i + 1}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Back — question preview */}
                  <div className="absolute inset-0 flex items-center justify-center p-2 rounded-[18px]"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(135deg, ${q.color}22, ${q.color}11)`,
                      border: `1px solid ${q.color}44`,
                    }}>
                    <p className="text-[8px] text-white/70 text-center leading-tight line-clamp-3">
                      {q.q.slice(0, 45)}…
                    </p>
                  </div>
                </motion.div>

                {/* Answer modal trigger */}
                {isFlipped && !isDone && (
                  <motion.button
                    onClick={() => { playSparkle(); setActive(isActiveCard ? null : q.id); }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10"
                    style={{ background: q.color, boxShadow: `0 0 12px ${q.color}88` }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                    <ChevronRight size={12} className="text-white" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Answer panel */}
        <AnimatePresence>
          {active !== null && !submitted.has(active) && (() => {
            const q = QUESTIONS.find(q => q.id === active)!;
            return (
              <motion.div
                key={active}
                className="glass-cinema rounded-[24px] overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}>
                <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${q.color}, ${q.color}88)` }} />
                <div className="p-5">
                  <div className="flex items-start gap-2 mb-4">
                    <Sparkles size={14} style={{ color: q.color }} className="mt-0.5 shrink-0" />
                    <p className="text-[13.5px] font-medium leading-relaxed" style={{ color: 'rgba(255,230,242,0.9)' }}>
                      {q.q}
                    </p>
                  </div>
                  <textarea
                    className="w-full rounded-[14px] p-3.5 text-[13px] resize-none outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,230,242,0.9)', minHeight: 90,
                    }}
                    placeholder="Answer honestly from your heart…"
                    value={answers[q.id] ?? ''}
                    onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setActive(null)}
                      className="flex-1 py-3 glass rounded-[14px] text-[13px] font-semibold cursor-pointer transition-transform"
                      style={{ color: 'rgba(255,230,242,0.5)' }}>
                      Later
                    </button>
                    <button onClick={() => handleSubmit(q)}
                      disabled={!answers[q.id]?.trim()}
                      className="flex-[2] py-3 rounded-[14px] text-[13px] font-black text-white flex items-center justify-center gap-2 cursor-pointer transition-transform disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${q.color}, ${q.color}99)`, boxShadow: `0 6px 24px ${q.color}55` }}>
                      <Heart size={13} fill="currentColor" /> Send Truth
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

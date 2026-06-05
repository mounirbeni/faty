'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const TIMELINE = [
  {
    id: 0,
    icon: '📱',
    label: 'The First Message',
    prompt: 'What did you feel when you first reached out — or when I first reached out to you?',
    hint: 'Nervous, curious, something else entirely…',
    color: 'rgba(251,191,36,0.85)',
  },
  {
    id: 1,
    icon: '💬',
    label: 'The First Real Conversation',
    prompt: 'What did you notice about me in the way we talked? What surprised you?',
    hint: 'Something in the words, the silences, the energy…',
    color: 'rgba(249,115,22,0.85)',
  },
  {
    id: 2,
    icon: '🌷',
    label: 'The First Smile You Gave Me',
    prompt: 'When did you first smile because of something I said or did? What was it?',
    hint: 'Even a small thing…',
    color: 'rgba(244,63,94,0.85)',
  },
  {
    id: 3,
    icon: '💗',
    label: 'The First Time You Missed Me',
    prompt: 'When did you first notice yourself missing me? Where were you? What brought it on?',
    hint: 'Something reminded you of me…',
    color: 'rgba(236,72,153,0.85)',
  },
  {
    id: 4,
    icon: '🌹',
    label: 'The First Time You Felt Something Real',
    prompt: 'The first time you knew this wasn\'t just surface-level. Describe the exact moment.',
    hint: 'What shifted? Where did you feel it?',
    color: 'rgba(167,139,250,0.85)',
  },
  {
    id: 5,
    icon: '∞',
    label: 'The Day We Became More',
    prompt: 'What was that day like for you? What did you feel when you realized what we were?',
    hint: 'Not the words — the feeling in the room, in your heart…',
    color: 'rgba(99,102,241,0.85)',
  },
];

const WARM_DOTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 83.7 + 8) % 100,
  y: (i * 61.3 + 5) % 100,
  size: 1.5 + (i % 3) * 1.2,
  dur: 5 + (i % 5) * 1.5,
  delay: i * 0.4,
  color: i % 3 === 0 ? 'rgba(251,191,36,0.3)' : i % 3 === 1 ? 'rgba(251,146,60,0.25)' : 'rgba(245,158,11,0.2)',
}));

export default function OurFirstsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(TIMELINE.length).fill(''));
  const [done, setDone] = useState(false);

  const current = TIMELINE[step];
  const progress = ((step + (done ? 1 : 0)) / TIMELINE.length) * 100;

  const handleNext = () => {
    if (step === TIMELINE.length - 1) {
      const lines = TIMELINE.map((t, i) =>
        `${t.icon} ${t.label}\n"${answers[i]?.trim() || '…'}"`
      ).join('\n\n');
      notifyOwner(`✨ <b>She walked back through our firsts…</b>\n\n${lines}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0700 0%, #1a0f00 45%, #120a00 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.1) 0%, transparent 60%)' }} />

      {WARM_DOTS.map(d => (
        <motion.div key={d.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: d.color, filter: 'blur(0.5px)' }}
          animate={{ y: [0, -15, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,220,130,0.95)' }}>Our Firsts</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,175,60,0.45)' }}>The moments that built everything</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(255,175,60,0.4)' }}>{step + 1} / {TIMELINE.length}</span>}
        </div>

        <div className="px-4 pb-3">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #d97706, #fbbf24)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Timeline dots */}
        <div className="flex justify-center gap-2 pb-4 px-4">
          {TIMELINE.map((t, i) => (
            <motion.div key={i}
              className="flex items-center justify-center rounded-full text-[12px] transition-all duration-300"
              style={{
                width: i === step ? 28 : 20,
                height: i === step ? 28 : 20,
                background: i < step
                  ? 'rgba(245,158,11,0.4)'
                  : i === step
                  ? 'linear-gradient(135deg, #d97706, #fbbf24)'
                  : 'rgba(255,255,255,0.07)',
                boxShadow: i === step ? '0 2px 12px rgba(217,119,6,0.5)' : 'none',
              }}>
              {i < step ? '✓' : i === step ? t.icon : null}
            </motion.div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-5">

                {/* Timeline moment card */}
                <div className="rounded-[22px] p-5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(25,15,0,0.97), rgba(15,8,0,0.97))',
                    border: `1px solid ${current.color.replace('0.85', '0.2')}`,
                    boxShadow: `0 6px 30px ${current.color.replace('0.85', '0.08')}`,
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 24 }}>{current.icon}</span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${current.color.replace('0.85', '0.3')}, transparent)` }} />
                  </div>
                  <p className="text-[12px] uppercase tracking-widest font-bold mb-1.5" style={{ color: current.color.replace('0.85', '0.5') }}>
                    {current.label}
                  </p>
                  <p className="text-[15px] font-semibold leading-snug" style={{ color: 'rgba(255,220,140,0.9)' }}>
                    {current.prompt}
                  </p>
                </div>

                {/* Text input */}
                <div className="rounded-[18px] overflow-hidden"
                  style={{ border: `1px solid ${current.color.replace('0.85', '0.15')}`, background: 'rgba(255,255,255,0.03)' }}>
                  <textarea
                    value={answers[step]}
                    onChange={e => {
                      const next = [...answers];
                      next[step] = e.target.value;
                      setAnswers(next);
                    }}
                    placeholder={current.hint}
                    rows={4}
                    className="w-full bg-transparent px-4 pt-4 pb-2 text-[14px] resize-none outline-none placeholder:text-white/15"
                    style={{ color: 'rgba(255,220,150,0.88)', caretColor: '#fbbf24', lineHeight: '1.7' }}
                  />
                  <div className="px-4 pb-3 flex justify-end">
                    <span className="text-[10px]" style={{ color: 'rgba(255,175,60,0.25)' }}>{answers[step]?.length || 0} chars</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,175,60,0.4)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                      boxShadow: '0 4px 20px rgba(217,119,6,0.35)',
                      opacity: answers[step]?.trim() ? 1 : 0.45,
                    }}>
                    {step === TIMELINE.length - 1 ? 'Complete ✦' : 'Next Moment →'}
                  </button>
                </div>
                {!answers[step]?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(255,175,60,0.28)' }}>
                    Skip this one
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.span style={{ fontSize: 52 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  ✨
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(255,220,130,0.95)' }}>
                    Every first led to this
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,175,80,0.6)' }}>
                    I just walked through the beginning of us with you. Every one of those moments already mattered before you knew it.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 24px rgba(217,119,6,0.4)' }}>
                  Back to Our Universe
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

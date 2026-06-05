'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const ENTRIES = [
  {
    id: 0,
    prompt: 'How are you feeling right now — honestly?',
    placeholder: 'No filter. Just the truth.',
    rows: 3,
  },
  {
    id: 1,
    prompt: 'Something about him you thought of today that you didn\'t get to say…',
    placeholder: 'Maybe something small. Maybe something that stayed with you all day.',
    rows: 3,
  },
  {
    id: 2,
    prompt: 'What do you want to tell him right now, in this moment?',
    placeholder: 'Say it here. He\'ll read it.',
    rows: 3,
  },
  {
    id: 3,
    prompt: 'One word that captures how you feel about what you two have…',
    placeholder: 'Just one word.',
    rows: 1,
  },
];

const DROPS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 109.3 + 6) % 100,
  y: (i * 73.7 + 4) % 100,
  size: 2 + (i % 3) * 1.2,
  dur: 8 + (i % 5) * 1.8,
  delay: i * 0.55,
}));

export default function DistanceDiaryScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(ENTRIES.length).fill(''));
  const [done, setDone] = useState(false);

  const current = ENTRIES[step];
  const progress = ((step + (done ? 1 : 0)) / ENTRIES.length) * 100;

  const handleNext = () => {
    if (step === ENTRIES.length - 1) {
      const entry = ENTRIES.map((e, i) =>
        `📍 ${e.prompt}\n${answers[i]?.trim() || '…'}`
      ).join('\n\n');
      notifyOwner(`📓 <b>Her Distance Diary — today's entry</b>\n\n${entry}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0005 0%, #130009 45%, #0c0006 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(167,139,250,0.11) 0%, transparent 62%)' }} />

      {DROPS.map(d => (
        <motion.div key={d.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: 'rgba(167,139,250,0.18)', filter: 'blur(1.5px)' }}
          animate={{ y: [0, 10, 0], opacity: [0.1, 0.38, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(220,210,255,0.95)' }}>Distance Diary</h1>
            <p className="text-[11px]" style={{ color: 'rgba(167,139,250,0.45)' }}>A quiet page, just for today</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(167,139,250,0.4)' }}>{step + 1} / {ENTRIES.length}</span>}
        </div>

        <div className="px-4 pb-4">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-5">

                <div className="rounded-[22px] p-5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20,8,35,0.97), rgba(10,3,20,0.97))',
                    border: '1px solid rgba(167,139,250,0.18)',
                    boxShadow: '0 6px 30px rgba(124,58,237,0.1)',
                  }}>
                  <div className="flex items-start gap-2 mb-4">
                    <div className="w-0.5 self-stretch rounded-full shrink-0 mt-1"
                      style={{ background: 'linear-gradient(to bottom, #7c3aed, transparent)', minHeight: 36 }} />
                    <p className="text-[16px] font-semibold leading-snug" style={{ color: 'rgba(220,210,255,0.9)' }}>
                      {current.prompt}
                    </p>
                  </div>
                  <textarea
                    value={answers[step]}
                    onChange={e => {
                      const next = [...answers];
                      next[step] = e.target.value;
                      setAnswers(next);
                    }}
                    placeholder={current.placeholder}
                    rows={current.rows}
                    className="w-full bg-transparent text-[15px] resize-none outline-none placeholder:text-white/15 pl-3"
                    style={{ color: 'rgba(220,210,255,0.88)', caretColor: '#a78bfa', lineHeight: '1.75', borderLeft: '1px solid rgba(167,139,250,0.15)' }}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px]" style={{ color: 'rgba(167,139,250,0.25)' }}>{answers[step]?.length || 0} chars</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {ENTRIES.map((_, i) => (
                    <motion.div key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === step ? 20 : 5,
                        height: 5,
                        background: i === step
                          ? 'rgba(167,139,250,0.8)'
                          : i < step
                          ? 'rgba(167,139,250,0.35)'
                          : 'rgba(255,255,255,0.1)',
                      }} />
                  ))}
                </div>

                <div className="flex gap-2">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(167,139,250,0.5)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                      opacity: answers[step]?.trim() ? 1 : 0.45,
                    }}>
                    {step === ENTRIES.length - 1 ? 'Close the diary ✦' : 'Next →'}
                  </button>
                </div>
                {!answers[step]?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(167,139,250,0.28)' }}>
                    Skip this one
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center py-6">
                <motion.span style={{ fontSize: 52 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  📓
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-2" style={{ color: 'rgba(220,210,255,0.95)' }}>
                    Today's page is written
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(167,139,250,0.55)' }}>
                    He'll read every word. Every entry is a thread that keeps you close.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white w-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}>
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

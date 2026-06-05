'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const PROMPTS = [
  {
    id: 0,
    prefix: 'If I could say one thing through this screen right now with no fear…',
    placeholder: 'it would be that…',
  },
  {
    id: 1,
    prefix: 'Something I\'ve been wanting you to know about what this distance has taught me…',
    placeholder: 'is that…',
  },
  {
    id: 2,
    prefix: 'When I think of the day I finally see you, the first word that comes to me…',
    placeholder: 'is…',
  },
  {
    id: 3,
    prefix: 'The thing about loving you from far away that I never expected…',
    placeholder: 'is…',
  },
  {
    id: 4,
    prefix: 'What I want most from the day this distance finally ends…',
    placeholder: 'is…',
  },
];

const INK_DROPS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (i * 91.3 + 5) % 100,
  y: (i * 67.7 + 3) % 100,
  size: 2 + (i % 4) * 1.5,
  dur: 8 + (i % 5) * 2,
  delay: i * 0.5,
}));

export default function WordsIHoldScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(PROMPTS.length).fill(''));
  const [done, setDone] = useState(false);

  const current = PROMPTS[step];
  const progress = ((step + (done ? 1 : 0)) / PROMPTS.length) * 100;

  const handleNext = () => {
    if (step === PROMPTS.length - 1) {
      const letter = PROMPTS.map((p, i) =>
        `${p.prefix}\n${answers[i]?.trim() || '…'}`
      ).join('\n\n');
      notifyOwner(`🌹 <b>The words she holds for you…</b>\n\n${letter}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #18000a 0%, #2a0012 45%, #1a0010 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(244,63,94,0.12) 0%, transparent 60%)' }} />

      {INK_DROPS.map(d => (
        <motion.div key={d.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: 'rgba(251,113,133,0.2)', filter: 'blur(1.5px)' }}
          animate={{ y: [0, 12, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.6, 1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(244,63,94,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,180,195,0.95)' }}>Words I Hold</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,120,150,0.45)' }}>Five sentences I wrote only for you</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(255,120,150,0.4)' }}>{step + 1} / {PROMPTS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #be123c, #fb7185)' }}
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

                {/* Prompt */}
                <div className="rounded-[22px] p-5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(40,0,18,0.97), rgba(25,0,10,0.97))',
                    border: '1px solid rgba(244,63,94,0.18)',
                    boxShadow: '0 6px 30px rgba(244,63,94,0.08)',
                  }}>
                  <div className="flex items-start gap-2 mb-4">
                    <div className="w-0.5 h-full self-stretch rounded-full shrink-0 mt-1"
                      style={{ background: 'linear-gradient(to bottom, #be123c, transparent)', minHeight: 40 }} />
                    <p className="text-[16px] font-semibold leading-snug" style={{ color: 'rgba(255,180,195,0.9)' }}>
                      {current.prefix}
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
                    rows={4}
                    className="w-full bg-transparent text-[15px] resize-none outline-none placeholder:text-white/18 pl-3"
                    style={{ color: 'rgba(255,210,220,0.9)', caretColor: '#fb7185', lineHeight: '1.7', borderLeft: '1px solid rgba(244,63,94,0.15)' }}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px]" style={{ color: 'rgba(255,100,130,0.25)' }}>
                      {answers[step]?.length || 0} chars
                    </span>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex justify-center gap-2">
                  {PROMPTS.map((_, i) => (
                    <motion.div key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === step ? 20 : 5,
                        height: 5,
                        background: i === step
                          ? 'rgba(251,113,133,0.8)'
                          : i < step
                          ? 'rgba(251,113,133,0.35)'
                          : 'rgba(255,255,255,0.1)',
                      }} />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,130,155,0.4)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #be123c, #fb7185)',
                      boxShadow: '0 4px 20px rgba(190,18,60,0.35)',
                      opacity: answers[step]?.trim() ? 1 : 0.45,
                    }}>
                    {step === PROMPTS.length - 1 ? 'Seal the Letter ✦' : 'Next →'}
                  </button>
                </div>
                {!answers[step]?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(255,100,130,0.28)' }}>
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
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  💌
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-2" style={{ color: 'rgba(255,180,195,0.95)' }}>
                    Your letter is sealed
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,120,150,0.55)' }}>
                    Five sentences. Five truths. I'll read each one slowly.
                  </p>
                </div>

                {/* Letter display */}
                <div className="w-full rounded-[22px] p-5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(35,0,15,0.97), rgba(20,0,8,0.97))',
                    border: '1px solid rgba(244,63,94,0.2)',
                    boxShadow: '0 8px 32px rgba(190,18,60,0.15)',
                  }}>
                  {PROMPTS.map((p, i) => answers[i]?.trim() ? (
                    <div key={i} className={i > 0 ? 'mt-4 pt-4' : ''}
                      style={i > 0 ? { borderTop: '1px solid rgba(244,63,94,0.1)' } : {}}>
                      <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: 'rgba(255,100,130,0.35)' }}>
                        {p.prefix.replace('…', '')}
                      </p>
                      <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,200,215,0.88)' }}>
                        {answers[i]}
                      </p>
                    </div>
                  ) : null)}
                </div>

                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white w-full"
                  style={{ background: 'linear-gradient(135deg, #be123c, #fb7185)', boxShadow: '0 4px 24px rgba(190,18,60,0.4)' }}>
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

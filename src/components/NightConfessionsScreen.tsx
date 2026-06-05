'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const CONFESSIONS = [
  { id: 0, prompt: 'One thing I\'m afraid to need from you too much…', hint: 'What feels risky to depend on?' },
  { id: 1, prompt: 'The physical closeness I miss most right now…', hint: 'A touch, a presence, a warmth…' },
  { id: 2, prompt: 'A thought about us I keep coming back to when it\'s quiet…', hint: 'It doesn\'t have to be perfect' },
  { id: 3, prompt: 'Something I wish you already knew about how I feel…', hint: 'What would be easier if you just knew?' },
  { id: 4, prompt: 'A fear I carry about love that you\'ve helped make smaller…', hint: 'What were you afraid of before us?' },
  { id: 5, prompt: 'The moment I feel most loved by you…', hint: 'The specific small thing you do' },
  { id: 6, prompt: 'Something I want us to experience together that I\'ve never said…', hint: 'Could be emotional, physical, or a dream' },
  { id: 7, prompt: 'What I feel in the silence when we\'re just together…', hint: 'No words needed — just describe the feeling' },
];

const MOON_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 137.5 + 30) % 100,
  y: (i * 89.3 + 10) % 100,
  size: 1 + (i % 4) * 0.5,
  dur: 4 + (i % 5) * 1.2,
  delay: (i * 0.3) % 5,
  opacity: 0.1 + (i % 5) * 0.07,
}));

export default function NightConfessionsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(CONFESSIONS.length).fill(''));
  const [done, setDone] = useState(false);

  const current = CONFESSIONS[step];
  const progress = ((step + (done ? 1 : 0)) / CONFESSIONS.length) * 100;

  const handleNext = () => {
    if (step === CONFESSIONS.length - 1) {
      const lines = CONFESSIONS.map((c, i) =>
        `"${c.prompt}"\n→ ${answers[i]?.trim() || '…'}`
      ).join('\n\n');
      notifyOwner(`🌙 <b>Her night confessions…</b>\n\n${lines}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #010510 0%, #030820 45%, #020615 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Moon glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 75% 10%, rgba(148,163,184,0.08) 0%, transparent 50%)' }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.07) 0%, transparent 60%)' }} />

      {MOON_PARTICLES.map(p => (
        <motion.div key={p.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: 'rgba(186,220,255,0.7)' }}
          animate={{ opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      {/* Moon */}
      <div className="fixed top-6 right-8 w-12 h-12 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(220,230,255,0.9), rgba(180,200,255,0.5))',
          boxShadow: '0 0 30px rgba(180,210,255,0.2), 0 0 60px rgba(120,160,255,0.1)',
          filter: 'blur(0.5px)',
        }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArrowLeft size={16} className="text-white/50" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(186,220,255,0.92)' }}>Night Confessions</h1>
            <p className="text-[11px]" style={{ color: 'rgba(130,170,220,0.4)' }}>Only honesty lives here, tonight</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(130,170,220,0.35)' }}>{step + 1} / {CONFESSIONS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #93c5fd)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-6">

                {/* Step dots */}
                <div className="flex justify-center gap-1.5">
                  {CONFESSIONS.map((_, i) => (
                    <div key={i} className="rounded-full transition-all duration-300"
                      style={{
                        width: i === step ? 16 : 4,
                        height: 4,
                        background: i === step ? 'rgba(147,197,253,0.8)' : i < step ? 'rgba(147,197,253,0.35)' : 'rgba(255,255,255,0.12)',
                      }} />
                  ))}
                </div>

                {/* Confession card */}
                <div className="rounded-[24px] p-6 flex flex-col gap-2"
                  style={{
                    background: 'linear-gradient(145deg, rgba(5,12,35,0.95), rgba(3,8,25,0.95))',
                    border: '1px solid rgba(59,130,246,0.18)',
                    boxShadow: '0 8px 40px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(147,197,253,0.6)' }} />
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(100,150,220,0.5)' }}>
                      Confession {step + 1}
                    </span>
                  </div>
                  <p className="text-[17px] font-bold leading-snug" style={{ color: 'rgba(186,220,255,0.92)' }}>
                    {current.prompt}
                  </p>
                </div>

                {/* Text input */}
                <div className="rounded-[20px] overflow-hidden"
                  style={{ border: '1px solid rgba(59,130,246,0.15)', background: 'rgba(255,255,255,0.03)' }}>
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
                    style={{ color: 'rgba(186,220,255,0.88)', caretColor: '#93c5fd', lineHeight: '1.7' }}
                  />
                  <div className="px-4 pb-3 flex justify-between items-center">
                    <span className="text-[10px]" style={{ color: 'rgba(100,150,220,0.25)' }}>
                      {answers[step]?.length || 0} chars
                    </span>
                    {answers[step]?.trim() && (
                      <span className="text-[10px]" style={{ color: 'rgba(147,197,253,0.4)' }}>✓</span>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(130,170,220,0.45)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                      boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
                      opacity: answers[step]?.trim() ? 1 : 0.45,
                    }}>
                    {step === CONFESSIONS.length - 1 ? 'Complete ✦' : 'Next →'}
                  </button>
                </div>
                {!answers[step]?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(100,150,220,0.3)' }}>
                    Skip this one
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.span style={{ fontSize: 54 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  🌙
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(186,220,255,0.95)' }}>
                    The night heard everything
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(130,170,220,0.6)' }}>
                    These confessions took courage. I read every word. I carry all of it with love.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 24px rgba(59,130,246,0.35)' }}>
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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const MOMENTS = [
  {
    icon: '📱',
    title: 'The first time I saw your face…',
    prompt: 'What crossed your heart in that very first moment — even through a screen?',
    hint: 'Was it in your chest, your thoughts, your breath…',
    glow: 'rgba(255,77,141,0.18)',
  },
  {
    icon: '💬',
    title: 'The first time we really talked…',
    prompt: 'What made you want to keep the conversation going?',
    hint: 'Something about the words, the energy, the way time disappeared…',
    glow: 'rgba(167,139,250,0.18)',
  },
  {
    icon: '✨',
    title: 'The moment I realized you were different…',
    prompt: 'What changed inside you? What did you finally see that you hadn\'t before?',
    hint: 'Not the reason — the feeling itself',
    glow: 'rgba(255,184,77,0.18)',
  },
  {
    icon: '🌙',
    title: 'The first night I fell asleep thinking about you…',
    prompt: 'What were you feeling? What couldn\'t stop running through your mind?',
    hint: 'Let yourself remember it exactly as it was',
    glow: 'rgba(99,102,241,0.18)',
  },
  {
    icon: '💗',
    title: 'The moment I knew I had real feelings — across all this distance…',
    prompt: 'Describe exactly what happened in your heart when you realized the miles didn\'t matter.',
    hint: 'You can take your time. I want to feel it too.',
    glow: 'rgba(244,63,94,0.2)',
  },
  {
    icon: '🌹',
    title: 'The moment I knew I loved you…',
    prompt: 'What were you doing? What did it feel like to finally know — even from this far away?',
    hint: 'This one is yours to keep. But share it with me.',
    glow: 'rgba(201,36,95,0.22)',
  },
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (i * 67.3) % 100,
  y: (i * 43.7) % 100,
  size: 2 + (i % 3) * 1.5,
  dur: 5 + (i % 4) * 1.8,
  delay: (i % 6) * 0.7,
  color: i % 2 === 0 ? 'rgba(255,77,141,0.3)' : 'rgba(255,184,77,0.2)',
}));

export default function MomentIKnewScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(MOMENTS.length).fill(''));
  const [done, setDone] = useState(false);

  const current = MOMENTS[step];
  const progress = ((step + (done ? 1 : 0)) / MOMENTS.length) * 100;

  const handleNext = () => {
    if (step === MOMENTS.length - 1) {
      const lines = MOMENTS.map((m, i) =>
        `${m.title}\n"${answers[i]?.trim() || '…'}"`
      ).join('\n\n');
      notifyOwner(`🌹 <b>She shared the moments she knew…</b>\n\n${lines}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const updateAnswer = (val: string) =>
    setAnswers(prev => { const next = [...prev]; next[step] = val; return next; });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0008 0%, #2d0010 45%, #180612 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${current.glow} 0%, transparent 65%)`, transition: 'background 0.8s ease' }} />

      {PARTICLES.map(p => (
        <motion.div key={p.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, filter: 'blur(0.5px)' }}
          animate={{ y: [0, -22, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.5, 1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,180,200,0.95)' }}>The Moment I Knew</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,120,155,0.5)' }}>Six moments that changed everything</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(255,120,155,0.45)' }}>{step + 1} / {MOMENTS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c9245f, #ff4d8d)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10 min-h-0">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col gap-5">

                <div className="flex flex-col gap-4">
                  <motion.div className="text-center"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}>
                    <span style={{ fontSize: 48 }}>{current.icon}</span>
                  </motion.div>

                  <div className="rounded-[22px] p-5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,36,95,0.1), rgba(255,77,141,0.05))',
                      border: '1px solid rgba(201,36,95,0.22)',
                      boxShadow: '0 6px 28px rgba(201,36,95,0.1)',
                    }}>
                    <p className="text-[19px] font-black leading-snug mb-2" style={{ color: 'rgba(255,210,225,0.95)' }}>
                      {current.title}
                    </p>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,150,180,0.65)' }}>
                      {current.prompt}
                    </p>
                  </div>
                </div>

                <div className="rounded-[18px] overflow-hidden"
                  style={{ border: '1px solid rgba(201,36,95,0.18)', background: 'rgba(255,255,255,0.04)' }}>
                  <textarea
                    value={answers[step]}
                    onChange={e => updateAnswer(e.target.value)}
                    placeholder={current.hint}
                    rows={4}
                    className="w-full bg-transparent px-4 pt-4 pb-2 text-[14px] resize-none outline-none placeholder:text-white/20"
                    style={{ color: 'rgba(255,210,225,0.9)', caretColor: '#ff4d8d', lineHeight: '1.7' }}
                  />
                  <div className="px-4 pb-3 flex justify-end">
                    <span className="text-[10px]" style={{ color: 'rgba(255,100,140,0.3)' }}>
                      {answers[step]?.length || 0} characters
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold transition-opacity"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,180,200,0.55)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #c9245f, #ff4d8d)',
                      boxShadow: '0 4px 20px rgba(201,36,95,0.35)',
                      opacity: answers[step]?.trim() ? 1 : 0.5,
                    }}>
                    {step === MOMENTS.length - 1 ? 'Complete ✦' : 'Next Moment →'}
                  </button>
                </div>
                {!answers[step]?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(255,100,140,0.3)' }}>
                    Skip this moment
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.div className="text-6xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                  🌹
                </motion.div>
                <div>
                  <h2 className="text-[22px] font-black mb-3" style={{ color: 'rgba(255,210,225,0.95)' }}>
                    These moments are yours
                  </h2>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,150,180,0.6)' }}>
                    Every word you just shared lives in my heart now. Thank you for letting me see the moments that changed you.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #c9245f, #ff4d8d)', boxShadow: '0 4px 24px rgba(201,36,95,0.4)' }}>
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

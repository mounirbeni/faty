'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { notifyOwner } from '@/lib/notify';
import { getCachedPresence } from '@/lib/presenceContext';
import { softTap, successVibe } from '@/lib/useHaptics';
import { playBloom, playDiscovery, playReveal } from '@/lib/sounds';

const PROMPTS = [
  {
    cue: 'Close your eyes…',
    prompt: 'Take me back to the first time we were really close together. What did you feel — every sensation, every thought, every heartbeat?',
  },
  {
    cue: 'Something shifted between us…',
    prompt: 'Describe the moment you knew something between us was different. What changed? What did your heart feel?',
  },
  {
    cue: 'I held you for the first time…',
    prompt: 'Tell me the story of our first hug — as if you are living it right now. Every detail you remember.',
  },
  {
    cue: 'A quiet moment only we have…',
    prompt: 'Describe a private moment between us that you hold close inside. Why does it stay with you?',
  },
  {
    cue: 'Close your eyes once more…',
    prompt: 'Describe the moment you knew you had real feelings for me. Do not hold anything back.',
  },
] as const;

// Deterministic particles
function pr(s: number) { return Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1; }
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 100,
  y: pr(i * 3 + 1) * 100,
  size: 2 + pr(i * 3 + 2) * 4,
  dur: 8 + pr(i * 7) * 10,
  delay: pr(i * 11) * 8,
  opacity: 0.06 + pr(i * 13) * 0.1,
}));

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

export default function MemoryReconstructionGame({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<'cue' | 'writing' | 'preserved'>('cue');
  const [allDone, setAllDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const current = PROMPTS[step];
  const currentAnswer = answers[step] ?? '';
  const canSubmit = currentAnswer.trim().length >= 8;

  // Show the cue first, then reveal the prompt after 1.8s
  useEffect(() => {
    setPhase('cue');
    playReveal();
    const t = setTimeout(() => {
      setPhase('writing');
      setTimeout(() => textareaRef.current?.focus(), 200);
    }, 1900);
    return () => clearTimeout(t);
  }, [step]);

  const handlePreserve = () => {
    if (!canSubmit) return;
    softTap();
    successVibe();
    playBloom();
    setPhase('preserved');

    const isLast = step === PROMPTS.length - 1;
    const newAnswers = { ...answers, [step]: currentAnswer.trim() };
    setAnswers(newAnswers);

    if (isLast) {
      playDiscovery();
      setTimeout(() => {
        setAllDone(true);
        const ctx = getCachedPresence();
        const timeNote = ctx ? `\n🕒 ${ctx.moroccoTime} Morocco  ·  📍 ${ctx.locationLabel}` : '';
        const lines = PROMPTS.map((p, i) =>
          `<b>Memory ${i + 1}:</b> ${p.prompt}\n\n<i>"${newAnswers[i] ?? ''}"</i>`
        );
        notifyOwner(
          `🌌 <b>She reconstructed your memories together</b>${timeNote}\n\n` +
          lines.join('\n\n─────\n\n') +
          `\n\n<i>She lived every moment again, for you 💗</i>`
        );
        onComplete();
      }, 1600);
    }
  };

  const handleNext = () => {
    softTap();
    setStep(s => s + 1);
  };

  // ── All done ──────────────────────────────────────────────────────────────
  if (allDone) return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(167,139,250,0.2) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', boxShadow: '0 0 70px rgba(167,139,250,0.6)' }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
        <Sparkles size={34} className="text-white" />
      </motion.div>
      <motion.h2 className="text-2xl font-black text-white text-center mb-2"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        Five memories, forever preserved
      </motion.h2>
      <motion.p className="text-[13px] text-center mb-6" style={{ color: 'rgba(255,230,242,0.5)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        You lived every moment again inside this universe
      </motion.p>
      <motion.div className="glass-cinema rounded-[24px] p-5 w-full max-w-sm text-center mb-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.8)' }}>
          Reading your words felt like being there. Thank you for going back to those moments with me.
        </p>
      </motion.div>
      <motion.button onClick={onBack}
        className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 transition-transform cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', boxShadow: '0 8px 36px rgba(167,139,250,0.4)' }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Heart size={15} fill="currentColor" /> Back to Intimacy
      </motion.button>
    </motion.div>
  );

  // ── Main game ─────────────────────────────────────────────────────────────
  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* Deep atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 20% 80%, rgba(255,77,141,0.08) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        {/* Warm candle bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px]"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,184,77,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: '#A78BFA', opacity: p.opacity }}
            animate={{ y: [0, -22, 0], opacity: [p.opacity, p.opacity * 2.8, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-4 shrink-0">
        <button onClick={onBack}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
          style={{ color: 'rgba(255,230,242,0.5)' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-black" style={{ color: 'rgba(255,230,242,0.5)' }}>🌌 Memory Stories</span>
          <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.35)' }}>tell me what you felt</span>
        </div>
        <div className="text-[11px] font-bold" style={{ color: 'rgba(167,139,250,0.4)' }}>
          {step + 1}/{PROMPTS.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mx-4 h-[2px] rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #A78BFA, #A78BFA55)' }}
          animate={{ width: `${((step + 1) / PROMPTS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-4 pt-6 pb-6 max-w-lg mx-auto w-full gap-4 overflow-y-auto app-scroll" data-scroll>

        <AnimatePresence mode="wait">
          {/* Cue phase — cinematic opener */}
          {phase === 'cue' && (
            <motion.div key={`cue-${step}`}
              className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-10"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}>
              {/* Breathing orb */}
              <motion.div
                className="w-16 h-16 rounded-full"
                style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', boxShadow: '0 0 60px rgba(167,139,250,0.5)' }}
                animate={{ scale: [1, 1.12, 1], boxShadow: ['0 0 50px rgba(167,139,250,0.4)', '0 0 80px rgba(167,139,250,0.7)', '0 0 50px rgba(167,139,250,0.4)'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(167,139,250,0.5)' }}>Memory {step + 1}</p>
                <motion.p className="text-[22px] font-black text-white leading-tight"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {current.cue}
                </motion.p>
              </div>
              <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#A78BFA' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Writing phase */}
          {phase === 'writing' && (
            <motion.div key={`writing-${step}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="flex flex-col gap-4">

              {/* Prompt card */}
              <div className="glass-cinema rounded-[24px] overflow-hidden">
                <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #A78BFA, #A78BFA33)' }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                      <Heart size={12} fill="currentColor" style={{ color: '#A78BFA' }} />
                    </motion.div>
                    <span className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: 'rgba(167,139,250,0.55)' }}>
                      {current.cue}
                    </span>
                  </div>
                  <p className="text-[15.5px] font-semibold leading-relaxed" style={{ color: 'rgba(255,235,242,0.95)' }}>
                    {current.prompt}
                  </p>
                </div>
              </div>

              {/* Story textarea */}
              <div>
                <textarea
                  ref={textareaRef}
                  className="w-full rounded-[18px] p-4 text-[13.5px] resize-none outline-none leading-relaxed"
                  style={{
                    background: 'rgba(167,139,250,0.05)',
                    border: `1px solid ${currentAnswer.trim() ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    color: 'rgba(255,235,242,0.92)',
                    minHeight: 140,
                    caretColor: '#A78BFA',
                    transition: 'border-color 0.35s',
                  }}
                  placeholder="Close your eyes first. Then write exactly what you remember feeling…"
                  value={currentAnswer}
                  onChange={e => setAnswers(a => ({ ...a, [step]: e.target.value }))}
                />
                <motion.button
                  onClick={handlePreserve}
                  disabled={!canSubmit}
                  className="mt-3 w-full py-4 rounded-[16px] text-[13px] font-black text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-30"
                  style={{
                    background: canSubmit ? 'linear-gradient(135deg, #A78BFA, #7C3AED)' : 'rgba(255,255,255,0.06)',
                    boxShadow: canSubmit ? '0 6px 28px rgba(167,139,250,0.4)' : 'none',
                  }}>
                  <Sparkles size={14} />
                  {step === PROMPTS.length - 1 ? 'Preserve all memories' : 'Preserve this memory'}
                </motion.button>
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-1.5">
                {PROMPTS.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-400"
                    style={{ width: i === step ? 18 : 5, height: 5, background: i < step ? '#A78BFA' : i === step ? '#A78BFA' : 'rgba(255,255,255,0.1)', opacity: i === step ? 1 : i < step ? 0.6 : 0.25 }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Preserved phase — between memories */}
          {phase === 'preserved' && step < PROMPTS.length - 1 && (
            <motion.div key={`preserved-${step}`}
              className="flex-1 flex flex-col items-center justify-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.5 }}>
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A78BFA, #FF4D8D)', boxShadow: '0 0 60px rgba(167,139,250,0.55)' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
                <Heart size={28} fill="white" className="text-white" />
              </motion.div>
              <div>
                <p className="text-lg font-black text-white mb-1">Memory preserved ✦</p>
                <p className="text-[12px]" style={{ color: 'rgba(255,230,242,0.45)' }}>
                  {PROMPTS.length - step - 1} memories left to explore
                </p>
              </div>
              <motion.button onClick={handleNext}
                className="px-10 py-3.5 rounded-[20px] font-black text-white text-[13px] transition-transform cursor-pointer flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', boxShadow: '0 6px 30px rgba(167,139,250,0.45)' }}
                >
                <Sparkles size={13} /> Next memory
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

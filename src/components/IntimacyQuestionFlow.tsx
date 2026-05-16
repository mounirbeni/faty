'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Send } from 'lucide-react';
import { notifyOwner } from '@/lib/notify';
import { getCachedPresence } from '@/lib/presenceContext';
import { softTap, successVibe } from '@/lib/useHaptics';
import { playReveal, playBloom, playDiscovery } from '@/lib/sounds';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
  questions: readonly string[];
  telegramTitle: string;
  onBack: () => void;
  onComplete: (answers: Record<number, string>) => void;
}

// Ambient floating particles — deterministic so no hydration mismatch
function pr(seed: number) { return Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % 1; }

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 100,
  y: pr(i * 3 + 1) * 100,
  size: 3 + pr(i * 3 + 2) * 5,
  dur: 6 + pr(i * 7) * 8,
  delay: pr(i * 11) * 6,
  opacity: 0.08 + pr(i * 13) * 0.14,
}));

export default function IntimacyQuestionFlow({
  icon, title, subtitle, accentColor, glowColor,
  questions, telegramTitle, onBack, onComplete,
}: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealing, setRevealing] = useState(true);
  const [done, setDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cinematic reveal on each question
  useEffect(() => {
    setRevealing(true);
    playReveal();
    const t = setTimeout(() => {
      setRevealing(false);
      textareaRef.current?.focus();
    }, 700);
    return () => clearTimeout(t);
  }, [step]);

  const currentQ = questions[step];
  const currentAnswer = answers[step] ?? '';
  const canSubmit = currentAnswer.trim().length >= 3;
  const isLast = step === questions.length - 1;

  const handleSubmit = () => {
    if (!canSubmit) return;
    softTap();
    successVibe();
    playBloom();

    const newAnswers = { ...answers, [step]: currentAnswer.trim() };
    setAnswers(newAnswers);

    if (isLast) {
      playDiscovery();
      setTimeout(() => {
        setDone(true);
        // Build and send Telegram recap
        const ctx = getCachedPresence();
        const timeNote = ctx ? `\n🕒 ${ctx.moroccoTime} Morocco time  ·  📍 ${ctx.locationLabel}` : '';
        const lines = questions.map((q, i) =>
          `<b>Q${i + 1}:</b> ${q}\n<i>"${newAnswers[i] ?? ''}"</i>`
        );
        notifyOwner(
          `${icon} <b>${telegramTitle}</b>${timeNote}\n\n` +
          lines.join('\n\n') +
          `\n\n<i>She opened her heart completely 💗</i>`
        );
        onComplete(newAnswers);
      }, 400);
    } else {
      setTimeout(() => setStep(s => s + 1), 350);
    }
  };

  if (done) return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${glowColor}20 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`, boxShadow: `0 0 70px ${glowColor}66` }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
        <Heart size={36} fill="white" className="text-white animate-heartbeat" />
      </motion.div>
      <motion.h2 className="text-2xl font-black text-white text-center mb-3"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {icon} Every word was a gift
      </motion.h2>
      <motion.div
        className="glass-cinema rounded-[24px] p-5 w-full max-w-sm text-center mb-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.8)' }}>
          Thank you for sharing what lives inside you. Every answer you gave me is something I will carry.
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Sparkles size={9} style={{ color: accentColor }} />
          <p className="text-[10px] italic" style={{ color: 'rgba(255,179,199,0.4)' }}>He received every word 💌</p>
        </div>
      </motion.div>
      <motion.button onClick={onBack}
        className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, boxShadow: `0 8px 36px ${glowColor}44` }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Heart size={15} fill="currentColor" /> Back to Intimacy
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 90% 50% at 50% 0%, ${glowColor}16 0%, transparent 60%)`, filter: 'blur(50px)' }} />
        {/* Candle-glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[250px]"
          style={{ background: `radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,184,77,0.07) 0%, transparent 70%)` }} />
      </div>

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: accentColor, opacity: p.opacity }}
            animate={{ y: [0, -18, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-4 shrink-0">
        <button onClick={onBack}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
          style={{ color: 'rgba(255,230,242,0.55)' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-black" style={{ color: 'rgba(255,230,242,0.55)' }}>{icon} {title}</span>
          <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,179,199,0.35)' }}>{subtitle}</span>
        </div>
        <div className="text-[11px] font-bold tabular-nums" style={{ color: 'rgba(255,179,199,0.45)' }}>
          {step + 1}/{questions.length}
        </div>
      </div>

      {/* Progress bar — thin and elegant */}
      <div className="mx-4 h-[2px] rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55)` }}
          animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>

      {/* Question + answer area */}
      <div className="relative z-10 flex flex-col flex-1 px-4 pt-6 pb-6 max-w-lg mx-auto w-full gap-4 overflow-y-auto app-scroll" data-scroll>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: revealing ? 0 : 1, y: revealing ? 20 : 0, scale: revealing ? 0.97 : 1, filter: revealing ? 'blur(6px)' : 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="glass-cinema rounded-[24px] overflow-hidden">
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)` }} />
            <div className="p-6">
              <div className="flex items-start gap-2 mb-1">
                <Heart size={12} fill="currentColor" style={{ color: accentColor, marginTop: 3, flexShrink: 0 }}
                  className="animate-heartbeat" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accentColor}88` }}>
                  Question {step + 1}
                </span>
              </div>
              <p className="text-[16px] font-semibold leading-relaxed mt-2" style={{ color: 'rgba(255,235,242,0.95)' }}>
                {currentQ}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer panel */}
        <AnimatePresence>
          {!revealing && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <textarea
                ref={textareaRef}
                className="w-full rounded-[18px] p-4 text-[13.5px] resize-none outline-none leading-relaxed"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${answers[step]?.trim() ? accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
                  color: 'rgba(255,235,242,0.92)',
                  minHeight: 110,
                  caretColor: accentColor,
                  transition: 'border-color 0.3s',
                }}
                placeholder="Write from your heart… there are no wrong answers here."
                value={currentAnswer}
                onChange={e => setAnswers(a => ({ ...a, [step]: e.target.value }))}
              />

              <div className="flex gap-2 mt-3">
                {step > 0 && (
                  <button
                    onClick={() => { softTap(); setStep(s => s - 1); }}
                    className="px-4 py-3 glass rounded-[14px] text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform"
                    style={{ color: 'rgba(255,230,242,0.4)' }}>
                    ← Prev
                  </button>
                )}
                <motion.button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 py-3.5 rounded-[16px] text-[13px] font-black text-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-30"
                  style={{
                    background: canSubmit ? `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` : 'rgba(255,255,255,0.06)',
                    boxShadow: canSubmit ? `0 6px 28px ${glowColor}44` : 'none',
                  }}
                  animate={canSubmit ? { scale: [1, 1.01, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}>
                  {isLast ? (
                    <><Heart size={14} fill="currentColor" /> Share everything</>
                  ) : (
                    <><Send size={13} /> Share &amp; continue</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {questions.map((_, i) => (
            <motion.div key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === step ? 18 : 5,
                height: 5,
                background: i < step
                  ? accentColor
                  : i === step
                  ? accentColor
                  : 'rgba(255,255,255,0.1)',
                opacity: i === step ? 1 : i < step ? 0.7 : 0.35,
              }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

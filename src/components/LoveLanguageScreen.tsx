'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { LOVE_LANGUAGE_QUESTIONS, LOVE_LANGUAGE_RESULTS, LoveLanguage } from '@/data/loveLanguage';
import { notifyOwner } from '@/lib/notify';

export default function LoveLanguageScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const logActivity = useGameStore((s) => s.logActivity);

  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguage, number>>({
    words: 0, touch: 0, time: 0, acts: 0, gifts: 0,
  });
  const [selected, setSelected] = useState<LoveLanguage | null>(null);
  const [notified, setNotified] = useState(false);

  const question = LOVE_LANGUAGE_QUESTIONS[currentQ];
  const isLast = currentQ === LOVE_LANGUAGE_QUESTIONS.length - 1;

  const getWinner = (): LoveLanguage => {
    return (Object.entries(scores) as [LoveLanguage, number][]).reduce(
      (a, b) => (b[1] > a[1] ? b : a)
    )[0];
  };

  const handleSelect = (lang: LoveLanguage) => {
    setSelected(lang);
  };

  const handleNext = () => {
    if (!selected) return;
    const newScores = { ...scores, [selected]: scores[selected] + 1 };
    setScores(newScores);
    setSelected(null);

    if (isLast) {
      const winner = (Object.entries(newScores) as [LoveLanguage, number][]).reduce(
        (a, b) => (b[1] > a[1] ? b : a)
      )[0];
      const result = LOVE_LANGUAGE_RESULTS[winner];
      setStep('result');
      logActivity('mini-game', 'Completed Love Language quiz');
      if (!notified) {
        setNotified(true);
        notifyOwner(
          `💬 <b>She discovered her love language</b>\n\n<b>${result.label} ${result.emoji}</b>\n\n<i>${result.description}</i>\n\n💌 <i>Your note to her: "${result.note}"</i>`
        );
      }
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const handleRestart = () => {
    setStep('quiz');
    setCurrentQ(0);
    setScores({ words: 0, touch: 0, time: 0, acts: 0, gifts: 0 });
    setSelected(null);
  };

  const progress = (currentQ / LOVE_LANGUAGE_QUESTIONS.length) * 100;
  const winner = step === 'result' ? getWinner() : null;
  const result = winner ? LOVE_LANGUAGE_RESULTS[winner] : null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0017 0%, #1a0028 40%, #100015 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.14) 0%, transparent 60%)' }}
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            left: `${14 + i * 14}%`,
            top: `${10 + (i % 4) * 20}%`,
            background: 'rgba(167,139,250,0.4)',
            filter: 'blur(1px)',
          }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5">
          <button
            onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(220,200,255,0.95)' }}>
              Love Language 💬
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(167,139,250,0.5)' }}>
              How do you want to be loved?
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-5"
            >
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(167,139,250,0.55)' }}>
                    Question {currentQ + 1} of {LOVE_LANGUAGE_QUESTIONS.length}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] px-6 py-7"
                style={{
                  background: 'linear-gradient(160deg, rgba(139,92,246,0.12), rgba(88,28,220,0.08))',
                  border: '1px solid rgba(167,139,250,0.22)',
                  boxShadow: '0 8px 44px rgba(139,92,246,0.18)',
                }}
              >
                <p className="text-[18px] font-bold leading-snug text-center"
                  style={{ color: 'rgba(235,225,255,0.95)' }}>
                  {question.prompt}
                </p>
              </motion.div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {question.options.map((opt, i) => {
                  const isSelected = selected === opt.lang;
                  return (
                    <motion.button
                      key={opt.lang}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleSelect(opt.lang)}
                      className="w-full text-left px-5 py-4 rounded-[18px] transition-all"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(139,92,246,0.28), rgba(168,85,247,0.2))'
                          : 'rgba(255,255,255,0.05)',
                        border: isSelected
                          ? '1px solid rgba(167,139,250,0.55)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isSelected ? '0 4px 20px rgba(139,92,246,0.25)' : 'none',
                      }}
                    >
                      <span className="text-[14px] font-medium"
                        style={{ color: isSelected ? 'rgba(230,220,255,0.96)' : 'rgba(200,190,230,0.65)' }}>
                        {opt.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button */}
              <motion.button
                animate={{ opacity: selected ? 1 : 0.3 }}
                onClick={handleNext}
                disabled={!selected}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white mt-auto"
                style={{
                  background: selected
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: selected ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                  cursor: selected ? 'pointer' : 'not-allowed',
                }}
              >
                {isLast ? 'See My Result' : 'Next'} <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {step === 'result' && result && winner && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-6"
            >
              {/* Result header */}
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4, delay: 0.15 }}
                  className="text-7xl mb-4"
                >
                  {result.emoji}
                </motion.div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1"
                  style={{ color: 'rgba(167,139,250,0.5)' }}>
                  Your love language is
                </h2>
                <h3 className="text-[26px] font-black" style={{ color: 'rgba(230,220,255,0.96)' }}>
                  {result.label}
                </h3>
              </div>

              {/* Score breakdown */}
              <div className="rounded-[20px] p-5"
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(167,139,250,0.2)',
                }}>
                <p className="text-[12px] uppercase tracking-widest mb-3 font-bold"
                  style={{ color: 'rgba(167,139,250,0.45)' }}>
                  Your scores
                </p>
                <div className="flex flex-col gap-2">
                  {(Object.entries(scores) as [LoveLanguage, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, score]) => {
                      const r = LOVE_LANGUAGE_RESULTS[lang];
                      const pct = (score / LOVE_LANGUAGE_QUESTIONS.length) * 100;
                      const isWinner = lang === winner;
                      return (
                        <div key={lang} className="flex items-center gap-3">
                          <span className="text-base shrink-0">{r.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-0.5">
                              <span className="text-[11px] font-semibold"
                                style={{ color: isWinner ? 'rgba(220,210,255,0.9)' : 'rgba(180,170,210,0.5)' }}>
                                {r.label}
                              </span>
                              <span className="text-[10px]" style={{ color: 'rgba(167,139,250,0.4)' }}>
                                {score}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden"
                              style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: isWinner
                                    ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                                    : 'rgba(255,255,255,0.15)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Description */}
              <div className="rounded-[20px] p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(88,28,220,0.08))',
                  border: '1px solid rgba(167,139,250,0.25)',
                  boxShadow: '0 6px 30px rgba(139,92,246,0.15)',
                }}>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(220,210,255,0.85)' }}>
                  {result.description}
                </p>
              </div>

              {/* His note */}
              <div className="rounded-[20px] p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,77,141,0.1), rgba(201,36,95,0.06))',
                  border: '1px solid rgba(255,77,141,0.2)',
                  boxShadow: '0 6px 30px rgba(255,77,141,0.1)',
                }}>
                <p className="text-[11px] font-black uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255,120,165,0.5)' }}>
                  A note from him 💌
                </p>
                <p className="text-[14px] leading-relaxed italic" style={{ color: 'rgba(255,220,235,0.88)' }}>
                  "{result.note}"
                </p>
              </div>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { DAILY_QUESTIONS } from '@/data/dailyThreeQuestions';
import { notifyOwner } from '@/lib/notify';

const ACCENT = '#FF9500';
const GLOW   = 'rgba(255,149,0,0.35)';

const TYPE_META = {
  emotional: { emoji: '💗', label: 'Emotional' },
  intimate:  { emoji: '🔥', label: 'Intimate'  },
  open:      { emoji: '✨', label: 'Open'       },
};

function getDailyThree() {
  const day = Math.floor(Date.now() / 86400000);
  const pick = (pool: typeof DAILY_QUESTIONS, offset: number) => pool[(day + offset) % pool.length];
  const emotional = DAILY_QUESTIONS.filter(q => q.type === 'emotional');
  const intimate  = DAILY_QUESTIONS.filter(q => q.type === 'intimate');
  const open      = DAILY_QUESTIONS.filter(q => q.type === 'open');
  return [pick(emotional, 0), pick(intimate, 1), pick(open, 2)];
}

export default function DailyThreeScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const questions = useMemo(() => getDailyThree(), []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string[]; text: string }>>({});
  const [screenPhase, setScreenPhase] = useState<'questions' | 'sent'>('questions');

  const current = questions[step];
  const currentAns = answers[step] ?? { selected: [], text: '' };
  const canNext = currentAns.selected.length > 0 || currentAns.text.trim().length >= 2;
  const isLast = step === questions.length - 1;
  const meta = TYPE_META[current.type];

  const handleOption = (opt: string) => {
    const sel = currentAns.selected;
    setAnswers(prev => ({
      ...prev,
      [step]: { ...currentAns, selected: sel.includes(opt) ? sel.filter(o => o !== opt) : [...sel, opt] },
    }));
  };

  const handleNext = () => {
    if (!canNext) return;
    if (isLast) {
      const lines = questions.map((q, i) => {
        const ans = answers[i] ?? { selected: [], text: '' };
        const parts = [...ans.selected, ...(ans.text.trim() ? [`"${ans.text.trim()}"`] : [])];
        return `${TYPE_META[q.type].emoji} <i>${q.question}</i>\n   <b>${parts.join(' / ') || '—'}</b>`;
      });
      notifyOwner(`🌅 <b>Her Daily Three — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</b>\n\n${lines.join('\n\n')}`);
      logActivity('answer', 'Daily Three — all 3 answered');
      setScreenPhase('sent');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-6 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black text-white">Daily Three 🌅</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>3 questions that change every day — I get all 3</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screenPhase === 'questions' ? (
            <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-5">

              {/* Steps */}
              <div className="flex gap-3 shrink-0">
                {questions.map((q, i) => {
                  const m = TYPE_META[q.type];
                  const done = i < step;
                  const active = i === step;
                  return (
                    <div key={i} className="flex-1 py-2 rounded-[14px] text-center transition-all"
                      style={{
                        background: active ? '#1A1A1A' : '#111111',
                        border: active ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: active ? `0 0 14px ${GLOW}` : 'none',
                        opacity: done ? 0.5 : 1,
                      }}>
                      <div className="text-sm">{m.emoji}</div>
                      <div className="text-[9px] mt-0.5 font-bold"
                        style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.3)' }}>
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">

                  {/* Question */}
                  <div className="rounded-[22px] p-6"
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderLeft: `3px solid ${ACCENT}`,
                    }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: ACCENT }}>
                      {meta.emoji} {meta.label}
                    </p>
                    <p className="text-[18px] font-bold leading-snug text-white">{current.question}</p>
                  </div>

                  {/* Options */}
                  {current.options.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {current.options.map(opt => {
                        const sel = currentAns.selected.includes(opt);
                        return (
                          <button key={opt} onClick={() => handleOption(opt)}
                            className="w-full text-left px-4 py-3.5 rounded-[16px] transition-all"
                            style={{
                              background: sel ? '#1E1E1E' : '#141414',
                              border: sel ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                              boxShadow: sel ? `0 2px 14px ${GLOW}` : 'none',
                            }}>
                            <span className="text-[14px] font-medium"
                              style={{ color: sel ? '#FFFFFF' : 'rgba(255,255,255,0.55)' }}>
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Text */}
                  {current.hasText && (
                    <textarea
                      value={currentAns.text}
                      onChange={e => setAnswers(prev => ({ ...prev, [step]: { ...currentAns, text: e.target.value } }))}
                      placeholder={current.options.length > 0 ? "Or add your own words…" : "Write your answer…"}
                      rows={3}
                      className="w-full resize-none rounded-[16px] px-4 py-3.5 text-[14px] outline-none"
                      style={{
                        background: '#141414',
                        border: currentAns.text.trim() ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                        color: '#FFFFFF',
                      }}
                    />
                  )}

                  <motion.button onClick={handleNext} animate={{ opacity: canNext ? 1 : 0.3 }}
                    disabled={!canNext}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                    style={{
                      background: canNext ? ACCENT : '#1A1A1A',
                      boxShadow: canNext ? `0 4px 20px ${GLOW}` : 'none',
                      cursor: canNext ? 'pointer' : 'not-allowed',
                    }}>
                    {isLast ? <><Send size={15} /> Send All 3</> : <>Next Question <ChevronRight size={16} /></>}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">🌅</div>
              <h2 className="text-[22px] font-black text-white">He got all three</h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Come back tomorrow for 3 new questions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

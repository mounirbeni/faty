'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { DAILY_QUESTIONS } from '@/data/dailyThreeQuestions';
import { notifyOwner } from '@/lib/notify';

const TYPE_META = {
  emotional: { emoji: '💗', label: 'Emotional', color: 'rgba(244,114,182,0.9)' },
  intimate:  { emoji: '🔥', label: 'Intimate',  color: 'rgba(248,113,113,0.9)' },
  open:      { emoji: '✨', label: 'Open',       color: 'rgba(251,191,36,0.9)'  },
};

function getDailyThree() {
  const day = Math.floor(Date.now() / 86400000);
  const pick = (pool: typeof DAILY_QUESTIONS, offset: number) => {
    const idx = (day + offset) % pool.length;
    return pool[idx];
  };
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
      [step]: {
        ...currentAns,
        selected: sel.includes(opt) ? sel.filter(o => o !== opt) : [...sel, opt],
      },
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
      style={{ background: 'linear-gradient(160deg, #0d0800 0%, #1a1000 50%, #0d0800 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.08), transparent 60%)' }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-6 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(253,230,138,0.95)' }}>Daily Three 🌅</h1>
            <p className="text-[11px]" style={{ color: 'rgba(251,191,36,0.4)' }}>3 questions that change every day — I get all 3</p>
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
                        background: active ? 'rgba(251,191,36,0.12)' : done ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                        border: active ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      <div className="text-sm">{m.emoji}</div>
                      <div className="text-[9px] mt-0.5 font-bold"
                        style={{ color: active ? 'rgba(253,230,138,0.8)' : 'rgba(255,255,255,0.25)' }}>
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
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(217,119,6,0.06))',
                      border: '1px solid rgba(251,191,36,0.2)',
                      boxShadow: '0 8px 40px rgba(251,191,36,0.1)',
                    }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: meta.color }}>
                      {meta.emoji} {meta.label}
                    </p>
                    <p className="text-[18px] font-bold leading-snug" style={{ color: 'rgba(253,230,138,0.96)' }}>
                      {current.question}
                    </p>
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
                              background: sel ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                              border: sel ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.07)',
                            }}>
                            <span className="text-[14px] font-medium"
                              style={{ color: sel ? 'rgba(253,230,138,0.96)' : 'rgba(200,180,130,0.65)' }}>
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
                        background: 'rgba(255,255,255,0.05)',
                        border: currentAns.text.trim() ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(253,230,138,0.88)',
                      }}
                    />
                  )}

                  <motion.button onClick={handleNext} animate={{ opacity: canNext ? 1 : 0.3 }}
                    disabled={!canNext}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                    style={{
                      background: canNext ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(255,255,255,0.07)',
                      boxShadow: canNext ? '0 4px 20px rgba(217,119,6,0.4)' : 'none',
                      cursor: canNext ? 'pointer' : 'not-allowed',
                    }}>
                    {isLast ? <><Send size={15} /> Send All 3</> : <>{`Next Question`} <ChevronRight size={16} /></>}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">🌅</div>
              <h2 className="text-[22px] font-black" style={{ color: 'rgba(253,230,138,0.95)' }}>
                He got all three
              </h2>
              <p className="text-[13px]" style={{ color: 'rgba(251,191,36,0.5)' }}>
                Come back tomorrow for 3 new questions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

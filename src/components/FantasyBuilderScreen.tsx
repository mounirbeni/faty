'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { FANTASY_STEPS } from '@/data/fantasyBuilder';
import { notifyOwner } from '@/lib/notify';

const ACCENT = '#FF2060';
const GLOW   = 'rgba(255,32,96,0.35)';

export default function FantasyBuilderScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<number, { option: string; text: string }>>({});
  const [screenPhase, setScreenPhase] = useState<'building' | 'result' | 'sent'>('building');

  const current = FANTASY_STEPS[step];
  const currentChoice = choices[step] ?? { option: '', text: '' };
  const canNext = currentChoice.option !== '' || currentChoice.text.trim().length >= 3;
  const isLast = step === FANTASY_STEPS.length - 1;
  const progress = (step / FANTASY_STEPS.length) * 100;

  const handleNext = () => {
    if (!canNext) return;
    if (isLast) { setScreenPhase('result'); } else { setStep(s => s + 1); }
  };

  const handleSend = () => {
    const lines = FANTASY_STEPS.map((s, i) => {
      const c = choices[i] ?? { option: '', text: '' };
      const answer = [c.option, c.text.trim() ? `"${c.text.trim()}"` : ''].filter(Boolean).join(' + ');
      return `✦ <i>${s.prompt}</i>\n   <b>${answer}</b>`;
    });
    notifyOwner(`🌙 <b>She built her fantasy for you</b>\n\n${lines.join('\n\n')}\n\n<i>This is what she imagines when she thinks of us.</i>`);
    logActivity('answer', 'Fantasy Builder — complete scenario sent');
    setScreenPhase('sent');
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black text-white">Fantasy Builder 🌙</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Build our perfect night — I get the full story</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screenPhase === 'building' && (
            <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-5">

              {/* Progress */}
              <div className="shrink-0">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Step {step + 1} of {FANTASY_STEPS.length}
                  </span>
                </div>
                <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: ACCENT }}
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-4">

                  {/* Prompt */}
                  <div className="rounded-[22px] p-6"
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderLeft: `3px solid ${ACCENT}`,
                    }}>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-2"
                      style={{ color: ACCENT }}>
                      🌙 Build the night
                    </p>
                    <p className="text-[19px] font-black leading-snug text-white">{current.prompt}</p>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2">
                    {current.options.map(opt => {
                      const sel = currentChoice.option === opt;
                      return (
                        <button key={opt}
                          onClick={() => setChoices(prev => ({ ...prev, [step]: { ...currentChoice, option: opt } }))}
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

                  {/* Text */}
                  {current.hasText && (
                    <textarea
                      value={currentChoice.text}
                      onChange={e => setChoices(prev => ({ ...prev, [step]: { ...currentChoice, text: e.target.value } }))}
                      placeholder={current.placeholder ?? "Or describe it in your words…"}
                      rows={3}
                      className="w-full resize-none rounded-[16px] px-4 py-3.5 text-[14px] outline-none"
                      style={{
                        background: '#141414',
                        border: currentChoice.text.trim() ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
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
                    {isLast ? 'See the Full Story' : 'Next'} <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {screenPhase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} className="flex flex-col flex-1 px-4 pb-8 gap-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-center"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Your perfect night
              </p>
              {FANTASY_STEPS.map((s, i) => {
                const c = choices[i] ?? { option: '', text: '' };
                const ans = [c.option, c.text.trim()].filter(Boolean).join(' — ');
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-[18px] p-4"
                    style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-[11px] italic mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.prompt}</p>
                    <p className="text-[14px] font-semibold text-white">{ans}</p>
                  </motion.div>
                );
              })}
              <button onClick={handleSend}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-2"
                style={{ background: ACCENT, boxShadow: `0 4px 20px ${GLOW}` }}>
                <Send size={15} /> Send This Fantasy to Him
              </button>
            </motion.div>
          )}

          {screenPhase === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">🌙</div>
              <h2 className="text-[22px] font-black text-white">He has your fantasy</h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Every step, every choice. I'll read it and think about you.
              </p>
              <button onClick={() => { setStep(0); setChoices({}); setScreenPhase('building'); }}
                className="mt-4 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
                Build Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

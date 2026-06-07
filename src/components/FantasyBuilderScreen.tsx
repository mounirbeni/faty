'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { FANTASY_STEPS } from '@/data/fantasyBuilder';
import { notifyOwner } from '@/lib/notify';

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
    if (isLast) {
      setScreenPhase('result');
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSend = () => {
    const lines = FANTASY_STEPS.map((s, i) => {
      const c = choices[i] ?? { option: '', text: '' };
      const answer = [c.option, c.text.trim() ? `"${c.text.trim()}"` : ''].filter(Boolean).join(' + ');
      return `✦ <i>${s.prompt}</i>\n   <b>${answer}</b>`;
    });
    notifyOwner(
      `🌙 <b>She built her fantasy for you</b>\n\n${lines.join('\n\n')}\n\n<i>This is what she imagines when she thinks of us.</i>`
    );
    logActivity('answer', 'Fantasy Builder — complete scenario sent');
    setScreenPhase('sent');
  };

  const buildStory = () => {
    return FANTASY_STEPS.map((s, i) => {
      const c = choices[i] ?? { option: '', text: '' };
      return c.option || c.text.trim() || '…';
    });
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f0005 0%, #1a000c 50%, #100008 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(244,63,94,0.1), transparent 60%)' }} />

      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="fixed rounded-full pointer-events-none"
          style={{ width: 2, height: 2, left: `${15 + i * 18}%`, top: `${12 + (i % 3) * 24}%`, background: 'rgba(255,77,141,0.35)', filter: 'blur(1px)' }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,200,220,0.95)' }}>Fantasy Builder 🌙</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,140,175,0.45)' }}>Build our perfect night — I get the full story</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screenPhase === 'building' && (
            <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-5">

              {/* Progress */}
              <div className="shrink-0">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px]" style={{ color: 'rgba(255,140,175,0.4)' }}>
                    Step {step + 1} of {FANTASY_STEPS.length}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #c9245f, #ff4d8d)' }}
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-4">

                  {/* Prompt */}
                  <div className="rounded-[22px] p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,36,95,0.14), rgba(0,0,0,0.3))',
                      border: '1px solid rgba(255,77,141,0.25)',
                      boxShadow: '0 8px 44px rgba(201,36,95,0.15)',
                    }}>
                    <p className="text-[11px] uppercase tracking-widest font-bold mb-2"
                      style={{ color: 'rgba(255,140,175,0.45)' }}>
                      🌙 Build the night
                    </p>
                    <p className="text-[19px] font-black leading-snug" style={{ color: 'rgba(255,220,235,0.97)' }}>
                      {current.prompt}
                    </p>
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
                            background: sel ? 'rgba(201,36,95,0.2)' : 'rgba(255,255,255,0.05)',
                            border: sel ? '1px solid rgba(255,77,141,0.45)' : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: sel ? '0 2px 16px rgba(201,36,95,0.2)' : 'none',
                          }}>
                          <span className="text-[14px] font-medium"
                            style={{ color: sel ? 'rgba(255,220,235,0.96)' : 'rgba(200,160,180,0.65)' }}>
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
                        background: 'rgba(255,255,255,0.05)',
                        border: currentChoice.text.trim() ? '1px solid rgba(255,77,141,0.3)' : '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,220,235,0.88)',
                      }}
                    />
                  )}

                  <motion.button onClick={handleNext} animate={{ opacity: canNext ? 1 : 0.3 }}
                    disabled={!canNext}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                    style={{
                      background: canNext ? 'linear-gradient(135deg, #c9245f, #ff4d8d)' : 'rgba(255,255,255,0.07)',
                      boxShadow: canNext ? '0 4px 20px rgba(201,36,95,0.4)' : 'none',
                      cursor: canNext ? 'pointer' : 'not-allowed',
                    }}>
                    {isLast ? 'See the Full Story' : `Next`} <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {screenPhase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} className="flex flex-col flex-1 px-4 pb-8 gap-4">
              <p className="text-[12px] font-black uppercase tracking-widest text-center"
                style={{ color: 'rgba(255,140,175,0.4)' }}>
                Your perfect night
              </p>
              {FANTASY_STEPS.map((s, i) => {
                const c = choices[i] ?? { option: '', text: '' };
                const ans = [c.option, c.text.trim()].filter(Boolean).join(' — ');
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-[18px] p-4"
                    style={{ background: 'rgba(255,77,141,0.07)', border: '1px solid rgba(255,77,141,0.15)' }}>
                    <p className="text-[11px] italic mb-1.5" style={{ color: 'rgba(255,140,175,0.5)' }}>{s.prompt}</p>
                    <p className="text-[14px] font-semibold" style={{ color: 'rgba(255,220,235,0.9)' }}>{ans}</p>
                  </motion.div>
                );
              })}
              <button onClick={handleSend}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-2"
                style={{ background: 'linear-gradient(135deg, #c9245f, #ff4d8d)', boxShadow: '0 4px 20px rgba(201,36,95,0.4)' }}>
                <Send size={15} /> Send This Fantasy to Him
              </button>
            </motion.div>
          )}

          {screenPhase === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">🌙</div>
              <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,220,235,0.95)' }}>
                He has your fantasy
              </h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,140,175,0.5)' }}>
                Every step, every choice. I'll read it and think about you.
              </p>
              <button onClick={() => { setStep(0); setChoices({}); setScreenPhase('building'); }}
                className="mt-4 px-6 py-3 rounded-2xl text-[13px] font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,220,235,0.7)' }}>
                Build Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

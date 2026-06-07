'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { THOUGHT_STARTERS } from '@/data/finishMyThought';
import { notifyOwner } from '@/lib/notify';

const STARTERS_PER_SESSION = 5;

function getDailyStarters(): string[] {
  const day = Math.floor(Date.now() / 86400000);
  const pool = [...THOUGHT_STARTERS];
  // Seeded shuffle by day
  let seed = day;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, STARTERS_PER_SESSION);
}

export default function FinishMyThoughtScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const starters = useMemo(() => getDailyStarters(), []);
  const [step, setStep] = useState(0);
  const [completions, setCompletions] = useState<Record<number, string>>({});
  const [phase, setLocalPhase] = useState<'writing' | 'review' | 'sent'>('writing');

  const current = starters[step];
  const currentText = completions[step] ?? '';
  const canContinue = currentText.trim().length >= 5;
  const isLast = step === starters.length - 1;

  const handleNext = () => {
    if (!canContinue) return;
    if (isLast) {
      setLocalPhase('review');
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSend = () => {
    const lines = starters.map((starter, i) =>
      `💬 <i>${starter}</i>\n   <b>${completions[i]?.trim() ?? '—'}</b>`
    );
    notifyOwner(
      `✍️ <b>She finished her thoughts tonight</b>\n\n${lines.join('\n\n')}`
    );
    logActivity('answer', 'Finish My Thought — 5 completions sent');
    setLocalPhase('sent');
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #000a1a 0%, #000e22 50%, #00080f 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(56,189,248,0.08), transparent 60%)' }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-6 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(186,230,253,0.95)' }}>Finish My Thought ✍️</h1>
            <p className="text-[11px]" style={{ color: 'rgba(125,211,252,0.45)' }}>Complete these 5 sentences — I read every word</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'writing' && (
            <motion.div key="writing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-5">

              {/* Progress dots */}
              <div className="flex justify-center gap-2 shrink-0">
                {starters.map((_, i) => (
                  <div key={i} className="rounded-full transition-all"
                    style={{
                      width: i === step ? 20 : 6, height: 6,
                      background: i < step ? 'rgba(56,189,248,0.7)' : i === step ? 'rgba(56,189,248,1)' : 'rgba(255,255,255,0.1)',
                    }} />
                ))}
              </div>

              {/* Sentence starter */}
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">

                  <div className="rounded-[22px] p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(14,165,233,0.06))',
                      border: '1px solid rgba(56,189,248,0.2)',
                      boxShadow: '0 8px 40px rgba(56,189,248,0.1)',
                    }}>
                    <p className="text-[13px] font-bold mb-1" style={{ color: 'rgba(125,211,252,0.5)' }}>
                      Sentence {step + 1} of {starters.length}
                    </p>
                    <p className="text-[20px] font-black leading-snug" style={{ color: 'rgba(186,230,253,0.96)' }}>
                      {current}
                    </p>
                  </div>

                  <textarea
                    value={currentText}
                    onChange={e => setCompletions(prev => ({ ...prev, [step]: e.target.value }))}
                    placeholder="Continue the sentence honestly…"
                    rows={4}
                    autoFocus
                    className="w-full resize-none rounded-[18px] px-5 py-4 text-[15px] outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: currentText.trim() ? '1px solid rgba(56,189,248,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(186,230,253,0.9)',
                      lineHeight: 1.6,
                    }}
                  />

                  <motion.button onClick={handleNext} animate={{ opacity: canContinue ? 1 : 0.3 }}
                    disabled={!canContinue}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                    style={{
                      background: canContinue ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : 'rgba(255,255,255,0.07)',
                      boxShadow: canContinue ? '0 4px 20px rgba(14,165,233,0.4)' : 'none',
                      cursor: canContinue ? 'pointer' : 'not-allowed',
                    }}>
                    {isLast ? 'Review All' : 'Next'} <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} className="flex flex-col flex-1 px-4 pb-8 gap-4 overflow-y-auto">

              <p className="text-[12px] font-bold uppercase tracking-widest text-center"
                style={{ color: 'rgba(125,211,252,0.4)' }}>
                Your completions tonight
              </p>

              {starters.map((starter, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[18px] p-4"
                  style={{
                    background: 'rgba(56,189,248,0.06)',
                    border: '1px solid rgba(56,189,248,0.15)',
                  }}>
                  <p className="text-[12px] italic mb-2" style={{ color: 'rgba(125,211,252,0.55)' }}>
                    {starter}
                  </p>
                  <p className="text-[14px] font-semibold" style={{ color: 'rgba(186,230,253,0.9)' }}>
                    {completions[i]?.trim()}
                  </p>
                </motion.div>
              ))}

              <button onClick={handleSend}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-2"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', boxShadow: '0 4px 20px rgba(14,165,233,0.4)' }}>
                <Send size={15} /> Send to Him
              </button>
            </motion.div>
          )}

          {phase === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">✍️</div>
              <h2 className="text-[22px] font-black" style={{ color: 'rgba(186,230,253,0.95)' }}>He got your thoughts</h2>
              <p className="text-[13px]" style={{ color: 'rgba(125,211,252,0.55)' }}>
                All 5. Every honest word. Thank you for writing.
              </p>
              <button onClick={() => { setStep(0); setCompletions({}); setLocalPhase('writing'); }}
                className="mt-4 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Write Again Tomorrow
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

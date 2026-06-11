'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { THOUGHT_STARTERS } from '@/data/finishMyThought';
import { notifyOwner } from '@/lib/notify';

const ACCENT = '#0A84FF';
const GLOW   = 'rgba(10,132,255,0.35)';
const STARTERS_PER_SESSION = 5;

function getDailyStarters(): string[] {
  const day = Math.floor(Date.now() / 86400000);
  const pool = [...THOUGHT_STARTERS];
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
    if (isLast) { setLocalPhase('review'); } else { setStep(s => s + 1); }
  };

  const handleSend = () => {
    const lines = starters.map((starter, i) =>
      `💬 <i>${starter}</i>\n   <b>${completions[i]?.trim() ?? '—'}</b>`
    );
    notifyOwner(`✍️ <b>She finished her thoughts tonight</b>\n\n${lines.join('\n\n')}`);
    logActivity('answer', 'Finish My Thought — 5 completions sent');
    setLocalPhase('sent');
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
            <h1 className="text-[18px] font-black text-white">Finish My Thought ✍️</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Complete these 5 sentences — I read every word</p>
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
                      background: i < step ? ACCENT : i === step ? ACCENT : 'rgba(255,255,255,0.12)',
                      opacity: i < step ? 0.6 : 1,
                    }} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">

                  <div className="rounded-[22px] p-6"
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderLeft: `3px solid ${ACCENT}`,
                    }}>
                    <p className="text-[12px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Sentence {step + 1} of {starters.length}
                    </p>
                    <p className="text-[20px] font-black leading-snug text-white">{current}</p>
                  </div>

                  <textarea
                    value={currentText}
                    onChange={e => setCompletions(prev => ({ ...prev, [step]: e.target.value }))}
                    placeholder="Continue the sentence honestly…"
                    rows={4}
                    autoFocus
                    className="w-full resize-none rounded-[18px] px-5 py-4 text-[15px] outline-none"
                    style={{
                      background: '#141414',
                      border: currentText.trim() ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                      color: '#FFFFFF',
                      lineHeight: 1.6,
                    }}
                  />

                  <motion.button onClick={handleNext} animate={{ opacity: canContinue ? 1 : 0.3 }}
                    disabled={!canContinue}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                    style={{
                      background: canContinue ? ACCENT : '#1A1A1A',
                      boxShadow: canContinue ? `0 4px 20px ${GLOW}` : 'none',
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

              <p className="text-[11px] font-black uppercase tracking-widest text-center"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Your completions tonight
              </p>

              {starters.map((starter, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[18px] p-4"
                  style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-[12px] italic mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {starter}
                  </p>
                  <p className="text-[14px] font-semibold text-white">{completions[i]?.trim()}</p>
                </motion.div>
              ))}

              <button onClick={handleSend}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-2"
                style={{ background: ACCENT, boxShadow: `0 4px 20px ${GLOW}` }}>
                <Send size={15} /> Send to Him
              </button>
            </motion.div>
          )}

          {phase === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">✍️</div>
              <h2 className="text-[22px] font-black text-white">He got your thoughts</h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                All 5. Every honest word. Thank you for writing.
              </p>
              <button onClick={() => { setStep(0); setCompletions({}); setLocalPhase('writing'); }}
                className="mt-4 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
                Write Again Tomorrow
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { RATE_ITEMS } from '@/data/rateUsItems';
import { notifyOwner } from '@/lib/notify';

export default function RateUsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [values, setValues] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [sent, setSent] = useState(false);

  const allRated = RATE_ITEMS.every(item => values[item.id] !== undefined);
  const avg = allRated
    ? Math.round(Object.values(values).reduce((a, b) => a + b, 0) / RATE_ITEMS.length * 10) / 10
    : null;

  const handleSend = () => {
    if (!allRated) return;
    const lines = RATE_ITEMS.map(item => {
      const v = values[item.id];
      const bar = '█'.repeat(v) + '░'.repeat(10 - v);
      const note = notes[item.id]?.trim();
      return `${item.emoji} <b>${item.label}</b>\n   ${bar} <b>${v}/10</b>${note ? `\n   💬 "${note}"` : ''}`;
    });
    notifyOwner(
      `📊 <b>She rated us tonight</b>\n\n${lines.join('\n\n')}\n\n✨ <b>Average: ${avg}/10</b>`
    );
    logActivity('answer', `Rate Us — avg ${avg}/10`);
    setSent(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080014 0%, #14001e 50%, #08000e 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.12), transparent 60%)' }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-6 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(220,200,255,0.95)' }}>Rate Us 📊</h1>
            <p className="text-[11px]" style={{ color: 'rgba(167,139,250,0.5)' }}>Slide to tell me how we're doing — I see every number</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">💫</div>
              <h2 className="text-[24px] font-black" style={{ color: 'rgba(220,200,255,0.95)' }}>
                {avg} / 10
              </h2>
              <p className="text-[14px]" style={{ color: 'rgba(167,139,250,0.6)' }}>
                Average score you gave us tonight
              </p>
              <p className="text-[13px] italic" style={{ color: 'rgba(200,180,255,0.5)' }}>
                I got your report. Every number means something to me.
              </p>
              <button onClick={() => setSent(false)}
                className="mt-4 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Rate Again
              </button>
            </motion.div>
          ) : (
            <motion.div key="sliders" className="flex flex-col gap-5 px-4 pb-8">
              {RATE_ITEMS.map((item, i) => {
                const val = values[item.id] ?? 0;
                const hasVal = values[item.id] !== undefined;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-[20px] p-5"
                    style={{
                      background: hasVal ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)',
                      border: hasVal ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.3s',
                    }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <p className="text-[13px] font-semibold" style={{ color: 'rgba(220,210,255,0.85)' }}>
                          {item.label}
                        </p>
                      </div>
                      <span className="text-[20px] font-black tabular-nums"
                        style={{ color: hasVal ? 'rgba(200,180,255,0.95)' : 'rgba(255,255,255,0.2)' }}>
                        {hasVal ? val : '–'}
                      </span>
                    </div>

                    {/* Slider */}
                    <input
                      type="range" min={1} max={10} step={1}
                      value={hasVal ? val : 5}
                      onChange={e => setValues(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                      className="w-full h-2 rounded-full outline-none appearance-none cursor-pointer"
                      style={{
                        background: hasVal
                          ? `linear-gradient(90deg, #7c3aed ${(val - 1) / 9 * 100}%, rgba(255,255,255,0.08) ${(val - 1) / 9 * 100}%)`
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px]" style={{ color: 'rgba(167,139,250,0.35)' }}>{item.lowLabel}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(167,139,250,0.35)' }}>{item.highLabel}</span>
                    </div>

                    {/* Optional note */}
                    {hasVal && (
                      <motion.textarea
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        placeholder="Add a note… (optional)"
                        value={notes[item.id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                        rows={2}
                        className="mt-3 w-full resize-none rounded-[12px] px-3 py-2.5 text-[12px] outline-none"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: 'rgba(220,210,255,0.8)',
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Send button */}
              <motion.button
                onClick={handleSend}
                animate={{ opacity: allRated ? 1 : 0.35 }}
                disabled={!allRated}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-2"
                style={{
                  background: allRated ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.07)',
                  boxShadow: allRated ? '0 4px 24px rgba(124,58,237,0.45)' : 'none',
                  cursor: allRated ? 'pointer' : 'not-allowed',
                }}>
                <Send size={15} /> Send Report to Him
              </motion.button>

              {!allRated && (
                <p className="text-[11px] text-center" style={{ color: 'rgba(167,139,250,0.3)' }}>
                  Rate all 8 to send
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

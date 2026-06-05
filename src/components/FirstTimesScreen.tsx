'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const FIRSTS = [
  { id: 0, text: 'First time I felt completely safe with you', emoji: '🛡️' },
  { id: 1, text: 'First time I thought about a future with you', emoji: '🌅' },
  { id: 2, text: 'First time your name made my heart do something', emoji: '💓' },
  { id: 3, text: 'First time I wanted you to never leave', emoji: '🫂' },
  { id: 4, text: 'First time I missed you in a physical way', emoji: '🌊' },
  { id: 5, text: 'First time I realized I was in love', emoji: '🌹' },
  { id: 6, text: 'First time I let myself be fully honest with you', emoji: '🔓' },
  { id: 7, text: 'First time I imagined saying yes to forever with you', emoji: '💍' },
];

const INTENSITIES = [
  { level: 1, label: 'Quiet', hearts: 1, color: '#a78bfa' },
  { level: 2, label: 'Strong', hearts: 2, color: '#c084fc' },
  { level: 3, label: 'Overwhelming', hearts: 3, color: '#e879f9' },
];

const SPARKLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 79.3) % 100,
  y: (i * 53.1) % 100,
  size: 1 + (i % 3) * 0.8,
  dur: 3 + (i % 5) * 1.1,
  delay: (i * 0.25) % 4.5,
}));

interface FirstEntry { intensity: number; word: string }

export default function FirstTimesScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState<Record<number, FirstEntry>>({});
  const [done, setDone] = useState(false);

  const current = FIRSTS[step];
  const entry = entries[current.id] ?? { intensity: 0, word: '' };
  const progress = ((step + (done ? 1 : 0)) / FIRSTS.length) * 100;

  const setIntensity = (level: number) =>
    setEntries(prev => ({ ...prev, [current.id]: { ...entry, intensity: level } }));

  const setWord = (word: string) =>
    setEntries(prev => ({ ...prev, [current.id]: { ...entry, word } }));

  const handleNext = () => {
    if (step === FIRSTS.length - 1) {
      const lines = FIRSTS.map(f => {
        const e = entries[f.id];
        const intensity = INTENSITIES.find(i => i.level === e?.intensity)?.label ?? '—';
        return `${f.text}\n→ ${intensity}  ·  "${e?.word?.trim() || '…'}"`;
      }).join('\n\n');
      notifyOwner(`💜 <b>Her emotional firsts…</b>\n\n${lines}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const canProceed = entry.intensity > 0;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0018 0%, #180030 45%, #0a0020 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(167,139,250,0.12) 0%, transparent 65%)' }} />

      {SPARKLES.map(s => (
        <motion.div key={s.id} className="fixed pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size + 1, height: s.size + 1,
            background: 'rgba(196,181,253,0.6)',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.3, 0.8], rotate: [0, 180, 360] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.18)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(216,196,255,0.95)' }}>First Times</h1>
            <p className="text-[11px]" style={{ color: 'rgba(160,130,220,0.45)' }}>The moments that marked us</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(160,130,220,0.4)' }}>{step + 1} / {FIRSTS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-5">

                {/* Moment card */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <motion.span style={{ fontSize: 46 }}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08 }}>
                    {current.emoji}
                  </motion.span>
                  <div className="rounded-[22px] p-5 w-full"
                    style={{
                      background: 'linear-gradient(145deg, rgba(15,5,40,0.95), rgba(10,3,30,0.95))',
                      border: '1px solid rgba(124,58,237,0.22)',
                      boxShadow: '0 6px 30px rgba(124,58,237,0.1)',
                    }}>
                    <p className="text-[17px] font-bold leading-snug" style={{ color: 'rgba(220,205,255,0.95)' }}>
                      {current.text}
                    </p>
                  </div>
                </div>

                {/* Intensity selector */}
                <div>
                  <p className="text-center text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: 'rgba(160,130,220,0.4)' }}>
                    How intense was it?
                  </p>
                  <div className="flex gap-3 justify-center">
                    {INTENSITIES.map(int => {
                      const isSelected = entry.intensity === int.level;
                      return (
                        <button key={int.level} onClick={() => setIntensity(int.level)}
                          className="flex flex-col items-center gap-2 px-5 py-3.5 rounded-[18px] transition-all"
                          style={{
                            background: isSelected ? `rgba(124,58,237,0.2)` : 'rgba(255,255,255,0.04)',
                            border: isSelected ? `1px solid rgba(192,132,252,0.4)` : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: isSelected ? '0 4px 20px rgba(124,58,237,0.2)' : 'none',
                          }}>
                          <div className="flex gap-0.5">
                            {Array.from({ length: int.hearts }).map((_, hi) => (
                              <Heart key={hi} size={14} fill={isSelected ? int.color : 'none'}
                                style={{ color: isSelected ? int.color : 'rgba(160,130,220,0.4)' }} />
                            ))}
                          </div>
                          <span className="text-[11px] font-semibold"
                            style={{ color: isSelected ? 'rgba(216,196,255,0.9)' : 'rgba(160,130,220,0.4)' }}>
                            {int.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* One word */}
                <div className="rounded-[18px] overflow-hidden"
                  style={{ border: '1px solid rgba(124,58,237,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                  <input
                    type="text"
                    value={entry.word}
                    onChange={e => setWord(e.target.value)}
                    placeholder="One word that describes it…"
                    maxLength={30}
                    className="w-full bg-transparent px-4 py-4 text-[14px] outline-none placeholder:text-white/15 text-center"
                    style={{ color: 'rgba(216,196,255,0.9)', caretColor: '#c084fc', letterSpacing: '0.05em' }}
                  />
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(160,130,220,0.45)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    disabled={!canProceed}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all"
                    style={{
                      background: canProceed ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.06)',
                      boxShadow: canProceed ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                      color: canProceed ? 'white' : 'rgba(255,255,255,0.2)',
                    }}>
                    {step === FIRSTS.length - 1 ? 'Complete ✦' : 'Next →'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.span style={{ fontSize: 54 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  💜
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(216,196,255,0.95)' }}>
                    Every first lives in me
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(160,130,220,0.6)' }}>
                    The quiet intensity you felt in each of those moments — I carry it now too.
                  </p>
                </div>
                {/* Summary */}
                <div className="w-full flex flex-col gap-2">
                  {FIRSTS.map(f => {
                    const e = entries[f.id];
                    if (!e?.intensity) return null;
                    const int = INTENSITIES.find(i => i.level === e.intensity);
                    return (
                      <div key={f.id} className="flex items-center gap-2.5 px-4 py-2.5 rounded-[14px]"
                        style={{ background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.14)' }}>
                        <span style={{ fontSize: 16 }}>{f.emoji}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: e.intensity }).map((_, i) => (
                            <Heart key={i} size={10} fill={int?.color} style={{ color: int?.color }} />
                          ))}
                        </div>
                        {e.word && <span className="text-[12px] italic ml-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>"{e.word}"</span>}
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}>
                  Back to Our Universe
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

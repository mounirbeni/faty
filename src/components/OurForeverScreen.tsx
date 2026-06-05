'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const DIMENSIONS = [
  {
    id: 'home',
    icon: '🏡',
    title: 'Our Home',
    question: 'Where I see us building our life…',
    options: [
      { label: 'A warm apartment in a city we chose together', icon: '🌆' },
      { label: 'A quiet house with a garden where we grow old', icon: '🌿' },
      { label: 'Somewhere new — just us figuring it out', icon: '🗺️' },
      { label: 'Wherever you are is home enough for me', icon: '💗' },
    ],
  },
  {
    id: 'wedding',
    icon: '💍',
    title: 'Our Wedding',
    question: 'How I see us beginning forever…',
    options: [
      { label: 'Intimate — just the people we love most', icon: '🕯️' },
      { label: 'Something beautiful that we planned together', icon: '🌸' },
      { label: 'Simple, honest, and deeply ours', icon: '✦' },
      { label: 'I haven\'t thought about the ceremony — just the life after', icon: '🌙' },
    ],
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    title: 'Our Family',
    question: 'What I dream our love will build…',
    options: [
      { label: 'Children who grow up feeling completely loved', icon: '🌱' },
      { label: 'A family that\'s small but full of real warmth', icon: '🔥' },
      { label: 'Whatever comes — as long as we face it together', icon: '🤝' },
      { label: 'I don\'t know yet — I just know I want to build it with you', icon: '💭' },
    ],
  },
  {
    id: 'everyday',
    icon: '☀️',
    title: 'Our Everyday',
    question: 'What love looks like on an ordinary morning…',
    options: [
      { label: 'Quiet coffee and honest conversations', icon: '☕' },
      { label: 'Chaos and laughter and figuring it out', icon: '😂' },
      { label: 'Tenderness in the smallest ordinary moments', icon: '🌷' },
      { label: 'Just being close — nothing else matters', icon: '🫂' },
    ],
  },
  {
    id: 'forever',
    icon: '∞',
    title: 'Our Forever',
    question: 'What I believe this love becomes…',
    options: [
      { label: 'Something deeper and more beautiful than I can imagine', icon: '🌌' },
      { label: 'A love that gets stronger with every year', icon: '📈' },
      { label: 'A story I want to tell our children one day', icon: '📖' },
      { label: 'Everything I have ever wanted', icon: '🌹' },
    ],
  },
];

const ORBS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 71.3) % 100,
  y: (i * 53.7) % 100,
  size: 4 + (i % 3) * 4,
  dur: 6 + (i % 4) * 2,
  delay: i * 0.6,
}));

export default function OurForeverScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const current = DIMENSIONS[step];
  const selected = selections[current.id];
  const progress = ((step + (done ? 1 : 0)) / DIMENSIONS.length) * 100;

  const handleSelect = (idx: number) => {
    setSelections(prev => ({ ...prev, [current.id]: idx }));
  };

  const handleNext = () => {
    if (step === DIMENSIONS.length - 1) {
      const vision = DIMENSIONS.map(d => {
        const sel = selections[d.id];
        const opt = sel !== undefined ? d.options[sel].label : '…';
        return `${d.title}: "${opt}"`;
      }).join('\n');
      notifyOwner(`∞ <b>She built our forever vision</b>\n\n${vision}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f0800 0%, #1f1000 45%, #160c00 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(245,158,11,0.12) 0%, transparent 65%)' }} />

      {ORBS.map(o => (
        <motion.div key={o.id} className="fixed rounded-full pointer-events-none"
          style={{
            left: `${o.x}%`, top: `${o.y}%`, width: o.size, height: o.size,
            background: 'radial-gradient(circle, rgba(251,191,36,0.25), transparent)',
            filter: 'blur(2px)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,184,77,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,220,130,0.95)' }}>Our Forever</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,180,60,0.45)' }}>A vision of our life together</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(255,180,60,0.4)' }}>{step + 1} / {DIMENSIONS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #d97706, #fbbf24)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-5 pt-2">

                <div className="flex flex-col items-center gap-3 text-center">
                  <motion.span style={{ fontSize: 44 }}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}>
                    {current.icon}
                  </motion.span>
                  <div>
                    <h2 className="text-[20px] font-black" style={{ color: 'rgba(255,220,130,0.95)' }}>{current.title}</h2>
                    <p className="text-[13px] mt-1" style={{ color: 'rgba(255,180,80,0.55)' }}>{current.question}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {current.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className="flex items-center gap-3.5 px-4 py-4 rounded-[18px] text-left transition-all"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))'
                            : 'rgba(255,255,255,0.04)',
                          border: isSelected
                            ? '1px solid rgba(245,158,11,0.4)'
                            : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: isSelected ? '0 4px 20px rgba(245,158,11,0.15)' : 'none',
                        }}
                        whileTap={{ scale: 0.98 }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                        <span className="text-[13.5px] font-semibold leading-snug"
                          style={{ color: isSelected ? 'rgba(255,230,150,0.95)' : 'rgba(255,200,100,0.55)' }}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <motion.div className="ml-auto shrink-0"
                            initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
                              <span className="text-white text-[10px] font-black">✓</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,200,100,0.45)' }}>
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={selected === undefined}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all"
                    style={{
                      background: selected !== undefined ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'rgba(255,255,255,0.07)',
                      boxShadow: selected !== undefined ? '0 4px 20px rgba(217,119,6,0.4)' : 'none',
                      color: selected !== undefined ? 'white' : 'rgba(255,255,255,0.25)',
                    }}>
                    {step === DIMENSIONS.length - 1 ? 'Complete Our Vision ✦' : 'Next →'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.span style={{ fontSize: 56 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  ∞
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(255,220,130,0.95)' }}>
                    I can see it so clearly
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,180,80,0.6)' }}>
                    Every choice you just made tells me something about the life you want to build with me. I want to build all of it with you.
                  </p>
                </div>
                {/* Vision summary */}
                <div className="w-full rounded-[20px] p-5 flex flex-col gap-2.5 text-left"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                  {DIMENSIONS.map(d => {
                    const sel = selections[d.id];
                    const opt = sel !== undefined ? d.options[sel] : null;
                    return opt ? (
                      <div key={d.id} className="flex items-start gap-2.5">
                        <span style={{ fontSize: 16 }}>{opt.icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,180,60,0.45)' }}>{d.title} · </span>
                          <span className="text-[12px]" style={{ color: 'rgba(255,220,140,0.8)' }}>{opt.label}</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 24px rgba(217,119,6,0.4)' }}>
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

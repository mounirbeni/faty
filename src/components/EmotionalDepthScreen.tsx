'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const QUESTIONS = [
  {
    id: 0,
    question: 'What does love feel like for you when it\'s real — not the word, but the feeling in your body when you see my name light up your phone?',
    hint: 'Close your eyes and describe it…',
  },
  {
    id: 1,
    question: 'What\'s changed inside you since you started falling for someone you can only hold through a screen?',
    hint: 'Something in how you see yourself, or what you\'re willing to be patient for…',
  },
  {
    id: 2,
    question: 'What does it feel like in your body when we\'re finally on a call and the whole distance collapses for an hour?',
    hint: 'Warmth, release, peace, something else…',
  },
  {
    id: 3,
    question: 'What are you most afraid of losing between us because of this distance?',
    hint: 'Not the big fears — the specific quiet ones',
  },
  {
    id: 4,
    question: 'What do you need from this love that\'s harder to give from this far away?',
    hint: 'The thing you always hoped someone would give without being asked…',
  },
  {
    id: 5,
    question: 'If I could feel exactly what you feel when my face appears on your phone — what would I feel?',
    hint: 'Paint it for me in feeling-words, not logic-words',
  },
];

const EMOTION_TAGS = [
  { label: 'Joy', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)' },
  { label: 'Love', color: '#fb7185', bg: 'rgba(251,113,133,0.15)', border: 'rgba(251,113,133,0.3)' },
  { label: 'Hope', color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
  { label: 'Longing', color: '#818cf8', bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.3)' },
  { label: 'Peace', color: '#67e8f9', bg: 'rgba(103,232,249,0.15)', border: 'rgba(103,232,249,0.3)' },
  { label: 'Fear', color: '#f472b6', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.3)' },
];

const AURORA = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  width: 200 + i * 120,
  left: 10 + i * 25,
  top: 10 + i * 18,
  color: ['rgba(99,102,241,0.07)', 'rgba(139,92,246,0.06)', 'rgba(167,139,250,0.05)'][i],
  dur: 8 + i * 3,
  delay: i * 2,
}));

interface Entry { answer: string; tag: string }

export default function EmotionalDepthScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState<Record<number, Entry>>({});
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step];
  const entry = entries[current.id] ?? { answer: '', tag: '' };
  const progress = ((step + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  const setAnswer = (val: string) =>
    setEntries(prev => ({ ...prev, [current.id]: { ...entry, answer: val } }));
  const setTag = (tag: string) =>
    setEntries(prev => ({ ...prev, [current.id]: { ...entry, tag: entry.tag === tag ? '' : tag } }));

  const handleNext = () => {
    if (step === QUESTIONS.length - 1) {
      const lines = QUESTIONS.map(q => {
        const e = entries[q.id];
        return `${q.question}\n${e?.tag ? `[${e.tag}] ` : ''}${e?.answer?.trim() || '…'}`;
      }).join('\n\n');
      notifyOwner(`🌌 <b>Her emotional depth…</b>\n\n${lines}`);
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #02010f 0%, #060520 45%, #030215 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Aurora streaks */}
      {AURORA.map(a => (
        <motion.div key={a.id} className="fixed pointer-events-none rounded-full"
          style={{ width: a.width, height: 80, left: `${a.left}%`, top: `${a.top}%`, background: a.color, filter: 'blur(40px)' }}
          animate={{ x: [-30, 30, -30], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: a.dur, delay: a.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.18)' }}>
            <ArrowLeft size={16} className="text-white/55" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(200,210,255,0.95)' }}>Emotional Depth</h1>
            <p className="text-[11px]" style={{ color: 'rgba(130,145,220,0.45)' }}>Six questions that go all the way down</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(130,145,220,0.4)' }}>{step + 1} / {QUESTIONS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4338ca, #818cf8)' }}
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

                {/* Question */}
                <div className="rounded-[24px] p-5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(8,6,35,0.97), rgba(4,3,22,0.97))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    boxShadow: '0 8px 40px rgba(67,56,202,0.1)',
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full"
                          style={{ background: i < step ? 'rgba(129,140,248,0.6)' : i === step ? 'rgba(129,140,248,1)' : 'rgba(255,255,255,0.12)' }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[16px] font-bold leading-snug" style={{ color: 'rgba(200,210,255,0.95)' }}>
                    {current.question}
                  </p>
                </div>

                {/* Emotion tag selector */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-bold mb-2.5" style={{ color: 'rgba(110,130,200,0.4)' }}>
                    What emotion does this bring up?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {EMOTION_TAGS.map(tag => {
                      const isSelected = entry.tag === tag.label;
                      return (
                        <button key={tag.label} onClick={() => setTag(tag.label)}
                          className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                          style={{
                            background: isSelected ? tag.bg : 'rgba(255,255,255,0.04)',
                            border: isSelected ? `1px solid ${tag.border}` : '1px solid rgba(255,255,255,0.08)',
                            color: isSelected ? tag.color : 'rgba(130,145,220,0.45)',
                            boxShadow: isSelected ? `0 2px 12px ${tag.bg}` : 'none',
                          }}>
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Answer */}
                <div className="rounded-[18px] overflow-hidden"
                  style={{ border: '1px solid rgba(67,56,202,0.18)', background: 'rgba(255,255,255,0.03)' }}>
                  <textarea
                    value={entry.answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder={current.hint}
                    rows={5}
                    className="w-full bg-transparent px-4 pt-4 pb-2 text-[14px] resize-none outline-none placeholder:text-white/15"
                    style={{ color: 'rgba(200,210,255,0.9)', caretColor: '#818cf8', lineHeight: '1.7' }}
                  />
                  <div className="px-4 pb-3 flex justify-end">
                    <span className="text-[10px]" style={{ color: 'rgba(110,130,200,0.25)' }}>{entry.answer?.length || 0} chars</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(130,145,220,0.4)' }}>
                      ← Back
                    </button>
                  )}
                  <button onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #4338ca, #6366f1)',
                      boxShadow: '0 4px 20px rgba(67,56,202,0.35)',
                      opacity: entry.answer?.trim() ? 1 : 0.45,
                    }}>
                    {step === QUESTIONS.length - 1 ? 'Complete ✦' : 'Deeper →'}
                  </button>
                </div>
                {!entry.answer?.trim() && (
                  <button onClick={handleNext} className="text-center text-[11px]" style={{ color: 'rgba(110,130,200,0.28)' }}>
                    Skip this one
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.span style={{ fontSize: 54 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                  🌌
                </motion.span>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(200,210,255,0.95)' }}>
                    I went deep with you
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(130,145,220,0.6)' }}>
                    These answers aren't just words. They are who you are when you're not performing for anyone. I love that person completely.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)', boxShadow: '0 4px 24px rgba(67,56,202,0.4)' }}>
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

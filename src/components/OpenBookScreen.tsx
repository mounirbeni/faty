'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { OPEN_BOOK_QUESTIONS, OBCategory } from '@/data/openBookQuestions';
import { notifyOwner } from '@/lib/notify';

const CAT_META: Record<OBCategory, { label: string; emoji: string; accent: string; glow: string }> = {
  feel: { label: 'How I Feel',   emoji: '💗', accent: '#FF2060', glow: 'rgba(255,32,96,0.35)'  },
  want: { label: 'What I Want',  emoji: '🌙', accent: '#5856D6', glow: 'rgba(88,86,214,0.35)'  },
  bold: { label: 'Bold',         emoji: '🔥', accent: '#FF3B30', glow: 'rgba(255,59,48,0.35)'  },
};

export default function OpenBookScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [category, setCategory] = useState<OBCategory>('feel');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [answered, setAnswered] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => OPEN_BOOK_QUESTIONS.filter(q => q.category === category), [category]);
  const remaining = questions.filter(q => !answered.includes(q.id));
  const current = remaining[idx] ?? remaining[0];
  const meta = CAT_META[category];
  const progress = ((questions.length - remaining.length) / questions.length) * 100;
  const canSubmit = selected.length > 0 || text.trim().length >= 2;

  const handleOption = (opt: string) => {
    setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const handleNext = () => {
    if (!current || !canSubmit) return;
    const answerText = [...selected, ...(text.trim() ? [`"${text.trim()}"`] : [])].join(' / ');
    notifyOwner(`📖 <b>Open Book — ${meta.label} ${meta.emoji}</b>\n\n<i>${current.question}</i>\n\n💬 <b>${answerText}</b>`);
    logActivity('answer', `Open Book: ${current.question.slice(0, 40)}`);
    setAnswered(prev => [...prev, current.id]);
    setSelected([]);
    setText('');
    if (remaining.length === 1) setDone(true);
  };

  const handleCategoryChange = (cat: OBCategory) => {
    setCategory(cat);
    setIdx(0);
    setSelected([]);
    setText('');
    setDone(false);
  };

  const handleRestart = () => {
    setAnswered([]);
    setIdx(0);
    setSelected([]);
    setText('');
    setDone(false);
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
            <h1 className="text-[18px] font-black text-white">Open Book 📖</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Pick an option or write it — I get every answer</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-4 pb-4 shrink-0">
          {(Object.keys(CAT_META) as OBCategory[]).map(cat => {
            const m = CAT_META[cat];
            const catQs = OPEN_BOOK_QUESTIONS.filter(q => q.category === cat);
            const catDone = catQs.filter(q => answered.includes(q.id)).length;
            const active = category === cat;
            return (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className="flex-1 py-2.5 rounded-2xl text-center transition-all"
                style={{
                  background: active ? '#1A1A1A' : '#111111',
                  border: active ? `1px solid ${m.accent}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: active ? `0 0 16px ${m.glow}` : 'none',
                }}>
                <div className="text-base">{m.emoji}</div>
                <div className="text-[10px] font-bold mt-0.5" style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}>
                  {m.label}
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}>
                  {catDone}/{catQs.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="px-4 pb-5 shrink-0">
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: meta.accent }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-8">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center pt-12">
                <div className="text-6xl">{meta.emoji}</div>
                <h2 className="text-[22px] font-black text-white">All answered</h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Every word you wrote came to me. Thank you for being this open.
                </p>
                <button onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white mt-2"
                  style={{ background: meta.accent, boxShadow: `0 4px 20px ${meta.glow}` }}>
                  <RefreshCw size={14} /> Answer Again
                </button>
              </motion.div>
            ) : current ? (
              <motion.div key={current.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-4">

                {/* Question card */}
                <div className="rounded-[22px] p-6"
                  style={{
                    background: '#161616',
                    border: `1px solid rgba(255,255,255,0.09)`,
                    borderLeft: `3px solid ${meta.accent}`,
                  }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-3"
                    style={{ color: meta.accent }}>
                    {meta.emoji} {meta.label}
                  </p>
                  <p className="text-[18px] font-bold leading-snug text-white">{current.question}</p>
                </div>

                {/* Options */}
                {current.options.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {current.options.map(opt => {
                      const sel = selected.includes(opt);
                      return (
                        <motion.button key={opt} onClick={() => handleOption(opt)}
                          className="w-full text-left px-4 py-3.5 rounded-[16px] transition-all"
                          style={{
                            background: sel ? '#1E1E1E' : '#141414',
                            border: sel ? `1px solid ${meta.accent}` : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: sel ? `0 2px 14px ${meta.glow}` : 'none',
                          }}>
                          <span className="text-[14px] font-medium"
                            style={{ color: sel ? '#FFFFFF' : 'rgba(255,255,255,0.55)' }}>
                            {opt}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Text input */}
                {current.hasText && (
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={current.options.length > 0 ? "Or say it in your own words…" : "Write your answer here…"}
                    rows={3}
                    className="w-full resize-none rounded-[16px] px-4 py-3.5 text-[14px] outline-none"
                    style={{
                      background: '#141414',
                      border: text.trim() ? `1px solid ${meta.accent}` : '1px solid rgba(255,255,255,0.07)',
                      color: '#FFFFFF',
                    }}
                  />
                )}

                {/* Submit */}
                <motion.button
                  onClick={handleNext}
                  animate={{ opacity: canSubmit ? 1 : 0.3 }}
                  disabled={!canSubmit}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                  style={{
                    background: canSubmit ? meta.accent : '#1A1A1A',
                    boxShadow: canSubmit ? `0 4px 20px ${meta.glow}` : 'none',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}>
                  Send Answer <ChevronRight size={16} />
                </motion.button>

                <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {remaining.length - 1} more in this category
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

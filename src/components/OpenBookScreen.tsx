'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { OPEN_BOOK_QUESTIONS, OBCategory } from '@/data/openBookQuestions';
import { notifyOwner } from '@/lib/notify';

const CAT_META: Record<OBCategory, { label: string; emoji: string; gradient: string; glow: string; border: string }> = {
  feel: { label: 'How I Feel', emoji: '💗', gradient: 'from-rose-700 to-pink-800', glow: 'rgba(244,63,94,0.45)', border: 'rgba(251,113,133,0.4)' },
  want: { label: 'What I Want', emoji: '🌙', gradient: 'from-indigo-700 to-violet-800', glow: 'rgba(139,92,246,0.45)', border: 'rgba(167,139,250,0.4)' },
  bold: { label: 'Bold', emoji: '🔥', gradient: 'from-red-700 to-rose-900', glow: 'rgba(220,38,38,0.5)', border: 'rgba(248,113,113,0.4)' },
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
    const answerText = [
      ...selected,
      ...(text.trim() ? [`"${text.trim()}"`] : []),
    ].join(' / ');

    notifyOwner(
      `📖 <b>Open Book — ${meta.label} ${meta.emoji}</b>\n\n<i>${current.question}</i>\n\n💬 <b>${answerText}</b>`
    );
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
      style={{ background: 'linear-gradient(160deg, #0e000a 0%, #1e0015 50%, #0e0008 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 20%, ${meta.glow.replace('0.45', '0.1')}, transparent 60%)` }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,220,235,0.95)' }}>Open Book 📖</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,150,180,0.5)' }}>Pick an option or write it — I get every answer</p>
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
                  background: active ? 'rgba(255,77,141,0.15)' : 'rgba(255,255,255,0.05)',
                  border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: active ? `0 0 18px ${m.glow}` : 'none',
                }}>
                <div className="text-base">{m.emoji}</div>
                <div className="text-[10px] font-bold mt-0.5"
                  style={{ color: active ? 'rgba(255,220,235,0.9)' : 'rgba(255,255,255,0.4)' }}>
                  {m.label}
                </div>
                <div className="text-[9px] mt-0.5"
                  style={{ color: active ? 'rgba(255,150,180,0.6)' : 'rgba(255,255,255,0.22)' }}>
                  {catDone}/{catQs.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="px-4 pb-5 shrink-0">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
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
                <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,220,235,0.95)' }}>
                  All answered
                </h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,150,180,0.55)' }}>
                  Every word you wrote came to me. Thank you for being this open.
                </p>
                <button onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white mt-2"
                  style={{ background: 'linear-gradient(135deg, #c9245f, #ff4d8d)', boxShadow: '0 4px 20px rgba(201,36,95,0.4)' }}>
                  <RefreshCw size={14} /> Answer Again
                </button>
              </motion.div>
            ) : current ? (
              <motion.div key={current.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-4">

                {/* Question card */}
                <div className="rounded-[24px] p-6"
                  style={{
                    background: `linear-gradient(160deg, ${meta.glow.replace('0.45', '0.14')}, rgba(0,0,0,0.3))`,
                    border: `1px solid ${meta.border}`,
                    boxShadow: `0 8px 40px ${meta.glow.replace('0.45', '0.18')}`,
                  }}>
                  <p className="text-[11px] uppercase tracking-widest font-bold mb-3"
                    style={{ color: meta.glow.replace('rgba(', 'rgba(').replace('0.45', '0.5') }}>
                    {meta.emoji} {meta.label}
                  </p>
                  <p className="text-[18px] font-bold leading-snug" style={{ color: 'rgba(255,228,240,0.96)' }}>
                    {current.question}
                  </p>
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
                            background: sel ? `linear-gradient(135deg, ${meta.glow.replace('0.45', '0.22')}, rgba(0,0,0,0.2))` : 'rgba(255,255,255,0.05)',
                            border: sel ? `1px solid ${meta.border}` : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: sel ? `0 2px 16px ${meta.glow.replace('0.45', '0.2')}` : 'none',
                          }}>
                          <span className="text-[14px] font-medium"
                            style={{ color: sel ? 'rgba(255,228,240,0.96)' : 'rgba(200,180,210,0.65)' }}>
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
                      background: 'rgba(255,255,255,0.06)',
                      border: text.trim() ? `1px solid ${meta.border}` : '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,228,240,0.9)',
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
                    background: canSubmit ? `linear-gradient(135deg, #c9245f, #ff4d8d)` : 'rgba(255,255,255,0.08)',
                    boxShadow: canSubmit ? '0 4px 20px rgba(201,36,95,0.4)' : 'none',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}>
                  Send Answer <ChevronRight size={16} />
                </motion.button>

                <p className="text-[10px] text-center" style={{ color: 'rgba(255,150,180,0.3)' }}>
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

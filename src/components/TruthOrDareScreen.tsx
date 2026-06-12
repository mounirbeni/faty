'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, RefreshCw, Eye, Flame, Check } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { TOD_CARDS, type TodCard } from '@/data/truthOrDare';
import { notifyOwner } from '@/lib/notify';

const TRUTH = '#7B79FF';
const TRUTH_GLOW = 'rgba(123,121,255,0.35)';
const DARE = '#FF2060';
const DARE_GLOW = 'rgba(255,32,96,0.35)';

export default function TruthOrDareScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [current, setCurrent] = useState<TodCard | null>(null);
  const [text, setText] = useState('');
  const [dareDone, setDareDone] = useState(false);
  const [count, setCount] = useState(0);

  const pool = useMemo(() => TOD_CARDS.filter(c => !seenIds.includes(c.id)), [seenIds]);
  const truths = pool.filter(c => c.type === 'truth');
  const dares = pool.filter(c => c.type === 'dare');

  const draw = (type: 'truth' | 'dare') => {
    const list = type === 'truth' ? truths : dares;
    if (list.length === 0) return;
    const c = list[Math.floor(Math.random() * list.length)];
    setCurrent(c);
    setText('');
    setDareDone(false);
    notifyOwner(`${type === 'truth' ? '💋' : '😈'} <b>She drew a ${type.toUpperCase()}</b>\n\n<i>${c.text}</i>`);
  };

  const accent = current?.type === 'dare' ? DARE : TRUTH;
  const glow = current?.type === 'dare' ? DARE_GLOW : TRUTH_GLOW;

  const canSend = current?.type === 'truth'
    ? text.trim().length >= 8
    : dareDone;

  const handleSend = () => {
    if (!current || !canSend) return;
    if (current.type === 'truth') {
      notifyOwner(`💋 <b>Truth</b>\n\n<i>${current.text}</i>\n\n🔥 <b>"${text.trim()}"</b>`);
      logActivity('answer', `Truth: ${current.text.slice(0, 40)}`);
    } else {
      notifyOwner(`😈 <b>Dare — she did it</b>\n\n<i>${current.text}</i>` + (text.trim() ? `\n\n💬 <b>"${text.trim()}"</b>` : '\n\n✅ <i>Done.</i>'));
      logActivity('answer', `Dare done: ${current.text.slice(0, 40)}`);
    }
    setSeenIds(prev => [...prev, current.id]);
    setCount(c => c + 1);
    setCurrent(null);
    setText('');
    setDareDone(false);
  };

  const back = () => { if (current) { setCurrent(null); setText(''); setDareDone(false); } };
  const reset = () => { setSeenIds([]); setCurrent(null); setText(''); setDareDone(false); setCount(0); };
  const allDone = pool.length === 0 && !current;

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0">
          <button onClick={current ? back : () => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black text-white">Truth or Dare 💋</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {count > 0 ? `${count} done — keep going` : 'Pick one. Be honest. Be bold.'}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-4 pb-8">
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                <div className="text-6xl">💋</div>
                <h2 className="text-[22px] font-black text-white">You did every single one</h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Every truth, every dare. That took nerve — and he loved all of it.
                </p>
                <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: DARE, boxShadow: `0 4px 20px ${DARE_GLOW}` }}>
                  <RefreshCw size={14} /> Shuffle & Start Over
                </button>
              </motion.div>
            ) : !current ? (
              <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center gap-4">
                <p className="text-center text-[13px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Choose your card
                </p>

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => draw('truth')} disabled={truths.length === 0}
                  className="rounded-[26px] px-6 py-9 flex flex-col items-center gap-2.5"
                  style={{ background: '#13122A', border: `1.5px solid ${truths.length ? TRUTH : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: truths.length ? `0 8px 36px ${TRUTH_GLOW}` : 'none', opacity: truths.length ? 1 : 0.4 }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: TRUTH, boxShadow: `0 4px 20px ${TRUTH_GLOW}` }}>
                    <Eye size={26} className="text-white" />
                  </div>
                  <span className="text-[20px] font-black text-white">Truth 💋</span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {truths.length} left · answer me honestly
                  </span>
                </motion.button>

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => draw('dare')} disabled={dares.length === 0}
                  className="rounded-[26px] px-6 py-9 flex flex-col items-center gap-2.5"
                  style={{ background: '#241015', border: `1.5px solid ${dares.length ? DARE : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: dares.length ? `0 8px 36px ${DARE_GLOW}` : 'none', opacity: dares.length ? 1 : 0.4 }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: DARE, boxShadow: `0 4px 20px ${DARE_GLOW}` }}>
                    <Flame size={26} className="text-white" />
                  </div>
                  <span className="text-[20px] font-black text-white">Dare 😈</span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {dares.length} left · do it for me right now
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key={`card-${current.id}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center gap-4">

                <div className="rounded-[24px] p-6" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${accent}` }}>
                  <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: accent }}>
                    {current.type === 'truth' ? '💋 Truth' : '😈 Dare'}
                  </p>
                  <p className="text-[19px] font-bold leading-snug text-white">{current.text}</p>
                  {current.hint && (
                    <p className="text-[12px] italic mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{current.hint}</p>
                  )}
                </div>

                {current.type === 'dare' && (
                  <button onClick={() => setDareDone(d => !d)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-bold transition-all"
                    style={{ background: dareDone ? accent : '#141414',
                      border: dareDone ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.08)',
                      color: dareDone ? '#fff' : 'rgba(255,255,255,0.6)',
                      boxShadow: dareDone ? `0 4px 20px ${glow}` : 'none' }}>
                    <Check size={16} /> {dareDone ? 'Done — I did it 😏' : 'Tap when you’ve done it'}
                  </button>
                )}

                <textarea value={text} onChange={e => setText(e.target.value)}
                  placeholder={current.type === 'truth' ? 'Write your honest answer…' : 'Add a note about it… (optional)'}
                  rows={current.type === 'truth' ? 4 : 2} autoFocus={current.type === 'truth'}
                  className="w-full resize-none rounded-[18px] px-5 py-4 text-[14px] outline-none"
                  style={{ background: '#141414', border: text.trim() ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.07)', color: '#fff', lineHeight: 1.6 }} />

                <div className="flex gap-3">
                  <button onClick={back} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold"
                    style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    Back
                  </button>
                  <motion.button onClick={handleSend} disabled={!canSend} animate={{ opacity: canSend ? 1 : 0.35 }}
                    className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold text-white"
                    style={{ background: canSend ? accent : '#1A1A1A', boxShadow: canSend ? `0 4px 20px ${glow}` : 'none', cursor: canSend ? 'pointer' : 'not-allowed' }}>
                    <Send size={14} /> Send to Him
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

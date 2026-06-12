'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, RefreshCw, Scale } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { WYR_CARDS } from '@/data/spicyWouldYouRather';
import { notifyOwner } from '@/lib/notify';

const ACCENT = '#FF2060';
const GLOW = 'rgba(255,32,96,0.35)';

export default function WouldYouRatherScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, 'a' | 'b'>>({});
  const [note, setNote] = useState('');
  const [screen, setScreen] = useState<'play' | 'summary' | 'sent'>('play');
  const [started, setStarted] = useState(false);

  const card = WYR_CARDS[idx];
  const isLast = idx === WYR_CARDS.length - 1;

  const pick = (side: 'a' | 'b') => {
    if (!started) {
      setStarted(true);
      notifyOwner('🔥 <b>She’s playing Would You Rather…</b>\n\n<i>Choosing exactly what she wants. The results are coming.</i>');
    }
    setPicks(prev => ({ ...prev, [card.id]: side }));
    setTimeout(() => {
      if (isLast) setScreen('summary');
      else setIdx(i => i + 1);
    }, 260);
  };

  const handleSend = () => {
    const lines = WYR_CARDS.map(c => {
      const p = picks[c.id];
      if (!p) return null;
      return `${c.emoji} <b>${p === 'a' ? c.a : c.b}</b>\n   <i>(over: ${p === 'a' ? c.b : c.a})</i>`;
    }).filter(Boolean);
    notifyOwner(
      `🔥 <b>Her Would You Rather answers</b>\n\n${lines.join('\n\n')}` +
      (note.trim() ? `\n\n💬 <b>She added:</b> "${note.trim()}"` : '') +
      `\n\n<i>This is exactly what she’s craving.</i>`
    );
    logActivity('answer', 'Would You Rather — choices sent');
    setScreen('sent');
  };

  const reset = () => { setIdx(0); setPicks({}); setNote(''); setScreen('play'); setStarted(false); };

  const answered = Object.keys(picks).length;

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black text-white">Would You Rather 🔥</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Tap what you crave — I get every choice</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screen === 'play' && (
            <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8">

              {/* Progress */}
              <div className="shrink-0 mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Card {idx + 1} of {WYR_CARDS.length}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{answered} chosen</span>
                </div>
                <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: ACCENT }}
                    animate={{ width: `${(answered / WYR_CARDS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={card.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }} className="flex-1 flex flex-col gap-3 justify-center">

                  <div className="text-center mb-1">
                    <span className="text-4xl">{card.emoji}</span>
                  </div>

                  <OptionPanel label={card.a} side="a" selected={picks[card.id]} onClick={() => pick('a')} />

                  <div className="flex items-center gap-3 py-0.5">
                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    <span className="text-[12px] font-black tracking-[0.2em]" style={{ color: ACCENT }}>OR</span>
                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  </div>

                  <OptionPanel label={card.b} side="b" selected={picks[card.id]} onClick={() => pick('b')} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {screen === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col flex-1 px-4 pb-8 gap-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                What you chose
              </p>
              {WYR_CARDS.map((c, i) => {
                const p = picks[c.id];
                if (!p) return null;
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-[16px] p-3.5 flex items-center gap-3" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-2xl shrink-0">{c.emoji}</span>
                    <p className="text-[14px] font-semibold text-white">{p === 'a' ? c.a : c.b}</p>
                  </motion.div>
                );
              })}
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Want to add something just for me? (optional)" rows={2}
                className="w-full resize-none rounded-[16px] px-4 py-3.5 text-[14px] outline-none mt-1"
                style={{ background: '#141414', border: note.trim() ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)', color: '#fff' }} />
              <button onClick={handleSend}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white mt-1"
                style={{ background: ACCENT, boxShadow: `0 4px 20px ${GLOW}` }}>
                <Send size={15} /> Send My Choices to Him
              </button>
            </motion.div>
          )}

          {screen === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="text-6xl">🔥</div>
              <h2 className="text-[22px] font-black text-white">He knows exactly what you want now</h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Every single choice is with him. He’s going to think about each one.
              </p>
              <button onClick={reset} className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
                <RefreshCw size={14} /> Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function OptionPanel({ label, side, selected, onClick }: {
  label: string; side: 'a' | 'b'; selected?: 'a' | 'b'; onClick: () => void;
}) {
  const isSel = selected === side;
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-[20px] px-5 py-6 relative overflow-hidden"
      style={{
        background: isSel ? '#241015' : '#161616',
        border: isSel ? `1.5px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isSel ? `0 6px 28px ${GLOW}` : '0 4px 16px rgba(0,0,0,0.4)',
        minHeight: 92,
      }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
          style={{ background: isSel ? ACCENT : 'rgba(255,255,255,0.08)', color: isSel ? '#fff' : 'rgba(255,255,255,0.5)' }}>
          {side.toUpperCase()}
        </span>
        <Scale size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>
      <p className="text-[16px] font-bold leading-snug" style={{ color: isSel ? '#fff' : 'rgba(255,255,255,0.78)' }}>
        {label}
      </p>
    </motion.button>
  );
}

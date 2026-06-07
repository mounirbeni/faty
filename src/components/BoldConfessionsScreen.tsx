'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Send, Shuffle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { CONFESSION_PROMPTS } from '@/data/boldConfessions';
import { notifyOwner } from '@/lib/notify';

export default function BoldConfessionsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [text, setText] = useState('');
  const [sentIds, setSentIds] = useState<number[]>([]);

  const available = useMemo(
    () => CONFESSION_PROMPTS.filter(p => !seenIds.includes(p.id)),
    [seenIds]
  );
  const current = available[0];
  const allDone = available.length === 0;
  const canSend = text.trim().length >= 10;

  const handleReveal = () => {
    if (revealed || !current) return;
    setRevealed(true);
    notifyOwner(
      `🔥 <b>She drew a Bold Confession card</b>\n\n<i>${current.prompt}</i>\n\n<i>She's writing her answer now…</i>`
    );
    logActivity('mini-game', 'Bold Confessions — card drawn');
  };

  const handleSend = () => {
    if (!current || !canSend) return;
    notifyOwner(
      `💋 <b>Bold Confession</b>\n\n<i>${current.prompt}</i>\n\n🔥 <b>"${text.trim()}"</b>`
    );
    logActivity('answer', `Bold Confession: ${current.prompt.slice(0, 40)}`);
    setSentIds(prev => [...prev, current.id]);
    setSeenIds(prev => [...prev, current.id]);
    setText('');
    setRevealed(false);
  };

  const handleSkip = () => {
    if (!current) return;
    setSeenIds(prev => [...prev, current.id]);
    setRevealed(false);
    setText('');
  };

  const handleReset = () => {
    setSeenIds([]);
    setSentIds([]);
    setRevealed(false);
    setText('');
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0000 0%, #1a0008 50%, #0d0002 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(220,38,38,0.12), transparent 60%)' }} />

      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="fixed rounded-full pointer-events-none"
          style={{ width: 2 + (i % 2), height: 2 + (i % 2), left: `${10 + i * 15}%`, top: `${8 + (i % 4) * 22}%`, background: 'rgba(255,50,50,0.3)', filter: 'blur(1px)' }}
          animate={{ y: [0, -12, 0], opacity: [0.1, 0.45, 0.1] }}
          transition={{ duration: 2.8 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5 shrink-0">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black" style={{ color: 'rgba(255,200,200,0.95)' }}>Bold Confessions 🔥</h1>
            <p className="text-[11px]" style={{ color: 'rgba(248,113,113,0.45)' }}>Draw a card — write what you'd never say normally</p>
          </div>
        </div>

        {/* Counter */}
        <div className="px-4 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'rgba(248,113,113,0.4)' }}>
              {sentIds.length} confession{sentIds.length !== 1 ? 's' : ''} sent
            </span>
            <span className="text-[11px]" style={{ color: 'rgba(248,113,113,0.3)' }}>
              {available.length} cards left
            </span>
          </div>
          <div className="h-1 mt-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
              animate={{ width: `${(sentIds.length / CONFESSION_PROMPTS.length) * 100}%` }}
              transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Card area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-5">
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center">
                <div className="text-6xl">🔥</div>
                <h2 className="text-[22px] font-black" style={{ color: 'rgba(255,200,200,0.95)' }}>
                  You said them all
                </h2>
                <p className="text-[13px]" style={{ color: 'rgba(248,113,113,0.55)' }}>
                  Every card. Every confession. Thank you for that level of honesty.
                </p>
                <button onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}>
                  <RefreshCw size={14} /> Start Over
                </button>
              </motion.div>
            ) : !revealed ? (
              <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center gap-6">

                {/* Card back */}
                <motion.div
                  className="w-full rounded-[28px] flex flex-col items-center justify-center gap-4 py-16 cursor-pointer"
                  style={{
                    background: 'linear-gradient(160deg, #2a0005, #180002)',
                    border: '1px solid rgba(220,38,38,0.35)',
                    boxShadow: '0 12px 56px rgba(220,38,38,0.2)',
                    minHeight: 260,
                  }}
                  onClick={handleReveal}
                  whileTap={{ scale: 0.98 }}>
                  <div className="text-5xl">🔥</div>
                  <p className="text-[15px] font-semibold" style={{ color: 'rgba(255,150,150,0.6)' }}>
                    Tap to draw a card
                  </p>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <Shuffle size={10} className="text-red-400" />
                    <span className="text-[10px] font-bold" style={{ color: 'rgba(248,113,113,0.6)' }}>
                      Bold confession
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="back" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} className="w-full flex flex-col gap-4">

                {/* Prompt card */}
                <div className="rounded-[24px] p-6"
                  style={{
                    background: 'linear-gradient(160deg, #3a0008, #200004)',
                    border: '1px solid rgba(220,38,38,0.4)',
                    boxShadow: '0 10px 50px rgba(220,38,38,0.2)',
                  }}>
                  <div className="text-xl mb-3">🔥</div>
                  <p className="text-[18px] font-bold leading-snug" style={{ color: 'rgba(255,220,220,0.96)' }}>
                    {current?.prompt}
                  </p>
                  {current?.hint && (
                    <p className="text-[12px] italic mt-3" style={{ color: 'rgba(248,113,113,0.4)' }}>
                      {current.hint}
                    </p>
                  )}
                </div>

                {/* Answer */}
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Write your confession here… be honest, be bold"
                  rows={4}
                  autoFocus
                  className="w-full resize-none rounded-[18px] px-5 py-4 text-[14px] outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: text.trim() ? '1px solid rgba(220,38,38,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,220,220,0.9)',
                    lineHeight: 1.6,
                  }}
                />

                <div className="flex gap-3">
                  <button onClick={handleSkip}
                    className="flex-1 py-3 rounded-2xl text-[13px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
                    Skip this one
                  </button>
                  <motion.button onClick={handleSend} animate={{ opacity: canSend ? 1 : 0.35 }}
                    disabled={!canSend}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold text-white"
                    style={{
                      background: canSend ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'rgba(255,255,255,0.07)',
                      boxShadow: canSend ? '0 4px 20px rgba(220,38,38,0.4)' : 'none',
                      cursor: canSend ? 'pointer' : 'not-allowed',
                    }}>
                    <Send size={14} /> Send
                  </motion.button>
                </div>

                {!canSend && text.trim().length > 0 && (
                  <p className="text-[10px] text-center" style={{ color: 'rgba(248,113,113,0.3)' }}>
                    Write a bit more — at least 10 characters
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

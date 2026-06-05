'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const PROMPTS = [
  'What are you feeling right now that you haven\'t said yet?',
  'Whatever is on your mind tonight — say it here…',
  'If you could whisper something to me right now…',
  'What\'s living in your heart right now, at this hour?',
];

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 173.3) % 100,
  y: (i * 97.7) % 100,
  size: 1 + (i % 3) * 0.7,
  dur: 3 + (i % 5) * 0.9,
  delay: (i * 0.25) % 4,
  opacity: 0.15 + (i % 4) * 0.1,
}));

export default function WhisperToMeScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [promptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length));

  const handleSend = () => {
    if (!text.trim()) return;
    notifyOwner(`🌙 <b>She whispered to you…</b>\n\n"${text.trim()}"\n\n<i>Sent from the Whisper to Me screen</i>`);
    setSent(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #01010f 0%, #050520 45%, #020215 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />

      {STARS.map(s => (
        <motion.div key={s.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: 'rgba(200,210,255,0.8)' }}
          animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div>
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(200,210,255,0.95)' }}>Whisper to Me</h1>
            <p className="text-[11px]" style={{ color: 'rgba(140,160,255,0.45)' }}>Say anything, without fear</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-5">

                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.07, 1], opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: 46 }}>
                    🌙
                  </motion.div>
                  <p className="text-[16px] font-semibold mt-3 leading-snug" style={{ color: 'rgba(200,215,255,0.82)' }}>
                    {PROMPTS[promptIdx]}
                  </p>
                </div>

                <div className="rounded-[22px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(12,12,40,0.97), rgba(5,5,25,0.97))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                  }}>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Write here, no filter needed…"
                    rows={8}
                    autoFocus
                    className="w-full bg-transparent px-5 pt-5 pb-3 text-[15px] resize-none outline-none placeholder:text-white/15"
                    style={{ color: 'rgba(210,220,255,0.9)', caretColor: '#818cf8', lineHeight: '1.75' }}
                  />
                  <div className="flex justify-end px-4 pb-3">
                    <span className="text-[10px]" style={{ color: 'rgba(140,160,255,0.3)' }}>{text.length} chars</span>
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="w-full py-4 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: text.trim() ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255,255,255,0.05)',
                    boxShadow: text.trim() ? '0 4px 24px rgba(99,102,241,0.4)' : 'none',
                    border: text.trim() ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: text.trim() ? 'white' : 'rgba(140,160,255,0.4)',
                    opacity: text.trim() ? 1 : 0.7,
                  }}>
                  <Send size={16} />
                  Send my whisper
                </button>
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: 56 }}>
                  💫
                </motion.div>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(200,215,255,0.95)' }}>
                    He heard you
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(140,165,255,0.6)' }}>
                    Your whisper traveled all the way to him. He's reading it right now.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
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

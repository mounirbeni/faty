'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const BOLD_ITEMS = [
  { id: 0,  text: 'Hold you and not let go for the first five minutes' },
  { id: 1,  text: 'Kiss you like the distance never happened' },
  { id: 2,  text: 'Look at your face in real life for the first time and just cry' },
  { id: 3,  text: 'Sleep next to you and actually feel you breathing' },
  { id: 4,  text: 'Take a hundred photos of you just existing near me' },
  { id: 5,  text: 'Go for a walk and hold your hand the whole time, no reason' },
  { id: 6,  text: 'Cook something with you and eat together in the same room' },
  { id: 7,  text: 'Stay in bed with you all morning and not feel guilty about it' },
  { id: 8,  text: 'Watch you laugh in person — not through a screen' },
  { id: 9,  text: 'Tell you everything I couldn\'t say through a phone' },
  { id: 10, text: 'Dance with you, even if there\'s no music' },
  { id: 11, text: 'Fall asleep next to you and wake up next to you too' },
  { id: 12, text: 'Show you everything in my city — my world, finally yours' },
  { id: 13, text: 'Spend a whole day just being near you with no plan at all' },
  { id: 14, text: 'Something I\'m too shy to write here — but you\'d know 🔥' },
];

const SPARKS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: (i * 113.7) % 100,
  y: (i * 83.4) % 100,
  dur: 4 + (i % 3) * 1.5,
  delay: i * 0.4,
}));

export default function BoldListScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);

  const toggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    const items = BOLD_ITEMS.filter(i => selected.has(i.id));
    const list = items.map((i, n) => `${n + 1}. ${i.text}`).join('\n');
    notifyOwner(
      `🔥 <b>When she finally sees you, she wants to…</b>\n\n${list || 'She opened the screen'}\n\n<i>${items.length} desires selected</i>`
    );
    setSent(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #160007 0%, #250010 45%, #180008 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(239,68,68,0.13) 0%, transparent 62%)' }} />

      {SPARKS.map(s => (
        <motion.div key={s.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: 3, height: 3, background: 'rgba(248,113,113,0.35)', filter: 'blur(1px)' }}
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.8, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,180,180,0.95)' }}>When I See You</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,100,100,0.45)' }}>Everything I want to do when the distance ends</p>
          </div>
          <Flame size={18} className="text-rose-400 shrink-0" fill="currentColor" />
        </div>

        {!sent ? (
          <div className="flex-1 flex flex-col px-4 pb-6 gap-4">
            <p className="text-[13px] text-center" style={{ color: 'rgba(255,130,130,0.6)' }}>
              Select everything you want to do when you finally see him…
            </p>

            <div className="flex flex-col gap-2">
              {BOLD_ITEMS.map((item, idx) => {
                const on = selected.has(item.id);
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-start transition-all"
                    style={{
                      background: on ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.04)',
                      border: on ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: on ? '0 4px 16px rgba(239,68,68,0.15)' : 'none',
                    }}>
                    <div className="w-5 h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 transition-all"
                      style={{
                        borderColor: on ? 'rgba(239,68,68,0.8)' : 'rgba(255,255,255,0.2)',
                        background: on ? 'rgba(239,68,68,0.4)' : 'transparent',
                      }}>
                      {on && <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />}
                    </div>
                    <span className="text-[13px] font-medium leading-snug"
                      style={{ color: on ? 'rgba(255,200,200,0.95)' : 'rgba(255,255,255,0.5)' }}>
                      {item.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={handleSend}
              className="w-full py-4 rounded-2xl text-[14px] font-bold text-white mt-2 transition-all"
              style={{
                background: selected.size > 0 ? 'linear-gradient(135deg, #dc2626, #f43f5e)' : 'rgba(255,255,255,0.06)',
                boxShadow: selected.size > 0 ? '0 4px 24px rgba(220,38,38,0.45)' : 'none',
                border: selected.size > 0 ? 'none' : '1px solid rgba(255,255,255,0.09)',
                color: selected.size > 0 ? 'white' : 'rgba(255,100,100,0.4)',
              }}>
              {selected.size > 0 ? `Send to him (${selected.size} things) 🔥` : 'Choose what you want'}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4 pb-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 56 }}>
              🔥
            </motion.div>
            <div>
              <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(255,180,180,0.95)' }}>
                He's counting down
              </h2>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,100,100,0.6)' }}>
                He knows everything you want. And he wants it all too — every single thing.
              </p>
            </div>
            <button onClick={() => setPhase('home')}
              className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #dc2626, #f43f5e)', boxShadow: '0 4px 24px rgba(220,38,38,0.45)' }}>
              Back to Our Universe
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

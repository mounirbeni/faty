'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const MISS_ITEMS = [
  { id: 0,  emoji: '🫂', label: 'Your hugs' },
  { id: 1,  emoji: '👁️', label: 'Your eyes in person' },
  { id: 2,  emoji: '🎵', label: 'Your laugh, live' },
  { id: 3,  emoji: '🌡️', label: 'Your warmth next to me' },
  { id: 4,  emoji: '🤝', label: 'Holding your hand' },
  { id: 5,  emoji: '💬', label: 'Talking in the same room' },
  { id: 6,  emoji: '☕', label: 'Sitting together in silence' },
  { id: 7,  emoji: '😴', label: 'Falling asleep near you' },
  { id: 8,  emoji: '🚶', label: 'Walking side by side' },
  { id: 9,  emoji: '💆', label: 'Your head on my shoulder' },
  { id: 10, emoji: '🍽️', label: 'Eating together, really' },
  { id: 11, emoji: '📺', label: 'Watching something together' },
  { id: 12, emoji: '🌙', label: 'Your face before I sleep' },
  { id: 13, emoji: '💋', label: 'A real kiss, in person' },
  { id: 14, emoji: '🌅', label: 'Watching a sunrise together' },
  { id: 15, emoji: '🫶', label: 'Being held by you' },
];

const INK_DROPS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 97.3 + 8) % 100,
  y: (i * 71.1 + 5) % 100,
  size: 2 + (i % 3) * 1.5,
  dur: 9 + (i % 4) * 2,
  delay: i * 0.6,
}));

export default function ThingsIMissScreen() {
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
    const items = MISS_ITEMS.filter(i => selected.has(i.id));
    const list = items.map(i => `${i.emoji} ${i.label}`).join('\n');
    notifyOwner(
      `💗 <b>Things she misses most right now…</b>\n\n${list || 'She opened the screen'}\n\n<i>${items.length} of ${MISS_ITEMS.length} things selected</i>`
    );
    setSent(true);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0010 0%, #2d0018 45%, #1a000d 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(244,63,94,0.13) 0%, transparent 62%)' }} />

      {INK_DROPS.map(d => (
        <motion.div key={d.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: 'rgba(251,113,133,0.18)', filter: 'blur(2px)' }}
          animate={{ y: [0, 14, 0], opacity: [0.08, 0.35, 0.08], scale: [1, 1.5, 1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(244,63,94,0.15)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div>
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(255,180,200,0.95)' }}>Things I Miss</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,120,150,0.45)' }}>Show him what you miss most right now</p>
          </div>
        </div>

        {!sent ? (
          <div className="flex-1 flex flex-col px-4 pb-6 gap-4">
            <p className="text-[13px] text-center" style={{ color: 'rgba(255,150,175,0.6)' }}>
              Tap everything you miss right now…
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {MISS_ITEMS.map((item, idx) => {
                const on = selected.has(item.id);
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-2xl text-start transition-all"
                    style={{
                      background: on ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.04)',
                      border: on ? '1px solid rgba(244,63,94,0.45)' : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: on ? '0 4px 16px rgba(244,63,94,0.2)' : 'none',
                    }}>
                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                    <span className="text-[12px] font-semibold leading-tight"
                      style={{ color: on ? 'rgba(255,180,195,0.95)' : 'rgba(255,255,255,0.45)' }}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={handleSend}
              className="w-full py-4 rounded-2xl text-[14px] font-bold text-white mt-2 transition-all"
              style={{
                background: selected.size > 0 ? 'linear-gradient(135deg, #be123c, #fb7185)' : 'rgba(255,255,255,0.06)',
                boxShadow: selected.size > 0 ? '0 4px 24px rgba(190,18,60,0.4)' : 'none',
                border: selected.size > 0 ? 'none' : '1px solid rgba(255,255,255,0.09)',
                color: selected.size > 0 ? 'white' : 'rgba(255,120,150,0.4)',
              }}>
              {selected.size > 0 ? `Send to him (${selected.size} things) 💗` : 'Select what you miss'}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4 pb-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 56 }}>
              💗
            </motion.div>
            <div>
              <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(255,180,200,0.95)' }}>
                He knows now
              </h2>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,120,150,0.6)' }}>
                He can feel everything you miss. And he misses it all too.
              </p>
            </div>
            <button onClick={() => setPhase('home')}
              className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #be123c, #fb7185)', boxShadow: '0 4px 24px rgba(190,18,60,0.4)' }}>
              Back to Our Universe
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

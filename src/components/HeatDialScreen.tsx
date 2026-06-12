'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, RefreshCw, Thermometer } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { HEAT_ITEMS, heatLevel } from '@/data/heatDial';
import { notifyOwner } from '@/lib/notify';

const ACCENT = '#FF2060';
const GLOW = 'rgba(255,32,96,0.35)';

export default function HeatDialScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);

  const [values, setValues] = useState<Record<number, number>>(() =>
    Object.fromEntries(HEAT_ITEMS.map(i => [i.id, 50]))
  );
  const [sent, setSent] = useState(false);

  const avg = Math.round(
    HEAT_ITEMS.reduce((s, i) => s + (values[i.id] ?? 0), 0) / HEAT_ITEMS.length
  );

  const handleSend = () => {
    const lines = HEAT_ITEMS.map(i => {
      const v = values[i.id] ?? 0;
      const lv = heatLevel(v);
      return `${i.emoji} <i>${i.label}</i>\n   <b>${v}/100</b> ${lv.emoji} ${lv.word}`;
    });
    notifyOwner(
      `🌡️ <b>Her Heat Dial</b>\n\n${lines.join('\n\n')}\n\n🔥 <b>Overall heat: ${avg}/100</b>\n\n<i>This is how much she wants you right now.</i>`
    );
    logActivity('answer', `Heat Dial sent — ${avg}/100 overall`);
    setSent(true);
  };

  const reset = () => {
    setValues(Object.fromEntries(HEAT_ITEMS.map(i => [i.id, 50])));
    setSent(false);
  };

  if (sent) {
    return (
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-8"
        style={{ background: '#0A0A0A' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="text-6xl">🌡️🔥</div>
        <h2 className="text-[22px] font-black text-white">He feels every degree</h2>
        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Your heat is with him now — all {avg}% of it.
        </p>
        <button onClick={reset} className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white"
          style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
          <RefreshCw size={14} /> Set It Again
        </button>
      </motion.div>
    );
  }

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
          <div className="flex-1">
            <h1 className="text-[18px] font-black text-white">Heat Dial 🌡️</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Drag each one — I see exactly how hot it gets</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[20px] font-black leading-none" style={{ color: heatLevel(avg).color }}>{avg}<span className="text-[12px]">%</span></div>
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>overall</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          {HEAT_ITEMS.map((item, i) => {
            const v = values[item.id] ?? 0;
            const lv = heatLevel(v);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-[20px] p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[13.5px] font-semibold text-white leading-snug flex-1">
                    <span className="mr-1">{item.emoji}</span>{item.label}
                  </p>
                  <div className="flex flex-col items-center shrink-0 w-14">
                    <span className="text-2xl leading-none">{lv.emoji}</span>
                    <span className="text-[16px] font-black leading-tight mt-0.5" style={{ color: lv.color }}>{v}</span>
                  </div>
                </div>

                {/* slider */}
                <input type="range" min={0} max={100} value={v}
                  onChange={e => setValues(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                  className="heat-range w-full"
                  style={{
                    accentColor: lv.color,
                    color: lv.color,
                    background: `linear-gradient(90deg, ${lv.color} 0%, ${lv.color} ${v}%, rgba(255,255,255,0.1) ${v}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>🥶 not really</span>
                  <span className="text-[10px] font-bold" style={{ color: lv.color }}>{lv.word}</span>
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>can’t take it 💥</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="px-4 pb-8 pt-1">
          <button onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white"
            style={{ background: ACCENT, boxShadow: `0 4px 20px ${GLOW}` }}>
            <Send size={15} /> Send My Heat to Him
          </button>
          <p className="text-[10px] text-center mt-2 flex items-center justify-center gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Thermometer size={10} /> He gets every number, instantly
          </p>
        </div>
      </div>
    </motion.div>
  );
}

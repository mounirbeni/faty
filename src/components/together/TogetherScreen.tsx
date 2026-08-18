'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Pencil, Check, RotateCcw, ChevronRight, Flame, Dices, Disc3, Eye } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';
import { useGameStore, type AppPhase } from '@/store/gameStore';
import { useTogetherStore } from '@/store/togetherStore';
import { HEAT_META } from '@/data/together';
import { HeatPicker, ModeToggle, Scoreboard } from './TogetherUI';

const GAMES: {
  id: Extract<AppPhase, 'dare-duel' | 'never-have-i-ever' | 'spin-the-heat' | 'dice-of-desire'>;
  icon: React.ReactNode;
  label: string;
  sub: string;
  how: string;
  gradient: string;
  glow: string;
}[] = [
  {
    id: 'dare-duel',
    icon: <Flame size={24} className="text-white" fill="currentColor" />,
    label: 'Dare Duel',
    sub: 'Truth or dare — both of us',
    how: 'Take turns. Chicken out, lose a point.',
    gradient: 'from-rose-600 to-red-500',
    glow: 'shadow-rose-600/50',
  },
  {
    id: 'never-have-i-ever',
    icon: <Eye size={24} className="text-white" />,
    label: 'Never Have I Ever',
    sub: 'Answer in secret, reveal together',
    how: 'Nobody sees the other answer until it flips.',
    gradient: 'from-violet-500 to-fuchsia-500',
    glow: 'shadow-violet-500/50',
  },
  {
    id: 'spin-the-heat',
    icon: <Disc3 size={24} className="text-white" />,
    label: 'Spin the Heat',
    sub: 'One wheel decides everything',
    how: 'Who does it, what it is, how long it lasts.',
    gradient: 'from-orange-500 to-red-600',
    glow: 'shadow-orange-500/50',
  },
  {
    id: 'dice-of-desire',
    icon: <Dices size={24} className="text-white" />,
    label: 'Dice of Desire',
    sub: 'Three dice, one order',
    how: 'Action × spot × timer. No arguing with dice.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/50',
  },
];

export default function TogetherScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const { p1, p2, heat, setNames, resetNight, rounds } = useTogetherStore();

  const [editing, setEditing] = useState(false);
  const [n1, setN1] = useState(p1);
  const [n2, setN2] = useState(p2);

  const meta = HEAT_META[heat];

  const saveNames = () => { setNames(n1, n2); setEditing(false); };

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0">
          <button onClick={() => setPhase('home')} aria-label="Back"
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-black text-white leading-tight">Together Tonight 😈</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {rounds > 0 ? `${rounds} rounds played tonight` : 'Games for the two of us — not just for me'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: meta.surface, border: `1px solid ${meta.color}55` }}>
            <Moon size={15} style={{ color: meta.color }} />
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 pb-10">

          {/* Players */}
          <section className="rounded-[22px] overflow-hidden"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${meta.color}, #5856D6)` }} />
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Who&rsquo;s playing
                </span>
                <button onClick={() => (editing ? saveNames() : setEditing(true))}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                  style={{ background: editing ? meta.color : '#1C1C1C', color: editing ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: editing ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  {editing ? <><Check size={11} /> Save</> : <><Pencil size={11} /> Names</>}
                </button>
              </div>

              {editing ? (
                <div className="flex gap-2">
                  <input value={n1} onChange={e => setN1(e.target.value)} maxLength={14} placeholder="Her name"
                    className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-[13px] font-bold text-white outline-none"
                    style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <input value={n2} onChange={e => setN2(e.target.value)} maxLength={14} placeholder="His name"
                    className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-[13px] font-bold text-white outline-none"
                    style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              ) : (
                <Scoreboard accent={meta.color} />
              )}

              <button onClick={resetNight}
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold"
                style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                <RotateCcw size={11} /> Fresh night — clear the score
              </button>
            </div>
          </section>

          {/* Heat dial */}
          <section className="flex flex-col gap-2.5">
            <Label text="How hot tonight" />
            <HeatPicker />
            <p className="text-[10px] px-1 italic" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Turn it up and the bolder cards join in — the sweet ones never leave.
            </p>
          </section>

          {/* Mode */}
          <section className="flex flex-col gap-2.5">
            <Label text="Where we are" />
            <ModeToggle />
            <p className="text-[10px] px-1 italic" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Apart tonight? Every card becomes something you can still do through a phone.
            </p>
          </section>

          {/* Games */}
          <section className="flex flex-col gap-2.5">
            <Label text="Pick a game" />
            <div className="grid grid-cols-1 gap-3">
              {GAMES.map((g, idx) => (
                <motion.button key={g.id} onClick={() => setPhase(g.id)}
                  className={`sheen relative flex items-center gap-3.5 p-4 rounded-2xl text-left overflow-hidden bg-gradient-to-br ${g.gradient} shadow-xl ${g.glow}`}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 + idx * 0.07, duration: 0.5, ease: EASE.smooth } }}
                  whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.97 }} transition={SPRING.snappy}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(0,0,0,0.22)' }}>
                    {g.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-black text-white leading-tight">{g.label}</div>
                    <div className="text-[11px] text-white/75 mt-0.5">{g.sub}</div>
                    <div className="text-[9.5px] text-white/50 italic mt-1">{g.how}</div>
                  </div>
                  <ChevronRight size={16} className="text-white/50 shrink-0" />
                </motion.button>
              ))}
            </div>
          </section>

          <p className="text-[10px] text-center px-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Just us two — nothing from these games gets sent anywhere. Skip anything either of us
            doesn&rsquo;t want, no points lost. 🤍
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
      {text}
    </span>
  );
}

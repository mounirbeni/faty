'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, SkipForward, RotateCw } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';
import { useGameStore } from '@/store/gameStore';
import { useTogetherStore } from '@/store/togetherStore';
import {
  WHEEL_SLICES, HEAT_META, atOrBelow, forMode, personalize, roundLine, type WheelSlice,
} from '@/data/together';
import { TogetherHeader, HeatPill, Scoreboard, TurnBanner, Countdown } from './TogetherUI';

const SLICE_COUNT = 8;
const SPIN_MS = 4200;

/** Deterministic shuffle so the wheel keeps its faces until the settings change. */
function pickFaces(deck: WheelSlice[]): WheelSlice[] {
  if (deck.length <= SLICE_COUNT) return deck;
  const pool = [...deck];
  const out: WheelSlice[] = [];
  while (out.length < SLICE_COUNT && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

export default function SpinTheHeatScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const { p1, p2, heat, mode, turn, rounds, swapTurn, score, countRound } = useTogetherStore();

  const accent = HEAT_META[heat].color;
  const deck = useMemo(() => forMode(atOrBelow(WHEEL_SLICES, heat), mode), [heat, mode]);
  const faces = useMemo(() => pickFaces(deck), [deck]);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<WheelSlice | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sliceAngle = faces.length > 0 ? 360 / faces.length : 360;

  const spin = () => {
    if (spinning || faces.length === 0) return;
    const target = Math.floor(Math.random() * faces.length);
    const turns = 5 + Math.floor(Math.random() * 3);
    // land the chosen slice under the pointer at 12 o'clock
    const next = rotation + turns * 360 + (360 - (rotation % 360)) - (target * sliceAngle + sliceAngle / 2);
    setLanded(null);
    setSpinning(true);
    setRotation(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setLanded(faces[target]);
    }, SPIN_MS);
  };

  const close = (won: boolean) => {
    if (won) score(turn, 1);
    countRound();
    swapTurn();
    setLanded(null);
  };

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        <TogetherHeader
          title="Spin the Heat 🎡"
          sub={spinning ? 'Spinning…' : landed ? 'The wheel has decided' : 'One spin, no arguing with it'}
          onBack={() => setPhase('together')}
          right={<HeatPill onClick={() => setPhase('together')} />}
        />

        <div className="px-4 flex flex-col gap-3">
          <Scoreboard accent={accent} />
          <TurnBanner seat={turn} accent={accent} line={roundLine(rounds)} />
        </div>

        <div className="flex-1 flex flex-col items-center px-4 pt-5 pb-8 gap-5">

          {/* Wheel */}
          <div className="relative w-full max-w-[300px] aspect-square">
            {/* pointer */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20"
              style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                borderTop: `18px solid ${accent}`, filter: `drop-shadow(0 2px 6px ${accent}88)` }} />

            <motion.div className="w-full h-full rounded-full"
              animate={{ rotate: rotation }}
              transition={{ duration: SPIN_MS / 1000, ease: [0.12, 0.72, 0.16, 1] }}
              style={{ boxShadow: `0 10px 50px ${accent}33, inset 0 0 0 2px rgba(255,255,255,0.06)` }}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {faces.map((face, i) => {
                  const start = i * sliceAngle - 90;
                  const end = start + sliceAngle;
                  const large = sliceAngle > 180 ? 1 : 0;
                  const rad = (deg: number) => (deg * Math.PI) / 180;
                  const x1 = 100 + 98 * Math.cos(rad(start));
                  const y1 = 100 + 98 * Math.sin(rad(start));
                  const x2 = 100 + 98 * Math.cos(rad(end));
                  const y2 = 100 + 98 * Math.sin(rad(end));
                  const mid = start + sliceAngle / 2;
                  const lx = 100 + 62 * Math.cos(rad(mid));
                  const ly = 100 + 62 * Math.sin(rad(mid));
                  const heatColor = HEAT_META[face.level].color;
                  return (
                    <g key={face.id}>
                      <path d={`M100 100 L${x1} ${y1} A98 98 0 ${large} 1 ${x2} ${y2} Z`}
                        fill={i % 2 === 0 ? `${heatColor}2E` : `${heatColor}18`}
                        stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" />
                      <text x={lx} y={ly - 4} textAnchor="middle" fontSize="15">{face.emoji}</text>
                      <text x={lx} y={ly + 10} textAnchor="middle" fontSize="8" fontWeight="800"
                        fill="rgba(255,255,255,0.85)">{face.label}</text>
                    </g>
                  );
                })}
                <circle cx="100" cy="100" r="20" fill="#0F0F0F" stroke={accent} strokeWidth="1.5" />
              </svg>
            </motion.div>

            <button onClick={spin} disabled={spinning}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[19%] h-[19%] rounded-full flex items-center justify-center z-10"
              style={{ background: 'transparent' }} aria-label="Spin">
              <RotateCw size={18} style={{ color: accent }} className={spinning ? 'animate-spin' : ''} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {landed ? (
              <motion.div key={`landed-${landed.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={SPRING.gentle} className="w-full flex flex-col gap-3">

                <div className="rounded-[24px] p-5" style={{ background: '#161616',
                  border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${HEAT_META[landed.level].color}` }}>
                  <p className="text-[10px] uppercase tracking-widest font-black mb-2"
                    style={{ color: HEAT_META[landed.level].color }}>
                    {landed.emoji} {landed.label} · {HEAT_META[landed.level].name}
                  </p>
                  <p className="text-[18px] font-bold leading-snug text-white">
                    {personalize(landed.action, turn === 'p1' ? p2 : p1)}
                  </p>
                </div>

                <Countdown key={landed.id} seconds={landed.seconds} accent={accent} />

                <div className="flex gap-2.5">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => close(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold"
                    style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                    <SkipForward size={14} /> Pass
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => close(true)}
                    className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-black text-white"
                    style={{ background: accent, boxShadow: `0 6px 26px ${accent}55` }}>
                    <Check size={15} /> Done — my point
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button key="spin-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }} onClick={spin} disabled={spinning}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-black text-white"
                style={{ background: spinning ? '#1A1A1A' : accent, boxShadow: spinning ? 'none' : `0 6px 28px ${accent}55`,
                  transition: `background 0.3s cubic-bezier(${EASE.smooth.join(',')})` }}>
                <RotateCw size={17} className={spinning ? 'animate-spin' : ''} />
                {spinning ? 'Round and round…' : 'Spin the wheel'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

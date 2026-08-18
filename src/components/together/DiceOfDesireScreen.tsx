'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Check, SkipForward } from 'lucide-react';
import { SPRING } from '@/lib/motion';
import { useGameStore } from '@/store/gameStore';
import { useTogetherStore } from '@/store/togetherStore';
import {
  DICE_ACTIONS, DICE_SPOTS, DICE_TIMERS, HEAT_META, atOrBelow, forMode, personalize, roundLine, type DieFace,
} from '@/data/together';
import { TogetherHeader, HeatPill, Scoreboard, TurnBanner, Countdown } from './TogetherUI';
import IconFromName from '../IconFromName';

const ROLL_MS = 1300;
const TICK_MS = 80;

interface Roll {
  action: DieFace;
  spot: DieFace;
  timer: (typeof DICE_TIMERS)[number];
}

export default function DiceOfDesireScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const { p1, p2, heat, mode, turn, rounds, swapTurn, score, countRound } = useTogetherStore();

  const accent = HEAT_META[heat].color;
  const actions = useMemo(() => forMode(atOrBelow(DICE_ACTIONS, heat), mode), [heat, mode]);
  const spots = useMemo(() => forMode(atOrBelow(DICE_SPOTS, heat), mode), [heat, mode]);
  // short clocks at Warm, the punishing ones only once the dial is up
  const timers = useMemo(() => DICE_TIMERS.slice(0, 3 + heat), [heat]);

  const [roll, setRoll] = useState<Roll | null>(null);
  const [rolling, setRolling] = useState(false);
  const [tick, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (stopRef.current) clearTimeout(stopRef.current);
  }, []);

  const doRoll = () => {
    if (rolling || actions.length === 0 || spots.length === 0) return;
    setRoll(null);
    setRolling(true);
    tickRef.current = setInterval(() => setTick(t => t + 1), TICK_MS);
    stopRef.current = setTimeout(() => {
      if (tickRef.current) clearInterval(tickRef.current);
      setRolling(false);
      setRoll({
        action: actions[Math.floor(Math.random() * actions.length)],
        spot: spots[Math.floor(Math.random() * spots.length)],
        timer: timers[Math.floor(Math.random() * timers.length)],
      });
    }, ROLL_MS);
  };

  const close = (won: boolean) => {
    if (won) score(turn, 1);
    countRound();
    swapTurn();
    setRoll(null);
  };

  const theirName = turn === 'p1' ? p2 : p1;
  const sentence = roll
    ? `${roll.action.text} ${personalize(roll.spot.text, theirName)} — for ${roll.timer.label}.`
    : null;

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        <TogetherHeader
          title="Dice of Desire"
          icon="dice" accent={accent}
          sub={rolling ? 'Rolling…' : roll ? 'The dice do not negotiate' : 'Three dice, one order'}
          onBack={() => setPhase('together')}
          right={<HeatPill onClick={() => setPhase('together')} />}
        />

        <div className="px-4 flex flex-col gap-3">
          <Scoreboard accent={accent} />
          <TurnBanner seat={turn} accent={accent} line={roundLine(rounds)} />
        </div>

        <div className="flex-1 flex flex-col px-4 pt-5 pb-8 gap-4">

          {/* The three dice */}
          <div className="flex gap-2.5">
            <Die label="Action" accent={accent} rolling={rolling}
              icon={rolling ? actions[tick % Math.max(actions.length, 1)]?.icon ?? 'dice' : roll?.action.icon ?? 'dice'}
              text={rolling ? actions[tick % Math.max(actions.length, 1)]?.text ?? '' : roll?.action.text ?? 'Roll me'} />
            <Die label="Where" accent={accent} rolling={rolling}
              icon={rolling ? spots[tick % Math.max(spots.length, 1)]?.icon ?? 'dice' : roll?.spot.icon ?? 'dice'}
              text={rolling
                ? (spots[tick % Math.max(spots.length, 1)]?.text ?? '')
                : roll ? personalize(roll.spot.text, theirName) : '…'} />
            <Die label="How long" accent={accent} rolling={rolling}
              icon="hourglass"
              text={rolling ? timers[tick % timers.length].label : roll?.timer.label ?? '…'} />
          </div>

          <AnimatePresence mode="wait">
            {roll && !rolling ? (
              <motion.div key={`roll-${roll.action.id}-${roll.spot.id}-${roll.timer.id}`}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={SPRING.gentle} className="flex flex-col gap-3">

                <div className="rounded-[24px] p-5" style={{ background: '#161616',
                  border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${accent}`,
                  boxShadow: `0 10px 40px ${accent}18` }}>
                  <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: accent }}>
                    Your orders
                  </p>
                  <p className="text-[19px] font-bold leading-snug text-white first-letter:uppercase">{sentence}</p>
                </div>

                <Countdown key={`${roll.action.id}-${roll.timer.id}`} seconds={roll.timer.seconds} accent={accent} />

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
              <motion.button key="roll-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }} onClick={doRoll} disabled={rolling}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-black text-white"
                style={{ background: rolling ? '#1A1A1A' : accent, boxShadow: rolling ? 'none' : `0 6px 28px ${accent}55` }}>
                <Dices size={18} /> {rolling ? 'Tumbling…' : 'Roll the dice'}
              </motion.button>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-center italic px-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Whatever the dice say, either of you can call it off — pass costs nothing but the point.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Die({ label, icon, text, accent, rolling }: {
  label: string; icon: string; text: string; accent: string; rolling: boolean;
}) {
  return (
    <motion.div className="flex-1 min-w-0 rounded-2xl p-3 flex flex-col items-center gap-1 text-center"
      animate={rolling ? { rotate: [0, -6, 6, -3, 0], y: [0, -4, 0] } : { rotate: 0, y: 0 }}
      transition={rolling ? { duration: 0.32, repeat: Infinity } : SPRING.snappy}
      style={{ background: '#141414', border: `1px solid ${rolling ? accent + '66' : 'rgba(255,255,255,0.08)'}`,
        minHeight: 104 }}>
      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </span>
      <span className="flex items-center" style={{ color: rolling ? accent : 'rgba(255,255,255,0.9)' }}>
        <IconFromName name={icon} size={22} />
      </span>
      <span className="text-[10px] font-bold leading-tight text-white/85 break-words">{text}</span>
    </motion.div>
  );
}

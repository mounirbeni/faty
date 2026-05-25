'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, RefreshCw, Sparkles, Calendar,
  Coffee, Film, UtensilsCrossed, Star, Car, Camera, TreePine, Gamepad2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { softTap } from '@/lib/useHaptics';

interface DateIdea {
  label: string;
  short: string;
  Icon: LucideIcon;
  color: string;
  description: string;
}

const DATES: DateIdea[] = [
  {
    label: 'Coffee & Walk',
    short: 'Coffee',
    Icon: Coffee,
    color: '#f43f5e',
    description: 'A slow morning walk with coffee in hand — just us, talking about everything and nothing. No destination needed.',
  },
  {
    label: 'Movie Night',
    short: 'Movie',
    Icon: Film,
    color: '#fb923c',
    description: 'Blankets piled up, popcorn ready, and a movie we\'ll judge together while secretly loving it.',
  },
  {
    label: 'Cook Together',
    short: 'Cook',
    Icon: UtensilsCrossed,
    color: '#f59e0b',
    description: 'Pick a new recipe, make a mess in the kitchen, and eat something we actually made with our hands.',
  },
  {
    label: 'Stargazing',
    short: 'Stars',
    Icon: Star,
    color: '#10b981',
    description: 'A blanket on the grass, looking up at the sky, saying things we are too shy to say in the daylight.',
  },
  {
    label: 'Road Trip',
    short: 'Drive',
    Icon: Car,
    color: '#38bdf8',
    description: 'Windows down, playlist loud, no destination planned. Just the road, the music, and us.',
  },
  {
    label: 'Photo Walk',
    short: 'Photo',
    Icon: Camera,
    color: '#818cf8',
    description: 'Wander through the streets with no plan. Capture each other exactly as we are — no posing allowed.',
  },
  {
    label: 'Picnic',
    short: 'Picnic',
    Icon: TreePine,
    color: '#e879f9',
    description: 'A blanket in the park, good food, and absolutely no agenda. Laziness is the whole point.',
  },
  {
    label: 'Game Night',
    short: 'Games',
    Icon: Gamepad2,
    color: '#f472b6',
    description: 'Pick a game, make a small bet, and do not go easy on each other. Winner gets to choose the next date.',
  },
];

const SEGMENT_COUNT = DATES.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

function segmentPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export default function DateSpinnerScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [totalRotation, setTotalRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const spinCount = useRef(0);

  const spin = () => {
    if (isSpinning) return;
    spinCount.current += 1;
    setShowResult(false);
    setWinner(null);
    setIsSpinning(true);

    const winnerIdx = Math.floor(Math.random() * SEGMENT_COUNT);
    const extraSpins = (4 + Math.floor(Math.random() * 3)) * 360;
    const winnerCentre = winnerIdx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const currentRemainder = totalRotation % 360;
    const toAlign = (360 - ((winnerCentre + currentRemainder) % 360)) % 360;
    const newTotal = totalRotation + extraSpins + toAlign;

    setTotalRotation(newTotal);
    setWinner(winnerIdx);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      softTap();
      notifyOwner(`🎡 <b>Your angel just spun the Date Spinner!</b>\n\nThe wheel landed on: <b>${DATES[winnerIdx].label}</b>\n\n"${DATES[winnerIdx].description}"`);
    }, 4600);
  };

  const SIZE = 260;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 4;

  const WinnerIcon = winner !== null ? DATES[winner].Icon : null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center px-5 pt-8 pb-6 overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-600/12 to-transparent blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-gradient-to-t from-purple-600/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-5">

        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => setPhase('home')}
            className="flex items-center gap-2 px-3 py-2 glass-premium rounded-xl text-sm text-white/60 transition-transform cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-rose-400" />
            <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Date Spinner</span>
          </div>
        </div>

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-xl font-extrabold text-white mb-1">What are we doing?</h2>
          <p className="text-[13px] text-white/40">Spin the wheel and let fate decide our next date</p>
        </motion.div>

        {/* Wheel */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 120, damping: 14 }}
        >
          {/* Pointer */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20"
            style={{
              width: 0, height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '20px solid white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          />

          {/* Spinning SVG wheel */}
          <motion.svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ borderRadius: '50%', overflow: 'visible' }}
            animate={{ rotate: totalRotation }}
            transition={{
              duration: isSpinning ? 4.5 : 0,
              ease: isSpinning ? [0.15, 0.85, 0.35, 1] : 'linear',
            }}
          >
            <circle cx={CX} cy={CY} r={R + 2} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="4" />

            {DATES.map((date, i) => {
              const start = i * SEGMENT_ANGLE;
              const end = start + SEGMENT_ANGLE;
              const midAngle = start + SEGMENT_ANGLE / 2;
              const midRad = ((midAngle - 90) * Math.PI) / 180;
              const labelR = R * 0.62;
              const lx = CX + labelR * Math.cos(midRad);
              const ly = CY + labelR * Math.sin(midRad);

              return (
                <g key={i}>
                  <path
                    d={segmentPath(CX, CY, R, start, end)}
                    fill={date.color}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1.5"
                  />
                  {/* Short text label — rotated radially along the segment */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="rgba(255,255,255,0.9)"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.5"
                    transform={`rotate(${midAngle}, ${lx}, ${ly})`}
                  >
                    {date.short}
                  </text>
                </g>
              );
            })}

            {/* Center cap */}
            <circle cx={CX} cy={CY} r={22} fill="#0c0a14" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <circle cx={CX} cy={CY} r={8} fill="white" opacity="0.9" />
          </motion.svg>
        </motion.div>

        {/* Spin button */}
        <motion.button
          onClick={spin}
          disabled={isSpinning}
          className="relative px-10 py-4 rounded-2xl font-bold text-white text-[16px] flex items-center justify-center gap-2 transition-transform cursor-pointer disabled:opacity-60 overflow-hidden"
          style={{
            background: isSpinning
              ? 'linear-gradient(135deg, #6b7280, #4b5563)'
              : 'linear-gradient(135deg, #f43f5e, #ec4899)',
            boxShadow: isSpinning
              ? 'none'
              : '0 0 0 1px rgba(244,63,94,0.4), 0 8px 32px rgba(244,63,94,0.35)',
          }}
          
        >
          {!isSpinning && (
            <motion.div
              className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
              initial={{ x: '-150%' }}
              animate={{ x: '350%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {isSpinning ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Spinning...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {spinCount.current === 0 ? 'Spin the Wheel!' : 'Spin Again'}
              </>
            )}
          </span>
        </motion.button>

        {/* Result card */}
        <AnimatePresence>
          {showResult && winner !== null && WinnerIcon && (
            <motion.div
              className="w-full glass-rose rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 0 0 1px ${DATES[winner].color}30, 0 20px 60px rgba(0,0,0,0.3), 0 0 60px ${DATES[winner].color}15` }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <div
                className="h-[3px] w-full"
                style={{ background: `linear-gradient(to right, ${DATES[winner].color}, ${DATES[winner].color}aa, ${DATES[winner].color})` }}
              />
              <div className="p-5 text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl"
                  style={{ background: `${DATES[winner].color}25`, border: `1px solid ${DATES[winner].color}40` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                >
                  <WinnerIcon size={30} style={{ color: DATES[winner].color }} />
                </motion.div>
                <h3 className="text-xl font-extrabold text-white mb-2">{DATES[winner].label}</h3>
                <p className="text-[13px] text-white/65 leading-relaxed mb-4">{DATES[winner].description}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <Heart size={12} className="text-rose-400 animate-heartbeat" fill="currentColor" />
                  <span className="text-[11px] text-white/35 italic">Date idea unlocked</span>
                  <Heart size={12} className="text-rose-400 animate-heartbeat" fill="currentColor" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

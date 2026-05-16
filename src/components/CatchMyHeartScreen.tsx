'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { successVibe, softTap } from '@/lib/useHaptics';
import { playHeartbeat, playBloom, playSparkle } from '@/lib/sounds';

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  caught: boolean;
  missed: boolean;
  rotation: number;
}

const COLORS = ['#FF4D8D', '#A78BFA', '#FFB84D', '#FF7AA2', '#C084FC'];
const GAME_DURATION = 30;

export default function CatchMyHeartScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>('idle');
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [catchEffects, setCatchEffects] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const nextId = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopGame = useCallback((finalScore: number, finalMissed: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (fallRef.current) clearInterval(fallRef.current);
    setGameState('done');
    playBloom();
    successVibe();
    notifyOwner(`💕 <b>Catch My Heart results!</b>\n\n<b>Score:</b> ${finalScore} hearts caught\n<b>Missed:</b> ${finalMissed}\n\n<i>She gave it her best! 💗</i>`);
  }, []);

  const startGame = () => {
    softTap();
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setHearts([]);
    setCatchEffects([]);
    nextId.current = 0;
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // Countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setScore(s => { setMissed(m => { stopGame(s, m); return m; }); return s; });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawn hearts
    const spawnHeart = () => {
      const containerWidth = gameRef.current?.clientWidth ?? 320;
      const id = nextId.current++;
      const size = 28 + Math.random() * 22;
      setHearts(prev => [...prev, {
        id,
        x: 10 + Math.random() * (containerWidth - size - 20),
        y: -size - 10,
        size,
        speed: 2.2 + Math.random() * 2.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        caught: false,
        missed: false,
        rotation: Math.random() * 20 - 10,
      }]);
    };
    spawnHeart();
    spawnRef.current = setInterval(spawnHeart, 900);

    // Fall loop
    fallRef.current = setInterval(() => {
      const containerH = gameRef.current?.clientHeight ?? 580;
      setHearts(prev => {
        const updated = prev.map(h => h.caught || h.missed ? h : { ...h, y: h.y + h.speed });
        const newlyMissed = updated.filter(h => !h.missed && !h.caught && h.y > containerH);
        if (newlyMissed.length > 0) {
          setMissed(m => m + newlyMissed.length);
        }
        return updated
          .map(h => newlyMissed.find(m => m.id === h.id) ? { ...h, missed: true } : h)
          .filter(h => !h.missed && !(h.caught && h.y > containerH + 50));
      });
    }, 16);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (fallRef.current) clearInterval(fallRef.current);
    };
  }, [gameState, stopGame]);

  const catchHeart = (id: number, x: number, y: number, color: string) => {
    playHeartbeat();
    softTap();
    setHearts(prev => prev.map(h => h.id === id ? { ...h, caught: true } : h));
    setScore(s => s + 1);
    const effectId = Date.now();
    setCatchEffects(prev => [...prev, { id: effectId, x, y, color }]);
    setTimeout(() => setCatchEffects(prev => prev.filter(e => e.id !== effectId)), 600);
  };

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 15 ? '#FF4D8D' : timeLeft > 8 ? '#FFB84D' : '#FF4D4D';

  return (
    <motion.div className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(255,77,141,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-4">
        <button onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
          style={{ color: 'rgba(255,230,242,0.6)' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Heart size={14} fill="currentColor" style={{ color: '#FF4D8D' }} />
          <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Catch My Heart</span>
        </div>
        {gameState === 'playing' ? (
          <div className="text-sm font-black" style={{ color: timerColor }}>{timeLeft}s</div>
        ) : (
          <div className="w-14" />
        )}
      </div>

      {/* Timer bar */}
      {gameState === 'playing' && (
        <div className="mx-4 h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${timerColor}, ${timerColor}88)` }}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5, ease: 'linear' }} />
        </div>
      )}

      {/* Score row */}
      {gameState === 'playing' && (
        <div className="flex justify-center gap-8 px-4 py-2">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{score}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,179,199,0.5)' }}>caught</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: 'rgba(255,100,100,0.7)' }}>{missed}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,179,199,0.5)' }}>missed</div>
          </div>
        </div>
      )}

      {/* Game area */}
      <div ref={gameRef} className="relative flex-1 overflow-hidden mx-4 mb-4 rounded-[24px]"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Idle state */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 0 60px rgba(255,77,141,0.5)' }}
                animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Heart size={36} fill="white" className="text-white" />
              </motion.div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white mb-2">Catch My Heart 💕</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.55)' }}>
                  Hearts will fall from the sky. Tap them before they disappear. You have {GAME_DURATION} seconds!
                </p>
              </div>
              <motion.button onClick={startGame}
                className="px-10 py-4 rounded-[22px] font-black text-white text-[15px] active:scale-95 transition-transform cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 8px 36px rgba(255,77,141,0.45)' }}
                whileTap={{ scale: 0.94 }}>
                Start ✦
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done state */}
        <AnimatePresence>
          {gameState === 'done' && (
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#A78BFA)', boxShadow: '0 0 60px rgba(255,77,141,0.6)' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <Trophy size={34} className="text-white" />
              </motion.div>
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-1">{score}</div>
                <p className="text-[13px]" style={{ color: 'rgba(255,230,242,0.55)' }}>
                  hearts caught {missed > 0 ? `· ${missed} missed` : '· perfect!'}
                </p>
              </div>
              <div className="glass-cinema rounded-[20px] p-4 w-full text-center">
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.75)' }}>
                  {score >= 20 ? 'You caught so many of my hearts — just like you do in real life 💗'
                    : score >= 10 ? 'You caught my heart, again and again 💕'
                    : 'Even catching one of my hearts is everything to me 🌸'}
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={startGame}
                  className="flex-1 py-3.5 glass rounded-[18px] text-[13px] font-black text-white active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2">
                  <Sparkles size={14} /> Play Again
                </button>
                <button onClick={() => setPhase('home')}
                  className="flex-1 py-3.5 rounded-[18px] text-[13px] font-black text-white active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 6px 24px rgba(255,77,141,0.4)' }}>
                  <Heart size={13} fill="currentColor" /> Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Falling hearts */}
        {hearts.map(h => (
          <motion.button
            key={h.id}
            className="absolute cursor-pointer"
            style={{ left: h.x, top: h.y, width: h.size, height: h.size }}
            animate={h.caught ? { scale: [1, 1.6, 0], opacity: [1, 1, 0] } : { rotate: [h.rotation - 5, h.rotation + 5, h.rotation - 5] }}
            transition={h.caught ? { duration: 0.35 } : { repeat: Infinity, duration: 1.2 + Math.random() * 0.8 }}
            onClick={() => !h.caught && catchHeart(h.id, h.x + h.size / 2, h.y + h.size / 2, h.color)}
          >
            <svg viewBox="0 0 24 24" fill={h.color} style={{ filter: `drop-shadow(0 0 8px ${h.color}88)` }}>
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </motion.button>
        ))}

        {/* Catch effects */}
        {catchEffects.map(e => (
          <motion.div key={e.id} className="absolute pointer-events-none flex items-center justify-center"
            style={{ left: e.x - 20, top: e.y - 20, width: 40, height: 40 }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
            <div className="rounded-full" style={{ width: 40, height: 40, background: `radial-gradient(circle, ${e.color}66, transparent)` }} />
          </motion.div>
        ))}

        {/* Decorative bottom line */}
        {gameState === 'playing' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,141,0.4), transparent)' }} />
        )}
      </div>
    </motion.div>
  );
}

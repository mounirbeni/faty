'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Trophy, Zap } from 'lucide-react';
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
  isGolden: boolean;
  wobble: number; // phase offset for sinusoidal drift
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  emoji: string;
}

interface FloatMsg {
  id: number;
  text: string;
  x: number;
}

const COLORS = ['#FF4D8D', '#FF7AA2', '#A78BFA', '#C084FC', '#FF4D8D'];
const GOLDEN = '#FFB84D';
const GAME_DURATION = 35;

const MILESTONE_MSGS = [
  { at: 5,  text: '💕 Keep going!' },
  { at: 10, text: '🔥 You\'re on fire!' },
  { at: 15, text: '💗 Unstoppable!' },
  { at: 20, text: '✨ You caught my heart!' },
  { at: 25, text: '🌟 Pure magic!' },
  { at: 30, text: '💖 I love you so much!' },
];

const RESULT_MSGS = [
  { min: 0,  text: 'Every single one you caught means the world to me 🌸' },
  { min: 8,  text: 'You caught so many — just like you catch my heart every day 💕' },
  { min: 16, text: 'You\'re amazing. My heart is yours, every piece of it 💗' },
  { min: 24, text: 'You caught almost everything 🥹 That\'s exactly what you do to me.' },
  { min: 30, text: 'Perfect 💖 You caught every heart. Just like you caught mine.' },
];

export default function CatchMyHeartScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>('idle');
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatMsgs, setFloatMsgs] = useState<FloatMsg[]>([]);
  const [scoreFlash, setScoreFlash] = useState(false);
  const [comboFlash, setComboFlash] = useState(false);

  const nextId = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const shownMilestones = useRef<Set<number>>(new Set());
  const timeRef = useRef(GAME_DURATION);

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (fallRef.current) clearInterval(fallRef.current);
  };

  const endGame = useCallback(() => {
    stopAll();
    setGameState('done');
    playBloom();
    successVibe();
    notifyOwner(
      `💕 <b>Catch My Heart results!</b>\n\n` +
      `<b>Score:</b> ${scoreRef.current} hearts caught\n` +
      `<b>Missed:</b> ${missedRef.current}\n` +
      `<b>Best combo:</b> ${maxComboRef.current}x\n\n` +
      `<i>She played her heart out for you 💗</i>`
    );
  }, []);

  const startGame = () => {
    softTap();
    stopAll();
    setScore(0); scoreRef.current = 0;
    setMissed(0); missedRef.current = 0;
    setCombo(0); comboRef.current = 0;
    setMaxCombo(0); maxComboRef.current = 0;
    setTimeLeft(GAME_DURATION); timeRef.current = GAME_DURATION;
    setHearts([]);
    setParticles([]);
    setFloatMsgs([]);
    nextId.current = 0;
    shownMilestones.current = new Set();
    setGameState('playing');
  };

  // Spawn a milestone float message
  const showMilestone = (s: number) => {
    const msg = MILESTONE_MSGS.find(m => m.at === s);
    if (!msg || shownMilestones.current.has(s)) return;
    shownMilestones.current.add(s);
    const containerW = gameRef.current?.clientWidth ?? 320;
    const msgId = Date.now();
    setFloatMsgs(prev => [...prev, { id: msgId, text: msg.text, x: containerW / 2 }]);
    setTimeout(() => setFloatMsgs(prev => prev.filter(m => m.id !== msgId)), 1800);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // Countdown
    timerRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        endGame();
      }
    }, 1000);

    // Spawn hearts — interval shrinks as time runs out
    const getSpawnInterval = () => {
      const progress = 1 - (timeRef.current / GAME_DURATION);
      return Math.max(500, 950 - progress * 450);
    };

    const spawnHeart = () => {
      const containerW = gameRef.current?.clientWidth ?? 320;
      const isGolden = Math.random() < 0.14;
      const size = isGolden ? 44 : (28 + Math.random() * 20);
      const id = nextId.current++;
      const progress = 1 - (timeRef.current / GAME_DURATION);
      const speed = (isGolden ? 1.4 : 2.0) + progress * 1.8 + Math.random() * 1.4;

      setHearts(prev => [...prev, {
        id,
        x: 12 + Math.random() * (containerW - size - 24),
        y: -size - 10,
        size,
        speed,
        color: isGolden ? GOLDEN : COLORS[Math.floor(Math.random() * COLORS.length)],
        caught: false,
        missed: false,
        rotation: Math.random() * 24 - 12,
        isGolden,
        wobble: Math.random() * Math.PI * 2,
      }]);

      // Re-schedule at dynamic interval
      if (spawnRef.current) clearInterval(spawnRef.current);
      spawnRef.current = setInterval(spawnHeart, getSpawnInterval());
    };

    spawnHeart();
    spawnRef.current = setInterval(spawnHeart, getSpawnInterval());

    // Fall loop ~60fps
    let frame = 0;
    fallRef.current = setInterval(() => {
      frame++;
      const containerH = gameRef.current?.clientHeight ?? 580;

      setHearts(prev => {
        const newlyMissed: FallingHeart[] = [];

        const updated = prev.map(h => {
          if (h.caught || h.missed) return h;
          const wobbleX = Math.sin(frame * 0.04 + h.wobble) * 1.2;
          const ny = h.y + h.speed;
          if (ny > containerH + 10) {
            newlyMissed.push(h);
            return { ...h, y: ny, missed: true };
          }
          return { ...h, y: ny, x: h.x + wobbleX };
        });

        if (newlyMissed.length > 0) {
          const addMissed = newlyMissed.length;
          missedRef.current += addMissed;
          setMissed(missedRef.current);
          // Break combo on miss
          comboRef.current = 0;
          setCombo(0);
        }

        // Remove fully gone hearts
        return updated.filter(h => !(h.missed && h.y > containerH + 60) && !(h.caught));
      });
    }, 16);

    return stopAll;
  }, [gameState, endGame]);

  const catchHeart = (id: number, x: number, y: number, color: string, isGolden: boolean, size: number) => {
    playHeartbeat();
    softTap();

    setHearts(prev => prev.filter(h => h.id !== id));

    const points = isGolden ? 3 : 1;
    scoreRef.current += points;
    setScore(scoreRef.current);
    setScoreFlash(true);
    setTimeout(() => setScoreFlash(false), 200);

    comboRef.current += 1;
    setCombo(comboRef.current);
    if (comboRef.current > maxComboRef.current) {
      maxComboRef.current = comboRef.current;
      setMaxCombo(maxComboRef.current);
    }
    if (comboRef.current >= 3) {
      setComboFlash(true);
      setTimeout(() => setComboFlash(false), 300);
      playSparkle();
    }

    showMilestone(scoreRef.current);

    // Burst particles
    const count = isGolden ? 10 : 6;
    const containerW = gameRef.current?.clientWidth ?? 320;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: x + size / 2,
      y: y + size / 2,
      color: isGolden ? GOLDEN : color,
      angle: (360 / count) * i + Math.random() * 20,
      emoji: isGolden ? '⭐' : Math.random() > 0.5 ? '💕' : '✨',
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id));
      setParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 700);
  };

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 20 ? '#FF4D8D' : timeLeft > 10 ? '#FFB84D' : '#FF4D4D';
  const resultMsg = [...RESULT_MSGS].reverse().find(m => score >= m.min)?.text ?? RESULT_MSGS[0].text;

  return (
    <motion.div className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}>

      {/* Background aurora */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(255,77,141,0.14) 0%, rgba(167,139,250,0.07) 60%, transparent 100%)', filter: 'blur(60px)' }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-3 shrink-0">
        <button onClick={() => { stopAll(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
          style={{ color: 'rgba(255,230,242,0.6)' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Heart size={14} fill="currentColor" style={{ color: '#FF4D8D' }} className="animate-heartbeat" />
          <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Catch My Heart</span>
        </div>
        {gameState === 'playing' ? (
          <motion.div className="text-sm font-black min-w-[36px] text-right"
            style={{ color: timerColor }}
            animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.7 }}>
            {timeLeft}s
          </motion.div>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Timer bar */}
      {gameState === 'playing' && (
        <div className="mx-4 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full transition-colors duration-500"
            style={{ background: `linear-gradient(90deg, ${timerColor}, ${timerColor}88)` }}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.8, ease: 'linear' }} />
        </div>
      )}

      {/* Score row */}
      {gameState === 'playing' && (
        <div className="flex justify-center items-center gap-6 px-4 py-2 shrink-0">
          <div className="text-center">
            <motion.div
              className="text-3xl font-black text-white tabular-nums"
              animate={scoreFlash ? { scale: [1, 1.3, 1], color: ['#ffffff', '#FFB84D', '#ffffff'] } : {}}
              transition={{ duration: 0.25 }}>
              {score}
            </motion.div>
            <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,179,199,0.5)' }}>caught</div>
          </div>

          {/* Combo badge */}
          <AnimatePresence>
            {combo >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex flex-col items-center">
                <motion.div
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                  style={{
                    background: combo >= 5
                      ? 'linear-gradient(135deg,#FFB84D,#FF4D8D)'
                      : 'linear-gradient(135deg,#FF4D8D,#A78BFA)',
                    boxShadow: `0 0 20px ${combo >= 5 ? 'rgba(255,184,77,0.6)' : 'rgba(255,77,141,0.5)'}`,
                  }}
                  animate={comboFlash ? { scale: [1, 1.2, 1] } : { scale: [1, 1.04, 1] }}
                  transition={comboFlash ? { duration: 0.25 } : { repeat: Infinity, duration: 1.2 }}>
                  <Zap size={11} className="text-white" fill="currentColor" />
                  <span className="text-[11px] font-black text-white">{combo}x</span>
                </motion.div>
                <div className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,184,77,0.6)' }}>combo!</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center">
            <div className="text-3xl font-black tabular-nums" style={{ color: 'rgba(255,100,100,0.65)' }}>{missed}</div>
            <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,179,199,0.5)' }}>missed</div>
          </div>
        </div>
      )}

      {/* Game area */}
      <div ref={gameRef} className="relative flex-1 overflow-hidden mx-4 mb-4 rounded-[28px]"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Ambient inner glow */}
        <div className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,77,141,0.08) 0%, transparent 60%)' }} />

        {/* Idle */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>

              {/* Decorative floating hearts behind orb */}
              {['#FF4D8D', '#A78BFA', '#FFB84D'].map((c, i) => (
                <motion.div key={i} className="absolute pointer-events-none"
                  style={{ left: `${20 + i * 28}%`, top: `${15 + i * 10}%` }}
                  animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.4 + i * 0.5, delay: i * 0.4 }}>
                  <svg viewBox="0 0 24 24" width={16 + i * 6} height={16 + i * 6} fill={c} style={{ filter: `drop-shadow(0 0 8px ${c}88)` }}>
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                  </svg>
                </motion.div>
              ))}

              <motion.div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 0 80px rgba(255,77,141,0.6), 0 0 40px rgba(255,77,141,0.4)' }}
                animate={{ scale: [1, 1.07, 1], boxShadow: ['0 0 60px rgba(255,77,141,0.5)', '0 0 90px rgba(255,77,141,0.75)', '0 0 60px rgba(255,77,141,0.5)'] }}
                transition={{ repeat: Infinity, duration: 1.6 }}>
                <Heart size={44} fill="white" className="text-white" />
              </motion.div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-white mb-2">Catch My Heart 💕</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.55)' }}>
                  Hearts fall from above — tap them fast before they escape!
                  Golden ones ⭐ are worth <b className="text-amber-300">3 points</b>.
                  Build a combo without missing 🔥
                </p>
              </div>

              <motion.button onClick={startGame}
                className="px-12 py-4 rounded-[22px] font-black text-white text-[16px] active:scale-95 transition-transform cursor-pointer flex items-center gap-2.5"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 8px 40px rgba(255,77,141,0.5)' }}
                whileTap={{ scale: 0.94 }}>
                <Heart size={18} fill="currentColor" /> Let's go!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done */}
        <AnimatePresence>
          {gameState === 'done' && (
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FF4D8D,#A78BFA)', boxShadow: '0 0 70px rgba(255,77,141,0.65)' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <Trophy size={34} className="text-white" />
              </motion.div>

              <motion.div className="text-center"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="text-5xl font-black text-white mb-1">{score}</div>
                <p className="text-[13px]" style={{ color: 'rgba(255,230,242,0.5)' }}>
                  hearts caught · {missed} missed · best combo {maxCombo}x
                </p>
              </motion.div>

              <motion.div className="glass-cinema rounded-[20px] p-4 w-full text-center"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.8)' }}>
                  {resultMsg}
                </p>
                {maxCombo >= 5 && (
                  <p className="text-[11px] mt-2 font-bold" style={{ color: '#FFB84D' }}>
                    ✨ {maxCombo}x combo — you are incredible!
                  </p>
                )}
              </motion.div>

              <motion.div className="flex gap-3 w-full"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button onClick={startGame}
                  className="flex-1 py-3.5 glass rounded-[18px] text-[13px] font-black text-white active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2">
                  <Sparkles size={14} /> Again
                </button>
                <button onClick={() => setPhase('home')}
                  className="flex-[1.4] py-3.5 rounded-[18px] text-[13px] font-black text-white active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 6px 24px rgba(255,77,141,0.45)' }}>
                  <Heart size={13} fill="currentColor" /> Back to Map
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Falling hearts */}
        {hearts.map(h => (
          <motion.button
            key={h.id}
            className="absolute cursor-pointer select-none"
            style={{ left: h.x, top: h.y, width: h.size, height: h.size, zIndex: 5 }}
            animate={h.missed
              ? { opacity: 0, scale: 0.3, y: 20 }
              : { rotate: [h.rotation - 6, h.rotation + 6, h.rotation - 6] }}
            transition={h.missed
              ? { duration: 0.3 }
              : { repeat: Infinity, duration: 1.3 + Math.random() * 0.8 }}
            onClick={() => !h.caught && !h.missed && catchHeart(h.id, h.x, h.y, h.color, h.isGolden, h.size)}
          >
            {h.isGolden ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}>
                <svg viewBox="0 0 24 24" fill={GOLDEN}
                  style={{ width: h.size, height: h.size, filter: `drop-shadow(0 0 12px ${GOLDEN}) drop-shadow(0 0 6px #fff8)` }}>
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </motion.div>
            ) : (
              <svg viewBox="0 0 24 24" fill={h.color}
                style={{ width: h.size, height: h.size, filter: `drop-shadow(0 0 8px ${h.color}99)` }}>
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            )}
          </motion.button>
        ))}

        {/* Burst particles */}
        {particles.map(p => (
          <motion.div key={p.id}
            className="absolute pointer-events-none text-base select-none"
            style={{ left: p.x, top: p.y, zIndex: 10 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * (50 + Math.random() * 40),
              y: Math.sin((p.angle * Math.PI) / 180) * (50 + Math.random() * 40),
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>
            {p.emoji}
          </motion.div>
        ))}

        {/* Milestone float messages */}
        <AnimatePresence>
          {floatMsgs.map(m => (
            <motion.div key={m.id}
              className="absolute pointer-events-none z-20 font-black text-[15px] text-white text-center whitespace-nowrap"
              style={{ left: '50%', x: '-50%', bottom: '30%', textShadow: '0 0 20px rgba(255,77,141,0.8)' }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.4 }}>
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Catch zone hint line at bottom */}
        {gameState === 'playing' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,141,0.3), transparent)' }} />
        )}
      </div>
    </motion.div>
  );
}

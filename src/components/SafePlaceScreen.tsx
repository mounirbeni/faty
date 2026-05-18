'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, CloudRain, Wind } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';
import { trackInteraction } from '@/lib/sessionTracker';
import { playGlow, playNightSwell, playHeartbeat } from '@/lib/sounds';

/* ── Deterministic pseudo-random ── */
const pr = (s: number) => Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1;

/* ── Rain drops (55 deterministic) ── */
const RAIN_DROPS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 102 - 1,
  delay: pr(i * 3 + 1) * 3.5,
  duration: 1.2 + pr(i * 3 + 2) * 1.1,
  height: 14 + pr(i * 7) * 16,
  opacity: 0.04 + pr(i * 11) * 0.09,
  width: 0.8 + pr(i * 13) * 0.9,
}));

/* ── Floating warm particles (14) ── */
const WARM_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: pr(i * 5) * 100,
  delay: pr(i * 5 + 1) * 12,
  duration: 14 + pr(i * 5 + 2) * 10,
  size: 5 + pr(i * 5 + 3) * 8,
  opacity: 0.05 + pr(i * 5 + 4) * 0.12,
  isHeart: i % 3 !== 0,
  color: i % 4 === 0 ? '#FFB84D' : i % 4 === 1 ? '#FF4D8D' : '#FF7AA2',
}));

/* ── Breathing cycle ── */
const BREATH_CYCLE = [
  { label: 'Breathe in…',  sub: 'gently fill your lungs',  duration: 4000, scale: 1.18 },
  { label: 'Hold…',        sub: 'feel me beside you',       duration: 2000, scale: 1.18 },
  { label: 'Breathe out…', sub: 'let everything release',   duration: 4500, scale: 1    },
  { label: 'Rest…',        sub: 'you are safe here',        duration: 1500, scale: 1    },
];

/* ── Comfort messages (10 rotating) ── */
const COMFORT_MESSAGES = [
  'You are safe here. Everything outside can wait.',
  'I am right here with you. Always.',
  'This space was built just for you.',
  'Take all the time you need. I am not going anywhere.',
  'Whatever you are feeling, I feel it too.',
  'You never have to be strong here. Just be you.',
  'Close your eyes. I am holding you.',
  'You are the most precious thing in my universe.',
  'Even the rain knows how to be gentle tonight.',
  'I am not going anywhere. Ever.',
];

export default function SafePlaceScreen() {
  const { setPhase } = useGameStore();

  /* ── State ── */
  const [isCuddling, setIsCuddling]           = useState(false);
  const [cuddleIntensity, setCuddleIntensity] = useState(0);
  const [cuddleNotified, setCuddleNotified]   = useState(false);
  const [breathStep, setBreathStep]           = useState(0);
  const [breathActive, setBreathActive]       = useState(false);
  const [msgIndex, setMsgIndex]               = useState(0);
  const [msgVisible, setMsgVisible]           = useState(true);
  const [whisperVisible, setWhisperVisible]   = useState(false);

  /* ── Refs ── */
  const enteredAt      = useRef(Date.now());
  const cuddleRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const intensityRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const rainPressRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whisperFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── On mount: sounds + track session ── */
  useEffect(() => {
    enteredAt.current = Date.now();
    playGlow();
    setTimeout(() => playNightSwell(), 700);
    return () => {
      const mins = Math.round((Date.now() - enteredAt.current) / 60_000);
      trackInteraction('safe-place-session', mins > 0 ? `${mins} min` : undefined);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Heartbeat while cuddling ── */
  useEffect(() => {
    if (isCuddling) {
      heartbeat();
      playHeartbeat();
      cuddleRef.current    = setInterval(() => { heartbeat(); playHeartbeat(); }, 1200);
      intensityRef.current = setInterval(() => {
        setCuddleIntensity(v => Math.min(1, v + 0.08));
      }, 200);
    } else {
      if (cuddleRef.current)    clearInterval(cuddleRef.current);
      if (intensityRef.current) clearInterval(intensityRef.current);
      setCuddleIntensity(0);
    }
    return () => {
      if (cuddleRef.current)    clearInterval(cuddleRef.current);
      if (intensityRef.current) clearInterval(intensityRef.current);
    };
  }, [isCuddling]);

  /* ── Breathing guide cycle ── */
  useEffect(() => {
    if (!breathActive) return;
    const step = BREATH_CYCLE[breathStep];
    const t = setTimeout(() => {
      setBreathStep(s => (s + 1) % BREATH_CYCLE.length);
    }, step.duration);
    return () => clearTimeout(t);
  }, [breathActive, breathStep]);

  /* ── Rotating comfort messages every 7s ── */
  useEffect(() => {
    const t = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % COMFORT_MESSAGES.length);
        setMsgVisible(true);
      }, 700);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  /* ── Handlers ── */
  const handleCuddleStart = useCallback(() => {
    setIsCuddling(true);
    if (!cuddleNotified) {
      setCuddleNotified(true);
      notifyOwner(
        '🫂 <b>She needs your warmth right now</b>\n\nShe is holding the cuddle heart in Our Safe Place.\n\n<i>Go wrap her in your arms tonight 💗</i>'
      );
    }
  }, [cuddleNotified]);

  const handleCuddleEnd = useCallback(() => setIsCuddling(false), []);

  /* ── Secret whisper: long-press on rain window ── */
  const handleRainPressStart = useCallback(() => {
    rainPressRef.current = setTimeout(() => {
      setWhisperVisible(true);
      if (whisperFadeRef.current) clearTimeout(whisperFadeRef.current);
      whisperFadeRef.current = setTimeout(() => setWhisperVisible(false), 4000);
    }, 1200);
  }, []);

  const handleRainPressEnd = useCallback(() => {
    if (rainPressRef.current) clearTimeout(rainPressRef.current);
  }, []);

  const breathStep_ = BREATH_CYCLE[breathStep];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0, filter: 'blur(16px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    >
      {/* ════════════════════════════════════════
          FIXED ATMOSPHERIC LAYERS  (z-index 0)
          ════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>

        {/* Deep background gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(12,4,20,0.97) 0%, rgba(25,10,35,0.92) 55%, rgba(35,14,28,0.88) 100%)',
        }} />

        {/* Candle glow layer 1 — wide warm base */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh]" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,140,60,0.18) 0%, rgba(255,100,40,0.08) 45%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'candle-flicker 3.5s ease-in-out infinite',
        }} />
        {/* Candle glow layer 2 — left-center */}
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[280px]" style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,160,60,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'candle-flicker 4.2s ease-in-out infinite',
          animationDelay: '0.8s',
        }} />
        {/* Candle glow layer 3 — right */}
        <div className="absolute bottom-0 right-1/4 w-[160px] h-[220px]" style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,120,60,0.12) 0%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'candle-flicker 3.8s ease-in-out infinite',
          animationDelay: '1.5s',
        }} />

        {/* Warm top glow — pink/amber radial at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[300px]" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,77,141,0.16) 0%, rgba(255,140,80,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Deep rose ambient wash */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(255,30,80,0.04) 0%, rgba(180,20,60,0.08) 60%, rgba(255,100,40,0.06) 100%)',
        }} />
      </div>

      {/* ════════════════════════════════════════
          RAIN WINDOW — top 30%  (z-index 1)
          Long-press 1.2s → reveals secret whisper
          ════════════════════════════════════════ */}
      <div
        className="fixed top-0 left-0 right-0 h-[30vh] overflow-hidden"
        style={{ zIndex: 1 }}
        onPointerDown={handleRainPressStart}
        onPointerUp={handleRainPressEnd}
        onPointerLeave={handleRainPressEnd}
        onTouchStart={handleRainPressStart}
        onTouchEnd={handleRainPressEnd}
      >
        {/* Glass tint */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(20,5,40,0.45) 0%, rgba(20,5,40,0.15) 70%, transparent 100%)',
        }} />
        {/* Outside rain mist */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(60,80,140,0.12) 0%, transparent 80%)',
          backdropFilter: 'blur(0.5px)',
        }} />

        {/* Rain drops */}
        {RAIN_DROPS.map(r => (
          <motion.div
            key={r.id}
            className="absolute pointer-events-none"
            style={{
              left: `${r.x}%`, top: 0,
              width: r.width, height: r.height,
              background: 'linear-gradient(180deg, transparent 0%, rgba(180,200,255,0.55) 40%, rgba(210,230,255,0.8) 65%, transparent 100%)',
              borderRadius: 999,
            }}
            animate={{ y: ['-20px', '30vh'] }}
            transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Window sill gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,180,120,0.3) 30%, rgba(255,200,150,0.45) 50%, rgba(255,180,120,0.3) 70%, transparent)',
        }} />

        {/* Secret whisper */}
        <AnimatePresence>
          {whisperVisible && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <p className="text-center text-[13px] italic px-8 leading-relaxed"
                style={{ color: 'rgba(255,220,200,0.85)', textShadow: '0 0 20px rgba(255,140,60,0.6)' }}>
                I fell for you before I even knew how.<br />
                You were already mine.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════
          FLOATING WARM PARTICLES  (z-index 2)
          ════════════════════════════════════════ */}
      {WARM_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            color: p.color,
            opacity: p.opacity,
            zIndex: 2,
          }}
          initial={{ y: '110dvh' }}
          animate={{ y: '-10dvh' }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {p.isHeart ? '♥' : '✦'}
        </motion.div>
      ))}

      {/* ════════════════════════════════════════
          CONTENT  (z-index 10)
          ════════════════════════════════════════ */}
      <div
        className="relative flex flex-col px-5 pt-[30vh] pb-12 max-w-lg mx-auto w-full gap-5"
        style={{ zIndex: 10 }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-1 -mt-2">
          <button
            onClick={() => { softTap(); setPhase('home'); }}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowLeft size={16} /> Universe
          </button>

          <div className="text-center">
            <p
              className="text-[11px] uppercase tracking-widest font-black flex items-center gap-1.5 justify-center"
              style={{ color: 'rgba(255,140,80,0.7)' }}
            >
              <CloudRain size={12} /> Our Safe Place
            </p>
          </div>

          <div style={{ width: 80 }} />
        </div>

        {/* ── Rotating comfort messages ── */}
        <motion.div className="text-center py-1">
          <AnimatePresence mode="wait">
            {msgVisible && (
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.65 }}
                className="text-[13px] italic"
                style={{ color: 'rgba(255,200,180,0.65)' }}
              >
                {COMFORT_MESSAGES[msgIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Intro card ── */}
        <motion.div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,140,60,0.12) 0%, rgba(255,77,141,0.09) 100%)',
            border: '1px solid rgba(255,140,60,0.22)',
            boxShadow: '0 0 50px rgba(255,140,60,0.15), 0 8px 32px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #FFB84D, #FF4D8D, #FFB84D)' }} />
          <div className="p-5 flex items-start gap-4">
            <motion.div
              className="text-3xl mt-0.5 shrink-0"
              animate={{ scale: [1, 1.08, 1], rotate: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ☕
            </motion.div>
            <div>
              <h2 className="text-[16px] font-black text-white mb-1.5">Our Safe Place</h2>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,210,180,0.7)' }}>
                Imagine me wrapping a blanket around you. Rain outside. Soft light. Just us here, quiet and close.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Hold-heart cuddle orb ── */}
        <motion.div
          className="rounded-[28px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,141,0.1) 0%, rgba(255,140,60,0.07) 100%)',
            border: `1px solid rgba(255,77,141,${0.2 + cuddleIntensity * 0.3})`,
            boxShadow: `0 0 ${40 + cuddleIntensity * 60}px rgba(255,77,141,${0.15 + cuddleIntensity * 0.25}), 0 8px 32px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="p-6 flex flex-col items-center text-center">

            <h2 className="text-[16px] font-black text-white mb-1">Hold me close</h2>
            <p className="text-[12px] mb-6" style={{ color: 'rgba(255,200,180,0.55)' }}>
              Press and hold. Feel my heartbeat. I am right here.
            </p>

            {/* Heart orb */}
            <div
              className="relative flex items-center justify-center w-36 h-36 mb-4 select-none"
              onPointerDown={handleCuddleStart}
              onPointerUp={handleCuddleEnd}
              onPointerLeave={handleCuddleEnd}
              onTouchStart={handleCuddleStart}
              onTouchEnd={handleCuddleEnd}
              style={{ cursor: 'pointer', touchAction: 'none' }}
            >
              {/* Pulse rings */}
              <AnimatePresence>
                {isCuddling && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid rgba(255,77,141,${0.4 + cuddleIntensity * 0.3})` }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: [1, 1.6, 2.2], opacity: [0.7, 0.3, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1px solid rgba(255,140,80,${0.3 + cuddleIntensity * 0.2})` }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: [1, 1.9, 2.8], opacity: [0.5, 0.2, 0] }}
                      transition={{ duration: 1.4, delay: 0.35, repeat: Infinity, ease: 'easeOut' }}
                    />
                    {/* 6 particle bursts */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#FF4D8D' : '#FFB84D',
                          top: '50%', left: '50%',
                        }}
                        animate={{
                          x: Math.cos((i / 6) * Math.PI * 2) * (55 + cuddleIntensity * 20),
                          y: Math.sin((i / 6) * Math.PI * 2) * (55 + cuddleIntensity * 20),
                          opacity: [0.9, 0],
                          scale: [1.5, 0],
                        }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeOut' }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Core heart */}
              <motion.div
                className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background: isCuddling
                    ? `radial-gradient(circle, rgba(255,${Math.round(77 + cuddleIntensity * 80)},141,1) 0%, rgba(201,36,95,1) 100%)`
                    : 'rgba(255,77,141,0.1)',
                  border: '1px solid rgba(255,77,141,0.35)',
                  boxShadow: isCuddling
                    ? `0 0 ${30 + cuddleIntensity * 40}px rgba(255,77,141,${0.5 + cuddleIntensity * 0.4}), 0 0 ${60 + cuddleIntensity * 60}px rgba(255,100,80,${0.2 + cuddleIntensity * 0.2})`
                    : '0 0 20px rgba(255,77,141,0.15)',
                  transition: 'background 0.4s ease, box-shadow 0.3s ease',
                }}
                animate={isCuddling ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart
                  size={48}
                  className="transition-colors duration-400"
                  style={{ color: isCuddling ? 'white' : 'rgba(255,77,141,0.45)' }}
                  fill={isCuddling ? 'currentColor' : 'none'}
                />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {isCuddling ? (
                <motion.div
                  key="cuddling"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <p className="text-[14px] font-semibold" style={{ color: 'rgba(255,180,160,0.9)' }}>
                    *holding you tight…*
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,150,130,0.5)' }}>
                    I feel your heartbeat 💗
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px]"
                  style={{ color: 'rgba(255,180,160,0.4)' }}
                >
                  Hold me close ♥
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Breathing guide ── */}
        <motion.div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.09) 0%, rgba(123,92,255,0.06) 100%)',
            border: '1px solid rgba(167,139,250,0.18)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wind size={14} style={{ color: 'rgba(167,139,250,0.7)' }} />
                <span
                  className="text-[12px] font-black uppercase tracking-widest"
                  style={{ color: 'rgba(167,139,250,0.6)' }}
                >
                  Breathing Guide
                </span>
              </div>
              <button
                onClick={() => { softTap(); setBreathActive(v => !v); setBreathStep(0); }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold active:scale-95 transition-transform cursor-pointer"
                style={{
                  background: breathActive ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.25)',
                  color: breathActive ? 'rgba(196,181,253,0.9)' : 'rgba(255,230,242,0.45)',
                }}
              >
                {breathActive ? 'Stop' : 'Start'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Breath orb */}
              <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}
                  animate={breathActive ? { scale: breathStep_.scale, opacity: [0.4, 0.8, 0.4] } : { scale: 1 }}
                  transition={{ duration: breathStep_.duration / 1000, ease: 'easeInOut' }}
                />
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{ background: 'rgba(167,139,250,0.6)' }}
                  animate={breathActive ? { scale: breathStep_.scale * 0.8 } : { scale: 1 }}
                  transition={{ duration: breathStep_.duration / 1000, ease: 'easeInOut' }}
                />
              </div>

              {/* Breath text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={breathStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[15px] font-bold text-white">
                    {breathActive ? breathStep_.label : 'Ready when you are'}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(196,181,253,0.55)' }}>
                    {breathActive ? breathStep_.sub : 'Breathe with me for a moment'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.p
          className="text-center text-[10px] italic pb-2"
          style={{ color: 'rgba(255,200,180,0.25)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          🕯️ Rain on the window · soft light · only us 🕯️
        </motion.p>
      </div>
    </motion.div>
  );
}

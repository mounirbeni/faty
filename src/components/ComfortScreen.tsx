'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Bell, Wind } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';
import { trackInteraction } from '@/lib/sessionTracker';
import { getCachedPresence } from '@/lib/presenceContext';
import { playHeartbeat, playGlow, playNightSwell } from '@/lib/sounds';

/* ── Deterministic rain drops ── */
const pr = (s: number) => Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1;
const RAIN_DROPS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 102 - 1,
  delay: pr(i * 3 + 1) * 3.5,
  duration: 1.2 + pr(i * 3 + 2) * 1.1,
  height: 14 + pr(i * 7) * 16,
  opacity: 0.04 + pr(i * 11) * 0.09,
  width: 0.8 + pr(i * 13) * 0.9,
}));

/* ── Floating warm particles ── */
const WARM_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: pr(i * 5) * 100,
  delay: pr(i * 5 + 1) * 12,
  duration: 14 + pr(i * 5 + 2) * 10,
  size: 5 + pr(i * 5 + 3) * 8,
  opacity: 0.05 + pr(i * 5 + 4) * 0.12,
  isHeart: i % 3 !== 0,
  color: i % 4 === 0 ? '#FFB84D' : i % 4 === 1 ? '#FF4D8D' : '#FF7AA2',
}));

/* ── Breathing guide steps ── */
const BREATH_CYCLE = [
  { label: 'Breathe in…', sub: 'gently fill your lungs', duration: 4000, scale: 1.18 },
  { label: 'Hold…',       sub: 'feel me beside you',    duration: 2000, scale: 1.18 },
  { label: 'Breathe out…',sub: 'let everything release', duration: 4500, scale: 1 },
  { label: 'Rest…',       sub: 'you are safe here',      duration: 1500, scale: 1 },
];

const COMFORT_MESSAGES = [
  'You are safe here. Everything outside can wait.',
  'I am right here with you. Always.',
  'This space was built just for you.',
  'Take all the time you need. I am not going anywhere.',
  'Whatever you are feeling, I feel it too.',
];

export default function ComfortScreen() {
  const { setPhase } = useGameStore();
  const [isCuddling, setIsCuddling] = useState(false);
  const [cuddleIntensity, setCuddleIntensity] = useState(0);
  const [alertSent, setAlertSent] = useState(false);
  const [cuddleNotified, setCuddleNotified] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathActive, setBreathActive] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const comfortEnteredAt = useRef(Date.now());
  const cuddleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intensityRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Track duration on unmount ── */
  useEffect(() => {
    comfortEnteredAt.current = Date.now();
    playGlow();
    setTimeout(() => playNightSwell(), 600);
    return () => {
      const durationMs = Date.now() - comfortEnteredAt.current;
      const minutes = Math.round(durationMs / 60_000);
      trackInteraction('comfort-session', minutes > 0 ? `${minutes} min` : undefined);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Heartbeat while cuddling ── */
  useEffect(() => {
    if (isCuddling) {
      heartbeat(); playHeartbeat();
      cuddleRef.current = setInterval(() => { heartbeat(); playHeartbeat(); }, 1200);
      intensityRef.current = setInterval(() => {
        setCuddleIntensity(v => Math.min(1, v + 0.08));
      }, 200);
    } else {
      if (cuddleRef.current) clearInterval(cuddleRef.current);
      if (intensityRef.current) clearInterval(intensityRef.current);
      setCuddleIntensity(0);
    }
    return () => {
      if (cuddleRef.current) clearInterval(cuddleRef.current);
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

  /* ── Rotating comfort messages ── */
  useEffect(() => {
    const t = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % COMFORT_MESSAGES.length);
        setMsgVisible(true);
      }, 700);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const handleCuddleStart = useCallback(() => {
    setIsCuddling(true);
    if (!cuddleNotified) {
      setCuddleNotified(true);
      const ctx = getCachedPresence();
      const timeNote = ctx ? `\n🕒 ${ctx.moroccoTime} Morocco time  ·  📍 ${ctx.locationLabel}` : '';
      notifyOwner(`🫂 <b>She needs your warmth right now</b>${timeNote}\n\nShe is holding the cuddle heart in the Comfort Room.\n\n<i>She might just need to feel you close tonight 💗</i>`);
    }
  }, [cuddleNotified]);

  const handleCuddleEnd = useCallback(() => setIsCuddling(false), []);

  const handleSendAlert = useCallback(() => {
    if (alertSent) return;
    softTap(); successVibe();
    setAlertSent(true);
    const ctx = getCachedPresence();
    const timeNote = ctx ? `\n🕒 ${ctx.moroccoTime} Morocco time  ·  📍 ${ctx.locationLabel}` : '';
    notifyOwner(
      `🚨 <b>Your love needs you right now!</b>${timeNote}\n\nShe is in the Comfort Room. She might be feeling unwell or just needs your warmth.\n\nSend her some love immediately 💗🩹`
    );
  }, [alertSent]);

  const breathStep_ = BREATH_CYCLE[breathStep];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* ── Fixed atmospheric layers ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>

        {/* Candle glow — warm amber bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh]" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,140,60,0.18) 0%, rgba(255,100,40,0.08) 45%, transparent 70%)',
          animation: 'candle-flicker 3.5s ease-in-out infinite',
        }} />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[280px]" style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,160,60,0.14) 0%, transparent 70%)',
          animation: 'candle-flicker 4.2s ease-in-out infinite',
          animationDelay: '0.8s',
        }} />
        <div className="absolute bottom-0 right-1/4 w-[160px] h-[220px]" style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,120,60,0.12) 0%, transparent 70%)',
          animation: 'candle-flicker 3.8s ease-in-out infinite',
          animationDelay: '1.5s',
        }} />

        {/* Warm top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[280px]" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,77,141,0.16) 0%, rgba(255,140,80,0.06) 50%, transparent 70%)',
        }} />

        {/* Deep rose ambient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(255,30,80,0.04) 0%, rgba(180,20,60,0.08) 60%, rgba(255,100,40,0.06) 100%)',
        }} />
      </div>

      {/* ── Rain window at top ── */}
      <div className="fixed top-0 left-0 right-0 h-[28vh] pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Glass tint */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(20,5,40,0.45) 0%, rgba(20,5,40,0.15) 70%, transparent 100%)',
        }} />
        {/* Rain drops */}
        {RAIN_DROPS.map(r => (
          <motion.div
            key={r.id}
            className="absolute"
            style={{
              left: `${r.x}%`, top: 0,
              width: r.width, height: r.height,
              background: 'linear-gradient(180deg, transparent 0%, rgba(180,200,255,0.55) 40%, rgba(210,230,255,0.8) 65%, transparent 100%)',
              borderRadius: 999,
            }}
            animate={{ y: ['-20px', '28vh'] }}
            transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {/* Window sill line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,180,120,0.3) 30%, rgba(255,200,150,0.4) 50%, rgba(255,180,120,0.3) 70%, transparent)',
        }} />
        {/* "Outside" rain mist */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(60,80,140,0.12) 0%, transparent 80%)',
          backdropFilter: 'blur(0.5px)',
        }} />
      </div>

      {/* ── Floating warm particles ── */}
      {WARM_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none select-none"
          style={{
            left: `${p.x}%`, fontSize: p.size,
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

      {/* ── Content ── */}
      <div className="relative flex flex-col px-5 pt-[28vh] pb-12 max-w-lg mx-auto w-full gap-5" style={{ zIndex: 10 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-1 -mt-2">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 transition-transform cursor-pointer">
            <ArrowLeft size={16} /> Map
          </button>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-widest font-black flex items-center gap-1.5 justify-center"
              style={{ color: 'rgba(255,140,80,0.7)' }}>
              🕯️ Comfort Room
            </p>
          </div>
          <div style={{ width: 72 }} />
        </div>

        {/* Rotating comfort message */}
        <motion.div className="text-center py-2">
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

        {/* Intro card */}
        <motion.div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,140,60,0.12) 0%, rgba(255,77,141,0.09) 100%)',
            border: '1px solid rgba(255,140,60,0.22)',
            boxShadow: '0 0 50px rgba(255,140,60,0.15), 0 8px 32px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #FFB84D, #FF4D8D, #FFB84D)' }} />
          <div className="p-5 flex items-start gap-4">
            <motion.div
              className="text-3xl mt-0.5 shrink-0"
              animate={{ scale: [1, 1.08, 1], rotate: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              ☕
            </motion.div>
            <div>
              <h2 className="text-[16px] font-black text-white mb-1.5">You are safe here</h2>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,210,180,0.7)' }}>
                Imagine me wrapping a warm blanket around you. A hot drink ready. The rain outside. Just us in here, quiet and close.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cuddle heart */}
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
          transition={{ delay: 0.35 }}>
          <div className="p-6 flex flex-col items-center text-center">

            <h2 className="text-[16px] font-black text-white mb-1">Virtual Cuddle</h2>
            <p className="text-[12px] mb-6" style={{ color: 'rgba(255,200,180,0.55)' }}>
              Press and hold. Feel my heartbeat. I am holding you tight.
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
              {/* Outer pulse rings */}
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
                    {/* Particle burst */}
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
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
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
                  className="flex flex-col items-center gap-1">
                  <p className="text-[14px] font-semibold" style={{ color: 'rgba(255,180,160,0.9)' }}>
                    *holding you close…*
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
                  style={{ color: 'rgba(255,180,160,0.4)' }}>
                  Hold the heart ♥
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Breathing guide */}
        <motion.div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.09) 0%, rgba(123,92,255,0.06) 100%)',
            border: '1px solid rgba(167,139,250,0.18)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wind size={14} style={{ color: 'rgba(167,139,250,0.7)' }} />
                <span className="text-[12px] font-black uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.6)' }}>
                  Breathing Guide
                </span>
              </div>
              <button
                onClick={() => { softTap(); setBreathActive(v => !v); setBreathStep(0); }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-transform cursor-pointer"
                style={{
                  background: breathActive ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.25)',
                  color: breathActive ? 'rgba(196,181,253,0.9)' : 'rgba(255,230,242,0.45)',
                }}>
                {breathActive ? 'Stop' : 'Start'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Orb */}
              <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}
                  animate={breathActive ? { scale: breathStep_.scale, opacity: [0.4, 0.8, 0.4] } : { scale: 1 }}
                  transition={{ duration: breathStep_.duration / 1000, ease: 'easeInOut' }} />
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{ background: 'rgba(167,139,250,0.6)' }}
                  animate={breathActive ? { scale: breathStep_.scale * 0.8 } : { scale: 1 }}
                  transition={{ duration: breathStep_.duration / 1000, ease: 'easeInOut' }} />
              </div>

              {/* Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={breathStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}>
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

        {/* SOS button */}
        <motion.button
          onClick={handleSendAlert}
          disabled={alertSent}
          className="w-full py-[17px] rounded-[22px] font-black text-[15px] flex items-center justify-center gap-2 transition-transform cursor-pointer relative overflow-hidden"
          style={alertSent ? {
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: 'rgba(134,239,172,0.9)',
          } : {
            background: 'linear-gradient(135deg, rgba(255,77,141,0.14) 0%, rgba(255,100,60,0.1) 100%)',
            border: '1px solid rgba(255,77,141,0.28)',
            color: 'rgba(255,180,160,0.85)',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}>
          {alertSent ? (
            <>
              <Heart size={16} fill="currentColor" style={{ color: 'rgba(134,239,172,0.9)' }} />
              He is on his way to you  💗
            </>
          ) : (
            <>
              <Bell size={16} />
              I need a real hug — send him an alert
            </>
          )}
        </motion.button>

        {/* Footer */}
        <motion.p
          className="text-center text-[10px] italic pb-2"
          style={{ color: 'rgba(255,200,180,0.25)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}>
          🕯️ This room was built with love, just for you 🕯️
        </motion.p>
      </div>
    </motion.div>
  );
}

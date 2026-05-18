'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Lock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, softTap } from '@/lib/useHaptics';
import { playDiscovery, playBloom, playNightSwell, playGlow } from '@/lib/sounds';
import { notifyOwner } from '@/lib/notify';

/* ── Deterministic particles ── */
const pr = (s: number) => Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1;

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 100,
  size: 3 + pr(i * 3 + 1) * 7,
  delay: pr(i * 3 + 2) * 10,
  dur: 10 + pr(i * 7) * 10,
  opacity: 0.06 + pr(i * 11) * 0.14,
  color: i % 3 === 0 ? '#FF4D8D' : i % 3 === 1 ? '#A78BFA' : '#FFB84D',
  isHeart: i % 4 !== 0,
}));

const ORBIT_DOTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * 360,
  size: 3 + pr(i * 5) * 3,
  color: i % 2 === 0 ? '#FF4D8D' : '#A78BFA',
  opacity: 0.4 + pr(i * 7) * 0.5,
}));

/* ── Memory sections ── */
const MEMORIES = [
  {
    id: 'day',
    icon: '🌹',
    label: 'May 11, 2026',
    title: 'The Day We Finally Met',
    body: 'A date sealed before we even knew each other. I wrote this vault before May 11 — and now it belongs to us. The day I saw your face for the first time and felt the distance disappear.',
    accentColor: '#FF4D8D',
    glowColor: 'rgba(255,77,141,0.35)',
    delay: 0.3,
  },
  {
    id: 'feeling',
    icon: '💗',
    label: 'What I Felt',
    title: 'How My Heart Moved',
    body: 'I had imagined that moment so many times. But the reality was softer and more overwhelming than anything I had imagined. You looked at me and everything I had rehearsed disappeared.',
    accentColor: '#A78BFA',
    glowColor: 'rgba(167,139,250,0.35)',
    delay: 0.55,
  },
  {
    id: 'promise',
    icon: '✦',
    label: 'What I Promised',
    title: 'The Silent Promise',
    body: 'In that moment I made you a promise you did not hear. I promised to build something real. Something that lasts. Something you can always come back to when the world feels loud.',
    accentColor: '#FFB84D',
    glowColor: 'rgba(255,184,77,0.3)',
    delay: 0.8,
  },
];

const SECRET_TEXT = 'I fell for you long before May 11. Before I ever saw your face. Your words, your laughter, the way you think — I was already yours. That day just made it real.';

export default function MayVaultScreen() {
  const { setPhase } = useGameStore();
  const [entered, setEntered] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [secretNotified, setSecretNotified] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [secretPressing, setSecretPressing] = useState(false);
  const [secretProgress, setSecretProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEnter = useCallback(() => {
    heartbeat();
    playNightSwell();
    setTimeout(() => playGlow(), 800);
    setEntered(true);
  }, []);

  const startSecretPress = useCallback(() => {
    setSecretPressing(true);
    setSecretProgress(0);
    progressRef.current = setInterval(() => {
      setSecretProgress(p => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          return 100;
        }
        return p + 3.4;
      });
    }, 50);
    longPressRef.current = setTimeout(() => {
      setSecretRevealed(true);
      setSecretPressing(false);
      softTap(); playDiscovery();
      if (!secretNotified) {
        setSecretNotified(true);
        notifyOwner('🔐 <b>She found the secret note in the Vault</b>\n\n<i>"I fell for you long before May 11…"</i>\n\n💗 She discovered what was always true.');
      }
    }, 1500);
  }, [secretNotified]);

  const cancelSecretPress = useCallback(() => {
    setSecretPressing(false);
    setSecretProgress(0);
    if (longPressRef.current) clearTimeout(longPressRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  /* ─── Entry gate ────────────────────────────────────────────────── */
  if (!entered) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
        initial={{ opacity: 0, filter: 'blur(24px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        {/* Deep ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(80,40,200,0.22) 0%, rgba(255,77,141,0.08) 50%, transparent 70%)', filter: 'blur(100px)', animation: 'midnight-breathe 7s ease-in-out infinite' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[180px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(255,77,141,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        {/* Floating particles */}
        {PARTICLES.slice(0, 16).map(p => (
          <motion.div key={p.id}
            className="absolute pointer-events-none select-none"
            style={{ left: `${p.x}%`, fontSize: p.size, color: `rgba(255,77,141,${p.opacity})` }}
            initial={{ y: '110dvh', opacity: 0 }}
            animate={{ y: '-10dvh', opacity: [0, p.opacity, p.opacity, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          >
            {p.isHeart ? '♥' : '✦'}
          </motion.div>
        ))}

        {/* Back */}
        <div className="absolute top-10 left-5 z-20">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer">
            <ArrowLeft size={16} /> Map
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full gap-6">

          {/* Vault orb */}
          <motion.div className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 130, damping: 14, delay: 0.3 }}>

            {/* Orbit ring with dots */}
            <motion.div className="absolute inset-0"
              style={{ margin: '-32px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
              {ORBIT_DOTS.map(dot => (
                <div key={dot.id}
                  className="absolute rounded-full"
                  style={{
                    width: dot.size, height: dot.size,
                    background: dot.color,
                    opacity: dot.opacity,
                    top: '50%', left: '50%',
                    transform: `rotate(${dot.angle}deg) translateX(60px) translateY(-50%)`,
                    boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
                  }} />
              ))}
            </motion.div>

            {/* Outer pulse rings */}
            <div className="absolute inset-0 rounded-3xl border-2 animate-pulse-ring"
              style={{ margin: '-8px', borderColor: 'rgba(167,139,250,0.3)' }} />
            <div className="absolute inset-0 rounded-3xl border animate-pulse-ring"
              style={{ margin: '-4px', borderColor: 'rgba(255,77,141,0.2)', animationDelay: '0.7s' }} />

            {/* Icon box */}
            <div className="w-[120px] h-[120px] rounded-[28px] flex items-center justify-center shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #5020C0 0%, #8040D8 40%, #C9245F 100%)',
                boxShadow: '0 0 0 1px rgba(167,139,250,0.3), 0 0 60px rgba(123,92,255,0.6), 0 0 120px rgba(255,77,141,0.25), 0 20px 60px rgba(0,0,0,0.6)',
              }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                <Lock size={52} className="text-white drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Label */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] mb-2"
              style={{ color: 'rgba(167,139,250,0.65)' }}>
              Memory Vault
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-3">
              The May 11 Memory
            </h1>
            <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.55)' }}>
              This vault was sealed before we met.<br />
              It opened on{' '}
              <span className="font-bold" style={{ color: '#FF7AA2' }}>May 11, 2026</span>
              {' '}— the day we finally{' '}
              <span className="font-bold" style={{ color: '#A78BFA' }}>saw each other.</span>
            </p>
          </motion.div>

          {/* Enter button */}
          <motion.button
            onClick={handleEnter}
            className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #5020C0 0%, #8040D8 50%, #C9245F 100%)',
              boxShadow: '0 0 0 1px rgba(167,139,250,0.3), 0 8px 40px rgba(123,92,255,0.5)',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileTap={{ scale: 0.97 }}>
            <motion.div
              className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
              initial={{ x: '-150%' }}
              animate={{ x: '350%' }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }} />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={15} />
              Open the Memory
              <Heart size={14} fill="currentColor" />
            </span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  /* ─── Inside the vault ──────────────────────────────────────────── */
  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.04 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Ambient layers */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(80,40,200,0.2) 0%, rgba(255,77,141,0.06) 55%, transparent 70%)', filter: 'blur(90px)', animation: 'aurora-slow 26s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,77,141,0.1) 0%, rgba(255,140,60,0.04) 55%, transparent 70%)', filter: 'blur(70px)', animation: 'candle-flicker 4s ease-in-out infinite' }} />
      </div>

      {/* Floating ambient particles */}
      {PARTICLES.map(p => (
        <motion.div key={p.id}
          className="fixed pointer-events-none select-none"
          style={{ left: `${p.x}%`, fontSize: p.size, color: `${p.color}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`, zIndex: 0 }}
          initial={{ y: '110dvh', opacity: 0 }}
          animate={{ y: '-10dvh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}>
          {p.isHeart ? '♥' : '✦'}
        </motion.div>
      ))}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer">
          <ArrowLeft size={16} /> Map
        </button>
        <div className="flex items-center gap-2">
          <Heart size={11} fill="currentColor" style={{ color: '#A78BFA' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: 'rgba(167,139,250,0.55)' }}>
            Memory Vault
          </span>
          <Heart size={11} fill="currentColor" style={{ color: '#A78BFA' }} />
        </div>
        <div style={{ width: 72 }} />
      </div>

      {/* Vault header card */}
      <motion.div
        className="relative z-10 mx-4 mb-6"
        initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.1 }}>
        <div className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(80,40,200,0.2) 0%, rgba(201,36,95,0.12) 100%)',
            border: '1px solid rgba(167,139,250,0.25)',
            boxShadow: '0 0 60px rgba(123,92,255,0.2), 0 16px 48px rgba(0,0,0,0.5)',
          }}>
          <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #5020C0, #A78BFA, #FF4D8D)' }} />
          <div className="p-5 flex items-center gap-4">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #5020C0, #C9245F)', boxShadow: '0 0 30px rgba(123,92,255,0.5)' }}
              animate={{ scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Lock size={26} className="text-white" />
            </motion.div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: 'rgba(167,139,250,0.6)' }}>
                Sealed · May 11, 2026
              </div>
              <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,230,242,0.85)' }}>
                The day the distance disappeared. The day I saw you.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Memory section cards */}
      <div className="relative z-10 flex flex-col px-4 gap-4 pb-4">
        {MEMORIES.map((mem) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: mem.delay, ease: 'easeOut' }}>
            <div className="rounded-[22px] overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mem.accentColor}14 0%, ${mem.accentColor}08 100%)`,
                border: `1px solid ${mem.accentColor}30`,
                boxShadow: `0 0 40px ${mem.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
              }}>
              <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${mem.accentColor}, ${mem.accentColor}55)` }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3.5 + mem.delay, repeat: Infinity, ease: 'easeInOut' }}>
                    {mem.icon}
                  </motion.span>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `${mem.accentColor}99` }}>
                      {mem.label}
                    </div>
                    <div className="text-[15px] font-black" style={{ color: 'rgba(255,240,248,0.95)' }}>
                      {mem.title}
                    </div>
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.7)' }}>
                  {mem.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Secret hidden note */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}>

          <AnimatePresence mode="wait">
            {secretRevealed ? (
              /* Revealed secret */
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="rounded-[22px] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,184,77,0.14) 0%, rgba(255,77,141,0.1) 100%)',
                  border: '1px solid rgba(255,184,77,0.35)',
                  boxShadow: '0 0 50px rgba(255,184,77,0.25), 0 8px 32px rgba(0,0,0,0.4)',
                }}>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #FFB84D, #FF4D8D, #FFB84D)' }} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.span className="text-2xl"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      🔓
                    </motion.span>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: 'rgba(255,184,77,0.7)' }}>
                        Secret Revealed
                      </div>
                      <div className="text-[15px] font-black text-white">A Truth I Kept</div>
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed italic" style={{ color: 'rgba(255,230,242,0.82)' }}>
                    "{SECRET_TEXT}"
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 justify-end">
                    <Heart size={9} fill="currentColor" style={{ color: '#FFB84D' }} />
                    <span className="text-[10px] italic" style={{ color: 'rgba(255,184,77,0.45)' }}>
                      Always true, from the very beginning
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Hidden secret — long press to unlock */
              <motion.div
                key="hidden"
                className="rounded-[22px] overflow-hidden cursor-pointer relative select-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,184,77,0.25)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                onPointerDown={startSecretPress}
                onPointerUp={cancelSecretPress}
                onPointerLeave={cancelSecretPress}
                onTouchStart={startSecretPress}
                onTouchEnd={cancelSecretPress}
                whileTap={{ scale: 0.98 }}>

                {/* Progress fill */}
                {secretPressing && (
                  <motion.div
                    className="absolute inset-0 rounded-[22px]"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,184,77,${secretProgress / 100 * 0.18}), rgba(255,77,141,${secretProgress / 100 * 0.1}))`,
                    }} />
                )}

                <div className="p-5 flex items-center gap-4 relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: secretPressing
                        ? `conic-gradient(rgba(255,184,77,0.6) ${secretProgress * 3.6}deg, rgba(255,255,255,0.05) 0deg)`
                        : 'rgba(255,255,255,0.05)',
                      border: '1px dashed rgba(255,184,77,0.3)',
                    }}
                    animate={!secretPressing ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2.5, repeat: Infinity }}>
                    <Lock size={20} style={{ color: 'rgba(255,184,77,0.6)' }} />
                  </motion.div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: 'rgba(255,184,77,0.45)' }}>
                      Hidden Note
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,230,242,0.45)' }}>
                      {secretPressing ? 'Keep holding…' : 'Hold to reveal a secret'}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,184,77,0.3)' }}>
                      {secretPressing ? `${Math.round(secretProgress)}%` : 'Press & hold for 1.5s  ✦'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer seal */}
      <motion.div
        className="relative z-10 mx-4 mt-2 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}>
        <div className="rounded-[20px] p-4 flex items-center justify-center gap-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Heart size={10} fill="currentColor" style={{ color: 'rgba(255,77,141,0.35)' }} />
          <p className="text-[10px] italic" style={{ color: 'rgba(255,230,242,0.28)' }}>
            This memory lives forever in our universe
          </p>
          <Heart size={10} fill="currentColor" style={{ color: 'rgba(255,77,141,0.35)' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

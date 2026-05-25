'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Play, Pause, ChevronRight, Lock, Eye, X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat } from '@/lib/useHaptics';
import { playGlow, playNightSwell, playBloom, playDiscovery, playSparkle, playHeartbeat, playWhoosh, playReveal } from '@/lib/sounds';
import {
  HEART_QUESTIONS,
  EMOTIONAL_RESPONSES,
  HIDDEN_NOTES,
  WHISPER_CONFESSIONS,
  CATEGORY_META,
  type HeartQuestion,
} from '@/data/insideHisHeart';

/* ── Deterministic pseudo-random ── */
const pr = (s: number) => Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1;

/* ── Ambient dust particles (20) ── */
const DUST_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: pr(i * 7) * 100,
  y: pr(i * 7 + 1) * 100,
  size: 2 + pr(i * 7 + 2) * 4,
  duration: 10 + pr(i * 7 + 3) * 14,
  delay: pr(i * 7 + 4) * 10,
  dx: (pr(i * 7 + 5) - 0.5) * 80,
  dy: -(20 + pr(i * 7 + 6) * 60),
  color: i % 3 === 0 ? '#7B5CFF' : i % 3 === 1 ? '#FFB84D' : '#C084FC',
  opacity: 0.04 + pr(i * 13) * 0.08,
}));

/* ── Floating stars (15) ── */
const FLOAT_STARS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: pr(i * 11) * 100,
  y: pr(i * 11 + 1) * 100,
  size: 1.5 + pr(i * 11 + 2) * 3,
  duration: 3 + pr(i * 11 + 3) * 5,
  delay: pr(i * 11 + 4) * 6,
  opacity: 0.15 + pr(i * 11 + 5) * 0.4,
}));

/* ── Light beams (4) ── */
const LIGHT_BEAMS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  left: 10 + i * 22,
  width: 40 + pr(i * 17) * 80,
  opacity: 0.03 + pr(i * 17 + 1) * 0.04,
  delay: i * 3,
  rotation: -15 + pr(i * 17 + 2) * 30,
}));

/* ── Categories for the hub ── */
const CATEGORIES = ['intimacy', 'late-night', 'memories', 'confessions'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL TRANSITION
// ─────────────────────────────────────────────────────────────────────────────

function PortalTransition({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    playWhoosh();
    heartbeat();
    const t = setTimeout(onComplete, 1600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 100, background: '#030008' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Galaxy tunnel rings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 60,
            height: 100 + i * 60,
            border: `1px solid rgba(123,92,255,${0.4 - i * 0.05})`,
            boxShadow: `0 0 ${20 + i * 10}px rgba(123,92,255,${0.15 - i * 0.02}), inset 0 0 ${15 + i * 5}px rgba(192,132,252,${0.1 - i * 0.01})`,
          }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            rotate: [0, 180 + i * 30, 360],
            opacity: [0, 0.8, 0.3],
          }}
          transition={{
            duration: 1.4,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}

      {/* Central heart pulse */}
      <motion.div
        className="absolute w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(123,92,255,0.6) 0%, rgba(75,0,130,0.3) 60%, transparent 80%)',
          boxShadow: '0 0 80px rgba(123,92,255,0.5), 0 0 160px rgba(123,92,255,0.2)',
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.3, 0.9, 1.1, 1],
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Heart size={32} fill="white" className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }} />
      </motion.div>

      {/* Aurora distortion streaks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute"
          style={{
            width: 2,
            height: 80 + pr(i * 23) * 120,
            background: `linear-gradient(180deg, transparent, ${i % 3 === 0 ? 'rgba(123,92,255,0.4)' : i % 3 === 1 ? 'rgba(255,184,77,0.3)' : 'rgba(192,132,252,0.3)'}, transparent)`,
            transformOrigin: 'center center',
            rotate: `${(i / 12) * 360}deg`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
        />
      ))}

      {/* Floating particles shower */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2 + pr(i * 31) * 4,
            height: 2 + pr(i * 31) * 4,
            background: i % 4 === 0 ? '#FFB84D' : i % 4 === 1 ? '#7B5CFF' : i % 4 === 2 ? '#C084FC' : '#FF4D8D',
          }}
          initial={{
            x: 0, y: 0, opacity: 0, scale: 0,
          }}
          animate={{
            x: (pr(i * 31 + 1) - 0.5) * 400,
            y: (pr(i * 31 + 2) - 0.5) * 400,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1 + pr(i * 31 + 3) * 0.6,
            delay: 0.3 + pr(i * 31 + 4) * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER CONFESSION PLAYER
// ─────────────────────────────────────────────────────────────────────────────

function WhisperPlayer({ text, duration }: { text: string; duration: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const BARS = 32;

  const barHeights = useMemo(() =>
    Array.from({ length: BARS }, (_, i) => 0.2 + pr(i * 19) * 0.8),
    []
  );

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setIsPlaying(true);
    setProgress(0);
    softTap();
    playGlow();

    const step = 100 / (duration * 20); // 50ms intervals
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return p + step;
      });
    }, 50);
  }, [isPlaying, duration]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(123,92,255,0.12) 0%, rgba(75,0,130,0.08) 100%)',
        border: '1px solid rgba(123,92,255,0.2)',
        boxShadow: isPlaying
          ? '0 0 40px rgba(123,92,255,0.25), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s ease',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Play button */}
        <button
          onClick={handlePlay}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform"
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, #7B5CFF, #5B21B6)'
              : 'rgba(123,92,255,0.2)',
            border: '1px solid rgba(123,92,255,0.4)',
            boxShadow: isPlaying ? '0 0 20px rgba(123,92,255,0.5)' : 'none',
          }}
        >
          {isPlaying
            ? <Pause size={16} className="text-white" />
            : <Play size={16} className="text-white/70 ml-0.5" />}
        </button>

        {/* Waveform */}
        <div className="flex-1">
          <div className="flex items-end gap-[2px] h-8">
            {barHeights.map((h, i) => {
              const barProgress = (i / BARS) * 100;
              const isActive = barProgress <= progress;
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${h * 100}%`,
                    background: isActive
                      ? 'linear-gradient(180deg, #A78BFA, #7B5CFF)'
                      : 'rgba(123,92,255,0.15)',
                    transition: 'background 0.15s ease',
                  }}
                  animate={isPlaying ? {
                    scaleY: [0.6, 1, 0.6],
                  } : {}}
                  transition={{
                    duration: 0.4 + pr(i * 29) * 0.4,
                    delay: pr(i * 29 + 1) * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </div>
          {/* Progress bar underneath */}
          <div className="mt-1.5 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7B5CFF, #A78BFA)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      {/* Whisper text */}
      <div className="px-4 pb-3">
        <p className="text-[12px] italic leading-relaxed" style={{ color: 'rgba(196,181,253,0.6)' }}>
          &ldquo;{text}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC TEXT REVEAL
// ─────────────────────────────────────────────────────────────────────────────

function CinematicTextReveal({ text, atmosphere }: { text: string; atmosphere: string }) {
  const words = text.split(' ');
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setRevealedCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= words.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [text, words.length]);

  const colorMap: Record<string, string> = {
    midnight: 'rgba(196,181,253,0.85)',
    rain: 'rgba(180,200,220,0.85)',
    aurora: 'rgba(180,220,200,0.85)',
    starlight: 'rgba(220,200,240,0.85)',
    golden: 'rgba(255,220,180,0.85)',
  };

  return (
    <div className="leading-relaxed">
      {words.map((word, i) => (
        <motion.span
          key={`${text}-${i}`}
          className="inline-block mr-[5px] text-[15px]"
          style={{
            color: colorMap[atmosphere] || 'rgba(220,210,240,0.85)',
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={i < revealedCount ? {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          } : {}}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL RESPONSE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

function EmotionalResponseSelector({
  onSelect,
  selected,
}: {
  onSelect: (id: number) => void;
  selected: number | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: 'rgba(196,181,253,0.35)' }}>
        How does this make you feel?
      </p>
      <div className="flex flex-wrap gap-2">
        {EMOTIONAL_RESPONSES.map(r => {
          const isSelected = selected === r.id;
          return (
            <motion.button
              key={r.id}
              onClick={() => { softTap(); onSelect(r.id); }}
              className="px-3 py-2 rounded-2xl text-[11px] cursor-pointer transition-all"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(123,92,255,0.3), rgba(192,132,252,0.2))'
                  : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? '1px solid rgba(123,92,255,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: isSelected ? 'rgba(196,181,253,0.9)' : 'rgba(220,210,240,0.5)',
                boxShadow: isSelected ? '0 0 20px rgba(123,92,255,0.2)' : 'none',
              }}
            >
              <span className="mr-1">{r.emoji}</span> {r.text}
            </motion.button>
          );
        })}
      </div>

      {/* Response ripple effect */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="flex items-center justify-center mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[12px] italic" style={{ color: 'rgba(255,184,77,0.6)' }}>
              ✦ the universe grows warmer with your love ✦
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HIDDEN NOTE DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

function HiddenNoteOverlay({ note, onClose }: { note: string; onClose: () => void }) {
  useEffect(() => {
    playDiscovery();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-8"
      style={{ zIndex: 90, background: 'rgba(3,0,8,0.85)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onClose}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glowing heart */}
        <motion.div
          className="w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,77,0.4), transparent 70%)',
            boxShadow: '0 0 40px rgba(255,184,77,0.3)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              '0 0 40px rgba(255,184,77,0.3)',
              '0 0 60px rgba(255,184,77,0.5)',
              '0 0 40px rgba(255,184,77,0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={20} fill="currentColor" style={{ color: '#FFB84D' }} />
        </motion.div>

        <p className="text-[9px] uppercase tracking-[0.25em] font-bold mb-4" style={{ color: 'rgba(255,184,77,0.4)' }}>
          Hidden Note Discovered
        </p>

        <p
          className="text-[17px] italic leading-relaxed font-light"
          style={{
            color: 'rgba(255,230,200,0.9)',
            textShadow: '0 0 30px rgba(255,184,77,0.3)',
          }}
        >
          &ldquo;{note}&rdquo;
        </p>

        <motion.p
          className="text-[10px] mt-6"
          style={{ color: 'rgba(255,184,77,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          tap anywhere to close
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION EXPERIENCE VIEW (the full cinematic answer view)
// ─────────────────────────────────────────────────────────────────────────────

function QuestionExperience({
  question,
  onBack,
  onNavigate,
  hasNext,
  hasPrev,
}: {
  question: HeartQuestion;
  onBack: () => void;
  onNavigate: (dir: 'next' | 'prev') => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const [emotionalResponse, setEmotionalResponse] = useState<number | null>(null);
  const [showWhisper, setShowWhisper] = useState(false);
  const [discoveredNote, setDiscoveredNote] = useState<string | null>(null);

  // Find a random whisper for this question
  const whisper = useMemo(() => {
    return WHISPER_CONFESSIONS[question.id % WHISPER_CONFESSIONS.length];
  }, [question.id]);

  // Hidden note (some questions have one)
  const hiddenNote = useMemo(() => {
    return question.id % 3 === 0 ? HIDDEN_NOTES[question.id % HIDDEN_NOTES.length] : null;
  }, [question.id]);

  useEffect(() => {
    setEmotionalResponse(null);
    setShowWhisper(false);
    setDiscoveredNote(null);
    playReveal();
  }, [question.id]);

  // Show whisper after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowWhisper(true), 4000);
    return () => clearTimeout(t);
  }, [question.id]);

  // Atmosphere gradients
  const atmosphereGradients: Record<string, string> = {
    midnight: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(75,0,130,0.25) 0%, rgba(30,0,60,0.12) 50%, transparent 75%)',
    rain: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(60,80,140,0.2) 0%, rgba(30,40,70,0.1) 50%, transparent 75%)',
    aurora: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,180,140,0.15) 0%, rgba(0,80,100,0.08) 50%, transparent 75%)',
    starlight: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(192,132,252,0.2) 0%, rgba(100,50,180,0.1) 50%, transparent 75%)',
    golden: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,184,77,0.18) 0%, rgba(180,100,30,0.08) 50%, transparent 75%)',
  };

  const categoryMeta = CATEGORY_META[question.category];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Atmosphere layer */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: atmosphereGradients[question.atmosphere] || atmosphereGradients.midnight }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(123,92,255,0.06) 0%, transparent 60%)' }} />

        {/* Cinematic fog layers */}
        <div className="absolute inset-0 animate-heart-fog" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(123,92,255,0.04) 30%, rgba(192,132,252,0.03) 50%, rgba(123,92,255,0.04) 70%, transparent 100%)' }} />
        <div className="absolute inset-0 animate-heart-fog" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,184,77,0.02) 40%, rgba(255,184,77,0.03) 60%, transparent 100%)', animationDelay: '7s' }} />

        {/* Light beams */}
        {LIGHT_BEAMS.map(b => (
          <div
            key={b.id}
            className="absolute animate-heart-beam"
            style={{
              left: `${b.left}%`,
              top: 0,
              width: b.width,
              height: '100%',
              background: `linear-gradient(180deg, rgba(123,92,255,${b.opacity}) 0%, transparent 70%)`,
              transform: `rotate(${b.rotation}deg)`,
              transformOrigin: 'top center',
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating dust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {DUST_PARTICLES.slice(0, 12).map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--dur': `${p.duration}s`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties}
            animate={{
              x: [0, p.dx, 0],
              y: [0, p.dy, 0],
              opacity: [0, p.opacity * 2, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hidden note trigger (discoverable star) */}
      {hiddenNote && !discoveredNote && (
        <motion.button
          className="fixed cursor-pointer"
          style={{
            zIndex: 5,
            right: 20 + pr(question.id * 37) * 40,
            top: 120 + pr(question.id * 37 + 1) * 200,
          }}
          onClick={() => {
            softTap();
            setDiscoveredNote(hiddenNote.text);
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-3 h-3 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255,184,77,0.8), transparent)',
            boxShadow: '0 0 15px rgba(255,184,77,0.4)',
          }} />
        </motion.button>
      )}

      {/* Content */}
      <div className="relative flex flex-col px-5 pt-10 pb-10 max-w-lg mx-auto w-full gap-6" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { softTap(); onBack(); }}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
            style={{ color: 'rgba(196,181,253,0.55)' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryMeta.icon}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: `${categoryMeta.accentColor}88` }}>
              {categoryMeta.title}
            </span>
          </div>
          <div className="w-14" />
        </div>

        {/* The question */}
        <motion.div
          className="text-center pt-4 pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'rgba(196,181,253,0.3)' }}>
            She asked him…
          </p>
          <h2 className="text-[18px] font-black text-white leading-snug px-2" style={{ textShadow: '0 0 40px rgba(123,92,255,0.3)' }}>
            &ldquo;{question.question}&rdquo;
          </h2>
        </motion.div>

        {/* Floating timestamp */}
        {question.timestamp && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-[10px] font-light italic" style={{ color: 'rgba(196,181,253,0.25)' }}>
              {question.timestamp}
            </span>
          </motion.div>
        )}

        {/* His answer — cinematic reveal */}
        <motion.div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(123,92,255,0.08) 0%, rgba(75,0,130,0.05) 100%)',
            border: '1px solid rgba(123,92,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(123,92,255,0.08)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${categoryMeta.accentColor}, transparent)` }} />
          <div className="p-6">
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'rgba(196,181,253,0.25)' }}>
              His heart speaks…
            </p>
            <CinematicTextReveal text={question.answer} atmosphere={question.atmosphere} />
          </div>
        </motion.div>

        {/* Whisper confession */}
        <AnimatePresence>
          {showWhisper && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: 'rgba(123,92,255,0.3)' }}>
                Whisper Confession
              </p>
              <WhisperPlayer text={whisper.text} duration={whisper.duration} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emotional response selector */}
        <EmotionalResponseSelector onSelect={setEmotionalResponse} selected={emotionalResponse} />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => { softTap(); hasPrev && onNavigate('prev'); }}
            className={`glass px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-all ${!hasPrev ? 'opacity-30 pointer-events-none' : ''}`}
            style={{ color: 'rgba(196,181,253,0.55)' }}
          >
            ← Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgba(123,92,255,0.4)' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>
          <button
            onClick={() => { softTap(); hasNext && onNavigate('next'); }}
            className={`glass px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-all ${!hasNext ? 'opacity-30 pointer-events-none' : ''}`}
            style={{ color: 'rgba(196,181,253,0.55)' }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Hidden note overlay */}
      <AnimatePresence>
        {discoveredNote && (
          <HiddenNoteOverlay note={discoveredNote} onClose={() => setDiscoveredNote(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY PORTAL VIEW
// ─────────────────────────────────────────────────────────────────────────────

function CategoryPortal({
  category,
  questions,
  onSelectQuestion,
  onBack,
}: {
  category: string;
  questions: HeartQuestion[];
  onSelectQuestion: (q: HeartQuestion) => void;
  onBack: () => void;
}) {
  const meta = CATEGORY_META[category];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55 }}
    >
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${meta.glowColor.replace('0.5', '0.15')} 0%, transparent 65%)`,
        }} />
      </div>

      <div className="relative z-10 flex flex-col px-5 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { softTap(); onBack(); }}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
            style={{ color: 'rgba(196,181,253,0.55)' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: `${meta.accentColor}88` }}>
              {meta.title}
            </span>
          </div>
          <div className="w-14" />
        </div>

        {/* Category Hero */}
        <motion.div
          className="text-center pt-2 pb-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: `radial-gradient(circle, ${meta.accentColor}30, transparent 70%)`,
              boxShadow: `0 0 50px ${meta.glowColor.replace('0.5', '0.3')}`,
            }}
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                `0 0 40px ${meta.glowColor.replace('0.5', '0.2')}`,
                `0 0 70px ${meta.glowColor.replace('0.5', '0.4')}`,
                `0 0 40px ${meta.glowColor.replace('0.5', '0.2')}`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {meta.icon}
          </motion.div>
          <h1 className="text-xl font-black text-white mb-1">{meta.title}</h1>
          <p className="text-[12px]" style={{ color: 'rgba(196,181,253,0.45)' }}>{meta.subtitle}</p>
        </motion.div>

        {/* Questions list */}
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => (
            <motion.button
              key={q.id}
              onClick={() => { softTap(); playSparkle(); onSelectQuestion(q); }}
              className="relative w-full rounded-[20px] overflow-hidden text-left transition-transform cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(123,92,255,0.06) 0%, rgba(75,0,130,0.04) 100%)',
                border: '1px solid rgba(123,92,255,0.12)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${meta.accentColor}40, transparent)` }} />
              <div className="flex items-center gap-3 p-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${meta.accentColor}15`,
                    border: `1px solid ${meta.accentColor}25`,
                  }}
                >
                  <span className="text-[13px] font-black" style={{ color: `${meta.accentColor}aa` }}>
                    {i + 1}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-white/85 flex-1 leading-snug">
                  {q.question}
                </p>
                <ChevronRight size={14} style={{ color: `${meta.accentColor}55` }} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HUB — Inside His Heart Landing
// ─────────────────────────────────────────────────────────────────────────────

export default function InsideHisHeartScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const logActivity = useGameStore(s => s.logActivity);
  const [view, setView] = useState<'hub' | 'portal-transition' | 'category' | 'experience'>('hub');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<HeartQuestion | null>(null);
  const [discoveredNotes, setDiscoveredNotes] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { return new Set(JSON.parse(localStorage.getItem('heart-discovered-notes') ?? '[]')); } catch { return new Set(); }
  });
  const [hubHiddenNote, setHubHiddenNote] = useState<string | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount
  useEffect(() => {
    playGlow();
    setTimeout(() => playNightSwell(), 500);
    logActivity('mini-game', 'Entered Inside His Heart');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Group questions by category
  const questionsByCategory = useMemo(() => {
    const map: Record<string, HeartQuestion[]> = {};
    for (const q of HEART_QUESTIONS) {
      if (!map[q.category]) map[q.category] = [];
      map[q.category].push(q);
    }
    return map;
  }, []);

  // Get current category questions
  const categoryQuestions = activeCategory ? (questionsByCategory[activeCategory] || []) : [];

  // Navigation in experience view
  const handleNavigate = useCallback((dir: 'next' | 'prev') => {
    if (!activeQuestion || !activeCategory) return;
    const questions = questionsByCategory[activeCategory] || [];
    const idx = questions.findIndex(q => q.id === activeQuestion.id);
    if (dir === 'next' && idx < questions.length - 1) {
      setActiveQuestion(questions[idx + 1]);
      playBloom();
    } else if (dir === 'prev' && idx > 0) {
      setActiveQuestion(questions[idx - 1]);
      playBloom();
    }
  }, [activeQuestion, activeCategory, questionsByCategory]);

  // Open category with portal transition
  const openCategory = useCallback((cat: string) => {
    softTap();
    playBloom();
    heartbeat();
    setActiveCategory(cat);
    setView('portal-transition');
  }, []);

  // Select question
  const selectQuestion = useCallback((q: HeartQuestion) => {
    setActiveQuestion(q);
    setView('portal-transition');
  }, []);

  // After portal
  const handlePortalComplete = useCallback(() => {
    if (activeQuestion) {
      setView('experience');
    } else {
      setView('category');
    }
  }, [activeQuestion]);

  // Long press on aurora → hidden note
  const handleAuroraPressStart = useCallback(() => {
    longPressRef.current = setTimeout(() => {
      const randomNote = HIDDEN_NOTES[Math.floor(Math.random() * HIDDEN_NOTES.length)];
      setHubHiddenNote(randomNote.text);
    }, 1200);
  }, []);
  const handleAuroraPressEnd = useCallback(() => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  }, []);

  // ── Portal Transition ──
  if (view === 'portal-transition') {
    return <PortalTransition onComplete={handlePortalComplete} />;
  }

  // ── Question Experience ──
  if (view === 'experience' && activeQuestion && activeCategory) {
    const questions = questionsByCategory[activeCategory] || [];
    const idx = questions.findIndex(q => q.id === activeQuestion.id);
    return (
      <QuestionExperience
        question={activeQuestion}
        onBack={() => {
          setActiveQuestion(null);
          setView('category');
          softTap();
        }}
        onNavigate={handleNavigate}
        hasNext={idx < questions.length - 1}
        hasPrev={idx > 0}
      />
    );
  }

  // ── Category Portal ──
  if (view === 'category' && activeCategory) {
    return (
      <CategoryPortal
        category={activeCategory}
        questions={categoryQuestions}
        onSelectQuestion={selectQuestion}
        onBack={() => {
          setActiveCategory(null);
          setActiveQuestion(null);
          setView('hub');
          softTap();
        }}
      />
    );
  }

  // ── Hub Landing ──
  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      data-scroll
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55 }}
    >
      {/* ════ ATMOSPHERE LAYERS ════ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Deep indigo base */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(10,0,25,0.95) 0%, rgba(20,5,45,0.9) 40%, rgba(15,3,30,0.95) 100%)',
        }} />

        {/* Aurora glow top */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 50% at 50% -5%, rgba(123,92,255,0.18) 0%, rgba(75,0,130,0.08) 40%, transparent 65%)',
          filter: 'blur(40px)',
        }} />

        {/* Golden warmth bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh]" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,184,77,0.06) 0%, transparent 65%)',
        }} />

        {/* Crimson accent */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 40% 30% at 80% 60%, rgba(180,40,80,0.06) 0%, transparent 50%)',
        }} />

        {/* Slow aurora movement */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(123,92,255,0.1) 0%, transparent 50%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {FLOAT_STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: 'white',
              opacity: s.opacity,
            }}
            animate={{
              opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Dust particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {DUST_PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
            }}
            animate={{
              x: [0, p.dx * 0.5, 0],
              y: [0, p.dy * 0.5, 0],
              opacity: [0, p.opacity * 2, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ════ CONTENT ════ */}
      <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { softTap(); setPhase('home'); }}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
            style={{ color: 'rgba(196,181,253,0.55)' }}
          >
            <ArrowLeft size={15} /> Universe
          </button>
          <div className="flex items-center gap-2">
            <Heart size={13} fill="currentColor" style={{ color: '#7B5CFF' }} className="animate-heartbeat" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(196,181,253,0.45)' }}>
              Inside His Heart
            </span>
          </div>
          <div className="w-16" />
        </div>

        {/* Hero — Breathing heart orb with aurora */}
        <motion.div
          className="text-center pt-4 pb-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Aurora orb — long press to discover hidden note */}
          <div
            className="flex justify-center mb-6"
            onPointerDown={handleAuroraPressStart}
            onPointerUp={handleAuroraPressEnd}
            onPointerLeave={handleAuroraPressEnd}
            onTouchStart={handleAuroraPressStart}
            onTouchEnd={handleAuroraPressEnd}
          >
            <motion.div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(123,92,255,0.4) 0%, rgba(75,0,130,0.2) 50%, transparent 75%)',
                boxShadow: '0 0 80px rgba(123,92,255,0.3), 0 0 160px rgba(123,92,255,0.1)',
              }}
              animate={{
                scale: [1, 1.06, 1],
                boxShadow: [
                  '0 0 60px rgba(123,92,255,0.25), 0 0 120px rgba(123,92,255,0.08)',
                  '0 0 100px rgba(123,92,255,0.45), 0 0 200px rgba(123,92,255,0.15)',
                  '0 0 60px rgba(123,92,255,0.25), 0 0 120px rgba(123,92,255,0.08)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={36} fill="white" className="text-white" style={{ filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.7))' }} />

              {/* Outer pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(123,92,255,0.3)' }}
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(192,132,252,0.2)' }}
                animate={{ scale: [1, 1.8, 2.2], opacity: [0.3, 0.1, 0] }}
                transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
              />

              {/* Orbiting particles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#FFB84D' : '#C084FC',
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 6) * Math.PI * 2) * 50,
                    y: Math.sin((i / 6) * Math.PI * 2) * 50,
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          <h1 className="text-[22px] font-black text-white mb-2" style={{ textShadow: '0 0 40px rgba(123,92,255,0.4)' }}>
            Inside His Heart
          </h1>
          <p className="text-[13px] leading-relaxed mx-4" style={{ color: 'rgba(196,181,253,0.5)' }}>
            She asked him questions. His answers became emotional universes. Every word is a memory. Every silence is a feeling.
          </p>
          <p className="text-[11px] mt-2 italic" style={{ color: 'rgba(255,184,77,0.35)' }}>
            ✦ long-press the heart to discover hidden notes ✦
          </p>
        </motion.div>

        {/* Category Portals */}
        <div className="flex flex-col gap-3">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold px-1" style={{ color: 'rgba(196,181,253,0.25)' }}>
            Choose a portal to enter
          </p>

          {CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const count = (questionsByCategory[cat] || []).length;

            return (
              <motion.button
                key={cat}
                onClick={() => openCategory(cat)}
                className="relative w-full rounded-[22px] overflow-hidden text-left transition-transform cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${meta.accentColor}12 0%, ${meta.accentColor}06 100%)`,
                  border: `1px solid ${meta.accentColor}20`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.35), 0 0 30px ${meta.glowColor.replace('0.5', '0.06')}`,
                }}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Top accent */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${meta.accentColor}60, transparent)` }} />

                <div className="flex items-center gap-4 p-5">
                  {/* Icon orb */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `radial-gradient(circle, ${meta.accentColor}25, transparent 70%)`,
                      border: `1px solid ${meta.accentColor}30`,
                      boxShadow: `0 0 25px ${meta.glowColor.replace('0.5', '0.15')}`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${meta.glowColor.replace('0.5', '0.1')}`,
                        `0 0 35px ${meta.glowColor.replace('0.5', '0.25')}`,
                        `0 0 20px ${meta.glowColor.replace('0.5', '0.1')}`,
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  >
                    {meta.icon}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-black text-white mb-0.5">{meta.title}</h3>
                    <p className="text-[11px]" style={{ color: `${meta.accentColor}70` }}>{meta.subtitle}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'rgba(196,181,253,0.3)' }}>
                      {count} emotional portals
                    </p>
                  </div>

                  {/* Enter arrow */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `${meta.accentColor}12`, border: `1px solid ${meta.accentColor}20` }}
                  >
                    <ChevronRight size={14} style={{ color: `${meta.accentColor}88` }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Safe place energy footer */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(123,92,255,0.2))' }} />
            <Lock size={9} style={{ color: 'rgba(123,92,255,0.25)' }} />
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(123,92,255,0.25)' }}>
              private emotional space
            </span>
            <Lock size={9} style={{ color: 'rgba(123,92,255,0.25)' }} />
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(123,92,255,0.2), transparent)' }} />
          </div>
          <p className="text-[10px] italic" style={{ color: 'rgba(196,181,253,0.2)' }}>
            &ldquo;These are the feelings he could never fully explain with words ❤️&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Hidden note overlay (from hub long-press) */}
      <AnimatePresence>
        {hubHiddenNote && (
          <HiddenNoteOverlay note={hubHiddenNote} onClose={() => setHubHiddenNote(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

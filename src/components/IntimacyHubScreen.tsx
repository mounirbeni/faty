'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Lock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap } from '@/lib/useHaptics';
import { playBloom, playSparkle, playGlow } from '@/lib/sounds';
import IntimacyQuestionFlow from './IntimacyQuestionFlow';
import MemoryReconstructionGame from './MemoryReconstructionGame';
import { notifyOwner } from '@/lib/notify';

// ─── Game definitions ─────────────────────────────────────────────────────────

type SubGame = 'first-kiss' | 'touch-presence' | 'inner-thoughts' | 'memory-reconstruction';

const FIRST_KISS_QUESTIONS = [
  'When you imagine our first kiss — what does it feel like before it even happens?',
  'Where do you picture it? What are we doing? What does that moment feel like?',
  'Do you feel nervous thinking about it, or does it feel like something inevitable?',
  'What emotion do you think will hit you first — relief, warmth, something else entirely?',
  'Is there a specific way you have imagined it happening that you have never said out loud?',
  'What do you think your heart will feel in the seconds just before it happens?',
  'Do you think it will be exactly what you imagined, or do you think it will surprise you?',
  'What would you want to tell me about that kiss — before it even happens — right now?',
] as const;

const TOUCH_QUESTIONS = [
  'What part of being held by me do you think about most when you are alone at night?',
  'What would it feel like to have someone reach out and take your hand — and that someone being me?',
  'What kind of hug from me do you think you need the most right now?',
  'What physical closeness do you miss most — or imagine wanting — that a screen cannot give you?',
  'Is there a moment of us you already replay in your mind even though it has not happened yet?',
  'What do you think it will feel like the moment you realize you can actually reach out and touch me?',
  'What kind of touch from me do you imagine would calm you instantly when you are feeling a lot?',
  'Describe what you imagine our first real hug will feel like — every single detail.',
] as const;

const INNER_THOUGHTS_QUESTIONS = [
  'What was the very first thing about me that made you feel something — not just see, but actually feel?',
  'Have you ever secretly imagined what it would be like to just be in the same room as me?',
  'Is there a moment on a call when I said or did something that made your heart emotionally melt?',
  'What thought about us do you return to most often when you are alone and it is late?',
  'When do you feel the most emotionally close to me — even through the distance?',
  'Is there something you have been wanting to tell me but have not found the right words for through a screen?',
  'What do you love most about the specific way we love each other from this far apart?',
  'If you could whisper one thing to me right now from wherever you are — what would it be?',
] as const;

interface GameDef {
  id: SubGame;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  glowColor: string;
  gradient: string;
  cardBorder: string;
}

const GAMES: GameDef[] = [
  {
    id: 'first-kiss',
    icon: '💋',
    title: 'First Kiss Memory',
    subtitle: 'Relive what your heart felt',
    description: 'Eight intimate questions about the moment our first kiss happened.',
    accentColor: '#FF4D8D',
    glowColor: '#FF4D8D',
    gradient: 'linear-gradient(135deg, rgba(255,77,141,0.18), rgba(201,36,95,0.1))',
    cardBorder: 'rgba(255,77,141,0.25)',
  },
  {
    id: 'touch-presence',
    icon: '🫂',
    title: 'Touch & Presence',
    subtitle: 'How closeness feels to you',
    description: 'Questions about physical affection, warmth, and feeling safe together.',
    accentColor: '#A78BFA',
    glowColor: '#A78BFA',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.16), rgba(124,58,237,0.1))',
    cardBorder: 'rgba(167,139,250,0.25)',
  },
  {
    id: 'inner-thoughts',
    icon: '💭',
    title: 'Inner Thoughts',
    subtitle: 'Thoughts you have kept inside',
    description: 'The quiet things you think about me that you have never said.',
    accentColor: '#FFB84D',
    glowColor: '#FFB84D',
    gradient: 'linear-gradient(135deg, rgba(255,184,77,0.15), rgba(217,119,6,0.1))',
    cardBorder: 'rgba(255,184,77,0.25)',
  },
  {
    id: 'memory-reconstruction',
    icon: '🌌',
    title: 'Memory Stories',
    subtitle: 'Tell me what you felt',
    description: 'Close your eyes and walk me through five of our most intimate moments.',
    accentColor: '#A78BFA',
    glowColor: '#7C3AED',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(91,33,182,0.12))',
    cardBorder: 'rgba(124,58,237,0.3)',
  },
];

// Deterministic floating particles
function pr(s: number) { return Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1; }
const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: pr(i * 3) * 100,
  y: pr(i * 3 + 1) * 100,
  size: 2 + pr(i * 3 + 2) * 5,
  dur: 7 + pr(i * 7) * 9,
  delay: pr(i * 11) * 7,
  color: i % 3 === 0 ? '#FF4D8D' : i % 3 === 1 ? '#A78BFA' : '#FFB84D',
  opacity: 0.06 + pr(i * 13) * 0.1,
}));

// ─── Chemistry Meter ──────────────────────────────────────────────────────────

function ChemistryMeter({ completed }: { completed: Set<SubGame> }) {
  const pct = completed.size / GAMES.length;
  const R = 28;
  const C = 2 * Math.PI * R;
  const label = pct === 0 ? 'Begin your journey' : pct < 0.5 ? 'Growing closer' : pct < 1 ? 'Deeply connected' : 'Fully open 💗';

  return (
    <motion.div
      className="glass-cinema rounded-[22px] p-5 flex items-center gap-4"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      {/* Ring */}
      <div className="relative shrink-0">
        <svg width={68} height={68} className="-rotate-90" viewBox="0 0 68 68">
          <circle cx={34} cy={34} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
          <motion.circle cx={34} cy={34} r={R} fill="none"
            stroke="url(#chemGrad)" strokeWidth={4} strokeLinecap="round"
            strokeDasharray={`${pct * C} ${C}`}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${pct * C} ${C}` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }} />
          <defs>
            <linearGradient id="chemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4D8D" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {pct === 1
            ? <Heart size={22} fill="currentColor" style={{ color: '#FF4D8D' }} className="animate-heartbeat" />
            : <span className="text-[13px] font-black text-white">{Math.round(pct * 100)}%</span>
          }
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,179,199,0.45)' }}>
          Chemistry &amp; Connection
        </p>
        <p className="text-[14px] font-black text-white">{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,230,242,0.4)' }}>
          {completed.size} of {GAMES.length} intimacy games explored
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntimacyHubScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [activeGame, setActiveGame] = useState<SubGame | null>(null);
  const notifiedRef = useRef(false);
  const [completed, setCompleted] = useState<Set<SubGame>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem('intimacy-completed') ?? '[]') as SubGame[]);
    } catch { return new Set(); }
  });

  useEffect(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    notifyOwner(`🔥 <b>She opened Emotional Intimacy</b>\n\n<i>She is exploring your intimate games…</i>`);
  }, []);

  const markComplete = (id: SubGame) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem('intimacy-completed', JSON.stringify([...next])); } catch { /* */ }
      return next;
    });
  };

  const openGame = (id: SubGame) => {
    softTap(); playSparkle(); playGlow();
    setActiveGame(id);
  };

  // ── Sub-game router ─────────────────────────────────────────────────────────
  if (activeGame === 'first-kiss') {
    return (
      <IntimacyQuestionFlow
        icon="💋" title="First Kiss Memory" subtitle="Relive what your heart felt"
        accentColor="#FF4D8D" glowColor="#FF4D8D"
        questions={FIRST_KISS_QUESTIONS}
        telegramTitle="She answered the First Kiss Memory questions"
        onBack={() => setActiveGame(null)}
        onComplete={() => { markComplete('first-kiss'); setActiveGame(null); }}
      />
    );
  }
  if (activeGame === 'touch-presence') {
    return (
      <IntimacyQuestionFlow
        icon="🫂" title="Touch & Presence" subtitle="How closeness feels to you"
        accentColor="#A78BFA" glowColor="#A78BFA"
        questions={TOUCH_QUESTIONS}
        telegramTitle="She answered the Touch & Presence questions"
        onBack={() => setActiveGame(null)}
        onComplete={() => { markComplete('touch-presence'); setActiveGame(null); }}
      />
    );
  }
  if (activeGame === 'inner-thoughts') {
    return (
      <IntimacyQuestionFlow
        icon="💭" title="Inner Thoughts" subtitle="Thoughts you have kept inside"
        accentColor="#FFB84D" glowColor="#FFB84D"
        questions={INNER_THOUGHTS_QUESTIONS}
        telegramTitle="She shared her Inner Thoughts"
        onBack={() => setActiveGame(null)}
        onComplete={() => { markComplete('inner-thoughts'); setActiveGame(null); }}
      />
    );
  }
  if (activeGame === 'memory-reconstruction') {
    return (
      <MemoryReconstructionGame
        onBack={() => setActiveGame(null)}
        onComplete={() => { markComplete('memory-reconstruction'); setActiveGame(null); }}
      />
    );
  }

  // ── Hub landing ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55 }}>

      {/* Deep aurora atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(255,77,141,0.13) 0%, rgba(167,139,250,0.09) 45%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 70%, rgba(124,58,237,0.09) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        {/* Warm candle glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[250px]"
          style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,184,77,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, opacity: p.opacity }}
            animate={{ y: [0, -18, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-transform cursor-pointer"
            style={{ color: 'rgba(255,230,242,0.55)' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Heart size={13} fill="currentColor" style={{ color: '#FF4D8D' }} className="animate-heartbeat" />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.45)' }}>
              Emotional Intimacy
            </span>
          </div>
          <div className="w-16" />
        </div>

        {/* Hero */}
        <motion.div className="text-center pt-2 pb-1"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Breathing heart orb */}
          <div className="flex justify-center mb-5">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #FF4D8D, #C9245F)', boxShadow: '0 0 60px rgba(255,77,141,0.5)' }}
              animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 50px rgba(255,77,141,0.4)', '0 0 80px rgba(255,77,141,0.65)', '0 0 50px rgba(255,77,141,0.4)'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              <Heart size={28} fill="white" className="text-white" />
              {/* Outer pulse ring */}
              <motion.div className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: 'rgba(255,77,141,0.4)' }}
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
            </motion.div>
          </div>

          <h1 className="text-xl font-black text-white mb-2">A private space for us</h1>
          <p className="text-[13px] leading-relaxed mx-4" style={{ color: 'rgba(255,230,242,0.5)' }}>
            This is where we open up. Where you share what lives inside your heart, safely and softly.
          </p>
        </motion.div>

        {/* Game cards */}
        <div className="flex flex-col gap-3">
          {GAMES.map((game, i) => {
            const isDone = completed.has(game.id);
            return (
              <motion.button
                key={game.id}
                onClick={() => openGame(game.id)}
                className="relative w-full rounded-[22px] overflow-hidden text-left transition-transform cursor-pointer"
                style={{
                  background: game.gradient,
                  border: `1px solid ${isDone ? game.accentColor + '44' : game.cardBorder}`,
                  boxShadow: isDone ? `0 4px 24px ${game.glowColor}22` : '0 4px 20px rgba(0,0,0,0.3)',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.08, duration: 0.45 }}>

                {/* Top accent line */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${game.accentColor}, ${game.accentColor}22)` }} />

                <div className="flex items-start gap-4 p-5">
                  <div className="text-3xl shrink-0 mt-0.5">{game.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[15px] font-black text-white">{game.title}</h3>
                      {isDone && (
                        <motion.div
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: game.accentColor }}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}>
                          <Heart size={10} fill="white" className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: `${game.accentColor}88` }}>
                      {game.subtitle}
                    </p>
                    <p className="text-[12px] leading-snug" style={{ color: 'rgba(255,230,242,0.55)' }}>
                      {game.description}
                    </p>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isDone
                      ? <Heart size={16} fill="currentColor" style={{ color: game.accentColor }} />
                      : <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${game.accentColor}18` }}>
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path d="M1.5 1L6.5 6L1.5 11" stroke={game.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                    }
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Chemistry meter */}
        <ChemistryMeter completed={completed} />

        {/* Safe space footer */}
        <motion.div className="text-center py-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Lock size={9} style={{ color: 'rgba(255,179,199,0.3)' }} />
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,179,199,0.3)' }}>
              Private &amp; emotionally safe
            </span>
            <Lock size={9} style={{ color: 'rgba(255,179,199,0.3)' }} />
          </div>
          <p className="text-[10px] italic" style={{ color: 'rgba(255,230,242,0.22)' }}>
            Everything you share here goes straight to his heart
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

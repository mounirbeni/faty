'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Flame, BookOpen, Star, Map, ChevronRight,
  Play, RotateCcw, CheckCircle2, Lock, Check,
} from 'lucide-react';
import { useGameStore, getChapterProgress, isChapterUnlocked } from '@/store/gameStore';
import { categoriesMeta } from '@/data/meta';
import { softTap, heartbeat } from '@/lib/useHaptics';
import IconFromName from './IconFromName';
import MoodTracker from './MoodTracker';
import EmotionalStatus from './EmotionalStatus';
import LongPressNote from './LongPressNote';
import { useTimeContext } from '@/lib/timeSystem';
import { playSparkle, playBloom } from '@/lib/sounds';

type GameId = 'open-book' | 'rate-us' | 'finish-my-thought' | 'daily-three' | 'fantasy-builder' | 'bold-confessions';

const GAMES: {
  id: GameId;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  what: string;
  gradient: string;
  glow: string;
}[] = [
  {
    id: 'open-book',
    icon: <BookOpen size={26} className="text-white drop-shadow-md" />,
    label: 'Open Book',
    sublabel: 'Pick an option or write it',
    what: 'I get your answer to every question',
    gradient: 'from-rose-700 via-pink-700 to-rose-900',
    glow: 'shadow-rose-600/40',
  },
  {
    id: 'rate-us',
    icon: <Star size={26} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Rate Us',
    sublabel: 'Slide to show how we feel',
    what: 'I get a full report with your numbers',
    gradient: 'from-violet-700 via-purple-700 to-violet-900',
    glow: 'shadow-violet-600/40',
  },
  {
    id: 'finish-my-thought',
    icon: <Sparkles size={26} className="text-white drop-shadow-md" />,
    label: 'Finish My Thought',
    sublabel: 'Complete these 5 sentences',
    what: 'I get every word you write',
    gradient: 'from-sky-700 via-blue-700 to-sky-900',
    glow: 'shadow-sky-600/40',
  },
  {
    id: 'daily-three',
    icon: (
      <div className="relative">
        <Heart size={26} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(251,191,36,0.8)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Daily Three',
    sublabel: '3 new questions every day',
    what: 'I get all 3 answers daily',
    gradient: 'from-amber-600 via-orange-600 to-amber-800',
    glow: 'shadow-amber-500/40',
  },
  {
    id: 'fantasy-builder',
    icon: (
      <div className="relative">
        <Flame size={26} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(255,77,141,0.8)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Fantasy Builder',
    sublabel: 'Build our perfect night',
    what: 'I get the full story you build',
    gradient: 'from-rose-800 via-red-800 to-rose-950',
    glow: 'shadow-rose-700/45',
  },
  {
    id: 'bold-confessions',
    icon: (
      <div className="relative">
        <Flame size={26} className="text-white drop-shadow-md" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(220,38,38,0.9)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Bold Confessions',
    sublabel: 'Draw a card — say it honestly',
    what: 'I get every confession you send',
    gradient: 'from-red-800 via-rose-900 to-red-950',
    glow: 'shadow-red-700/45',
  },
];

const CHAPTER_ICONS = ['sparkles', 'eye', 'waves', 'message-square', 'wand', 'smile', 'camera'];

const PRESENCE_MSGS = [
  { text: 'thinking about you softly…',      emoji: '💭' },
  { text: 'missing you from here',            emoji: '💗' },
  { text: 'replaying our moments tonight',    emoji: '✨' },
  { text: 'listening to the quiet with you',  emoji: '🌙' },
  { text: 'feeling you close, even from far', emoji: '❤️' },
  { text: 'safe and loved inside this world', emoji: '🌌' },
];

export default function HomeMapScreen() {
  const answers  = useGameStore(s => s.answers);
  const reversed = useGameStore(s => s.reversed);
  const isReturningUser = useGameStore(s => s.isReturningUser);
  const setPhase = useGameStore(s => s.setPhase);
  const startChapter = useGameStore(s => s.startChapter);
  const time = useTimeContext();

  const totalAnswered = Object.values(answers).filter(v => v?.trim()).length + reversed.length;
  const overallPercent = Math.round((totalAnswered / 70) * 100);

  const [presenceIdx, setPresenceIdx] = useState(0);
  const [presenceVisible, setPresenceVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setPresenceVisible(false);
      setTimeout(() => { setPresenceIdx(i => (i + 1) % PRESENCE_MSGS.length); setPresenceVisible(true); }, 600);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const progressTapRef = useRef(0);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleProgressTap = () => {
    progressTapRef.current += 1;
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    progressTimerRef.current = setTimeout(() => { progressTapRef.current = 0; }, 700);
    if (progressTapRef.current >= 3) {
      progressTapRef.current = 0;
      setPhase('admin-dashboard');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[560px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,77,141,0.18) 0%, rgba(123,92,255,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 flex flex-col px-4 max-w-lg mx-auto w-full gap-5"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>

        <MoodTracker />

        {/* Presence line */}
        <div className="flex items-center justify-center gap-2 py-0.5">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,141,0.2))' }} />
          <AnimatePresence mode="wait">
            {presenceVisible && (
              <motion.div key={presenceIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.55 }}
                className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px]">{PRESENCE_MSGS[presenceIdx].emoji}</span>
                <span className="text-[11px] italic" style={{ color: 'rgba(255,179,199,0.55)' }}>
                  {PRESENCE_MSGS[presenceIdx].text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,77,141,0.2), transparent)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF4D8D, #C9245F)', boxShadow: '0 4px 16px rgba(255,77,141,0.45)' }}>
              <Map size={15} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(255,235,240,0.55)' }}>
              Our Map
            </span>
          </div>
          <button onClick={handleProgressTap} className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="url(#pg)" strokeWidth="3.5"
                  strokeLinecap="round" strokeDasharray={`${overallPercent} 100`} pathLength="100" />
                <defs>
                  <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4D8D" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                {overallPercent}%
              </span>
            </div>
          </button>
        </div>

        {/* Greeting card */}
        <motion.div className="rounded-[22px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,141,0.1) 0%, rgba(123,92,255,0.07) 100%)',
            backdropFilter: 'blur(44px) saturate(165%)',
            WebkitBackdropFilter: 'blur(44px) saturate(165%)',
            border: '1px solid rgba(255,77,141,0.22)',
            boxShadow: '0 8px 44px rgba(255,77,141,0.15), inset 0 1px 0 rgba(255,180,210,0.12)',
          }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="h-[2.5px] w-full" style={{ background: 'linear-gradient(90deg, #FFB84D, #FF4D8D, #A78BFA, #FF4D8D, #FFB84D)', backgroundSize: '200% 100%', animation: 'gradient-x 5s linear infinite' }} />
          <div className="flex items-center gap-3.5 p-4">
            <LongPressNote note="I love you more than any word I know. You are my safest place. ❤️">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF4D8D, #C9245F)', boxShadow: '0 4px 24px rgba(255,77,141,0.5)' }}>
                <Heart size={22} fill="white" className="text-white animate-heartbeat" />
              </div>
            </LongPressNote>
            <div>
              <h1 className="text-[17px] font-black leading-tight" style={{ color: 'rgba(255,235,240,0.95)' }}>
                {isReturningUser ? time.greeting : "Hey my love, it's me"}{' '}
                <Heart size={15} className="inline ml-0.5 animate-heartbeat" style={{ color: '#FF7AA2' }} fill="currentColor" />
              </h1>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,200,210,0.5)' }}>
                {isReturningUser
                  ? `I miss you so much — ${totalAnswered} of 70 answered`
                  : 'From me, with all my love 🌹'}
              </p>
            </div>
          </div>
          <EmotionalStatus className="pb-3" />
        </motion.div>

        {/* ── Chapters ── */}
        <div>
          <SectionLabel icon={<Sparkles size={11} className="text-amber-300" />} color="rgba(251,191,36,0.15)" glow="rgba(251,191,36,0.2)" label="Chapters" textColor="rgba(255,211,110,0.65)" />
          <div className="flex flex-col gap-3 mt-3">
            {categoriesMeta.map((meta, idx) => {
              const chapter = idx + 1;
              const progress = getChapterProgress(answers, reversed, chapter);
              const unlocked = isChapterUnlocked(chapter, answers, reversed);
              return (
                <ChapterCard key={chapter} chapter={chapter} meta={meta} icon={CHAPTER_ICONS[idx]}
                  progress={progress} unlocked={unlocked}
                  onTap={() => { softTap(); playBloom(); startChapter(chapter); }}
                  delay={idx * 0.07} />
              );
            })}
          </div>
        </div>

        {/* ── 6 Games ── */}
        <div>
          <SectionLabel icon={<Flame size={11} className="text-rose-300" fill="currentColor" />} color="rgba(244,63,94,0.15)" glow="rgba(244,63,94,0.2)" label="Games" textColor="rgba(255,180,200,0.65)" />
          <p className="text-[11px] mt-1 mb-4 px-1" style={{ color: 'rgba(255,150,180,0.35)' }}>
            Every game sends me your real answers
          </p>

          <div className="grid grid-cols-2 gap-3">
            {GAMES.map((game, idx) => (
              <motion.button
                key={game.id}
                onClick={() => { heartbeat(); playSparkle(); setPhase(game.id); }}
                className={`relative flex flex-col gap-2 py-5 px-3.5 rounded-2xl text-left min-h-[120px] overflow-hidden bg-gradient-to-b ${game.gradient} shadow-lg ${game.glow} border border-white/15`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div>{game.icon}</div>
                <div>
                  <div className="text-[13px] font-black text-white leading-tight">{game.label}</div>
                  <div className="text-[10px] text-white/65 mt-0.5">{game.sublabel}</div>
                </div>
                <div className="mt-auto">
                  <div className="text-[9px] text-white/40 leading-tight italic">{game.what}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ icon, color, glow, label, textColor }: { icon: React.ReactNode; color: string; glow: string; label: string; textColor: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: color, boxShadow: `0 0 12px ${glow}` }}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: textColor }}>{label}</span>
    </div>
  );
}

function ChapterCard({ chapter, meta, icon, progress, unlocked, onTap, delay }: {
  chapter: number;
  meta: (typeof categoriesMeta)[0];
  icon: string;
  progress: { answered: number; total: number; percent: number; isComplete: boolean };
  unlocked: boolean;
  onTap: () => void;
  delay: number;
}) {
  const statusLabel = progress.isComplete ? 'Complete' : progress.answered > 0 ? 'Resume' : unlocked ? 'Start' : 'Locked';
  return (
    <motion.button onClick={unlocked ? onTap : undefined}
      className={`w-full flex items-center gap-0 rounded-[20px] text-start transition-all overflow-hidden ${!unlocked && !progress.isComplete ? 'pointer-events-none' : ''}`}
      style={unlocked ? {
        background: progress.isComplete ? 'linear-gradient(135deg, rgba(255,77,141,0.09) 0%, rgba(123,92,255,0.06) 100%)' : 'rgba(255,255,255,0.065)',
        backdropFilter: 'blur(44px) saturate(160%)',
        WebkitBackdropFilter: 'blur(44px) saturate(160%)',
        border: progress.isComplete ? '1px solid rgba(255,77,141,0.25)' : '1px solid rgba(255,255,255,0.11)',
        boxShadow: progress.isComplete ? '0 6px 32px rgba(255,77,141,0.12)' : '0 6px 28px rgba(0,0,0,0.38)',
        cursor: 'pointer',
      } : {
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: 0.38,
        cursor: 'not-allowed',
      }}
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <div className={`w-1 self-stretch shrink-0 bg-gradient-to-b ${meta.colorFrom} ${meta.colorTo} ${!unlocked ? 'opacity-30' : ''}`} />
      <div className="flex items-center gap-3.5 p-3.5 flex-1 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-br ${meta.colorFrom} ${meta.colorTo} shadow-md ${!unlocked ? 'grayscale opacity-60' : ''}`}>
          {progress.isComplete ? <CheckCircle2 size={20} className="text-white" /> : !unlocked ? <Lock size={16} className="text-white/70" /> : <IconFromName name={icon} size={22} className="text-white/90" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Chapter {chapter}</span>
            {progress.isComplete && (
              <span className="text-[8px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Check size={8} /> Done
              </span>
            )}
          </div>
          <p className="text-[13px] font-semibold text-white leading-tight truncate">{meta.title}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo}`}
                initial={{ width: 0 }} animate={{ width: `${progress.percent * 100}%` }}
                transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }} />
            </div>
            <span className="text-[9px] text-white/30 tabular-nums shrink-0">{progress.answered}/{progress.total}</span>
          </div>
        </div>
        <div className="shrink-0 pl-1">
          {unlocked ? (
            <div className="flex items-center gap-0.5">
              {progress.answered > 0 && !progress.isComplete ? <RotateCcw size={13} className="text-white/40" /> : <Play size={13} className="text-white/40" />}
              <span className="text-[10px] font-semibold text-white/45 hidden sm:inline">{statusLabel}</span>
              <ChevronRight size={13} className="text-white/25" />
            </div>
          ) : <Lock size={13} className="text-white/20" />}
        </div>
      </div>
    </motion.button>
  );
}

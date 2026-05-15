'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Lock,
  CheckCircle2,
  ChevronRight,
  Play,
  RotateCcw,
  Map,
  Sparkles,
  Zap,
  Vault,
  Check,
  Globe,
  HeartPulse,
  CalendarHeart,
  Puzzle,
  Sun,
  Moon,
  Mail,
  Disc3,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { useGameStore, getChapterProgress, isChapterUnlocked } from '@/store/gameStore';
import { categoriesMeta } from '@/data/meta';
import { softTap, heartbeat } from '@/lib/useHaptics';
import IconFromName from './IconFromName';
import MoodTracker from './MoodTracker';
import { notifyOwner } from '@/lib/notify';
import { useEffect, useRef, useState } from 'react';

const MINI_GAMES = [
  {
    id: 'vibe-check' as const,
    icon: <Heart size={30} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Vibe Check',
    sublabel: 'Swipe cards',
    unlocksAtChapter: 0,
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/30',
  },
  {
    id: 'rapid-fire' as const,
    icon: <Zap size={30} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Rapid Fire',
    sublabel: 'This or That',
    unlocksAtChapter: 0,
    gradient: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/30',
  },
  {
    id: 'vault' as const,
    icon: <Vault size={30} className="text-white drop-shadow-md" />,
    label: 'Memory Vault',
    sublabel: 'Our first chapter',
    unlocksAtChapter: 0,
    gradient: 'from-violet-600 to-purple-700',
    glow: 'shadow-violet-500/30',
  },
  {
    id: 'fortune-teller' as const,
    icon: <Globe size={30} className="text-white drop-shadow-md" />,
    label: 'Fortune Teller',
    sublabel: 'Gaze into future',
    unlocksAtChapter: 0,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/30',
  },
  {
    id: 'heart-sync' as const,
    icon: <HeartPulse size={30} className="text-white drop-shadow-md" />,
    label: 'Heart Sync',
    sublabel: 'Feel the beat',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 to-red-600',
    glow: 'shadow-rose-500/30',
  },
  {
    id: 'daily-note' as const,
    icon: <CalendarHeart size={30} className="text-white drop-shadow-md" />,
    label: 'Daily Whisper',
    sublabel: 'A new note daily',
    unlocksAtChapter: 0,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
  },
  {
    id: 'perfect-match' as const,
    icon: <Puzzle size={30} className="text-white drop-shadow-md" />,
    label: 'Perfect Match',
    sublabel: 'Memory game',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'shadow-indigo-500/30',
  },
  {
    id: 'mood-ring' as const,
    icon: <Sun size={30} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Mood Ring',
    sublabel: 'Daily check-in',
    unlocksAtChapter: 0,
    gradient: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/30',
  },
  {
    id: 'comfort-mode' as const,
    icon: <Moon size={30} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Comfort Room',
    sublabel: 'Emergency hugs',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30',
  },
  {
    id: 'love-letter' as const,
    icon: <Mail size={30} className="text-white drop-shadow-md" />,
    label: 'Love Letters',
    sublabel: 'Written for you',
    unlocksAtChapter: 0,
    gradient: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-400/30',
  },
  {
    id: 'date-spinner' as const,
    icon: <Disc3 size={30} className="text-white drop-shadow-md" />,
    label: 'Date Spinner',
    sublabel: 'Spin & decide',
    unlocksAtChapter: 0,
    gradient: 'from-fuchsia-500 to-violet-600',
    glow: 'shadow-fuchsia-500/30',
  },
  {
    id: 'would-you-rather' as const,
    icon: <HelpCircle size={30} className="text-white drop-shadow-md" />,
    label: 'Would You Rather',
    sublabel: '15 scenarios',
    unlocksAtChapter: 0,
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-500/30',
  },
  {
    id: 'kiss-jar' as const,
    icon: <Heart size={30} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Kiss Jar',
    sublabel: 'Tap to send love',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30',
  },
];

const CHAPTER_ICONS = ['sparkles', 'eye', 'waves', 'message-square', 'wand', 'smile', 'camera'];

export default function HomeMapScreen() {
  const answers = useGameStore(s => s.answers);
  const reversed = useGameStore(s => s.reversed);
  const isReturningUser = useGameStore(s => s.isReturningUser);
  const setPhase = useGameStore(s => s.setPhase);
  const startChapter = useGameStore(s => s.startChapter);
  const dailyWhisperLastTimestamp = useGameStore(s => s.dailyWhisperLastTimestamp);

  const [now] = useState(Date.now);

  const totalAnswered = Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
  const overallPercent = Math.round((totalAnswered / 70) * 100);

  const notifiedRef = useRef(false);
  useEffect(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    const label = isReturningUser ? 'back on' : 'opening';
    notifyOwner(`🚨 <b>Your angel just opened the app!</b>\n\nShe is ${label} the map right now.\n📊 Overall progress: <b>${overallPercent}%</b>`);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleChapterTap = (chapter: number) => {
    softTap();
    startChapter(chapter);
  };

  const handleMinigameTap = (id: 'vibe-check' | 'rapid-fire' | 'fortune-teller' | 'heart-sync' | 'daily-note' | 'perfect-match' | 'mood-ring' | 'comfort-mode' | 'vault' | 'love-letter' | 'date-spinner' | 'would-you-rather' | 'kiss-jar') => {
    heartbeat();
    setPhase(id);
  };

  // Triple-tap on progress ring → admin dashboard
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
      className="absolute inset-0 flex flex-col overflow-y-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gradient-to-b from-rose-600/12 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col px-4 pt-8 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* ── Mood Tracker ── */}
        <MoodTracker />

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                boxShadow: '0 4px 16px rgba(244,63,94,0.4)',
              }}>
              <Map size={15} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(255,235,240,0.55)' }}>
              Our Map
            </span>
          </div>
          {/* Overall progress ring — triple-tap = admin dashboard */}
          <button onClick={handleProgressTap} className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke="url(#progressGradientHome)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${overallPercent} 100`}
                  pathLength="100"
                />
                <defs>
                  <linearGradient id="progressGradientHome" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                {overallPercent}%
              </span>
            </div>
          </button>
        </div>

        {/* ── Greeting ── */}
        <motion.div
          className="rounded-[22px] overflow-hidden"
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            backdropFilter: 'blur(40px) saturate(160%)',
            WebkitBackdropFilter: 'blur(40px) saturate(160%)',
            border: '1px solid rgba(244, 63, 94, 0.26)',
            boxShadow: '0 8px 44px rgba(244, 63, 94, 0.18), inset 0 1px 0 rgba(255, 180, 195, 0.14)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="h-[2.5px] w-full" style={{ background: 'linear-gradient(90deg, #f43f5e, #e8b86d, #f43f5e)' }} />
          <div className="flex items-center gap-3.5 p-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                boxShadow: '0 4px 20px rgba(244,63,94,0.45)',
              }}>
              <Heart size={22} fill="white" className="text-white animate-heartbeat" />
            </div>
            <div>
              <h1 className="text-[17px] font-black leading-tight" style={{ color: 'rgba(255,235,240,0.95)' }}>
                {isReturningUser ? 'Welcome back, my angel' : 'Hey my love'}{' '}
                <Heart size={15} className="inline text-rose-400 ml-0.5" fill="currentColor" />
              </h1>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,200,210,0.5)' }}>
                {isReturningUser
                  ? `${totalAnswered} of 70 answered — keep going!`
                  : 'Tap a chapter to begin your journey'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Chapter Islands ── */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)', boxShadow: '0 0 12px rgba(251,191,36,0.2)' }}>
              <Sparkles size={11} className="text-amber-300" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(251,191,36,0.6)' }}>Chapters</span>
          </div>

          <div className="flex flex-col gap-3">
            {categoriesMeta.map((meta, idx) => {
              const chapter = idx + 1;
              const progress = getChapterProgress(answers, reversed, chapter);
              const unlocked = isChapterUnlocked(chapter, answers, reversed);
              const icon = CHAPTER_ICONS[idx];

              return (
                <ChapterCard
                  key={chapter}
                  chapter={chapter}
                  meta={meta}
                  icon={icon}
                  progress={progress}
                  unlocked={unlocked}
                  onTap={() => handleChapterTap(chapter)}
                  delay={idx * 0.07}
                />
              );
            })}
          </div>
        </div>

        {/* ── Mini-Game Bonus Islands ── */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.15)', boxShadow: '0 0 12px rgba(139,92,246,0.2)' }}>
              <Zap size={11} className="text-violet-300" fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(167,139,250,0.6)' }}>Bonus Islands</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {MINI_GAMES.map((game, idx) => {
              const ch1Complete = getChapterProgress(answers, reversed, 1).isComplete;
              const ch2Complete = getChapterProgress(answers, reversed, 2).isComplete;
              const ch3Complete = getChapterProgress(answers, reversed, 3).isComplete;
              const ch4Complete = getChapterProgress(answers, reversed, 4).isComplete;
              const unlocked =
                game.unlocksAtChapter === 0
                  ? true
                  : game.unlocksAtChapter === 1
                  ? ch1Complete
                  : game.unlocksAtChapter === 2
                  ? ch2Complete
                  : game.unlocksAtChapter === 3
                  ? ch3Complete
                  : game.unlocksAtChapter === 4
                  ? ch4Complete
                  : false;

              return (
                <motion.button
                  key={game.id}
                  onClick={() => unlocked && handleMinigameTap(game.id)}
                  className={`
                    relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-center
                    transition-all active:scale-95 cursor-pointer overflow-hidden
                    ${unlocked
                      ? `bg-gradient-to-b ${game.gradient} shadow-lg ${game.glow} border border-white/15`
                      : 'glass opacity-35 pointer-events-none'
                    }
                  `}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.07 }}
                >
                  {/* Inner top highlight */}
                  {unlocked && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  )}

                  {/* NEW Badge for Daily Note */}
                  {game.id === 'daily-note' && now - dailyWhisperLastTimestamp > 1 * 60 * 60 * 1000 && (
                    <motion.div
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-red-300 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      NEW
                    </motion.div>
                  )}

                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock size={9} className="text-white/50" />
                    </div>
                  )}
                  <div>{game.icon}</div>
                  <div>
                    <div className="text-[10px] font-bold text-white leading-tight">{game.label}</div>
                    <div className="text-[8px] text-white/70 mt-0.5">{game.sublabel}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <p className="text-[10px] text-white/20 text-center mt-3 italic">
            Complete chapters to unlock bonus islands
          </p>
        </div>

      </div>
    </motion.div>
  );
}

// ─── Chapter Card Sub-component ──────────────────────────────────────

function ChapterCard({
  chapter,
  meta,
  icon,
  progress,
  unlocked,
  onTap,
  delay,
}: {
  chapter: number;
  meta: (typeof categoriesMeta)[0];
  icon: string;
  progress: { answered: number; total: number; percent: number; isComplete: boolean };
  unlocked: boolean;
  onTap: () => void;
  delay: number;
}) {
  const statusLabel = progress.isComplete
    ? 'Complete'
    : progress.answered > 0
    ? 'Resume'
    : unlocked
    ? 'Start'
    : 'Locked';

  return (
    <motion.button
      onClick={unlocked ? onTap : undefined}
      className={`
        w-full flex items-center gap-0 rounded-[20px] text-start transition-all active:scale-[0.98] overflow-hidden
        ${!unlocked && !progress.isComplete ? 'pointer-events-none' : ''}
      `}
      style={unlocked ? {
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(40px) saturate(155%)',
        WebkitBackdropFilter: 'blur(40px) saturate(155%)',
        border: progress.isComplete
          ? '1px solid rgba(34,197,94,0.3)'
          : '1px solid rgba(255,255,255,0.13)',
        boxShadow: progress.isComplete
          ? '0 6px 28px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 6px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        cursor: 'pointer',
      } : {
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: 0.4,
        cursor: 'not-allowed',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      {/* Left colored accent strip */}
      <div
        className={`w-1 self-stretch shrink-0 bg-gradient-to-b ${meta.colorFrom} ${meta.colorTo} ${!unlocked ? 'opacity-30' : ''}`}
      />

      <div className="flex items-center gap-3.5 p-3.5 flex-1 min-w-0">
        {/* Icon */}
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
            bg-gradient-to-br ${meta.colorFrom} ${meta.colorTo} shadow-md
            ${!unlocked ? 'grayscale opacity-60' : ''}
          `}
        >
          {progress.isComplete ? (
            <CheckCircle2 size={20} className="text-white" />
          ) : !unlocked ? (
            <Lock size={16} className="text-white/70" />
          ) : (
            <IconFromName name={icon} size={22} className="text-white/90" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
              Chapter {chapter}
            </span>
            {progress.isComplete && (
              <span className="text-[8px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Check size={8} /> Done
              </span>
            )}
          </div>
          <p className="text-[13px] font-semibold text-white leading-tight truncate">{meta.title}</p>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent * 100}%` }}
                transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[9px] text-white/30 tabular-nums shrink-0">
              {progress.answered}/{progress.total}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0 pl-1">
          {unlocked ? (
            <div className="flex items-center gap-0.5">
              {progress.answered > 0 && !progress.isComplete ? (
                <RotateCcw size={13} className="text-white/40" />
              ) : (
                <Play size={13} className="text-white/40" />
              )}
              <span className="text-[10px] font-semibold text-white/45 hidden sm:inline">{statusLabel}</span>
              <ChevronRight size={13} className="text-white/25" />
            </div>
          ) : (
            <Lock size={13} className="text-white/20" />
          )}
        </div>
      </div>
    </motion.button>
  );
}

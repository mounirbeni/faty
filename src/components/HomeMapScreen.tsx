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
} from 'lucide-react';
import { useGameStore, getChapterProgress, isChapterUnlocked } from '@/store/gameStore';
import { categoriesMeta } from '@/data/meta';
import { softTap, heartbeat } from '@/lib/useHaptics';
import IconFromName from './IconFromName';
import MoodTracker from './MoodTracker';
import { sendTelegramNotification } from '@/app/actions/notify';
import { useEffect, useRef } from 'react';

const MINI_GAMES = [
  {
    id: 'vibe-check' as const,
    icon: <Heart size={32} className="text-pink-300 drop-shadow-md" />,
    label: 'Vibe Check',
    sublabel: 'Swipe cards',
    unlocksAtChapter: 0,
    gradient: 'from-pink-500/80 to-rose-600/80',
    glow: 'shadow-pink-500/25',
  },
  {
    id: 'rapid-fire' as const,
    icon: <Zap size={32} className="text-amber-300 drop-shadow-md" />,
    label: 'Rapid Fire',
    sublabel: 'This or That',
    unlocksAtChapter: 0,
    gradient: 'from-orange-500/80 to-amber-600/80',
    glow: 'shadow-orange-500/25',
  },
  {
    id: 'vault' as const,
    icon: <Vault size={32} className="text-purple-300 drop-shadow-md" />,
    label: 'The May 11 Vault',
    sublabel: 'Always visible',
    unlocksAtChapter: 0, // always tappable (locked internally)
    gradient: 'from-violet-600/80 to-purple-700/80',
    glow: 'shadow-violet-500/25',
  },
  {
    id: 'fortune-teller' as const,
    icon: <Globe size={32} className="text-cyan-300 drop-shadow-md" />,
    label: 'Fortune Teller',
    sublabel: 'Gaze into the future',
    unlocksAtChapter: 0,
    gradient: 'from-cyan-500/80 to-blue-600/80',
    glow: 'shadow-cyan-500/25',
  },
  {
    id: 'heart-sync' as const,
    icon: <HeartPulse size={32} className="text-rose-300 drop-shadow-md" />,
    label: 'Heart Sync',
    sublabel: 'Feel the beat',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500/80 to-red-600/80',
    glow: 'shadow-rose-500/25',
  },
  {
    id: 'daily-note' as const,
    icon: <CalendarHeart size={32} className="text-emerald-300 drop-shadow-md" />,
    label: 'Daily Whisper',
    sublabel: 'A new note daily',
    unlocksAtChapter: 0,
    gradient: 'from-emerald-500/80 to-teal-600/80',
    glow: 'shadow-emerald-500/25',
  },
  {
    id: 'perfect-match' as const,
    icon: <Puzzle size={32} className="text-indigo-300 drop-shadow-md" />,
    label: 'Perfect Match',
    sublabel: 'Memory game',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-500/80 to-blue-600/80',
    glow: 'shadow-indigo-500/25',
  },
  {
    id: 'mood-ring' as const,
    icon: <Sun size={32} className="text-yellow-300 drop-shadow-md" />,
    label: 'Mood Ring',
    sublabel: 'Daily check-in',
    unlocksAtChapter: 0,
    gradient: 'from-yellow-500/80 to-amber-600/80',
    glow: 'shadow-yellow-500/25',
  },
];

const CHAPTER_ICONS = ['sparkles', 'eye', 'waves', 'message-square', 'wand'];

export default function HomeMapScreen() {
  const answers = useGameStore(s => s.answers);
  const reversed = useGameStore(s => s.reversed);
  const isReturningUser = useGameStore(s => s.isReturningUser);
  const setPhase = useGameStore(s => s.setPhase);
  const startChapter = useGameStore(s => s.startChapter);
  const dailyWhisperLastTimestamp = useGameStore(s => s.dailyWhisperLastTimestamp);

  const totalAnswered = Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
  const overallPercent = Math.round((totalAnswered / 50) * 100);

  // Fire once per app session, not on every re-render
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    const label = isReturningUser ? 'back on' : 'opening';
    sendTelegramNotification(
      `🚨 <b>Faty just opened the app!</b>\n\nShe is ${label} the map right now. 🗺️\n📊 Overall progress: <b>${overallPercent}%</b>`
    ).catch(console.error);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleChapterTap = (chapter: number) => {
    softTap();
    startChapter(chapter);
  };

  const handleMinigameTap = (id: 'vibe-check' | 'rapid-fire' | 'fortune-teller' | 'heart-sync' | 'daily-note' | 'perfect-match' | 'mood-ring' | 'vault') => {
    heartbeat();
    setPhase(id);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col px-4 pt-8 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* ── Mood Tracker ── */}
        <MoodTracker />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-rose-400" />
            <span className="text-sm font-bold text-white/60 tracking-wider uppercase">
              Our Map
            </span>
          </div>
          {/* Overall progress ring */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                <circle
                  cx="20" cy="20" r="16" fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${overallPercent} 100`}
                  pathLength="100"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                {overallPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Greeting ── */}
        <motion.div
          className="glass-warm rounded-3xl p-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
              <Heart size={22} fill="white" className="text-white animate-heartbeat" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">
                {isReturningUser ? 'Welcome back, my angel' : 'Hey my love'}{' '}
                <Heart size={24} className="inline text-rose-400 ml-1" fill="currentColor" />
              </h1>
              <p className="text-[13px] text-white/50 mt-0.5">
                {isReturningUser
                  ? `${totalAnswered} of 50 answered — keep going!`
                  : 'Tap a chapter to begin your journey'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Chapter Islands ── */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Chapters</span>
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
            <Zap size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Bonus Islands</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                    relative flex flex-col items-center gap-2 p-3.5 rounded-2xl text-center
                    transition-all active:scale-95 cursor-pointer
                    ${unlocked
                      ? `bg-gradient-to-b ${game.gradient} shadow-lg ${game.glow} border border-white/10`
                      : 'glass opacity-40 pointer-events-none'
                    }
                  `}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.07 }}
                >
                  {/* NEW Badge for Daily Note */}
                  {game.id === 'daily-note' && Date.now() - dailyWhisperLastTimestamp > 1 * 60 * 60 * 1000 && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-red-300 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      NEW
                    </motion.div>
                  )}

                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock size={10} className="text-white/50" />
                    </div>
                  )}
                  <div className="mb-0.5">{game.icon}</div>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">{game.label}</div>
                    <div className="text-[9px] text-white/60 mt-0.5">{game.sublabel}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <p className="text-[10px] text-white/25 text-center mt-2.5 italic">
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
        w-full flex items-center gap-4 p-4 rounded-2xl text-start transition-all active:scale-[0.98]
        ${unlocked ? 'glass-strong cursor-pointer' : 'glass opacity-50 cursor-not-allowed'}
        ${progress.isComplete ? 'ring-1 ring-green-500/30' : ''}
        ${!unlocked && !progress.isComplete ? 'pointer-events-none' : ''}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0
          bg-gradient-to-br ${meta.colorFrom} ${meta.colorTo} shadow-md
          ${!unlocked ? 'grayscale' : ''}
        `}
      >
        {progress.isComplete ? (
          <CheckCircle2 size={22} className="text-white" />
        ) : !unlocked ? (
          <Lock size={18} className="text-white/70" />
        ) : (
          <IconFromName name={icon} size={24} className="text-white/80" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
            Chapter {chapter}
          </span>
          {progress.isComplete && (
            <span className="text-[9px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Check size={10} /> Done
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-white leading-tight truncate">{meta.title}</p>

        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent * 100}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] text-white/30 tabular-nums shrink-0">
            {progress.answered}/{progress.total}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {unlocked ? (
          <div className="flex items-center gap-1">
            {progress.answered > 0 && !progress.isComplete ? (
              <RotateCcw size={14} className="text-white/40" />
            ) : progress.isComplete ? (
              <Play size={14} className="text-white/40" />
            ) : (
              <Play size={14} className="text-white/40" />
            )}
            <span className="text-[11px] font-semibold text-white/50">{statusLabel}</span>
            <ChevronRight size={14} className="text-white/30" />
          </div>
        ) : (
          <Lock size={15} className="text-white/25" />
        )}
      </div>
    </motion.button>
  );
}

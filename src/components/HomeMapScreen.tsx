'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Flame, BookOpen, Star, Map, ChevronRight,
  Play, RotateCcw, CheckCircle2, Lock, Check,
} from 'lucide-react';
import ConstellationBanner from './ConstellationBanner';
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
    icon: <BookOpen size={26} className="text-white" />,
    label: 'Open Book',
    sublabel: 'Pick an option or write it',
    what: 'I get your answer to every question',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/50',
  },
  {
    id: 'rate-us',
    icon: <Star size={26} className="text-white" fill="currentColor" />,
    label: 'Rate Us',
    sublabel: 'Slide to show how we feel',
    what: 'I get a full report with your numbers',
    gradient: 'from-violet-500 to-indigo-500',
    glow: 'shadow-violet-500/50',
  },
  {
    id: 'finish-my-thought',
    icon: <Sparkles size={26} className="text-white" />,
    label: 'Finish My Thought',
    sublabel: 'Complete these 5 sentences',
    what: 'I get every word you write',
    gradient: 'from-blue-500 to-sky-400',
    glow: 'shadow-blue-500/50',
  },
  {
    id: 'daily-three',
    icon: <Heart size={26} className="text-white" fill="currentColor" />,
    label: 'Daily Three',
    sublabel: '3 new questions every day',
    what: 'I get all 3 answers daily',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-400/50',
  },
  {
    id: 'fantasy-builder',
    icon: <Flame size={26} className="text-white" fill="currentColor" />,
    label: 'Fantasy Builder',
    sublabel: 'Build our perfect night',
    what: 'I get the full story you build',
    gradient: 'from-rose-600 to-red-500',
    glow: 'shadow-rose-600/50',
  },
  {
    id: 'bold-confessions',
    icon: <Flame size={26} className="text-white" />,
    label: 'Bold Confessions',
    sublabel: 'Draw a card — say it honestly',
    what: 'I get every confession you send',
    gradient: 'from-red-500 to-rose-600',
    glow: 'shadow-red-500/50',
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

      <div className="relative z-10 flex flex-col px-4 max-w-lg mx-auto w-full gap-5"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>

        <MoodTracker />

        {/* Presence line */}
        <div className="flex items-center justify-center gap-2 py-0.5">
          <div className="h-px flex-1 bg-white/8" />
          <AnimatePresence mode="wait">
            {presenceVisible && (
              <motion.div key={presenceIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.55 }}
                className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px]">{PRESENCE_MSGS[presenceIdx].emoji}</span>
                <span className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {PRESENCE_MSGS[presenceIdx].text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#FF2060', boxShadow: '0 4px 16px rgba(255,32,96,0.4)' }}>
              <Map size={15} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Our Map
            </span>
          </div>
          <button onClick={handleProgressTap} className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="url(#pg)" strokeWidth="3.5"
                  strokeLinecap="round" strokeDasharray={`${overallPercent} 100`} pathLength="100" />
                <defs>
                  <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF2060" />
                    <stop offset="100%" stopColor="#5856D6" />
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
        <motion.div className="rounded-[20px] overflow-hidden"
          style={{
            background: '#161616',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
          }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #FF2060, #5856D6, #0A84FF)' }} />
          <div className="flex items-center gap-3.5 p-4">
            <LongPressNote note="I love you more than any word I know. You are my safest place. ❤️">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: '#FF2060', boxShadow: '0 4px 20px rgba(255,32,96,0.45)' }}>
                <Heart size={22} fill="white" className="text-white animate-heartbeat" />
              </div>
            </LongPressNote>
            <div>
              <h1 className="text-[17px] font-black leading-tight text-white">
                {isReturningUser ? time.greeting : "Hey my love, it's me"}{' '}
                <Heart size={15} className="inline ml-0.5 animate-heartbeat" style={{ color: '#FF4D80' }} fill="currentColor" />
              </h1>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {isReturningUser
                  ? `I miss you so much — ${totalAnswered} of 70 answered`
                  : 'From me, with all my love 🌹'}
              </p>
            </div>
          </div>
          <EmotionalStatus className="pb-3" />
        </motion.div>

        {/* ── Constellation hero ── */}
        <ConstellationBanner
          answered={totalAnswered}
          total={70}
          onOpen={() => { heartbeat(); playBloom(); setPhase('constellation'); }}
        />

        {/* ── Chapters ── */}
        <div>
          <SectionLabel icon={<Sparkles size={11} className="text-amber-400" />} color="rgba(255,179,0,0.12)" glow="rgba(255,179,0,0.2)" label="Chapters" textColor="rgba(255,255,255,0.55)" />
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
          <SectionLabel icon={<Flame size={11} className="text-rose-400" fill="currentColor" />} color="rgba(255,32,96,0.12)" glow="rgba(255,32,96,0.2)" label="Games" textColor="rgba(255,255,255,0.55)" />
          <p className="text-[11px] mt-1 mb-4 px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Every game sends me your real answers
          </p>

          <div className="grid grid-cols-2 gap-3">
            {GAMES.map((game, idx) => (
              <motion.button
                key={game.id}
                onClick={() => { heartbeat(); playSparkle(); setPhase(game.id); }}
                className={`relative flex flex-col gap-2 py-5 px-3.5 rounded-2xl text-left min-h-[124px] overflow-hidden bg-gradient-to-br ${game.gradient} shadow-xl ${game.glow}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <div>{game.icon}</div>
                <div>
                  <div className="text-[14px] font-black text-white leading-tight">{game.label}</div>
                  <div className="text-[10px] text-white/70 mt-0.5">{game.sublabel}</div>
                </div>
                <div className="mt-auto">
                  <div className="text-[9px] text-white/45 leading-tight italic">{game.what}</div>
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
      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: color, boxShadow: `0 0 10px ${glow}` }}>
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: textColor }}>{label}</span>
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
      className={`w-full flex items-center gap-0 rounded-[18px] text-start transition-all overflow-hidden ${!unlocked && !progress.isComplete ? 'pointer-events-none' : ''}`}
      style={unlocked ? {
        background: progress.isComplete ? '#1A1014' : '#161616',
        border: progress.isComplete ? '1px solid rgba(255,32,96,0.2)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: progress.isComplete ? '0 6px 28px rgba(255,32,96,0.1)' : '0 4px 20px rgba(0,0,0,0.45)',
        cursor: 'pointer',
      } : {
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.05)',
        opacity: 0.4,
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
            <span className="text-[9px] font-bold text-white/35 uppercase tracking-wider">Chapter {chapter}</span>
            {progress.isComplete && (
              <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Check size={8} /> Done
              </span>
            )}
          </div>
          <p className="text-[13px] font-bold text-white leading-tight truncate">{meta.title}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-[3px] bg-white/8 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo}`}
                initial={{ width: 0 }} animate={{ width: `${progress.percent * 100}%` }}
                transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }} />
            </div>
            <span className="text-[9px] text-white/35 tabular-nums shrink-0">{progress.answered}/{progress.total}</span>
          </div>
        </div>
        <div className="shrink-0 pl-1">
          {unlocked ? (
            <div className="flex items-center gap-0.5">
              {progress.answered > 0 && !progress.isComplete ? <RotateCcw size={13} className="text-white/45" /> : <Play size={13} className="text-white/45" />}
              <span className="text-[10px] font-semibold text-white/50 hidden sm:inline">{statusLabel}</span>
              <ChevronRight size={13} className="text-white/30" />
            </div>
          ) : <Lock size={13} className="text-white/25" />}
        </div>
      </div>
    </motion.button>
  );
}

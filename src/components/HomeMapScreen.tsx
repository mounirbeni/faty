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
  MapPin,
  Sparkles,
  Vault,
  Check,
  CalendarHeart,
  Sun,
  Moon,
  Mail,
  HelpCircle,
  Bomb,
  BookOpen,
  Stars,
  Flame,
  ListChecks,
  Zap,
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
import { useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

/* ── Rotating emotional presence messages ── */
const PRESENCE_MSGS = [
  { text: 'thinking about you softly…',    emoji: '💭' },
  { text: 'missing you from here',          emoji: '💗' },
  { text: 'replaying our moments tonight',  emoji: '✨' },
  { text: 'listening to the quiet with you',emoji: '🌙' },
  { text: 'awake and thinking of your smile',emoji: '🌹' },
  { text: 'feeling you close, even from far',emoji: '❤️' },
  { text: 'safe and loved inside this world',emoji: '🌌' },
];

type MoodKey = 'all' | 'night' | 'miss' | 'bold' | 'dream' | 'romantic' | 'deep';

const MOODS: { key: MoodKey; emoji: string; label: string }[] = [
  { key: 'all',      emoji: '⭐', label: 'All Games' },
  { key: 'night',    emoji: '🌙', label: 'Late Night' },
  { key: 'miss',     emoji: '💗', label: 'I Miss You' },
  { key: 'bold',     emoji: '🔥', label: 'Bold & Daring' },
  { key: 'dream',    emoji: '✨', label: 'Dreaming' },
  { key: 'romantic', emoji: '💌', label: 'Romantic' },
  { key: 'deep',     emoji: '🌊', label: 'Deep & Real' },
];

const MINI_GAMES = [
  // ── Emotional Memory & Turning Points ──────────────────────────────────────
  {
    id: 'moment-i-knew' as const,
    icon: <Heart size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'The Moment I Knew',
    sublabel: '6 turning points',
    unlocksAtChapter: 0,
    gradient: 'from-rose-700 via-pink-700 to-rose-900',
    glow: 'shadow-rose-700/40',
    moods: ['miss', 'deep'] as MoodKey[],
  },
  {
    id: 'our-firsts' as const,
    icon: <Stars size={28} className="text-white drop-shadow-md" />,
    label: 'Our Firsts',
    sublabel: 'Our relationship timeline',
    unlocksAtChapter: 0,
    gradient: 'from-amber-600 via-orange-600 to-amber-800',
    glow: 'shadow-amber-500/35',
    moods: ['miss', 'romantic'] as MoodKey[],
  },
  {
    id: 'untold-truths' as const,
    icon: <Sparkles size={28} className="text-white drop-shadow-md" />,
    label: 'Untold Truths',
    sublabel: 'Things I never said',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-700 via-blue-800 to-indigo-900',
    glow: 'shadow-indigo-500/35',
    moods: ['night', 'romantic'] as MoodKey[],
  },

  // ── Emotional Vulnerability & Depth ────────────────────────────────────────
  {
    id: 'night-confessions' as const,
    icon: <Moon size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Night Confessions',
    sublabel: '8 honest questions',
    unlocksAtChapter: 0,
    gradient: 'from-blue-900 via-slate-800 to-blue-950',
    glow: 'shadow-blue-500/30',
    moods: ['night', 'deep'] as MoodKey[],
  },
  {
    id: 'words-i-hold' as const,
    icon: <Mail size={28} className="text-white drop-shadow-md" />,
    label: 'Words I Hold',
    sublabel: 'Five sentences for you',
    unlocksAtChapter: 0,
    gradient: 'from-rose-800 via-pink-800 to-rose-950',
    glow: 'shadow-rose-600/35',
    moods: ['miss', 'romantic'] as MoodKey[],
  },
  {
    id: 'emotional-depth' as const,
    icon: (
      <div className="relative">
        <Sparkles size={26} className="text-white drop-shadow-md" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(129,140,248,0.7)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Emotional Depth',
    sublabel: '6 deep questions',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-800 via-violet-900 to-purple-950',
    glow: 'shadow-violet-500/35',
    moods: ['night', 'deep'] as MoodKey[],
  },
  {
    id: 'first-times' as const,
    icon: (
      <div className="relative">
        <Heart size={26} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(167,139,250,0.7)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'First Times',
    sublabel: '8 emotional firsts',
    unlocksAtChapter: 0,
    gradient: 'from-violet-700 via-purple-800 to-violet-950',
    glow: 'shadow-purple-500/35',
    moods: ['romantic', 'miss'] as MoodKey[],
  },

  // ── Shared Future & Dreams ──────────────────────────────────────────────────
  {
    id: 'our-forever' as const,
    icon: <Stars size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Our Forever',
    sublabel: 'Build our future vision',
    unlocksAtChapter: 0,
    gradient: 'from-amber-700 via-yellow-700 to-orange-800',
    glow: 'shadow-amber-400/35',
    moods: ['dream', 'deep'] as MoodKey[],
  },

  // ── Intimacy & Physical Connection ─────────────────────────────────────────
  {
    id: 'intimacy-hub' as const,
    icon: (
      <div className="relative">
        <Flame size={28} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(255,77,141,0.8)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Emotional Intimacy',
    sublabel: '4 intimate journeys',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 via-pink-600 to-purple-700',
    glow: 'shadow-pink-500/40',
    moods: ['bold', 'deep'] as MoodKey[],
  },
  {
    id: 'desire-deck' as const,
    icon: <Flame size={28} className="text-white drop-shadow-md" />,
    label: 'Desire Deck',
    sublabel: 'Cards for two 🔥',
    unlocksAtChapter: 0,
    gradient: 'from-rose-700 via-red-800 to-pink-900',
    glow: 'shadow-rose-700/40',
    moods: ['bold', 'night'] as MoodKey[],
  },
  {
    id: 'pillow-talk' as const,
    icon: <Moon size={28} className="text-white drop-shadow-md" />,
    label: 'Pillow Talk',
    sublabel: 'Late night questions',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-800 via-blue-900 to-slate-900',
    glow: 'shadow-indigo-500/30',
    moods: ['night', 'deep'] as MoodKey[],
  },
  {
    id: 'inside-his-heart' as const,
    icon: (
      <div className="relative">
        <Heart size={26} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 16px rgba(139,92,246,0.9)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Inside His Heart',
    sublabel: 'A cinematic journey',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-600 via-violet-600 to-purple-800',
    glow: 'shadow-violet-500/40',
    moods: ['deep', 'romantic'] as MoodKey[],
  },

  // ── Truth & Connection ──────────────────────────────────────────────────────
  {
    id: 'truth-bombs' as const,
    icon: <Bomb size={28} className="text-white drop-shadow-md" />,
    label: 'Truth Bombs',
    sublabel: '15 deep questions',
    unlocksAtChapter: 0,
    gradient: 'from-pink-600 to-rose-700',
    glow: 'shadow-pink-500/30',
    moods: ['bold', 'deep'] as MoodKey[],
  },
  {
    id: 'would-you-rather' as const,
    icon: <HelpCircle size={28} className="text-white drop-shadow-md" />,
    label: 'Would You Rather',
    sublabel: '15 real scenarios',
    unlocksAtChapter: 0,
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-500/30',
    moods: ['bold', 'dream'] as MoodKey[],
  },
  {
    id: 'couple-goals' as const,
    icon: <ListChecks size={28} className="text-white drop-shadow-md" />,
    label: 'Couple Goals',
    sublabel: '40 things to do together',
    unlocksAtChapter: 0,
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    glow: 'shadow-amber-400/30',
    moods: ['dream', 'romantic'] as MoodKey[],
  },

  // ── Presence & Affection ───────────────────────────────────────────────────
  {
    id: 'kiss-jar' as const,
    icon: <Heart size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Kiss Jar',
    sublabel: 'Tap to send love',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30',
    moods: ['romantic'] as MoodKey[],
  },
  {
    id: 'comfort-mode' as const,
    icon: <Moon size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Comfort Room',
    sublabel: 'Emergency hugs',
    unlocksAtChapter: 0,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/30',
    moods: ['romantic', 'miss'] as MoodKey[],
  },
  {
    id: 'mood-ring' as const,
    icon: <Sun size={28} className="text-white drop-shadow-md" fill="currentColor" />,
    label: 'Mood Ring',
    sublabel: 'Daily check-in',
    unlocksAtChapter: 0,
    gradient: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/30',
    moods: ['romantic'] as MoodKey[],
  },

  // ── Stories & Letters ──────────────────────────────────────────────────────
  {
    id: 'love-story' as const,
    icon: <BookOpen size={28} className="text-white drop-shadow-md" />,
    label: 'Love Story',
    sublabel: 'Write our story',
    unlocksAtChapter: 0,
    gradient: 'from-violet-500 to-purple-700',
    glow: 'shadow-violet-500/30',
    moods: ['dream', 'romantic'] as MoodKey[],
  },
  {
    id: 'love-letter' as const,
    icon: <Mail size={28} className="text-white drop-shadow-md" />,
    label: 'Love Letters',
    sublabel: 'Written for you',
    unlocksAtChapter: 0,
    gradient: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-400/30',
    moods: ['romantic', 'miss'] as MoodKey[],
  },
  {
    id: 'daily-note' as const,
    icon: <CalendarHeart size={28} className="text-white drop-shadow-md" />,
    label: 'Daily Whisper',
    sublabel: 'A new note daily',
    unlocksAtChapter: 0,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
    moods: ['miss', 'romantic'] as MoodKey[],
  },
  {
    id: 'vault' as const,
    icon: <Vault size={28} className="text-white drop-shadow-md" />,
    label: 'Memory Vault',
    sublabel: 'Our first chapter',
    unlocksAtChapter: 0,
    gradient: 'from-violet-600 to-purple-700',
    glow: 'shadow-violet-500/30',
    moods: ['deep', 'miss'] as MoodKey[],
  },

  // ── New LDR Games ──────────────────────────────────────────────────────────
  {
    id: 'whisper-to-me' as const,
    icon: (
      <div className="relative">
        <Moon size={26} className="text-white drop-shadow-md" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(99,102,241,0.7)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Whisper to Me',
    sublabel: 'Say whatever you feel',
    unlocksAtChapter: 0,
    gradient: 'from-indigo-900 via-violet-900 to-slate-900',
    glow: 'shadow-indigo-500/30',
    moods: ['night', 'miss'] as MoodKey[],
  },
  {
    id: 'things-i-miss' as const,
    icon: (
      <div className="relative">
        <Heart size={26} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(251,113,133,0.7)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'Things I Miss',
    sublabel: 'Show him what you miss',
    unlocksAtChapter: 0,
    gradient: 'from-pink-700 via-rose-700 to-pink-900',
    glow: 'shadow-pink-500/35',
    moods: ['miss'] as MoodKey[],
  },
  {
    id: 'bold-list' as const,
    icon: (
      <div className="relative">
        <Flame size={28} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(220,38,38,0.8)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'When I See You',
    sublabel: 'Bold desires list 🔥',
    unlocksAtChapter: 0,
    gradient: 'from-red-700 via-rose-700 to-red-900',
    glow: 'shadow-red-500/35',
    moods: ['bold'] as MoodKey[],
  },
  {
    id: 'distance-diary' as const,
    icon: <BookOpen size={28} className="text-white drop-shadow-md" />,
    label: 'Distance Diary',
    sublabel: 'Write today\'s entry',
    unlocksAtChapter: 0,
    gradient: 'from-violet-800 via-purple-900 to-violet-950',
    glow: 'shadow-violet-400/30',
    moods: ['dream', 'deep'] as MoodKey[],
  },
  {
    id: 'how-are-we' as const,
    icon: (
      <div className="relative">
        <Heart size={28} className="text-white drop-shadow-md" fill="currentColor" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 14px rgba(236,72,153,0.8)', borderRadius: '50%' }} />
      </div>
    ),
    label: 'How Are We?',
    sublabel: 'Rate our bond right now',
    unlocksAtChapter: 0,
    gradient: 'from-fuchsia-700 via-pink-800 to-fuchsia-950',
    glow: 'shadow-fuchsia-500/35',
    moods: ['deep'] as MoodKey[],
  },
];

const CHAPTER_ICONS = ['sparkles', 'eye', 'waves', 'message-square', 'wand', 'smile', 'camera'];

export default function HomeMapScreen() {
  const answers = useGameStore(s => s.answers);
  const reversed = useGameStore(s => s.reversed);
  const isReturningUser = useGameStore(s => s.isReturningUser);
  const setPhase = useGameStore(s => s.setPhase);
  const startChapter = useGameStore(s => s.startChapter);
  const time = useTimeContext();

  const totalAnswered = Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
  const overallPercent = Math.round((totalAnswered / 70) * 100);


  const handleChapterTap = (chapter: number) => {
    softTap();
    playBloom();
    startChapter(chapter);
  };

  const [selectedMood, setSelectedMood] = useState<MoodKey>('all');

  const handleMinigameTap = (id: 'daily-note' | 'mood-ring' | 'comfort-mode' | 'vault' | 'love-letter' | 'would-you-rather' | 'kiss-jar' | 'truth-bombs' | 'love-story' | 'intimacy-hub' | 'inside-his-heart' | 'desire-deck' | 'pillow-talk' | 'couple-goals' | 'moment-i-knew' | 'untold-truths' | 'our-forever' | 'night-confessions' | 'first-times' | 'words-i-hold' | 'emotional-depth' | 'our-firsts' | 'whisper-to-me' | 'things-i-miss' | 'bold-list' | 'distance-diary' | 'how-are-we') => {
    heartbeat();
    playSparkle();
    setPhase(id);
  };

  const visibleGames = selectedMood === 'all'
    ? MINI_GAMES
    : MINI_GAMES.filter(g => g.moods.includes(selectedMood));

  // Rotating presence messages
  const [presenceIdx, setPresenceIdx]     = useState(0);
  const [presenceVisible, setPresenceVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setPresenceVisible(false);
      setTimeout(() => {
        setPresenceIdx(i => (i + 1) % PRESENCE_MSGS.length);
        setPresenceVisible(true);
      }, 600);
    }, 7000);
    return () => clearInterval(t);
  }, []);

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
      className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[560px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,77,141,0.18) 0%, rgba(123,92,255,0.08) 50%, transparent 70%)', filter: 'blur(80px)', animation: 'breathe-glow 6s ease-in-out infinite' }} />

      <div className="relative z-10 flex flex-col px-4 max-w-lg mx-auto w-full gap-5" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>

        {/* ── Mood Tracker ── */}
        <MoodTracker />

        {/* ── Emotional presence message ── */}
        <div className="flex items-center justify-center gap-2 py-0.5">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,141,0.2))' }} />
          <AnimatePresence mode="wait">
            {presenceVisible && (
              <motion.div
                key={presenceIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.55 }}
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

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF4D8D, #C9245F)',
                boxShadow: '0 4px 16px rgba(255,77,141,0.45)',
              }}>
              <Map size={15} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(255,235,240,0.55)' }}>
              Our Map
            </span>
          </div>
          {/* Overall progress ring — triple-tap = admin dashboard */}
          <button onClick={handleProgressTap} className="flex items-center gap-2 cursor-pointer transition-transform">
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

        {/* ── Two Cities Banner ── */}
        <motion.div
          className="rounded-[22px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,184,77,0.08) 0%, rgba(123,92,255,0.07) 50%, rgba(255,77,141,0.08) 100%)',
            backdropFilter: 'blur(44px) saturate(165%)',
            WebkitBackdropFilter: 'blur(44px) saturate(165%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(255,77,141,0.04), inset 0 1px 0 rgba(255,255,255,0.09)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="flex items-center justify-between px-5 py-4">
            {/* Her side */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(217,119,6,0.2)', border: '1px solid rgba(217,119,6,0.3)', boxShadow: '0 0 16px rgba(217,119,6,0.25)' }}>
                <MapPin size={16} className="text-amber-400" fill="currentColor" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(251,191,36,0.8)' }}>Your heart</span>
              <span className="text-[8px]" style={{ color: 'rgba(251,191,36,0.4)' }}>My angel 🌙</span>
            </div>

            {/* Connection line */}
            <div className="flex-1 flex flex-col items-center gap-1.5 px-3">
              <div className="w-full flex items-center gap-0.5 justify-center">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: i === 4 ? 7 : 3,
                      height: i === 4 ? 7 : 3,
                      background: i === 4
                        ? 'linear-gradient(135deg, #FF4D8D, #A78BFA)'
                        : i < 4 ? `rgba(255,184,77,${0.3 + i * 0.07})` : `rgba(255,77,141,${0.3 + (8-i) * 0.07})`,
                    }}
                    animate={i === 4 ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0 }}
                  />
                ))}
              </div>
              <LongPressNote note="No distance is big enough to change what I feel. Always together, always yours. ✦">
                <span className="text-[8px] font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>always together ✦</span>
              </LongPressNote>
            </div>

            {/* His side */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)', boxShadow: '0 0 16px rgba(244,63,94,0.25)' }}>
                <Heart size={16} className="text-rose-400" fill="currentColor" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(251,113,133,0.8)' }}>My heart</span>
              <span className="text-[8px]" style={{ color: 'rgba(251,113,133,0.4)' }}>Your love ❤️</span>
            </div>
          </div>
        </motion.div>

        {/* ── Greeting ── */}
        <motion.div
          className="rounded-[22px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,141,0.1) 0%, rgba(123,92,255,0.07) 100%)',
            backdropFilter: 'blur(44px) saturate(165%)',
            WebkitBackdropFilter: 'blur(44px) saturate(165%)',
            border: '1px solid rgba(255,77,141,0.22)',
            boxShadow: '0 8px 44px rgba(255,77,141,0.15), 0 4px 24px rgba(123,92,255,0.08), inset 0 1px 0 rgba(255,180,210,0.12)',
            animation: 'breathe-card 5s ease-in-out infinite',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <div className="h-[2.5px] w-full" style={{ background: 'linear-gradient(90deg, #FFB84D, #FF4D8D, #A78BFA, #FF4D8D, #FFB84D)', backgroundSize: '200% 100%', animation: 'gradient-x 5s linear infinite' }} />
          <div className="flex items-center gap-3.5 p-4">
            <LongPressNote note="I love you more than any word I know. You are my safest place. ❤️">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FF4D8D, #C9245F)',
                  boxShadow: '0 4px 24px rgba(255,77,141,0.5), 0 0 40px rgba(255,77,141,0.18)',
                }}>
                <Heart size={22} fill="white" className="text-white animate-heartbeat" />
              </div>
            </LongPressNote>
            <div>
              <h1 className="text-[17px] font-black leading-tight" style={{ color: 'rgba(255,235,240,0.95)' }}>
                {isReturningUser ? time.greeting : 'Hey my love, it\'s me'}{' '}
                <Heart size={15} className="inline ml-0.5 animate-heartbeat" style={{ color: '#FF7AA2' }} fill="currentColor" />
              </h1>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,200,210,0.5)' }}>
                {isReturningUser
                  ? `I miss you so much — ${totalAnswered} of 70 answered`
                  : 'From me, with all my love 🌹'}
              </p>
            </div>
          </div>
          {/* Emotional presence status */}
          <EmotionalStatus className="pb-3" />
        </motion.div>

        {/* ── Chapter Islands ── */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)', boxShadow: '0 0 12px rgba(251,191,36,0.2)' }}>
              <Sparkles size={11} className="text-amber-300" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,211,110,0.65)' }}>Chapters</span>
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

          {/* ── Mood Filter Chips ── */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {MOODS.map(mood => {
              const active = selectedMood === mood.key;
              return (
                <button
                  key={mood.key}
                  onClick={() => setSelectedMood(mood.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-[11px] font-bold transition-all"
                  style={{
                    background: active ? 'rgba(167,139,250,0.22)' : 'rgba(255,255,255,0.05)',
                    border: active ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: active ? 'rgba(210,200,255,0.95)' : 'rgba(255,255,255,0.35)',
                    boxShadow: active ? '0 2px 12px rgba(139,92,246,0.25)' : 'none',
                  }}>
                  <span style={{ fontSize: 12 }}>{mood.emoji}</span>
                  {mood.label}
                </button>
              );
            })}
          </div>

          {selectedMood !== 'all' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-center mb-3"
              style={{ color: 'rgba(167,139,250,0.35)' }}>
              {visibleGames.length} game{visibleGames.length !== 1 ? 's' : ''} match your mood
            </motion.p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {visibleGames.map((game, idx) => {
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
                    relative flex flex-col items-center gap-2 py-5 px-3 rounded-2xl text-center min-h-[100px]
                    transition-all cursor-pointer overflow-hidden
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

                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock size={9} className="text-white/50" />
                    </div>
                  )}
                  <div>{game.icon}</div>
                  <div>
                    <div className="text-[12px] font-bold text-white leading-tight">{game.label}</div>
                    <div className="text-[10px] text-white/70 mt-0.5">{game.sublabel}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {selectedMood === 'all' && (
            <p className="text-[10px] text-white/20 text-center mt-3 italic">
              Choose a mood above to find the perfect game for how you feel
            </p>
          )}
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
        w-full flex items-center gap-0 rounded-[20px] text-start transition-all overflow-hidden
        ${!unlocked && !progress.isComplete ? 'pointer-events-none' : ''}
      `}
      style={unlocked ? {
        background: progress.isComplete
          ? 'linear-gradient(135deg, rgba(255,77,141,0.09) 0%, rgba(123,92,255,0.06) 100%)'
          : 'rgba(255,255,255,0.065)',
        backdropFilter: 'blur(44px) saturate(160%)',
        WebkitBackdropFilter: 'blur(44px) saturate(160%)',
        border: progress.isComplete
          ? '1px solid rgba(255,77,141,0.25)'
          : '1px solid rgba(255,255,255,0.11)',
        boxShadow: progress.isComplete
          ? '0 6px 32px rgba(255,77,141,0.12), 0 2px 8px rgba(123,92,255,0.08), inset 0 1px 0 rgba(255,180,210,0.1)'
          : '0 6px 28px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.09)',
        cursor: 'pointer',
      } : {
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: 0.38,
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

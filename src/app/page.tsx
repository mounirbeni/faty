'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameScreen from '@/components/GameScreen';
import CompletionScreen from '@/components/CompletionScreen';
import HomeMapScreen from '@/components/HomeMapScreen';
import AnimatedBackground from '@/components/AnimatedBackground';
import TouchGlow from '@/components/TouchGlow';
import CinematicLoader from '@/components/CinematicLoader';
import { useGameStore } from '@/store/gameStore';
import { questionsData } from '@/data/questions';
import { initPresenceContext } from '@/lib/presenceContext';
import { startSession, trackScreen, sendSessionRecap } from '@/lib/sessionTracker';
import { notifyEntry, notifyBeacon } from '@/lib/notify';
import dynamic from 'next/dynamic';
import MidnightOverlay from '@/components/MidnightOverlay';

const MayVaultScreen          = dynamic(() => import('@/components/MayVaultScreen'), { ssr: false });
const DailyNoteScreen         = dynamic(() => import('@/components/DailyNoteScreen'), { ssr: false });
const MoodRingScreen          = dynamic(() => import('@/components/MoodRingScreen'), { ssr: false });
const ComfortScreen           = dynamic(() => import('@/components/ComfortScreen'), { ssr: false });
const LoveLetterScreen        = dynamic(() => import('@/components/LoveLetterScreen'), { ssr: false });
const WouldYouRatherScreen    = dynamic(() => import('@/components/WouldYouRatherScreen'), { ssr: false });
const KissJarScreen           = dynamic(() => import('@/components/KissJarScreen'), { ssr: false });
const ActivityDashboardScreen = dynamic(() => import('@/components/ActivityDashboardScreen'), { ssr: false });
const TruthBombsScreen        = dynamic(() => import('@/components/TruthBombsScreen'), { ssr: false });
const LoveStoryScreen         = dynamic(() => import('@/components/LoveStoryScreen'), { ssr: false });
const IntimacyHubScreen       = dynamic(() => import('@/components/IntimacyHubScreen'), { ssr: false });
const InsideHisHeartScreen    = dynamic(() => import('@/components/InsideHisHeartScreen'), { ssr: false });
const DesireDeckScreen        = dynamic(() => import('@/components/DesireDeckScreen'), { ssr: false });
const PillowTalkScreen        = dynamic(() => import('@/components/PillowTalkScreen'), { ssr: false });
const CoupleGoalsScreen       = dynamic(() => import('@/components/CoupleGoalsScreen'), { ssr: false });
const MomentIKnewScreen       = dynamic(() => import('@/components/MomentIKnewScreen'), { ssr: false });
const UntoldTruthsScreen      = dynamic(() => import('@/components/UntoldTruthsScreen'), { ssr: false });
const OurForeverScreen        = dynamic(() => import('@/components/OurForeverScreen'), { ssr: false });
const NightConfessionsScreen  = dynamic(() => import('@/components/NightConfessionsScreen'), { ssr: false });
const FirstTimesScreen        = dynamic(() => import('@/components/FirstTimesScreen'), { ssr: false });
const WordsIHoldScreen        = dynamic(() => import('@/components/WordsIHoldScreen'), { ssr: false });
const EmotionalDepthScreen    = dynamic(() => import('@/components/EmotionalDepthScreen'), { ssr: false });
const OurFirstsScreen         = dynamic(() => import('@/components/OurFirstsScreen'), { ssr: false });

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const { phase, answers, reversed, isReturningUser, currentMood } = useGameStore();
  const presenceReady = useRef(false);

  // ── Mount: start session + fetch presence + send entry notification ──────
  useEffect(() => {
    const seen = sessionStorage.getItem('lu_entered');
    if (seen) setLoaderDone(true);
    const t = setTimeout(() => setIsMounted(true), 0);

    startSession();

    const totalAnswered =
      Object.values(answers).filter(v => v?.trim()).length + reversed.length;
    const overallPercent = Math.round((totalAnswered / questionsData.length) * 100);

    initPresenceContext().then(ctx => {
      if (presenceReady.current) return;
      presenceReady.current = true;
      notifyEntry(ctx, overallPercent, isReturningUser);
    });

    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Track screen transitions for session intelligence ────────────────────
  useEffect(() => {
    if (!isMounted) return;
    trackScreen(phase);
  }, [phase, isMounted]);

  // ── beforeunload: send "Tonight's Story" recap ───────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      import('@/lib/presenceContext').then(({ getCachedPresence }) => {
        const ctx = getCachedPresence();
        if (!ctx) return;
        import('@/lib/sessionTracker').then(({ buildTonightStory }) => {
          const story = buildTonightStory(ctx);
          notifyBeacon(story);
        });
      });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleLoaderDone = useCallback(() => {
    sessionStorage.setItem('lu_entered', '1');
    setLoaderDone(true);
  }, []);

  const currentPhase    = isMounted ? phase    : 'welcome';
  const currentAnswers  = isMounted ? answers  : {};
  const currentReversed = isMounted ? reversed : [];

  const totalAnswered =
    Object.values(currentAnswers).filter(v => v?.trim()).length + currentReversed.length;
  const warmth = Math.min(1, totalAnswered / questionsData.length);

  return (
    <main className="flex-1 h-full w-full relative">
      {/* Cinematic entry loader (session-once) */}
      {!loaderDone && <CinematicLoader onDone={handleLoaderDone} />}

      {/* Living aurora background — mood + warmth reactive */}
      <AnimatedBackground warmth={warmth} mood={isMounted ? currentMood : null} />

      {/* Midnight emotional overlay — shows 12AM–4:59AM Morocco time, once per session */}
      <MidnightOverlay />

      {/* Touch glow trail */}
      <TouchGlow />

      {/* Screens */}
      <AnimatePresence mode="wait">
        {currentPhase === 'welcome'            && <Screen key="welcome"><WelcomeScreen /></Screen>}
        {currentPhase === 'home'               && <Screen key="home"><HomeMapScreen /></Screen>}
        {currentPhase === 'game'               && <Screen key="game"><GameScreen /></Screen>}
        {currentPhase === 'vault'              && <Screen key="vault"><MayVaultScreen /></Screen>}
        {currentPhase === 'daily-note'         && <Screen key="daily-note"><DailyNoteScreen /></Screen>}
        {currentPhase === 'mood-ring'          && <Screen key="mood-ring"><MoodRingScreen /></Screen>}
        {currentPhase === 'comfort-mode'       && <Screen key="comfort-mode"><ComfortScreen /></Screen>}
        {currentPhase === 'love-letter'        && <Screen key="love-letter"><LoveLetterScreen /></Screen>}
        {currentPhase === 'would-you-rather'   && <Screen key="would-you-rather"><WouldYouRatherScreen /></Screen>}
        {currentPhase === 'kiss-jar'           && <Screen key="kiss-jar"><KissJarScreen /></Screen>}
        {currentPhase === 'admin-dashboard'    && <Screen key="admin-dashboard"><ActivityDashboardScreen /></Screen>}
        {currentPhase === 'truth-bombs'        && <Screen key="truth-bombs"><TruthBombsScreen /></Screen>}
        {currentPhase === 'love-story'         && <Screen key="love-story"><LoveStoryScreen /></Screen>}
        {currentPhase === 'intimacy-hub'       && <Screen key="intimacy-hub"><IntimacyHubScreen /></Screen>}
        {currentPhase === 'inside-his-heart'   && <Screen key="inside-his-heart"><InsideHisHeartScreen /></Screen>}
        {currentPhase === 'desire-deck'        && <Screen key="desire-deck"><DesireDeckScreen /></Screen>}
        {currentPhase === 'pillow-talk'        && <Screen key="pillow-talk"><PillowTalkScreen /></Screen>}
        {currentPhase === 'couple-goals'       && <Screen key="couple-goals"><CoupleGoalsScreen /></Screen>}
        {currentPhase === 'moment-i-knew'      && <Screen key="moment-i-knew"><MomentIKnewScreen /></Screen>}
        {currentPhase === 'untold-truths'      && <Screen key="untold-truths"><UntoldTruthsScreen /></Screen>}
        {currentPhase === 'our-forever'        && <Screen key="our-forever"><OurForeverScreen /></Screen>}
        {currentPhase === 'night-confessions'  && <Screen key="night-confessions"><NightConfessionsScreen /></Screen>}
        {currentPhase === 'first-times'        && <Screen key="first-times"><FirstTimesScreen /></Screen>}
        {currentPhase === 'words-i-hold'       && <Screen key="words-i-hold"><WordsIHoldScreen /></Screen>}
        {currentPhase === 'emotional-depth'    && <Screen key="emotional-depth"><EmotionalDepthScreen /></Screen>}
        {currentPhase === 'our-firsts'         && <Screen key="our-firsts"><OurFirstsScreen /></Screen>}
        {currentPhase === 'complete'           && <Screen key="complete"><CompletionScreen /></Screen>}
      </AnimatePresence>
    </main>
  );
}

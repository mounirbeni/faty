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

const ActivityDashboardScreen = dynamic(() => import('@/components/ActivityDashboardScreen'), { ssr: false });
const OpenBookScreen           = dynamic(() => import('@/components/OpenBookScreen'),          { ssr: false });
const RateUsScreen             = dynamic(() => import('@/components/RateUsScreen'),            { ssr: false });
const FinishMyThoughtScreen    = dynamic(() => import('@/components/FinishMyThoughtScreen'),   { ssr: false });
const DailyThreeScreen         = dynamic(() => import('@/components/DailyThreeScreen'),        { ssr: false });
const FantasyBuilderScreen     = dynamic(() => import('@/components/FantasyBuilderScreen'),    { ssr: false });
const BoldConfessionsScreen    = dynamic(() => import('@/components/BoldConfessionsScreen'),   { ssr: false });

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

  useEffect(() => {
    if (!isMounted) return;
    trackScreen(phase);
  }, [phase, isMounted]);

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

  const currentPhase   = isMounted ? phase    : 'welcome';
  const currentAnswers = isMounted ? answers  : {};
  const currentReversed = isMounted ? reversed : [];

  const totalAnswered =
    Object.values(currentAnswers).filter(v => v?.trim()).length + currentReversed.length;
  const warmth = Math.min(1, totalAnswered / questionsData.length);

  return (
    <main className="flex-1 h-full w-full relative">
      {!loaderDone && <CinematicLoader onDone={handleLoaderDone} />}
      <AnimatedBackground warmth={warmth} mood={isMounted ? currentMood : null} />
      <MidnightOverlay />
      <TouchGlow />

      <AnimatePresence mode="wait">
        {currentPhase === 'welcome'           && <Screen key="welcome"><WelcomeScreen /></Screen>}
        {currentPhase === 'home'              && <Screen key="home"><HomeMapScreen /></Screen>}
        {currentPhase === 'game'              && <Screen key="game"><GameScreen /></Screen>}
        {currentPhase === 'open-book'         && <Screen key="open-book"><OpenBookScreen /></Screen>}
        {currentPhase === 'rate-us'           && <Screen key="rate-us"><RateUsScreen /></Screen>}
        {currentPhase === 'finish-my-thought' && <Screen key="finish-my-thought"><FinishMyThoughtScreen /></Screen>}
        {currentPhase === 'daily-three'       && <Screen key="daily-three"><DailyThreeScreen /></Screen>}
        {currentPhase === 'fantasy-builder'   && <Screen key="fantasy-builder"><FantasyBuilderScreen /></Screen>}
        {currentPhase === 'bold-confessions'  && <Screen key="bold-confessions"><BoldConfessionsScreen /></Screen>}
        {currentPhase === 'admin-dashboard'   && <Screen key="admin-dashboard"><ActivityDashboardScreen /></Screen>}
        {currentPhase === 'complete'          && <Screen key="complete"><CompletionScreen /></Screen>}
      </AnimatePresence>
    </main>
  );
}

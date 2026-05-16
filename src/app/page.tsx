'use client';

import { useState, useEffect, useCallback } from 'react';
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
import dynamic from 'next/dynamic';

const VibeCheckScreen       = dynamic(() => import('@/components/VibeCheckScreen'), { ssr: false });
const RapidFireScreen       = dynamic(() => import('@/components/RapidFireScreen'), { ssr: false });
const MayVaultScreen        = dynamic(() => import('@/components/MayVaultScreen'), { ssr: false });
const FortuneTellerScreen   = dynamic(() => import('@/components/FortuneTellerScreen'), { ssr: false });
const HeartSyncScreen       = dynamic(() => import('@/components/HeartSyncScreen'), { ssr: false });
const DailyNoteScreen       = dynamic(() => import('@/components/DailyNoteScreen'), { ssr: false });
const PerfectMatchScreen    = dynamic(() => import('@/components/PerfectMatchScreen'), { ssr: false });
const MoodRingScreen        = dynamic(() => import('@/components/MoodRingScreen'), { ssr: false });
const ComfortScreen         = dynamic(() => import('@/components/ComfortScreen'), { ssr: false });
const LoveLetterScreen      = dynamic(() => import('@/components/LoveLetterScreen'), { ssr: false });
const DateSpinnerScreen     = dynamic(() => import('@/components/DateSpinnerScreen'), { ssr: false });
const WouldYouRatherScreen  = dynamic(() => import('@/components/WouldYouRatherScreen'), { ssr: false });
const KissJarScreen         = dynamic(() => import('@/components/KissJarScreen'), { ssr: false });
const ActivityDashboardScreen = dynamic(() => import('@/components/ActivityDashboardScreen'), { ssr: false });

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
  const { phase, answers, reversed } = useGameStore();

  useEffect(() => {
    // Show loader only on first session visit
    const seen = sessionStorage.getItem('lu_entered');
    if (seen) setLoaderDone(true);
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
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
      {/* Cinematic entry loader (session-once) */}
      {!loaderDone && <CinematicLoader onDone={handleLoaderDone} />}

      {/* Living aurora background */}
      <AnimatedBackground warmth={warmth} />

      {/* Touch glow trail */}
      <TouchGlow />

      {/* Screens */}
      <AnimatePresence mode="wait">
        {currentPhase === 'welcome'          && <Screen key="welcome"><WelcomeScreen /></Screen>}
        {currentPhase === 'home'             && <Screen key="home"><HomeMapScreen /></Screen>}
        {currentPhase === 'game'             && <Screen key="game"><GameScreen /></Screen>}
        {currentPhase === 'vibe-check'       && <Screen key="vibe-check"><VibeCheckScreen /></Screen>}
        {currentPhase === 'rapid-fire'       && <Screen key="rapid-fire"><RapidFireScreen /></Screen>}
        {currentPhase === 'vault'            && <Screen key="vault"><MayVaultScreen /></Screen>}
        {currentPhase === 'fortune-teller'   && <Screen key="fortune-teller"><FortuneTellerScreen /></Screen>}
        {currentPhase === 'heart-sync'       && <Screen key="heart-sync"><HeartSyncScreen /></Screen>}
        {currentPhase === 'daily-note'       && <Screen key="daily-note"><DailyNoteScreen /></Screen>}
        {currentPhase === 'perfect-match'    && <Screen key="perfect-match"><PerfectMatchScreen /></Screen>}
        {currentPhase === 'mood-ring'        && <Screen key="mood-ring"><MoodRingScreen /></Screen>}
        {currentPhase === 'comfort-mode'     && <Screen key="comfort-mode"><ComfortScreen /></Screen>}
        {currentPhase === 'love-letter'      && <Screen key="love-letter"><LoveLetterScreen /></Screen>}
        {currentPhase === 'date-spinner'     && <Screen key="date-spinner"><DateSpinnerScreen /></Screen>}
        {currentPhase === 'would-you-rather' && <Screen key="would-you-rather"><WouldYouRatherScreen /></Screen>}
        {currentPhase === 'kiss-jar'         && <Screen key="kiss-jar"><KissJarScreen /></Screen>}
        {currentPhase === 'admin-dashboard'  && <Screen key="admin-dashboard"><ActivityDashboardScreen /></Screen>}
        {currentPhase === 'complete'         && <Screen key="complete"><CompletionScreen /></Screen>}
      </AnimatePresence>
    </main>
  );
}

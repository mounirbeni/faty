'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameScreen from '@/components/GameScreen';
import CompletionScreen from '@/components/CompletionScreen';
import HomeMapScreen from '@/components/HomeMapScreen';
import dynamic from 'next/dynamic';

const VibeCheckScreen = dynamic(() => import('@/components/VibeCheckScreen'), { ssr: false });
const RapidFireScreen = dynamic(() => import('@/components/RapidFireScreen'), { ssr: false });
const MayVaultScreen = dynamic(() => import('@/components/MayVaultScreen'), { ssr: false });
const FortuneTellerScreen = dynamic(() => import('@/components/FortuneTellerScreen'), { ssr: false });
const HeartSyncScreen = dynamic(() => import('@/components/HeartSyncScreen'), { ssr: false });
const DailyNoteScreen = dynamic(() => import('@/components/DailyNoteScreen'), { ssr: false });
const PerfectMatchScreen = dynamic(() => import('@/components/PerfectMatchScreen'), { ssr: false });
const MoodRingScreen = dynamic(() => import('@/components/MoodRingScreen'), { ssr: false });
const ComfortScreen = dynamic(() => import('@/components/ComfortScreen'), { ssr: false });
import AnimatedBackground from '@/components/AnimatedBackground';
import { useGameStore } from '@/store/gameStore';
import { questionsData } from '@/data/questions';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const { phase, answers, reversed } = useGameStore();

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Use initial states for SSR/Hydration to guarantee exact match, then switch to persisted state
  const currentPhase = isMounted ? phase : 'welcome';
  const currentAnswers = isMounted ? answers : {};
  const currentReversed = isMounted ? reversed : [];

  // Compute warmth: 0 at start, 1 at end (based on overall answers)
  const totalAnswered =
    Object.values(currentAnswers).filter((v) => v?.trim()).length + currentReversed.length;
  const warmth = Math.min(1, totalAnswered / questionsData.length);

  return (
    <main className="flex-1 h-full w-full relative">
      <AnimatedBackground warmth={warmth} />
      <AnimatePresence mode="wait">
        {currentPhase === 'welcome' && <WelcomeScreen key="welcome" />}
        {currentPhase === 'home' && <HomeMapScreen key="home" />}
        {currentPhase === 'game' && <GameScreen key="game" />}
        {currentPhase === 'vibe-check' && <VibeCheckScreen key="vibe-check" />}
        {currentPhase === 'rapid-fire' && <RapidFireScreen key="rapid-fire" />}
        {currentPhase === 'vault' && <MayVaultScreen key="vault" />}
        {currentPhase === 'fortune-teller' && <FortuneTellerScreen key="fortune-teller" />}
        {currentPhase === 'heart-sync' && <HeartSyncScreen key="heart-sync" />}
        {currentPhase === 'daily-note' && <DailyNoteScreen key="daily-note" />}
        {currentPhase === 'perfect-match' && <PerfectMatchScreen key="perfect-match" />}
        {currentPhase === 'mood-ring' && <MoodRingScreen key="mood-ring" />}
        {currentPhase === 'comfort-mode' && <ComfortScreen key="comfort-mode" />}
        {currentPhase === 'complete' && <CompletionScreen key="complete" />}
      </AnimatePresence>
    </main>
  );
}

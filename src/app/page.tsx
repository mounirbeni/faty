'use client';

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
import AnimatedBackground from '@/components/AnimatedBackground';
import { useGameStore } from '@/store/gameStore';
import { questionsData } from '@/data/questions';

export default function HomePage() {
  const { phase, answers, reversed } = useGameStore();

  // Compute warmth: 0 at start, 1 at end (based on overall answers)
  const totalAnswered =
    Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
  const warmth = Math.min(1, totalAnswered / questionsData.length);

  return (
    <main className="flex-1 h-full w-full relative">
      <AnimatedBackground warmth={warmth} />
      <AnimatePresence mode="wait">
        {phase === 'welcome' && <WelcomeScreen key="welcome" />}
        {phase === 'home' && <HomeMapScreen key="home" />}
        {phase === 'game' && <GameScreen key="game" />}
        {phase === 'vibe-check' && <VibeCheckScreen key="vibe-check" />}
        {phase === 'rapid-fire' && <RapidFireScreen key="rapid-fire" />}
        {phase === 'vault' && <MayVaultScreen key="vault" />}
        {phase === 'fortune-teller' && <FortuneTellerScreen key="fortune-teller" />}
        {phase === 'heart-sync' && <HeartSyncScreen key="heart-sync" />}
        {phase === 'daily-note' && <DailyNoteScreen key="daily-note" />}
        {phase === 'perfect-match' && <PerfectMatchScreen key="perfect-match" />}
        {phase === 'mood-ring' && <MoodRingScreen key="mood-ring" />}
        {phase === 'complete' && <CompletionScreen key="complete" />}
      </AnimatePresence>
    </main>
  );
}

'use client';

import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameScreen from '@/components/GameScreen';
import CompletionScreen from '@/components/CompletionScreen';
import HomeMapScreen from '@/components/HomeMapScreen';
import VibeCheckScreen from '@/components/VibeCheckScreen';
import RapidFireScreen from '@/components/RapidFireScreen';
import MayVaultScreen from '@/components/MayVaultScreen';
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
        {phase === 'complete' && <CompletionScreen key="complete" />}
      </AnimatePresence>
    </main>
  );
}

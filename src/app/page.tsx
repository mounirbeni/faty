"use client";

import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameScreen from "@/components/GameScreen";
import CompletionScreen from "@/components/CompletionScreen";
import { useGameStore } from "@/store/gameStore";

export default function HomePage() {
  const phase = useGameStore((state) => state.phase);

  return (
    <main className="flex-1 h-full w-full relative">
      <AnimatePresence mode="wait">
        {phase === "welcome" && <WelcomeScreen key="welcome" />}
        {phase === "game" && <GameScreen key="game" />}
        {phase === "complete" && <CompletionScreen key="complete" />}
      </AnimatePresence>
    </main>
  );
}

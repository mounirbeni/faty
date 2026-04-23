"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameScreen from "@/components/GameScreen";
import CompletionScreen from "@/components/CompletionScreen";
import type { Answer } from "@/lib/questions";

type AppPhase = "welcome" | "game" | "complete";

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleStart = useCallback(() => setPhase("game"), []);

  const handleComplete = useCallback((submittedAnswers: Answer[]) => {
    setAnswers(submittedAnswers);
    setPhase("complete");
  }, []);

  return (
    <main className="flex-1">
      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}
        {phase === "game" && (
          <GameScreen key="game" onComplete={handleComplete} />
        )}
        {phase === "complete" && (
          <CompletionScreen key="complete" answers={answers} />
        )}
      </AnimatePresence>
    </main>
  );
}

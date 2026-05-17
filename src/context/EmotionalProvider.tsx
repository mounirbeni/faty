'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTimeContext } from '@/lib/timeSystem';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';
import { getPresenceIntensity } from '@/lib/sessionTracker';
import { playNightSwell } from '@/lib/sounds';

export default function EmotionalProvider({ children }: { children: React.ReactNode }) {
  const phase = useGameStore((s) => s.phase);
  const currentMood = useGameStore((s) => s.currentMood);
  const kissCount = useGameStore((s) => s.kissCount);
  const time = useTimeContext();

  const {
    comfortActive,
    setWeatherFromMood,
    computePresence,
    setPresence,
    tickSession,
    getMidnightMessage,
    recordInteraction,
  } = useEmotionalEngine();

  const midnightPlayed = useRef(false);
  const prevKiss = useRef(kissCount);

  // Sync mood → weather
  useEffect(() => {
    setWeatherFromMood(currentMood);
  }, [currentMood, setWeatherFromMood]);

  // Kisses evolve stars (only on new kisses)
  useEffect(() => {
    if (kissCount > prevKiss.current) {
      for (let i = 0; i < kissCount - prevKiss.current; i++) recordInteraction('kiss');
      prevKiss.current = kissCount;
    }
  }, [kissCount, recordInteraction]);

  // Presence from phase + session
  useEffect(() => {
    const isMidnight = time.period === 'midnight';
    const intensity = getPresenceIntensity();
    const presence = computePresence({
      phase,
      isMidnight,
      sessionIntensity: intensity,
      comfortActive,
    });
    setPresence(presence);
  }, [phase, time.period, comfortActive, computePresence, setPresence]);

  // Session tick every minute
  useEffect(() => {
    const id = setInterval(() => tickSession(), 60_000);
    return () => clearInterval(id);
  }, [tickSession]);

  // Midnight ambient swell once per session
  useEffect(() => {
    if (time.period === 'midnight' && !midnightPlayed.current) {
      midnightPlayed.current = true;
      const t = setTimeout(() => playNightSwell(), 1200);
      return () => clearTimeout(t);
    }
    if (time.period !== 'midnight') midnightPlayed.current = false;
  }, [time.period]);

  // Expose midnight message on document for overlays
  useEffect(() => {
    const msg = getMidnightMessage();
    if (msg) document.documentElement.dataset.midnightMsg = msg;
    else delete document.documentElement.dataset.midnightMsg;
  }, [time.period, getMidnightMessage]);

  return <>{children}</>;
}

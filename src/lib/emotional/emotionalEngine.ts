/**
 * Emotional Universe Engine
 * Central state: weather, presence, comfort, evolution, intelligence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getTimeContext, type TimePeriod } from '@/lib/timeSystem';
import { MIDNIGHT_WHISPERS } from './whispers';

export type EmotionalWeather =
  | 'clear'
  | 'rain'
  | 'fog'
  | 'aurora'
  | 'warm'
  | 'bright'
  | 'longing';

export type PresenceState =
  | 'thinking about you…'
  | 'missing you softly 💗'
  | 'replaying memories tonight'
  | 'listening to your voice'
  | 'awake late tonight 🌙'
  | 'emotionally connected'
  | 'quietly staying here'
  | 'feeling close to you';

export interface EvolutionState {
  stars: number;
  auroraIntensity: number;
  galaxies: number;
  memoriesOpened: number;
  totalInteractions: number;
}

const DEFAULT_EVOLUTION: EvolutionState = {
  stars: 12,
  auroraIntensity: 0.45,
  galaxies: 1,
  memoriesOpened: 0,
  totalInteractions: 0,
};

const MOOD_TO_WEATHER: Record<string, EmotionalWeather> = {
  sad: 'rain',
  melancholy: 'rain',
  lonely: 'fog',
  longing: 'longing',
  miss: 'longing',
  happy: 'bright',
  joyful: 'bright',
  love: 'warm',
  calm: 'warm',
  comfort: 'warm',
  excited: 'bright',
  deep: 'aurora',
  thoughtful: 'aurora',
};

interface EmotionalEngineState {
  weather: EmotionalWeather;
  comfortActive: boolean;
  presence: PresenceState;
  evolution: EvolutionState;
  secretsFound: string[];
  comfortVisitCount: number;
  memoryRevisitCount: number;
  lastActivityAt: number;
  sessionMinutes: number;

  setWeather: (w: EmotionalWeather) => void;
  setWeatherFromMood: (mood: string | null) => void;
  setPresence: (p: PresenceState) => void;
  enterComfort: () => void;
  exitComfort: () => void;
  recordInteraction: (kind: 'memory' | 'kiss' | 'chapter' | 'comfort' | 'secret' | 'heart') => void;
  discoverSecret: (id: string) => void;
  tickSession: () => void;
  computePresence: (opts: {
    phase: string;
    isMidnight: boolean;
    sessionIntensity?: string;
    comfortActive: boolean;
  }) => PresenceState;
  getMidnightMessage: () => string | null;
  getAnimationSpeed: () => number;
}

export const useEmotionalEngine = create<EmotionalEngineState>()(
  persist(
    (set, get) => ({
      weather: 'clear',
      comfortActive: false,
      presence: 'thinking about you…',
      evolution: { ...DEFAULT_EVOLUTION },
      secretsFound: [],
      comfortVisitCount: 0,
      memoryRevisitCount: 0,
      lastActivityAt: Date.now(),
      sessionMinutes: 0,

      setWeather: (weather) => set({ weather, lastActivityAt: Date.now() }),

      setWeatherFromMood: (mood) => {
        if (!mood) return;
        const key = mood.toLowerCase();
        for (const [word, weather] of Object.entries(MOOD_TO_WEATHER)) {
          if (key.includes(word)) {
            set({ weather, lastActivityAt: Date.now() });
            return;
          }
        }
      },

      setPresence: (presence) => set({ presence }),

      enterComfort: () =>
        set((s) => ({
          comfortActive: true,
          weather: 'warm',
          comfortVisitCount: s.comfortVisitCount + 1,
          lastActivityAt: Date.now(),
          presence: 'feeling close to you',
        })),

      exitComfort: () => set({ comfortActive: false }),

      recordInteraction: (kind) =>
        set((s) => {
          const ev = { ...s.evolution, totalInteractions: s.evolution.totalInteractions + 1 };
          if (kind === 'memory') ev.memoriesOpened += 1;
          if (kind === 'kiss') ev.stars = Math.min(120, ev.stars + 1);
          if (kind === 'chapter') {
            ev.auroraIntensity = Math.min(1, ev.auroraIntensity + 0.04);
            ev.galaxies = Math.min(8, ev.galaxies + (ev.totalInteractions % 15 === 0 ? 1 : 0));
          }
          if (kind === 'secret') ev.stars = Math.min(120, ev.stars + 2);
          if (kind === 'heart') ev.auroraIntensity = Math.min(1, ev.auroraIntensity + 0.01);
          if (kind === 'comfort') ev.auroraIntensity = Math.min(1, ev.auroraIntensity + 0.02);
          if (kind === 'memory') s.memoryRevisitCount += 1;
          return { evolution: ev, lastActivityAt: Date.now() };
        }),

      discoverSecret: (id) =>
        set((s) => {
          if (s.secretsFound.includes(id)) return s;
          return {
            secretsFound: [...s.secretsFound, id],
            lastActivityAt: Date.now(),
          };
        }),

      tickSession: () =>
        set((s) => ({
          sessionMinutes: s.sessionMinutes + 1,
          lastActivityAt: Date.now(),
        })),

      computePresence: ({ phase, isMidnight, sessionIntensity, comfortActive }) => {
        if (comfortActive || phase === 'comfort-mode' || phase === 'safe-place') {
          return 'feeling close to you';
        }
        if (isMidnight) return 'awake late tonight 🌙';
        if (phase === 'vault' || phase === 'love-story' || phase === 'love-letter') {
          return 'replaying memories tonight';
        }
        if (phase === 'daily-note' || phase === 'heart-sync') {
          return 'listening to your voice';
        }
        if (sessionIntensity === 'deeply immersed tonight' || sessionIntensity === 'emotionally connected') {
          return 'emotionally connected';
        }
        if (sessionIntensity === 'staying softly') return 'quietly staying here';
        return 'missing you softly 💗';
      },

      getMidnightMessage: () => {
        const { period } = getTimeContext();
        if (period !== 'midnight') return null;
        const h = new Date().getHours();
        return MIDNIGHT_WHISPERS[h % MIDNIGHT_WHISPERS.length];
      },

      getAnimationSpeed: () => {
        const { period } = getTimeContext();
        const { comfortActive } = get();
        if (comfortActive) return 0.65;
        if (period === 'midnight') return 0.55;
        if (period === 'night') return 0.75;
        return 1;
      },
    }),
    {
      name: 'faty-emotional-universe',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        weather: s.weather,
        evolution: s.evolution,
        secretsFound: s.secretsFound,
        comfortVisitCount: s.comfortVisitCount,
        memoryRevisitCount: s.memoryRevisitCount,
      }),
    }
  )
);

export function weatherModifiers(weather: EmotionalWeather, period: TimePeriod) {
  const isNight = period === 'midnight' || period === 'night';
  switch (weather) {
    case 'rain':
      return { rain: true, fog: false, starBoost: 0.7, warmth: 0.1 };
    case 'fog':
    case 'longing':
      return { rain: false, fog: true, starBoost: 0.85, warmth: 0.05 };
    case 'bright':
      return { rain: false, fog: false, starBoost: 1.35, warmth: 0.2 };
    case 'warm':
      return { rain: false, fog: false, starBoost: 1, warmth: 0.35 };
    case 'aurora':
      return { rain: false, fog: false, starBoost: 1.1, warmth: 0.15, auroraBoost: 1.4 };
    default:
      return { rain: false, fog: false, starBoost: isNight ? 1.2 : 1, warmth: 0 };
  }
}

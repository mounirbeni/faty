import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HeatLevel, PlayMode } from '@/data/together';

export type Seat = 'p1' | 'p2';

interface TogetherState {
  /** her name / his name — whoever holds the phone first is p1 */
  p1: string;
  p2: string;
  heat: HeatLevel;
  mode: PlayMode;
  /** whose turn it is right now, shared across every together game */
  turn: Seat;
  scores: Record<Seat, number>;
  rounds: number;
  /** cards already drawn this session, per game */
  seen: Record<string, number[]>;

  setNames: (p1: string, p2: string) => void;
  setHeat: (heat: HeatLevel) => void;
  setMode: (mode: PlayMode) => void;
  swapTurn: () => void;
  setTurn: (turn: Seat) => void;
  score: (seat: Seat, points?: number) => void;
  countRound: () => void;
  markSeen: (game: string, id: number) => void;
  clearSeen: (game: string) => void;
  resetNight: () => void;
}

const EMPTY_SCORES: Record<Seat, number> = { p1: 0, p2: 0 };

export const useTogetherStore = create<TogetherState>()(
  persist(
    (set) => ({
      p1: 'Angel',
      p2: 'Habibi',
      heat: 2,
      mode: 'apart',
      turn: 'p1',
      scores: { ...EMPTY_SCORES },
      rounds: 0,
      seen: {},

      setNames: (p1, p2) =>
        set({ p1: p1.trim().slice(0, 14) || 'Angel', p2: p2.trim().slice(0, 14) || 'Habibi' }),

      setHeat: (heat) => set({ heat }),
      setMode: (mode) => set({ mode }),

      swapTurn: () => set((s) => ({ turn: s.turn === 'p1' ? 'p2' : 'p1' })),
      setTurn: (turn) => set({ turn }),

      score: (seat, points = 1) =>
        set((s) => ({ scores: { ...s.scores, [seat]: s.scores[seat] + points } })),

      countRound: () => set((s) => ({ rounds: s.rounds + 1 })),

      markSeen: (game, id) =>
        set((s) => ({ seen: { ...s.seen, [game]: [...(s.seen[game] ?? []), id] } })),

      clearSeen: (game) =>
        set((s) => ({ seen: { ...s.seen, [game]: [] } })),

      resetNight: () =>
        set({ turn: 'p1', scores: { ...EMPTY_SCORES }, rounds: 0, seen: {} }),
    }),
    {
      name: 'faty-together-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        p1: s.p1, p2: s.p2, heat: s.heat, mode: s.mode,
        turn: s.turn, scores: s.scores, rounds: s.rounds,
      }),
    }
  )
);

/** Name for a seat, without pulling the whole store into a component. */
export function seatName(state: { p1: string; p2: string }, seat: Seat): string {
  return seat === 'p1' ? state.p1 : state.p2;
}

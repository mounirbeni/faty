import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { questionsData } from '@/data/questions';

export type AppPhase =
  | 'welcome'
  | 'home'
  | 'game'
  | 'vibe-check'
  | 'rapid-fire'
  | 'vault'
  | 'complete';

interface GameState {
  phase: AppPhase;
  currentIndex: number;
  answers: Record<number, string>;
  reversed: number[]; // was Set<number> — arrays are JSON-safe for persist
  reverseCardsLeft: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  isReturningUser: boolean;
  vibeChoices: Record<number, 'love' | 'nope'>;
  rapidFireChoices: Record<number, string>;

  // Actions
  setIsSubmitting: (val: boolean) => void;
  setIsSuccess: (val: boolean) => void;
  setPhase: (phase: AppPhase) => void;
  setAnswer: (questionId: number, value: string) => void;
  goNext: () => void;
  goPrev: () => void;
  playReverseCard: (questionId: number) => void;
  undoReverse: (questionId: number) => void;
  resetGame: () => void;
  startChapter: (chapter: number) => void;
  setVibeChoice: (id: number, choice: 'love' | 'nope') => void;
  setRapidFireChoice: (id: number, choice: string) => void;
}

const MAX_REVERSE_CARDS = 3;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'welcome',
      currentIndex: 0,
      answers: {},
      reversed: [],
      reverseCardsLeft: MAX_REVERSE_CARDS,
      isSubmitting: false,
      isSuccess: false,
      isReturningUser: false,
      vibeChoices: {},
      rapidFireChoices: {},

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setIsSuccess: (isSuccess) => set({ isSuccess }),

      setPhase: (phase) => {
        const { isReturningUser } = get();
        set({
          phase,
          isReturningUser: isReturningUser || phase === 'home',
        });
      },

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      goNext: () => {
        const { currentIndex, answers, reversed } = get();
        const currentQ = questionsData[currentIndex];
        const hasAnswer =
          (answers[currentQ.id] && answers[currentQ.id].trim().length > 0) ||
          reversed.includes(currentQ.id);
        if (!hasAnswer) return;

        if (currentIndex === questionsData.length - 1) {
          set({ phase: 'complete' });
        } else {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      goPrev: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
      },

      playReverseCard: (questionId) => {
        const { reverseCardsLeft, reversed } = get();
        if (reverseCardsLeft > 0 && !reversed.includes(questionId)) {
          set({
            reversed: [...reversed, questionId],
            reverseCardsLeft: reverseCardsLeft - 1,
          });
        }
      },

      undoReverse: (questionId) => {
        const { reverseCardsLeft, reversed } = get();
        if (reversed.includes(questionId)) {
          set({
            reversed: reversed.filter((id) => id !== questionId),
            reverseCardsLeft: reverseCardsLeft + 1,
          });
        }
      },

      startChapter: (chapter) => {
        const { answers, reversed } = get();
        const chapterQs = questionsData.filter((q) => q.category === chapter);
        const firstUnanswered = chapterQs.find(
          (q) => !answers[q.id]?.trim() && !reversed.includes(q.id)
        );
        const startQ = firstUnanswered ?? chapterQs[0];
        const startIdx = questionsData.findIndex((q) => q.id === startQ.id);
        set({ currentIndex: startIdx >= 0 ? startIdx : 0, phase: 'game' });
      },

      setVibeChoice: (id, choice) =>
        set((state) => ({ vibeChoices: { ...state.vibeChoices, [id]: choice } })),

      setRapidFireChoice: (id, choice) =>
        set((state) => ({
          rapidFireChoices: { ...state.rapidFireChoices, [id]: choice },
        })),

      resetGame: () =>
        set({
          phase: 'welcome',
          currentIndex: 0,
          answers: {},
          reversed: [],
          reverseCardsLeft: MAX_REVERSE_CARDS,
          isSubmitting: false,
          isSuccess: false,
          isReturningUser: false,
          vibeChoices: {},
          rapidFireChoices: {},
        }),
    }),
    {
      name: 'faty-game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        currentIndex: state.currentIndex,
        answers: state.answers,
        reversed: state.reversed,
        reverseCardsLeft: state.reverseCardsLeft,
        isSuccess: state.isSuccess,
        isReturningUser: state.isReturningUser,
        vibeChoices: state.vibeChoices,
        rapidFireChoices: state.rapidFireChoices,
      }),
    }
  )
);

// ─── Pure utility selectors (no hooks) ───────────────────────────────

export function getChapterProgress(
  answers: Record<number, string>,
  reversed: number[],
  chapter: number
): { answered: number; total: number; percent: number; isComplete: boolean } {
  const qs = questionsData.filter((q) => q.category === chapter);
  const answered = qs.filter(
    (q) => (answers[q.id]?.trim().length ?? 0) > 0 || reversed.includes(q.id)
  ).length;
  const total = qs.length;
  return { answered, total, percent: total > 0 ? answered / total : 0, isComplete: answered === total };
}

export function isChapterUnlocked(
  chapter: number,
  answers: Record<number, string>,
  reversed: number[]
): boolean {
  if (chapter === 1) return true;
  return getChapterProgress(answers, reversed, chapter - 1).isComplete;
}

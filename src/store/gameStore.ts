import { create } from 'zustand';
import { questionsData } from '@/data/questions';

type AppPhase = 'welcome' | 'game' | 'complete';

interface GameState {
  phase: AppPhase;
  currentIndex: number;
  answers: Record<number, string>;
  reversed: Set<number>;
  reverseCardsLeft: number;
  
  // Actions
  setPhase: (phase: AppPhase) => void;
  setAnswer: (questionId: number, value: string) => void;
  goNext: () => void;
  goPrev: () => void;
  playReverseCard: (questionId: number) => void;
  undoReverse: (questionId: number) => void;
  resetGame: () => void;
}

const MAX_REVERSE_CARDS = 3;

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'welcome',
  currentIndex: 0,
  answers: {},
  reversed: new Set(),
  reverseCardsLeft: MAX_REVERSE_CARDS,

  setPhase: (phase) => set({ phase }),

  setAnswer: (questionId, value) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: value }
    })),

  goNext: () => {
    const { currentIndex, answers, reversed } = get();
    const currentQ = questionsData[currentIndex];
    
    // Validate answer exists
    const hasAnswer = (answers[currentQ.id] && answers[currentQ.id].trim().length > 0) || reversed.has(currentQ.id);
    if (!hasAnswer) return;

    if (currentIndex === questionsData.length - 1) {
      set({ phase: 'complete' });
    } else {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  goPrev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  playReverseCard: (questionId) => {
    const { reverseCardsLeft, reversed } = get();
    if (reverseCardsLeft > 0 && !reversed.has(questionId)) {
      const newReversed = new Set(reversed);
      newReversed.add(questionId);
      set({ 
        reversed: newReversed, 
        reverseCardsLeft: reverseCardsLeft - 1 
      });
    }
  },

  undoReverse: (questionId) => {
    const { reverseCardsLeft, reversed } = get();
    if (reversed.has(questionId)) {
      const newReversed = new Set(reversed);
      newReversed.delete(questionId);
      set({ 
        reversed: newReversed, 
        reverseCardsLeft: reverseCardsLeft + 1 
      });
    }
  },

  resetGame: () => set({
    phase: 'welcome',
    currentIndex: 0,
    answers: {},
    reversed: new Set(),
    reverseCardsLeft: MAX_REVERSE_CARDS,
  })
}));

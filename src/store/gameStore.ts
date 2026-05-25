import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { questionsData } from '@/data/questions';

export type AppPhase =
  | 'welcome'
  | 'home'
  | 'game'
  | 'vibe-check'
  | 'rapid-fire'
  | 'fortune-teller'
  | 'heart-sync'
  | 'daily-note'
  | 'perfect-match'
  | 'mood-ring'
  | 'vault'
  | 'comfort-mode'
  | 'love-letter'
  | 'date-spinner'
  | 'would-you-rather'
  | 'kiss-jar'
  | 'truth-bombs'
  | 'catch-my-heart'
  | 'dream-date'
  | 'love-story'
  | 'intimacy-hub'
  | 'inside-his-heart'
  | 'admin-dashboard'
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
  fortuneResult: string | null;
  heartSyncComplete: boolean;
  
  // Activity Log (admin dashboard)
  activityLog: { type: string; label: string; ts: number }[];
  kissCount: number;

  // Dynamic Content (Smart Rotation)
  dailyWhisperId: number | null;
  dailyWhisperHistory: number[];
  dailyWhisperLastTimestamp: number;
  dailyWhisperIsVoiceNote: boolean;
  fortuneHistory: number[];
  currentMood: string | null;

  // Actions
  logActivity: (type: string, label: string) => void;
  addKiss: (count?: number) => void;
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
  setFortuneResult: (fortune: string) => void;
  setHeartSyncComplete: () => void;
  generateDailyWhisper: (totalMessages: number, intervalMinutes: number) => void;
  generateFortune: (totalFortunes: number) => void;
  setCurrentMood: (mood: string) => void;
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
      fortuneResult: null,
      heartSyncComplete: false,
      activityLog: [],
      kissCount: 0,
      dailyWhisperId: null,
      dailyWhisperHistory: [],
      dailyWhisperLastTimestamp: 0,
      dailyWhisperIsVoiceNote: false,
      fortuneHistory: [],
      currentMood: null,

      logActivity: (type, label) =>
        set((state) => ({
          activityLog: [
            { type, label, ts: Date.now() },
            ...state.activityLog,
          ].slice(0, 100), // keep last 100 events
        })),

      addKiss: (count = 1) =>
        set((state) => ({ kissCount: state.kissCount + count })),

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setIsSuccess: (isSuccess) => set({ isSuccess }),

      setPhase: (phase) => {
        const { isReturningUser, logActivity } = get();
        // Log mini-game opens
        const miniGameLabels: Partial<Record<AppPhase, string>> = {
          'vibe-check': 'Opened Vibe Check',
          'rapid-fire': 'Opened Rapid Fire',
          'fortune-teller': 'Opened Fortune Teller',
          'heart-sync': 'Opened Heart Sync',
          'daily-note': 'Opened Daily Whisper',
          'perfect-match': 'Opened Perfect Match',
          'mood-ring': 'Opened Mood Ring',
          'comfort-mode': 'Opened Comfort Room',
          'love-letter': 'Opened Love Letters',
          'date-spinner': 'Opened Date Spinner',
          'would-you-rather': 'Opened Would You Rather',
          'kiss-jar': 'Opened Kiss Jar',
          'vault': 'Opened Memory Vault',
          'truth-bombs': 'Opened Truth Bombs',
          'catch-my-heart': 'Opened Catch My Heart',
          'dream-date': 'Opened Dream Date',
          'love-story': 'Opened Love Story',
          'intimacy-hub': 'Opened Emotional Intimacy',
        };
        if (miniGameLabels[phase]) {
          logActivity('mini-game', miniGameLabels[phase]!);
        }
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
        const { currentIndex, answers, reversed, logActivity } = get();
        const currentQ = questionsData[currentIndex];
        const hasAnswer =
          (answers[currentQ.id] && answers[currentQ.id].trim().length > 0) ||
          reversed.includes(currentQ.id);
        if (!hasAnswer) return;

        // Log every 5th answer as a milestone
        const answeredCount = Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
        if ((answeredCount + 1) % 5 === 0) {
          logActivity('milestone', `Answered ${answeredCount + 1} questions`);
        }

        if (currentIndex === questionsData.length - 1) {
          logActivity('milestone', 'Completed all questions!');
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

      setFortuneResult: (fortune) => set({ fortuneResult: fortune }),

      setHeartSyncComplete: () => set({ heartSyncComplete: true }),

      generateDailyWhisper: (totalMessages: number, intervalMinutes: number) => {
        const { dailyWhisperLastTimestamp, dailyWhisperHistory } = get();
        const now = Date.now();
        const intervalMs = intervalMinutes * 60 * 1000;

        if (now - dailyWhisperLastTimestamp > intervalMs || get().dailyWhisperId === null) {
          // Generate new
          let newId = Math.floor(Math.random() * totalMessages);
          let attempts = 0;
          while (dailyWhisperHistory.includes(newId) && attempts < 50) {
            newId = Math.floor(Math.random() * totalMessages);
            attempts++;
          }

          const newHistory = [newId, ...dailyWhisperHistory].slice(0, 20); // Keep last 20
          // 15% chance for voice note
          const isVoice = Math.random() < 0.15;

          set({
            dailyWhisperId: newId,
            dailyWhisperHistory: newHistory,
            dailyWhisperLastTimestamp: now,
            dailyWhisperIsVoiceNote: isVoice,
          });
        }
      },

      generateFortune: (totalFortunes: number) => {
        const { fortuneHistory } = get();
        let newId = Math.floor(Math.random() * totalFortunes);
        let attempts = 0;
        while (fortuneHistory.includes(newId) && attempts < 50) {
          newId = Math.floor(Math.random() * totalFortunes);
          attempts++;
        }
        
        const newHistory = [newId, ...fortuneHistory].slice(0, 20);
        set({
          fortuneHistory: newHistory,
          fortuneResult: newId.toString(),
        });
      },

      setCurrentMood: (mood: string) => set({ currentMood: mood }),

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
          fortuneResult: null,
          heartSyncComplete: false,
          activityLog: [],
          kissCount: 0,
          dailyWhisperId: null,
          dailyWhisperHistory: [],
          dailyWhisperLastTimestamp: 0,
          dailyWhisperIsVoiceNote: false,
          fortuneHistory: [],
          currentMood: null,
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
        fortuneResult: state.fortuneResult,
        heartSyncComplete: state.heartSyncComplete,
        activityLog: state.activityLog,
        kissCount: state.kissCount,
        dailyWhisperId: state.dailyWhisperId,
        dailyWhisperHistory: state.dailyWhisperHistory,
        dailyWhisperLastTimestamp: state.dailyWhisperLastTimestamp,
        dailyWhisperIsVoiceNote: state.dailyWhisperIsVoiceNote,
        fortuneHistory: state.fortuneHistory,
        currentMood: state.currentMood,
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

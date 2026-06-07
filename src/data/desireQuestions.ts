export type DesireCategory = 'heart' | 'body' | 'us';

export interface DesireQuestion {
  id: number;
  question: string;
  category: DesireCategory;
  hint?: string;
}

export const DESIRE_QUESTIONS: DesireQuestion[] = [
  // ── Heart (emotional desire) ────────────────────────────────────────────────
  {
    id: 1,
    category: 'heart',
    question: "What does being loved by me feel like in your body right now?",
    hint: "Be honest — there's no wrong answer here",
  },
  {
    id: 2,
    category: 'heart',
    question: "When do you feel the most desired by me?",
    hint: "A moment, a word, a look — whatever comes to mind",
  },
  {
    id: 3,
    category: 'heart',
    question: "What's something you want from me emotionally that you've never directly asked for?",
    hint: "This is a safe space — say it",
  },
  {
    id: 4,
    category: 'heart',
    question: "What does it feel like when I say your name in a certain way?",
    hint: "You know the tone I mean",
  },
  {
    id: 5,
    category: 'heart',
    question: "What emotion do you feel when you let yourself really think about me touching you?",
    hint: "Don't overthink it — what's the first feeling?",
  },
  {
    id: 6,
    category: 'heart',
    question: "What part of our connection do you think about the most when you're alone?",
  },
  {
    id: 7,
    category: 'heart',
    question: "Is there a version of how I love you that you wish happened more often?",
  },
  {
    id: 8,
    category: 'heart',
    question: "What would I have to say to you right now to make you feel completely seen?",
    hint: "I want to know so I can actually say it",
  },

  // ── Body (physical desire) ──────────────────────────────────────────────────
  {
    id: 9,
    category: 'body',
    question: "Where on your body do you want my attention the most when I finally see you?",
    hint: "Be specific — this matters to me",
  },
  {
    id: 10,
    category: 'body',
    question: "What kind of touch calms you completely, and what kind ignites you?",
  },
  {
    id: 11,
    category: 'body',
    question: "What physical thing about me do you think about the most?",
    hint: "It stays between us",
  },
  {
    id: 12,
    category: 'body',
    question: "If I were there right now — what would you want me to do first?",
    hint: "Don't be shy",
  },
  {
    id: 13,
    category: 'body',
    question: "Where do you like being kissed most? And where do you want it most from me?",
  },
  {
    id: 14,
    category: 'body',
    question: "What does your body do when I say something that really lands?",
  },
  {
    id: 15,
    category: 'body',
    question: "Is there something you want physically that you've been afraid to bring up?",
    hint: "Now's the time",
  },
  {
    id: 16,
    category: 'body',
    question: "What does 'being wanted' feel like to you — physically, in your body?",
  },

  // ── Us (shared desire & fantasy) ───────────────────────────────────────────
  {
    id: 17,
    category: 'us',
    question: "What fantasy about us do you replay the most?",
    hint: "I think about you too",
  },
  {
    id: 18,
    category: 'us',
    question: "What would our first full night together look like, in your version of it?",
    hint: "From the moment to the morning",
  },
  {
    id: 19,
    category: 'us',
    question: "Is there something you want to experience with me that you've never done before?",
  },
  {
    id: 20,
    category: 'us',
    question: "How do you want me to make you feel the moment we're finally in the same room?",
  },
  {
    id: 21,
    category: 'us',
    question: "If we had a full weekend together with no plans and no interruptions — what happens?",
    hint: "Tell me everything",
  },
  {
    id: 22,
    category: 'us',
    question: "What do you want more of from us — emotionally, physically, or both?",
  },
  {
    id: 23,
    category: 'us',
    question: "Is there a version of us you've imagined that we haven't become yet?",
    hint: "What does it look like?",
  },
  {
    id: 24,
    category: 'us',
    question: "What's the one thing you're most excited to finally feel when we're together?",
  },
];

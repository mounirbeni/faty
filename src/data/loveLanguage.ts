export type LoveLanguage = 'words' | 'touch' | 'time' | 'acts' | 'gifts';

export interface LLQuestion {
  id: number;
  prompt: string;
  options: { text: string; lang: LoveLanguage }[];
}

export const LOVE_LANGUAGE_QUESTIONS: LLQuestion[] = [
  {
    id: 1,
    prompt: "When I make you feel most loved, it's because…",
    options: [
      { text: "You said exactly the right thing at the right moment", lang: 'words' },
      { text: "You held me or touched me without thinking", lang: 'touch' },
      { text: "You gave me your full, undivided attention", lang: 'time' },
      { text: "You did something for me before I even asked", lang: 'acts' },
    ],
  },
  {
    id: 2,
    prompt: "What would mean the most to you right now?",
    options: [
      { text: "A long message telling me exactly how you feel", lang: 'words' },
      { text: "Being held by you, no talking needed", lang: 'touch' },
      { text: "A full day together, just us, no interruptions", lang: 'time' },
      { text: "You handling something that's been stressing me", lang: 'acts' },
    ],
  },
  {
    id: 3,
    prompt: "You feel most disconnected from me when…",
    options: [
      { text: "You stop expressing how much you love me", lang: 'words' },
      { text: "We go days without physical closeness", lang: 'touch' },
      { text: "We're both too busy for real time together", lang: 'time' },
      { text: "You're not showing up for me practically", lang: 'acts' },
    ],
  },
  {
    id: 4,
    prompt: "Your favorite part of being close to someone is…",
    options: [
      { text: "How they talk to you — the words they choose", lang: 'words' },
      { text: "The way they hold you or touch you naturally", lang: 'touch' },
      { text: "Hours that pass without either of you noticing", lang: 'time' },
      { text: "The small things they do to make your life easier", lang: 'acts' },
    ],
  },
  {
    id: 5,
    prompt: "When you're upset or low, what helps the most?",
    options: [
      { text: "Hearing the right words — being reassured out loud", lang: 'words' },
      { text: "Being held and not let go", lang: 'touch' },
      { text: "Just being with them in the same space, quietly", lang: 'time' },
      { text: "Them doing something small that shows they really care", lang: 'acts' },
    ],
  },
  {
    id: 6,
    prompt: "The most romantic thing someone can do is…",
    options: [
      { text: "Write me something that says everything I needed to hear", lang: 'words' },
      { text: "Touch me unexpectedly — a hand, a hug, closeness", lang: 'touch' },
      { text: "Plan something just so we can be together", lang: 'time' },
      { text: "Do something thoughtful without being asked", lang: 'acts' },
    ],
  },
  {
    id: 7,
    prompt: "You feel safest in a relationship when…",
    options: [
      { text: "Words of love and reassurance are given freely", lang: 'words' },
      { text: "Physical presence and touch are always available", lang: 'touch' },
      { text: "You're given time and real presence", lang: 'time' },
      { text: "Someone shows you love through what they do", lang: 'acts' },
    ],
  },
  {
    id: 8,
    prompt: "What would make you feel the most appreciated right now?",
    options: [
      { text: "Hearing you tell me what I mean to you", lang: 'words' },
      { text: "Feeling your hands on me — even just a touch", lang: 'touch' },
      { text: "You dropping everything to just be with me", lang: 'time' },
      { text: "You doing something that shows you've been thinking about me", lang: 'acts' },
    ],
  },
];

export const LOVE_LANGUAGE_RESULTS: Record<
  LoveLanguage,
  { label: string; emoji: string; description: string; note: string }
> = {
  words: {
    label: 'Words of Affirmation',
    emoji: '💬',
    description: "You're fed by what I say. Every 'I love you' lands somewhere deep in you — and the right words at the right moment mean everything.",
    note: "I'll speak more carefully and more often. Because you deserve to hear it, always.",
  },
  touch: {
    label: 'Physical Touch',
    emoji: '🤍',
    description: "Your love lives in closeness. In how it feels to be held, touched, reached for. Distance is hardest for you — and that makes sense.",
    note: "The second I can, I'm going to hold you and not move for a long time. You deserve to be felt, not just told.",
  },
  time: {
    label: 'Quality Time',
    emoji: '⏳',
    description: "What you want most is presence. My full attention, no distractions, no rush — just us being in each other's world completely.",
    note: "When I'm finally there, everything else disappears. I promise you that. You are always worth my undivided time.",
  },
  acts: {
    label: 'Acts of Service',
    emoji: '🛠️',
    description: "You feel loved through effort. When someone shows up in actions — not just promises — you notice. You feel it.",
    note: "I see you. I'll keep showing up in the ways that count, the ones that prove I mean what I say.",
  },
  gifts: {
    label: 'Receiving Gifts',
    emoji: '🎁',
    description: "For you, a gift is a symbol — of thought, of remembering, of someone knowing you well enough to bring something back.",
    note: "Every small thing I send you carries that meaning. I think about you when I don't say it. These are the proof.",
  },
};

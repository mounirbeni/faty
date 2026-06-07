export interface RateItem {
  id: number;
  label: string;
  lowLabel: string;
  highLabel: string;
  emoji: string;
}

export const RATE_ITEMS: RateItem[] = [
  {
    id: 1,
    label: "How connected do I feel to you right now?",
    lowLabel: "distant",
    highLabel: "completely yours",
    emoji: "💗",
  },
  {
    id: 2,
    label: "How much am I physically missing you?",
    lowLabel: "managing",
    highLabel: "desperately",
    emoji: "🔥",
  },
  {
    id: 3,
    label: "How well are we communicating lately?",
    lowLabel: "struggling",
    highLabel: "perfectly",
    emoji: "💬",
  },
  {
    id: 4,
    label: "How safe do I feel being fully open with you?",
    lowLabel: "guarded",
    highLabel: "completely safe",
    emoji: "🌙",
  },
  {
    id: 5,
    label: "How strong is the tension between us right now?",
    lowLabel: "calm",
    highLabel: "electric",
    emoji: "⚡",
  },
  {
    id: 6,
    label: "How excited am I about our future?",
    lowLabel: "uncertain",
    highLabel: "can't wait",
    emoji: "✨",
  },
  {
    id: 7,
    label: "How happy does this relationship make me?",
    lowLabel: "complicated",
    highLabel: "the happiest",
    emoji: "🌹",
  },
  {
    id: 8,
    label: "Overall — how are we doing?",
    lowLabel: "need to talk",
    highLabel: "we're perfect",
    emoji: "💫",
  },
];

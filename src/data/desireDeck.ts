export interface DesireCard {
  id: number;
  text: string;
  category: 'tender' | 'bold' | 'daring';
  emoji: string;
}

export const DESIRE_CARDS: DesireCard[] = [
  // Tender (8)
  {
    id: 1,
    category: 'tender',
    emoji: '🌹',
    text: `Tell me your favorite part of my body and why`,
  },
  {
    id: 2,
    category: 'tender',
    emoji: '🌹',
    text: `Where would you love me to kiss you that I never have?`,
  },
  {
    id: 3,
    category: 'tender',
    emoji: '🌹',
    text: `What outfit makes you want me the most?`,
  },
  {
    id: 4,
    category: 'tender',
    emoji: '🌹',
    text: `Describe your perfect night with me — completely honest`,
  },
  {
    id: 5,
    category: 'tender',
    emoji: '🌹',
    text: `What's the most attractive thing I do without realizing it?`,
  },
  {
    id: 6,
    category: 'tender',
    emoji: '🌹',
    text: `What time of day do you think about me the most?`,
  },
  {
    id: 7,
    category: 'tender',
    emoji: '🌹',
    text: `Tell me one small thing I do that drives you crazy`,
  },
  {
    id: 8,
    category: 'tender',
    emoji: '🌹',
    text: `What's your favorite kiss we've ever shared and why?`,
  },
  // Bold (8)
  {
    id: 9,
    category: 'bold',
    emoji: '🔥',
    text: `Tell me one thing you've always wanted to try with me but never asked`,
  },
  {
    id: 10,
    category: 'bold',
    emoji: '🔥',
    text: `What do you want me to whisper in your ear tonight?`,
  },
  {
    id: 11,
    category: 'bold',
    emoji: '🔥',
    text: `Describe the most intimate moment you've imagined between us`,
  },
  {
    id: 12,
    category: 'bold',
    emoji: '🔥',
    text: `What part of me is impossible for you to resist?`,
  },
  {
    id: 13,
    category: 'bold',
    emoji: '🔥',
    text: `Tell me exactly what you want me to do to you right now`,
  },
  {
    id: 14,
    category: 'bold',
    emoji: '🔥',
    text: `What's your biggest fantasy that involves me?`,
  },
  {
    id: 15,
    category: 'bold',
    emoji: '🔥',
    text: `Rate our chemistry from 1–10 — and tell me how we get to 10`,
  },
  {
    id: 16,
    category: 'bold',
    emoji: '🔥',
    text: `What's one place you've imagined kissing me that you haven't yet?`,
  },
  // Daring (8)
  {
    id: 17,
    category: 'daring',
    emoji: '💋',
    text: `Tell me exactly what tonight looks like if you had no limits`,
  },
  {
    id: 18,
    category: 'daring',
    emoji: '💋',
    text: `Describe the most passionate moment you've ever imagined with me`,
  },
  {
    id: 19,
    category: 'daring',
    emoji: '💋',
    text: `What's something intimate you've never told me you want?`,
  },
  {
    id: 20,
    category: 'daring',
    emoji: '💋',
    text: `If we had the whole night and zero rules — what happens?`,
  },
  {
    id: 21,
    category: 'daring',
    emoji: '💋',
    text: `Tell me your deepest physical desire when it comes to me`,
  },
  {
    id: 22,
    category: 'daring',
    emoji: '💋',
    text: `What's the one thing that would make tonight unforgettable for you?`,
  },
  {
    id: 23,
    category: 'daring',
    emoji: '💋',
    text: `Tell me the moment you felt the most desire for me`,
  },
  {
    id: 24,
    category: 'daring',
    emoji: '💋',
    text: `What would you want me to do if I surprised you right now?`,
  },
];

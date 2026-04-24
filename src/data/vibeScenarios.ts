export interface VibeScenario {
  id: number;
  emoji: string;
  text: string;
  subtext: string;
}

export const vibeScenarios: VibeScenario[] = [
  {
    id: 1,
    emoji: '🤗',
    text: 'Surprise hugs from behind',
    subtext: 'When you least expect it',
  },
  {
    id: 2,
    emoji: '🍳',
    text: 'Cooking together at midnight',
    subtext: 'Messy kitchen, happy hearts',
  },
  {
    id: 3,
    emoji: '🌙',
    text: 'Deep late-night talks about life',
    subtext: '2 AM conversations that change everything',
  },
  {
    id: 4,
    emoji: '🎵',
    text: 'Sharing earphones & singing badly',
    subtext: 'No judgment, just vibes',
  },
  {
    id: 5,
    emoji: '☕',
    text: 'Morning coffee in comfortable silence',
    subtext: 'When silence feels like home',
  },
  {
    id: 6,
    emoji: '🌧️',
    text: 'Getting caught in the rain together',
    subtext: 'Running and laughing',
  },
  {
    id: 7,
    emoji: '👀',
    text: 'Long eye contact that says everything',
    subtext: 'No words needed',
  },
  {
    id: 8,
    emoji: '💌',
    text: 'Handwritten notes left in random places',
    subtext: 'Little surprises for you to find',
  },
];

export interface VibeScenario {
  id: number;
  icon: string;
  text: string;
  subtext: string;
}

export const vibeScenarios: VibeScenario[] = [
  {
    id: 1,
    icon: 'heart-handshake',
    text: 'Surprise hugs from behind',
    subtext: 'When you least expect it',
  },
  {
    id: 2,
    icon: 'utensils',
    text: 'Cooking together at midnight',
    subtext: 'Messy kitchen, happy hearts',
  },
  {
    id: 3,
    icon: 'moon',
    text: 'Deep late-night talks about life',
    subtext: '2 AM conversations that change everything',
  },
  {
    id: 4,
    icon: 'music',
    text: 'Sharing earphones & singing badly',
    subtext: 'No judgment, just vibes',
  },
  {
    id: 5,
    icon: 'coffee',
    text: 'Morning coffee in comfortable silence',
    subtext: 'When silence feels like home',
  },
  {
    id: 6,
    icon: 'cloud-rain',
    text: 'Getting caught in the rain together',
    subtext: 'Running and laughing',
  },
  {
    id: 7,
    icon: 'eye',
    text: 'Long eye contact that says everything',
    subtext: 'No words needed',
  },
  {
    id: 8,
    icon: 'mail',
    text: 'Handwritten notes left in random places',
    subtext: 'Little surprises for you to find',
  },
];

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
    text: `Tell me which part of me you close your eyes and picture when we're not talking`,
  },
  {
    id: 2,
    category: 'tender',
    emoji: '🌹',
    text: `What part of me do you imagine touching first when we finally meet?`,
  },
  {
    id: 3,
    category: 'tender',
    emoji: '🌹',
    text: `What do you think the first hug after all this time will feel like?`,
  },
  {
    id: 4,
    category: 'tender',
    emoji: '🌹',
    text: `Describe your perfect first night together when the distance finally ends`,
  },
  {
    id: 5,
    category: 'tender',
    emoji: '🌹',
    text: `What's the most attractive thing I do on our video calls without realizing it?`,
  },
  {
    id: 6,
    category: 'tender',
    emoji: '🌹',
    text: `What time of day do you miss me the most physically — and what does that feel like?`,
  },
  {
    id: 7,
    category: 'tender',
    emoji: '🌹',
    text: `Tell me one small thing you imagine us doing together that you've never said out loud`,
  },
  {
    id: 8,
    category: 'tender',
    emoji: '🌹',
    text: `What's the first kiss you're dreaming of when we finally see each other?`,
  },
  // Bold (8)
  {
    id: 9,
    category: 'bold',
    emoji: '🔥',
    text: `Tell me one thing you've imagined doing with me the first night we're finally together`,
  },
  {
    id: 10,
    category: 'bold',
    emoji: '🔥',
    text: `What do you want me to whisper in your ear the very moment I finally see you?`,
  },
  {
    id: 11,
    category: 'bold',
    emoji: '🔥',
    text: `Describe what you think it will feel like to finally hold me — really hold me`,
  },
  {
    id: 12,
    category: 'bold',
    emoji: '🔥',
    text: `What part of me is impossible to stop thinking about when you're alone at night?`,
  },
  {
    id: 13,
    category: 'bold',
    emoji: '🔥',
    text: `Tell me exactly what you want when we have our first night with no distance between us`,
  },
  {
    id: 14,
    category: 'bold',
    emoji: '🔥',
    text: `What do you fantasize about when you see me on camera and you can't touch me?`,
  },
  {
    id: 15,
    category: 'bold',
    emoji: '🔥',
    text: `Rate the tension between us right now — and tell me how we release it when we finally meet`,
  },
  {
    id: 16,
    category: 'bold',
    emoji: '🔥',
    text: `What's one place on me you can't wait to kiss the first moment you see me?`,
  },
  // Daring (8)
  {
    id: 17,
    category: 'daring',
    emoji: '💋',
    text: `Tell me exactly what our first night together looks like if you had no limits and no distance`,
  },
  {
    id: 18,
    category: 'daring',
    emoji: '💋',
    text: `Describe the most passionate reunion you've ever imagined between us`,
  },
  {
    id: 19,
    category: 'daring',
    emoji: '💋',
    text: `What's something intimate you've never told me you're waiting to do when we're finally together?`,
  },
  {
    id: 20,
    category: 'daring',
    emoji: '💋',
    text: `If we had a full week alone, in the same place, no plans and no rules — what happens?`,
  },
  {
    id: 21,
    category: 'daring',
    emoji: '💋',
    text: `Tell me your deepest physical desire when you imagine us finally being in the same room`,
  },
  {
    id: 22,
    category: 'daring',
    emoji: '💋',
    text: `What would make our first night together something neither of us will ever forget?`,
  },
  {
    id: 23,
    category: 'daring',
    emoji: '💋',
    text: `Tell me the moment on our calls when you felt the most physical longing for me`,
  },
  {
    id: 24,
    category: 'daring',
    emoji: '💋',
    text: `If I surprised you by showing up at your door right now — what would happen?`,
  },
];

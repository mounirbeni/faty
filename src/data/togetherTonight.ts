export type TonightCategory = 'sweet' | 'bold' | 'fire';

export interface TonightCard {
  id: number;
  text: string;
  category: TonightCategory;
}

export const TONIGHT_CARDS: TonightCard[] = [
  // ── Sweet (tender, romantic) ────────────────────────────────────────────────
  {
    id: 1,
    category: 'sweet',
    text: "I'd hold you from behind and breathe you in without saying a single word.",
  },
  {
    id: 2,
    category: 'sweet',
    text: "I'd put your head on my chest and play with your hair until you fell asleep.",
  },
  {
    id: 3,
    category: 'sweet',
    text: "I'd make us something warm to drink and we'd just sit together — no phones, no plans, just us.",
  },
  {
    id: 4,
    category: 'sweet',
    text: "I'd look at you until you asked me why, and then I'd just say 'nothing, you're just beautiful.'",
  },
  {
    id: 5,
    category: 'sweet',
    text: "I'd dance with you in the kitchen to a song neither of us planned.",
  },
  {
    id: 6,
    category: 'sweet',
    text: "I'd kiss your forehead first. Slow. Like I was saying I love you with my lips.",
  },
  {
    id: 7,
    category: 'sweet',
    text: "I'd hold your face in my hands and memorize every detail like I was afraid of forgetting.",
  },
  {
    id: 8,
    category: 'sweet',
    text: "I'd sit next to you, shoulders touching, doing absolutely nothing and feeling everything.",
  },
  {
    id: 9,
    category: 'sweet',
    text: "I'd watch you do something small — brush your hair, read, anything — and not stop smiling.",
  },
  {
    id: 10,
    category: 'sweet',
    text: "I'd pull you into a hug that didn't end for a long time and neither of us would want it to.",
  },

  // ── Bold (flirty, intentional) ──────────────────────────────────────────────
  {
    id: 11,
    category: 'bold',
    text: "I'd pull you close before you finished your sentence.",
  },
  {
    id: 12,
    category: 'bold',
    text: "I'd kiss your neck softly — just enough to hear your breath change.",
  },
  {
    id: 13,
    category: 'bold',
    text: "I'd trace my fingers along your arm, slowly, watching you try to stay calm.",
  },
  {
    id: 14,
    category: 'bold',
    text: "I'd whisper something that made you blush, then act completely innocent.",
  },
  {
    id: 15,
    category: 'bold',
    text: "I'd stare at you until you looked away first, then close the distance.",
  },
  {
    id: 16,
    category: 'bold',
    text: "I'd press my lips to your shoulder and just stay there, breathing you in.",
  },
  {
    id: 17,
    category: 'bold',
    text: "I'd kiss your jaw slowly, working my way down, making you wait for the rest.",
  },
  {
    id: 18,
    category: 'bold',
    text: "I'd lay you down beside me and just look at you — really look at you — before anything else.",
  },
  {
    id: 19,
    category: 'bold',
    text: "I'd take your hand and put it somewhere that tells you exactly what I'm thinking.",
  },
  {
    id: 20,
    category: 'bold',
    text: "I'd pull you in by the waist and kiss you like I'd been waiting for it all week. Because I would have.",
  },

  // ── Fire (openly intimate) ──────────────────────────────────────────────────
  {
    id: 21,
    category: 'fire',
    text: "I'd take my time with every part of you — no rush, just full presence.",
  },
  {
    id: 22,
    category: 'fire',
    text: "I'd learn every reaction you have to my touch and use that knowledge carefully.",
  },
  {
    id: 23,
    category: 'fire',
    text: "I'd want to make you feel things you'd struggle to put into words.",
  },
  {
    id: 24,
    category: 'fire',
    text: "I'd show you exactly what I've been thinking about since we last spoke.",
  },
  {
    id: 25,
    category: 'fire',
    text: "I'd kiss every part of you like each spot deserved its own attention.",
  },
  {
    id: 26,
    category: 'fire',
    text: "I'd want to see that look on your face — the one that's just for me.",
  },
  {
    id: 27,
    category: 'fire',
    text: "I'd keep you warm in every way that a blanket never could.",
  },
  {
    id: 28,
    category: 'fire',
    text: "I'd be so close to you that distance would feel like a word we'd both forgotten.",
  },
  {
    id: 29,
    category: 'fire',
    text: "I'd take you apart slowly, and then put you back together, gently.",
  },
  {
    id: 30,
    category: 'fire',
    text: "I'd make sure the last thing you thought before sleep was my name.",
  },
];

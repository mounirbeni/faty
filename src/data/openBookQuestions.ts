export type OBCategory = 'feel' | 'want' | 'bold';

export interface OpenBookQuestion {
  id: number;
  question: string;
  category: OBCategory;
  options: string[];
  hasText: boolean;
}

export const OPEN_BOOK_QUESTIONS: OpenBookQuestion[] = [
  // ── Feel (10) ──────────────────────────────────────────────────────────────
  {
    id: 1, category: 'feel',
    question: "Right now, being this far from you makes me feel…",
    options: ["Safe but still missing you", "Restless and impatient", "Closer than I expected", "Sad more than I show"],
    hasText: true,
  },
  {
    id: 2, category: 'feel',
    question: "When I think about you, I mostly feel…",
    options: ["Warm and full", "Desperate to be close", "Happy and a little sad", "Like I can't stop smiling"],
    hasText: true,
  },
  {
    id: 3, category: 'feel',
    question: "After our calls end, I always feel…",
    options: ["Happy but instantly missing you", "Grateful we have this", "Empty for a while", "Even more in love"],
    hasText: true,
  },
  {
    id: 4, category: 'feel',
    question: "Being loved by you feels like…",
    options: ["Being seen completely", "The safest I've ever been", "Being wanted deeply", "Being home"],
    hasText: true,
  },
  {
    id: 5, category: 'feel',
    question: "When you say you miss me, I feel…",
    options: ["Relieved", "Warm all over", "Like crying a little", "Instantly closer to you"],
    hasText: false,
  },
  {
    id: 6, category: 'feel',
    question: "My biggest fear about us is…",
    options: ["Growing apart from the distance", "Not being enough for you", "Not seeing you soon enough", "Losing what we've built"],
    hasText: true,
  },
  {
    id: 7, category: 'feel',
    question: "What reassures me most about us is…",
    options: ["How consistent you are", "The way you talk to me", "Knowing you feel the same", "Everything you've already shown me"],
    hasText: true,
  },
  {
    id: 8, category: 'feel',
    question: "When I imagine our future, I feel…",
    options: ["Excited and certain", "A little overwhelmed", "Calm and hopeful", "Like I can't wait"],
    hasText: true,
  },
  {
    id: 9, category: 'feel',
    question: "The distance between us feels…",
    options: ["Temporary and manageable", "Harder some days than others", "Like it makes us stronger", "Too real right now"],
    hasText: true,
  },
  {
    id: 10, category: 'feel',
    question: "Right now my heart is…",
    options: ["Full of you", "A little heavy", "Excited about us", "Completely yours"],
    hasText: false,
  },

  // ── Want (10) ──────────────────────────────────────────────────────────────
  {
    id: 11, category: 'want',
    question: "What I want most right now is…",
    options: ["To hear your voice saying my name", "To fall asleep next to you", "To feel your arms around me", "Just to be in the same room as you"],
    hasText: true,
  },
  {
    id: 12, category: 'want',
    question: "The first thing I want to do when we finally meet is…",
    options: ["Hug you and not let go", "Kiss you slowly", "Lay next to you quietly", "Hold your face in my hands"],
    hasText: true,
  },
  {
    id: 13, category: 'want',
    question: "I need you to know that I…",
    options: ["Think about you every single day", "Feel completely safe with you", "Want you more than I say", "Love you in ways I'm still discovering"],
    hasText: true,
  },
  {
    id: 14, category: 'want',
    question: "The kind of touch I miss most is…",
    options: ["Your hand holding mine", "Being held from behind", "Your lips on my forehead", "Just sleeping next to you"],
    hasText: false,
  },
  {
    id: 15, category: 'want',
    question: "I want our relationship to be more…",
    options: ["Open and fearless", "Physically close", "Bold and honest", "Everything it already is, just together"],
    hasText: true,
  },
  {
    id: 16, category: 'want',
    question: "What I want from us that we don't have yet is…",
    options: ["More time together", "Being physically close", "Seeing each other as much as I want", "Building something concrete"],
    hasText: true,
  },
  {
    id: 17, category: 'want',
    question: "I want to feel…",
    options: ["Completely chosen by you", "Deeply wanted", "Held by you always", "Like nothing could change this"],
    hasText: false,
  },
  {
    id: 18, category: 'want',
    question: "My version of the perfect night with you is…",
    options: ["Talking until 4am", "Complete silence next to you", "Doing something new together", "Just existing together quietly"],
    hasText: true,
  },
  {
    id: 19, category: 'want',
    question: "Something I want to tell you that I haven't yet…",
    options: [],
    hasText: true,
  },
  {
    id: 20, category: 'want',
    question: "What I want you to do for me is…",
    options: ["Keep choosing me", "Tell me more of what you feel", "Be patient with the distance", "Just keep being you"],
    hasText: true,
  },

  // ── Bold (10) ──────────────────────────────────────────────────────────────
  {
    id: 21, category: 'bold',
    question: "When I think about finally seeing you, what happens first is…",
    options: ["I cry a little", "I can't stop kissing you", "I don't let go for a long time", "I just stare at you"],
    hasText: true,
  },
  {
    id: 22, category: 'bold',
    question: "The physical thing I think about the most is…",
    options: ["Being held all night", "Your hands on me", "Kissing you properly", "How it'll feel to finally touch you"],
    hasText: true,
  },
  {
    id: 23, category: 'bold',
    question: "If you were here right now, I'd…",
    options: ["Pull you close immediately", "Whisper something in your ear", "Make you stay forever", "Finally show you everything I feel"],
    hasText: true,
  },
  {
    id: 24, category: 'bold',
    question: "What turns me on most about you is…",
    options: ["How you talk to me", "The way you look at me through a screen", "Your voice", "Everything honestly"],
    hasText: true,
  },
  {
    id: 25, category: 'bold',
    question: "If I could have one night with you right now, it would be…",
    options: ["Slow and tender all night", "Completely unplanned", "Somewhere neither of us has been", "Exactly as I've imagined it"],
    hasText: true,
  },
  {
    id: 26, category: 'bold',
    question: "How I want you to touch me first when we meet is…",
    options: ["Slow and careful", "Like you've been waiting", "Like I'm completely yours", "Everywhere at once"],
    hasText: true,
  },
  {
    id: 27, category: 'bold',
    question: "The thing I'm most honest about only late at night is…",
    options: [],
    hasText: true,
  },
  {
    id: 28, category: 'bold',
    question: "The boldest thing I've imagined us doing together is…",
    options: [],
    hasText: true,
  },
  {
    id: 29, category: 'bold',
    question: "Where I want you to kiss me the most is…",
    options: ["My forehead", "My neck", "My lips — slow", "All over"],
    hasText: false,
  },
  {
    id: 30, category: 'bold',
    question: "The thing I've never said but want to is…",
    options: [],
    hasText: true,
  },
];

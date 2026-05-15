export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string; // Shown after answering
}

export const triviaData: TriviaQuestion[] = [
  {
    id: 1,
    question: "What city do I live in?",
    options: ["Casablanca", "Rabat", "Meknes", "Fes"],
    correctIndex: 2,
    funFact: "Meknes — the imperial city. And it's where we finally met.",
  },
  {
    id: 2,
    question: "What time of day am I most active and happy?",
    options: ["Early morning", "Late at night", "Midday", "Late afternoon"],
    correctIndex: 1,
    funFact: "Late night is when my mind is clearest and my heart is most open.",
  },
  {
    id: 3,
    question: "What is my favorite way to spend a day off?",
    options: [
      "Going out with friends",
      "Staying in with good music & thoughts",
      "Exploring a new city",
      "Watching sports",
    ],
    correctIndex: 1,
    funFact: "Give me music, silence, and something to think about and I am perfectly happy.",
  },
  {
    id: 4,
    question: "When I am in my feelings, what do I usually do?",
    options: [
      "Talk to someone immediately",
      "Go for a long drive alone",
      "Go quiet and think it through",
      "Write it all down",
    ],
    correctIndex: 2,
    funFact: "I go quiet. I process internally first. Then I share when I am ready.",
  },
  {
    id: 5,
    question: "What kind of music puts me in my best mood?",
    options: [
      "Loud rap & hip-hop",
      "Acoustic and calm vibes",
      "Upbeat pop",
      "Depends entirely on the mood",
    ],
    correctIndex: 3,
    funFact: "Honestly it changes with the sky. Some days it is calm, some days it is loud.",
  },
  {
    id: 6,
    question: "What is the first thing I notice about a person I like?",
    options: [
      "Their smile",
      "The way they talk and express themselves",
      "Their style and looks",
      "How they treat others",
    ],
    correctIndex: 1,
    funFact: "The way someone speaks tells me everything about their soul.",
  },
  {
    id: 7,
    question: "How would my closest friends describe me in one word?",
    options: ["Funny", "Deep", "Loyal", "Mysterious"],
    correctIndex: 2,
    funFact: "Loyal above everything. I show up for the people I care about, always.",
  },
  {
    id: 8,
    question: "What is my biggest dream right now?",
    options: [
      "Travel the whole world",
      "Build something that matters and share it with someone I love",
      "Become famous",
      "Find financial freedom first",
    ],
    correctIndex: 1,
    funFact: "Build something real — a life, a future, a bond — with the right person by my side.",
  },
  {
    id: 9,
    question: "What would I choose for a perfect first date?",
    options: [
      "Fancy restaurant with candlelight",
      "A walk somewhere beautiful with good conversation",
      "Movie and popcorn at home",
      "An adventure like hiking or exploring",
    ],
    correctIndex: 1,
    funFact: "Just walking and talking. No pressure, no performance. Just us being real.",
  },
  {
    id: 10,
    question: "What do I value most in a relationship?",
    options: [
      "Passion and excitement",
      "Loyalty, honesty, and being truly understood",
      "Freedom and independence",
      "Shared goals and ambition",
    ],
    correctIndex: 1,
    funFact: "To be truly seen and truly loyal to each other. That is everything to me.",
  },
];

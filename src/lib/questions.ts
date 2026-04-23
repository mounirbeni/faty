// ─── Types ────────────────────────────────────────────────────────────

export type QuestionType = "text" | "multiple-choice";

export interface MultipleChoiceOption {
  id: string;
  label: string;
  icon: string; // Lucide icon name — rendered via IconFromName
}

export interface BaseQuestion {
  id: number;
  level: number;
  levelTitle: string;
  levelIcon: string; // Lucide icon name
  question: string;
  type: QuestionType;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: MultipleChoiceOption[];
}

export type Question = TextQuestion | MultipleChoiceQuestion;

export interface Answer {
  questionId: number;
  value: string;
  reversed: boolean;
}

// ─── Level metadata ──────────────────────────────────────────────────

export interface LevelMeta {
  level: number;
  title: string;
  icon: string; // Lucide icon name
  description: string;
  colorFrom: string;
  colorTo: string;
  accentHex: string;
}

export const levels: LevelMeta[] = [
  {
    level: 1,
    title: "First Meeting & Expectations",
    icon: "sparkles",
    description: "Let's break the ice…",
    colorFrom: "from-sky-400",
    colorTo: "to-indigo-400",
    accentHex: "#38bdf8",
  },
  {
    level: 2,
    title: "How You See Me",
    icon: "eye",
    description: "Through your eyes…",
    colorFrom: "from-violet-400",
    colorTo: "to-fuchsia-400",
    accentHex: "#c084fc",
  },
  {
    level: 3,
    title: "Emotional Depth & Vulnerability",
    icon: "waves",
    description: "Going deeper…",
    colorFrom: "from-fuchsia-400",
    colorTo: "to-rose-400",
    accentHex: "#e879f9",
  },
  {
    level: 4,
    title: "Fun & Hypothetical",
    icon: "dice",
    description: "Let's play…",
    colorFrom: "from-rose-400",
    colorTo: "to-orange-400",
    accentHex: "#fb7185",
  },
  {
    level: 5,
    title: "Intimate & Romantic",
    icon: "flame",
    description: "Just between us…",
    colorFrom: "from-red-500",
    colorTo: "to-rose-600",
    accentHex: "#ef4444",
  },
];

// ─── Romantic love notes shown between questions ─────────────────────

export const loveNotes: string[] = [
  "Every answer makes me fall for you a little more…",
  "I could read your words forever.",
  "You have no idea how much this means to me.",
  "I'm smiling so hard right now.",
  "I can't wait to hear you say these things in person.",
  "My heart skipped reading that.",
  "You're the best thing that happened to my timeline.",
  "I hope you know how special you are.",
  "One month. Just one more month.",
  "Keep going… it gets even better.",
  "I already know I'm the luckiest.",
  "Your honesty is everything to me.",
  "I wish I could hug you through this screen.",
  "This is exactly why I can't stop thinking about you.",
  "You make distance feel like nothing.",
];

// ─── Level intro messages ────────────────────────────────────────────

export const levelIntros: Record<number, { title: string; subtitle: string; message: string }> = {
  1: {
    title: "Chapter One",
    subtitle: "First Meeting & Expectations",
    message: "Before we meet, I want to know what's going on in that beautiful mind of yours. Let's start easy…",
  },
  2: {
    title: "Chapter Two",
    subtitle: "How You See Me",
    message: "Now I want to see myself through your eyes. Be honest — the good and the real.",
  },
  3: {
    title: "Chapter Three",
    subtitle: "Emotional Depth",
    message: "We're going deeper now. These questions matter to me. Take your time with each one.",
  },
  4: {
    title: "Chapter Four",
    subtitle: "Fun & Hypothetical",
    message: "Time to have some fun together. Let your imagination run wild — I want to dream with you.",
  },
  5: {
    title: "Chapter Five",
    subtitle: "Intimate & Romantic",
    message: "This is the part where it's just us. No walls, no filters. These answers stay locked until we meet.",
  },
};

// ─── Helper ──────────────────────────────────────────────────────────

function getLevelMeta(level: number) {
  const meta = levels[level - 1];
  return {
    levelTitle: meta.title,
    levelIcon: meta.icon,
  };
}

// ─── 50 Questions ────────────────────────────────────────────────────
// NOTE: These are placeholder questions in English.
// Replace the `question`, `placeholder`, and `options.label` values
// with your Arabic text. The app is fully RTL-ready.

export const questions: Question[] = [
  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 1 — First Meeting & Expectations (Q1-Q10)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 1,
    level: 1,
    ...getLevelMeta(1),
    question: "What was your very first impression of me when we started talking?",
    type: "text",
    placeholder: "Tell me everything… the good, the funny, and the real",
  },
  {
    id: 2,
    level: 1,
    ...getLevelMeta(1),
    question: "If our first meeting was a movie genre, what would it be?",
    type: "multiple-choice",
    options: [
      { id: "rom-com", label: "Romantic Comedy", icon: "heart" },
      { id: "action", label: "Action & Adventure", icon: "flame" },
      { id: "mystery", label: "Mystery & Thriller", icon: "search" },
      { id: "fantasy", label: "Fantasy", icon: "wand" },
    ],
  },
  {
    id: 3,
    level: 1,
    ...getLevelMeta(1),
    question: "What are you most nervous about when it comes to meeting me?",
    type: "text",
    placeholder: "Be honest… I probably feel the same way",
  },
  {
    id: 4,
    level: 1,
    ...getLevelMeta(1),
    question: "What is the first thing you want to do when you see me?",
    type: "multiple-choice",
    options: [
      { id: "hug", label: "Run and hug you", icon: "users" },
      { id: "stare", label: "Just stare at you in shock", icon: "eye" },
      { id: "laugh", label: "Probably laugh nervously", icon: "laugh" },
      { id: "cry", label: "Cry happy tears", icon: "droplets" },
    ],
  },
  {
    id: 5,
    level: 1,
    ...getLevelMeta(1),
    question: "Describe the perfect first day together in one sentence.",
    type: "text",
    placeholder: "Paint the picture for me…",
  },
  {
    id: 6,
    level: 1,
    ...getLevelMeta(1),
    question: "What song reminds you of us?",
    type: "text",
    placeholder: "Drop the title — I'll listen to it tonight",
  },
  {
    id: 7,
    level: 1,
    ...getLevelMeta(1),
    question: "What do you imagine my voice sounds like in person?",
    type: "text",
    placeholder: "I'm curious about your imagination",
  },
  {
    id: 8,
    level: 1,
    ...getLevelMeta(1),
    question: "How do you think our first awkward silence will go?",
    type: "multiple-choice",
    options: [
      { id: "break", label: "I'll break it with a joke", icon: "laugh" },
      { id: "stare", label: "We'll just smile at each other", icon: "smile" },
      { id: "phone", label: "I'll check my phone nervously", icon: "smartphone" },
      { id: "none", label: "There won't be any!", icon: "sparkles" },
    ],
  },
  {
    id: 9,
    level: 1,
    ...getLevelMeta(1),
    question: "What outfit are you planning to wear for our first meeting?",
    type: "text",
    placeholder: "Give me a sneak peek",
  },
  {
    id: 10,
    level: 1,
    ...getLevelMeta(1),
    question: "On a scale of 1-10, how ready are you for next month?",
    type: "multiple-choice",
    options: [
      { id: "ten", label: "10 — I was born ready", icon: "trophy" },
      { id: "eight", label: "8 — Almost there!", icon: "target" },
      { id: "five", label: "5 — Excited but terrified", icon: "zap" },
      { id: "over", label: "Off the charts!", icon: "rocket" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 2 — How You See Me (Q11-Q20)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 11,
    level: 2,
    ...getLevelMeta(2),
    question: "What is a habit or trait of mine that always makes you smile?",
    type: "text",
    placeholder: "Even the small things count…",
  },
  {
    id: 12,
    level: 2,
    ...getLevelMeta(2),
    question: "How would you describe me to your best friend?",
    type: "text",
    placeholder: "What words would you use?",
  },
  {
    id: 13,
    level: 2,
    ...getLevelMeta(2),
    question: "What is my most attractive quality to you?",
    type: "multiple-choice",
    options: [
      { id: "humor", label: "Your sense of humor", icon: "laugh" },
      { id: "care", label: "How you care about me", icon: "heart" },
      { id: "ambition", label: "Your ambition & drive", icon: "rocket" },
      { id: "voice", label: "Your voice / the way you talk", icon: "mic" },
    ],
  },
  {
    id: 14,
    level: 2,
    ...getLevelMeta(2),
    question: "What is something I do that annoys you (even a little)?",
    type: "text",
    placeholder: "I can handle it… I think",
  },
  {
    id: 15,
    level: 2,
    ...getLevelMeta(2),
    question: "Describe my role in your life right now in just 3 words.",
    type: "text",
    placeholder: "Just three words… choose wisely",
  },
  {
    id: 16,
    level: 2,
    ...getLevelMeta(2),
    question: "What is something I said that stuck with you?",
    type: "text",
    placeholder: "Words can stay forever…",
  },
  {
    id: 17,
    level: 2,
    ...getLevelMeta(2),
    question: "If I was a color, what color would I be and why?",
    type: "text",
    placeholder: "Think about the feeling, not just the color",
  },
  {
    id: 18,
    level: 2,
    ...getLevelMeta(2),
    question: "What do you think is my biggest fear?",
    type: "text",
    placeholder: "Let's see how well you know me",
  },
  {
    id: 19,
    level: 2,
    ...getLevelMeta(2),
    question: "What kind of energy do I bring to your day?",
    type: "multiple-choice",
    options: [
      { id: "calm", label: "Calm and peaceful", icon: "bird" },
      { id: "exciting", label: "Exciting and electric", icon: "zap" },
      { id: "warm", label: "Warm and comforting", icon: "sun" },
      { id: "chaotic", label: "Chaotic but I love it", icon: "tornado" },
    ],
  },
  {
    id: 20,
    level: 2,
    ...getLevelMeta(2),
    question: "What is one thing you wish I knew about myself?",
    type: "text",
    placeholder: "Something I might not see in myself…",
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 3 — Emotional Depth & Vulnerability (Q21-Q30)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 21,
    level: 3,
    ...getLevelMeta(3),
    question: "What is something not many people know about you, that you want me to discover?",
    type: "text",
    placeholder: "I'm all ears… and I'll keep it safe",
  },
  {
    id: 22,
    level: 3,
    ...getLevelMeta(3),
    question: "How do you prefer to be supported on a bad day?",
    type: "multiple-choice",
    options: [
      { id: "listen", label: "Just listen to me", icon: "ear" },
      { id: "space", label: "Give me space", icon: "moon" },
      { id: "laugh", label: "Try to make me laugh", icon: "laugh" },
      { id: "advice", label: "Give me advice", icon: "lightbulb" },
    ],
  },
  {
    id: 23,
    level: 3,
    ...getLevelMeta(3),
    question: "What is a fear you've never told anyone before?",
    type: "text",
    placeholder: "This stays between us forever…",
  },
  {
    id: 24,
    level: 3,
    ...getLevelMeta(3),
    question: "When was the last time you cried, and why?",
    type: "text",
    placeholder: "No judgment here… ever",
  },
  {
    id: 25,
    level: 3,
    ...getLevelMeta(3),
    question: "What does 'home' feel like to you?",
    type: "text",
    placeholder: "Is it a place, a person, or a feeling?",
  },
  {
    id: 26,
    level: 3,
    ...getLevelMeta(3),
    question: "What is your love language?",
    type: "multiple-choice",
    options: [
      { id: "words", label: "Words of affirmation", icon: "mail" },
      { id: "touch", label: "Physical touch", icon: "hand" },
      { id: "time", label: "Quality time", icon: "clock" },
      { id: "acts", label: "Acts of service", icon: "wrench" },
      { id: "gifts", label: "Receiving gifts", icon: "gift" },
    ],
  },
  {
    id: 27,
    level: 3,
    ...getLevelMeta(3),
    question: "What part of your past shaped who you are today?",
    type: "text",
    placeholder: "I want to understand your story…",
  },
  {
    id: 28,
    level: 3,
    ...getLevelMeta(3),
    question: "What is a dream you've been too afraid to say out loud?",
    type: "text",
    placeholder: "Say it here… I believe in you",
  },
  {
    id: 29,
    level: 3,
    ...getLevelMeta(3),
    question: "What do you need most from a partner?",
    type: "text",
    placeholder: "Honesty is everything here",
  },
  {
    id: 30,
    level: 3,
    ...getLevelMeta(3),
    question: "How do you act when you're falling in love?",
    type: "multiple-choice",
    options: [
      { id: "quiet", label: "I get quiet and shy", icon: "eye-off" },
      { id: "obsess", label: "I think about them 24/7", icon: "brain" },
      { id: "give", label: "I give everything I have", icon: "heart-handshake" },
      { id: "scared", label: "I get scared and pull back", icon: "turtle" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 4 — Fun & Hypothetical (Q31-Q40)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 31,
    level: 4,
    ...getLevelMeta(4),
    question: "If we could teleport anywhere right now, where would you take me?",
    type: "text",
    placeholder: "Anywhere in the universe…",
  },
  {
    id: 32,
    level: 4,
    ...getLevelMeta(4),
    question: "If you could steal one of my qualities, what would it be?",
    type: "text",
    placeholder: "What would you take?",
  },
  {
    id: 33,
    level: 4,
    ...getLevelMeta(4),
    question: "If we had a couple's superpower, what would it be?",
    type: "multiple-choice",
    options: [
      { id: "teleport", label: "Teleport to each other instantly", icon: "zap" },
      { id: "mind", label: "Read each other's minds", icon: "brain" },
      { id: "time", label: "Freeze time when we're together", icon: "pause" },
      { id: "dream", label: "Share the same dreams", icon: "cloud-moon" },
    ],
  },
  {
    id: 34,
    level: 4,
    ...getLevelMeta(4),
    question: "If we were stuck on a deserted island, what 3 things would you bring?",
    type: "text",
    placeholder: "Choose wisely… survival mode",
  },
  {
    id: 35,
    level: 4,
    ...getLevelMeta(4),
    question: "If you could relive any moment from our conversations, which one?",
    type: "text",
    placeholder: "Take me back to that moment…",
  },
  {
    id: 36,
    level: 4,
    ...getLevelMeta(4),
    question: "What would our couple name be?",
    type: "text",
    placeholder: "Get creative",
  },
  {
    id: 37,
    level: 4,
    ...getLevelMeta(4),
    question: "If I wrote you a letter, what do you hope it would say?",
    type: "text",
    placeholder: "What words would make your heart skip?",
  },
  {
    id: 38,
    level: 4,
    ...getLevelMeta(4),
    question: "What's a silly thing you'd want us to try together?",
    type: "text",
    placeholder: "The sillier the better",
  },
  {
    id: 39,
    level: 4,
    ...getLevelMeta(4),
    question: "If our relationship had a theme song, what genre would it be?",
    type: "multiple-choice",
    options: [
      { id: "rnb", label: "R&B / Soul", icon: "mic" },
      { id: "pop", label: "Pop", icon: "music" },
      { id: "arabic", label: "Arabic classic", icon: "compass" },
      { id: "lo-fi", label: "Lo-fi & chill", icon: "headphones" },
    ],
  },
  {
    id: 40,
    level: 4,
    ...getLevelMeta(4),
    question: "If you could time-travel to any era with me, which one?",
    type: "text",
    placeholder: "Past, present, or future?",
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 5 — Intimate & Romantic (Q41-Q50) — Time Capsule
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 41,
    level: 5,
    ...getLevelMeta(5),
    question: "What is the most romantic thing you've ever imagined us doing together?",
    type: "text",
    placeholder: "Don't hold back…",
  },
  {
    id: 42,
    level: 5,
    ...getLevelMeta(5),
    question: "When did you realize your feelings for me were real?",
    type: "text",
    placeholder: "Take me to that exact moment…",
  },
  {
    id: 43,
    level: 5,
    ...getLevelMeta(5),
    question: "What does my love feel like to you?",
    type: "text",
    placeholder: "Describe it like a feeling, a color, a place…",
  },
  {
    id: 44,
    level: 5,
    ...getLevelMeta(5),
    question: "What is a promise you want to make to me?",
    type: "text",
    placeholder: "Something real… from the heart",
  },
  {
    id: 45,
    level: 5,
    ...getLevelMeta(5),
    question: "How do you want me to hold you the first time?",
    type: "multiple-choice",
    options: [
      { id: "tight", label: "Tight and never let go", icon: "users" },
      { id: "gentle", label: "Gently, like I'm fragile", icon: "feather" },
      { id: "spin", label: "Lift me up and spin me", icon: "rotate-cw" },
      { id: "forehead", label: "Just hold my face and look at me", icon: "eye" },
    ],
  },
  {
    id: 46,
    level: 5,
    ...getLevelMeta(5),
    question: "What is one thing you want to whisper to me when we meet?",
    type: "text",
    placeholder: "Only I will hear it…",
  },
  {
    id: 47,
    level: 5,
    ...getLevelMeta(5),
    question: "What scares you most about falling deeper in love?",
    type: "text",
    placeholder: "Vulnerability is brave…",
  },
  {
    id: 48,
    level: 5,
    ...getLevelMeta(5),
    question: "If tonight was our last night of long-distance, what would you say?",
    type: "text",
    placeholder: "Make it count…",
  },
  {
    id: 49,
    level: 5,
    ...getLevelMeta(5),
    question: "Where do you see us one year from now?",
    type: "text",
    placeholder: "Dream big, dream together…",
  },
  {
    id: 50,
    level: 5,
    ...getLevelMeta(5),
    question: "Write me a love note. Anything. Right now.",
    type: "text",
    placeholder: "From your heart to mine…",
  },
];

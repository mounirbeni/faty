export type QuestionType = "text" | "multiple-choice";

export interface BaseQuestion {
  id: number;
  level: number; // 1 to 5
  question: string;
  type: QuestionType;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  icon: string; // Lucide icon name
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: MultipleChoiceOption[];
}

export type Question = TextQuestion | MultipleChoiceQuestion;

export interface Answer {
  questionId: number;
  value: string;
  reversed: boolean; // if true, the user played a "Reverse Card" and skipped it
}

// ─── Level metadata ──────────────────────────────────────────────────

export interface LevelMeta {
  level: number;
  title: string;
  icon: string;
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

// ─── THE 50 QUESTIONS ────────────────────────────────────────────────

export const questions: Question[] = [
  // --- LEVEL 1 (1-10) ---
  {
    id: 1,
    level: 1,
    type: "multiple-choice",
    question: "How do you imagine you'll feel in the first 5 seconds when we meet?",
    options: [
      { id: "nervous", label: "I'll be so nervous!", icon: "zap" },
      { id: "excited", label: "Excited and wanting to jump!", icon: "star" },
      { id: "speechless", label: "Completely speechless", icon: "message-square-dashed" },
      { id: "hug", label: "I'll hug you immediately without thinking", icon: "heart" },
    ],
  },
  {
    id: 2,
    level: 1,
    type: "text",
    question: "What is the one thing you are looking forward to doing together the most on our first date?",
    placeholder: "A walk, coffee, or just sitting together...",
  },
  {
    id: 3,
    level: 1,
    type: "multiple-choice",
    question: "What's one thing you're afraid you might do out of nervousness on our first meeting?",
    options: [
      { id: "stumble", label: "Trip or fall", icon: "footprints" },
      { id: "talk_fast", label: "Talk way too fast", icon: "wind" },
      { id: "quiet", label: "Stay quiet and not know what to say", icon: "moon" },
      { id: "blush", label: "Blush the entire time", icon: "smile" },
    ],
  },
  {
    id: 4,
    level: 1,
    type: "text",
    question: "If our first meeting had a 'soundtrack', what song would it be?",
    placeholder: "Type the song name...",
  },
  {
    id: 5,
    level: 1,
    type: "multiple-choice",
    question: "How would you prefer me to greet you?",
    options: [
      { id: "formal", label: "A funny formal handshake", icon: "handshake" },
      { id: "long_hug", label: "A long, tight hug", icon: "heart-handshake" },
      { id: "smile", label: "A warm smile and sweet words", icon: "sun" },
      { id: "surprise", label: "Surprise me", icon: "gift" },
    ],
  },
  {
    id: 6,
    level: 1,
    type: "text",
    question: "What outfit do you imagine I'll be wearing, or hope I'll wear?",
    placeholder: "Describe it for me...",
  },
  {
    id: 7,
    level: 1,
    type: "multiple-choice",
    question: "Where would you prefer we go on our first date?",
    options: [
      { id: "cafe", label: "A quiet cafe", icon: "coffee" },
      { id: "walk", label: "A walk by the beach", icon: "waves" },
      { id: "dinner", label: "A romantic dinner", icon: "utensils" },
      { id: "activity", label: "A fun activity like an amusement park", icon: "ferris-wheel" },
    ],
  },
  {
    id: 8,
    level: 1,
    type: "text",
    question: "What was your very first impression of me when we first talked?",
    placeholder: "Was I annoying, funny, or sweet?",
  },
  {
    id: 9,
    level: 1,
    type: "multiple-choice",
    question: "Do you think we'll stay up late talking?",
    options: [
      { id: "yes", label: "Definitely, we'll lose track of time", icon: "clock" },
      { id: "no", label: "No, we'll be too tired", icon: "bed" },
      { id: "maybe", label: "Maybe if the conversation is good", icon: "help-circle" },
    ],
  },
  {
    id: 10,
    level: 1,
    type: "text",
    question: "One word to describe how you feel right now about our upcoming meeting.",
    placeholder: "Type the word here...",
  },

  // --- LEVEL 2 (11-20) ---
  {
    id: 11,
    level: 2,
    type: "multiple-choice",
    question: "What trait initially drew you to me?",
    options: [
      { id: "humor", label: "Your sense of humor", icon: "laugh" },
      { id: "intellect", label: "The way you think", icon: "brain" },
      { id: "kindness", label: "Your kindness and care", icon: "heart" },
      { id: "mystery", label: "Your mystery", icon: "moon" },
    ],
  },
  {
    id: 12,
    level: 2,
    type: "text",
    question: "What is a weird habit you've noticed about me that you actually like?",
    placeholder: "Maybe the way I text, or something I repeat...",
  },
  {
    id: 13,
    level: 2,
    type: "multiple-choice",
    question: "If I were a fictional character, who would I be in your eyes?",
    options: [
      { id: "hero", label: "The brave hero", icon: "shield" },
      { id: "joker", label: "The funny sidekick", icon: "smile" },
      { id: "thinker", label: "The quiet sage", icon: "book" },
      { id: "rebel", label: "The romantic rebel", icon: "flame" },
    ],
  },
  {
    id: 14,
    level: 2,
    type: "text",
    question: "What's the funniest thing I've ever said to you?",
    placeholder: "Remember a funny moment...",
  },
  {
    id: 15,
    level: 2,
    type: "multiple-choice",
    question: "How do you know that I really care about you?",
    options: [
      { id: "time", label: "From the time we spend together", icon: "clock" },
      { id: "words", label: "From the words you say", icon: "message-circle" },
      { id: "actions", label: "From your actions and attention to detail", icon: "check-circle" },
      { id: "intuition", label: "It's just a gut feeling", icon: "sparkles" },
    ],
  },
  {
    id: 16,
    level: 2,
    type: "text",
    question: "When was the first time you realized we might be more than just friends?",
    placeholder: "Describe that moment to me...",
  },
  {
    id: 17,
    level: 2,
    type: "multiple-choice",
    question: "What is something you think I still don't know about you?",
    options: [
      { id: "habit", label: "A weird secret habit", icon: "ghost" },
      { id: "dream", label: "An unfulfilled childhood dream", icon: "star" },
      { id: "fear", label: "A silly fear", icon: "alert-triangle" },
      { id: "talent", label: "A hidden talent", icon: "award" },
    ],
  },
  {
    id: 18,
    level: 2,
    type: "text",
    question: "What's a tiny detail about my personality you think no one else notices?",
    placeholder: "Something special only you see...",
  },
  {
    id: 19,
    level: 2,
    type: "multiple-choice",
    question: "If I were to give you a gift right now, what would it be?",
    options: [
      { id: "flowers", label: "A bouquet of flowers", icon: "flower" },
      { id: "book", label: "A favorite book", icon: "book-open" },
      { id: "food", label: "Your favorite food", icon: "pizza" },
      { id: "jewel", label: "A delicate piece of jewelry", icon: "gem" },
    ],
  },
  {
    id: 20,
    level: 2,
    type: "text",
    question: "If you had to describe me to your best friend in one sentence, what would you say?",
    placeholder: "He is someone who...",
  },

  // --- LEVEL 3 (21-30) ---
  {
    id: 21,
    level: 3,
    type: "multiple-choice",
    question: "When do you feel the most safe with me over the phone?",
    options: [
      { id: "night", label: "During late-night conversations", icon: "moon" },
      { id: "sad", label: "When I'm sad and you listen", icon: "ear" },
      { id: "silent", label: "When we are silent together and it's not awkward", icon: "mic-off" },
      { id: "laugh", label: "When we laugh at silly things", icon: "smile" },
    ],
  },
  {
    id: 22,
    level: 3,
    type: "text",
    question: "What was something you were afraid to tell me at first, but are glad you did?",
    placeholder: "Be honest...",
  },
  {
    id: 23,
    level: 3,
    type: "multiple-choice",
    question: "How do you prefer me to comfort you when you're sad?",
    options: [
      { id: "listen", label: "Just listening to me", icon: "headphones" },
      { id: "advice", label: "Giving me advice and solutions", icon: "lightbulb" },
      { id: "distract", label: "Making me laugh and changing the subject", icon: "party-popper" },
      { id: "presence", label: "Just being there in silence", icon: "user-check" },
    ],
  },
  {
    id: 24,
    level: 3,
    type: "text",
    question: "What do you think is the biggest hurdle we've overcome in our distance?",
    placeholder: "The distance, doubts, lack of communication...",
  },
  {
    id: 25,
    level: 3,
    type: "multiple-choice",
    question: "What do you miss the most when we're busy and can't talk?",
    options: [
      { id: "voice", label: "Hearing your voice", icon: "volume-2" },
      { id: "texts", label: "Your random sudden texts", icon: "message-square" },
      { id: "laugh", label: "Our shared laughter", icon: "smile-plus" },
      { id: "support", label: "Feeling your support", icon: "shield-check" },
    ],
  },
  {
    id: 26,
    level: 3,
    type: "text",
    question: "When did you first realize that I had become a core part of your day?",
    placeholder: "When did it hit you...",
  },
  {
    id: 27,
    level: 3,
    type: "multiple-choice",
    question: "How do you usually express your anger or annoyance with me?",
    options: [
      { id: "silent", label: "By going silent and ignoring you", icon: "mic-off" },
      { id: "direct", label: "I tell you directly and clearly", icon: "message-circle-warning" },
      { id: "hints", label: "I drop hints so you figure it out", icon: "eye" },
      { id: "sarcasm", label: "With sarcasm and cold replies", icon: "snowflake" },
    ],
  },
  {
    id: 28,
    level: 3,
    type: "text",
    question: "What shared memory (even if just a call) do you always go back to when you miss me?",
    placeholder: "Write about that memory...",
  },
  {
    id: 29,
    level: 3,
    type: "multiple-choice",
    question: "Do you think the distance has made us stronger or weaker?",
    options: [
      { id: "stronger", label: "Stronger, we learned to communicate deeply", icon: "anchor" },
      { id: "weaker", label: "Sometimes weaker due to lack of meeting", icon: "wind" },
      { id: "both", label: "A mix of both", icon: "scale" },
    ],
  },
  {
    id: 30,
    level: 3,
    type: "text",
    question: "If you could read my mind for one minute, when would you have chosen to do it?",
    placeholder: "When did you really want to know my thoughts...",
  },

  // --- LEVEL 4 (31-40) ---
  {
    id: 31,
    level: 4,
    type: "multiple-choice",
    question: "If we were in a movie, what genre would it be?",
    options: [
      { id: "romcom", label: "A funny romantic comedy", icon: "clapperboard" },
      { id: "drama", label: "A deep emotional drama", icon: "tear" },
      { id: "adventure", label: "A crazy adventure", icon: "compass" },
      { id: "mystery", label: "A dark mystery", icon: "search" },
    ],
  },
  {
    id: 32,
    level: 4,
    type: "text",
    question: "If we ran away together anywhere in the world tomorrow, where would we go?",
    placeholder: "An isolated island, a busy city, snowy mountains...",
  },
  {
    id: 33,
    level: 4,
    type: "multiple-choice",
    question: "Who would be the absolute worst at assembling IKEA furniture together?",
    options: [
      { id: "me", label: "Definitely me, I'll lose my patience", icon: "frown" },
      { id: "you", label: "You, you'll pretend to know and ruin it", icon: "hammer" },
      { id: "team", label: "We'd make a great team!", icon: "star" },
      { id: "fight", label: "We'd fight and leave it as is", icon: "swords" },
    ],
  },
  {
    id: 34,
    level: 4,
    type: "text",
    question: "What's a petty crime we might commit together?",
    placeholder: "Stealing each other's food, sneaking snacks into a movie...",
  },
  {
    id: 35,
    level: 4,
    type: "multiple-choice",
    question: "If we had to eat only one food together for the rest of our lives, what would you choose?",
    options: [
      { id: "pizza", label: "Pizza of all kinds", icon: "pizza" },
      { id: "sushi", label: "Sushi", icon: "fish" },
      { id: "burger", label: "Burgers and fries", icon: "utensils-crossed" },
      { id: "sweets", label: "Only sweets and chocolate", icon: "cake" },
    ],
  },
  {
    id: 36,
    level: 4,
    type: "text",
    question: "If I turned into a pet, what animal would I be and why?",
    placeholder: "A lazy cat, a loyal dog, an annoying bird...",
  },
  {
    id: 37,
    level: 4,
    type: "multiple-choice",
    question: "On a long road trip, who controls the radio?",
    options: [
      { id: "me", label: "Me, my taste is better", icon: "music" },
      { id: "you", label: "You, so you don't complain", icon: "radio" },
      { id: "turns", label: "We take turns", icon: "refresh-cw" },
      { id: "silence", label: "We turn it off and talk", icon: "mic-off" },
    ],
  },
  {
    id: 38,
    level: 4,
    type: "text",
    question: "What's a weird nickname you'd want to call me, but you're too shy to?",
    placeholder: "Get creative...",
  },
  {
    id: 39,
    level: 4,
    type: "multiple-choice",
    question: "If we woke up and swapped bodies for a day, what's the first thing you'd do in my body?",
    options: [
      { id: "hair", label: "Try out stupid hairstyles", icon: "scissors" },
      { id: "voice", label: "Use your deep voice to scare people", icon: "mic" },
      { id: "strength", label: "See how strong I am", icon: "dumbbell" },
      { id: "sleep", label: "Just sleep, since you sleep so deeply", icon: "bed" },
    ],
  },
  {
    id: 40,
    level: 4,
    type: "text",
    question: "If you were to write a book about us, what would the title be?",
    placeholder: "A title that captures our story...",
  },

  // --- LEVEL 5 (41-50) TIME CAPSULE ---
  {
    id: 41,
    level: 5,
    type: "multiple-choice",
    question: "What are you most looking forward to discovering about me in person?",
    options: [
      { id: "touch", label: "Your true body language", icon: "hand" },
      { id: "scent", label: "The smell of your perfume", icon: "wind" },
      { id: "eyes", label: "The way you look directly at me", icon: "eye" },
      { id: "voice", label: "Your voice without phone filters", icon: "volume-2" },
    ],
  },
  {
    id: 42,
    level: 5,
    type: "text",
    question: "What is a question you've always wanted to ask me, but hesitated?",
    placeholder: "Now is the perfect time...",
  },
  {
    id: 43,
    level: 5,
    type: "multiple-choice",
    question: "Where do you see our relationship after our first meeting?",
    options: [
      { id: "closer", label: "Closer than ever before", icon: "heart" },
      { id: "planning", label: "Planning our second date immediately", icon: "calendar" },
      { id: "comfortable", label: "Completely comfortable and stress-free", icon: "smile" },
      { id: "dreaming", label: "Starting to think about our future", icon: "star" },
    ],
  },
  {
    id: 44,
    level: 5,
    type: "text",
    question: "What feeling does the idea of 'us' give you?",
    placeholder: "Safety, adventure, deep love...",
  },
  {
    id: 45,
    level: 5,
    type: "multiple-choice",
    question: "How do you imagine our silence when we're together in the same room?",
    options: [
      { id: "comfortable", label: "A comfortable, peaceful silence", icon: "cloud" },
      { id: "tension", label: "A silence full of positive tension", icon: "zap" },
      { id: "rare", label: "There won't be silence, we'll talk a lot", icon: "message-square" },
      { id: "romantic", label: "A romantic silence with deep eye contact", icon: "heart" },
    ],
  },
  {
    id: 46,
    level: 5,
    type: "text",
    question: "What is one sentence I said to you that still sticks in your mind?",
    placeholder: "Write it here...",
  },
  {
    id: 47,
    level: 5,
    type: "multiple-choice",
    question: "What scares you the most about moving forward in this relationship?",
    options: [
      { id: "distance", label: "The ongoing geographical distance", icon: "map" },
      { id: "changes", label: "Feelings or circumstances changing", icon: "wind" },
      { id: "loss", label: "Losing this deep connection", icon: "link-2-off" },
      { id: "nothing", label: "Nothing, I'm confident in us", icon: "shield-check" },
    ],
  },
  {
    id: 48,
    level: 5,
    type: "text",
    question: "Write a short message I will read while sitting next to you for the first time.",
    placeholder: "Something you want me to know in that exact moment...",
  },
  {
    id: 49,
    level: 5,
    type: "multiple-choice",
    question: "If our love had a color, what would it be?",
    options: [
      { id: "red", label: "A deep, passionate red", icon: "flame" },
      { id: "blue", label: "A calm, comforting blue", icon: "waves" },
      { id: "yellow", label: "A bright, joyful yellow", icon: "sun" },
      { id: "gold", label: "A warm, precious gold", icon: "star" },
    ],
  },
  {
    id: 50,
    level: 5,
    type: "text",
    question: "Finally, are you ready for this new chapter with us?",
    placeholder: "One last word before we meet...",
  },
];

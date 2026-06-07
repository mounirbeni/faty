export type DQType = 'emotional' | 'intimate' | 'open';

export interface DailyQuestion {
  id: number;
  question: string;
  type: DQType;
  options: string[];
  hasText: boolean;
}

export const DAILY_QUESTIONS: DailyQuestion[] = [
  // Emotional
  { id: 1, type: 'emotional', question: "How are you really doing today?", options: ["Better with you here", "Tired but okay", "Missing you deeply", "Honestly really happy"], hasText: true },
  { id: 2, type: 'emotional', question: "What emotion is sitting with you most right now?", options: ["Love", "Longing", "Peace", "Excitement"], hasText: true },
  { id: 3, type: 'emotional', question: "Something that made you smile today was…", options: [], hasText: true },
  { id: 4, type: 'emotional', question: "The hardest part of today was…", options: [], hasText: true },
  { id: 5, type: 'emotional', question: "Right now I need…", options: ["Your voice", "A long hug", "For you to tell me it's okay", "Nothing — just you"], hasText: true },
  { id: 6, type: 'emotional', question: "How much did you think about me today?", options: ["Constantly, honestly", "A lot between things", "You crossed my mind softly", "You never really left my mind"], hasText: false },
  { id: 7, type: 'emotional', question: "Something you want to say but haven't today…", options: [], hasText: true },
  { id: 8, type: 'emotional', question: "What does your heart feel like right now?", options: ["Full and warm", "Heavy", "Restless", "Quietly happy"], hasText: true },
  { id: 9, type: 'emotional', question: "The thing keeping you going today is…", options: ["Thinking of you", "Our plans", "The hope of seeing you", "Just knowing you're there"], hasText: true },
  { id: 10, type: 'emotional', question: "How safe do you feel with me right now?", options: ["Completely", "Mostly", "I'm getting there", "More than anyone else"], hasText: true },

  // Intimate
  { id: 11, type: 'intimate', question: "What part of me are you thinking about today?", options: ["Your voice", "Your hands", "Your eyes", "The way you hold me"], hasText: true },
  { id: 12, type: 'intimate', question: "What do you wish I could do for you right now?", options: ["Hold you all night", "Kiss you slowly", "Just be there next to you", "Tell you exactly what you mean to me"], hasText: true },
  { id: 13, type: 'intimate', question: "What did you imagine us doing together last night?", options: [], hasText: true },
  { id: 14, type: 'intimate', question: "What would you do to me first if I was there right now?", options: ["Pull you close", "Kiss you before you spoke", "Hold your face", "Not let you go"], hasText: true },
  { id: 15, type: 'intimate', question: "The physical thing you miss most is…", options: ["Being held", "A real kiss", "Sleeping next to you", "Your hands on me"], hasText: false },
  { id: 16, type: 'intimate', question: "What do you want me to do to you tonight?", options: ["Talk to me until we fall asleep", "Tell me everything you feel", "Stay on the call longer", "Say my name the way only you do"], hasText: true },
  { id: 17, type: 'intimate', question: "Where on my body do you want my attention most?", options: ["My neck", "My hands", "My lips", "Everywhere"], hasText: false },
  { id: 18, type: 'intimate', question: "Something you imagined us doing this week that you haven't said…", options: [], hasText: true },
  { id: 19, type: 'intimate', question: "The moment on our calls when you feel most wanted is…", options: ["When you look at me that way", "When you say my name softly", "When you can't stop smiling", "When you say you miss me"], hasText: true },
  { id: 20, type: 'intimate', question: "How do you want our first night together to feel?", options: ["Slow and completely ours", "Intense and electric", "Tender and safe", "Like coming home"], hasText: true },

  // Open
  { id: 21, type: 'open', question: "Tell me one thing about today you wouldn't tell anyone else.", options: [], hasText: true },
  { id: 22, type: 'open', question: "The most random thing you thought about today was…", options: [], hasText: true },
  { id: 23, type: 'open', question: "What song felt like us today?", options: [], hasText: true },
  { id: 24, type: 'open', question: "Something that reminded you of me today…", options: [], hasText: true },
  { id: 25, type: 'open', question: "The moment you felt most alive today was…", options: [], hasText: true },
  { id: 26, type: 'open', question: "Something you want more of in your life right now…", options: [], hasText: true },
  { id: 27, type: 'open', question: "What would you tell me if you knew I'd remember it forever?", options: [], hasText: true },
  { id: 28, type: 'open', question: "A question you want to ask me but haven't…", options: [], hasText: true },
  { id: 29, type: 'open', question: "The best part of the last 24 hours was…", options: [], hasText: true },
  { id: 30, type: 'open', question: "Something small that made the distance feel bigger today…", options: [], hasText: true },
];

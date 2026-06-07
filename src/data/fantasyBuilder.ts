export interface FantasyStep {
  id: number;
  prompt: string;
  options: string[];
  hasText: boolean;
  placeholder?: string;
}

export const FANTASY_STEPS: FantasyStep[] = [
  {
    id: 1,
    prompt: "If tonight we could be together, where would we be?",
    options: ["Your bedroom, just us", "A quiet hotel somewhere new", "My place for the first time", "Somewhere outside, late at night"],
    hasText: true,
    placeholder: "Paint the picture for me…",
  },
  {
    id: 2,
    prompt: "What's the vibe when I walk in?",
    options: ["Slow and tender", "Playful and laughing", "Intense — no words needed", "Completely calm, like coming home"],
    hasText: false,
  },
  {
    id: 3,
    prompt: "What do you want me to do first?",
    options: ["Hold you and not move", "Kiss you before you finish a sentence", "Lay next to you quietly", "Pull you close by the waist"],
    hasText: true,
    placeholder: "Or tell me in your words…",
  },
  {
    id: 4,
    prompt: "What do you want to feel in that moment?",
    options: ["Completely safe and held", "Overwhelmed in the best way", "Like nothing else exists", "Like you're finally mine"],
    hasText: false,
  },
  {
    id: 5,
    prompt: "What happens later that night?",
    options: ["We talk until 3am about everything", "We don't say much at all", "Things get bold and honest", "We just stay close the whole time"],
    hasText: true,
    placeholder: "The more honest the better…",
  },
  {
    id: 6,
    prompt: "How does the night end?",
    options: ["Falling asleep tangled together", "Still awake watching you breathe", "You refusing to let me go", "Me not wanting to ever leave"],
    hasText: true,
    placeholder: "How you really want it to end…",
  },
];

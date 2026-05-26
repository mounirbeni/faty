export interface PillowQuestion {
  id: number;
  text: string;
  depth: 'soft' | 'deep' | 'raw';
  tag: string;
}

export const PILLOW_QUESTIONS: PillowQuestion[] = [
  // Soft (10)
  {
    id: 1,
    depth: 'soft',
    tag: 'us',
    text: `What's the last thing you thought about before falling asleep last night?`,
  },
  {
    id: 2,
    depth: 'soft',
    tag: 'us',
    text: `Is there a song that makes you think of me every time?`,
  },
  {
    id: 3,
    depth: 'soft',
    tag: 'us',
    text: `What's one memory of us that you keep going back to?`,
  },
  {
    id: 4,
    depth: 'soft',
    tag: 'us',
    text: `What do you find most beautiful about me — not physically?`,
  },
  {
    id: 5,
    depth: 'soft',
    tag: 'us',
    text: `If you could relive one moment with me, what would it be?`,
  },
  {
    id: 6,
    depth: 'soft',
    tag: 'us',
    text: `What's something I do that makes you feel truly loved?`,
  },
  {
    id: 7,
    depth: 'soft',
    tag: 'us',
    text: `What's a side of you that you only show when you feel completely safe?`,
  },
  {
    id: 8,
    depth: 'soft',
    tag: 'us',
    text: `Do you believe in soulmates? And do you think I'm yours?`,
  },
  {
    id: 9,
    depth: 'soft',
    tag: 'us',
    text: `What does love feel like in your body when you're with me?`,
  },
  {
    id: 10,
    depth: 'soft',
    tag: 'us',
    text: `If you could give me one gift — anything in the world — what would it be?`,
  },
  // Deep (10)
  {
    id: 11,
    depth: 'deep',
    tag: 'fears',
    text: `What's something you've wanted to tell me but been afraid to say?`,
  },
  {
    id: 12,
    depth: 'deep',
    tag: 'fears',
    text: `What's your biggest fear when it comes to us?`,
  },
  {
    id: 13,
    depth: 'deep',
    tag: 'desire',
    text: `When do you feel most physically attracted to me?`,
  },
  {
    id: 14,
    depth: 'deep',
    tag: 'us',
    text: `Is there something I could do more of that would make you feel closer to me?`,
  },
  {
    id: 15,
    depth: 'deep',
    tag: 'us',
    text: `What's the most vulnerable you've ever felt with me?`,
  },
  {
    id: 16,
    depth: 'deep',
    tag: 'secrets',
    text: `Tell me something about your past that changed how you love people`,
  },
  {
    id: 17,
    depth: 'deep',
    tag: 'dreams',
    text: `When you imagine our future — what does it look like?`,
  },
  {
    id: 18,
    depth: 'deep',
    tag: 'us',
    text: `What's something you need from me that you rarely ask for?`,
  },
  {
    id: 19,
    depth: 'deep',
    tag: 'desire',
    text: `Have you ever held back how much you wanted me in a moment? When?`,
  },
  {
    id: 20,
    depth: 'deep',
    tag: 'us',
    text: `What emotion do I bring out in you that nobody else does?`,
  },
  // Raw (10)
  {
    id: 21,
    depth: 'raw',
    tag: 'desire',
    text: `Tell me the moment you felt the most intense desire for me`,
  },
  {
    id: 22,
    depth: 'raw',
    tag: 'secrets',
    text: `What's something you've imagined between us that you've never said out loud?`,
  },
  {
    id: 23,
    depth: 'raw',
    tag: 'desire',
    text: `Is there a version of me that turns you on the most — what is it?`,
  },
  {
    id: 24,
    depth: 'raw',
    tag: 'desire',
    text: `What would tonight look like if you could have exactly what you want?`,
  },
  {
    id: 25,
    depth: 'raw',
    tag: 'secrets',
    text: `What's a line you've never crossed with me that you've thought about?`,
  },
  {
    id: 26,
    depth: 'raw',
    tag: 'desire',
    text: `Tell me what goes through your head when I'm close to you in the dark`,
  },
  {
    id: 27,
    depth: 'raw',
    tag: 'desire',
    text: `What part of me do you find hardest to keep your hands off?`,
  },
  {
    id: 28,
    depth: 'raw',
    tag: 'desire',
    text: `If I said yes to anything tonight — what would you ask for?`,
  },
  {
    id: 29,
    depth: 'raw',
    tag: 'us',
    text: `Tell me the most honest thing you feel when you look at me`,
  },
  {
    id: 30,
    depth: 'raw',
    tag: 'desire',
    text: `What would make you feel completely, utterly desired by me right now?`,
  },
];

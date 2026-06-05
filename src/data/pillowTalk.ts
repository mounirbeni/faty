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
    tag: 'distance',
    text: `What do you do right after our call ends? What does the silence feel like?`,
  },
  {
    id: 2,
    depth: 'soft',
    tag: 'us',
    text: `Is there a song that makes you feel close to me even when you're far away?`,
  },
  {
    id: 3,
    depth: 'soft',
    tag: 'us',
    text: `What moment of ours do you replay when you miss me the most?`,
  },
  {
    id: 4,
    depth: 'soft',
    tag: 'us',
    text: `What do you find most beautiful about the way we love each other from a distance?`,
  },
  {
    id: 5,
    depth: 'soft',
    tag: 'reunion',
    text: `If you could be with me right now for just one hour, what would we do?`,
  },
  {
    id: 6,
    depth: 'soft',
    tag: 'us',
    text: `What small thing do I do on our calls that makes you feel truly loved?`,
  },
  {
    id: 7,
    depth: 'soft',
    tag: 'us',
    text: `What side of you comes out in our late-night calls that nobody else ever sees?`,
  },
  {
    id: 8,
    depth: 'soft',
    tag: 'distance',
    text: `Do you think loving someone across distance makes the love grow stronger?`,
  },
  {
    id: 9,
    depth: 'soft',
    tag: 'us',
    text: `What does it feel like in your body when your phone lights up with my name after a long day?`,
  },
  {
    id: 10,
    depth: 'soft',
    tag: 'reunion',
    text: `If you could send me anything right now — something I'd feel, not just see — what would it be?`,
  },
  // Deep (10)
  {
    id: 11,
    depth: 'deep',
    tag: 'distance',
    text: `What's something you've wanted to tell me but it felt too big to say through a screen?`,
  },
  {
    id: 12,
    depth: 'deep',
    tag: 'fears',
    text: `What's your biggest fear about what this distance could do to us?`,
  },
  {
    id: 13,
    depth: 'deep',
    tag: 'reunion',
    text: `When you think about our first night in the same room — what do you imagine?`,
  },
  {
    id: 14,
    depth: 'deep',
    tag: 'us',
    text: `Is there something you could do more of to make me feel less far away?`,
  },
  {
    id: 15,
    depth: 'deep',
    tag: 'distance',
    text: `What's the most vulnerable you've ever felt missing someone the way you miss me?`,
  },
  {
    id: 16,
    depth: 'deep',
    tag: 'distance',
    text: `Tell me about a time when the distance hit you in an unexpected moment`,
  },
  {
    id: 17,
    depth: 'deep',
    tag: 'dreams',
    text: `When you imagine the day we finally close this distance — what does it look like?`,
  },
  {
    id: 18,
    depth: 'deep',
    tag: 'us',
    text: `What's something you need from this relationship that's harder to give from far away?`,
  },
  {
    id: 19,
    depth: 'deep',
    tag: 'distance',
    text: `Have you ever stayed on a call longer than you needed to just because you didn't want to let go?`,
  },
  {
    id: 20,
    depth: 'deep',
    tag: 'us',
    text: `What emotion do I bring out in you that nobody else does — even from this far away?`,
  },
  // Raw (10)
  {
    id: 21,
    depth: 'raw',
    tag: 'longing',
    text: `Tell me the moment you felt the most physical longing for me`,
  },
  {
    id: 22,
    depth: 'raw',
    tag: 'secrets',
    text: `What's something you've imagined between us that you've never said on our calls?`,
  },
  {
    id: 23,
    depth: 'raw',
    tag: 'longing',
    text: `What does it feel like in your body when you see me on video and can't reach through the screen?`,
  },
  {
    id: 24,
    depth: 'raw',
    tag: 'reunion',
    text: `If we had tonight in the same room — what would tonight look like?`,
  },
  {
    id: 25,
    depth: 'raw',
    tag: 'secrets',
    text: `Tell me something you can't say out loud on a call but could type to me right now`,
  },
  {
    id: 26,
    depth: 'raw',
    tag: 'longing',
    text: `What goes through your head when I send you a photo and you can't reach through the screen?`,
  },
  {
    id: 27,
    depth: 'raw',
    tag: 'longing',
    text: `What part of me do you think about most when you're lying alone at night?`,
  },
  {
    id: 28,
    depth: 'raw',
    tag: 'reunion',
    text: `If the distance was gone tomorrow and I was standing at your door — what would you do?`,
  },
  {
    id: 29,
    depth: 'raw',
    tag: 'us',
    text: `Tell me the most honest thing you feel when you see my face light up your phone`,
  },
  {
    id: 30,
    depth: 'raw',
    tag: 'longing',
    text: `What would make you feel completely, utterly desired by me right now — from here?`,
  },
];

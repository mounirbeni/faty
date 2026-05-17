/** Secret whispers — long-press, hidden stars, midnight-only, swipe reveals */

export const SECRET_WHISPERS = [
  'I still replay that moment in my heart.',
  'You are my safest place.',
  'No distance changes what I feel.',
  'Every star here was placed for you.',
  'I fall in love with you again, quietly, every day.',
  'When you hold the heart, I feel held too.',
  'Your universe feels quiet tonight — but I am here.',
  'She visited your memories before sleeping…',
] as const;

export const MIDNIGHT_WHISPERS = [
  'Still awake, my love? 🌙',
  'Your universe feels quiet tonight.',
  'She visited your memories before sleeping…',
  'The stars are brighter when you are here.',
  'I would stay up all night just to feel close to you.',
] as const;

export const COMFORT_MESSAGES = [
  'You are safe here. Breathe with me.',
  'Nothing you feel is too much for me.',
  'I am holding you, even from far away.',
  'This moment is only ours.',
  'Let the world wait. You matter more.',
] as const;

export type WhisperId = `whisper-${number}` | `star-${number}` | `midnight-${number}`;

export function whisperForIndex(i: number): string {
  return SECRET_WHISPERS[i % SECRET_WHISPERS.length];
}

export function midnightWhisper(hour: number): string {
  return MIDNIGHT_WHISPERS[hour % MIDNIGHT_WHISPERS.length];
}

export interface WyrCard {
  id: number;
  emoji: string;
  a: string;
  b: string;
}

/**
 * Would You Rather — spicy edition.
 * Every card is a real "this or that" about us — her pick tells him
 * exactly what she craves. Suggestive, honest, never childish.
 */
export const WYR_CARDS: WyrCard[] = [
  { id: 1,  emoji: '🔥', a: 'Slow and teasing all night',        b: 'Intense and we can’t wait' },
  { id: 2,  emoji: '😈', a: 'You take full control',              b: 'I take full control' },
  { id: 3,  emoji: '💡', a: 'Lights on, eyes locked on mine',     b: 'Lights off, pure feeling' },
  { id: 4,  emoji: '🌅', a: 'Lazy warm morning, tangled in bed',  b: 'Late night, hungry and quiet' },
  { id: 5,  emoji: '💋', a: 'Dirty words whispered in my ear',    b: 'No words at all, just hands' },
  { id: 6,  emoji: '📱', a: 'Teasing texts that build all day',   b: 'I show up at your door with no warning' },
  { id: 7,  emoji: '🤲', a: 'Being held down by me',              b: 'Pinning me down yourself' },
  { id: 8,  emoji: '🧱', a: 'Kissed slowly, everywhere',          b: 'Pressed to the wall the second I arrive' },
  { id: 9,  emoji: '🛏️', a: 'A weekend we never leave the bed',   b: 'A risky moment somewhere we shouldn’t' },
  { id: 10, emoji: '👕', a: 'You in my shirt and nothing else',   b: 'Me undressing you button by button' },
  { id: 11, emoji: '🗣️', a: 'Telling me exactly what you want',   b: 'Showing me without a single word' },
  { id: 12, emoji: '🌙', a: 'Sleepy, slow, at 3am',               b: 'Waking you up at sunrise wanting more' },
  { id: 13, emoji: '⛓️', a: 'Blindfolded, guessing my every move', b: 'Watching me the whole time' },
  { id: 14, emoji: '🍷', a: 'A long candlelit build-up',          b: 'Straight to it, no patience left' },
];

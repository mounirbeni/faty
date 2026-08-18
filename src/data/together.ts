/* ────────────────────────────────────────────────────────────────────────────
   TOGETHER TONIGHT  ·  the two-player side of the app.
   Everything else here flows one way — she answers, he reads it later.
   This file is the opposite: cards for the TWO of you, at the same time,
   passing one phone back and forth or laughing through a late-night call.

   Every card carries:
     level — 1 Warm 😌 · 2 Hot 🔥 · 3 Burning 😈   (she picks the dial)
     mode  — 'same-room' | 'apart' | 'both'        (the app picks by your night)

   Rewrite any line here in your own words — the screens follow this file.
   ──────────────────────────────────────────────────────────────────────────── */

export type HeatLevel = 1 | 2 | 3;
export type PlayMode = 'same-room' | 'apart';
/** A card's availability: 'both' shows up on either kind of night. */
export type CardMode = PlayMode | 'both';

export interface HeatMeta {
  level: HeatLevel;
  emoji: string;
  name: string;
  blurb: string;
  color: string;
  glow: string;
  surface: string;
}

export const HEAT_META: Record<HeatLevel, HeatMeta> = {
  1: {
    level: 1, emoji: '😌', name: 'Warm', blurb: 'Sweet, flirty, easy to start',
    color: '#FF9F45', glow: 'rgba(255,159,69,0.35)', surface: '#1E1509',
  },
  2: {
    level: 2, emoji: '🔥', name: 'Hot', blurb: 'Teasing, sensual, no filter',
    color: '#FF2060', glow: 'rgba(255,32,96,0.35)', surface: '#220B13',
  },
  3: {
    level: 3, emoji: '😈', name: 'Burning', blurb: 'Bold, daring, zero rules',
    color: '#C026D3', glow: 'rgba(192,38,211,0.35)', surface: '#1B0A22',
  },
};

export const HEAT_ORDER: HeatLevel[] = [1, 2, 3];

/** Cards at or below the chosen dial — turning it up adds heat, never removes the sweet ones. */
export function atOrBelow<T extends { level: HeatLevel }>(cards: T[], level: HeatLevel): T[] {
  return cards.filter(c => c.level <= level);
}

/** Cards that fit tonight: same room, or a whole country apart. */
export function forMode<T extends { mode: CardMode }>(cards: T[], mode: PlayMode): T[] {
  return cards.filter(c => c.mode === 'both' || c.mode === mode);
}

/** "their" / "them" in a card become the partner's actual name. */
export function personalize(text: string, name: string): string {
  const trimmed = name.trim() || 'them';
  const poss = /s$/i.test(trimmed) ? `${trimmed}\u2019` : `${trimmed}\u2019s`;
  return text.replace(/\btheir\b/g, poss).replace(/\bthem\b/g, trimmed);
}

/** Draw one card at random, avoiding anything already seen — reshuffles when the deck runs dry. */
export function drawFrom<T extends { id: number }>(deck: T[], seen: number[]): { card: T | null; reshuffled: boolean } {
  if (deck.length === 0) return { card: null, reshuffled: false };
  const fresh = deck.filter(c => !seen.includes(c.id));
  const pool = fresh.length > 0 ? fresh : deck;
  return { card: pool[Math.floor(Math.random() * pool.length)], reshuffled: fresh.length === 0 };
}

// ─── 1 · DARE DUEL ────────────────────────────────────────────────────────────
// Turn-based Truth or Dare. The phone says whose turn it is, the other one
// judges. Dares have a countdown so nobody gets to chicken out quietly.

export interface DuelCard {
  id: number;
  type: 'truth' | 'dare';
  level: HeatLevel;
  mode: CardMode;
  text: string;
  hint?: string;
  /** countdown for dares, in seconds */
  seconds?: number;
}

export const DUEL_CARDS: DuelCard[] = [
  // ── Level 1 · Warm — truths ──
  { id: 101, type: 'truth', level: 1, mode: 'both', text: 'What was the exact moment you knew you wanted me?', hint: 'The real moment, not the polite one' },
  { id: 102, type: 'truth', level: 1, mode: 'both', text: 'Which photo of me do you look at the most?', hint: 'Show it right now' },
  { id: 103, type: 'truth', level: 1, mode: 'both', text: 'What do you miss most when we go a whole day without seeing each other?' },
  { id: 104, type: 'truth', level: 1, mode: 'both', text: 'Name one thing I do that you would never admit you love.' },
  { id: 105, type: 'truth', level: 1, mode: 'both', text: 'What did you think about me the first night we talked until sunrise?' },
  { id: 106, type: 'truth', level: 1, mode: 'both', text: 'If you had to describe us in three words to a stranger, which three?' },

  // ── Level 1 · Warm — dares ──
  { id: 111, type: 'dare', level: 1, mode: 'same-room', text: 'Look into my eyes for 30 seconds. No talking, no laughing.', hint: 'First one to laugh loses a point', seconds: 30 },
  { id: 112, type: 'dare', level: 1, mode: 'apart', text: 'Send a voice note saying my name the way you say it when you miss me. 🎙️', seconds: 45 },
  { id: 113, type: 'dare', level: 1, mode: 'both', text: 'Give me a compliment you have never said out loud before.', seconds: 30 },
  { id: 114, type: 'dare', level: 1, mode: 'same-room', text: 'Hold my hand and trace one word onto my palm. I have to guess it.', seconds: 60 },
  { id: 115, type: 'dare', level: 1, mode: 'apart', text: 'Take a photo of exactly what you can see right now and send it. 📸', seconds: 45 },
  { id: 116, type: 'dare', level: 1, mode: 'both', text: 'Say the last thought you had about me — out loud, word for word.', seconds: 30 },

  // ── Level 2 · Hot — truths ──
  { id: 201, type: 'truth', level: 2, mode: 'both', text: 'Where do you want to be kissed first tonight?', hint: 'Point, don’t explain' },
  { id: 202, type: 'truth', level: 2, mode: 'both', text: 'What is the one thing I do that gets to you every single time?' },
  { id: 203, type: 'truth', level: 2, mode: 'both', text: 'When you think about me at night, where does your mind go first?' },
  { id: 204, type: 'truth', level: 2, mode: 'both', text: 'What do you want more of from me that you have never asked for?', hint: 'This is the moment to ask' },
  { id: 205, type: 'truth', level: 2, mode: 'both', text: 'Slow and teasing, or no patience at all — which one is really you?' },
  { id: 206, type: 'truth', level: 2, mode: 'both', text: 'What outfit of mine lives in your head rent free?' },
  { id: 207, type: 'truth', level: 2, mode: 'both', text: 'Which part of your own body do you most want my attention on?' },

  // ── Level 2 · Hot — dares ──
  { id: 211, type: 'dare', level: 2, mode: 'same-room', text: 'Kiss me somewhere that isn’t my lips. Your choice, take your time.', seconds: 30 },
  { id: 212, type: 'dare', level: 2, mode: 'same-room', text: 'Whisper in my ear what you want to happen after this game ends. 🌙', seconds: 45 },
  { id: 213, type: 'dare', level: 2, mode: 'apart', text: 'Send a photo of what you’re wearing right now — exactly as you are. 📸', seconds: 60 },
  { id: 214, type: 'dare', level: 2, mode: 'apart', text: 'Voice note, low voice, 15 seconds: one thing you’d do to me if I walked in. 🎙️', seconds: 60 },
  { id: 215, type: 'dare', level: 2, mode: 'same-room', text: 'Trace one slow line down my arm and keep eye contact the whole time.', seconds: 30 },
  { id: 216, type: 'dare', level: 2, mode: 'both', text: 'Describe the last dream you had about us. Don’t skip the good part.', seconds: 60 },
  { id: 217, type: 'dare', level: 2, mode: 'same-room', text: 'Take my hand and put it exactly where you want it. No words allowed.', seconds: 30 },

  // ── Level 3 · Burning — truths ──
  { id: 301, type: 'truth', level: 3, mode: 'both', text: 'What is the boldest thing you’ve imagined us doing — the one you’ve never said?', hint: 'Say it. Tonight it’s allowed.' },
  { id: 302, type: 'truth', level: 3, mode: 'both', text: 'Who do you want in control tonight — honestly?' },
  { id: 303, type: 'truth', level: 3, mode: 'both', text: 'What is the fastest way to completely undo you?', hint: 'Hand over the map' },
  { id: 304, type: 'truth', level: 3, mode: 'both', text: 'Name a place we shouldn’t and a time we couldn’t. Go.' },
  { id: 305, type: 'truth', level: 3, mode: 'both', text: 'Which of my messages made you put the phone down and breathe?' },
  { id: 306, type: 'truth', level: 3, mode: 'both', text: 'If tonight had no limits and no morning, what happens first?' },

  // ── Level 3 · Burning — dares ──
  { id: 311, type: 'dare', level: 3, mode: 'same-room', text: 'Pin my hands for 10 seconds and don’t say a single word.', seconds: 30 },
  { id: 312, type: 'dare', level: 3, mode: 'same-room', text: 'Kiss me like it’s the first night we ever got to. No holding back.', seconds: 45 },
  { id: 313, type: 'dare', level: 3, mode: 'both', text: 'Say out loud, looking right at me, the thing you’d normally only text.', seconds: 45 },
  { id: 314, type: 'dare', level: 3, mode: 'apart', text: 'Turn the lights low, send one photo, and tell me what you were thinking when you took it. 🔥', seconds: 90 },
  { id: 315, type: 'dare', level: 3, mode: 'same-room', text: 'Choose: give me 30 seconds of your hands, or lose a point. Clock is running.', seconds: 30 },
  { id: 316, type: 'dare', level: 3, mode: 'apart', text: 'Call me right now and whisper the plan for the first hour I’m back. ☎️', seconds: 90 },
  { id: 317, type: 'dare', level: 3, mode: 'same-room', text: 'Take one thing off. You choose what. 😈', seconds: 30 },
];

// ─── 2 · NEVER HAVE I EVER ────────────────────────────────────────────────────
// Both of you answer in secret on the same phone, then the app flips both
// answers at once. No lying your way out of it.

export interface NhieCard {
  id: number;
  level: HeatLevel;
  mode: CardMode;
  text: string;
  /** the little sting when you both admit it */
  bothLine?: string;
}

export const NHIE_CARDS: NhieCard[] = [
  // ── Level 1 · Warm ──
  { id: 401, level: 1, mode: 'both', text: '…re-read our old messages when I couldn’t sleep.', bothLine: 'Both of you. At the same hours, probably.' },
  { id: 402, level: 1, mode: 'both', text: '…smiled at my phone in front of people because of you.' },
  { id: 403, level: 1, mode: 'both', text: '…practised what I was going to say to you before I said it.' },
  { id: 404, level: 1, mode: 'both', text: '…stayed on the call after you fell asleep just to listen.' },
  { id: 405, level: 1, mode: 'both', text: '…been jealous over something I never told you about.' },
  { id: 406, level: 1, mode: 'both', text: '…kept something of yours just because it smelled like you.' },
  { id: 407, level: 1, mode: 'both', text: '…told someone about us in way too much detail.' },

  // ── Level 2 · Hot ──
  { id: 411, level: 2, mode: 'both', text: '…thought about you in a way I’d be embarrassed to admit at work.' },
  { id: 412, level: 2, mode: 'both', text: '…deleted a message to you because it was too much.', bothLine: 'Both of you. Send them next time.' },
  { id: 413, level: 2, mode: 'both', text: '…imagined our first night back together in full detail.' },
  { id: 414, level: 2, mode: 'both', text: '…wanted to kiss you in a place where we absolutely shouldn’t.' },
  { id: 415, level: 2, mode: 'both', text: '…changed my outfit because I knew you’d see me.' },
  { id: 416, level: 2, mode: 'both', text: '…lost a whole hour to a daydream that starred you.' },
  { id: 417, level: 2, mode: 'both', text: '…been driven completely quiet by one thing you said.' },

  // ── Level 3 · Burning ──
  { id: 421, level: 3, mode: 'both', text: '…wanted you so much I couldn’t focus on anything else that day.' },
  { id: 422, level: 3, mode: 'both', text: '…held back something I wanted, just to see how long I could.' },
  { id: 423, level: 3, mode: 'both', text: '…played a whole night with you out in my head before sleeping.' },
  { id: 424, level: 3, mode: 'both', text: '…wished the door was locked and the phones were off.' },
  { id: 425, level: 3, mode: 'both', text: '…wanted to be told exactly what to do by you.' },
  { id: 426, level: 3, mode: 'both', text: '…hidden how badly I missed your hands.' },
  { id: 427, level: 3, mode: 'both', text: '…counted the days until I get you alone again.', bothLine: 'Both of you. Same number, probably.' },
];

// ─── 3 · SPIN THE HEAT ────────────────────────────────────────────────────────
// One wheel, eight slices. It picks who, what and how long.

export interface WheelSlice {
  id: number;
  emoji: string;
  /** short label on the wheel */
  label: string;
  /** the full instruction under it */
  action: string;
  level: HeatLevel;
  mode: CardMode;
  seconds: number;
}

export const WHEEL_SLICES: WheelSlice[] = [
  // ── Level 1 · Warm ──
  { id: 501, emoji: '💬', label: 'Confess', action: 'Say one thing you’ve never told them.', level: 1, mode: 'both', seconds: 30 },
  { id: 502, emoji: '🤗', label: 'Hold', action: 'Hold them, no phone, until the timer ends.', level: 1, mode: 'same-room', seconds: 60 },
  { id: 503, emoji: '🎙️', label: 'Voice', action: 'Voice note: their name plus one honest sentence.', level: 1, mode: 'apart', seconds: 45 },
  { id: 504, emoji: '👀', label: 'Stare', action: 'Eyes locked, no words. Whoever blinks first owes a dare.', level: 1, mode: 'both', seconds: 30 },
  { id: 505, emoji: '🎵', label: 'Song', action: 'Play the song that is most us and say why.', level: 1, mode: 'both', seconds: 60 },
  { id: 506, emoji: '😂', label: 'Roast', action: 'Roast them lovingly, then take it all back with a compliment.', level: 1, mode: 'both', seconds: 30 },

  // ── Level 2 · Hot ──
  { id: 511, emoji: '💋', label: 'Kiss', action: 'Kiss them wherever you want. Take the whole timer.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 512, emoji: '🤲', label: 'Touch', action: 'Hands only. Somewhere that makes them go quiet.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 513, emoji: '🗣️', label: 'Whisper', action: 'Whisper the thing you were thinking ten minutes ago.', level: 2, mode: 'both', seconds: 30 },
  { id: 514, emoji: '📸', label: 'Send', action: 'One photo, taken right now, exactly as you are.', level: 2, mode: 'apart', seconds: 60 },
  { id: 515, emoji: '🌡️', label: 'Rate', action: 'Rate how much you want them right now, then explain the number.', level: 2, mode: 'both', seconds: 30 },
  { id: 516, emoji: '🙈', label: 'Blind', action: 'Close their eyes with your hand and surprise them.', level: 2, mode: 'same-room', seconds: 30 },

  // ── Level 3 · Burning ──
  { id: 521, emoji: '😈', label: 'Command', action: 'Give them one order. They have to follow it.', level: 3, mode: 'both', seconds: 45 },
  { id: 522, emoji: '⏳', label: 'Tease', action: 'Tease them for the full timer — and stop the second it ends.', level: 3, mode: 'same-room', seconds: 45 },
  { id: 523, emoji: '🔥', label: 'Claim', action: 'Show them exactly where you want to be kissed. No talking.', level: 3, mode: 'same-room', seconds: 30 },
  { id: 524, emoji: '🎬', label: 'Describe', action: 'Describe the first five minutes of the next time we’re alone.', level: 3, mode: 'both', seconds: 60 },
  { id: 525, emoji: '👕', label: 'Lose one', action: 'One item off. Their choice which.', level: 3, mode: 'same-room', seconds: 30 },
  { id: 526, emoji: '☎️', label: 'Call', action: 'Call them and say the thing you’d only ever type.', level: 3, mode: 'apart', seconds: 90 },
];

// ─── 4 · DICE OF DESIRE ───────────────────────────────────────────────────────
// Three dice roll at once: an action, a place, a length of time.
// The combination is almost always ridiculous, and that is the point.

export interface DieFace {
  id: number;
  emoji: string;
  text: string;
  level: HeatLevel;
  mode: CardMode;
}

export const DICE_ACTIONS: DieFace[] = [
  { id: 601, emoji: '💋', text: 'Kiss',        level: 1, mode: 'same-room' },
  { id: 602, emoji: '🤗', text: 'Hold',        level: 1, mode: 'same-room' },
  { id: 603, emoji: '🗣️', text: 'Whisper to',  level: 1, mode: 'both' },
  { id: 604, emoji: '🎙️', text: 'Voice note about', level: 1, mode: 'apart' },
  { id: 605, emoji: '✍️', text: 'Write about', level: 1, mode: 'apart' },
  { id: 606, emoji: '🤲', text: 'Trace slowly', level: 2, mode: 'same-room' },
  { id: 607, emoji: '😏', text: 'Tease',       level: 2, mode: 'both' },
  { id: 608, emoji: '🎬', text: 'Describe what you’d do to', level: 2, mode: 'both' },
  { id: 609, emoji: '😈', text: 'Claim',       level: 3, mode: 'same-room' },
  { id: 610, emoji: '⏳', text: 'Take your time with', level: 3, mode: 'same-room' },
];

export const DICE_SPOTS: DieFace[] = [
  { id: 621, emoji: '🫦', text: 'their lips',      level: 1, mode: 'both' },
  { id: 622, emoji: '🤚', text: 'their hand',      level: 1, mode: 'both' },
  { id: 623, emoji: '🌙', text: 'their forehead',  level: 1, mode: 'both' },
  { id: 624, emoji: '💫', text: 'their neck',      level: 2, mode: 'both' },
  { id: 625, emoji: '🦋', text: 'their shoulder',  level: 2, mode: 'both' },
  { id: 626, emoji: '🌿', text: 'their back',      level: 2, mode: 'both' },
  { id: 627, emoji: '👂', text: 'their ear',       level: 2, mode: 'both' },
  { id: 628, emoji: '🔥', text: 'wherever they point', level: 3, mode: 'both' },
  { id: 629, emoji: '🎯', text: 'the spot they’d never say out loud', level: 3, mode: 'both' },
];

export const DICE_TIMERS: { id: number; seconds: number; label: string }[] = [
  { id: 641, seconds: 10, label: '10 seconds' },
  { id: 642, seconds: 20, label: '20 seconds' },
  { id: 643, seconds: 30, label: '30 seconds' },
  { id: 644, seconds: 45, label: '45 seconds' },
  { id: 645, seconds: 60, label: 'a full minute' },
  { id: 646, seconds: 90, label: 'a minute and a half' },
];

// ─── Shared flavour ───────────────────────────────────────────────────────────

/** Little lines the shell throws between rounds. */
export const ROUND_LINES: string[] = [
  'Your move.',
  'No backing out now.',
  'The phone has spoken.',
  'This one counts.',
  'Careful — they’re watching.',
  'Loser buys breakfast.',
  'Say it like you mean it.',
  'Tonight has no rules.',
];

export function roundLine(n: number): string {
  return ROUND_LINES[n % ROUND_LINES.length];
}

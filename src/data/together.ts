/* ────────────────────────────────────────────────────────────────────────────
   TOGETHER TONIGHT  ·  the two-player side of the app.
   Everything else here flows one way — she answers, he reads it later.
   This file is the opposite: cards for the TWO of you, at the same time,
   passing one phone back and forth or burning through a late-night call.

   Every card carries:
     level — 1 Warm 😌 · 2 Hot 🔥 · 3 Burning 😈 · 4 No Limits 🥵
     mode  — 'same-room' | 'apart' | 'both'   (the app picks by your night)

   Rewrite any line here in your own words — the screens follow this file.
   ──────────────────────────────────────────────────────────────────────────── */

export type HeatLevel = 1 | 2 | 3 | 4;
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
  4: {
    level: 4, emoji: '🥵', name: 'No Limits', blurb: 'Say it, do it, don’t explain it',
    color: '#E11D48', glow: 'rgba(225,29,72,0.4)', surface: '#26060F',
  },
};

export const HEAT_ORDER: HeatLevel[] = [1, 2, 3, 4];

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
  const poss = /s$/i.test(trimmed) ? `${trimmed}’` : `${trimmed}’s`;
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
// Turn-based truth or dare. The phone says whose turn it is, the other one
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
  // ══ Level 1 · Warm — truths ══
  { id: 1101, type: 'truth', level: 1, mode: 'both', text: 'What was the exact moment you knew you wanted me?', hint: 'The real moment, not the polite one' },
  { id: 1102, type: 'truth', level: 1, mode: 'both', text: 'Which photo of me do you look at the most?', hint: 'Show it right now' },
  { id: 1103, type: 'truth', level: 1, mode: 'both', text: 'What do you miss most when we go a whole day without seeing each other?' },
  { id: 1104, type: 'truth', level: 1, mode: 'both', text: 'Name one thing I do that you would never admit you love.' },
  { id: 1105, type: 'truth', level: 1, mode: 'both', text: 'What did you think about me the first night we talked until sunrise?' },
  { id: 1106, type: 'truth', level: 1, mode: 'both', text: 'If you had to describe us in three words to a stranger, which three?' },
  { id: 1107, type: 'truth', level: 1, mode: 'both', text: 'What’s the last thing about me you told someone else?' },
  { id: 1108, type: 'truth', level: 1, mode: 'both', text: 'Which of my messages made you smile so hard you had to hide your phone?' },
  { id: 1109, type: 'truth', level: 1, mode: 'both', text: 'What song can you not listen to anymore without thinking of me?' },
  { id: 1110, type: 'truth', level: 1, mode: 'both', text: 'What’s the smallest thing I do that you’d miss the most?' },

  // ══ Level 1 · Warm — dares ══
  { id: 1121, type: 'dare', level: 1, mode: 'same-room', text: 'Look into my eyes for 30 seconds. No talking, no laughing.', hint: 'First one to laugh loses a point', seconds: 30 },
  { id: 1122, type: 'dare', level: 1, mode: 'apart', text: 'Send a voice note saying my name the way you say it when you miss me. 🎙️', seconds: 45 },
  { id: 1123, type: 'dare', level: 1, mode: 'both', text: 'Give me a compliment you have never said out loud before.', seconds: 30 },
  { id: 1124, type: 'dare', level: 1, mode: 'same-room', text: 'Hold my hand and trace one word onto my palm. I have to guess it.', seconds: 60 },
  { id: 1125, type: 'dare', level: 1, mode: 'apart', text: 'Take a photo of exactly what you can see right now and send it. 📸', seconds: 45 },
  { id: 1126, type: 'dare', level: 1, mode: 'both', text: 'Say the last thought you had about me — out loud, word for word.', seconds: 30 },
  { id: 1127, type: 'dare', level: 1, mode: 'same-room', text: 'Fix my hair, slowly, without saying anything.', seconds: 30 },
  { id: 1128, type: 'dare', level: 1, mode: 'apart', text: 'Send me the last photo in your gallery. No editing, no excuses. 📱', seconds: 45 },
  { id: 1129, type: 'dare', level: 1, mode: 'both', text: 'Do your best impression of me. I get to rate it out of 10.', seconds: 45 },
  { id: 1130, type: 'dare', level: 1, mode: 'both', text: 'Say one thing you want from tonight. Just say it, don’t soften it.', seconds: 30 },

  // ══ Level 2 · Hot — truths ══
  { id: 1201, type: 'truth', level: 2, mode: 'both', text: 'Where do you want to be kissed first tonight?', hint: 'Point, don’t explain' },
  { id: 1202, type: 'truth', level: 2, mode: 'both', text: 'What is the one thing I do that gets to you every single time?' },
  { id: 1203, type: 'truth', level: 2, mode: 'both', text: 'When you think about me at night, where does your mind go first?' },
  { id: 1204, type: 'truth', level: 2, mode: 'both', text: 'What do you want more of from me that you have never asked for?', hint: 'This is the moment to ask' },
  { id: 1205, type: 'truth', level: 2, mode: 'both', text: 'Slow and teasing, or no patience at all — which one is really you?' },
  { id: 1206, type: 'truth', level: 2, mode: 'both', text: 'What outfit of mine lives in your head rent free?' },
  { id: 1207, type: 'truth', level: 2, mode: 'both', text: 'Which part of your own body do you most want my attention on?' },
  { id: 1208, type: 'truth', level: 2, mode: 'both', text: 'What’s the last thing you imagined me doing to you?' },
  { id: 1209, type: 'truth', level: 2, mode: 'both', text: 'Have you ever had to put your phone down because of something I sent?', hint: 'Which message?' },
  { id: 1210, type: 'truth', level: 2, mode: 'both', text: 'What’s the most inconvenient moment you’ve ever wanted me?' },
  { id: 1211, type: 'truth', level: 2, mode: 'both', text: 'Neck, hands, mouth, voice — rank them by what gets you first.' },
  { id: 1212, type: 'truth', level: 2, mode: 'both', text: 'What would you want me to whisper to you right before the lights go off?' },

  // ══ Level 2 · Hot — dares ══
  { id: 1221, type: 'dare', level: 2, mode: 'same-room', text: 'Kiss me somewhere that isn’t my lips. Your choice, take your time.', seconds: 30 },
  { id: 1222, type: 'dare', level: 2, mode: 'same-room', text: 'Whisper in my ear what you want to happen after this game ends. 🌙', seconds: 45 },
  { id: 1223, type: 'dare', level: 2, mode: 'apart', text: 'Send a photo of what you’re wearing right now — exactly as you are. 📸', seconds: 60 },
  { id: 1224, type: 'dare', level: 2, mode: 'apart', text: 'Voice note, low voice, 15 seconds: one thing you’d do to me if I walked in. 🎙️', seconds: 60 },
  { id: 1225, type: 'dare', level: 2, mode: 'same-room', text: 'Trace one slow line down my arm and keep eye contact the whole time.', seconds: 30 },
  { id: 1226, type: 'dare', level: 2, mode: 'both', text: 'Describe the last dream you had about us. Don’t skip the good part.', seconds: 60 },
  { id: 1227, type: 'dare', level: 2, mode: 'same-room', text: 'Take my hand and put it exactly where you want it. No words allowed.', seconds: 30 },
  { id: 1228, type: 'dare', level: 2, mode: 'same-room', text: 'Kiss my neck until I tell you to stop — or until the clock does.', seconds: 30 },
  { id: 1229, type: 'dare', level: 2, mode: 'apart', text: 'Bite your lip, take the photo, send it before the timer ends. 😏', seconds: 45 },
  { id: 1230, type: 'dare', level: 2, mode: 'apart', text: 'Text me the spiciest thought you’ve had today. No editing it down. ⏱️', seconds: 60 },
  { id: 1231, type: 'dare', level: 2, mode: 'both', text: 'Say out loud the thing you were too shy to say last time we were alone.', seconds: 45 },
  { id: 1232, type: 'dare', level: 2, mode: 'same-room', text: 'Sit in my lap and tell me why you picked dare.', seconds: 45 },

  // ══ Level 3 · Burning — truths ══
  { id: 1301, type: 'truth', level: 3, mode: 'both', text: 'What is the boldest thing you’ve imagined us doing — the one you’ve never said?', hint: 'Say it. Tonight it’s allowed.' },
  { id: 1302, type: 'truth', level: 3, mode: 'both', text: 'Who do you want in control tonight — honestly?' },
  { id: 1303, type: 'truth', level: 3, mode: 'both', text: 'What is the fastest way to completely undo you?', hint: 'Hand over the map' },
  { id: 1304, type: 'truth', level: 3, mode: 'both', text: 'Name a place we shouldn’t and a time we couldn’t. Go.' },
  { id: 1305, type: 'truth', level: 3, mode: 'both', text: 'Which of my messages made you put the phone down and breathe?' },
  { id: 1306, type: 'truth', level: 3, mode: 'both', text: 'If tonight had no limits and no morning, what happens first?' },
  { id: 1307, type: 'truth', level: 3, mode: 'both', text: 'Do you want to be teased until you beg, or given it immediately?', hint: 'Pick, and say why' },
  { id: 1308, type: 'truth', level: 3, mode: 'both', text: 'What’s something you want me to do that you’d rather I just do than be asked about?' },
  { id: 1309, type: 'truth', level: 3, mode: 'both', text: 'Tell me the fantasy you’ve replayed the most this month.' },
  { id: 1310, type: 'truth', level: 3, mode: 'both', text: 'What do you want to hear me say when nobody else can hear it?' },
  { id: 1311, type: 'truth', level: 3, mode: 'both', text: 'Hands held down, or hands free? And who’s holding who?' },
  { id: 1312, type: 'truth', level: 3, mode: 'both', text: 'What’s the one rule of ours you’d break first if I asked you to?' },

  // ══ Level 3 · Burning — dares ══
  { id: 1321, type: 'dare', level: 3, mode: 'same-room', text: 'Pin my hands for 10 seconds and don’t say a single word.', seconds: 30 },
  { id: 1322, type: 'dare', level: 3, mode: 'same-room', text: 'Kiss me like it’s the first night we ever got to. No holding back.', seconds: 45 },
  { id: 1323, type: 'dare', level: 3, mode: 'both', text: 'Say out loud, looking right at me, the thing you’d normally only text.', seconds: 45 },
  { id: 1324, type: 'dare', level: 3, mode: 'apart', text: 'Turn the lights low, send one photo, and tell me what you were thinking when you took it. 🔥', seconds: 90 },
  { id: 1325, type: 'dare', level: 3, mode: 'same-room', text: 'Choose: give me 30 seconds of your hands, or lose a point. Clock is running.', seconds: 30 },
  { id: 1326, type: 'dare', level: 3, mode: 'apart', text: 'Call me right now and whisper the plan for the first hour I’m back. ☎️', seconds: 90 },
  { id: 1327, type: 'dare', level: 3, mode: 'same-room', text: 'Take one thing off. You choose what. 😈', seconds: 30 },
  { id: 1328, type: 'dare', level: 3, mode: 'same-room', text: 'Blindfold me with whatever you can reach and do one thing I won’t see coming.', seconds: 60 },
  { id: 1329, type: 'dare', level: 3, mode: 'same-room', text: 'Tease me for the full timer — and stop the exact second it ends.', seconds: 45 },
  { id: 1330, type: 'dare', level: 3, mode: 'apart', text: 'Voice note: describe what you’d be doing right now if I were there. Don’t rush it. 🎙️', seconds: 90 },
  { id: 1331, type: 'dare', level: 3, mode: 'both', text: 'Give me one order for later tonight. I have to agree to it before the timer ends.', seconds: 45 },
  { id: 1332, type: 'dare', level: 3, mode: 'same-room', text: 'Put my hand exactly where you want it and hold it there while you look at me.', seconds: 30 },

  // ══ Level 4 · No Limits — truths ══
  { id: 1401, type: 'truth', level: 4, mode: 'both', text: 'Say the thing you want tonight in plain words. No hints, no cute version.', hint: 'The whole sentence' },
  { id: 1402, type: 'truth', level: 4, mode: 'both', text: 'What’s the one thing you’ve wanted to try with me and never dared to name?' },
  { id: 1403, type: 'truth', level: 4, mode: 'both', text: 'Tell me your loudest thought about me — the one you’d never repeat to anyone.' },
  { id: 1404, type: 'truth', level: 4, mode: 'both', text: 'What would you let me do to you right now that you’d let nobody else?' },
  { id: 1405, type: 'truth', level: 4, mode: 'both', text: 'Describe the last time you couldn’t stop thinking about me. Start to finish.' },
  { id: 1406, type: 'truth', level: 4, mode: 'both', text: 'What’s your hardest limit — and what’s right on the edge of it?', hint: 'Both answers matter' },
  { id: 1407, type: 'truth', level: 4, mode: 'both', text: 'If I gave you one command tonight that you had to obey, what do you hope it is?' },
  { id: 1408, type: 'truth', level: 4, mode: 'both', text: 'Where in this house — or that one — have you already pictured us?' },
  { id: 1409, type: 'truth', level: 4, mode: 'both', text: 'What’s the most desperate you’ve ever been for me? Be specific about when.' },
  { id: 1410, type: 'truth', level: 4, mode: 'both', text: 'Tell me exactly how you want to be woken up next time I’m next to you.' },

  // ══ Level 4 · No Limits — dares ══
  { id: 1421, type: 'dare', level: 4, mode: 'same-room', text: 'Take something off — and let me pick what goes next. 🥵', seconds: 45 },
  { id: 1422, type: 'dare', level: 4, mode: 'same-room', text: 'Hand me your wrists. I decide when you get them back.', seconds: 60 },
  { id: 1423, type: 'dare', level: 4, mode: 'both', text: 'Ask me for what you want. Out loud, in your own words, until I say yes.', seconds: 60 },
  { id: 1424, type: 'dare', level: 4, mode: 'apart', text: 'Send the photo you’d never let anyone else see. Only I get it, only tonight. 🔥', seconds: 120 },
  { id: 1425, type: 'dare', level: 4, mode: 'apart', text: 'Call me and don’t hang up until you’ve told me every single thing you want. ☎️', seconds: 120 },
  { id: 1426, type: 'dare', level: 4, mode: 'same-room', text: 'Whisper the filthiest honest sentence you have. Right against my ear.', seconds: 45 },
  { id: 1427, type: 'dare', level: 4, mode: 'same-room', text: 'For one full minute you don’t move — whatever I do. Try to keep quiet.', seconds: 60 },
  { id: 1428, type: 'dare', level: 4, mode: 'same-room', text: 'Show me — don’t tell me — the way you want to be touched.', seconds: 45 },
  { id: 1429, type: 'dare', level: 4, mode: 'apart', text: 'Voice note with the lights off: what you’d do to me first, second, and third. 🎙️', seconds: 120 },
  { id: 1430, type: 'dare', level: 4, mode: 'both', text: 'Make me a promise for tonight that you’d be embarrassed to say twice.', seconds: 45 },
  { id: 1431, type: 'dare', level: 4, mode: 'same-room', text: 'Kiss me and don’t stop until the timer does — no matter what I do to distract you.', seconds: 60 },
  { id: 1432, type: 'dare', level: 4, mode: 'both', text: 'Name the one thing you want most right now. If I agree, it happens the second this game ends.', seconds: 45 },
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
  // ══ Level 1 · Warm ══
  { id: 2101, level: 1, mode: 'both', text: '…re-read our old messages when I couldn’t sleep.', bothLine: 'Both of you. At the same hours, probably.' },
  { id: 2102, level: 1, mode: 'both', text: '…smiled at my phone in front of people because of you.' },
  { id: 2103, level: 1, mode: 'both', text: '…practised what I was going to say to you before I said it.' },
  { id: 2104, level: 1, mode: 'both', text: '…stayed on the call after you fell asleep just to listen.' },
  { id: 2105, level: 1, mode: 'both', text: '…been jealous over something I never told you about.' },
  { id: 2106, level: 1, mode: 'both', text: '…kept something of yours just because it smelled like you.' },
  { id: 2107, level: 1, mode: 'both', text: '…told someone about us in way too much detail.' },
  { id: 2108, level: 1, mode: 'both', text: '…checked if you were online more than once in a minute.' },
  { id: 2109, level: 1, mode: 'both', text: '…planned an entire future in my head during one phone call.' },
  { id: 2110, level: 1, mode: 'both', text: '…lied about being fine when I just missed you.' },

  // ══ Level 2 · Hot ══
  { id: 2201, level: 2, mode: 'both', text: '…thought about you in a way I’d be embarrassed to admit at work.' },
  { id: 2202, level: 2, mode: 'both', text: '…deleted a message to you because it was too much.', bothLine: 'Both of you. Send them next time.' },
  { id: 2203, level: 2, mode: 'both', text: '…imagined our first night back together in full detail.' },
  { id: 2204, level: 2, mode: 'both', text: '…wanted to kiss you in a place where we absolutely shouldn’t.' },
  { id: 2205, level: 2, mode: 'both', text: '…changed my outfit because I knew you’d see me.' },
  { id: 2206, level: 2, mode: 'both', text: '…lost a whole hour to a daydream that starred you.' },
  { id: 2207, level: 2, mode: 'both', text: '…been driven completely quiet by one thing you said.' },
  { id: 2208, level: 2, mode: 'both', text: '…taken a photo for you and then not been brave enough to send it.' },
  { id: 2209, level: 2, mode: 'both', text: '…replayed one of your voice notes more times than I’d admit.' },
  { id: 2210, level: 2, mode: 'both', text: '…gone quiet in a conversation because my mind went somewhere else entirely.' },
  { id: 2211, level: 2, mode: 'both', text: '…wanted you the second you walked into a room full of people.' },
  { id: 2212, level: 2, mode: 'both', text: '…thought about your hands at a completely inappropriate moment.' },
  { id: 2213, level: 2, mode: 'both', text: '…kept a message from you unopened just to save it for later.' },
  { id: 2214, level: 2, mode: 'both', text: '…been jealous of someone who got to be near you that day.' },

  // ══ Level 3 · Burning ══
  { id: 2301, level: 3, mode: 'both', text: '…wanted you so much I couldn’t focus on anything else that day.' },
  { id: 2302, level: 3, mode: 'both', text: '…held back something I wanted, just to see how long I could.' },
  { id: 2303, level: 3, mode: 'both', text: '…played a whole night with you out in my head before sleeping.' },
  { id: 2304, level: 3, mode: 'both', text: '…wished the door was locked and the phones were off.' },
  { id: 2305, level: 3, mode: 'both', text: '…wanted to be told exactly what to do by you.' },
  { id: 2306, level: 3, mode: 'both', text: '…hidden how badly I missed your hands.' },
  { id: 2307, level: 3, mode: 'both', text: '…counted the days until I get you alone again.', bothLine: 'Both of you. Same number, probably.' },
  { id: 2308, level: 3, mode: 'both', text: '…imagined you telling me no just to hear how you’d say it.' },
  { id: 2309, level: 3, mode: 'both', text: '…wanted to be pinned down by you.' },
  { id: 2310, level: 3, mode: 'both', text: '…thought about doing something with you that we’d have to keep to ourselves.' },
  { id: 2311, level: 3, mode: 'both', text: '…lost sleep over a conversation with you that never got finished.' },
  { id: 2312, level: 3, mode: 'both', text: '…wanted to hear you beg, just once.' },
  { id: 2313, level: 3, mode: 'both', text: '…said “I’m tired” when I was really thinking about something else entirely.' },
  { id: 2314, level: 3, mode: 'both', text: '…been jealous of a shirt of mine you were wearing.' },

  // ══ Level 4 · No Limits ══
  { id: 2401, level: 4, mode: 'both', text: '…wanted something from you I still haven’t said out loud.', bothLine: 'Both of you. Tonight is the night, then.' },
  { id: 2402, level: 4, mode: 'both', text: '…been completely undone by nothing but your voice.' },
  { id: 2403, level: 4, mode: 'both', text: '…imagined giving you total control for one whole night.' },
  { id: 2404, level: 4, mode: 'both', text: '…wanted to be the one giving the orders instead.' },
  { id: 2405, level: 4, mode: 'both', text: '…thought about a moment with you while I was somewhere I definitely shouldn’t have been.' },
  { id: 2406, level: 4, mode: 'both', text: '…had a fantasy about you I’d be nervous to see written down.' },
  { id: 2407, level: 4, mode: 'both', text: '…wanted you to not stop when I said we should.' },
  { id: 2408, level: 4, mode: 'both', text: '…wished you’d just take what you wanted without asking first.' },
  { id: 2409, level: 4, mode: 'both', text: '…been jealous of the version of you that only I get at 3am.' },
  { id: 2410, level: 4, mode: 'both', text: '…pictured us somewhere we could very easily have been caught.' },
  { id: 2411, level: 4, mode: 'both', text: '…wanted to hear my name from you in a way I couldn’t repeat in public.' },
  { id: 2412, level: 4, mode: 'both', text: '…decided the exact first thing that happens the next time that door closes.', bothLine: 'Both of you. Compare notes. Right now.' },
];

// ─── 3 · SPIN THE HEAT ────────────────────────────────────────────────────────
// One wheel, eight slices drawn from the deck. It picks who, what and how long.

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
  // ══ Level 1 · Warm ══
  { id: 3101, emoji: '💬', label: 'Confess', action: 'Say one thing you’ve never told them.', level: 1, mode: 'both', seconds: 30 },
  { id: 3102, emoji: '🤗', label: 'Hold', action: 'Hold them, no phone, until the timer ends.', level: 1, mode: 'same-room', seconds: 60 },
  { id: 3103, emoji: '🎙️', label: 'Voice', action: 'Voice note: their name plus one honest sentence.', level: 1, mode: 'apart', seconds: 45 },
  { id: 3104, emoji: '👀', label: 'Stare', action: 'Eyes locked, no words. Whoever blinks first owes a dare.', level: 1, mode: 'both', seconds: 30 },
  { id: 3105, emoji: '🎵', label: 'Song', action: 'Play the song that is most us and say why.', level: 1, mode: 'both', seconds: 60 },
  { id: 3106, emoji: '😂', label: 'Roast', action: 'Roast them lovingly, then take it all back with a compliment.', level: 1, mode: 'both', seconds: 30 },
  { id: 3107, emoji: '🧠', label: 'Guess', action: 'Guess what they’re thinking right now. Wrong answer costs the point.', level: 1, mode: 'both', seconds: 30 },
  { id: 3108, emoji: '🌹', label: 'Praise', action: 'Three compliments in a row. None of them about their face.', level: 1, mode: 'both', seconds: 45 },

  // ══ Level 2 · Hot ══
  { id: 3201, emoji: '💋', label: 'Kiss', action: 'Kiss them wherever you want. Take the whole timer.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 3202, emoji: '🤲', label: 'Touch', action: 'Hands only. Somewhere that makes them go quiet.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 3203, emoji: '🗣️', label: 'Whisper', action: 'Whisper the thing you were thinking ten minutes ago.', level: 2, mode: 'both', seconds: 30 },
  { id: 3204, emoji: '📸', label: 'Send', action: 'One photo, taken right now, exactly as you are.', level: 2, mode: 'apart', seconds: 60 },
  { id: 3205, emoji: '🌡️', label: 'Rate', action: 'Rate how much you want them right now, then explain the number.', level: 2, mode: 'both', seconds: 30 },
  { id: 3206, emoji: '🙈', label: 'Blind', action: 'Close their eyes with your hand and surprise them.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 3207, emoji: '🐍', label: 'Neck', action: 'Their neck, your mouth, the whole timer.', level: 2, mode: 'same-room', seconds: 30 },
  { id: 3208, emoji: '📖', label: 'Read out', action: 'Read them the boldest message you ever nearly sent.', level: 2, mode: 'both', seconds: 45 },
  { id: 3209, emoji: '👕', label: 'Borrow', action: 'Put on something of theirs — and only that — for the rest of the game.', level: 2, mode: 'same-room', seconds: 60 },

  // ══ Level 3 · Burning ══
  { id: 3301, emoji: '😈', label: 'Command', action: 'Give them one order. They have to follow it.', level: 3, mode: 'both', seconds: 45 },
  { id: 3302, emoji: '⏳', label: 'Tease', action: 'Tease them for the full timer — and stop the second it ends.', level: 3, mode: 'same-room', seconds: 45 },
  { id: 3303, emoji: '🔥', label: 'Claim', action: 'Show them exactly where you want to be kissed. No talking.', level: 3, mode: 'same-room', seconds: 30 },
  { id: 3304, emoji: '🎬', label: 'Describe', action: 'Describe the first five minutes of the next time you’re alone.', level: 3, mode: 'both', seconds: 60 },
  { id: 3305, emoji: '🩱', label: 'Lose one', action: 'One item off. They choose which.', level: 3, mode: 'same-room', seconds: 30 },
  { id: 3306, emoji: '☎️', label: 'Call', action: 'Call them and say the thing you’d only ever type.', level: 3, mode: 'apart', seconds: 90 },
  { id: 3307, emoji: '⛓️', label: 'Hold down', action: 'Hold their hands above their head and don’t explain yourself.', level: 3, mode: 'same-room', seconds: 30 },
  { id: 3308, emoji: '🌙', label: 'Lights off', action: 'Lights off, one photo, and one sentence about what you were thinking.', level: 3, mode: 'apart', seconds: 90 },
  { id: 3309, emoji: '🫦', label: 'Almost', action: 'Get as close to kissing them as possible without doing it. Whole timer.', level: 3, mode: 'same-room', seconds: 30 },

  // ══ Level 4 · No Limits ══
  { id: 3401, emoji: '🥵', label: 'Obey', action: 'They give one order. No negotiating, no laughing your way out.', level: 4, mode: 'both', seconds: 60 },
  { id: 3402, emoji: '🙊', label: 'Silence', action: 'One full minute without moving or making a sound — whatever they do.', level: 4, mode: 'same-room', seconds: 60 },
  { id: 3403, emoji: '🗝️', label: 'Confess all', action: 'Tell them the fantasy you’ve never named. All of it.', level: 4, mode: 'both', seconds: 90 },
  { id: 3404, emoji: '🙏', label: 'Ask', action: 'Ask them for what you want, in your own words, until they say yes.', level: 4, mode: 'both', seconds: 60 },
  { id: 3405, emoji: '🫥', label: 'Blindfold', action: 'Blindfold them and do one thing they will not see coming.', level: 4, mode: 'same-room', seconds: 60 },
  { id: 3406, emoji: '📿', label: 'Beg', action: 'Make them beg. Stop the moment they do — or don’t.', level: 4, mode: 'same-room', seconds: 60 },
  { id: 3407, emoji: '🔞', label: 'Only me', action: 'Send the photo nobody else gets to see. Delete nothing, explain everything.', level: 4, mode: 'apart', seconds: 120 },
  { id: 3408, emoji: '🎧', label: 'Say it', action: 'Call them and don’t hang up until you’ve said every last thing you want.', level: 4, mode: 'apart', seconds: 120 },
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
  { id: 4101, emoji: '💋', text: 'Kiss',                     level: 1, mode: 'same-room' },
  { id: 4102, emoji: '🤗', text: 'Hold',                     level: 1, mode: 'same-room' },
  { id: 4103, emoji: '🗣️', text: 'Whisper to',               level: 1, mode: 'both' },
  { id: 4104, emoji: '🎙️', text: 'Voice note about',         level: 1, mode: 'apart' },
  { id: 4105, emoji: '✍️', text: 'Write about',              level: 1, mode: 'apart' },
  { id: 4106, emoji: '🌹', text: 'Compliment',               level: 1, mode: 'both' },
  { id: 4107, emoji: '🤲', text: 'Trace slowly',             level: 2, mode: 'same-room' },
  { id: 4108, emoji: '😏', text: 'Tease',                    level: 2, mode: 'both' },
  { id: 4109, emoji: '🎬', text: 'Describe what you’d do to', level: 2, mode: 'both' },
  { id: 4110, emoji: '🫧', text: 'Breathe against',          level: 2, mode: 'same-room' },
  { id: 4111, emoji: '📸', text: 'Send a photo of',          level: 2, mode: 'apart' },
  { id: 4112, emoji: '😈', text: 'Claim',                    level: 3, mode: 'same-room' },
  { id: 4113, emoji: '⏳', text: 'Take your time with',      level: 3, mode: 'same-room' },
  { id: 4114, emoji: '🫦', text: 'Get one breath away from', level: 3, mode: 'same-room' },
  { id: 4115, emoji: '🔥', text: 'Confess what you want from', level: 3, mode: 'both' },
  { id: 4116, emoji: '🥵', text: 'Worship',                  level: 4, mode: 'same-room' },
  { id: 4117, emoji: '⛓️', text: 'Take control of',          level: 4, mode: 'same-room' },
  { id: 4118, emoji: '🙏', text: 'Beg for',                  level: 4, mode: 'both' },
  { id: 4119, emoji: '🎧', text: 'Say out loud, in detail, what you want from', level: 4, mode: 'apart' },
  { id: 4120, emoji: '🖤', text: 'Do whatever you want with', level: 4, mode: 'same-room' },
];

export const DICE_SPOTS: DieFace[] = [
  { id: 4201, emoji: '🫦', text: 'their lips',           level: 1, mode: 'both' },
  { id: 4202, emoji: '🤚', text: 'their hand',           level: 1, mode: 'both' },
  { id: 4203, emoji: '🌙', text: 'their forehead',       level: 1, mode: 'both' },
  { id: 4204, emoji: '😊', text: 'their smile',          level: 1, mode: 'both' },
  { id: 4205, emoji: '💫', text: 'their neck',           level: 2, mode: 'both' },
  { id: 4206, emoji: '🦋', text: 'their shoulder',       level: 2, mode: 'both' },
  { id: 4207, emoji: '🌿', text: 'their back',           level: 2, mode: 'both' },
  { id: 4208, emoji: '👂', text: 'their ear',            level: 2, mode: 'both' },
  { id: 4209, emoji: '🪶', text: 'their waist',          level: 2, mode: 'both' },
  { id: 4210, emoji: '🔥', text: 'wherever they point',  level: 3, mode: 'both' },
  { id: 4211, emoji: '🎯', text: 'the spot they’d never say out loud', level: 3, mode: 'both' },
  { id: 4212, emoji: '🖐️', text: 'their wrists, held still', level: 3, mode: 'same-room' },
  { id: 4213, emoji: '🩶', text: 'their inner arm',      level: 3, mode: 'both' },
  { id: 4214, emoji: '🌌', text: 'everywhere they’ve been thinking about all day', level: 3, mode: 'both' },
  { id: 4215, emoji: '🥵', text: 'the place they’d only let you touch', level: 4, mode: 'same-room' },
  { id: 4216, emoji: '🖤', text: 'whatever they ask for — no questions', level: 4, mode: 'both' },
  { id: 4217, emoji: '⛓️', text: 'them, with their hands behind their back', level: 4, mode: 'same-room' },
  { id: 4218, emoji: '🔞', text: 'the thing they were too shy to name last round', level: 4, mode: 'both' },
];

export const DICE_TIMERS: { id: number; seconds: number; label: string }[] = [
  { id: 4301, seconds: 10, label: '10 seconds' },
  { id: 4302, seconds: 20, label: '20 seconds' },
  { id: 4303, seconds: 30, label: '30 seconds' },
  { id: 4304, seconds: 45, label: '45 seconds' },
  { id: 4305, seconds: 60, label: 'a full minute' },
  { id: 4306, seconds: 90, label: 'a minute and a half' },
  { id: 4307, seconds: 120, label: 'two whole minutes' },
  { id: 4308, seconds: 180, label: 'three minutes — good luck' },
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
  'Don’t think. Answer.',
  'They’re waiting.',
  'Make it worth the point.',
  'Nobody else is watching.',
];

export function roundLine(n: number): string {
  return ROUND_LINES[n % ROUND_LINES.length];
}

/**
 * Session Tracker — Emotional Activity Intelligence
 * ──────────────────────────────────────────────────
 * Tracks which screens she visits, how long, and what she does.
 * Generates cinematic "Tonight's Story" recap for Telegram.
 *
 * All state is module-level (in-memory, session only). Not persisted.
 */

import { notifyOwner } from './notify';
import type { PresenceContext } from './presenceContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InteractionType =
  | 'kiss'
  | 'mood-update'
  | 'hidden-note'
  | 'truth-bomb-answer'
  | 'comfort-session'
  | 'heart-sync-complete'
  | 'game-played'
  | 'love-story-written'
  | 'dream-date-built'
  | 'catch-my-heart-played'
  | 'vibe-swiped'
  | 'love-letter-read';

interface ScreenVisit {
  phase: string;
  cinematicName: string;
  durationMs: number;
}

// ─── Cinematic screen names ────────────────────────────────────────────────────

const CINEMATIC: Record<string, string> = {
  'welcome':          '✨ the Universe Portal',
  'home':             '🗺️ the Universe Map',
  'game':             '📖 the Chapter Journals',
  'vault':            '🌌 the Memory Sky',
  'comfort-mode':     '🫂 the Comfort Room',
  'daily-note':       '🎧 Daily Whispers',
  'love-letter':      '💌 Love Letters',
  'truth-bombs':      '💣 Truth Bombs',
  'heart-sync':       '💓 Heart Sync',
  'kiss-jar':         '💋 the Kiss Jar',
  'fortune-teller':   '🔮 the Fortune Garden',
  'vibe-check':       '💫 Vibe Check',
  'rapid-fire':       '⚡ Rapid Fire',
  'mood-ring':        '🌈 Mood Ring',
  'perfect-match':    '🧩 Perfect Match',
  'date-spinner':     '🎡 Date Spinner',
  'would-you-rather': '🎭 Would You Rather',
  'catch-my-heart':   '💕 Catch My Heart',
  'dream-date':       '🌹 Dream Date',
  'love-story':       '📔 Love Story',
  'complete':         '🎉 the Completion Ceremony',
};

// Screens we skip from the story (too brief / utility)
const SKIP_IN_STORY = new Set(['welcome', 'admin-dashboard']);
const MIN_DURATION_MS = 8_000; // skip screens visited < 8s

// ─── Module state ─────────────────────────────────────────────────────────────

let _sessionStart = 0;
let _currentPhase = '';
let _currentPhaseEnter = 0;
const _visits: ScreenVisit[] = [];
const _interactions = new Map<InteractionType, { count: number; notes: string[] }>();
let _recapSent = false;

// ─── Public API ───────────────────────────────────────────────────────────────

/** Call once when the app mounts */
export function startSession(): void {
  _sessionStart = Date.now();
}

/** Call every time `phase` changes (from page.tsx useEffect) */
export function trackScreen(phase: string): void {
  const now = Date.now();

  // Close previous screen
  if (_currentPhase && _currentPhaseEnter && !SKIP_IN_STORY.has(_currentPhase)) {
    const dur = now - _currentPhaseEnter;
    if (dur >= MIN_DURATION_MS) {
      const name = CINEMATIC[_currentPhase] ?? _currentPhase;
      // Merge if same screen visited multiple times
      const existing = _visits.find(v => v.phase === _currentPhase);
      if (existing) {
        existing.durationMs += dur;
      } else {
        _visits.push({ phase: _currentPhase, cinematicName: name, durationMs: dur });
      }
    }
  }

  _currentPhase = phase;
  _currentPhaseEnter = now;
}

/** Track a specific emotional interaction */
export function trackInteraction(type: InteractionType, note?: string): void {
  const entry = _interactions.get(type) ?? { count: 0, notes: [] };
  entry.count += 1;
  if (note) entry.notes.push(note);
  _interactions.set(type, entry);
}

// ─── Presence intensity ───────────────────────────────────────────────────────

export type PresenceIntensity =
  | 'passing by'
  | 'staying softly'
  | 'emotionally connected'
  | 'deeply immersed tonight';

export function getPresenceIntensity(): PresenceIntensity {
  const totalMs = Date.now() - _sessionStart;
  const minutes = totalMs / 60_000;
  const uniqueScreens = _visits.length;
  const interactionCount = [..._interactions.values()].reduce((s, v) => s + v.count, 0);
  const emotionalScore = uniqueScreens * 2 + interactionCount * 3 + Math.floor(minutes);

  if (emotionalScore >= 40 || minutes >= 20) return 'deeply immersed tonight';
  if (emotionalScore >= 20 || minutes >= 10) return 'emotionally connected';
  if (emotionalScore >= 8  || minutes >= 4)  return 'staying softly';
  return 'passing by';
}

// ─── Story builder ─────────────────────────────────────────────────────────────

function fmtDuration(ms: number): string {
  const m = Math.round(ms / 60_000);
  if (m < 1) return '';
  return m === 1 ? ' · 1 minute' : ` · ${m} minutes`;
}

function buildInteractionLines(): string {
  const lines: string[] = [];

  const kisses = _interactions.get('kiss');
  if (kisses) lines.push(`💋 Sent ${kisses.count} kisses`);

  const notes = _interactions.get('hidden-note');
  if (notes) lines.push(
    notes.count === 1
      ? '💌 Discovered 1 hidden love note'
      : `💌 Discovered ${notes.count} hidden love notes`
  );

  const mood = _interactions.get('mood-update');
  if (mood) lines.push(`🌈 Updated her mood${mood.notes[0] ? ` to "${mood.notes[0]}"` : ''}`);

  const bombs = _interactions.get('truth-bomb-answer');
  if (bombs) lines.push(
    bombs.count === 1
      ? '💣 Answered 1 Truth Bomb'
      : `💣 Answered ${bombs.count} Truth Bombs`
  );

  const comfort = _interactions.get('comfort-session');
  if (comfort) {
    const dur = comfort.notes[0] ? ` for ${comfort.notes[0]}` : '';
    lines.push(`🫂 Spent time in the Comfort Room${dur}`);
  }

  const sync = _interactions.get('heart-sync-complete');
  if (sync) lines.push('💓 Completed a Heart Sync with you');

  const story = _interactions.get('love-story-written');
  if (story) lines.push('📔 Wrote your love story');

  const dream = _interactions.get('dream-date-built');
  if (dream) lines.push('🌹 Built her dream date');

  const catchGame = _interactions.get('catch-my-heart-played');
  if (catchGame) lines.push(`💕 Played Catch My Heart${catchGame.notes[0] ? ` · Score: ${catchGame.notes[0]}` : ''}`);

  const letter = _interactions.get('love-letter-read');
  if (letter) lines.push('💌 Read your love letters');

  return lines.join('\n');
}

export function buildTonightStory(ctx: PresenceContext): string {
  // Flush current screen
  trackScreen('__end__');

  const totalMs = Date.now() - _sessionStart;
  const totalMin = Math.round(totalMs / 60_000);
  const intensity = getPresenceIntensity();

  const nightPrefix = ctx.isLateNight
    ? '🌙 Very late tonight in your universe…'
    : ctx.isNight
    ? '🌙 Tonight in your universe…'
    : '💗 In your universe today…';

  // Time & location block
  const timeBlock = [
    `💗 She entered at ${ctx.enteredAtLabel}`,
    `📍 From ${ctx.locationLabel}`,
    `🕒 Her time: ${ctx.localTime}${ctx.localTime !== ctx.moroccoTime ? ` · 🇲🇦 Morocco: ${ctx.moroccoTime}` : ''}`,
    `📱 On ${ctx.deviceLabel}`,
  ].join('\n');

  // Screens visited
  const screenLines = _visits
    .filter(v => !SKIP_IN_STORY.has(v.phase))
    .map(v => `  • ${v.cinematicName}${fmtDuration(v.durationMs)}`)
    .join('\n');

  const screensBlock = screenLines
    ? `🗺️ She explored:\n${screenLines}`
    : '';

  // Interaction summary
  const interactionBlock = buildInteractionLines();

  // Duration + intensity
  const durationLine = totalMin > 0
    ? `⏱️ She stayed for ${totalMin} minute${totalMin !== 1 ? 's' : ''}`
    : '';
  const intensityLine = `💓 Presence: ${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`;

  // Emotional close — changes with context
  const closeMsg = ctx.isLateNight
    ? '🌙 She thought of you before sleeping'
    : ctx.isNight
    ? '✨ She carried you in her heart tonight'
    : '💗 She is always with you, even from far away';

  const divider = '─────────────────────────';

  const parts = [
    nightPrefix,
    divider,
    timeBlock,
    screensBlock && (divider + '\n' + screensBlock),
    interactionBlock && (divider + '\n💗 She felt and did:\n' + interactionBlock),
    divider,
    [durationLine, intensityLine].filter(Boolean).join('\n'),
    '\n' + closeMsg,
  ].filter(Boolean);

  return parts.join('\n\n');
}

/** Send "Tonight's Story" via Telegram. Safe to call from beforeunload. */
export function sendSessionRecap(ctx: PresenceContext): void {
  if (_recapSent) return;
  const totalMs = Date.now() - _sessionStart;
  if (totalMs < 20_000) return; // skip if she only opened app for < 20s
  _recapSent = true;
  const story = buildTonightStory(ctx);
  notifyOwner(story);
}

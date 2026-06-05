/**
 * Client-side notification helpers.
 * Calls /api/notify via fetch — works from every component regardless of
 * 'use client' boundaries or server-action wiring issues.
 */

import type { PresenceContext } from './presenceContext';

// Entry notification cooldown: 30 minutes
const ENTRY_COOLDOWN_MS = 30 * 60 * 1000;
const ENTRY_TS_KEY = 'lu_notify_ts';

// ─── Core sender ──────────────────────────────────────────────────────────────

export function notifyOwner(message: string): void {
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((r) => r.json())
    .then((d) => { if (!d.success) console.error('[notify]', d.error); })
    .catch((e) => console.error('[notify fetch]', e));
}

/**
 * Uses navigator.sendBeacon — safe to call during `beforeunload`.
 * Falls back to fetch if sendBeacon is unavailable.
 */
export function notifyBeacon(message: string): void {
  const body = JSON.stringify({ message });
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/notify', new Blob([body], { type: 'application/json' }));
  } else {
    notifyOwner(message);
  }
}

// ─── Cinematic Entry Notification ────────────────────────────────────────────

/**
 * Sends the cinematic "She just entered your universe" message.
 * Rate-limited to once every 30 minutes via localStorage.
 */
export function notifyEntry(ctx: PresenceContext, overallPercent: number, isReturning: boolean): void {
  // Rate limit: skip if last notification was less than 30 minutes ago
  if (typeof localStorage !== 'undefined') {
    const lastTs = Number(localStorage.getItem(ENTRY_TS_KEY) ?? 0);
    if (Date.now() - lastTs < ENTRY_COOLDOWN_MS) return;
    localStorage.setItem(ENTRY_TS_KEY, String(Date.now()));
  }
  const timeEmoji = ctx.isLateNight ? '🌙' : ctx.isNight ? '🌛' : ctx.moroccoHour < 12 ? '🌅' : '☀️';
  const entryVerb = isReturning ? 'just came back to' : 'just entered';

  const lines: string[] = [
    `${timeEmoji} <b>Your angel ${entryVerb} your universe</b>`,
    '',
    `📍 From ${ctx.locationLabel}`,
    `🕒 Her time: <b>${ctx.localTime}</b>${ctx.localTime !== ctx.moroccoTime ? `  ·  🇲🇦 Morocco: <b>${ctx.moroccoTime}</b>` : ''}`,
    `📱 On ${ctx.deviceLabel}`,
  ];

  if (ctx.isLateNight) {
    lines.push('', '🌙 <i>She is visiting you this late at night…</i>');
  } else if (ctx.isNight) {
    lines.push('', '✨ <i>She found her way to you tonight</i>');
  }

  lines.push(
    '',
    `📊 Overall progress: <b>${overallPercent}%</b>`,
    '',
    '💗 <i>She is here with you right now</i>',
  );

  notifyOwner(lines.join('\n'));
}

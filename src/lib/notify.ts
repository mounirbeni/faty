/**
 * Client-side notification helpers.
 * Calls /api/notify via fetch — works from every component regardless of
 * 'use client' boundaries or server-action wiring issues.
 */

import type { PresenceContext } from './presenceContext';

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
 * Called once per session after presence context is resolved.
 */
export function notifyEntry(ctx: PresenceContext, overallPercent: number, isReturning: boolean): void {
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

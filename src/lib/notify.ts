/**
 * Client-side notification helper.
 * Calls /api/notify via fetch — works from every component regardless of
 * 'use client' boundaries or server-action wiring issues.
 */
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

/**
 * Returns a stable index for today, deterministically derived from the date.
 * Changes every day at midnight. Same index for everyone viewing on the same day.
 *
 * @param length   Size of the content array
 * @param salt     Unique string per content type so each screen picks differently
 */
export function getDailyIndex(length: number, salt = ''): number {
  const d = new Date();
  const seed = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${salt}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash) % length;
}

/** Returns today as YYYY-MM-DD, useful for change-detection */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

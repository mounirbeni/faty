'use client';

/**
 * Haptic feedback utilities.
 * All calls are no-ops if navigator.vibrate is not supported.
 */

const canVibrate = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

/** Soft tap — button interactions */
export function softTap() {
  if (canVibrate()) navigator.vibrate([50]);
}

/** Heartbeat — romantic / intimate actions */
export function heartbeat() {
  if (canVibrate()) navigator.vibrate([100, 50, 100]);
}

/** Success — completing a chapter or mini-game */
export function successVibe() {
  if (canVibrate()) navigator.vibrate([30, 20, 80, 20, 120]);
}

/** Swipe right — love it */
export function swipeLove() {
  if (canVibrate()) navigator.vibrate([40, 30, 60]);
}

/** Swipe left — nope */
export function swipeNope() {
  if (canVibrate()) navigator.vibrate([80]);
}

/** Hook form — returns all haptic functions */
export function useHaptics() {
  return { softTap, heartbeat, successVibe, swipeLove, swipeNope };
}

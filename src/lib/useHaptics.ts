'use client';

/**
 * Haptic feedback — ALL DISABLED.
 * All functions are no-ops.
 */

export function softTap() {}
export function heartbeat() {}
export function successVibe() {}
export function swipeLove() {}
export function swipeNope() {}
export function useHaptics() {
  return { softTap, heartbeat, successVibe, swipeLove, swipeNope };
}

export interface HeatItem {
  id: number;
  emoji: string;
  label: string;
}

/**
 * Heat Dial — she drags each crave-meter from cold to burning.
 * The numbers go straight to him: a live map of how much she wants it.
 */
export const HEAT_ITEMS: HeatItem[] = [
  { id: 1, emoji: '🔥', label: 'How much do you want me right now' },
  { id: 2, emoji: '😈', label: 'How badly do you want me to take control' },
  { id: 3, emoji: '💋', label: 'How much you crave being kissed on your neck' },
  { id: 4, emoji: '🌙', label: 'How much you want a night with zero rules' },
  { id: 5, emoji: '🤲', label: 'How intensely you miss my touch' },
  { id: 6, emoji: '😏', label: 'How much you want to be teased until you beg' },
  { id: 7, emoji: '⚡', label: 'How wild you want our first night back to be' },
  { id: 8, emoji: '🗣️', label: 'How much you want me to whisper exactly what I’d do' },
];

/** Maps a 0–100 value to an emoji + word for live feedback. */
export function heatLevel(v: number): { emoji: string; word: string; color: string } {
  if (v < 15) return { emoji: '🥶', word: 'Ice cold',  color: '#5B8DEF' };
  if (v < 35) return { emoji: '😌', word: 'Warming up', color: '#7B79FF' };
  if (v < 55) return { emoji: '😏', word: 'Getting hot', color: '#FF9F45' };
  if (v < 75) return { emoji: '🥵', word: 'Burning',     color: '#FF5A36' };
  if (v < 92) return { emoji: '🔥', word: 'On fire',     color: '#FF2060' };
  return { emoji: '💥', word: 'Can’t take it', color: '#FF1466' };
}

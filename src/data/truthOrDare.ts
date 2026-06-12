export interface TodCard {
  id: number;
  type: 'truth' | 'dare';
  text: string;
  hint?: string;
}

/**
 * Truth or Dare — grown-up edition.
 * Truths pull a real, honest desire out of her. Dares give her a bold,
 * flirty thing to actually do for him right now. Spicy with meaning.
 */
export const TOD_CARDS: TodCard[] = [
  // ── Truths ──
  { id: 1,  type: 'truth', text: 'Where exactly do you want my hands the very first second we’re alone?', hint: 'Be specific — no polite version' },
  { id: 2,  type: 'truth', text: 'What were you wearing the last time you thought about me like that?', hint: 'And what were you thinking?' },
  { id: 3,  type: 'truth', text: 'Describe the boldest thought you’ve had about us this week.', hint: 'The honest one, not the safe one' },
  { id: 4,  type: 'truth', text: 'What’s one thing you want me to do to you that you’ve never asked for?', hint: 'This is your chance to say it' },
  { id: 5,  type: 'truth', text: 'Which part of me do you crave the most right now — and why?', hint: 'Say it like you mean it' },
  { id: 6,  type: 'truth', text: 'What’s a fantasy about us you’d be a little nervous to admit out loud?', hint: 'I want the real one' },
  { id: 7,  type: 'truth', text: 'When you miss me at night, what do you imagine happening?', hint: 'Walk me through it' },
  { id: 8,  type: 'truth', text: 'What’s the fastest way I could completely undo you?', hint: 'Give me the map' },

  // ── Dares ──
  { id: 9,  type: 'dare', text: 'Send me a photo of what you’re wearing right now. 📸', hint: 'Exactly as you are' },
  { id: 10, type: 'dare', text: 'Record a 10-second voice note telling me one thing you want to do to me. 🎙️', hint: 'Lower your voice for it' },
  { id: 11, type: 'dare', text: 'Bite your lip, take a selfie, send it to me. 😏', hint: 'Don’t overthink it' },
  { id: 12, type: 'dare', text: 'Text me the spiciest thing on your mind in the next 5 minutes. ⏱️', hint: 'No editing it down' },
  { id: 13, type: 'dare', text: 'Touch your own lips slowly and imagine it’s me — then tell me how it felt. 💋', hint: 'Be honest about it' },
  { id: 14, type: 'dare', text: 'Send me a photo of the exact spot you want me to kiss first. 🎯', hint: 'Point the camera there' },
  { id: 15, type: 'dare', text: 'Whisper my name out loud right now like you would at midnight. 🌙', hint: 'Then tell me you did' },
  { id: 16, type: 'dare', text: 'Describe out loud what you’d do if I walked through your door this second. 🚪', hint: 'Then type the short version for me' },
];

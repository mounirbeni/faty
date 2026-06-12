/* ────────────────────────────────────────────────────────────────────────────
   FOR YOU  ·  everything here flows FROM him TO her.
   These are heartfelt STARTERS — edit every line so it's truly your words.
   Just change the strings below; the screens update automatically.
   ──────────────────────────────────────────────────────────────────────────── */

// ─── "Open When…" letters ─────────────────────────────────────────────────────
export interface OpenWhenLetter {
  id: number;
  emoji: string;
  /** the moment she should open this */
  when: string;
  /** the letter she reads — write it like you're whispering to her */
  body: string;
  signoff: string;
}

export const OPEN_WHEN: OpenWhenLetter[] = [
  {
    id: 1, emoji: '🌙', when: 'you can’t sleep',
    body: 'Hey honey. Stop fighting the dark — I’m right here with you in it, even with all of Marrakech and Meknès between us. Close your eyes and picture my arm around you, your back against my chest, my breath slow against your neck, exactly like those nights I was there. Match your breathing to that. You don’t have to carry tonight by yourself.',
    signoff: 'Now sleep, my love. I’ll see you in your dreams. 🌙',
  },
  {
    id: 2, emoji: '💔', when: 'you’re missing me',
    body: 'I know. I feel it too — that ache that shows up out of nowhere. I’d cross the whole road from Marrakech to Meknès tonight if I could just to hold you. Those 3 days I had you next to me were the best of my life, and missing you this much only proves how real we are. The distance is temporary. Us — we’re the permanent part.',
    signoff: 'Soon I’m coming back to you. I promise. ❤️',
  },
  {
    id: 3, emoji: '🌧️', when: 'you’ve had a bad day',
    body: 'Come here, my angel. You don’t have to be strong for me — put it all down for a minute. Whatever happened today, it doesn’t get to decide how loved you are. You’re still the best thing in my life. Tomorrow gets a fresh start, and you won’t face it alone. Tell me everything when you’re ready. I’m listening.',
    signoff: 'You’re safe with me. Always. 🤍',
  },
  {
    id: 4, emoji: '😟', when: 'you feel insecure about us',
    body: 'Read this slowly, my love. There is no version of this where I leave. I’m not going anywhere, I’m not looking anywhere else, and I don’t want anyone but you. Meknès to Marrakech is just kilometres — it can’t touch what we have. The doubt in your head is lying to you. I chose you, I keep choosing you, and I’ll choose you tomorrow too.',
    signoff: 'It’s you. It was always going to be you. 💍',
  },
  {
    id: 5, emoji: '🥺', when: 'you need to feel loved',
    body: 'Then let me remind you, my angel. You are loved — deeply, stubbornly, completely. Loved on your good days and your hard ones. Loved when you’re glowing and when you’re a mess. There is nothing you need to do to earn it. You already have all of me, exactly as you are right now.',
    signoff: 'Every bit of me is yours. 🌹',
  },
  {
    id: 6, emoji: '😤', when: 'you’re upset with me',
    body: 'I’d rather have you angry and honest than quiet and far away. Whatever I did, you matter more to me than being right. I’m not going anywhere while we figure it out — not the distance, not a bad night, nothing. Take your space if you need it, but come back to me. We’re on the same team, honey, even when it doesn’t feel like it.',
    signoff: 'I’m sorry, and I’m still here. 🤝',
  },
  {
    id: 7, emoji: '✨', when: 'you need to smile',
    body: 'Okay, smile-emergency mode. Remember how you laugh at your own jokes before you even finish them? I think about that constantly. You’re ridiculous and adorable and I’m completely obsessed with you. There — I saw that little smile start. Don’t fight it, my love. You’re cute when you give in. 😏',
    signoff: 'Caught you smiling. Mission complete. 😄',
  },
  {
    id: 8, emoji: '🔥', when: 'you want to feel wanted',
    body: 'Wanted? My hot girl, you have no idea. I still replay those 3 days in Meknès more than I’ll admit — the way you looked at me, your voice late at night, everything I didn’t want to stop. You’re not just loved, you’re craved. The next time there’s no screen and no distance between us, you’ll feel exactly how much.',
    signoff: 'Counting down to no more distance. 🔥',
  },
  {
    id: 9, emoji: '🌅', when: 'it’s a brand new morning',
    body: 'Good morning, my love. Before Meknès and the whole day grab you — I love you. That’s the first thing and the truest thing. Go be brilliant, eat something, drink water, and know that someone all the way in Marrakech is already proud of you and thinking about your face.',
    signoff: 'Have the day you deserve. ☀️',
  },
  {
    id: 10, emoji: '💞', when: 'you wonder about our future',
    body: 'Let me paint it for you, my angel. No more 380-kilometre goodbye at the end of a visit. Lazy mornings in one home. A kitchen that smells like us. Stupid arguments about whose turn it is, ending in laughing. Falling asleep in the same bed and waking up still tangled. Those 3 days were just a preview — the real story is coming.',
    signoff: 'I’m building it toward you. 🏡',
  },
];

// ─── Reasons I Love You ───────────────────────────────────────────────────────
export const LOVE_REASONS: string[] = [
  'The way your whole face changes when you really laugh, my love.',
  'How safe you make me feel just by being on the other end of a call.',
  'The way you said my name during those 3 days, with no screen in the way.',
  'How hard you love, even when the distance scares you.',
  'The little things you remember that I never expected you to.',
  'The way you fight for us instead of running.',
  'How you made every hour of Meknès feel like something I’ll never forget.',
  'Your stubbornness — even when it’s aimed at me.',
  'The way you check on me before you take care of yourself.',
  'How you look at me like I’m something worth keeping.',
  'The way you turn shy right after you’re bold.',
  'How honest you are, even when honesty is hard.',
  'The sound of your voice when you’re half asleep.',
  'How you can calm me down with a single message.',
  'The way you let me see the parts you hide from everyone else.',
  'How much you care about the people who matter to you.',
  'That you chose me across 380 kilometres, and keep choosing me.',
  'The way you get excited about our future like it’s already ours.',
  'How you make me want to be a better man every single day.',
  'Your messy, beautiful, complicated heart — all of it.',
  'The way you forgive me when I don’t deserve it yet.',
  'How letting you go after those 3 days was the hardest drive back to Marrakech.',
  'The way you make me feel wanted without even trying.',
  'That whether it’s Meknès or Marrakech, you still feel like home.',
];

// ─── Love Coupons (she redeems → he gets notified) ────────────────────────────
export interface LoveCoupon {
  id: number;
  emoji: string;
  title: string;
  detail: string;
}

export const LOVE_COUPONS: LoveCoupon[] = [
  { id: 1, emoji: '🚆', title: 'I Come To Meknès', detail: 'I plan the next trip to you — another few days, just us, no goodbye rushed.' },
  { id: 2, emoji: '🌙', title: 'Stay-Until-You-Sleep Call', detail: 'I stay on the call until you fall asleep — no rushing, no goodbye.' },
  { id: 3, emoji: '💬', title: 'No-Walls Hour', detail: 'Ask me anything for one full hour. No dodging, total honesty.' },
  { id: 4, emoji: '🎁', title: 'Surprise At Your Door', detail: 'Something shows up for you in Meknès — you don’t get to know what.' },
  { id: 5, emoji: '🎙️', title: 'Bedtime Voice Note', detail: 'A voice note of me talking you to sleep, just for you, honey.' },
  { id: 6, emoji: '🎬', title: 'Your-Pick Movie Night', detail: 'You choose anything, I watch it with you on call — no complaints.' },
  { id: 7, emoji: '💞', title: 'The Whole Story', detail: 'I tell you the full story of the moment I knew it was you — those 3 days.' },
  { id: 8, emoji: '✍️', title: 'A Handwritten Letter', detail: 'I write you a real letter by hand and send you the photo.' },
];

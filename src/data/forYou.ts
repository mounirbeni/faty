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
    body: 'Hey. Stop fighting the dark — I’m right here with you in it. Close your eyes and picture my arm around you, your back against my chest, my breath slow against your neck. Match your breathing to that. You don’t have to carry tonight by yourself. Rest, my love. I’ve got you, even from here.',
    signoff: 'Now sleep. I’ll see you in your dreams. 🌙',
  },
  {
    id: 2, emoji: '💔', when: 'you’re missing me',
    body: 'I know. I feel it too — that ache that shows up out of nowhere. But missing me this much only means what we have is real, and rare, and worth every mile between us. The distance is temporary. Us? We’re the permanent part. Read this twice and remember: I’m missing you in the exact same second.',
    signoff: 'Soon. I promise you, soon. ❤️',
  },
  {
    id: 3, emoji: '🌧️', when: 'you’ve had a bad day',
    body: 'Come here. You don’t have to be strong for me — put it all down for a minute. Whatever happened today, it doesn’t get to decide how loved you are. You’re still the best thing in my life. Tomorrow gets a fresh start, and you won’t face it alone. Tell me everything when you’re ready. I’m listening.',
    signoff: 'You’re safe with me. Always. 🤍',
  },
  {
    id: 4, emoji: '😟', when: 'you feel insecure about us',
    body: 'Read this slowly. There is no version of this where I leave. I’m not going anywhere, I’m not looking anywhere else, and I don’t want anyone but you. The doubt in your head is lying to you. Choose to believe me instead: I chose you, I keep choosing you, and I’ll choose you tomorrow too.',
    signoff: 'It’s you. It was always going to be you. 💍',
  },
  {
    id: 5, emoji: '🥺', when: 'you need to feel loved',
    body: 'Then let me remind you. You are loved — deeply, stubbornly, completely. Loved on your good days and your hard ones. Loved when you’re glowing and when you’re a mess. There is nothing you need to do to earn it. You already have all of me, exactly as you are right now.',
    signoff: 'Every bit of me is yours. 🌹',
  },
  {
    id: 6, emoji: '😤', when: 'you’re upset with me',
    body: 'I’d rather have you angry and honest than quiet and far away. Whatever I did, you matter more to me than being right. I’m not going anywhere while we figure it out. Take your space if you need it — but come back to me. We’re on the same team, even when it doesn’t feel like it.',
    signoff: 'I’m sorry, and I’m still here. 🤝',
  },
  {
    id: 7, emoji: '✨', when: 'you need to smile',
    body: 'Okay, smile-emergency mode. Remember how you laugh at your own jokes before you finish them? I think about that constantly. You’re ridiculous and adorable and I’m obsessed with you. There — I saw that little smile start. Don’t fight it. You’re cute when you give in. 😏',
    signoff: 'Caught you smiling. Mission complete. 😄',
  },
  {
    id: 8, emoji: '🔥', when: 'you want to feel wanted',
    body: 'Wanted? You have no idea. I think about you more than I’ll admit out loud — the way you look at me, your voice late at night, the things I can’t wait to do when there’s finally no screen between us. You’re not just loved, you’re craved. Don’t ever doubt how much I want you.',
    signoff: 'Counting down to no more distance. 🔥',
  },
  {
    id: 9, emoji: '🌅', when: 'it’s a brand new morning',
    body: 'Good morning, my favourite person. Before the world grabs you today — I love you. That’s the first thing and the truest thing. Go be brilliant, eat something, drink water, and know that someone far away is already proud of you and thinking about your face.',
    signoff: 'Have the day you deserve. ☀️',
  },
  {
    id: 10, emoji: '💞', when: 'you wonder about our future',
    body: 'Let me paint it for you. Lazy mornings with no goodbye at the end. A kitchen that smells like us. Stupid arguments about whose turn it is, ending in laughing. Falling asleep in the same bed and waking up still tangled. This distance is just the prologue, love. The real story is coming.',
    signoff: 'I’m building it toward you. 🏡',
  },
];

// ─── Reasons I Love You ───────────────────────────────────────────────────────
export const LOVE_REASONS: string[] = [
  'The way your whole face changes when you really laugh.',
  'How safe you make me feel just by being on the other end of a call.',
  'The way you say my name when it’s only us.',
  'How hard you love, even when it scares you.',
  'The little things you remember that I never expected you to.',
  'The way you fight for us instead of running.',
  'How you make an ordinary day feel like something I’ll remember.',
  'Your stubbornness — even when it’s aimed at me.',
  'The way you check on me before you take care of yourself.',
  'How you look at me like I’m something worth keeping.',
  'The way you turn shy right after you’re bold.',
  'How honest you are, even when honesty is hard.',
  'The sound of your voice when you’re half asleep.',
  'How you can calm me down with a single message.',
  'The way you let me see the parts you hide from everyone else.',
  'How much you care about the people who matter to you.',
  'That you chose me, across all this distance, and keep choosing me.',
  'The way you get excited about our future like it’s already ours.',
  'How you make me want to be a better man every single day.',
  'Your messy, beautiful, complicated heart — all of it.',
  'The way you forgive me when I don’t deserve it yet.',
  'How you remember the smallest thing I said weeks ago.',
  'The way you make me feel wanted without even trying.',
  'That no matter how far apart we are, you still feel like home.',
];

// ─── Love Coupons (she redeems → he gets notified) ────────────────────────────
export interface LoveCoupon {
  id: number;
  emoji: string;
  title: string;
  detail: string;
}

export const LOVE_COUPONS: LoveCoupon[] = [
  { id: 1, emoji: '🌙', title: 'Stay-Until-You-Sleep Call', detail: 'I stay on the call until you fall asleep — no rushing, no goodbye.' },
  { id: 2, emoji: '💬', title: 'No-Walls Hour', detail: 'Ask me anything for one full hour. No dodging, total honesty.' },
  { id: 3, emoji: '🎁', title: 'Surprise At Your Door', detail: 'Something shows up for you — you don’t get to know what.' },
  { id: 4, emoji: '🎙️', title: 'Bedtime Voice Note', detail: 'A voice note of me talking you to sleep, just for you.' },
  { id: 5, emoji: '🎬', title: 'Your-Pick Movie Night', detail: 'You choose anything, I watch it with you on call — no complaints.' },
  { id: 6, emoji: '📵', title: 'Phone-Off, You-Only', detail: 'One evening where everyone else gets ignored. Just us.' },
  { id: 7, emoji: '💞', title: 'The Whole Story', detail: 'I tell you the full story of the moment I knew it was you.' },
  { id: 8, emoji: '✍️', title: 'A Handwritten Letter', detail: 'I write you a real letter by hand and send you the photo.' },
];

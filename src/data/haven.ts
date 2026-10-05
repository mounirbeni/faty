// ─── Haven — a soft, slow world for her harder days ──────────────────────────

export const HAVEN_LINES: string[] = [
  'Rest, my angel. The world can wait — I can’t, but the world can.',
  'You don’t have to be okay today. You just have to be you.',
  'Every feeling you have this week is allowed in here.',
  'If I were there, you’d be wrapped in a blanket with my arm around you.',
  'Soft day. Soft you. Soft me, thinking of you.',
  'You’re doing so much better than you think, my love.',
];

export const FEELINGS: { id: string; emoji: string; label: string; reply: string }[] = [
  { id: 'crampy',    emoji: '😣', label: 'Crampy',     reply: 'Heat on your tummy, knees up, slow breaths. I wish my hand was the warm thing on your belly right now. It will pass, my love.' },
  { id: 'tired',     emoji: '😴', label: 'Exhausted',  reply: 'Then sleep. No guilt, no “I should”. Your body is working so hard — let it rest. I’ll still be here when you wake up.' },
  { id: 'teary',     emoji: '🥺', label: 'Teary',      reply: 'Cry if you need to. You’re not too much, you’re not dramatic, you’re just you — and I love every version of you.' },
  { id: 'irritated', emoji: '😤', label: 'Irritated',  reply: 'Be as grumpy as you want. You can even be grumpy at me. I’m not going anywhere, ever.' },
  { id: 'sad',       emoji: '🌧️', label: 'Low',        reply: 'Some days are grey, and that’s okay. Let me be your little bit of sun from far away. I love you so much.' },
  { id: 'craving',   emoji: '🍫', label: 'Craving',    reply: 'Eat the chocolate. Eat the chips. Eat whatever makes you happy — you deserve every bite, my angel.' },
  { id: 'okay',      emoji: '🙂', label: 'Okay-ish',   reply: 'Okay-ish is a win this week. I’m proud of you — for real.' },
];

export const NEEDS: { id: string; emoji: string; label: string; telegram: string }[] = [
  { id: 'hug',     emoji: '🤗', label: 'A big hug',          telegram: '🤗 She needs a big hug from you right now.' },
  { id: 'call',    emoji: '📞', label: 'Call me',            telegram: '📞 She wants you to <b>call her</b>.' },
  { id: 'voice',   emoji: '🎙️', label: 'A voice note',       telegram: '🎙️ She wants a <b>voice note</b> from you.' },
  { id: 'listen',  emoji: '👂', label: 'Just listen',        telegram: '👂 She needs you to <b>just listen</b> — no fixing, just be there.' },
  { id: 'love',    emoji: '💌', label: 'Tell me you love me', telegram: '💌 She wants to hear that you love her. Tell her. Now. 😌' },
  { id: 'space',   emoji: '🌙', label: 'Quiet, but stay close', telegram: '🌙 She needs some quiet — stay close, be gentle, no pressure.' },
];

export const COMFORT_NOTES: string[] = [
  'You are the most beautiful thing in my life, even in pyjamas, even crying, especially then.',
  'I’m proud of how strong you are — and you don’t even have to be strong with me.',
  'If you’re in pain right now: I’m sorry, my love. I’d take it from you if I could.',
  'You don’t owe anyone a good mood this week. Not even me.',
  'Remember: you are loved on your hardest days exactly as much as your easiest ones.',
  'Somewhere far away, a man is thinking about you and smiling. (It’s me.)',
  'Drink some water. I said it with love. 💧',
  'You’re not “too emotional”. You feel deeply. That’s one of my favourite things about you.',
  'Close your eyes for 10 seconds and imagine my forehead on yours. There. I’m here.',
  'When this week is over, I’m spoiling you. That’s a promise.',
  'Your body is doing something hard. Be gentle with it — and with you.',
  'I love your laugh, your voice, your silly faces, your moods. All of it. All of you.',
  'You make the distance worth it. Every single kilometre.',
  'It’s okay to cancel plans, stay in bed and do nothing. Nothing is allowed.',
  'If no one told you today: you’re doing amazing, my angel.',
  'I would bring you tea, chocolate, a hot-water bottle and a thousand kisses. In that order. Maybe kisses first.',
  'This feeling is temporary. My love for you is not.',
  'You are my safe place. Let me be yours this week.',
  'Even your bad days are better than everybody else’s good days to me.',
  'One day I’ll be the one rubbing your back through this. Until then — imagine it.',
];

export const SELF_CARE: { id: string; emoji: string; label: string; tip: string }[] = [
  { id: 'water',   emoji: '💧', label: 'A big glass of water', tip: 'Water helps with bloating and headaches.' },
  { id: 'heat',    emoji: '🔥', label: 'Something warm on your tummy', tip: 'Heat relaxes the muscles — cramps calm down.' },
  { id: 'tea',     emoji: '🫖', label: 'A warm drink', tip: 'Ginger, chamomile or mint tea are perfect.' },
  { id: 'snack',   emoji: '🍫', label: 'Something you love to eat', tip: 'Dark chocolate has magnesium — science says yes.' },
  { id: 'stretch', emoji: '🧘‍♀️', label: '2 minutes of slow stretching', tip: 'Child’s pose & knees-to-chest help the lower back.' },
  { id: 'cozy',    emoji: '🛋️', label: 'Comfy clothes & a blanket', tip: 'Nothing tight today. Only softness.' },
  { id: 'rest',    emoji: '😴', label: 'Rest without guilt', tip: 'A nap counts as productivity this week.' },
  { id: 'smile',   emoji: '🎬', label: 'Something that makes you smile', tip: 'A comfort show, a song, a silly video.' },
];

export const LET_GO_REPLIES: string[] = [
  'Gone. It doesn’t get to stay. 🫧',
  'Popped. Lighter now? 💗',
  'Bye bye, little worry. 👋',
  'That one’s not yours to carry anymore.',
  'Poof. I’ve got you. ✨',
];

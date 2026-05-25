// ─────────────────────────────────────────────────────────
// Inside His Heart — Cinematic Emotional Experience Data
// ─────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────

export interface HeartQuestion {
  id: number;
  question: string;
  answer: string;
  timestamp?: string;
  atmosphere: 'midnight' | 'rain' | 'aurora' | 'starlight' | 'golden';
  category: 'intimacy' | 'late-night' | 'memories' | 'confessions';
}

export interface EmotionalResponse {
  id: number;
  text: string;
  emoji: string;
}

export interface HiddenNote {
  id: number;
  text: string;
  location: 'star' | 'aurora' | 'corner' | 'longpress';
}

export interface WhisperConfession {
  id: number;
  text: string;
  duration: number;
}

// ── Heart Questions ──────────────────────────────────────

export const HEART_QUESTIONS: HeartQuestion[] = [
  // ─── Intimacy (8) ───────────────────────────────────────
  {
    id: 1,
    question: 'How did you feel during our first kiss?',
    answer:
      'Time stopped. I remember the way your breath felt against mine, and how my hands were trembling even though I was trying to look calm. Everything around us disappeared — the noise, the world, all of it. All I could feel was you, and this overwhelming thought: I never want this moment to end. My heart was beating so loud I was sure you could hear it.',
    timestamp: 'december 14, 2:33 AM',
    atmosphere: 'midnight',
    category: 'intimacy',
  },
  {
    id: 2,
    question: 'What does it feel like when you hold my hand?',
    answer:
      `It feels like finding something I didn't know I'd been reaching for my whole life. Your fingers fit between mine like they were designed to be there. There's this warmth that starts at your palm and just spreads through my entire body. I squeeze a little tighter sometimes — not because I'm afraid you'll let go, but because I want you to feel how much that small touch means to me.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 3,
    question: 'What goes through your mind when you hug me?',
    answer:
      `I breathe you in. That's the first thing — your scent against my chest, the way your head rests right where my heartbeat lives. The world gets quiet when I hold you. I feel your ribs rise and fall, and everything heavy just dissolves. I always hold on a second longer than I should because letting go of you is the hardest small thing I do.`,
    timestamp: 'january 3, 11:47 PM',
    atmosphere: 'rain',
    category: 'intimacy',
  },
  {
    id: 4,
    question: 'Do you like it when I touch your face?',
    answer:
      `More than I'll ever be able to explain. When your fingertips trace my jaw or brush my cheek, something inside me stills completely. I close my eyes not because I'm tired, but because I want to feel every millimetre of it. It's the gentlest thing anyone's ever done to me, and every single time it makes me feel like I'm worth being soft with.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 5,
    question: 'What does it feel like when I fall asleep on you?',
    answer:
      `Like being trusted with something sacred. Your breathing slows and your body gets heavy against mine, and I don't dare move. I just lie there listening to you breathe, feeling your warmth sink into me. Sometimes I whisper things you'll never hear — small things, tender things. Those are the most peaceful minutes of my entire life.`,
    timestamp: 'february 8, 1:12 AM',
    atmosphere: 'midnight',
    category: 'intimacy',
  },
  {
    id: 6,
    question: 'When did you feel the most vulnerable with me?',
    answer:
      `The first time I let you see me cry. I'd spent years building walls, and you walked right through them without even trying. I remember turning away, embarrassed, and you pulled me back. You didn't say anything — you just held my face and looked at me like I wasn't broken. That silence said more than any words ever could. I knew then that you were different.`,
    atmosphere: 'rain',
    category: 'intimacy',
  },
  {
    id: 7,
    question: 'How do you feel when we're close in silence?',
    answer:
      `Silence with you isn't empty — it's full. It's the sound of two people who don't need words to feel connected. I can hear your heartbeat, the rustle of your clothes, the soft rhythm of you just existing beside me. Those quiet moments are when I feel closest to you, like our souls are having a conversation our mouths don't need to join.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 8,
    question: 'What do you feel when I look into your eyes?',
    answer:
      `Seen. Completely, terrifyingly seen. Your eyes have this way of cutting through every mask I've ever worn. For a second I feel exposed, and then… safe. It's like you're reading a part of me I didn't know was legible. I hold your gaze because looking away from you feels like turning away from the sun — possible, but why would I ever want to?`,
    timestamp: 'march 22, 10:15 PM',
    atmosphere: 'aurora',
    category: 'intimacy',
  },

  // ─── Late-Night (6) ─────────────────────────────────────
  {
    id: 9,
    question: 'What do you think about before sleeping?',
    answer:
      'You. Always you. Some nights I replay our conversations word by word, and I catch myself smiling in the dark. I think about the way you laugh, how your voice softens when you say my name. And then I wonder — are you thinking about me too right now? That thought keeps me company until sleep takes over.',
    timestamp: 'november 27, 3:04 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 10,
    question: 'Do you ever miss me in the middle of the night?',
    answer:
      `All the time. There are nights where I wake up at 2 AM and the first thing I feel is the absence of you. The bed is too wide, the room is too quiet, and my chest aches in a way I can't fix with anything except hearing your voice. I grab my phone and stare at our last message, and somehow just seeing your name calms the ache a little.`,
    timestamp: 'january 19, 2:41 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 11,
    question: 'What hidden feelings do you carry that I don't know about?',
    answer:
      `Sometimes the love I feel for you scares me — not because it's wrong, but because it's so deep I don't know how to hold it all. I carry this quiet fear that I'll never be able to give you everything you deserve. And underneath that fear is a promise I've never said out loud: I will spend every day trying anyway, even when I fall short.`,
    atmosphere: 'rain',
    category: 'late-night',
  },
  {
    id: 12,
    question: 'Do you replay moments of us in your head?',
    answer:
      `Constantly. I have this mental film reel that plays on loop — the way you looked at me across the room that one night, the sound of your laugh echoing in the car, the feeling of your cold hands warming up inside mine. I replay them not because I'm stuck in the past, but because those moments remind me that love like this is real. And it's mine.`,
    timestamp: 'april 5, 11:58 PM',
    atmosphere: 'starlight',
    category: 'late-night',
  },
  {
    id: 13,
    question: 'What does longing feel like to you?',
    answer:
      `It lives right beneath my ribs — this dull, warm ache that flares up when I hear a song that reminds me of you or when I catch a scent in the air that smells like your perfume. Longing for you isn't sadness. It's proof. Proof that someone has finally become so woven into me that being apart feels like breathing with only one lung.`,
    atmosphere: 'rain',
    category: 'late-night',
  },
  {
    id: 14,
    question: 'What do late nights without me feel like?',
    answer:
      `Empty in a way that nothing else can fill. I scroll through my phone, put on music, try to distract myself — but the apartment is too still. I end up lying in the dark, imagining what it'd be like if you were right here, your head on my chest, your fingers tracing circles on my arm. The silence would be so different then. It would be full.`,
    timestamp: 'february 14, 12:20 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },

  // ─── Memories (5) ───────────────────────────────────────
  {
    id: 15,
    question: 'What's a moment with me that plays like a movie in your mind?',
    answer:
      `That night we walked together and the city lights were reflecting in the puddles after the rain. You stopped mid-sentence to look up at the sky, and the streetlight caught your face in this golden haze. I stood there watching you, and the whole world turned cinematic. I didn't say anything because I was too busy memorising every detail — the gloss on your lips, the wind in your hair, the way you smiled without knowing I was staring.`,
    timestamp: 'october 18, 9:32 PM',
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 16,
    question: 'What's the first memory of us that makes you smile?',
    answer:
      'The first time you laughed — really laughed — because of something I said. You threw your head back, your eyes crinkled shut, and this sound came out that was so pure it rewired something inside me. I remember thinking: I want to be the reason for that sound for the rest of my life. I still chase that laugh every single day.',
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 17,
    question: 'Is there a moment you wish you could relive forever?',
    answer:
      `That time we stayed up talking until the sky turned from black to blue to orange. We were exhausted but neither of us wanted to stop. Your voice was getting softer, your eyes heavier, and I watched the sunrise paint your skin in shades of amber. Nothing extraordinary happened — and that's exactly why it was perfect. It was just us, raw and unfiltered, with nothing but honesty between us.`,
    timestamp: 'december 31, 5:48 AM',
    atmosphere: 'aurora',
    category: 'memories',
  },
  {
    id: 18,
    question: 'What do you remember about the first time we met?',
    answer:
      `I remember more than you think. I noticed the way you carried yourself — quiet confidence wrapped in warmth. You said something casual, and I forgot how to respond for half a second because your eyes were so disarmingly honest. I walked away from that moment knowing something had shifted inside me, even though I couldn't name it yet. You left a mark before I even knew your full name.`,
    atmosphere: 'starlight',
    category: 'memories',
  },
  {
    id: 19,
    question: 'What's a small detail about us that you'll never forget?',
    answer:
      `The way you always fix my collar without thinking about it. You reach over, adjust it gently, smooth the fabric, and go right back to whatever you were saying. You probably don't even notice you do it. But I do. Every time. It's such a small, unconscious act of care, and it makes me feel like I belong to someone — like I'm yours, and you're making sure the world sees me right.`,
    timestamp: 'march 9, 7:10 PM',
    atmosphere: 'golden',
    category: 'memories',
  },

  // ─── Confessions (5) ────────────────────────────────────
  {
    id: 20,
    question: 'What's something you've never told me?',
    answer:
      `I've written you letters I've never sent. Late at night, when the feelings get too big to hold in my chest, I open my notes app and write everything I can't say out loud. Pages of it — how your smile rewires my brain, how your voice is the only sound that makes silence bearable. One day maybe I'll show you. But for now, they live in the quiet, keeping me company.`,
    timestamp: 'april 22, 3:17 AM',
    atmosphere: 'midnight',
    category: 'confessions',
  },
  {
    id: 21,
    question: 'When did you know you loved me?',
    answer:
      `It wasn't one big moment — it was a thousand tiny ones collapsing into certainty. It was the way you remembered something small I mentioned weeks before. The way you looked at me when I was talking about something I cared about, like my words actually mattered. One night I caught myself thinking "I can't imagine my life without her" and it hit me — I wasn't falling anymore. I had already landed.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
  {
    id: 22,
    question: 'What are you most afraid of losing?',
    answer:
      `This. Not just you — this feeling. The way my chest tightens when your name lights up my phone. The way the world makes more sense when you're in the room. I've lived without a lot of things, and I survived. But I don't think I could go back to the version of me that existed before you. He was fine. But he wasn't alive. Not like this.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 23,
    question: 'What do you wish I knew about how you love me?',
    answer:
      `That it's constant. Even when I'm quiet, even when I seem distracted — underneath everything, there's this steady current of you running through me. I love you in the background of every thought, in the margins of every moment. It's not always dramatic or cinematic. Sometimes it's just me choosing your comfort over mine, your peace over my pride. That quiet choosing — that's the truest love I know how to give.`,
    timestamp: 'may 11, 11:03 PM',
    atmosphere: 'starlight',
    category: 'confessions',
  },
  {
    id: 24,
    question: 'If you could say one thing to my heart directly, what would it be?',
    answer:
      `Thank you for letting me in. I know it wasn't easy — I know you've been bruised before, and trusting again took a courage I'll never fully understand. But you chose me. You opened your doors and let me walk through, and I promise you I will treat every room inside you with reverence. You are the most beautiful place I've ever been allowed to stay.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
];

// ── Emotional Responses ──────────────────────────────────

export const EMOTIONAL_RESPONSES: EmotionalResponse[] = [
  { id: 1, text: 'this made me emotional…', emoji: '🥺' },
  { id: 2, text: 'i remember this too ❤️', emoji: '💗' },
  { id: 3, text: 'i miss that moment', emoji: '🌙' },
  { id: 4, text: 'you made me feel safe', emoji: '🫂' },
  { id: 5, text: 'my heart is full right now', emoji: '💖' },
  { id: 6, text: 'i never want to forget this', emoji: '✨' },
  { id: 7, text: 'i felt that too', emoji: '💕' },
  { id: 8, text: 'come hold me right now', emoji: '🤍' },
  { id: 9, text: 'you understand me like no one else', emoji: '🥹' },
  { id: 10, text: 'i am crying happy tears', emoji: '😭💗' },
  { id: 11, text: 'this is exactly what i needed tonight', emoji: '🌙' },
  { id: 12, text: 'i love you more than words can say', emoji: '❤️' },
];

// ── Hidden Notes ─────────────────────────────────────────

export const HIDDEN_NOTES: HiddenNote[] = [
  { id: 1, text: 'I still remember your eyes that night.', location: 'star' },
  { id: 2, text: 'You calm my chaos.', location: 'aurora' },
  { id: 3, text: 'I never wanted that moment to end.', location: 'corner' },
  { id: 4, text: 'I miss your voice tonight.', location: 'longpress' },
  { id: 5, text: 'You are the safest place I know.', location: 'star' },
  { id: 6, text: 'Every love song reminds me of you.', location: 'aurora' },
  {
    id: 7,
    text: 'I fall in love with you a little more each day.',
    location: 'corner',
  },
  {
    id: 8,
    text: 'Some nights I just want to hold you and say nothing.',
    location: 'longpress',
  },
  {
    id: 9,
    text: 'You are the reason I believe in forever.',
    location: 'star',
  },
  {
    id: 10,
    text: 'I whisper your name when no one is around.',
    location: 'aurora',
  },
];

// ── Whisper Confessions ──────────────────────────────────

export const WHISPER_CONFESSIONS: WhisperConfession[] = [
  { id: 1, text: 'I was nervous when I touched your face…', duration: 4 },
  { id: 2, text: 'You felt safe in my arms.', duration: 3 },
  {
    id: 3,
    text: 'I replay our first kiss in my mind sometimes.',
    duration: 5,
  },
  { id: 4, text: 'I miss the way you look at me.', duration: 4 },
  {
    id: 5,
    text: 'You are the last thing I think about before I close my eyes.',
    duration: 6,
  },
  { id: 6, text: 'I wish I could hold you right now.', duration: 4 },
  {
    id: 7,
    text: 'Hearing your voice calms everything inside me.',
    duration: 5,
  },
  {
    id: 8,
    text: 'I loved you before I even knew what love was.',
    duration: 5,
  },
];

// ── Category Metadata ────────────────────────────────────

export const CATEGORY_META: Record<
  string,
  {
    icon: string;
    title: string;
    subtitle: string;
    accentColor: string;
    glowColor: string;
  }
> = {
  intimacy: {
    icon: '💋',
    title: 'Intimate Moments',
    subtitle: 'Touch, closeness & vulnerability',
    accentColor: '#FF4D8D',
    glowColor: 'rgba(255,77,141,0.5)',
  },
  'late-night': {
    icon: '🌙',
    title: 'Late Night Thoughts',
    subtitle: 'What he thinks at 3AM',
    accentColor: '#7B5CFF',
    glowColor: 'rgba(123,92,255,0.5)',
  },
  memories: {
    icon: '📸',
    title: 'Cinematic Memories',
    subtitle: 'Moments burned into his heart',
    accentColor: '#FFB84D',
    glowColor: 'rgba(255,184,77,0.5)',
  },
  confessions: {
    icon: '💌',
    title: 'Hidden Confessions',
    subtitle: 'Words he kept inside',
    accentColor: '#C084FC',
    glowColor: 'rgba(192,132,252,0.5)',
  },
};

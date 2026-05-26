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

  // ─── Intimacy (14) ──────────────────────────────────────
  {
    id: 1,
    question: `What was your first impression of me?`,
    answer:
      `My first impression was that you were someone I shouldn't let walk away. There was something in the way you carried yourself — quiet but certain, warm but composed. I didn't say much that first time, but inside I was already paying attention to every detail. I went home that night thinking about you longer than I'd like to admit.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 2,
    question: `What's something small that instantly makes your day better?`,
    answer:
      `Your name appearing on my screen. It doesn't matter what time it is or what kind of day I'm having — when I see it, something in me just settles. A message from you is like a small window of sunlight on a grey afternoon. It's such a tiny thing, but it rearranges my whole mood.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 3,
    question: `What's your biggest green flag in a relationship?`,
    answer:
      `Someone who stays. Not just physically, but emotionally — who shows up when it's inconvenient, who chooses honesty even when silence would be easier. I notice when someone makes space for me in their life without being asked. That kind of quiet consistency is the rarest and most beautiful thing a person can offer.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 4,
    question: `What kind of date do you secretly love?`,
    answer:
      `Honestly? Nowhere fancy. I love sitting somewhere with good food, no agenda, and you across from me. I love when we lose track of time just talking, when neither of us is checking their phone because the conversation is too good to interrupt. Those ordinary evenings feel like the most extraordinary thing in the world to me.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 5,
    question: `What's something you've always wanted to try with someone you like?`,
    answer:
      `Road-tripping with no fixed destination — just a direction, a playlist, and someone beside me whose company I genuinely love. I want to share the small things: bad gas station coffee, getting slightly lost, finding some unexpected beautiful place by accident. That kind of adventure only works with the right person.`,
    atmosphere: 'aurora',
    category: 'intimacy',
  },
  {
    id: 8,
    question: `What makes you feel most appreciated in a relationship?`,
    answer:
      `Being remembered. Not just in grand gestures — but when someone recalls something I mentioned weeks ago, when they check in during something I told them I was nervous about. That kind of attentiveness says "I was listening" and "you matter to me beyond this conversation." It means more than almost anything else.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 11,
    question: `What's your love language?`,
    answer:
      `Quality time — fully and genuinely. Not sitting in the same room on different phones, but actually being present with someone, giving them the rarest thing I have: my undivided attention. Physical touch comes second — a hand on my shoulder, a hug that lingers half a second too long. I speak in proximity and presence more than in words.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },
  {
    id: 12,
    question: `What's your ideal relationship like?`,
    answer:
      `Two people who make each other feel safe enough to be completely honest. Where hard conversations happen without fear of the relationship ending. Where independence is respected and togetherness is chosen, not forced. I want something that grows — that doesn't just survive hard seasons but becomes deeper because of them.`,
    atmosphere: 'aurora',
    category: 'intimacy',
  },
  {
    id: 13,
    question: `What kind of moments make you feel close to someone?`,
    answer:
      `When the conversation shifts from surface to real — when someone stops performing and starts being honest. When we've laughed until neither of us remembers what started it. When there's a comfortable silence that doesn't need filling. And especially: when someone is vulnerable with me. That kind of trust is where closeness actually lives.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 20,
    question: `What's something you notice about me that I probably don't realize?`,
    answer:
      `The way your face changes when you're genuinely interested in something versus when you're just being polite — there's this subtle shift in your eyes. I don't think you know how expressive you are when you actually care. I also notice when you're trying to hold something in. You go quiet in a specific way. I notice it every time.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 21,
    question: `What kind of energy do I give you?`,
    answer:
      `Warmth — the kind that's grounding, not overwhelming. Being around you makes the world feel a little steadier, like the noise turns down slightly. You also make me want to be more present, more honest, more open than I usually am. That's rare. Most people don't do that. You make me want to show up as a better version of myself without even trying to.`,
    atmosphere: 'aurora',
    category: 'intimacy',
  },
  {
    id: 24,
    question: `What do you think we'd be like as a married couple?`,
    answer:
      `Loud kitchen mornings and too many inside jokes. The kind of couple that bickers about small things and then laughs about it ten minutes later. I think we'd be good at making ordinary days feel like something — finding magic in routines, traveling badly, loving each other well through the unglamorous parts. I think we'd choose each other every single day.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 37,
    question: `What makes you feel emotionally safe with someone?`,
    answer:
      `When I know they won't use my honesty against me later. When I can say something unfinished — still figuring itself out — and it won't be held as evidence in some future argument. Emotional safety is knowing that the vulnerability I offer stays between us, is handled with care, and doesn't change how they see me. That kind of trust is everything.`,
    atmosphere: 'starlight',
    category: 'intimacy',
  },
  {
    id: 48,
    question: `What kind of affection means the most to you?`,
    answer:
      `The kind that isn't performed for anyone else. A private touch — a hand on my back when no one's watching, a look across the room that's just ours. Affection that says "I see you right now, just you" without needing an audience. I can always tell the difference between affection that's genuine and affection that's for show. The real kind lands completely differently.`,
    atmosphere: 'golden',
    category: 'intimacy',
  },

  // ─── Late-Night (11) ────────────────────────────────────
  {
    id: 9,
    question: `What's your biggest fear when it comes to love?`,
    answer:
      `Giving everything and still watching it slip away. I've put my whole heart into things before and it wasn't enough — and the question that stayed with me was whether I was the problem or if some connections just aren't meant to last. What I fear most is loving someone completely and still losing them, and having to build myself back up from scratch.`,
    timestamp: 'november 3, 2:17 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 10,
    question: `When do you feel the happiest or most at peace?`,
    answer:
      `In quiet moments that aren't trying to be anything. Early mornings before the world gets loud. Sitting with someone I care about and not needing to fill the silence. The happiest I've ever felt wasn't a big event — it was a small, ordinary moment that somehow held everything. Peace, I've learned, lives in the spaces between.`,
    atmosphere: 'starlight',
    category: 'late-night',
  },
  {
    id: 22,
    question: `What's one thing you want to know about me but haven't asked yet?`,
    answer:
      `What you're like when you're hurting — what you need, how you go quiet, what helps. I know your laughter and your light, but I want to know how to be there for you when things are heavy too. I haven't asked because I don't want to push into space you haven't offered. But I think about it. I want to know all the versions of you.`,
    timestamp: 'january 14, 1:44 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 26,
    question: `What kind of pain changed you the most?`,
    answer:
      `The kind that came from someone I never expected. Not a stranger — someone I thought I knew, someone I'd made room for. That kind of betrayal doesn't just hurt once; it makes you question your own judgment, reread every memory, wonder what else you missed. I came out of it more guarded, but also, eventually, more honest with myself about what I actually need.`,
    atmosphere: 'rain',
    category: 'late-night',
  },
  {
    id: 27,
    question: `When was the last time you genuinely felt understood by someone?`,
    answer:
      `Not long ago — and it caught me off guard. Someone responded to something I said in a way that showed they'd really heard me, not just the surface of what I was saying. Those moments are so rare that when they happen, you feel them physically. Understanding is the deepest form of intimacy I know.`,
    timestamp: 'february 28, 3:02 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 28,
    question: `What do you think you're still healing from?`,
    answer:
      `The habit of shrinking. Making myself smaller so other people feel more comfortable, swallowing my needs so I don't seem like too much. I'm still unlearning the reflex to apologize for taking up space. Healing from that is slow — it shows up in small moments, when I choose to say something honest instead of saying nothing. I'm getting better. Slowly.`,
    atmosphere: 'rain',
    category: 'late-night',
  },
  {
    id: 29,
    question: `What's your biggest fear in relationships?`,
    answer:
      `Becoming so comfortable that we stop choosing each other actively. I've seen love go quiet not from a single fight but from a thousand small moments of not paying attention. My biggest fear isn't dramatic — it's the slow drift, the gradual distance that builds when two people stop being curious about each other. I never want to stop being curious about you.`,
    timestamp: 'march 7, 12:33 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 38,
    question: `Have you ever pushed someone away while actually wanting them closer?`,
    answer:
      `Yes. And I hated myself for it while it was happening. There's a fear that lives right at the edge of closeness — this instinct to create distance before someone else can. I know where it comes from. I know it's self-protection. But knowing doesn't stop it. I've gotten better at catching myself, at choosing to stay instead of retreat. It's the hardest thing I practice.`,
    atmosphere: 'midnight',
    category: 'late-night',
  },
  {
    id: 39,
    question: `What's the hardest goodbye you've ever experienced?`,
    answer:
      `The quiet ones — the ones that didn't feel like goodbyes when they were happening. No dramatic ending, no closure, just someone gradually becoming a memory. Those are harder than any argument. You don't know it's over until you look up one day and the distance has already built itself. The absence is the goodbye, and it arrives too late to say anything.`,
    atmosphere: 'rain',
    category: 'late-night',
  },
  {
    id: 44,
    question: `What kind of connection are you truly looking for right now?`,
    answer:
      `Something honest and unhurried. I'm not looking for performance or perfection — I want someone who talks to me like I'm a real person, who's curious about me and lets me be curious back. I want depth without drama, warmth without conditions. Someone who makes being known feel safe rather than scary.`,
    atmosphere: 'aurora',
    category: 'late-night',
  },
  {
    id: 45,
    question: `When do you feel most vulnerable?`,
    answer:
      `Right before I say something true that I haven't said before. That moment of holding something honest in my mouth, deciding whether to speak it or swallow it back down. That pause is where I feel most exposed — not in the saying, but in the decision to say it. Every real conversation I've ever had started right there.`,
    timestamp: 'april 19, 2:58 AM',
    atmosphere: 'midnight',
    category: 'late-night',
  },

  // ─── Memories (7) ───────────────────────────────────────
  {
    id: 15,
    question: `What's your most embarrassing story?`,
    answer:
      `There's one I still can't tell without going red. I'll say this much: it involved me, overconfidence, and an audience I absolutely did not ask for. The worst part isn't what happened — it's that someone I wanted to impress was right there watching. I survived. Barely. And I've thought about it probably three hundred times since.`,
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 16,
    question: `If you could live anywhere for one year, where would it be?`,
    answer:
      `Somewhere slow. A coastal town in Italy or Portugal — the kind of place where people actually sit down for lunch and stay for two hours. I want to live somewhere that teaches me to stop rushing, to enjoy an evening with nowhere to be. I think a year somewhere like that would permanently change how I move through the world.`,
    atmosphere: 'aurora',
    category: 'memories',
  },
  {
    id: 18,
    question: `What's the weirdest thing you're obsessed with right now?`,
    answer:
      `I've been going down rabbit holes about things I have absolutely no practical reason to know. It changes every few weeks — a documentary about something strange, a niche hobby I'll never take up, a random historical period. My brain just picks something and wants to know everything about it until it moves on. It's chaotic and I love it.`,
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 19,
    question: `If we went on a spontaneous trip tomorrow, where would we go?`,
    answer:
      `Somewhere neither of us has been. I'd want us to figure it out together, standing in front of a map and just pointing. The destination doesn't matter half as much as the feeling of deciding together — of being in motion toward something new with no real plan. That kind of adventure is when I feel most alive.`,
    atmosphere: 'aurora',
    category: 'memories',
  },
  {
    id: 23,
    question: `What's your favorite memory from our first date?`,
    answer:
      `The moment I realized I wasn't nervous anymore. I don't know exactly when it happened — somewhere between the beginning and when we forgot we were supposed to be impressive for each other. It shifted from a performance to a real conversation, and I remember thinking "this is easy" in the best possible way. That ease was the best part.`,
    timestamp: 'december 21, 9:14 PM',
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 33,
    question: `What's one memory you wish you could relive?`,
    answer:
      `A specific evening where nothing special happened — and yet somehow everything felt perfect. The light, the feeling in the room, the conversation that went nowhere and everywhere at the same time. Those are the memories that don't announce themselves. You only realize afterward that you were living something you'll never stop going back to.`,
    atmosphere: 'golden',
    category: 'memories',
  },
  {
    id: 42,
    question: `What's something you miss from your childhood?`,
    answer:
      `The feeling that time was infinite. Summers that seemed to last forever, afternoons with no agenda, the sense that tomorrow was far away and today was all there was. I didn't know I was living in abundance until it ended. Now everything moves fast and I catch myself trying to slow moments down — holding them a little longer before they pass.`,
    atmosphere: 'golden',
    category: 'memories',
  },

  // ─── Confessions (17) ───────────────────────────────────
  {
    id: 6,
    question: `What's something people misunderstand about you?`,
    answer:
      `That my quietness is distance. I'm not cold — I'm careful. I've learned that not everything needs to be said immediately, that some feelings are worth holding until you know they're safe. People mistake my stillness for indifference, but inside I notice everything. I feel everything. I just don't broadcast it.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 7,
    question: `What's one thing that really shaped who you are today?`,
    answer:
      `Learning that love isn't always enough on its own. I watched people who loved each other deeply still hurt each other — and it taught me that love has to be paired with intention, communication, and effort. That lesson made me more careful, more thoughtful, more deliberate about the way I show up for the people I care about.`,
    atmosphere: 'starlight',
    category: 'confessions',
  },
  {
    id: 14,
    question: `Do you believe people can feel a connection very quickly?`,
    answer:
      `Yes — I've felt it. There are some people you talk to and immediately something aligns, like your frequencies match before either of you has said anything important. It doesn't mean it's love, but it means something. I believe in those early sparks of recognition, the feeling that says "there's something here," even if you can't explain it yet.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
  {
    id: 17,
    question: `What's your toxic trait?`,
    answer:
      `I internalize things instead of saying them. I'll carry something for days — a worry, a hurt, a question — before I let it out. By then it's either resolved itself or grown into something bigger than it needed to be. I know I should say things sooner. I'm working on it. But being truly open with someone still takes more courage than I like to admit.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 25,
    question: `What's something you've never told many people about yourself?`,
    answer:
      `That I've been lonely in rooms full of people more times than I can count. That some of my happiest moments have been completely alone, and some of my hardest have been surrounded by everyone. That I have a whole version of myself that almost nobody sees — quieter, softer, more afraid. I only share him with people I trust completely.`,
    timestamp: 'may 3, 3:41 AM',
    atmosphere: 'midnight',
    category: 'confessions',
  },
  {
    id: 30,
    question: `Have you ever loved someone in a way that changed you forever?`,
    answer:
      `Yes. And I don't say that easily. It wasn't a love that worked out — but it rearranged something fundamental in me. It expanded my capacity for feeling, made me take love more seriously, made me understand that real love is a responsibility and not just a feeling. I'm grateful for what it taught me, even though it cost me.`,
    timestamp: 'june 11, 1:08 AM',
    atmosphere: 'midnight',
    category: 'confessions',
  },
  {
    id: 31,
    question: `What's something you need emotionally but rarely ask for?`,
    answer:
      `Reassurance that I'm not too much. I can come on strong — I feel things deeply and I care loudly, and sometimes I worry I overwhelm people. What I rarely ask for is someone to say "that's not too much, that's exactly enough." I don't need it every day. But in the moments when I pull back, that's usually what I'm holding.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 32,
    question: `What kind of person brings out the best version of you?`,
    answer:
      `Someone who is genuinely curious about who I am — not who they think I should be. Someone who challenges me without diminishing me, who is honest even when honesty is inconvenient. Someone who makes me feel safe enough to be fully myself, because only in that kind of safety do I actually grow. I don't perform around people like that. I just am.`,
    atmosphere: 'starlight',
    category: 'confessions',
  },
  {
    id: 34,
    question: `What's something you learned the hard way about love?`,
    answer:
      `That love alone doesn't make a relationship work. I used to think feeling enough would be enough — that if the feeling was real, everything else would follow. But love without timing, without readiness, without two people who actually want the same things, isn't enough to hold something together. That was a painful lesson. It changed how I enter things now.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 35,
    question: `Do you think people meet for a reason?`,
    answer:
      `I go back and forth on it. But I do think some meetings arrive at exactly the moment they're supposed to — not because the universe orchestrates them, but because you become ready for someone right when they appear. I think readiness creates the conditions for meaning. And then the person you meet in that readiness feels like fate, even if it's something more beautiful than that.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
  {
    id: 36,
    question: `What's something you're afraid people will discover about you?`,
    answer:
      `That I'm less certain than I seem. I've built a reputation for having it together, for being steady, for knowing my direction — and most days I do. But there are days where I'm just guessing, just trying to hold the pieces in some reasonable shape. I'm afraid that if people saw that version of me, they'd trust me less. So I carry it quietly.`,
    atmosphere: 'midnight',
    category: 'confessions',
  },
  {
    id: 40,
    question: `What do you value more: peace or passion?`,
    answer:
      `Peace. Not the absence of feeling — but the kind of peace that coexists with depth. I want passion that doesn't destabilize, love that doesn't require chaos to feel alive. I've lived in turbulent waters long enough to understand that real warmth is steady, not explosive. I want someone I can breathe beside, not someone I'm constantly trying to survive.`,
    atmosphere: 'starlight',
    category: 'confessions',
  },
  {
    id: 41,
    question: `What's one thing you hope your future relationship gives you emotionally?`,
    answer:
      `Safety to be ordinary. To have bad days without fear of being judged, to not always be "on," to fall apart sometimes and know the other person will wait. I want a relationship where I'm loved in my quiet, in my mess, in the moments that have no highlight reel. That kind of ordinary love is the most extraordinary thing I can imagine.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
  {
    id: 43,
    question: `Do you think timing can ruin something beautiful?`,
    answer:
      `Yes. And I think it's one of the cruelest things that can happen — to find something real with someone but arrive at the wrong chapter of each other's lives. Wrong timing doesn't make the connection less true. It just means two people who might have been everything to each other become an almost. A story that deserved more chapters but didn't get them.`,
    atmosphere: 'rain',
    category: 'confessions',
  },
  {
    id: 46,
    question: `What's something about yourself you're still trying to figure out?`,
    answer:
      `What I actually need versus what I've been conditioned to settle for. I've spent years adapting to other people's rhythms and I'm still learning to hear my own. What I want in love, in life, in a quiet Tuesday afternoon — I'm getting clearer, but it's still in progress. I'm okay with that. Being a work in progress means there's still somewhere to grow.`,
    atmosphere: 'starlight',
    category: 'confessions',
  },
  {
    id: 47,
    question: `What's the difference between liking someone and truly loving them for you?`,
    answer:
      `Liking someone is easy — it lives in excitement and attraction and the thrill of newness. Loving someone is a choice you make on the days when the thrill has quieted and you choose them anyway. Love is knowing someone's weight — the difficult parts, the unfinished edges — and staying. It's much quieter than liking. And so much more.`,
    atmosphere: 'aurora',
    category: 'confessions',
  },
  {
    id: 49,
    question: `If someone really loved you correctly, what would that look like to you?`,
    answer:
      `It would look like being chosen — not just once, but daily, in small ways that don't make headlines. It would look like someone who stays curious about me, who handles my honesty like something fragile and rare, who makes space for my quiet and my chaos equally. It would feel like home — not a place, but a person. A warmth I can return to. A presence that makes me feel like I'm exactly where I'm supposed to be.`,
    timestamp: 'july 4, 11:59 PM',
    atmosphere: 'starlight',
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

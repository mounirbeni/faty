'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { softTap } from '@/lib/useHaptics';
import { playChime } from '@/lib/sounds';

/* ── Deterministic pseudo-random ── */
const pr = (s: number) => Math.abs(Math.sin(s * 9301 + 49297) * 233280) % 1;

/* ── Mood data: all 23 moods ── */
type EffectType = 'radial' | 'rain' | 'float' | 'confetti' | 'fire' | 'swirl';

interface MoodDef {
  emoji: string;
  color: string;
  glow: string;
  bg: string;
  effect: EffectType;
  quotes: string[];
}

const MOOD_DATA: Record<string, MoodDef> = {
  'Loved': {
    emoji: '♥', color: '#FF4D8D', glow: 'rgba(255,77,141,0.35)', bg: 'rgba(255,77,141,0.1)',
    effect: 'radial',
    quotes: [
      'You are the most loved person in my entire universe. ♥',
      'Every heartbeat I have is yours. Every single one.',
      'I think about you in between every thought.',
      'Loving you is the easiest and best thing I do.',
      'You make love feel like coming home.',
      'You were made to be loved exactly like this.',
    ],
  },
  'Excited': {
    emoji: '✦', color: '#FFB84D', glow: 'rgba(255,184,77,0.35)', bg: 'rgba(255,184,77,0.09)',
    effect: 'radial',
    quotes: [
      'Your excitement makes the whole universe smile.',
      'That energy of yours — I could feel it from miles away.',
      'When you light up, everything around you does too.',
      'I love you most when you\'re this alive.',
      'Keep that spark. It\'s one of my favorite things about you.',
      'This version of you is absolutely electric.',
    ],
  },
  'Miss You': {
    emoji: '·', color: '#7BB8FF', glow: 'rgba(123,184,255,0.3)', bg: 'rgba(100,160,255,0.07)',
    effect: 'rain',
    quotes: [
      'Missing you feels like rain on a window. Beautiful and aching.',
      'Every moment apart is just time until I hold you again.',
      'The distance is temporary. What we have is forever.',
      'I miss you the way the sky misses the sun at night.',
      'Absence makes my love for you louder.',
      'I carry you with me everywhere. Always.',
    ],
  },
  'Happy': {
    emoji: '★', color: '#FFD36E', glow: 'rgba(255,211,110,0.32)', bg: 'rgba(255,211,110,0.08)',
    effect: 'float',
    quotes: [
      'Your happiness is literally my favorite thing to see.',
      'When you\'re this happy, the whole universe feels lighter.',
      'Seeing you smile makes me believe in everything good.',
      'Your joy is contagious. Even from here.',
      'Keep smiling like that. You have no idea what it does to me.',
      'You deserve every ounce of this happiness and more.',
    ],
  },
  'Dreamy': {
    emoji: '·', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)', bg: 'rgba(167,139,250,0.08)',
    effect: 'float',
    quotes: [
      'Stay in that dream. I\'m probably in it.',
      'You look most beautiful when you\'re lost in your thoughts.',
      'Your dreamy side is one of my favorite versions of you.',
      'We exist somewhere between a dream and something real.',
      'Let the dream carry you softly tonight.',
      'The most beautiful things happen in the soft spaces between.',
    ],
  },
  'Grateful': {
    emoji: '✦', color: '#FBBF24', glow: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.08)',
    effect: 'float',
    quotes: [
      'Gratitude looks beautiful on you.',
      'That soft thankfulness in your heart — I feel it too.',
      'You teach me how to appreciate things I never noticed.',
      'Being grateful together makes everything feel richer.',
      'Thank you for existing in my universe.',
      'You are the thing I am most grateful for.',
    ],
  },
  'Cozy': {
    emoji: '♥', color: '#FB923C', glow: 'rgba(251,146,60,0.3)', bg: 'rgba(251,146,60,0.08)',
    effect: 'float',
    quotes: [
      'Cozy looks so good on you. Stay in that warmth.',
      'I wish I could be the blanket keeping you warm right now.',
      'The cozier you feel, the closer I feel to you.',
      'Soft light, warm drink, and you. That\'s my dream scene.',
      'I want to be your coziest place forever.',
      'Stay wrapped in that warmth. You deserve it.',
    ],
  },
  'Playful': {
    emoji: '·', color: '#FDE047', glow: 'rgba(253,224,71,0.3)', bg: 'rgba(253,224,71,0.07)',
    effect: 'confetti',
    quotes: [
      'Playful you is one of my absolute favorite yous.',
      'I could watch you laugh forever and never get enough.',
      'That playfulness of yours lights up every room.',
      'Being silly with you feels like the best therapy.',
      'Don\'t lose that playful spark. It\'s pure magic.',
      'You make even ordinary moments feel like adventures.',
    ],
  },
  'Tender': {
    emoji: '·', color: '#F472B6', glow: 'rgba(244,114,182,0.3)', bg: 'rgba(244,114,182,0.08)',
    effect: 'float',
    quotes: [
      'That tender softness in you makes me want to protect you forever.',
      'You carry so much gentleness. It\'s one of the most beautiful things about you.',
      'Your tender side reaches places words can\'t.',
      'Softness is strength. And you are so, so strong.',
      'I want to be as gentle with you as you are with everything you love.',
      'The world is softer because you\'re in it.',
    ],
  },
  'Safe': {
    emoji: '·', color: '#34D399', glow: 'rgba(52,211,153,0.3)', bg: 'rgba(52,211,153,0.07)',
    effect: 'radial',
    quotes: [
      'You being safe is everything to me. Everything.',
      'You will always, always be safe with me.',
      'That feeling of safety? Hold onto it. You deserve it always.',
      'I built this universe so you always have somewhere safe.',
      'As long as I exist, you have a safe place.',
      'You are protected. You are held. You are loved.',
    ],
  },
  'Soft': {
    emoji: '·', color: '#CBD5E1', glow: 'rgba(203,213,225,0.22)', bg: 'rgba(203,213,225,0.06)',
    effect: 'float',
    quotes: [
      'That softness in you is not a weakness. It\'s your superpower.',
      'Stay soft. The world needs more of your kind of gentle.',
      'Your softness makes you one of the most powerful people I know.',
      'I love you most when you\'re this quiet and still.',
      'Float in that softness. I\'m right here.',
      'Being soft is brave. And you are so brave.',
    ],
  },
  'Blushing': {
    emoji: '·', color: '#E879F9', glow: 'rgba(232,121,249,0.3)', bg: 'rgba(232,121,249,0.08)',
    effect: 'float',
    quotes: [
      'You\'re blushing and I can feel it from here.',
      'That blush on your face is one of the most precious things I\'ve ever seen.',
      'You have no idea how beautiful you look when you\'re like this.',
      'My heart just stopped a little. Just so you know.',
      'Whatever made you blush — I hope it was me.',
      'You are impossibly beautiful right now.',
    ],
  },
  'Nostalgic': {
    emoji: '·', color: '#818CF8', glow: 'rgba(129,140,248,0.3)', bg: 'rgba(129,140,248,0.08)',
    effect: 'float',
    quotes: [
      'Some memories are so beautiful they physically ache.',
      'The past is sacred. And so are you.',
      'Nostalgia is love looking backward.',
      'Whatever you\'re remembering right now — it clearly mattered.',
      'Every memory with you is one I\'ll revisit forever.',
      'The beautiful moments never really leave. They live inside us.',
    ],
  },
  'Hungry': {
    emoji: '·', color: '#F87171', glow: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.08)',
    effect: 'float',
    quotes: [
      'Feed yourself, my love. You deserve every good thing.',
      'I wish I could cook for you right now. I would.',
      'Go eat something delicious. You\'ve earned it.',
      'Food always tastes better when I imagine sharing it with you.',
      'Hungry? Go treat yourself. You deserve it.',
      'Take care of that beautiful self. Start with food.',
    ],
  },
  'Tired': {
    emoji: 'z', color: '#94A3B8', glow: 'rgba(148,163,184,0.22)', bg: 'rgba(148,163,184,0.06)',
    effect: 'float',
    quotes: [
      'Rest, my love. You carry so much. Let it down for now.',
      'Being tired means you gave everything today. I\'m proud of you.',
      'Sleep is your body asking for love. Give it some.',
      'You can rest now. I\'ll watch over the universe tonight.',
      'Even when you\'re tired, you are still the most beautiful thing.',
      'You don\'t have to hold it all together. Rest.',
    ],
  },
  'Angry': {
    emoji: '·', color: '#EF4444', glow: 'rgba(239,68,68,0.35)', bg: 'rgba(239,68,68,0.08)',
    effect: 'fire',
    quotes: [
      'Your anger is valid. I see you. I\'m here.',
      'Let it out. You\'re allowed to be angry. I\'m not going anywhere.',
      'Even your fire is beautiful to me.',
      'I\'d face anything angry with you. You\'re never alone in this.',
      'Whatever made you angry doesn\'t deserve your peace. Let it go.',
      'Be angry. I\'m right here, on your side. Always.',
    ],
  },
  'Crazy': {
    emoji: '·', color: '#FB7185', glow: 'rgba(251,113,133,0.3)', bg: 'rgba(251,113,133,0.08)',
    effect: 'confetti',
    quotes: [
      'I love this chaotic beautiful version of you so much.',
      'Your kind of crazy is my favorite kind of everything.',
      'Unhinged and iconic. That\'s you. That\'s my love.',
      'I don\'t want normal. I want exactly this.',
      'Don\'t change. Ever. The world is better with your chaos in it.',
      'Your chaos is someone else\'s favorite kind of magic.',
    ],
  },
  'Sad': {
    emoji: '·', color: '#60A5FA', glow: 'rgba(96,165,250,0.3)', bg: 'rgba(96,165,250,0.07)',
    effect: 'rain',
    quotes: [
      'It\'s okay to be sad. I\'m sitting right here with you.',
      'You don\'t have to hold it together right now. Not with me.',
      'Sadness is just love with nowhere to go. Let it flow.',
      'I\'m not going anywhere. Talk to me whenever you\'re ready.',
      'Even on the hardest days, you are still so loved.',
      'Cry if you need to. I\'ll be here when the tears are done.',
    ],
  },
  'Stressed': {
    emoji: '·', color: '#F87171', glow: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.07)',
    effect: 'swirl',
    quotes: [
      'Breathe. Slowly. You have handled everything so far.',
      'One thing at a time. That\'s all. I believe in you.',
      'You are stronger than any stress that comes your way.',
      'Step away for one minute. Just one. The rest will wait.',
      'Whatever it is, we\'ll figure it out. Together.',
      'You\'ve survived 100% of your hard days. This one too.',
    ],
  },
  'Bored': {
    emoji: '·', color: '#9CA3AF', glow: 'rgba(156,163,175,0.2)', bg: 'rgba(156,163,175,0.05)',
    effect: 'float',
    quotes: [
      'Bored? Come explore our universe. I hid things for you. 🌌',
      'Even your boredom is cute. I said what I said.',
      'Being bored means your brain needs something beautiful. Go find it.',
      'Bored together is still my favorite way to exist.',
      'Wander around in here. There\'s magic hiding.',
      'The universe always has something for you. Look closer.',
    ],
  },
  'Anxious': {
    emoji: '·', color: '#22D3EE', glow: 'rgba(34,211,238,0.3)', bg: 'rgba(34,211,238,0.07)',
    effect: 'swirl',
    quotes: [
      'Breathe in. Slowly. I\'m right here. Breathe out.',
      'Anxiety lies. You are safe. You are loved. You are okay.',
      'Your nervous system is trying to protect you. Be gentle with it.',
      'Ground yourself. Feel the floor. Feel my love. You\'re here.',
      'This feeling passes. It always does. I\'ll be here when it does.',
      'You are not alone in this. Not for one second.',
    ],
  },
  'Silly': {
    emoji: '·', color: '#A3E635', glow: 'rgba(163,230,53,0.3)', bg: 'rgba(163,230,53,0.07)',
    effect: 'confetti',
    quotes: [
      'Absolutely unhinged and I love every second of it.',
      'You being silly is genuinely my source of serotonin.',
      'This energy. This chaotic beautiful energy. Don\'t ever lose it.',
      'I need you to know I find you hilarious and perfect.',
      'Iconic. Legendary. That\'s my love.',
      'Please never stop. You make everything more alive.',
    ],
  },
  'Vibing': {
    emoji: '♪', color: '#C084FC', glow: 'rgba(192,132,252,0.3)', bg: 'rgba(192,132,252,0.08)',
    effect: 'float',
    quotes: [
      'That vibe you\'re in right now? Stay in it. It looks good on you.',
      'Music + you = the universe at its most beautiful.',
      'I could listen to your playlist forever.',
      'Vibe as loud as your heart wants. No one deserves it more.',
      'Whatever song this is — it\'s now my favorite because you\'re feeling it.',
      'You and music together is one of the most beautiful things in existence.',
    ],
  },
};

/* ── Quote tracking in localStorage ── */
function getNextIdx(mood: string, total: number): number {
  try {
    const seen: number[] = JSON.parse(localStorage.getItem(`lu_q_${mood}`) ?? '[]');
    const unseen = Array.from({ length: total }, (_, i) => i).filter(i => !seen.includes(i));
    if (unseen.length === 0) { localStorage.setItem(`lu_q_${mood}`, '[]'); return 0; }
    return unseen[Math.floor(Math.random() * unseen.length)];
  } catch { return 0; }
}

function markSeen(mood: string, idx: number, total: number) {
  try {
    const key = `lu_q_${mood}`;
    const seen: number[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (!seen.includes(idx)) {
      const next = [...seen, idx];
      localStorage.setItem(key, next.length >= total ? '[]' : JSON.stringify(next));
    }
  } catch {}
}

/* ── Particle overlay ── */
function ParticleOverlay({ effect, color, emoji }: { effect: EffectType; color: string; emoji: string }) {
  const count = effect === 'rain' ? 22 : effect === 'confetti' ? 20 : effect === 'fire' ? 16 : 14;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 160 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.8, times: [0, 0.08, 0.65, 1], ease: 'easeInOut' }}
    >
      {Array.from({ length: count }).map((_, i) => {
        /* ── Radial burst from center ── */
        if (effect === 'radial') {
          const angle = (i / count) * Math.PI * 2;
          const dist  = 110 + pr(i) * 90;
          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none select-none"
              style={{ left: '50%', top: '42%', fontSize: 14 + pr(i) * 16 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1.6 }}
              transition={{ duration: 1.1 + pr(i) * 0.7, delay: pr(i) * 0.25, ease: 'easeOut' }}
            >
              <span style={{ color, filter: `drop-shadow(0 0 6px ${color})` }}>{emoji}</span>
            </motion.div>
          );
        }

        /* ── Rain drops ── */
        if (effect === 'rain') {
          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${pr(i) * 100}%`, top: -20,
                width: 1.5, height: 14 + pr(i + 50) * 12,
                background: `linear-gradient(180deg, transparent, ${color}99, transparent)`,
              }}
              animate={{ y: '105vh' }}
              transition={{ duration: 1.3 + pr(i) * 0.9, delay: pr(i) * 1.8, ease: 'linear' }}
            />
          );
        }

        /* ── Float upward ── */
        if (effect === 'float') {
          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none select-none"
              style={{ left: `${8 + pr(i) * 84}%`, top: `${25 + pr(i + 30) * 55}%`, fontSize: 12 + pr(i) * 20 }}
              initial={{ opacity: 0.9, y: 0 }}
              animate={{ y: -(140 + pr(i) * 100), opacity: 0, x: (pr(i + 10) - 0.5) * 40 }}
              transition={{ duration: 1.4 + pr(i) * 1.0, delay: pr(i) * 0.9, ease: 'easeOut' }}
            >
              <span style={{ color, filter: `drop-shadow(0 0 5px ${color})` }}>{emoji}</span>
            </motion.div>
          );
        }

        /* ── Confetti fall ── */
        if (effect === 'confetti') {
          const PALETTE = [color, '#FFB84D', '#A78BFA', '#34D399', '#60A5FA', '#F472B6'];
          return (
            <motion.div
              key={i}
              className="absolute rounded-sm pointer-events-none"
              style={{
                left: `${4 + pr(i) * 92}%`, top: -14,
                width: 5 + pr(i) * 7, height: 9 + pr(i + 10) * 9,
                background: PALETTE[i % PALETTE.length],
                opacity: 0.85,
              }}
              animate={{ y: '108vh', rotate: (pr(i) - 0.5) * 800, x: (pr(i + 20) - 0.5) * 90 }}
              transition={{ duration: 2.0 + pr(i) * 0.8, delay: pr(i) * 0.4, ease: 'easeIn' }}
            />
          );
        }

        /* ── Fire sparks rising ── */
        if (effect === 'fire') {
          const fireColor = i % 2 === 0 ? '#FF4500' : '#FFB84D';
          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${20 + pr(i) * 60}%`, bottom: 0,
                width: 7 + pr(i) * 11, height: 7 + pr(i) * 11,
                background: `radial-gradient(circle, ${fireColor}, transparent)`,
                filter: `blur(1px)`,
              }}
              initial={{ y: 0, opacity: 0.95, scale: 1 }}
              animate={{ y: -(180 + pr(i) * 220), opacity: 0, scale: 0.1, x: (pr(i + 5) - 0.5) * 70 }}
              transition={{ duration: 1.1 + pr(i) * 0.9, delay: pr(i) * 0.35, ease: 'easeOut' }}
            />
          );
        }

        /* ── Swirl spiral ── */
        if (effect === 'swirl') {
          const angle = (i / count) * Math.PI * 4;
          const r = 50 + (i / count) * 110;
          return (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
              style={{ left: '50%', top: '40%', background: color, opacity: 0.75, filter: `blur(0.5px)` }}
              animate={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r, opacity: 0, scale: 0 }}
              transition={{ duration: 1.6 + pr(i) * 0.5, delay: i * 0.05, ease: 'easeInOut' }}
            />
          );
        }

        return null;
      })}
    </motion.div>
  );
}

/* ── Main MoodToast ── */
interface Props { mood: string; onClose: () => void }

export default function MoodToast({ mood, onClose }: Props) {
  const data = MOOD_DATA[mood];
  const [quoteIdx, setQuoteIdx]     = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [showEffect, setShowEffect] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!data || initialized.current) return;
    initialized.current = true;
    const idx = getNextIdx(mood, data.quotes.length);
    setQuoteIdx(idx);
    markSeen(mood, idx, data.quotes.length);
    /* Auto-hide effect after 2.8s */
    const te = setTimeout(() => setShowEffect(false), 2800);
    /* Auto-close toast after 12s */
    const tc = setTimeout(onClose, 12000);
    return () => { clearTimeout(te); clearTimeout(tc); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = useCallback(() => {
    if (!data) return;
    softTap(); playChime();
    setQuoteVisible(false);
    setTimeout(() => {
      const idx = getNextIdx(mood, data.quotes.length);
      markSeen(mood, idx, data.quotes.length);
      setQuoteIdx(idx);
      setQuoteVisible(true);
    }, 380);
  }, [mood, data]);

  if (!data) return null;

  return (
    <>
      {/* Particle overlay */}
      <AnimatePresence>
        {showEffect && <ParticleOverlay effect={data.effect} color={data.color} emoji={data.emoji} />}
      </AnimatePresence>

      {/* Toast card */}
      <motion.div
        className="fixed left-0 right-0 bottom-0 px-4 pb-6"
        style={{ zIndex: 200 }}
        initial={{ y: 120, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 120, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 190 }}
      >
        <div
          className="rounded-[22px] overflow-hidden"
          style={{
            background: `linear-gradient(148deg, ${data.bg}, rgba(7,2,14,0.96))`,
            border: `1px solid ${data.color}38`,
            boxShadow: `0 0 60px ${data.glow}, 0 16px 48px rgba(0,0,0,0.75), inset 0 1px 0 ${data.color}22`,
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          }}
        >
          {/* Top accent line */}
          <div className="h-[1.5px]" style={{
            background: `linear-gradient(90deg, transparent, ${data.color}DD, transparent)`,
          }} />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <motion.span
                className="text-[22px] select-none leading-none"
                animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {data.emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black leading-tight" style={{ color: data.color + 'BB' }}>
                  feeling {mood}
                </p>
                <p className="text-[8px] text-white/25 mt-0.5 italic">a thought just for you ✦</p>
              </div>
              <button
                onClick={() => { softTap(); onClose(); }}
                className="w-7 h-7 rounded-[10px] flex items-center justify-center cursor-pointer shrink-0 transition-opacity opacity-30 hover:opacity-60 active:opacity-80"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <X size={11} className="text-white" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mb-3" style={{
              background: `linear-gradient(90deg, transparent, ${data.color}35, transparent)`,
            }} />

            {/* Quote */}
            <AnimatePresence mode="wait">
              {quoteVisible && (
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-[13.5px] leading-[1.6] font-medium italic mb-3.5"
                  style={{ color: 'rgba(255,240,248,0.88)' }}
                >
                  &ldquo;{data.quotes[quoteIdx]}&rdquo;
                </motion.p>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-[8px] italic text-white/20 leading-tight">
                each thought is different ✦ updates every time
              </p>
              <motion.button
                onClick={handleNext}
                whileTap={{ scale: 0.91 }}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-[12px] text-[11px] font-black cursor-pointer shrink-0"
                style={{
                  background: data.color + '1A',
                  border: `1px solid ${data.color}45`,
                  color: data.color,
                  boxShadow: `0 0 16px ${data.color}25`,
                }}
              >
                Next ✦
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

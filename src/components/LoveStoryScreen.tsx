'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, BookOpen, Sparkles, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { successVibe, softTap } from '@/lib/useHaptics';
import { playBloom, playSparkle, playReveal, playPop, playSuccess } from '@/lib/sounds';
import { trackInteraction } from '@/lib/sessionTracker';

const CHAPTERS = [
  {
    id: 1,
    color: '#FF4D8D',
    title: 'How the story begins…',
    prompt: 'She looked up and there he was. The first thing she noticed about him was…',
    choices: [
      { emoji: '👀', text: 'his eyes — like they already knew her' },
      { emoji: '😊', text: 'the way he smiled without even trying' },
      { emoji: '🗣️', text: 'his voice — soft but sure of itself' },
      { emoji: '💫', text: 'the way he made the room feel different' },
    ],
  },
  {
    id: 2,
    color: '#A78BFA',
    title: 'The first feeling…',
    prompt: 'Before she knew anything real about him, she already felt…',
    choices: [
      { emoji: '🦋', text: 'butterflies she didn\'t understand yet' },
      { emoji: '🌊', text: 'a wave of calm she hadn\'t felt before' },
      { emoji: '🔥', text: 'something she tried very hard to ignore' },
      { emoji: '⭐', text: 'like the universe was trying to tell her something' },
    ],
  },
  {
    id: 3,
    color: '#FFB84D',
    title: 'The turning point…',
    prompt: 'There was one moment she knew something had changed. It was when…',
    choices: [
      { emoji: '💬', text: 'he said her name like it meant something' },
      { emoji: '🤝', text: 'he stayed when he didn\'t have to' },
      { emoji: '😂', text: 'they laughed at exactly the same thing at exactly the same time' },
      { emoji: '🌙', text: 'they talked until it was almost morning and she didn\'t notice' },
    ],
  },
  {
    id: 4,
    color: '#FF4D8D',
    title: 'What she discovered…',
    prompt: 'The longer she knew him, the more she realized…',
    choices: [
      { emoji: '🏠', text: 'he felt like home — and she\'d been looking for that' },
      { emoji: '💪', text: 'he made her braver, even when she didn\'t say it' },
      { emoji: '🪞', text: 'he saw her — the real her — and chose to stay' },
      { emoji: '✨', text: 'she was different around him, softer, more herself' },
    ],
  },
  {
    id: 5,
    color: '#A78BFA',
    title: 'The love that grew…',
    prompt: 'She had loved people before, but this was different because…',
    choices: [
      { emoji: '💗', text: 'it felt chosen, not just felt' },
      { emoji: '🌱', text: 'it grew slowly, like something real' },
      { emoji: '🌊', text: 'it scared her a little — and that\'s how she knew' },
      { emoji: '🌟', text: 'it made her want to be everything she already was, but more' },
    ],
  },
  {
    id: 6,
    color: '#FFB84D',
    title: 'And so the story continues…',
    prompt: 'In the end — and in the beginning — all she wanted was…',
    choices: [
      { emoji: '🤗', text: 'to hold him and never rush it' },
      { emoji: '🌍', text: 'to build something real with him, one day at a time' },
      { emoji: '💫', text: 'this — exactly this — and nothing more' },
      { emoji: '♾️', text: 'forever, however that looks for them' },
    ],
  },
] as const;

type Selections = Partial<Record<number, string>>;

function buildStory(selections: Selections): string {
  return CHAPTERS.map(c => {
    const choice = selections[c.id];
    return `${c.prompt.replace('…', '')} ${choice ?? '…'}`;
  }).join(' ');
}

export default function LoveStoryScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [phase, setPhaseLocal] = useState<'building' | 'reading'>('building');

  const chapter = CHAPTERS[step];

  const choose = (text: string) => {
    softTap(); playPop(); playSparkle();
    const newSel = { ...selections, [chapter.id]: text };
    setSelections(newSel);

    if (step < CHAPTERS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 320);
    } else {
      successVibe(); playBloom(); playSuccess();
      trackInteraction('love-story-written');
      setTimeout(() => {
        setPhaseLocal('reading');
        const story = buildStory(newSel);
        notifyOwner(`📖 <b>She wrote your love story!</b>\n\n<i>"${story}"</i>\n\n<b>Chapter by chapter, she chose you. 💕</b>`);
      }, 350);
    }
  };

  const restart = () => {
    softTap(); playReveal();
    setSelections({});
    setStep(0);
    setPhaseLocal('building');
  };

  if (phase === 'reading') {
    const story = buildStory(selections);
    return (
      <motion.div className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,77,141,0.15) 0%, rgba(123,92,255,0.08) 60%, transparent 100%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">
          <div className="flex items-center justify-between">
            <button onClick={() => setPhase('home')}
              className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
              style={{ color: 'rgba(255,230,242,0.6)' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex items-center gap-2">
              <BookOpen size={14} style={{ color: '#FF4D8D' }} />
              <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Your Story</span>
            </div>
            <button onClick={restart}
              className="glass flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold active:scale-95 transition-transform cursor-pointer"
              style={{ color: 'rgba(255,179,199,0.55)' }}>
              <RotateCcw size={12} /> Redo
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,141,0.3))' }} />
              <Heart size={12} fill="currentColor" style={{ color: '#FF4D8D' }} />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,77,141,0.3), transparent)' }} />
            </div>
            <h2 className="text-xl font-black text-white text-center mb-1">Your Love Story</h2>
            <p className="text-[11px] text-center uppercase tracking-widest mb-6" style={{ color: 'rgba(255,179,199,0.4)' }}>written by you, for the two of you</p>
          </motion.div>

          {/* Story chapters */}
          {CHAPTERS.map((c, i) => (
            <motion.div key={c.id} className="glass-cinema rounded-[20px] overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
              <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}44)` }} />
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: `${c.color}aa` }}>{c.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,230,242,0.8)' }}>
                  <span style={{ color: 'rgba(255,230,242,0.4)' }}>{c.prompt.slice(0, -1)} </span>
                  <span className="font-semibold">{selections[c.id]}</span>
                </p>
              </div>
            </motion.div>
          ))}

          {/* Footer */}
          <motion.div className="glass-cinema rounded-[20px] p-4 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <p className="text-[13px] italic leading-relaxed" style={{ color: 'rgba(255,230,242,0.6)' }}>
              "This is your story — but it belongs to both of you. He read every word." 💌
            </p>
          </motion.div>

          <motion.button onClick={() => setPhase('home')}
            className="w-full py-[17px] rounded-[22px] font-black text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#FF4D8D,#C9245F)', boxShadow: '0 8px 36px rgba(255,77,141,0.4)' }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
            <Heart size={15} fill="currentColor" /> Back to Map
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-y-auto app-scroll" data-scroll
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}>

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${chapter.color}18 0%, transparent 65%)`, filter: 'blur(60px)', transition: 'all 0.6s ease' }} />

      <div className="relative z-10 flex flex-col px-4 pt-10 pb-10 max-w-lg mx-auto w-full gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase('home')}
            className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
            style={{ color: 'rgba(255,230,242,0.6)' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={14} style={{ color: '#FF4D8D' }} />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'rgba(255,230,242,0.5)' }}>Love Story</span>
          </div>
          <div className="text-[11px] font-bold" style={{ color: 'rgba(255,179,199,0.5)' }}>
            {step + 1}/{CHAPTERS.length}
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}88)` }}
            animate={{ width: `${((step + 1) / CHAPTERS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }} />
        </div>

        {/* Chapter */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}>

            {/* Chapter header */}
            <div className="glass-cinema rounded-[20px] overflow-hidden mb-5">
              <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}44)` }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} style={{ color: chapter.color }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: `${chapter.color}aa` }}>
                    Chapter {step + 1} · {chapter.title}
                  </span>
                </div>
                <p className="text-[15px] font-semibold leading-relaxed" style={{ color: 'rgba(255,230,242,0.9)' }}>
                  {chapter.prompt}
                </p>
              </div>
            </div>

            {/* Choices */}
            <div className="flex flex-col gap-3">
              {chapter.choices.map((choice, i) => {
                const isSelected = selections[chapter.id] === choice.text;
                return (
                  <motion.button key={choice.text}
                    onClick={() => choose(choice.text)}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3.5 p-4 rounded-[18px] text-left active:scale-[0.97] transition-all cursor-pointer"
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${chapter.color}28, ${chapter.color}14)` : 'rgba(255,255,255,0.045)',
                      border: isSelected ? `1px solid ${chapter.color}50` : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isSelected ? `0 0 20px ${chapter.color}28` : 'none',
                    }}
                    whileTap={{ scale: 0.96 }}>
                    <span className="text-2xl shrink-0">{choice.emoji}</span>
                    <span className="text-[13px] font-medium leading-snug" style={{ color: isSelected ? 'rgba(255,230,242,0.95)' : 'rgba(255,230,242,0.65)' }}>
                      {choice.text}
                    </span>
                    {isSelected && (
                      <motion.div className="ml-auto shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: chapter.color }}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Heart size={11} fill="white" className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i < step ? '#FF4D8D' : i === step ? c.color : 'rgba(255,255,255,0.1)',
              }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

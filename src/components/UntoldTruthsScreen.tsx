'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';

const TRUTHS = [
  { id: 0, text: 'I think about you when something good happens, and you\'re the first person I want to tell — even if I have to wait hours for you to wake up.' },
  { id: 1, text: 'The way you say my name — even through a screen — does something to me that I can\'t fully explain.' },
  { id: 2, text: 'Sometimes I stay on the call longer than I need to. I just don\'t want to hear the sound it makes when you\'re gone.' },
  { id: 3, text: 'You\'ve changed something in me that I didn\'t even know needed changing.' },
  { id: 4, text: 'I picture the future often. You\'re already in all of it — I don\'t know how to picture it without you.' },
  { id: 5, text: 'There are nights when the distance physically hurts. Not metaphorically. It actually hurts to not be able to reach you.' },
  { id: 6, text: 'I love the way you love me — even through a phone screen. The specific way you do it. I don\'t take it for granted.' },
  { id: 7, text: 'I\'ve never felt this kind of quiet with anyone. The kind where I don\'t need to perform or explain myself.' },
  { id: 8, text: 'Sometimes I look at your photos and just feel deeply, quietly grateful that you exist and that you chose me.' },
  { id: 9, text: 'I already know I want to choose you every day — from any distance, across any time zone. I just wanted you to know that.' },
];

const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 89.3) % 100,
  size: 1 + (i % 3) * 0.8,
  dur: 3 + (i % 5) * 0.8,
  delay: (i * 0.2) % 4,
  opacity: 0.2 + (i % 4) * 0.12,
}));

export default function UntoldTruthsScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const current = TRUTHS[index];
  const isTouched = touched[current.id];

  const handleFlip = () => { if (!flipped) setFlipped(true); };

  const handleNext = () => {
    if (index === TRUTHS.length - 1) {
      const touchedCount = Object.values(touched).filter(Boolean).length;
      const noteLines = TRUTHS
        .filter(t => notes[t.id]?.trim())
        .map(t => `"${t.text.slice(0, 40)}…"\nHer reply: "${notes[t.id]}"`)
        .join('\n\n');
      notifyOwner(
        `💫 <b>She read the Untold Truths</b>\n\n${touchedCount} of 10 truths touched her heart${noteLines ? `\n\n${noteLines}` : ''}`
      );
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #020212 0%, #07072a 45%, #030318 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />

      {STARS.map(s => (
        <motion.div key={s.id} className="fixed rounded-full pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: 'rgba(200,210,255,0.8)' }}
          animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll" data-scroll>
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => setPhase('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black" style={{ color: 'rgba(200,210,255,0.95)' }}>Untold Truths</h1>
            <p className="text-[11px]" style={{ color: 'rgba(140,160,255,0.45)' }}>Things I never said out loud — for you</p>
          </div>
          {!done && <span className="text-[12px] font-bold shrink-0" style={{ color: 'rgba(140,160,255,0.4)' }}>{index + 1} / {TRUTHS.length}</span>}
        </div>

        <div className="px-4 pb-5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
              animate={{ width: `${((index + (done ? 1 : 0)) / TRUTHS.length) * 100}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.38 }}
                className="flex flex-col gap-5">

                {/* Card */}
                <div className="relative" style={{ perspective: 1000, height: 240 }}>
                  <motion.div className="w-full h-full relative"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}>

                    {/* Front — mystery */}
                    <div className="absolute inset-0 rounded-[24px] flex flex-col items-center justify-center gap-4 cursor-pointer"
                      style={{
                        background: 'linear-gradient(145deg, rgba(15,15,50,0.95), rgba(8,8,35,0.95))',
                        border: '1px solid rgba(99,102,241,0.25)',
                        boxShadow: '0 8px 40px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                      onClick={handleFlip}>
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
                        <span style={{ fontSize: 36 }}>💫</span>
                      </motion.div>
                      <p className="text-[13px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(140,160,255,0.5)' }}>
                        Tap to hear it
                      </p>
                    </div>

                    {/* Back — truth */}
                    <div className="absolute inset-0 rounded-[24px] flex flex-col items-center justify-center px-6 gap-4"
                      style={{
                        background: 'linear-gradient(145deg, rgba(20,20,65,0.97), rgba(12,12,45,0.97))',
                        border: '1px solid rgba(99,102,241,0.3)',
                        boxShadow: '0 8px 40px rgba(99,102,241,0.15)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}>
                      <p className="text-[15px] font-semibold leading-relaxed text-center"
                        style={{ color: 'rgba(220,225,255,0.92)' }}>
                        {current.text}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Reaction (visible after flip) */}
                <AnimatePresence>
                  {flipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-3">

                      <button
                        onClick={() => setTouched(prev => ({ ...prev, [current.id]: !prev[current.id] }))}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all"
                        style={{
                          background: isTouched ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                          border: isTouched ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <Heart size={16} fill={isTouched ? '#818cf8' : 'none'} style={{ color: isTouched ? '#818cf8' : 'rgba(140,160,255,0.5)' }} />
                        <span className="text-[13px] font-semibold" style={{ color: isTouched ? 'rgba(180,195,255,0.9)' : 'rgba(140,160,255,0.5)' }}>
                          {isTouched ? 'This touched me' : 'Mark as touched my heart'}
                        </span>
                      </button>

                      <div className="rounded-[18px] overflow-hidden"
                        style={{ border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                        <textarea
                          value={notes[current.id] || ''}
                          onChange={e => setNotes(prev => ({ ...prev, [current.id]: e.target.value }))}
                          placeholder="Write back to me… (optional)"
                          rows={3}
                          className="w-full bg-transparent px-4 pt-3 pb-2 text-[13px] resize-none outline-none placeholder:text-white/15"
                          style={{ color: 'rgba(200,215,255,0.85)', caretColor: '#818cf8', lineHeight: '1.65' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={flipped ? handleNext : handleFlip}
                  className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
                  style={{
                    background: flipped ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255,255,255,0.07)',
                    border: flipped ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: flipped ? '0 4px 20px rgba(99,102,241,0.35)' : 'none',
                    color: flipped ? 'white' : 'rgba(140,160,255,0.6)',
                  }}>
                  {flipped ? (index === TRUTHS.length - 1 ? 'Complete ✦' : 'Next Truth →') : 'Hear it →'}
                </button>
              </motion.div>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <span style={{ fontSize: 56 }}>💫</span>
                </motion.div>
                <div>
                  <h2 className="text-[21px] font-black mb-3" style={{ color: 'rgba(200,215,255,0.95)' }}>
                    Now you know
                  </h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(140,165,255,0.6)' }}>
                    Every one of those truths was waiting quietly inside me. I just needed you to know.
                  </p>
                </div>
                <button onClick={() => setPhase('home')}
                  className="px-8 py-4 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
                  Back to Our Universe
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

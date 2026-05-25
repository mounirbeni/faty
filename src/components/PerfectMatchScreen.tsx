'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Puzzle, Plane, Coffee, Heart, Star, Camera, Music, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { heartbeat, softTap, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';

const MATCH_ICONS = [Plane, Coffee, Heart, Star, Camera, Music];

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PerfectMatchScreen() {
  const { setPhase } = useGameStore();
  
  // Game state
  const [cards, setCards] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    heartbeat();
    // Initialize cards on mount: pairs of 0-5
    const initialPairs = [...Array(6).keys(), ...Array(6).keys()];
    setCards(shuffleArray(initialPairs));
  }, []);

  useEffect(() => {
    if (matchedPairs.length === 6 && !isDone) {
      setTimeout(() => {
        successVibe();
        setIsDone(true);
        notifyOwner(`🧩 <b>Your angel completed Perfect Match!</b>\n\nShe found all 6 pairs in the memory matching game. 💙`);
      }, 800);
    }
  }, [matchedPairs, isDone]);

  const handleCardTap = (index: number) => {
    if (isLocked) return;
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index])) return;

    softTap();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;

      if (cards[first] === cards[second]) {
        // Match found
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, cards[first]]);
          setFlippedIndices([]);
          setIsLocked(false);
          heartbeat();
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  if (isDone) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          onAnimationComplete={() => heartbeat()}
        >
          <CheckCircle2 size={44} className="text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-white mb-3 bg-gradient-to-r from-indigo-300 to-blue-300 text-gradient">
          Perfect Match!
        </h2>
        
        <div className="glass-strong p-6 rounded-3xl w-full border border-indigo-500/30 relative overflow-hidden mb-8">
          <p className="text-[15px] text-white/90 leading-relaxed font-medium">
            Just like finding these pairs, discovering how perfectly we align has been the best part of my year. We truly are the perfect match. 🧩💙
          </p>
        </div>

        <motion.button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-transform cursor-pointer flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Back to Map <Puzzle size={16} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between w-full pt-10 pb-4 shrink-0">
        <button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-indigo-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Puzzle size={11} /> Perfect Match
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center mb-10 relative z-10">
        <p className="text-white/50 text-sm mb-6 text-center">
          Tap two cards to find their pair.
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[320px]">
          {cards.map((iconId, index) => {
            const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(iconId);
            const isMatched = matchedPairs.includes(iconId);
            const Icon = MATCH_ICONS[iconId];

            return (
              <div
                key={index}
                className="aspect-square relative cursor-pointer"
                onClick={() => handleCardTap(index)}
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                  
                >
                  {/* Front of card (Hidden side) */}
                  <div 
                    className="absolute inset-0 glass-strong rounded-2xl border border-white/10 flex items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <Puzzle size={24} className="text-white/20" />
                  </div>

                  {/* Back of card (Revealed side) */}
                  <div 
                    className={`absolute inset-0 rounded-2xl flex items-center justify-center backface-hidden shadow-lg ${
                      isMatched 
                        ? 'bg-gradient-to-br from-indigo-500/80 to-blue-600/80 border border-indigo-300/30' 
                        : 'glass-warm border border-white/20'
                    }`}
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      transform: 'rotateY(180deg)' 
                    }}
                  >
                    <Icon size={32} className={isMatched ? 'text-white' : 'text-indigo-400 drop-shadow-md'} />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, Globe, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat, successVibe } from '@/lib/useHaptics';

export const fortunesData = [
  "The stars align over Meknes. Your upcoming meeting will spark a flame that distance can never extinguish. 💫",
  "I see a beautiful shared future. It starts with a nervous smile on May 11, but quickly turns into the comfort you've both searched for. 🔮",
  "The crystal reveals a journey. The roads between Marrakesh and Meknes will soon feel very short. A deep, unbreakable bond is forming. 🛤️",
  "Patience will be rewarded. The countdown to May 11 ends, and a beautiful new chapter of true partnership begins. ✨",
  "Your energies match perfectly. Expect endless laughter, deep conversations, and the feeling of finally being 'home'. 🌙"
];

export default function FortuneTellerScreen() {
  const { setPhase, generateFortune, fortuneResult } = useGameStore();
  const [taps, setTaps] = useState(fortuneResult ? 3 : 0);
  const [revealed, setRevealed] = useState(!!fortuneResult);
  const [fortuneText, setFortuneText] = useState(fortuneResult ? fortunesData[parseInt(fortuneResult)] : "");

  useEffect(() => {
    heartbeat();
    if (!fortuneResult) {
      generateFortune(fortunesData.length);
    }
  }, [fortuneResult, generateFortune]);

  const handleTap = () => {
    if (revealed) return;
    softTap();
    setTaps(prev => prev + 1);

    if (taps + 1 >= 3) {
      setTimeout(() => {
        successVibe();
        setFortuneText(fortuneResult ? fortunesData[parseInt(fortuneResult)] : fortunesData[0]);
        setRevealed(true);
      }, 500);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-cyan-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Sparkles size={11} /> The Oracle
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="orb"
              className="flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-white/60 text-sm mb-12 font-medium tracking-wide">
                Tap the crystal 3 times to reveal your future...
              </p>
              
              <motion.button
                onClick={handleTap}
                className="relative cursor-pointer select-none"
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Glow behind orb */}
                <div 
                  className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-300 ${
                    taps === 1 ? 'bg-cyan-500/40 scale-110' : 
                    taps === 2 ? 'bg-cyan-400/60 scale-125' : 
                    'bg-blue-500/20 scale-100'
                  }`} 
                />
                
                {/* Orb */}
                <div className="w-48 h-48 rounded-full glass-strong border-2 border-cyan-300/30 flex items-center justify-center shadow-[inset_0_0_40px_rgba(34,211,238,0.3)] relative overflow-hidden">
                  <Globe size={80} className={`text-cyan-200 transition-all duration-300 ${taps > 0 ? 'opacity-80' : 'opacity-40'}`} />
                  
                  {/* Energy rings */}
                  {taps >= 1 && (
                    <motion.div 
                      className="absolute inset-0 border border-cyan-400/50 rounded-full"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {taps >= 2 && (
                    <motion.div 
                      className="absolute inset-0 border-2 border-cyan-300/60 rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.button>
              
              {/* Taps indicator */}
              <div className="flex gap-2 mt-12">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      taps > i ? 'bg-cyan-300 scale-125 shadow-[0_0_10px_rgba(103,232,249,0.8)]' : 'bg-white/20'
                    }`} 
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fortune"
              className="flex flex-col items-center justify-center w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              onAnimationComplete={() => heartbeat()}
            >
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/30">
                <Sparkles size={32} className="text-cyan-300" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                The Oracle Speaks
              </h2>
              
              <div className="glass-strong p-8 rounded-3xl w-full border border-cyan-500/30 shadow-2xl shadow-cyan-900/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                <p className="text-lg text-white leading-relaxed text-center font-medium italic">
                  &quot;{fortuneText}&quot;
                </p>
              </div>

              <motion.button
                onClick={() => setPhase('home')}
                className="mt-10 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/30 active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Back to Map <Map size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

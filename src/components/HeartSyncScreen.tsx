'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, HeartPulse, Heart, Mail } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';

const MAX_TAPS = 15;

export default function HeartSyncScreen() {
  const { setPhase, heartSyncComplete, setHeartSyncComplete } = useGameStore();
  const [taps, setTaps] = useState(heartSyncComplete ? MAX_TAPS : 0);
  const [revealed, setRevealed] = useState(!!heartSyncComplete);

  useEffect(() => {
    heartbeat();
  }, []);

  const handleTap = () => {
    if (revealed) return;
    softTap();
    
    setTaps(prev => {
      const newTaps = prev + 1;
      if (newTaps >= MAX_TAPS) {
        setTimeout(() => {
          successVibe();
          setHeartSyncComplete();
          setRevealed(true);
          // Silent Telegram notification
          notifyOwner(`💓 <b>Faty just completed the Heart Sync!</b>\n\nShe is reading your secret love note right now.`);
        }, 300);
      }
      return newTaps;
    });
  };

  const progress = Math.min((taps / MAX_TAPS) * 100, 100);

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
          <p className="text-[11px] text-rose-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <HeartPulse size={11} /> Heart Sync
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="game"
              className="flex flex-col items-center justify-center w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <p className="text-white/60 text-sm mb-16 font-medium tracking-wide text-center">
                Tap the heart to sync our beats...
              </p>
              
              <motion.button
                onClick={handleTap}
                className="relative cursor-pointer select-none mb-16"
                whileTap={{ scale: 0.85 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.2, repeat: Infinity, ease: "easeInOut"
                }}
              >
                {/* Glow */}
                <div 
                  className="absolute inset-0 rounded-full bg-rose-500/40 blur-[40px] transition-all duration-300"
                  style={{ transform: `scale(${1 + (progress / 100) * 0.5})`, opacity: 0.3 + (progress / 100) * 0.7 }}
                />
                
                <Heart 
                  size={120} 
                  className="text-rose-500 relative z-10 transition-all duration-300" 
                  fill={progress > 0 ? "currentColor" : "none"} 
                  style={{ opacity: 0.5 + (progress / 100) * 0.5 }}
                />
              </motion.button>
              
              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between text-[10px] text-white/40 font-bold mb-2 uppercase tracking-wider">
                  <span>Syncing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              className="flex flex-col items-center justify-center w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              onAnimationComplete={() => heartbeat()}
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-rose-400/30">
                <Mail size={32} className="text-rose-300" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                Secret Note Unlocked
              </h2>
              
              <div className="glass-strong p-8 rounded-3xl w-full border border-rose-500/30 shadow-2xl shadow-rose-900/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
                <p className="text-[15px] text-white/90 leading-relaxed font-medium">
                  &quot;You did it! Faty, as you tapped this screen, just know my heart beats exactly the same way when I think about you. Every mile between Marrakesh and Meknes disappears when we talk. I can&apos;t wait to finally look you in the eyes and hold your hand on May 11. You are worth every single second of the wait. ❤️&quot;
                </p>
              </div>

              <motion.button
                onClick={() => setPhase('home')}
                className="mt-10 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
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

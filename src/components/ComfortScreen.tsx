'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, Coffee, Heart, Bell, Moon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, heartbeat, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';

export default function ComfortScreen() {
  const { setPhase } = useGameStore();
  const [isCuddling, setIsCuddling] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [cuddleNotified, setCuddleNotified] = useState(false);

  // Continuous heartbeat while cuddling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCuddling) {
      heartbeat(); // initial
      interval = setInterval(() => {
        heartbeat();
      }, 1200); // gentle slow heartbeat
    }
    return () => clearInterval(interval);
  }, [isCuddling]);

  const handleSendAlert = () => {
    if (alertSent) return;
    softTap();
    setAlertSent(true);
    successVibe();
    notifyOwner(
      `🚨 <b>Your love needs you right now!</b>\n\nShe is in the Comfort Room feeling unwell (period cramps/tired). Send her some love ASAP! ❤️🩹`
    );
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Soft warm pink glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-rose-500/20 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

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
            <Moon size={11} /> Comfort Room
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex flex-col px-6 pt-2 pb-10 max-w-lg mx-auto w-full gap-6 relative z-10">
        {/* Intro */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
            Cozy Corner
          </h1>
          <p className="text-[15px] text-rose-200/80 leading-relaxed max-w-xs mx-auto">
            A safe space for when cramps hit, or you just need to feel me close to you.
          </p>
        </div>

        {/* Virtual Hot Drink */}
        <motion.div 
          className="glass-warm p-6 rounded-3xl border border-rose-400/20 shadow-lg shadow-rose-900/20 flex flex-col items-center text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-4 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <Coffee size={32} />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Virtual Hot Chocolate</h2>
          <p className="text-sm text-white/60">
            Imagine me wrapping a warm blanket around you and bringing you your favorite hot drink.
          </p>
        </motion.div>

        {/* Cuddle Mode */}
        <motion.div 
          className="glass-strong p-6 rounded-3xl border border-rose-500/30 shadow-xl shadow-rose-900/40 flex flex-col items-center text-center relative overflow-hidden mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white mb-2">Virtual Cuddle</h2>
          <p className="text-xs text-white/50 mb-8 max-w-[250px]">
            Press and hold the heart to feel my heartbeat against yours. I&apos;m holding you tight.
          </p>

          <motion.div
            className="relative flex items-center justify-center w-32 h-32 mb-4"
            onPointerDown={() => {
              setIsCuddling(true);
              if (!cuddleNotified) {
                setCuddleNotified(true);
                notifyOwner(`🤗 <b>Your angel is using the Virtual Cuddle!</b>\n\nShe pressed and held the heart in the Comfort Room. She might need some extra love right now. 💗`);
              }
            }}
            onPointerUp={() => setIsCuddling(false)}
            onPointerLeave={() => setIsCuddling(false)}
          >
            {/* Pulsing ring when active */}
            <AnimatePresence>
              {isCuddling && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-rose-500/30 blur-md"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  exit={{ opacity: 0, scale: 1 }}
                />
              )}
            </AnimatePresence>
            
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-500 ${isCuddling ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/50' : 'bg-rose-950/50 border border-rose-500/30'}`}
              animate={isCuddling ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Heart 
                size={40} 
                className={isCuddling ? "text-white" : "text-rose-500/50"} 
                fill={isCuddling ? "currentColor" : "none"}
              />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isCuddling && (
              <motion.p 
                className="text-sm font-semibold text-rose-300 mt-2 h-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                *Rubbing your back gently...*
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SOS Button */}
        <motion.button
          onClick={handleSendAlert}
          className={`mt-4 w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            alertSent 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 pointer-events-none' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 active:scale-95 cursor-pointer hover:bg-rose-500/20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {alertSent ? (
            <>
              <Heart size={20} fill="currentColor" />
              I'm on my way (to my phone)!
            </>
          ) : (
            <>
              <Bell size={20} />
              I Need a Real Hug (Send Alert)
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  'thinking about you…',
  'missing you softly 💗',
  'listening to our song 🎧',
  'reading old memories 📖',
  'awake, thinking of you 🌙',
  'dreaming about us ✨',
  'always thinking of you 💖',
  'you make everything better 🌸',
  'wishing you were here right now',
  'counting every moment 💫',
];

interface Props {
  className?: string;
}

export default function EmotionalStatus({ className = '' }: Props) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % STATUSES.length);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
      {/* Live pulse dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: '#FF4D8D', boxShadow: '0 0 6px 2px rgba(255,77,141,0.55)' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={idx}
            className="text-[11px] italic tracking-wide"
            style={{ color: 'rgba(255,179,199,0.6)' }}
            initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {STATUSES[idx]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

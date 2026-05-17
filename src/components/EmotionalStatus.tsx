'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';

interface Props {
  className?: string;
}

export default function EmotionalStatus({ className = '' }: Props) {
  const presence = useEmotionalEngine((s) => s.presence);
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(presence);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setDisplay(presence);
      setVisible(true);
    }, 450);
    return () => clearTimeout(t);
  }, [presence]);

  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
      <motion.div
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: '#FF4D8D', boxShadow: '0 0 6px 2px rgba(255,77,141,0.55)' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={display}
            className="text-[11px] italic tracking-wide"
            style={{ color: 'rgba(255,179,199,0.6)' }}
            initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {display}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

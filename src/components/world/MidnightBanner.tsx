'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTimeContext } from '@/lib/timeSystem';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';

export default function MidnightBanner() {
  const time = useTimeContext();
  const message = useEmotionalEngine((s) => s.getMidnightMessage());

  const show = time.period === 'midnight' && message;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[3] pointer-events-none flex justify-center pt-safe"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <p
            className="mt-3 px-4 py-1.5 rounded-full text-[11px] italic tracking-wide"
            style={{
              color: 'rgba(255,200,220,0.75)',
              background: 'rgba(20,5,40,0.55)',
              border: '1px solid rgba(255,77,141,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

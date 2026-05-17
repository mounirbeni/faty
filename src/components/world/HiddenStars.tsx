'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';
import { whisperForIndex } from '@/lib/emotional/whispers';
import { playDiscovery, playTwinkle } from '@/lib/sounds';
import { useTimeContext } from '@/lib/timeSystem';

const pr = (s: number) => { const x = Math.sin(s + 7) * 10000; return x - Math.floor(x); };

export default function HiddenStars() {
  const [active, setActive] = useState<number | null>(null);
  const discoverSecret = useEmotionalEngine((s) => s.discoverSecret);
  const recordInteraction = useEmotionalEngine((s) => s.recordInteraction);
  const secretsFound = useEmotionalEngine((s) => s.secretsFound);
  const time = useTimeContext();

  const stars = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 8 + pr(i + 50) * 84,
        y: 6 + pr(i + 60) * 38,
        midnightOnly: i >= 4,
      })),
    []
  );

  const visible = stars.filter((s) => !s.midnightOnly || time.period === 'midnight');

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden>
      {visible.map((star) => {
        const secretId = `star-${star.id}`;
        if (secretsFound.includes(secretId)) return null;
        return (
          <button
            key={star.id}
            type="button"
            className="absolute pointer-events-auto w-6 h-6 rounded-full cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            aria-label="Hidden star"
            onClick={() => {
              playTwinkle();
              playDiscovery();
              discoverSecret(secretId);
              recordInteraction('secret');
              setActive(star.id);
              setTimeout(() => setActive(null), 4200);
            }}
          >
            <span
              className="block w-1 h-1 mx-auto rounded-full bg-white animate-twinkle"
              style={{ boxShadow: '0 0 8px 2px rgba(255,200,220,0.8)' }}
            />
          </button>
        );
      })}

      <AnimatePresence>
        {active !== null && (
          <motion.p
            className="fixed left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-center text-[12px] italic max-w-[280px] pointer-events-none"
            style={{
              top: '18%',
              color: 'rgba(255,230,242,0.9)',
              background: 'rgba(20,5,40,0.92)',
              border: '1px solid rgba(255,77,141,0.25)',
              boxShadow: '0 12px 40px rgba(255,77,141,0.2)',
            }}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          >
            &ldquo;{whisperForIndex(active)}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

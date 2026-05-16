'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { playDiscovery } from '@/lib/sounds';
import { trackInteraction } from '@/lib/sessionTracker';

interface Props {
  note: string;
  children?: React.ReactNode;
  className?: string;
  /** How long to hold (ms). Default 650 */
  holdMs?: number;
}

export default function LongPressNote({ note, children, className = '', holdMs = 650 }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const pressing = useRef(false);

  const startPress = useCallback(() => {
    if (revealed) return;
    pressing.current = true;
    startRef.current = performance.now();

    const animate = () => {
      if (!pressing.current) return;
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(elapsed / holdMs, 1);
      setProgress(p);
      if (p >= 1) {
        pressing.current = false;
        setRevealed(true);
        setProgress(0);
        playDiscovery();
        trackInteraction('hidden-note');
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [revealed, holdMs]);

  const endPress = useCallback(() => {
    if (pressing.current) {
      pressing.current = false;
      cancelAnimationFrame(rafRef.current);
      setProgress(0);
    }
  }, []);

  // circumference of r=22 circle
  const C = 2 * Math.PI * 22;

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
    >
      {children}

      {/* Progress ring overlay */}
      <AnimatePresence>
        {progress > 0 && !revealed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <svg width="52" height="52" className="-rotate-90" style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,141,0.5))' }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,77,141,0.12)" strokeWidth="2.5" />
              <circle cx="26" cy="26" r="22" fill="none"
                stroke="#FF4D8D" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${progress * C} ${C}`}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed love note */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="absolute z-50 left-1/2 -translate-x-1/2"
            style={{ bottom: 'calc(100% + 12px)', minWidth: 220, maxWidth: 300 }}
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          >
            {/* Pointer */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 rotate-45"
              style={{ background: 'rgba(30,5,50,0.95)', borderRight: '1px solid rgba(255,77,141,0.3)', borderBottom: '1px solid rgba(255,77,141,0.3)' }} />

            <div
              className="rounded-[20px] p-4 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(30,5,50,0.97) 0%, rgba(20,5,40,0.98) 100%)',
                border: '1px solid rgba(255,77,141,0.3)',
                boxShadow: '0 12px 48px rgba(255,77,141,0.22), 0 4px 16px rgba(0,0,0,0.6)',
              }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,77,141,0.04) 0%, transparent 60%)', borderRadius: 20 }} />

              <button
                onClick={() => setRevealed(false)}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <X size={10} style={{ color: 'rgba(255,179,199,0.6)' }} />
              </button>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-2"
              >
                <Heart size={16} fill="currentColor" style={{ color: '#FF7AA2', margin: '0 auto', filter: 'drop-shadow(0 0 6px rgba(255,122,162,0.6))' }} />
              </motion.div>

              <p className="text-[12.5px] italic leading-relaxed" style={{ color: 'rgba(255,230,242,0.88)' }}>
                &ldquo;{note}&rdquo;
              </p>

              <p className="text-[9px] mt-2.5 uppercase tracking-widest" style={{ color: 'rgba(255,179,199,0.35)' }}>
                hidden just for you ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

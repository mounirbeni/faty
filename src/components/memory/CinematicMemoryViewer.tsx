'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { playBloom, playReveal } from '@/lib/sounds';
import { useEmotionalEngine } from '@/lib/emotional/emotionalEngine';
import { heartbeat } from '@/lib/useHaptics';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  timestamp?: string;
  children: React.ReactNode;
}

export default function CinematicMemoryViewer({
  open,
  onClose,
  title,
  subtitle,
  timestamp,
  children,
}: Props) {
  const [stage, setStage] = useState(0);
  const recordInteraction = useEmotionalEngine((s) => s.recordInteraction);

  useEffect(() => {
    if (!open) {
      setStage(0);
      return;
    }
    recordInteraction('memory');
    playBloom();
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => { setStage(2); playReveal(); heartbeat(); }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(5,0,15,0.88)', backdropFilter: 'blur(20px)' }}
            onClick={onClose}
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(20px)' }}
          />

          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-rose-300/30"
              style={{ left: `${10 + (i * 7) % 80}%`, fontSize: 8 + (i % 4) * 4 }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '-20%', opacity: [0, 0.6, 0] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            >
              ✦
            </motion.span>
          ))}

          <motion.div
            className="relative w-full max-w-md glass-cinema rounded-3xl p-6 overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, filter: 'blur(12px)' }}
            animate={{
              scale: stage >= 1 ? 1 : 0.96,
              opacity: stage >= 1 ? 1 : 0.3,
              filter: stage >= 2 ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              aria-label="Close"
            >
              <X size={14} className="text-white/60" />
            </button>

            {timestamp && (
              <motion.p
                className="text-[10px] uppercase tracking-[0.2em] mb-3"
                style={{ color: 'rgba(255,179,199,0.45)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 10 }}
              >
                {timestamp}
              </motion.p>
            )}

            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 1 ? 1 : 0 }}
            >
              <Heart size={16} fill="currentColor" className="text-rose-400 animate-heartbeat" />
              <h2 className="text-xl font-extrabold text-white">{title}</h2>
            </motion.div>

            {subtitle && (
              <p className="text-[13px] text-white/50 mb-4">{subtitle}</p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 16 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

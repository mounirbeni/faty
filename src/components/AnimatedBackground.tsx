'use client';

import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  /** 0 = cool purple start, 1 = warm rose/amber end */
  warmth?: number;
}

export default function AnimatedBackground({ warmth = 0 }: AnimatedBackgroundProps) {
  // Interpolate blob opacity/color based on warmth
  const coolOpacity = Math.max(0, 1 - warmth * 1.2);
  const warmOpacity = Math.min(1, warmth * 1.4);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* ── Cool blobs (visible at start) ── */}
      <motion.div
        className="absolute rounded-full blur-[140px]"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-10%',
          background: `radial-gradient(circle, rgba(139,92,246,${0.18 * coolOpacity}), transparent 70%)`,
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: 500,
          height: 500,
          bottom: '5%',
          right: '-15%',
          background: `radial-gradient(circle, rgba(56,189,248,${0.14 * coolOpacity}), transparent 70%)`,
        }}
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* ── Warm blobs (visible as warmth increases) ── */}
      <motion.div
        className="absolute rounded-full blur-[130px]"
        style={{
          width: 700,
          height: 700,
          top: '20%',
          left: '30%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(circle, rgba(244,63,94,${0.22 * warmOpacity}), rgba(251,113,133,${0.08 * warmOpacity}), transparent 70%)`,
        }}
        animate={{ x: [0, 40, -60, 0], y: [0, -30, 40, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: 400,
          height: 400,
          bottom: '10%',
          left: '-5%',
          background: `radial-gradient(circle, rgba(251,146,60,${0.15 * warmOpacity}), transparent 70%)`,
        }}
        animate={{ x: [0, 50, -20, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />

      {/* ── Always-on subtle pink center glow ── */}
      <motion.div
        className="absolute rounded-full blur-[160px]"
        style={{
          width: 500,
          height: 500,
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(236,72,153,${0.07 + warmth * 0.08}), transparent 70%)`,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

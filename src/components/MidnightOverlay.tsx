'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  {
    title: 'Still awake, my love? 🌙',
    body: 'The night feels softer knowing you are in it.',
  },
  {
    title: 'Late night, just us…',
    body: 'I find myself thinking of you the most in these quiet hours.',
  },
  {
    title: 'The world is asleep.',
    body: 'But you are still here. And that means everything to me.',
  },
  {
    title: 'Past midnight.',
    body: 'Somewhere between awake and dreaming — and I am thinking of you.',
  },
  {
    title: 'These quiet hours',
    body: 'belong only to us. No noise. Just this universe, breathing.',
  },
];

function pr(seed: number): number {
  let s = seed;
  s = ((s >> 16) ^ s) * 0x45d9f3b;
  s = ((s >> 16) ^ s) * 0x45d9f3b;
  s = (s >> 16) ^ s;
  return Math.abs(s % 10000) / 10000;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function buildStars(): Star[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: pr(i * 7 + 1) * 100,
    y: pr(i * 7 + 2) * 100,
    size: pr(i * 7 + 3) * 2.5 + 0.8,
    delay: pr(i * 7 + 4) * 4,
    duration: pr(i * 7 + 5) * 3 + 2,
  }));
}

const STARS = buildStars();

export default function MidnightOverlay() {
  const [visible, setVisible] = useState(false);
  const [moroccoHour, setMoroccoHour] = useState<number | null>(null);
  const [moroccoTimeDisplay, setMoroccoTimeDisplay] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (sessionStorage.getItem('lu_midnight_overlay')) return;

    const hourStr = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Casablanca',
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(hourStr, 10);

    const isMidnight = hour >= 0 && hour <= 4;
    if (!isMidnight) return;

    const displayTime = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Africa/Casablanca',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setMoroccoHour(hour);
    setMoroccoTimeDisplay(displayTime);

    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem('lu_midnight_overlay', '1');
    }, 1800);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const autoTimer = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(autoTimer);
  }, [visible]);

  const message =
    moroccoHour !== null ? MESSAGES[moroccoHour % 5] : MESSAGES[0];

  return (
    <>
      <style>{`
        @keyframes midnight-breathe {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.32; transform: scale(1.12); }
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="midnight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            onClick={() => setVisible(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10,0,30,0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* Aurora glow */}
            <div
              style={{
                position: 'absolute',
                top: '-10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80vw',
                height: '50vh',
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(120,60,220,0.38) 0%, rgba(60,20,120,0.18) 55%, transparent 80%)',
                animation: 'midnight-breathe 5s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Secondary aurora accent */}
            <div
              style={{
                position: 'absolute',
                top: '-5%',
                left: '30%',
                width: '40vw',
                height: '35vh',
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(80,180,255,0.10) 0%, transparent 70%)',
                animation: 'midnight-breathe 7s ease-in-out infinite reverse',
                pointerEvents: 'none',
              }}
            />

            {/* Stars */}
            {STARS.map((star) => (
              <motion.div
                key={star.id}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: '50%',
                  background: 'rgba(220,200,255,0.9)',
                  boxShadow: `0 0 ${star.size * 2}px rgba(180,140,255,0.7)`,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(16px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
                maxWidth: '420px',
                width: '88vw',
                padding: '0 20px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Morocco time */}
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(180,140,255,0.55)',
                  marginBottom: '18px',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                }}
              >
                {moroccoTimeDisplay} · Morocco
              </div>

              {/* Top divider */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(160,100,255,0.4) 30%, rgba(200,160,255,0.6) 50%, rgba(160,100,255,0.4) 70%, transparent)',
                  marginBottom: '28px',
                }}
              />

              {/* Moon */}
              <motion.div
                animate={{
                  rotate: [-4, 4, -4],
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  fontSize: '52px',
                  lineHeight: 1,
                  marginBottom: '24px',
                  filter: 'drop-shadow(0 0 18px rgba(180,140,255,0.5))',
                  userSelect: 'none',
                }}
              >
                🌙
              </motion.div>

              {/* Title */}
              <h2
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'rgba(235,215,255,0.95)',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textShadow: '0 0 24px rgba(160,100,255,0.4)',
                }}
              >
                {message.title}
              </h2>

              {/* Body */}
              <p
                style={{
                  margin: '0 0 28px 0',
                  fontSize: '15px',
                  lineHeight: '1.75',
                  color: 'rgba(200,180,240,0.75)',
                  textAlign: 'center',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                {message.body}
              </p>

              {/* Bottom divider */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(160,100,255,0.4) 30%, rgba(200,160,255,0.6) 50%, rgba(160,100,255,0.4) 70%, transparent)',
                  marginBottom: '22px',
                }}
              />

              {/* Dismiss hint */}
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'rgba(160,120,220,0.35)',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  userSelect: 'none',
                }}
              >
                Tap anywhere to continue &nbsp;✦
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

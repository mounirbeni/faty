"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
}

interface HeartBurstProps {
  trigger: number; // increment to trigger a burst
}

/**
 * Burst of tiny hearts that spray out from center
 * when the user submits an answer.
 */
export default function HeartBurst({ trigger }: HeartBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const count = 8 + Math.floor(Math.random() * 5);
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: -(40 + Math.random() * 120),
      size: 10 + Math.random() * 14,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.15,
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-rose-400"
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, 1.2, 0.8],
              opacity: [1, 1, 0],
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8 + Math.random() * 0.3,
              delay: p.delay,
              ease: "easeOut",
            }}
          >
            <Heart size={p.size} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

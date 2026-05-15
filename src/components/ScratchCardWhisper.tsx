'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notifyOwner } from '@/lib/notify';

interface ScratchCardWhisperProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export default function ScratchCardWhisper({ children, onComplete }: ScratchCardWhisperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isScratched) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Draw metallic gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#10b981'); // emerald-500
      gradient.addColorStop(0.5, '#34d399'); // emerald-400
      gradient.addColorStop(1, '#059669'); // emerald-600

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const pos = getMousePos(e);
      lastX = pos.x;
      lastY = pos.y;
      
      // Draw a single dot where the user first clicked/touched
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
      checkScratched();
    };

    let lastVibrate = 0;

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const pos = getMousePos(e);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;

      // Throttle haptics
      const now = Date.now();
      if (now - lastVibrate > 50) {
        if ('vibrate' in navigator) navigator.vibrate([20]);
        lastVibrate = now;
      }
    };

    const checkScratched = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const totalPixels = pixels.length / 4;
      const clearPercentage = (transparentPixels / totalPixels) * 100;

      // Notify at 80% — only once
      if (clearPercentage > 80 && !notifiedRef.current) {
        notifiedRef.current = true;
        notifyOwner('✨ <b>Faty scratched her Daily Whisper!</b>\n\nShe just revealed today\'s secret message.');
      }

      if (clearPercentage > 60) {
        setIsScratched(true);
        if (onComplete) onComplete();
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
      
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      window.removeEventListener('touchend', stopDrawing);
    };
  }, [isScratched, onComplete]);

  return (
    <div ref={containerRef} className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
      {/* The content underneath */}
      <div className="w-full h-full p-8 bg-black/40 backdrop-blur-md flex items-center justify-center">
        {children}
      </div>

      {/* The scratchable canvas overlay */}
      <AnimatePresence>
        {!isScratched && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

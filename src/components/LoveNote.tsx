"use client";

import { useEffect, useState, useRef } from "react";
import { Heart } from "lucide-react";
import { loveNotes } from "@/data/meta";

interface LoveNoteProps {
  trigger: number; // increment to show a new note
}

/**
 * Shows a random sweet love note after the user
 * answers a question. Fades in and auto-dismisses.
 */
export default function LoveNote({ trigger }: LoveNoteProps) {
  const [note, setNote] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const usedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (trigger === 0) return;

    // Only show love note every 2-3 questions (not every single one)
    if (trigger % 2 !== 0 && trigger % 3 !== 0) return;

    // Pick a random unused note
    let idx: number;
    do {
      idx = Math.floor(Math.random() * loveNotes.length);
    } while (usedRef.current.has(idx) && usedRef.current.size < loveNotes.length);
    usedRef.current.add(idx);

    const showTimer = setTimeout(() => {
      setNote(loveNotes[idx]);
      setVisible(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3010);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [trigger]);

  if (!visible || !note) return null;

  return (
    <div className="fixed inset-x-0 top-6 z-[80] flex justify-center px-4 pointer-events-none">
      <div className="animate-love-note max-w-xs w-full px-5 py-3 rounded-2xl glass-warm text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-rose-300/90 font-medium leading-snug">
          <Heart size={13} className="text-rose-400 shrink-0" fill="currentColor" />
          <span className="italic">{note}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Lock, X, Heart } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({
  message,
  visible,
  onDismiss,
  durationMs = 4000,
}: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setExiting(false);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 300);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onDismiss]);

  if (!visible && !exiting) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto max-w-sm w-full px-5 py-4 rounded-2xl
          glass-warm shadow-2xl shadow-rose-500/20
          flex items-center gap-3
          ${exiting ? "animate-toast-out" : "animate-toast-in"}
        `}
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center animate-bounce-in">
          <Lock size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 text-start">
          <p className="text-[13px] font-medium text-white/90 leading-snug">
            {message}
          </p>
          <p className="text-[11px] text-rose-300/60 mt-1 flex items-center gap-1">
            <Heart size={10} fill="currentColor" />
            Saved with love
          </p>
        </div>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(onDismiss, 300);
          }}
          className="shrink-0 p-1.5 rounded-lg active:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} className="text-white/50" />
        </button>
      </div>
    </div>
  );
}

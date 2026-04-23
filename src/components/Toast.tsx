"use client";

import { useEffect, useState } from "react";
import { Lock, X } from "lucide-react";

interface ToastProps {
  message: string;
  icon?: "lock" | "reverse";
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({
  message,
  icon = "lock",
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
          glass-strong shadow-2xl shadow-rose-500/20
          flex items-center gap-3
          ${exiting ? "animate-toast-out" : "animate-toast-in"}
        `}
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
          <Lock size={18} className="text-white" />
        </div>
        <p className="flex-1 text-sm font-medium text-white/90 leading-snug">
          {message}
        </p>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(onDismiss, 300);
          }}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} className="text-white/50" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { levels } from "@/lib/questions";
import IconFromName from "./IconFromName";
import { useGameStore } from "@/store/gameStore";

export default function VibeMeter({ total, level }: { total: number; level: number }) {
  const current = useGameStore((state) => state.currentIndex);
  const progress = ((current + 1) / total) * 100;
  const meta = levels[level - 1];

  // Build gradient from level 1 → current level
  const gradientStops = levels
    .slice(0, level)
    .map((l, i) => `${l.accentHex} ${(i / Math.max(level - 1, 1)) * 100}%`)
    .join(", ");

  return (
    <div className="w-full mb-1">
      {/* Level badge + count */}
      <div className="flex items-center justify-between mb-2.5">
        <motion.div
          key={level}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider
              bg-gradient-to-r ${meta.colorFrom} ${meta.colorTo} text-white shadow-lg
            `}
          >
            <IconFromName name={meta.icon} size={12} />
            الفصل {level}
          </span>
          <span className="text-xs text-white/40 font-medium hidden sm:inline">
            {meta.title}
          </span>
        </motion.div>

        <span className="text-xs font-semibold text-white/40 tabular-nums" dir="ltr">
          {current + 1} / {total}
        </span>
      </div>

      {/* Meter bar */}
      <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 start-0 rounded-full origin-left"
          style={{
            background:
              level === 1
                ? meta.accentHex
                : `linear-gradient(to right, ${gradientStops})`,
            width: "100%",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>

        {/* Level markers */}
        {levels.map((l) => {
          const pos = (l.level / 5) * 100;
          if (l.level === 5) return null;
          return (
            <div
              key={l.level}
              className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-white/10"
              style={{ insetInlineStart: `${pos}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

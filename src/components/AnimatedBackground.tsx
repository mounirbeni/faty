'use client';

interface AnimatedBackgroundProps {
  /** 0 = cool purple start, 1 = warm rose/amber end */
  warmth?: number;
}

export default function AnimatedBackground({ warmth = 0 }: AnimatedBackgroundProps) {
  // Interpolate blob opacity/color based on warmth
  const coolOpacity = Math.max(0, 1 - warmth * 1.2);
  const warmOpacity = Math.min(1, warmth * 1.4);

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 animate-css-mesh will-change-[background-position] bg-[length:400%_400%]"
      style={{
        backgroundImage: `linear-gradient(120deg, 
          rgba(139,92,246,${0.18 * coolOpacity}), 
          rgba(56,189,248,${0.14 * coolOpacity}), 
          rgba(244,63,94,${0.22 * warmOpacity}), 
          rgba(251,146,60,${0.15 * warmOpacity})
        )`
      }}
      aria-hidden="true" 
    />
  );
}

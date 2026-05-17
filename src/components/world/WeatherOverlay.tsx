'use client';

import { useEmotionalEngine, weatherModifiers } from '@/lib/emotional/emotionalEngine';
import { useTimeContext } from '@/lib/timeSystem';

export default function WeatherOverlay() {
  const weather = useEmotionalEngine((s) => s.weather);
  const comfortActive = useEmotionalEngine((s) => s.comfortActive);
  const time = useTimeContext();
  const mod = weatherModifiers(weather, time.period);

  const showRain = mod.rain && !comfortActive;
  const showFog = (mod.fog || weather === 'longing') && !comfortActive;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden>
      {comfortActive && (
        <div
          className="absolute inset-0 transition-opacity duration-[3000ms]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(255,120,160,0.12) 0%, rgba(255,77,141,0.06) 40%, transparent 70%)',
          }}
        />
      )}

      {showRain && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: 48 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-px animate-rain-drop"
              style={{
                left: `${(i * 17) % 100}%`,
                height: `${12 + (i % 5) * 8}px`,
                background: 'linear-gradient(180deg, transparent, rgba(200,180,255,0.5), transparent)',
                animationDelay: `${(i % 12) * 0.15}s`,
                animationDuration: `${0.8 + (i % 4) * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}

      {showFog && (
        <div
          className="absolute inset-0 animate-fog-drift"
          style={{
            background:
              'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(80,40,120,0.25) 0%, rgba(30,10,50,0.15) 50%, transparent 75%)',
          }}
        />
      )}
    </div>
  );
}

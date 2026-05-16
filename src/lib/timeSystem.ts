export type TimePeriod = 'midnight' | 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeContext {
  period: TimePeriod;
  hour: number;
  /** Dominant aurora A color */
  auroraA: string;
  /** Dominant aurora B color */
  auroraB: string;
  /** Accent gold/warm */
  auroraC: string;
  /** 0 = darkest, 1 = brightest */
  brightness: number;
  /** Particle density multiplier */
  particleMult: number;
  /** Greeting shown in home header */
  greeting: string;
  /** Ambient label */
  label: string;
  /** Background extra overlay color */
  skyOverlay: string;
}

export function getTimeContext(): TimeContext {
  const h = new Date().getHours();

  if (h >= 0 && h < 5) {
    return {
      period: 'midnight', hour: h,
      auroraA: 'rgba(80,40,200,0.32)', auroraB: 'rgba(123,92,255,0.28)', auroraC: 'rgba(255,77,141,0.08)',
      brightness: 0.08, particleMult: 1.5,
      greeting: 'Still awake, my love? 🌙',
      label: 'Deep night ✨',
      skyOverlay: 'rgba(20,0,50,0.4)',
    };
  }
  if (h >= 5 && h < 8) {
    return {
      period: 'dawn', hour: h,
      auroraA: 'rgba(255,140,80,0.24)', auroraB: 'rgba(255,77,141,0.22)', auroraC: 'rgba(255,200,80,0.18)',
      brightness: 0.38, particleMult: 0.7,
      greeting: 'Good morning, my angel 🌅',
      label: 'Sunrise 🌅',
      skyOverlay: 'rgba(80,20,10,0.15)',
    };
  }
  if (h >= 8 && h < 12) {
    return {
      period: 'morning', hour: h,
      auroraA: 'rgba(255,184,77,0.2)', auroraB: 'rgba(255,100,80,0.16)', auroraC: 'rgba(255,77,141,0.14)',
      brightness: 0.55, particleMult: 0.65,
      greeting: 'Good morning, my love ☀️',
      label: 'Warm morning ☀️',
      skyOverlay: 'rgba(60,10,0,0.1)',
    };
  }
  if (h >= 12 && h < 17) {
    return {
      period: 'afternoon', hour: h,
      auroraA: 'rgba(255,77,141,0.2)', auroraB: 'rgba(255,130,60,0.16)', auroraC: 'rgba(123,92,255,0.14)',
      brightness: 0.48, particleMult: 0.7,
      greeting: 'Hope your afternoon is beautiful',
      label: 'Golden afternoon 🌤️',
      skyOverlay: 'rgba(40,5,0,0.08)',
    };
  }
  if (h >= 17 && h < 21) {
    return {
      period: 'evening', hour: h,
      auroraA: 'rgba(255,77,141,0.3)', auroraB: 'rgba(123,92,255,0.26)', auroraC: 'rgba(255,140,80,0.2)',
      brightness: 0.25, particleMult: 1.0,
      greeting: 'Good evening, my love 🌆',
      label: 'Dreamy evening 🌆',
      skyOverlay: 'rgba(60,10,30,0.2)',
    };
  }
  // 21–23: night
  return {
    period: 'night', hour: h,
    auroraA: 'rgba(123,92,255,0.28)', auroraB: 'rgba(255,77,141,0.24)', auroraC: 'rgba(60,30,160,0.2)',
    brightness: 0.12, particleMult: 1.25,
    greeting: 'Good night, my angel 🌙',
    label: 'Quiet night 🌙',
    skyOverlay: 'rgba(10,0,30,0.3)',
  };
}

/** React hook — updates every minute */
import { useState, useEffect } from 'react';
export function useTimeContext() {
  const [ctx, setCtx] = useState<TimeContext>(getTimeContext);
  useEffect(() => {
    const id = setInterval(() => setCtx(getTimeContext()), 60_000);
    return () => clearInterval(id);
  }, []);
  return ctx;
}

/**
 * Emotional Presence Context
 * ─────────────────────────
 * Fetches city/country via IP geolocation (city-level only, no coordinates),
 * detects device type, and computes dual-timezone time display.
 *
 * Fetched once per session. All geographic data is city + country level only.
 */

export interface PresenceContext {
  /** e.g. "Casablanca" */
  city: string;
  /** e.g. "Morocco" */
  country: string;
  /** e.g. "MA" */
  countryCode: string;
  /** e.g. "Casablanca, Morocco" */
  locationLabel: string;
  /** e.g. "11:42 PM" — her local time */
  localTime: string;
  /** e.g. "10:42 PM" — Morocco time */
  moroccoTime: string;
  /** 0-23, Morocco hour */
  moroccoHour: number;
  /** true when Morocco time is between 21:00 and 05:59 */
  isNight: boolean;
  /** true when Morocco time is between 23:00 and 03:59 */
  isLateNight: boolean;
  /** "iPhone" | "Android" | "iPad" | "Desktop" */
  device: 'iPhone' | 'Android' | 'iPad' | 'Desktop';
  /** device display string, e.g. "her iPhone" */
  deviceLabel: string;
  /** When she entered the universe */
  enteredAt: Date;
  /** Formatted entry time in Morocco timezone */
  enteredAtLabel: string;
}

const MOROCCO_TZ = 'Africa/Casablanca';

// ─── Utilities ───────────────────────────────────────────────────────────────

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getHourInTz(date: Date, tz: string): number {
  const s = date.toLocaleString('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false,
  });
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n % 24;
}

function detectDevice(): PresenceContext['device'] {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/iPad/.test(ua)) return 'iPad';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return 'Android';
  return 'Desktop';
}

function deviceLabel(d: PresenceContext['device']): string {
  switch (d) {
    case 'iPhone':  return 'her iPhone';
    case 'Android': return 'her phone';
    case 'iPad':    return 'her iPad';
    default:        return 'her screen';
  }
}

// ─── Geo fetch ───────────────────────────────────────────────────────────────

interface IpApiResponse {
  city?: string;
  country_name?: string;
  country_code?: string;
  timezone?: string;
  error?: boolean;
}

async function fetchGeo(): Promise<{ city: string; country: string; countryCode: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('geo fetch failed');
    const data: IpApiResponse = await res.json();
    if (data.error) throw new Error('geo error');
    return {
      city: data.city || 'Somewhere beautiful',
      country: data.country_name || '',
      countryCode: data.country_code || '',
    };
  } catch {
    // Graceful fallback — no surveillance, just warmth
    return { city: 'Somewhere beautiful', country: '', countryCode: '' };
  }
}

// ─── Module cache ─────────────────────────────────────────────────────────────

let _cached: PresenceContext | null = null;
let _promise: Promise<PresenceContext> | null = null;

export async function initPresenceContext(): Promise<PresenceContext> {
  if (_cached) return _cached;
  if (_promise) return _promise;

  _promise = (async () => {
    const now = new Date();
    const device = detectDevice();
    const moroccoHour = getHourInTz(now, MOROCCO_TZ);

    // Geo (city + country only)
    const geo = await fetchGeo();
    const locationLabel = geo.country
      ? `${geo.city}, ${geo.country}`
      : geo.city;

    const ctx: PresenceContext = {
      ...geo,
      locationLabel,
      localTime: formatTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone),
      moroccoTime: formatTime(now, MOROCCO_TZ),
      moroccoHour,
      isNight: moroccoHour >= 21 || moroccoHour < 6,
      isLateNight: moroccoHour >= 23 || moroccoHour < 4,
      device,
      deviceLabel: deviceLabel(device),
      enteredAt: now,
      enteredAtLabel: formatTime(now, MOROCCO_TZ),
    };

    _cached = ctx;
    return ctx;
  })();

  return _promise;
}

export function getCachedPresence(): PresenceContext | null {
  return _cached;
}

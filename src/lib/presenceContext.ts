/**
 * Emotional Presence Context
 * ─────────────────────────
 * Location: browser geolocation → Nominatim reverse-geocode (neighbourhood + city).
 * Falls back gracefully to ipapi.co (city-level) if permissions denied.
 * Device: type + browser + OS version + battery level.
 * Time: her local + Morocco dual display.
 */

export interface PresenceContext {
  // ── Location ──────────────────────────────────────────────────────────────
  /** e.g. "Maarif" */
  neighbourhood: string;
  /** e.g. "Casablanca" */
  city: string;
  /** e.g. "Morocco" */
  country: string;
  /** e.g. "MA" */
  countryCode: string;
  /** Full romantic label: "Maarif, Casablanca, Morocco" */
  locationLabel: string;
  /** Short label for inline use: "Casablanca, Morocco" */
  locationShort: string;
  /** true when precise geolocation was used (neighbourhood known) */
  isPrecise: boolean;

  // ── Time ──────────────────────────────────────────────────────────────────
  /** e.g. "11:42 PM" — her local time */
  localTime: string;
  /** e.g. "10:42 PM" — Morocco time */
  moroccoTime: string;
  /** 0-23, Morocco hour */
  moroccoHour: number;
  /** true when Morocco time is 21:00–05:59 */
  isNight: boolean;
  /** true when Morocco time is 23:00–03:59 */
  isLateNight: boolean;

  // ── Device ────────────────────────────────────────────────────────────────
  /** "iPhone" | "Android" | "iPad" | "Desktop" */
  device: 'iPhone' | 'Android' | 'iPad' | 'Desktop';
  /** Browser name: "Safari" | "Chrome" | "Firefox" | "Edge" | "Browser" */
  browser: string;
  /** OS / device version string e.g. "iOS 17" | "Android 14" */
  osVersion: string;
  /** Battery percentage 0-100, or null if API unavailable */
  battery: number | null;
  /** Rich device label: "iPhone 15 · Safari · iOS 17" */
  deviceLabel: string;
  /** Short: "her iPhone" */
  deviceShort: string;

  // ── Meta ──────────────────────────────────────────────────────────────────
  enteredAt: Date;
  enteredAtLabel: string;
}

const MOROCCO_TZ = 'Africa/Casablanca';

// ─── Time helpers ─────────────────────────────────────────────────────────────

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function getHourInTz(date: Date, tz: string): number {
  const s = date.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false });
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n % 24;
}

// ─── Device detection ─────────────────────────────────────────────────────────

function detectDevice() {
  if (typeof navigator === 'undefined') {
    return { device: 'Desktop' as const, browser: 'Browser', osVersion: '', battery: null };
  }
  const ua = navigator.userAgent;

  // Device type
  let device: PresenceContext['device'] = 'Desktop';
  if (/iPad/.test(ua)) device = 'iPad';
  else if (/iPhone/.test(ua)) device = 'iPhone';
  else if (/Android/.test(ua)) device = 'Android';

  // Browser
  let browser = 'Browser';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/CriOS/.test(ua)) browser = 'Chrome';
  else if (/FxiOS/.test(ua)) browser = 'Firefox';
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  // OS version
  let osVersion = '';
  const iosMatch = ua.match(/OS (\d+[_\d]*)/);
  const androidMatch = ua.match(/Android (\d+[\.\d]*)/);
  const winMatch = ua.match(/Windows NT (\d+\.\d+)/);
  const macMatch = ua.match(/Mac OS X (\d+[_\d]*)/);

  if (device === 'iPhone' || device === 'iPad') {
    osVersion = iosMatch ? `iOS ${iosMatch[1].replace(/_/g, '.')}` : 'iOS';
  } else if (device === 'Android') {
    osVersion = androidMatch ? `Android ${androidMatch[1]}` : 'Android';
  } else if (winMatch) {
    const winVer: Record<string, string> = { '10.0': '11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    osVersion = `Windows ${winVer[winMatch[1]] ?? winMatch[1]}`;
  } else if (macMatch) {
    osVersion = `macOS ${macMatch[1].replace(/_/g, '.')}`;
  }

  return { device, browser, osVersion, battery: null as number | null };
}

function buildDeviceLabel(
  device: PresenceContext['device'],
  browser: string,
  osVersion: string,
  battery: number | null,
): { deviceLabel: string; deviceShort: string } {
  const shortMap: Record<string, string> = {
    iPhone: 'her iPhone', Android: 'her phone', iPad: 'her iPad', Desktop: 'her screen',
  };

  const parts = [device === 'Desktop' ? 'Desktop' : device, browser, osVersion].filter(Boolean);
  let label = parts.join(' · ');
  if (battery !== null) {
    const icon = battery <= 15 ? '🔋' : battery <= 50 ? '🔋' : '🔋';
    label += `  ${icon} ${battery}%`;
  }

  return { deviceLabel: label, deviceShort: shortMap[device] };
}

// ─── Battery ──────────────────────────────────────────────────────────────────

async function getBattery(): Promise<number | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (!nav.getBattery) return null;
    const b = await nav.getBattery();
    return Math.round(b.level * 100);
  } catch { return null; }
}

// ─── Precise geolocation + Nominatim ─────────────────────────────────────────

interface NominatimAddress {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
}
interface NominatimResult { address?: NominatimAddress }

async function reverseGeocode(lat: number, lon: number): Promise<{
  neighbourhood: string; city: string; country: string; countryCode: string;
} | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=en`,
      { signal: controller.signal, headers: { 'User-Agent': 'FatyLoveUniverse/1.0' } },
    );
    clearTimeout(t);
    if (!res.ok) return null;
    const data: NominatimResult = await res.json();
    const a = data.address ?? {};
    const neighbourhood = a.neighbourhood ?? a.suburb ?? a.quarter ?? '';
    const city = a.city ?? a.town ?? a.village ?? a.county ?? '';
    const country = a.country ?? '';
    const countryCode = (a.country_code ?? '').toUpperCase();
    return { neighbourhood, city, country, countryCode };
  } catch { return null; }
}

async function getBrowserCoords(): Promise<{ lat: number; lon: number } | null> {
  if (!navigator.geolocation) return null;
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => resolve(null),
      { timeout: 6000, maximumAge: 300_000, enableHighAccuracy: false },
    );
  });
}

// ─── IP-level fallback ────────────────────────────────────────────────────────

interface IpApiResponse {
  city?: string; country_name?: string; country_code?: string; timezone?: string; error?: boolean;
}

async function fetchGeoByIp(): Promise<{ city: string; country: string; countryCode: string }> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error();
    const data: IpApiResponse = await res.json();
    if (data.error) throw new Error();
    return { city: data.city ?? '', country: data.country_name ?? '', countryCode: data.country_code ?? '' };
  } catch {
    return { city: '', country: '', countryCode: '' };
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
    const moroccoHour = getHourInTz(now, MOROCCO_TZ);

    // Device detection (sync)
    const { device, browser, osVersion } = detectDevice();

    // Battery (async, non-blocking race)
    const batteryVal = await Promise.race([
      getBattery(),
      new Promise<null>(r => setTimeout(() => r(null), 2000)),
    ]);

    const { deviceLabel, deviceShort } = buildDeviceLabel(device, browser, osVersion, batteryVal);

    // ── Location: try precise geolocation first ──────────────────────────────
    let neighbourhood = '';
    let city = '';
    let country = '';
    let countryCode = '';
    let isPrecise = false;

    const coords = await getBrowserCoords();
    if (coords) {
      const precise = await reverseGeocode(coords.lat, coords.lon);
      if (precise) {
        neighbourhood = precise.neighbourhood;
        city = precise.city;
        country = precise.country;
        countryCode = precise.countryCode;
        isPrecise = true;
      }
    }

    // Fallback to IP-level if no geolocation
    if (!city) {
      const ip = await fetchGeoByIp();
      city = ip.city || 'Somewhere beautiful';
      country = ip.country;
      countryCode = ip.countryCode;
    }

    // Build labels
    const parts = [neighbourhood, city, country].filter(Boolean);
    const locationLabel = parts.join(', ') || 'Somewhere beautiful';
    const locationShort = [city, country].filter(Boolean).join(', ') || locationLabel;

    const ctx: PresenceContext = {
      neighbourhood,
      city,
      country,
      countryCode,
      locationLabel,
      locationShort,
      isPrecise,
      localTime: formatTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone),
      moroccoTime: formatTime(now, MOROCCO_TZ),
      moroccoHour,
      isNight: moroccoHour >= 21 || moroccoHour < 6,
      isLateNight: moroccoHour >= 23 || moroccoHour < 4,
      device,
      browser,
      osVersion,
      battery: batteryVal,
      deviceLabel,
      deviceShort,
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

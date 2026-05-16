/**
 * Love Universe Sound System
 * All sounds generated via Web Audio API — zero audio files required.
 * Sounds are intentionally soft and emotionally warm, never jarring.
 */

let _ctx: AudioContext | null = null;
let _enabled = true;

function ctx(): AudioContext | null {
  if (!_enabled) return null;
  if (typeof window === 'undefined') return null;
  try {
    if (!_ctx || _ctx.state === 'closed') _ctx = new AudioContext();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  } catch { return null; }
}

function masterGain(ac: AudioContext, volume = 0.07): GainNode {
  const g = ac.createGain();
  g.gain.value = volume;
  g.connect(ac.destination);
  return g;
}

function fadeOut(gain: GainNode, at: number, by: number) {
  gain.gain.setValueAtTime(gain.gain.value, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, by);
}

// ─── Original sounds ──────────────────────────────────────────────────────────

/** Tiny sparkle chime — mini-game taps */
export function playSparkle() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    const g = masterGain(ac, 0.055);
    const freq = 900 + Math.random() * 500;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + 0.35);
    osc.connect(g);
    fadeOut(g, now + 0.05, now + 0.38);
    osc.start(now); osc.stop(now + 0.4);
  } catch { /* silent */ }
}

/** Soft double heartbeat — heart icon interactions */
export function playHeartbeat() {
  const ac = ctx(); if (!ac) return;
  try {
    const beat = (t: number) => {
      const g = masterGain(ac, 0.1);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.16);
      osc.connect(g);
      fadeOut(g, t, t + 0.18);
      osc.start(t); osc.stop(t + 0.2);
    };
    const now = ac.currentTime;
    beat(now); beat(now + 0.25);
  } catch { /* silent */ }
}

/** Emotional bloom — chapter open / game unlock */
export function playBloom() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [220, 330, 440, 550, 660].forEach((freq, i) => {
      const g = masterGain(ac, 0.038);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.075;
      fadeOut(g, t + 0.1, t + 0.85);
      osc.start(t); osc.stop(t + 0.9);
    });
  } catch { /* silent */ }
}

/** Soft tap — generic button press */
export function playTap() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    const g = masterGain(ac, 0.045);
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.1);
    osc.connect(g);
    fadeOut(g, now, now + 0.12);
    osc.start(now); osc.stop(now + 0.14);
  } catch { /* silent */ }
}

/** Rising reveal — scratch card / memory / unlock */
export function playReveal() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [370, 466, 554, 659, 830].forEach((freq, i) => {
      const g = masterGain(ac, 0.035);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.065;
      fadeOut(g, t, t + 0.7);
      osc.start(t); osc.stop(t + 0.75);
    });
  } catch { /* silent */ }
}

/** Hidden note found — long press discovery */
export function playDiscovery() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [523, 659, 784, 1046].forEach((freq, i) => {
      const g = masterGain(ac, 0.04);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.08;
      fadeOut(g, t, t + 0.6);
      osc.start(t); osc.stop(t + 0.65);
    });
  } catch { /* silent */ }
}

/** Warm welcome — app open / cinematic loader */
export function playWelcome() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [196, 247, 294, 370, 440].forEach((freq, i) => {
      const g = masterGain(ac, 0.032);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.1;
      fadeOut(g, t + 0.2, t + 1.2);
      osc.start(t); osc.stop(t + 1.3);
    });
  } catch { /* silent */ }
}

// ─── New sounds ───────────────────────────────────────────────────────────────

/**
 * Soft kiss — kiss jar taps & heart catches.
 * Warm low thump + brief high lip-squeak.
 */
export function playKiss() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    // Low thump
    const tg = masterGain(ac, 0.09);
    const tosc = ac.createOscillator();
    tosc.type = 'sine';
    tosc.frequency.setValueAtTime(130, now);
    tosc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
    tosc.connect(tg);
    fadeOut(tg, now, now + 0.2);
    tosc.start(now); tosc.stop(now + 0.22);
    // Brief high squeak (lip)
    const sg = masterGain(ac, 0.035);
    const sosc = ac.createOscillator();
    sosc.type = 'sine';
    sosc.frequency.setValueAtTime(1100, now + 0.04);
    sosc.frequency.exponentialRampToValueAtTime(500, now + 0.16);
    sosc.connect(sg);
    fadeOut(sg, now + 0.04, now + 0.18);
    sosc.start(now + 0.04); sosc.stop(now + 0.2);
  } catch { /* silent */ }
}

/**
 * Bell chime — milestone achievements, mood picks, game completion steps.
 * C-E-G-C chord, bell-like with inharmonic partial.
 */
export function playChime() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const g = masterGain(ac, 0.048);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      // Bell inharmonic partial
      const g2 = masterGain(ac, 0.016);
      const osc2 = ac.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2.76;
      osc2.connect(g2);
      const t = now + i * 0.1;
      fadeOut(g,  t + 0.04, t + 1.3);
      fadeOut(g2, t,        t + 0.45);
      osc.start(t);  osc.stop(t + 1.4);
      osc2.start(t); osc2.stop(t + 0.5);
    });
  } catch { /* silent */ }
}

/**
 * Quick pop — card flips, picks, UI snaps.
 * Short punchy sine sweep down.
 */
export function playPop() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    const g = masterGain(ac, 0.075);
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
    osc.connect(g);
    fadeOut(g, now, now + 0.09);
    osc.start(now); osc.stop(now + 0.1);
  } catch { /* silent */ }
}

/**
 * Smooth whoosh — screen transitions, navigation sweeps.
 * Bandpass-filtered noise sweeping high → low.
 */
export function playWhoosh() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    const dur = 0.45;
    const bufSize = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

    const src = ac.createBufferSource();
    src.buffer = buf;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + dur);
    filter.Q.value = 1.8;

    const g = masterGain(ac, 0.055);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.055, now + 0.06);
    g.gain.setValueAtTime(0.055, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(filter); filter.connect(g);
    src.start(now); src.stop(now + dur + 0.05);
  } catch { /* silent */ }
}

/**
 * Warm success chord — game/session completion.
 * Bright C major spread with slow bloom.
 */
export function playSuccess() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [262, 330, 392, 523, 659].forEach((freq, i) => {
      const g = masterGain(ac, 0.042);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.07;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.042, t + 0.12);
      g.gain.setValueAtTime(0.042, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      osc.start(t); osc.stop(t + 1.7);
    });
  } catch { /* silent */ }
}

/**
 * Intimate glow — entering emotional/intimacy mode.
 * Cluster of detuned warm sines with slow breath envelope.
 */
export function playGlow() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [-5, -2, 0, 2, 5].forEach((detune) => {
      const g = masterGain(ac, 0.0001);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 220 + detune;
      osc.connect(g);
      g.gain.exponentialRampToValueAtTime(0.022, now + 1.0);
      g.gain.setValueAtTime(0.022, now + 1.8);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      osc.start(now); osc.stop(now + 3.3);
    });
  } catch { /* silent */ }
}

/**
 * Magical twinkle — particle catch effects, star interactions.
 * Multiple random high-frequency pings staggered.
 */
export function playTwinkle() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    for (let i = 0; i < 5; i++) {
      const t = now + Math.random() * 0.28;
      const freq = 1100 + Math.random() * 900;
      const g = masterGain(ac, 0.032 + Math.random() * 0.018);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.22);
      osc.connect(g);
      fadeOut(g, t + 0.03, t + 0.28);
      osc.start(t); osc.stop(t + 0.3);
    }
  } catch { /* silent */ }
}

/**
 * Night swell — deep emotional chord for late-night moments.
 * Low A minor cluster, very slow attack.
 */
export function playNightSwell() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [110, 138.6, 165, 220, 277.2].forEach((freq, i) => {
      const g = ac.createGain();
      g.gain.value = 0.0001;
      g.connect(ac.destination);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.18;
      g.gain.exponentialRampToValueAtTime(0.026, t + 0.6);
      g.gain.setValueAtTime(0.026, t + 0.9);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      osc.start(now); osc.stop(t + 3.0);
    });
  } catch { /* silent */ }
}

/**
 * Soft UI click — glass button / navigation item press.
 * Cleaner, crisper than playTap.
 */
export function playClick() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    const g = masterGain(ac, 0.055);
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.06);
    osc.connect(g);
    fadeOut(g, now, now + 0.08);
    osc.start(now); osc.stop(now + 0.09);
  } catch { /* silent */ }
}

/**
 * Answer submit — sending a heartfelt answer.
 * Soft rising three-note confirmation.
 */
export function playSubmit() {
  const ac = ctx(); if (!ac) return;
  try {
    const now = ac.currentTime;
    [392, 494, 587].forEach((freq, i) => {
      const g = masterGain(ac, 0.04);
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      const t = now + i * 0.09;
      fadeOut(g, t + 0.08, t + 0.55);
      osc.start(t); osc.stop(t + 0.6);
    });
  } catch { /* silent */ }
}

export function setEnabled(v: boolean) { _enabled = v; }
export function isEnabled() { return _enabled; }

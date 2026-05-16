/**
 * Love Universe Sound System
 * All sounds generated via Web Audio API — zero audio files required.
 * Sounds are intentionally extremely soft and non-intrusive.
 */

let _ctx: AudioContext | null = null;
let _enabled = true;

function ctx(): AudioContext | null {
  if (!_enabled) return null;
  if (typeof window === 'undefined') return null;
  try {
    if (!_ctx || _ctx.state === 'closed') {
      _ctx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
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

/** Tiny sparkle chime — button hover / tap */
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
    beat(now);
    beat(now + 0.25);
  } catch { /* silent */ }
}

/** Emotional bloom — chapter open / screen reveal */
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

/** Warm welcome — app open */
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

export function setEnabled(v: boolean) { _enabled = v; }
export function isEnabled() { return _enabled; }

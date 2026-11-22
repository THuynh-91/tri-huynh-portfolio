import { useEffect, useRef } from 'react';

// Small seeded PRNG so server and client draw the same "random" lines (no hydration mismatch).
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- sound: off by default, one shared switch -------------------------------------------
let soundOn = false;
const listeners = new Set();
let ctx = null;

export function getSound() { return soundOn; }
export function setSound(on) {
  soundOn = on;
  try { localStorage.setItem('ink-sfx', on ? '1' : '0'); } catch { /* storage blocked */ }
  listeners.forEach((fn) => fn(on));
  if (on) thump(0.6);
}
export function onSound(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function loadSound() {
  try { soundOn = localStorage.getItem('ink-sfx') === '1'; } catch { soundOn = false; }
  listeners.forEach((fn) => fn(soundOn));
}

// An impact "thud": a falling sine under a short noise crack.
export function thump(gain = 1) {
  if (!soundOn || typeof window === 'undefined') return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.22);
    g.gain.setValueAtTime(0.5 * gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.32);
    const n = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
    const s = ctx.createBufferSource();
    const sg = ctx.createGain();
    sg.gain.value = 0.25 * gain;
    s.buffer = n;
    s.connect(sg).connect(ctx.destination);
    s.start(t);
  } catch { /* audio unavailable */ }
}

// ---- impact frames ---------------------------------------------------------------------
// When the element first comes well into view it gets `is-hit`: CSS plays a two-frame
// inverted "impact frame", a short shake and the SFX landing (from the Blender toolkit's
// vocabulary: impact frame, hitstop, shake). Once only.
export function useImpact(threshold = 0.55) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('is-hit'); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('is-hit');
          thump(0.8);
          io.disconnect();
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

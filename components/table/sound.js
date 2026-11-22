// Table sounds, synthesized (no audio files) and off until the visitor turns them on.
let ctx = null;
let enabled = false;

export const soundOn = () => enabled;
export function setSound(on) {
  enabled = on;
  if (on && !ctx && typeof window !== 'undefined') {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// a card sliding across felt: a short burst of filtered noise
export function cardSound() {
  if (!enabled || !ctx) return;
  const len = 0.09;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.7;
  const g = ctx.createGain(); g.gain.value = 0.35;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start();
}

// chips clicking together: two quick bright pings
export function chipSound() {
  if (!enabled || !ctx) return;
  [0, 0.045].forEach((t, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = i ? 3150 : 2650;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.09);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + t);
    o.stop(ctx.currentTime + t + 0.1);
  });
}

/**
 * A tiny generative "listening room" track — no audio assets, just Web Audio. A slow chord pad
 * plus a gentle arpeggio through a lowpass + delay. Used by the HeadTap record player.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let step = 0;
let playing = false;

// A few lo-fi progressions (semitone offsets from A2) — each record plays a different one.
const progressions = [
  [[-12, -5, 0, 4], [-3, 0, 4, 7], [-5, -1, 2, 7], [-7, -3, 0, 5]], // mellow
  [[-12, -8, -5, -1], [-10, -3, 0, 2], [-5, 0, 3, 7], [-7, -2, 2, 5]], // moody
  [[0, 4, 7, 11], [-2, 2, 5, 9], [-4, 0, 3, 7], [2, 5, 9, 12]], // bright
];
let trackIndex = 0;
const BASE = 110; // A2
const freq = (semi: number) => BASE * 2 ** (semi / 12);

function ensureContext() {
  if (ctx) return;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.0;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1600;
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.38;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  master.connect(lowpass);
  lowpass.connect(ctx.destination);
  lowpass.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);
}

function voice(frequency: number, start: number, duration: number, peak: number, type: OscillatorType) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.detune.value = (Math.random() - 0.5) * 8;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function tick() {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const progression = progressions[trackIndex % progressions.length];
  const chord = progression[step % progression.length];
  // Pad: full chord, soft and long.
  chord.forEach((semi) => voice(freq(semi), now, 2.6, 0.12, "triangle"));
  // Arpeggio: one note per beat over the bar.
  chord.forEach((semi, index) => voice(freq(semi + 12), now + index * 0.6, 0.5, 0.11, "sine"));
  step += 1;
}

export function toggleMusic(): boolean {
  ensureContext();
  if (!ctx || !master) return false;
  if (ctx.state === "suspended") void ctx.resume();
  if (playing) {
    stopMusic();
    return false;
  }
  // Each fresh start advances to the next "record".
  trackIndex = (trackIndex + 1) % progressions.length;
  step = 0;
  playing = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2);
  tick();
  timer = window.setInterval(tick, 2400);
  return true;
}

export function stopMusic() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (ctx && master && playing) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  }
  playing = false;
}

export function isPlaying() {
  return playing;
}

// ── Tactile SFX ─────────────────────────────────────────────────────────────
// Short synthesized cues (footsteps, interaction, portal whoosh, focus tick) on
// their own gain so they play whether or not the music pad is running. Gated by
// setSfxEnabled so the experience stays silent until the visitor opts in.
let sfxGain: GainNode | null = null;
let sfxEnabled = false;

function ensureSfx() {
  ensureContext();
  if (ctx && !sfxGain) {
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.5;
    sfxGain.connect(ctx.destination);
  }
}

export function setSfxEnabled(on: boolean) {
  sfxEnabled = on;
  if (on) {
    ensureSfx();
    if (ctx?.state === "suspended") void ctx.resume();
  }
}

function sfxVoice(frequency: number, duration: number, peak: number, type: OscillatorType, options?: {
  delay?: number;
  endFrequency?: number;
}) {
  if (!ctx || !sfxGain) return;
  const start = ctx.currentTime + (options?.delay ?? 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  if (options?.endFrequency) osc.frequency.exponentialRampToValueAtTime(options.endFrequency, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + duration * 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

export function sfxFootstep() {
  if (!sfxEnabled) return;
  ensureSfx();
  sfxVoice(70 + Math.random() * 16, 0.11, 0.12, "triangle", { endFrequency: 42 });
}

export function sfxInteract() {
  if (!sfxEnabled) return;
  ensureSfx();
  sfxVoice(420, 0.12, 0.16, "sine", { endFrequency: 640 });
  sfxVoice(660, 0.14, 0.07, "triangle", { delay: 0.04 });
}

export function sfxPortal() {
  if (!sfxEnabled) return;
  ensureSfx();
  sfxVoice(180, 0.55, 0.13, "sine", { endFrequency: 520 });
  sfxVoice(90, 0.5, 0.09, "triangle", { endFrequency: 240, delay: 0.02 });
}

export function sfxFocus() {
  if (!sfxEnabled) return;
  ensureSfx();
  sfxVoice(880, 0.05, 0.05, "sine", { endFrequency: 1180 });
}

export function sfxBoing() {
  if (!sfxEnabled) return;
  ensureSfx();
  // A springy trampoline "boing" — pitch leaps up then settles.
  sfxVoice(180, 0.28, 0.2, "sine", { endFrequency: 720 });
}

export function sfxBark() {
  if (!sfxEnabled) return;
  ensureSfx();
  // Two short, bright yips — a small dog's "arf arf".
  sfxVoice(520, 0.09, 0.16, "square", { endFrequency: 360 });
  sfxVoice(600, 0.08, 0.13, "square", { endFrequency: 420, delay: 0.13 });
}

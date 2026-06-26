let audioContext: AudioContext | null = null;

function context() {
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextCtor();
  }
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

export function littleMachineSound(kind: "wake" | "part" | "bump" | "inspect") {
  const ctx = context();
  const now = ctx.currentTime;
  const notes = kind === "part"
    ? [440, 660, 880]
    : kind === "inspect"
      ? [520, 620]
      : kind === "wake"
        ? [180, 260, 390]
        : [120, 82];
  notes.forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = kind === "bump" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.065);
    gain.gain.setValueAtTime(0.0001, now + index * 0.065);
    gain.gain.exponentialRampToValueAtTime(kind === "bump" ? 0.035 : 0.07, now + index * 0.065 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.065 + 0.16);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now + index * 0.065);
    oscillator.stop(now + index * 0.065 + 0.18);
  });
}


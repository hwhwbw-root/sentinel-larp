export type SoundKind = "normal" | "notice" | "warning" | "danger" | "clear";

let ctx: AudioContext | null = null;
let lastSoundAt = 0;

/** Timestamp of the most recent sound, so automatic alert sounds can avoid doubling up on a manual one. */
export function getLastSoundAt() {
  return lastSoundAt;
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  peak: number,
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function siren(c: AudioContext, start: number, duration: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(620, start);
  for (let t = 0, high = true; t < duration; t += 0.4, high = !high) {
    osc.frequency.linearRampToValueAtTime(high ? 980 : 620, start + t + 0.4);
  }
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.16, start + 0.05);
  gain.gain.setValueAtTime(0.16, start + duration - 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Plays a short synthesized cue. Must be first called from a user gesture (browser autoplay policy). */
export function playSound(kind: SoundKind) {
  const c = getContext();
  if (!c) return;
  const t = c.currentTime + 0.02;
  lastSoundAt = Date.now();

  switch (kind) {
    case "normal":
      tone(c, 660, t, 0.12, "sine", 0.12);
      break;
    case "notice":
      tone(c, 520, t, 0.09, "triangle", 0.12);
      tone(c, 620, t + 0.14, 0.09, "triangle", 0.12);
      break;
    case "warning":
      tone(c, 740, t, 0.16, "triangle", 0.2);
      tone(c, 740, t + 0.26, 0.16, "triangle", 0.2);
      break;
    case "danger":
      siren(c, t, 1.6);
      break;
    case "clear":
      tone(c, 523.25, t, 0.18, "sine", 0.14);
      tone(c, 783.99, t + 0.16, 0.26, "sine", 0.14);
      break;
  }
}

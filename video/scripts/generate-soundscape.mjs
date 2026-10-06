/* eslint-disable no-undef */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../public/audio");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function writeWavFile(filePath, sampleRate, numChannels, samples) {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples as 16-bit signed integers
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? Math.floor(s * 0x8000) : Math.floor(s * 0x7fff);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filePath} (${(dataSize / 1024 / 1024).toFixed(2)} MB)`);
}

const SAMPLE_RATE = 44100;

// 1. Generate 92-second cinematic ambient drone & rhythmic pulse
function generateSoundscape() {
  const duration = 92; // seconds
  const totalSamples = duration * SAMPLE_RATE;
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Base sub-bass (A1 = 55Hz, E2 = 82.4Hz)
    const sub = 0.25 * Math.sin(2 * Math.PI * 55 * t);
    const sub5th = 0.15 * Math.sin(2 * Math.PI * 82.4 * t);
    const subOct = 0.12 * Math.sin(2 * Math.PI * 110 * t);

    // Warm detuned chorus
    const warm1 = 0.08 * Math.sin(2 * Math.PI * 110.4 * t);
    const warm2 = 0.08 * Math.sin(2 * Math.PI * 220.8 * t + Math.sin(2 * Math.PI * 0.2 * t));

    // High shimmer harmonic
    const shimmer = 0.04 * Math.sin(2 * Math.PI * 440 * t) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.1 * t));

    // Rhythmic pulse (heartbeat / clockwork precision every 0.5s = 120bpm)
    const pulsePhase = (t % 0.5) / 0.5;
    const pulseEnv = Math.exp(-pulsePhase * 8);
    const pulseClick = 0.06 * Math.sin(2 * Math.PI * 120 * pulsePhase) * pulseEnv;

    // Intensity envelope:
    // Act 1 (0-9s): Subtle, quiet, tense (vol ~0.6)
    // Act 2 (9-19s): Surge, tension rising to warning (vol ~0.95)
    // Act 3 (19-29s): Big drop into product reveal (punchy bass hit at 19s)
    // Act 4-8 (29-80s): Driving tech pulse, high confidence (vol ~0.85)
    // Act 9 (80-90s): Epic resolution & fade out
    let masterEnv = 0.7;
    if (t < 2) masterEnv = t / 2 * 0.7;
    if (t >= 9 && t < 19) masterEnv = 0.7 + (t - 9) / 10 * 0.35;
    if (t >= 19 && t < 22) {
      // reveal punch
      const punchT = t - 19;
      masterEnv = 1.0 + Math.exp(-punchT * 2) * 0.4;
    }
    if (t > 87) masterEnv = Math.max(0, (92 - t) / 5);

    // Hazard alarm pulse during danger section (t: 12 to 18)
    let alarmBurst = 0;
    if (t >= 12 && t <= 18) {
      const alarmCycle = (t - 12) % 0.8;
      if (alarmCycle < 0.35) {
        alarmBurst = 0.18 * Math.sin(2 * Math.PI * 880 * alarmCycle) * (1 - alarmCycle / 0.35);
      }
    }

    samples[i] = (sub + sub5th + subOct + warm1 + warm2 + shimmer + pulseClick + alarmBurst) * masterEnv;
  }

  writeWavFile(path.join(outputDir, "soundscape.wav"), SAMPLE_RATE, 1, samples);
}

// 2. Whoosh transition (1.0 sec)
function generateWhoosh() {
  const duration = 1.0;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    // Bell envelope
    const env = Math.sin(progress * Math.PI) ** 2;
    // Frequency sweeps down
    const freq = 600 * (1 - progress * 0.7);
    const noise = (Math.random() * 2 - 1) * 0.4;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.6;
    samples[i] = (tone + noise) * env * 0.5;
  }

  writeWavFile(path.join(outputDir, "whoosh.wav"), SAMPLE_RATE, 1, samples);
}

// 3. Digital UI Blip / Data tick (0.08 sec)
function generateBlip() {
  const duration = 0.08;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 60);
    samples[i] = Math.sin(2 * Math.PI * 1800 * t) * env * 0.3;
  }

  writeWavFile(path.join(outputDir, "blip.wav"), SAMPLE_RATE, 1, samples);
}

// 4. Alarm beep (0.6 sec double beep)
function generateAlarm() {
  const duration = 0.6;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let b = 0;
    if (t < 0.2) {
      b = Math.sin(2 * Math.PI * 980 * t) * (1 - t / 0.2);
    } else if (t >= 0.25 && t < 0.45) {
      const dt = t - 0.25;
      b = Math.sin(2 * Math.PI * 1320 * dt) * (1 - dt / 0.2);
    }
    samples[i] = b * 0.4;
  }

  writeWavFile(path.join(outputDir, "alarm.wav"), SAMPLE_RATE, 1, samples);
}

generateSoundscape();
generateWhoosh();
generateBlip();
generateAlarm();
console.log("All sound assets generated successfully!");

// The staff's sound. It plays recorded voice samples when a sample set is
// published at /audio/voice/ (manifest.json plus one file per chromatic note)
// and falls back to a small Web Audio synth when it is not, or when a sample
// is slow to arrive. Nothing is fetched until the visitor first touches the
// staff, and nothing sounds until they click or tap.
import { hz, sampleName } from './pitch';

type Manifest = { version: string; notes: Record<string, { file: string; gain?: number }> };
type Voice = { midi: number; when: number; detune: number; pan: number; gain: number };

const BASE = '/audio/voice/';
const DUR = 1.5; // a half note at 80 beats per minute
const RELEASE = 0.45;
const WAIT_MS = 600; // how long a click waits for a sample before using the synth

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let manifest: Promise<Manifest | null> | null = null;
const raw = new Map<number, Promise<ArrayBuffer | null>>();
const decoded = new Map<number, Promise<AudioBuffer | null>>();

// Call on the first pointer contact with the staff: fetches the manifest only.
export function prime() {
  manifest ??= fetch(`${BASE}manifest.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
    .catch(() => null);
  return manifest;
}

// Start downloading the samples for these notes, if there is a sample set.
export function prefetch(midis: number[]) {
  prime().then((m) => {
    if (!m) return;
    for (const midi of midis) {
      const entry = m.notes[sampleName(midi)];
      if (!entry || raw.has(midi)) continue;
      raw.set(
        midi,
        fetch(`${BASE}${entry.file}?v=${m.version}`)
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .catch(() => null),
      );
    }
  });
}

// Must run inside the click or tap handler so the browser allows audio.
function unlock() {
  if (!ctx) {
    ctx = new AudioContext();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function buffer(ac: AudioContext, midi: number) {
  let p = decoded.get(midi);
  if (!p) {
    const r = raw.get(midi);
    if (!r) return Promise.resolve(null);
    p = r.then((ab) => (ab ? ac.decodeAudioData(ab.slice(0)).catch(() => null) : null));
    decoded.set(midi, p);
  }
  return p;
}

const timeout = <T,>(ms: number, v: T) => new Promise<T>((res) => setTimeout(() => res(v), ms));

function envelope(ac: AudioContext, start: number, peak: number, attack: number) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + attack);
  g.gain.setValueAtTime(peak, start + DUR - 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, start + DUR + RELEASE);
  return g;
}

function route(ac: AudioContext, node: AudioNode, pan: number) {
  if (pan && typeof ac.createStereoPanner === 'function') {
    const p = ac.createStereoPanner();
    p.pan.value = pan;
    node.connect(p);
    p.connect(master!);
  } else node.connect(master!);
}

function playSample(ac: AudioContext, buf: AudioBuffer, v: Voice, gain: number) {
  const start = ac.currentTime + 0.01 + v.when;
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.detune.value = v.detune;
  const env = envelope(ac, start, v.gain * gain, 0.02);
  src.connect(env);
  route(ac, env, v.pan);
  src.start(start);
  src.stop(start + DUR + RELEASE + 0.05);
}

// The synth from the first version of the staff: a triangle plus a quiet
// octave, low-passed, with gentle delayed vibrato.
function playSynth(ac: AudioContext, v: Voice) {
  const start = ac.currentTime + 0.01 + v.when;
  const f = hz(v.midi) * Math.pow(2, v.detune / 1200);
  const out = envelope(ac, start, 0.14 * v.gain, 0.09);
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = Math.min(2400, f * 5);
  lp.Q.value = 0.4;
  lp.connect(out);
  route(ac, out, v.pan);
  const vib = ac.createOscillator();
  const vibAmt = ac.createGain();
  vib.frequency.value = 5;
  vibAmt.gain.setValueAtTime(0, start);
  vibAmt.gain.linearRampToValueAtTime(f * 0.003, start + 0.6);
  vib.connect(vibAmt);
  const partials: [number, OscillatorType, number][] = [
    [1, 'triangle', 1],
    [2, 'sine', 0.18],
  ];
  for (const [mult, type, level] of partials) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = f * mult;
    vibAmt.connect(o.frequency);
    g.gain.value = level;
    o.connect(g);
    g.connect(lp);
    o.start(start);
    o.stop(start + DUR + RELEASE + 0.05);
  }
  vib.start(start);
  vib.stop(start + DUR + RELEASE + 0.05);
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Several voices make a chord: a few ms apart, a few cents apart, and spread
// slightly across the stereo field, low to the left and high to the right.
function humanize(midis: number[]): Voice[] {
  const sorted = [...midis].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 1) return [{ midi: sorted[0], when: 0, detune: 0, pan: 0, gain: 1 }];
  const level = 1 / Math.sqrt(n);
  return sorted.map((midi, i) => ({
    midi,
    when: i === 0 ? 0 : rand(0.004, 0.022),
    detune: rand(-5, 5),
    pan: (i / (n - 1) - 0.5) * 0.5 + rand(-0.05, 0.05),
    gain: level,
  }));
}

// Play one note or a chord. Call from a click or tap handler.
export async function play(midis: number[]) {
  const ac = unlock();
  const voices = humanize(midis);
  const m = await Promise.race([prime(), timeout(WAIT_MS, null)]);
  if (m) {
    prefetch(midis);
    const bufs = await Promise.race([
      Promise.all(voices.map((v) => buffer(ac, v.midi))),
      timeout(WAIT_MS, null),
    ]);
    if (bufs && bufs.every(Boolean)) {
      voices.forEach((v, i) => playSample(ac, bufs[i]!, v, m.notes[sampleName(v.midi)].gain ?? 1));
      return;
    }
  }
  voices.forEach((v) => playSynth(ac, v));
}

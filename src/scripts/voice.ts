// The staff's sound. It plays recorded voice samples when a sample set is
// published at /audio/voice/ (manifest.json plus one file per chromatic note)
// and falls back to a small Web Audio synth when it is not, or when a sample
// is slow to arrive. Nothing is fetched until the visitor first touches the
// staff, and nothing sounds until they click or tap.
import { hz, sampleName } from './pitch';

type Manifest = { version: string; notes: Record<string, { file: string; gain?: number }> };
type Voice = { midi: number; when: number; detune: number; pan: number; gain: number };
type Played = { env: GainNode; sources: AudioScheduledSourceNode[] };

// A sounding note or chord, timed on performance.now() so the staff can
// animate it. `until` moves earlier if the sound is cut off.
export type Sounding = { at: number; dur: number; until: number; stop(): void };

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

function playSample(ac: AudioContext, buf: AudioBuffer, v: Voice, gain: number): Played {
  const start = ac.currentTime + 0.01 + v.when;
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.detune.value = v.detune;
  const env = envelope(ac, start, v.gain * gain, 0.02);
  src.connect(env);
  route(ac, env, v.pan);
  src.start(start);
  src.stop(start + DUR + RELEASE + 0.05);
  return { env, sources: [src] };
}

// The synth from the first version of the staff: a triangle plus a quiet
// octave, low-passed, with gentle delayed vibrato.
function playSynth(ac: AudioContext, v: Voice): Played {
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
  const sources: AudioScheduledSourceNode[] = [vib];
  for (const [mult, type, level] of partials) {
    const o = ac.createOscillator();
    sources.push(o);
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
  return { env: out, sources };
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

const CUT = 0.07; // seconds to fade out a chord that another chord replaces
let chordSeq = 0;
let chordNow: Sounding | null = null;

function sounding(ac: AudioContext, played: Played[]): Sounding {
  const at = performance.now() + 10;
  const s: Sounding = {
    at,
    dur: DUR * 1000,
    until: at + (DUR + RELEASE) * 1000,
    stop() {
      const t = ac.currentTime;
      for (const { env, sources } of played) {
        const g = env.gain;
        g.cancelScheduledValues(t);
        g.setValueAtTime(Math.max(0.0001, g.value), t);
        g.exponentialRampToValueAtTime(0.0001, t + CUT);
        for (const src of sources) {
          try { src.stop(t + CUT + 0.02); } catch { /* already stopped */ }
        }
      }
      s.until = Math.min(s.until, performance.now() + CUT * 1000);
    },
  };
  return s;
}

// Play one note or a chord. Call from a click or tap handler. Chords are
// exclusive: a new chord fades out the one still sounding, and a chord whose
// samples arrive after a newer click never sounds at all. Single notes can
// overlap, like a melody with the pedal down.
export async function play(midis: number[], { chord = false } = {}): Promise<Sounding | null> {
  const ac = unlock();
  const seq = chord ? ++chordSeq : 0;
  const voices = humanize(midis);
  let played: Played[] | null = null;
  const m = await Promise.race([prime(), timeout(WAIT_MS, null)]);
  let bufs: (AudioBuffer | null)[] | null = null;
  if (m) {
    prefetch(midis);
    bufs = await Promise.race([
      Promise.all(voices.map((v) => buffer(ac, v.midi))),
      timeout(WAIT_MS, null),
    ]);
  }
  if (chord) {
    if (seq !== chordSeq) return null;
    chordNow?.stop();
  }
  if (m && bufs && bufs.every(Boolean)) {
    played = voices.map((v, i) => playSample(ac, bufs![i]!, v, m.notes[sampleName(v.midi)].gain ?? 1));
  } else {
    played = voices.map((v) => playSynth(ac, v));
  }
  const s = sounding(ac, played);
  if (chord) chordNow = s;
  return s;
}

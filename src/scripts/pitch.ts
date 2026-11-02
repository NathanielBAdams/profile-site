// Spelled pitches. A diatonic step counts letter names from C0 (C4 = 28), so a
// note's staff position follows its letter; alter adds sharps or flats.
export type Pitch = { name: string; step: number; alter: number; midi: number };

const LETTERS = 'CDEFGAB';
const SEMIS = [0, 2, 4, 5, 7, 9, 11];

export function midiOfStep(step: number, alter = 0) {
  const oct = Math.floor(step / 7);
  const deg = ((step % 7) + 7) % 7;
  return 12 * (oct + 1) + SEMIS[deg] + alter;
}

// "C3", "A#4", "Eb4", "F##3", "Bbb2"
export function parsePitch(name: string): Pitch {
  const m = /^([A-G])(##|#|bb|b)?(-?\d)$/.exec(name.trim());
  if (!m) throw new Error(`Bad pitch: ${name}`);
  const alter = { '##': 2, '#': 1, bb: -2, b: -1 }[m[2] ?? ''] ?? 0;
  const step = Number(m[3]) * 7 + LETTERS.indexOf(m[1]);
  return { name, step, alter, midi: midiOfStep(step, alter) };
}

export const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// File-safe sample name for a MIDI note, with sharps: 61 -> "Cs4".
const SHARP_NAMES = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
export const sampleName = (midi: number) => `${SHARP_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

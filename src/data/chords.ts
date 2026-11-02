// Chords engraved on the staff, one half-note chord per measure, left to right.
// Chords marked side: 'left' sit between the clefs and the page title, and only
// appear on screens wide enough to have room for them; the rest sit on the right.
// Pitches are spelled bottom to top, within the voice's range C2 to A5. Notes
// from C4 up go on the treble staff unless a pitch is listed under `treble` or
// `bass` explicitly.
export type ChordSpec = {
  label: string;
  notes: string[];
  side?: 'left' | 'right'; // left of the page title, or right (the default)
  treble?: string[];
  bass?: string[];
};

export const chords: ChordSpec[] = [
  // Wagner's Tristan chord, ambiguous and unresolved.
  { label: 'Tristan chord', notes: ['F3', 'B3', 'D#4', 'G#4'], side: 'left' },
  // The "So What" voicing: stacked fourths with a third on top.
  { label: 'So What', notes: ['E3', 'A3', 'D4', 'G4', 'B4'], side: 'left' },
  // Eb major 7 with the 9th and the sharp 11th: an open Lydian bloom.
  { label: 'Lydian bloom', notes: ['Eb2', 'Bb2', 'G3', 'D4', 'F4', 'A4'], side: 'left' },
  // A TTBB voicing with no third: C6/maj7 or Am9 over C, both at once.
  { label: 'C A B G', notes: ['C3', 'A3', 'B3', 'G4'] },
  // An open fifth under a close cluster.
  { label: 'Cluster on D', notes: ['D3', 'A3', 'C4', 'E4', 'F4', 'G4'] },
  // G7(#9 b13), with the sharp ninth spelled as Bb: root, seventh, third,
  // flat thirteenth, and Bb on top.
  { label: 'G7 sharp 9 flat 13', notes: ['G2', 'F3', 'B3', 'Eb4', 'Bb4'] },
];

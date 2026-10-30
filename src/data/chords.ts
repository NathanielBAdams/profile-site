// Chords engraved on the right of the staff, one half-note chord per measure.
// Pitches are spelled bottom to top, within the voice's range C2 to A5. Notes
// from C4 up go on the treble staff unless a pitch is listed under `treble` or
// `bass` explicitly.
export type ChordSpec = { label: string; notes: string[]; treble?: string[]; bass?: string[] };

export const chords: ChordSpec[] = [
  // A TTBB voicing with no third: C6/maj7 or Am9 over C, both at once.
  { label: 'C A B G', notes: ['C3', 'A3', 'B3', 'G4'] },
  // An open fifth under a close cluster.
  { label: 'Cluster on D', notes: ['D3', 'A3', 'C4', 'E4', 'F4', 'G4'] },
  // G7(#9 b13), with the sharp ninth spelled as Bb: root, seventh, third,
  // flat thirteenth, and Bb on top.
  { label: 'G7 sharp 9 flat 13', notes: ['G2', 'F3', 'B3', 'Eb4', 'Bb4'] },
];

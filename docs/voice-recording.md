# Recording the staff voice

Fourteen sustained notes, sung a cappella on one vowel. A script in `scripts/` turns them into one file for every chromatic note from C2 to A5, each shifted at most two semitones from a real recording and never across the chest/falsetto break. So the closer each recording is to what you want people to hear, the better every note around it sounds.

Time needed: about 30 minutes, plus a morning session for the low notes.

## What to sing

**Vowel: "oo"** as in *moon*. Confirm this before you record; changing it later means recording everything again.

- Lips rounded, the same "oo" in every register. In falsetto it will want to open toward "oh"; keep it closed.
- **Straight tone:** no vibrato from start to finish.
- **Dynamic:** a comfortable mezzo-forte, the same effort on every note. Don't push the low notes or float the high ones. The script evens out loudness, but it can't change how the voice sounds at a different dynamic.
- **Onset:** start the note cleanly on pitch. No scoop up to it, no "h" before it, no hard glottal attack. The onset is kept, so it's the part people hear first.
- **Length:** hold each note about 4 seconds, then just stop. The script trims and fades the end, so the release doesn't matter.

## The notes

Two takes of each, in separate files. The script keeps the steadier one.

| Register | Note | Hz | Files |
|---|---|---|---|
| Chest | C2 | 65.4 | `C2-1.wav`, `C2-2.wav` |
| Chest | E2 | 82.4 | `E2-1.wav`, `E2-2.wav` |
| Chest | G#2 | 103.8 | `G#2-1.wav`, `G#2-2.wav` |
| Chest | C3 | 130.8 | `C3-1.wav`, `C3-2.wav` |
| Chest | E3 | 164.8 | `E3-1.wav`, `E3-2.wav` |
| Chest | G#3 | 207.7 | `G#3-1.wav`, `G#3-2.wav` |
| Chest or mix | C4 | 261.6 | `C4-1.wav`, `C4-2.wav` |
| Chest or mix | E4 | 329.6 | `E4-1.wav`, `E4-2.wav` |
| Chest or mix | G4 | 392.0 | `G4-1.wav`, `G4-2.wav` |
| Falsetto | F4 | 349.2 | `F4-1.wav`, `F4-2.wav` |
| Falsetto | A4 | 440.0 | `A4-1.wav`, `A4-2.wav` |
| Falsetto | C#5 | 554.4 | `C#5-1.wav`, `C#5-2.wav` |
| Falsetto | F5 | 698.5 | `F5-1.wav`, `F5-2.wav` |
| Falsetto | A5 | 880.0 | `A5-1.wav`, `A5-2.wav` |

F4 to G4 is sung in both registers on purpose. Comparing them is how the crossover point gets chosen, so sing the falsetto F4 as falsetto even though chest is easier there.

**Do the low notes in the morning** (at least C2 to G#2), when the bottom of the voice is there. Everything else can be another time, as long as the setup is the same.

## Pitch

Listen to the pitch, then sing it with the reference off.

- Play each note from a tuner app or keyboard in **closed-back headphones**, at low volume, then stop it before you sing. Sound leaking into the mic doubles the note and can't be removed.
- Aim to be within about 10 cents. The script tunes every file exactly, but small corrections sound more natural than large ones.
- A tuner on screen while you hold the note helps keep it from drifting. Drift within a note is harder to fix than being slightly off overall.

## Mic and room

**Room:** the quietest, deadest room you have. A closet full of clothes, or a bedroom with a duvet hung behind the mic, is better than a nice-sounding room. Avoid the bathroom and the kitchen. Turn off the AC, fans and anything humming, and silence your phone.

**Mic:** a condenser or a good dynamic mic into an audio interface. If all you have is a phone, use a voice memo app set to lossless.

- **Distance:** about 20 cm (8 inches), slightly off to the side of your mouth, and the same for every note. Mark the spot. Don't back away for the high notes.
- **Pop filter:** optional for "oo", but it also helps you keep the distance.

**Before the notes:** record 10 seconds of the room with you sitting still, and save it as `room.wav`. The script uses it to measure noise.

## Levels and format

- Set the gain once, on your loudest note (probably A5 or the top chest notes), so that peaks land around **-12 dBFS** and never above -6. Then leave the gain alone for the whole session, morning notes included.
- **Format:** WAV, mono, 48 kHz, 24-bit. 44.1 kHz is fine too; just don't mix rates.
- No processing: no EQ, compression, reverb, noise reduction or auto-tune. The script needs the raw sound.
- Leave about a second of silence before each take starts.

## Delivering

Put all 29 files (28 takes plus `room.wav`) in

```
~/Documents/repos/profile-site/recordings/raw/
```

That folder is ignored by git, so the raw WAVs never end up in the repo. Tell me when they're there and I'll take it from there. If a take bothers you, re-record just that note with the same setup.

## Checklist

- [ ] Vowel confirmed
- [ ] Quiet room, AC and fans off
- [ ] Mic at 20 cm, spot marked
- [ ] Gain set on the loudest note, peaks around -12 dBFS
- [ ] `room.wav`, 10 seconds
- [ ] Low notes in the morning
- [ ] 2 takes of each of the 14 notes, named as in the table
- [ ] Files in `recordings/raw/`

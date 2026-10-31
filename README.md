# nathaniel-adams.com

Personal site for Nate Adams: NYC choral contractor, composer, and software engineer.

Built with [Astro](https://astro.build) (plus a couple of React islands) and deployed as a static site on AWS Amplify Hosting from the `main` branch.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build to dist/
npm run preview  # serve the built site
```

Requires Node 22.12+.

## Structure

- `src/pages/`: one `.astro` file per page
- `src/layouts/Layout.astro`: shared `<head>` (SEO meta, Open Graph, JSON-LD)
- `src/components/`: Navbar, Section
- `public/`: static files served as-is (images, robots.txt, favicon)

## The staff

`src/components/Staff.astro` draws the playable grand staff behind each page header.

- `src/data/chords.ts`: the clickable chords, as spelled pitches (`C3`, `Eb4`, `Bb4`), one per measure.
- `src/scripts/voice.ts`: the sound. It plays voice samples from `public/audio/voice/` when that folder has a `manifest.json`, and falls back to a Web Audio synth otherwise. Nothing is fetched until the visitor reaches the staff, and nothing sounds until a click or tap.
- `src/scripts/pitch.ts`: pitch spelling and sample file names (`Cs4.mp3` for C#4).
- `src/scripts/glyphs.ts`: clef, notehead and accidental outlines from the [Bravura](https://github.com/steinbergmedia/bravura) music font by Steinberg Media Technologies, used under the SIL Open Font License 1.1.

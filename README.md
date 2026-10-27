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

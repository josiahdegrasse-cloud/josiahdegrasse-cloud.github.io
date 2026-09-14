# Josiah deGrasse — Portfolio

An AI engineering and product portfolio built with React and Vite. NFI, Red Hat, and HeadTap are featured projects; lacrosse and Helfrich provide additional design work. The presentation uses cream-white surfaces, restrained orange accents, large project previews, a short introduction, and real product imagery.

## Develop

```sh
npm ci
npm run dev
npm test
npm run preview
```

`npm test` runs TypeScript, the production build, prerendering, generated-site validation, and CAD mesh integrity checks. `npm run build` builds without the additional checks. Build creates static HTML for eight routes, their metadata, compatibility aliases, and sitemap. Interactions hydrate in the browser.

## Routes

- `/`: selected work
- `/work/nfi`, `/work/red-hat`: featured studies
- `/work/lacrosse`: physical design study
- `/work/headtap`: featured independent music discovery app
- `/work/helfrich`: manufacturing project
- `/about`, `/resume`
- Original `/portfolio/case-studies` and `/portfolio/projects/:id` links remain valid.
- The Three.js experience has been removed. `/play` and `/portfolio/play` show the portfolio, including without JavaScript. Retired `world` and `mission` query parameters are cleared while retaining the requested portfolio page and unrelated parameters.

## Content and assets

`src/design-content.ts` contains profile and work summaries. `src/resume-content.json` is shared between the web résumé and `scripts/build-resume.py`. Case studies live in `src/design-case-studies.tsx`, and the screen tour in `src/product-walkthrough.tsx`. Homepage composition is in `src/design-home.tsx` and `src/home.css`. Shared components and tokens are in `src/design-components.tsx`, `src/design-system.css`, and `src/design-editorial.css`.

See [asset provenance](docs/asset-checklist.md), [handoff](docs/design-handoff.md), [research](docs/ui-ux-research.md), and [review history](docs/review-log.md).

The homepage physical-design feature rotates the original lacrosse mesh as the card passes through the viewport. Its viewer has a white background and no visible controls, with automatic motion disabled for reduced-motion preferences. The lacrosse page leads with a scroll-controlled WebGL turntable from the supplied SolidWorks display mesh and native Nylon 101 base color, with manual angle/tilt controls and reduced-motion support. See [object asset provenance](docs/object-assets.md). Use only original models and images; do not generate reinterpretations. The Moka project was removed at Josiah's request on September 14, 2026.

NFI images are genuine interface captures with synthetic demonstration data. The current cover shows sensory charts and coconut cheddar prototypes. Sample metrics are not project outcomes. Red Hat uses the team's actual Figma Make prototypes and original report artifacts, with research methods, iteration history, and individual team roles supported by the final report and presentation. Removed game source remains recoverable in Git history.

For another deployment origin, update `profile.origin`, the origin in `scripts/prerender.mjs`, and baseline URLs in `index.html` and `public/robots.txt` before building. The current Sites deployment is private.

## GitHub Pages

Primary public URL: https://josiahdegrasse-cloud.github.io/.

The `root-pages` remote points to `josiahdegrasse-cloud/josiahdegrasse-cloud.github.io`. Its Pages workflow builds and publishes `main` at the root URL. The original `origin` remote points to `josiahdegrasse-cloud/josiah-portfolio`; that repository continues to publish at `/josiah-portfolio/`. The shared workflow selects the correct base path from the repository name, with `VITE_SITE_ORIGIN=https://josiahdegrasse-cloud.github.io` for both. Push source updates to `root-pages` `main` to update the primary public site.

Links, images, fonts, the CAD model, routing, and social/canonical metadata honor the deployment base. The normal build continues to target Sites at its root path. Run `npm test` with either deployment environment to validate its static output.

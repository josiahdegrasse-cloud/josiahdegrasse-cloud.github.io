# Josiah deGrasse — Portfolio

An AI engineering and product portfolio built with React and Vite. NFI and Red Hat lead the selected work; HeadTap, lacrosse, and Helfrich are supporting projects. The presentation uses large project previews, a short introduction, and real product imagery.

## Develop

```sh
npm ci
npm run dev
npm test
npm run preview
```

`npm test` runs TypeScript, the production build, prerendering, generated-site validation, and CAD mesh integrity checks. `npm run build` builds without the additional checks. Build creates static HTML for nine routes, their metadata, compatibility aliases, and sitemap. Interactions hydrate in the browser.

## Routes

- `/`: selected work
- `/work/nfi`, `/work/red-hat`: featured studies
- `/work/lacrosse`, `/work/moka-pot`: physical design studies
- `/work/headtap`, `/work/helfrich`: supporting projects
- `/about`, `/resume`
- Original `/portfolio/case-studies` and `/portfolio/projects/:id` links remain valid.
- The Three.js experience has been removed. `/play` and `/portfolio/play` show the portfolio, including without JavaScript. Retired `world` and `mission` query parameters are cleared while retaining the requested portfolio page and unrelated parameters.

## Content and assets

`src/design-content.ts` contains profile and work summaries. `src/resume-content.json` is shared between the web résumé and `scripts/build-resume.py`. Case studies live in `src/design-case-studies.tsx`, and the screen tour in `src/product-walkthrough.tsx`. Homepage composition is in `src/design-home.tsx` and `src/home.css`. Shared components and tokens are in `src/design-components.tsx`, `src/design-system.css`, and `src/design-editorial.css`.

See [asset provenance](docs/asset-checklist.md), [handoff](docs/design-handoff.md), [research](docs/ui-ux-research.md), and [review history](docs/review-log.md).

The Objects gallery pairs studio interpretations with original CAD references. The lacrosse page includes a scroll-controlled WebGL turntable from the supplied SolidWorks display mesh, with manual angle/tilt controls and reduced-motion support. See [object assets and exact prompts](docs/object-assets.md) for provenance and the missing Moka component files required for its turntable.

NFI images are genuine interface captures with synthetic demonstration data. The current cover shows sensory charts and coconut cheddar prototypes. Sample metrics are not project outcomes. Red Hat uses the team's actual Figma Make prototypes and original report artifacts, with research methods, iteration history, and individual team roles supported by the final report and presentation. Removed game source remains recoverable in Git history.

For another deployment origin, update `profile.origin`, the origin in `scripts/prerender.mjs`, and baseline URLs in `index.html` and `public/robots.txt` before building. The current Sites deployment is private.

# Josiah deGrasse — Design Portfolio

An editorial Human Factors + AI Product Design portfolio built with React and Vite. NFI and Red Hat are featured; HeadTap, lacrosse and Helfrich are supporting projects. The original Three.js world remains an optional experiment.

## Develop

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
node scripts/check-site.mjs
npm run preview
```

Build creates static HTML for the main routes, their metadata, legacy aliases and sitemap. Interactions hydrate in the browser. The development server remains client rendered.

## Routes

- `/`: selected work
- `/work/nfi`, `/work/red-hat`: featured studies
- `/work/headtap`, `/work/lacrosse`, `/work/helfrich`: supporting projects
- `/about`, `/resume`
- `/play`, `/portfolio/play`, `?world=machine`, `?world=bedroom`, and original mission queries: optional legacy experience
- Original `/portfolio/case-studies` and `/portfolio/projects/:id` links remain valid.

## Content and assets

`src/design-content.ts` contains profile and work summaries. `src/resume-content.json` is shared between the web résumé and `scripts/build-resume.py`. Case-study sections live in `src/design-case-studies.tsx`. Reusable editorial components and tokens are in `src/design-components.tsx` and `src/design-system.css`.

See [the audit](docs/redesign-audit.md), [asset checklist](docs/asset-checklist.md), [handoff](docs/design-handoff.md), and [future independent case study](docs/future-web-case-study.md).

Images in `public/images/nfi` are genuine interface captures with synthetic demonstration data. Do not use those sample metrics as project outcomes. Original portfolio assets and résumé remain preserved; no nonexistent Figma work or research artifact is represented as real.

For another deployment origin, update `profile.origin` in `src/design-content.ts`, the origin in `scripts/prerender.mjs`, and baseline URLs in `index.html` and `public/robots.txt` before building. The Sites preview is private by default.

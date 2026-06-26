# Josiah deGrasse — Portfolio

An interactive 3D portfolio (Three.js + React) extracted into its own standalone
app, formerly embedded in the Sensory Analysis Dashboard under `/portfolio`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

Entry point: `src/main.tsx` → `PortfolioPage` (`src/portfolio-page.tsx`), which
routes between experiences off `window.location` (e.g. the default bedroom world,
`?world=machine`, `/portfolio/case-studies`, `/portfolio/projects/<id>`).

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the build
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — run the vitest suite

## Notes

- `public/` holds the static assets the experiences reference by absolute path:
  `public/portfolio/assets/*.png`, `public/josiah-degrasse-resume.pdf`, and
  `public/new_foodinnovation_ltd_logo.jpg`.
- Some deep-link paths still carry a `/portfolio/...` prefix (a holdover from the
  embedded version); the root `/` renders the main experience.

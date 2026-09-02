# Josiah deGrasse Portfolio

Fresh Vite + React 18 + TypeScript + Tailwind build for Josiah deGrasse's portfolio. The visual system is a clean professional case-study interface: paper background, restrained borders, sharp typography, evidence-first project writing, and purposeful interactive explainers.

## Setup

```bash
npm install
cp .env.example .env.local
```

Environment variables:

- `VITE_FORMSPREE_ENDPOINT`: optional Formspree or compatible no-backend form endpoint. When absent, the contact form falls back to a populated `mailto:` link.
- `VITE_CONTACT_EMAIL`: canonical public email address. Confirm this before publishing. The brief mentions `josiahdegrasse@gmail.com` on the old site and `Josiah.deGrasse@tufts.edu` on the resume; this build defaults to the resume address until you choose one.
- `VITE_RESUME_URL`: downloadable résumé URL. Leave blank until the real PDF is added; résumé links fall back to a mailto résumé request so they are not dead ends.

## Development

```bash
npm run dev
npm run test
npm run test:contrast
npm run build
```

## Assets

Place the seven real image assets in `public/images/` with the exact filenames from the brief:

- `josiah-portrait-dolomites.jpg`
- `josiah-lacrosse-action.jpg`
- `lacrosse-head-render.jpg`
- `lacrosse-head-engineering-drawing.jpg`
- `lacrosse-head-3d-printing.jpg`
- `lacrosse-head-field-test.jpg`
- `lacrosse-head-fracture.jpg`

Until those files are present, the UI shows a missing-asset panel instead of a broken image icon. Do not replace these with stock photography.

Add the résumé PDF as `public/resume.pdf` or set `VITE_RESUME_URL=/resume.pdf`.

## Content Update Guide

Most portfolio copy and structured data lives in `src/data/content.ts`. Edit that file to update section copy, project tags, image alt text, links, and contact metadata without touching component layout. Shared design values for animation or scripts live in `src/data/tokens.ts`; Tailwind tokens live in `tailwind.config.ts`.

Project visuals that are not public screenshots are intentionally built as diagrams in `src/components/Work.tsx`. TODO: rebuild HeadTap as a live interactive demo in a future pass; this build uses the requested `Listening History → Taste Profile → Concert Score` diagram rather than faking a prototype.

## Deployment

This is a static site and can deploy to Vercel, Netlify, or any static host:

```bash
npm run build
```

Deploy the generated `dist/` directory. Configure the same environment variables in the hosting platform before publishing.

## Verification Notes

- `npm run test` covers smoke rendering for the major sections and the contact form submit path.
- `npm run test:contrast` checks the active text/background pairings against WCAG AA thresholds.
- The app respects `prefers-reduced-motion` for the hero animation and scroll reveals.

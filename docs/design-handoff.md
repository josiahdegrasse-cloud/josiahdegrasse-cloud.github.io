# Portfolio handoff

## Current direction

AI Engineer · Human Factors. The September 10 user direction removes the Three.js game and asks for a professional, cool, less preachy portfolio, informed by Karolis Kosas, Matt Fredette, and Jastin Design. This supersedes the original brief's instruction to preserve the game.

The homepage now leads with a short introduction, generous project previews, and concise descriptions. Large sans-serif typography replaces the previous manifesto-style hero; the separate philosophy section is removed. About and contact copy are direct and factual. Case-study evidence, résumé, and real personal imagery remain.

## Main files

- `src/design-home.tsx`, `src/home.css`: current homepage.
- `src/design-components.tsx`: navigation, footer, accessible native image dialog, diagrams, and reusable sections.
- `src/design-case-studies.tsx`: NFI and Red Hat studies.
- `src/product-walkthrough.tsx`: reusable three-step screen tours for NFI and Red Hat.
- `src/design-about.tsx`: About, résumé, supporting projects, and 404.
- `src/design-content.ts`, `src/resume-content.json`: shared factual content.
- `src/portfolio-page.tsx`, `src/main.tsx`: routing, metadata, hydration, and retired-link recovery.
- `scripts/prerender.mjs`, `scripts/check-site.mjs`: eight static pages, compatibility aliases, metadata, and site checks.
- `scripts/build-resume.py`: matching one-page PDF.

All 46 unreachable game source, style, and test files were removed with Three.js, its types, and the game-only test runner. The old play routes resolve to the portfolio. Git history retains the original work.

## Visual references

- [Karolis Kosas](https://karoliskosas.com/): concise introduction and generous project imagery.
- [Matt Fredette](https://www.mattfredette.com/): clear project entry points and prominent previews.
- [Jastin Design](https://www.jastindesign.com/): confident type and personality in a simple structure.

These informed composition and tone; no reference-site imagery, biography, or project work was copied.

## NFI imagery

`public/images/nfi/nfi-sensory-profile.png` is an unaltered 1280×720 screenshot of the live synthetic Sensory demo, captured September 10. It shows the radar chart and five sensory intensity ratings with two coconut cheddar prototypes. It now leads the homepage, NFI case study, and walkthrough. The capture is 74 KB and retains the actual UI. The original Decision Review capture remains in its relevant study section and tour step.

## Red Hat imagery

The supplied final report, May 7 presentation, and project notebook replace the earlier reconstructed story. Seven original artifacts now show the team's deployment list, deterministic diagnostics, side-by-side YAML review, AI assistant, editable hardware presets, journey map, and first annotated iteration. Live prototype captures are unaltered 1280×720 viewports; report images retain their original dimensions. See `asset-checklist.md` for provenance and prototype links. Interim official Red Hat documentation images were superseded and removed.

The case study credits Josiah as UX Designer in a five-person team. Discovery involved five participants without RHOAI experience and three Red Hat participants with it. Subsequent rounds involved four experienced users and five stakeholders; these are separate rounds, not 17 unique participants. The narrative explains the move from AI-inferred causes to deterministic checks following stakeholder review. It makes no aggregate rating, shipped-feature, or production-performance claim.

## Verification and remaining evidence

The physical-design update adds studio images for the lacrosse head and moka pot, an Objects gallery, a dedicated `/work/moka-pot` route, and the lacrosse CAD turntable. See `object-assets.md` for exact image prompts, source provenance, extraction, and limitations. The site now has nine prerendered routes. The lacrosse viewer uses original saved mesh data with manual rotation/tilt and reduced-motion support. It is unrelated to the removed game and adds no Three.js dependency. Moka rotation requires the three missing component files or an assembled export; the current Moka page is a complete still-image study without an invented mesh.

See the latest entry in `review-log.md` for checks and publication receipts. `npm test` runs typechecking, build, prerendering, and static validation; browser tests cover responsive layouts, retired-link recovery, interactions, and automated accessibility scans.

Red Hat's original screens and research artifacts are now included. Testing its refined design with newcomers and planning implementation remained next steps in the final report. NFI's participant count, testing protocol, improvement log, and matched before/after screens are not supplied. Preserve those qualifiers; the demo's synthetic panel counts cannot stand in for usability participants. The portfolio acknowledges the team's use of Figma Make and AI development tools.

The four-hour scheduled review window ended September 10 at 06:47 UTC and is paused. Subsequent edits are in response to direct user messages. Do not restart it or restore game work without a new request.

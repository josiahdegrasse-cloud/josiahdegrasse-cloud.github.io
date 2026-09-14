# Portfolio handoff

## Current direction

AI Engineer · Human Factors. The September 10 user direction removes the Three.js game and asks for a professional, cool, less preachy portfolio, informed by Karolis Kosas, Matt Fredette, and Jastin Design. This supersedes the original brief's instruction to preserve the game. The user explicitly rejected decorative headline underlines; keep the hero typography plain.

The homepage now leads with a short introduction and featured NFI, Red Hat, and HeadTap projects, in that order. The current visual direction is cream white (#fbf7ef), warm ink, and bright orange (#ff6a00) accents, with #bd3f00 for small orange text. Shared frames, navigation, footer, case-study surfaces, and focus states use this palette. Large sans-serif typography replaces the previous manifesto-style hero; the separate philosophy section is removed. About and contact copy are direct and factual. Case-study evidence, résumé, and real personal imagery remain.

## Main files

- `src/design-home.tsx`, `src/home.css`: current homepage.
- `src/design-components.tsx`: navigation, footer, accessible native image dialog, diagrams, and reusable sections.
- `src/design-case-studies.tsx`: NFI and Red Hat studies.
- `src/product-walkthrough.tsx`: reusable three-step screen tours for NFI and Red Hat.
- `src/design-about.tsx`: About, résumé, supporting projects, and 404.
- `src/design-content.ts`, `src/resume-content.json`: shared factual content.
- `src/portfolio-page.tsx`, `src/main.tsx`: routing, metadata, hydration, and retired-link recovery.
- `scripts/prerender.mjs`, `scripts/check-site.mjs`: nine static pages, compatibility aliases, metadata, and site checks.
- `scripts/build-resume.py`: matching one-page PDF.

All 46 unreachable game source, style, and test files were removed with Three.js, its types, and the game-only test runner. The old play routes resolve to the portfolio. Git history retains the original work.

## Visual references

- [Karolis Kosas](https://karoliskosas.com/): concise introduction and generous project imagery.
- [Matt Fredette](https://www.mattfredette.com/): clear project entry points and prominent previews.
- [Jastin Design](https://www.jastindesign.com/): confident type and personality in a simple structure.

These informed composition and tone; no reference-site imagery, biography, or project work was copied.

## NFI imagery

The NFI cover pairs a new September 14 capture, `nfi-liking-results.jpg`, with the original `nfi-sensory-profile.png`. The new capture shows Coconut Cheddar v2's liking chart, confidence intervals, five score summaries, and both project samples in the selector. The radar image shows the baseline sample. Both are actual 1280×720 demo screens. The case hero and first walkthrough step use the new capture; the sensory profile, decision, and report-review steps remain available. Sample scores are not project outcomes.

## Red Hat imagery

The supplied final report, May 7 presentation, and project notebook replace the earlier reconstructed story. Seven original artifacts now show the team's deployment list, deterministic diagnostics, side-by-side YAML review, AI assistant, editable hardware presets, journey map, and first annotated iteration. Live prototype captures are unaltered 1280×720 viewports; report images retain their original dimensions. See `asset-checklist.md` for provenance and prototype links. Interim official Red Hat documentation images were superseded and removed.

The case study credits Josiah as UX Designer in a five-person team. Discovery involved five participants without RHOAI experience and three Red Hat participants with it. Subsequent rounds involved four experienced users and five stakeholders; these are separate rounds, not 17 unique participants. The narrative explains the move from AI-inferred causes to deterministic checks following stakeholder review. It makes no aggregate rating, shipped-feature, or production-performance claim.

## HeadTap imagery

HeadTap remains third on the homepage. Its refreshed cover pairs `headtap-music-dna.jpg` and `headtap-discovery.jpg`, captured September 14 from a temporary build of the current user-supplied local app. The orange profile leads, with concert cards as a second image. The case study uses the same fresh images at full width. Preserve the sample-data labels; no actual account or live event data was used. These captures do not deploy or modify the HeadTap app. The older screenshots were removed from the published assets.

## Verification and remaining evidence

The physical-design showcase now features only the lacrosse CAD turntable. Moka was removed from the gallery, routes, metadata, and public assets at Josiah's request on September 14, 2026. The homepage uses a single feature with the white, scroll-driven model beside its description; mobile stacks the content. Josiah explicitly rejected remade objects: use only his original geometry, saved preview, and drawing. See `object-assets.md` for source provenance and extraction. The site has eight prerendered routes. The lacrosse page preserves its original saved mesh and native Nylon 101 base color, manual rotation/tilt, and reduced-motion support. It adds no Three.js dependency.

Homepage and About copy use direct descriptions of work, education, coaching, and interests. The About header uses sans-serif type without the decorative signature or maker tagline.

See the latest entry in `review-log.md` for checks and publication receipts. `npm test` runs typechecking, build, prerendering, and static validation; browser tests cover responsive layouts, retired-link recovery, interactions, and automated accessibility scans.

Red Hat's original screens and research artifacts are now included. Testing its refined design with newcomers and planning implementation remained next steps in the final report. NFI's participant count, testing protocol, improvement log, and matched before/after screens are not supplied. Preserve those qualifiers; the demo's synthetic panel counts cannot stand in for usability participants. The portfolio acknowledges the team's use of Figma Make and AI development tools.

The four-hour scheduled review window ended September 10 at 06:47 UTC and is paused. Subsequent edits are in response to direct user messages. Do not restart it or restore game work without a new request.

## Additional hosting and interests

The primary public URL is https://josiahdegrasse-cloud.github.io/. Its existing public `josiahdegrasse-cloud/josiahdegrasse-cloud.github.io` repository is the `root-pages` remote. GitHub Pages is configured through `.github/workflows/pages.yml` on both that root repository and the original `josiahdegrasse-cloud/josiah-portfolio` repository. It publishes pushes to `main` with `/` for the root repository and `/josiah-portfolio/` for the original repository. Keep `sitePath` and `routePath` handling for native links, assets, and client routes; SSR, canonicals, sitemap, and robots use the same deployment environment. Sites builds continue using the default root path.

Josiah's current interest list is coffee, lacrosse, sewing, surfing/snowboarding, and cheese. Use it consistently across the homepage, About, and both résumé formats.

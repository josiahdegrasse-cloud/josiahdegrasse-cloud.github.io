# Portfolio audit — before redesign

Baseline: GitHub `josiahdegrasse-cloud/josiah-portfolio`, main at the start of this task. Original source remains in Git and the optional play routes.

## Structure and hierarchy

- `main.tsx` imports `portfolio-page.tsx`; the root and unrecognized routes render `BedroomWorldPage`. Query parameters choose the machine world or two portfolio missions. `/portfolio/case-studies` and `/portfolio/projects/:id` render the recruiter view.
- The full 3D world, audio, games and styles are eagerly imported for the recruiter experience. A design recruiter must navigate a game to reach the strongest evidence.
- Five projects share one data shape and essentially equal text-row presentation. The project view is three or four paragraphs, evidence labels and an optional game. No long-form visual design narrative, About page, real 404, or dedicated résumé presentation.

## Content and evidence

- `portfolio-data.ts`, `portfolio-story.ts`, `machine-campaign-data.ts`, recruiter UI and résumé all contain overlapping positioning. NFI is labelled AI Product Engineer and leads with implementation, tooling and automated-test counts. The contact subject repeats that label.
- Existing supported material: NFI evidence chain, explicit human review, role-separated workflows, GO/TWEAK/STOP; Red Hat user interviews, two approaches, Figma work and trust findings; HeadTap discovery, Helfrich fixtures, Tufts Human Factors and lacrosse.
- The résumé has no eight-interview count, NFI task-completion percentage, improvement count or Red Hat leadership-validation details. These need confirmation before publication as factual outcomes.
- Existing mission datasets are illustrative portfolio scenarios, not production research evidence. They must be labelled accordingly.

## Visual system and assets

- Several independent style systems use Archivo Black, Barlow Condensed and Karla, saturated project colors, textured backgrounds, uppercase type and thick outlines. Repeated font imports, full-viewport layouts, fixed overlays and multiple spacing conventions favor the game.
- Only four public assets: two lacrosse PNGs, an NFI logo and the résumé PDF. No NFI or Red Hat product screenshots in this repository, no wireframes, before/after pairs, portrait or social metadata.
- Recovered three actual NFI screenshots from the user's public Sensory-Platform repository: decision review, insights and concept results. They use demo project data and must be captioned as such. Preserve source provenance in the asset checklist.

## UX, accessibility and performance

- Recruiter pages use links and semantic structure but provide limited wayfinding, no skip link and no page metadata. Existing CSS contains mobile and reduced-motion rules; game-based navigation adds avoidable keyboard/touch burden.
- Root metadata is a generic title with no description, canonical or social card. Unknown project IDs silently show the listing.
- Keep the existing npm lockfile, React/Vite stack and games. Load the game only when explicitly requested. Use a separate consistent editorial system, real responsive figures, semantic diagrams, visible focus, skip navigation, native image expansion and route metadata.

## Implementation direction

Design first: editorial homepage → NFI → Red Hat → smaller experiments → About/contact. Reuse authentic images. New workflow diagrams are explanatory reconstructions, not invented research artifacts. Missing evidence receives explicit neutral asset placeholders. The future OpenAI business web concept is documented only, never listed as completed work.

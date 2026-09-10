# Portfolio redesign handoff

## What changed

The homepage now presents Josiah as a Human Factors + AI Product Designer. NFI leads with real product imagery and a design narrative. Red Hat follows with research, competing concepts and trust-focused decisions. HeadTap, lacrosse and Helfrich are smaller supporting stories. About, an accessible HTML résumé, a matching one-page PDF and contact paths are included.

The visual system uses DM Sans and Instrument Serif, a crisp neutral background, restrained forest green, an editorial grid, generous but consistent spacing and minimal motion. The original 3D portfolio remains an optional experiment, loaded only on explicit play routes.

## Major files added or modified

- `src/portfolio-page.tsx`: route selection, metadata, aliases, not-found handling and lazy 3D loading.
- `src/main.tsx`: hydrates prerendered content and mounts normally for dynamic experiments.
- `src/design-home.tsx`: homepage and project hierarchy.
- `src/design-case-studies.tsx`: complete NFI and Red Hat narratives, real figures, workflow diagrams and honest missing-asset placeholders.
- `src/design-about.tsx`: About, secondary projects, résumé and recovery page.
- `src/design-components.tsx`: navigation, footer, sections, metadata, image dialog, figures, flow diagrams, concept comparison and next-project links.
- `src/design-content.ts`: profile, canonical origin, work summaries and project ordering.
- `src/design-system.css`: type, color, spacing, responsive layouts, focus, motion and print rules.
- `src/resume-content.json`: shared résumé content used by the site and PDF generator.
- `src/index.css`: shared reset without forcing the editorial pages into viewport-height layouts.
- `src/legacy-portfolio-page.tsx`: preserved original entry point, now loaded only for experiments.
- `src/portfolio-data.ts`, `src/machine-campaign-data.ts`, `src/little-machine-page.tsx`: supporting legacy positioning corrected.
- `src/portfolio-recruiter-view.tsx`: compatibility export pointing to the redesigned homepage; original implementation preserved in Git history.
- `index.html`: title, description, canonical, icon and social baseline.
- `package.json`: build now prerenders routes after Vite; dependency versions and lockfile retained.
- `scripts/prerender.mjs`: static page content, per-route SEO/social metadata, aliases, sitemap and 404.
- `scripts/build-resume.py`: one-page PDF built from shared résumé content.
- `scripts/check-site.mjs`: validates generated pages, links, images and metadata.
- `public/images/nfi/*`, `public/images/lacrosse/*`, `public/images/portfolio-preview.jpg`: optimized real project images and actual homepage sharing preview.
- `public/josiah-degrasse-design-resume.pdf`: matching design-focused résumé. Original PDF preserved.
- `public/favicon.svg`, `public/robots.txt`: identity and crawl rules.
- `.openai/hosting.json`: private Sites preview configuration.
- `docs/redesign-audit.md`, `docs/asset-checklist.md`, `docs/future-web-case-study.md`, this handoff and `README.md`: audit, provenance, missing evidence, future project plan and development guidance.

## Decisions with material impact

- Main entry is an editorial portfolio, with the playable world moved to an optional About-page link.
- NFI and Red Hat get the majority of the visual and narrative space; secondary projects retain their substance without equal weight.
- The existing React/Vite stack and all original game capabilities remain. The main bundle no longer includes the Three.js world.
- Real NFI screenshots were recovered from the user's repository and captured from the live synthetic demo. Diagrams are labelled as current explanatory reconstructions.
- Missing historical artifacts remain clearly marked. The future OpenAI concept is documented only.
- Main pages are prerendered, so content, canonical and project-specific sharing metadata exist before JavaScript runs.
- The résumé leads with a design identity and states AI-assisted prototyping honestly. It retains the original NFI position title as a contextual note.

## Validation

- TypeScript check and 22 existing tests passed.
- Production build and prerendering passed; generated-site validation checks every main page and internal asset/link.
- Browser checks covered 320, 375, 430, 768, 1024 and 1440 pixels. A cramped comparison at 320 pixels was fixed and checked again.
- Mobile navigation opens/closes; the image dialog opens, traps focus through the native dialog, closes with Escape, returns focus and restores scrolling. Keyboard Tab reaches a visible skip link.
- PDF has one page and was rendered and visually reviewed.
- Main JS is approximately 63 KB gzip; legacy 3D code is deferred. Images are WebP and reserved dimensions avoid layout shifts.
- Existing game interactions still produce browser/Three.js deprecation warnings. These are isolated from the editorial pages; this redesign is not a full game-engine repair.
- npm reports no production dependency advisories. The inherited development tools have advisories and should be updated in a dedicated maintenance pass; they are not shipped in the static site.
- This is a private review deployment. Sharing or publishing it for recruiters is a separate access decision.

## What still limits an elite application

The strongest remaining gap is original visual design evidence, particularly Red Hat Figma screens, iteration history and research artifacts. NFI now has actual interface imagery, but its testing story needs the participant count, improvement log and matched before/after screens. Web-specific brand/content storytelling and documented experimentation are still thin compared with the OpenAI role.

Priorities: (1) original Red Hat designs, (2) NFI usability and before/after evidence, (3) the real independent web-design project documented in `future-web-case-study.md`, (4) targeted mobile/prototype footage and personal imagery. See `asset-checklist.md` for exact assets and facts to supply. Do not send a case-study page with asset-needed placeholders as a finished referral portfolio.

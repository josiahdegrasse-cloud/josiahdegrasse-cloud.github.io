# Portfolio review log

## Primary GitHub root address — September 14, 2026

- User requested the portfolio at `https://josiahdegrasse-cloud.github.io`, without the project-path suffix. The user-site repository already existed and published an older September 2 portfolio from `gh-pages`.
- Added the `root-pages` remote and merged the old root repository's history while retaining the current portfolio tree. No force push or history deletion is required. The shared workflow selects `/` for the root repository and the project prefix for the original repository.
- The root repository is being switched to the current build-and-deploy workflow. Its public visibility and HTTPS remain. This request changes GitHub hosting; no Sites deployment or design changes are needed.

Root deployment succeeded from `761aa222ca6778b6f6fa680a97c897a86d3d07c2`: workflow run `34898182119` on `josiahdegrasse-cloud.github.io`; the original project-path workflow `34898183425` also succeeded. Live HTTP checks confirmed the root homepage serves the current portfolio, uses the root canonical URL, and contains the expected project order and interests. The HeadTap route and lacrosse mesh return HTTP 200 at root-relative URLs. The user's existing GitHub Pages tab was handed off to https://josiahdegrasse-cloud.github.io/. Both pushes were fast-forwards, and previous root-site history and the legacy `gh-pages` branch remain recoverable.

## GitHub Pages, project order, and interests — September 10, 2026

- User requested GitHub Pages hosting in addition to Sites, the order NFI → Red Hat → HeadTap, and the interest list coffee, lacrosse, sewing, surfing/snowboarding, and cheese. Updated homepage, About, résumé content, and its PDF aliases. The regenerated one-page résumé was visually inspected.
- The existing GitHub repository is public, `main` is its default branch, and the user has admin access. Added a Pages workflow and explicit base-path support for JSX links/assets, the CAD model, client routing, SSR, metadata, sitemap, and robots. No repository visibility change or new repository is required.
- The build with GitHub's `/josiah-portfolio/` base passes typechecking, nine-route prerendering, all 113 local links, 44 image references, metadata/resource checks, and the original CAD mesh validation. No portfolio browser QA was performed.

Both hosts deployed source `233d9475e5b03232afca4fff717038e831658131` successfully on September 10, 2026. GitHub Pages: https://josiahdegrasse-cloud.github.io/josiah-portfolio/ — workflow run `34539769562`, build and deploy jobs both succeeded. Source was pushed to the existing public repository's `main` without force or visibility changes. Sites version **12** succeeded at **22:56 UTC**: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_6b8e869ffa508191970d315a52189064`, deployment `appgdep_6aa3359751a48191b60f64e3bcd1dfdf`. Its existing owner-only URL and audience remain unchanged. Both host configurations passed the static checks; the stable Sites tab received the updated URL handoff.

## Plain headline and bright orange — September 10, 2026

- Removed the decorative underline from the homepage headline at Josiah's request. Keep hero typography plain going forward.
- Changed graphic accents from muted rust to bright orange (#ff6a00). Small orange text uses #bd3f00 for readability; cream surfaces and the featured project order remain.

## Cream palette and featured HeadTap — September 10, 2026

- User requested cream white with hints of orange throughout the portfolio and greater prominence for HeadTap. Updated shared colors, project frames, diagrams, image surrounds, navigation states, and footer. Orange is used for selected accents and a thin hero underline; body text remains warm ink.
- Promoted HeadTap to the second featured project, ahead of Red Hat, and removed its duplicate supporting row. Used the actual app supplied at `http://127.0.0.1:3000` to capture its music-profile and concert recommendation screens. Both PNGs retain the original 1280×720 viewport and UI. Demo/sample-data labels and captions remain explicit.
- Added the actual HeadTap cover and music-profile image to its case study. No local-only URL is exposed to visitors, and no app code, data source, or HeadTap hosting was changed. The temporary typographic cover was replaced before publication.
- Portfolio source compilation, build, and static checks pass: nine routes, 113 internal links, 44 image references, and the original 48,882 CAD triangles. Calculated ink, muted text, and orange contrast on cream, soft cream, and white exceeds 4.5:1. Source-app screenshots were inspected to obtain authentic assets; no portfolio browser QA was performed.

Version **11** deployed successfully at **14:35 UTC**, September 10, 2026. Source: `6b602929e4d63b55b2a6121222e543eaf8d78525`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_2d958bcd27288191889afb6375d71739`. Deployment: `appgdep_6aa2c00c14108191b5b35d4787e65b77`. The cream/orange portfolio, original HeadTap screens, featured project order, and white homepage lacrosse display without controls are published at the unchanged owner-only URL. The established Site tab received the homepage handoff.

## Clean homepage object display — September 10, 2026

- User requested no visible rotation bar and a white background. Removed the entire controls overlay from the homepage lacrosse viewer and gave its stage a white background matching the Moka image frame.
- Scroll-driven rotation and reduced-motion support remain active. The original mesh and material are unchanged. Detailed project-page controls remain available.

## Homepage scroll rotation — September 10, 2026

- User clarified that the actual lacrosse head should rotate while scrolling on the main page. Replaced its static Objects thumbnail with a compact instance of the existing original CAD viewer.
- The compact viewer maps the card's passage through the viewport to one full revolution, without adding a sticky section or extra scroll height. Retained lazy mesh loading, render-on-demand, pause/resume, a manual slider, reduced-motion handling, and the original saved-preview fallback. Project navigation remains a separate title link so it does not interfere with controls.
- The existing project-page viewer, geometry, material color, and Moka preview remain unchanged. No model recreation or game dependency was introduced.
- Typecheck, build, and static validation pass: nine routes, 111 internal links, 39 image references, and 48,882 CAD triangles. No browser-interaction QA was performed for this change.

Version **10** deployed successfully at **14:24 UTC**, September 10, 2026. Source: `2fd0cab3775f15d6683c3784bbb9d3f49f3b34fd`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_0c2aa6bcae208191a677019c4be69c96`. Deployment: `appgdep_6aa2bd999aa48191a9ed56aaae47b445`. Homepage scroll rotation is published at the existing owner-only URL, and the established Site tab received the homepage handoff.

## Original object correction — September 10, 2026

- Josiah requested the actual lacrosse head and moka pot, without remaking either design. Removed both generated studio images, source PNGs, prompt files, and their frontend references.
- The Objects gallery now uses unchanged native SolidWorks previews at their original 640×480 aspect ratio. Verified both previews byte-for-byte against the extracted PreviewPNG streams and the build copies.
- The lacrosse page leads with its existing original display mesh. The viewer now uses the saved Nylon 101 base color from native appearance records; display lighting is supplied by the viewer. The mesh and original drawing are unchanged.
- Moka leads with its original assembly preview, retaining the actual handle, lid, and transparent CAD display state. Its exact turntable still requires the three missing component parts or an assembled STEP/GLB export.
- Typecheck, production build, and static checks pass: nine routes, 110 internal links, 39 image references, and 48,882 CAD triangles. Confirmed the generated image files and references are absent from the built publication. No browser-interaction QA was performed for this correction.
- Updated project guidance to preserve original objects only. The previous studio-image entry below is historical and superseded.

### Original object publication receipt

Version **9** deployed successfully at **13:43 UTC**, September 10, 2026. Source: `0baced0051dd677263677667dd29ae0fadfcdf61`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_12820f011d2c8191b871f12fc2c01b22`. Deployment: `appgdep_6aa2b3ee3b408191ae6dbd385bd17a40`. The existing owner-only URL and audience are unchanged. Only original CAD previews, geometry, and drawing are displayed; the generated object interpretations are removed. The established Site tab received the live URL handoff.

## Physical product showcase — September 10, 2026

- User supplied a lacrosse engineering drawing, the native SolidWorks part, and a moka pot assembly, requesting polished product images and scroll-based views.
- Created two studio interpretations with the built-in image tool, one per object. Preserved full-resolution PNGs and exact prompts in `output/product-images`; optimized site copies total approximately 121 KB. Public captions identify them as AI studio interpretations. Original previews and the lacrosse drawing accompany them.
- Extracted the original lacrosse saved display mesh: 67,692 vertices, 48,882 triangles. A reproducible standard-library Python script validates source CRC, descriptor channels, triangle strips, and normals before uniform normalization and rigid reorientation. Independent cadmpeg inspection agrees with the display-mesh totals. Inspected offline front/back/side/angled projections against the original drawing and CAD preview.
- Added an Objects gallery, a rebuilt lacrosse page, and `/work/moka-pot`. The lacrosse WebGL2 turntable supports scroll rotation, front/side/back/three-quarter views, manual rotation and tilt, pause, reduced-motion handling, near-viewport loading, a saved-preview fallback, and GPU cleanup. No game or Three.js dependency was reintroduced.
- The supplied Moka assembly refers to `MOKA Bottom.SLDPRT`, `MOKA Top.SLDPRT`, and `MOKA lid.SLDPRT`, which are not included and were not found locally. Its exact turntable is incomplete pending those parts or an assembled STEP/GLB export. Its still-image study is ready and contains no invented mesh.
- Typecheck, build, prerender, link/image/metadata checks, and mesh integrity checks pass: nine routes, 110 internal links, 41 image references, and all 48,882 CAD triangles. Main JavaScript is 214.28 KB (67.99 KB gzip), CSS 51.85 KB (11.05 KB gzip). The 2.21 MB geometry file loads only near the lacrosse viewer. No browser-interaction QA was performed in this pass; the Sites skill requires an explicit browser-testing request. Original geometry projections and generated product images were visually inspected outside the browser.
- Owner-only publication uses the existing Site and preserves its access policy. The expired automation remains paused. See `object-assets.md` for provenance, prompts, source limitations, and the Moka follow-up.

### Physical design publication receipt

Version **8** deployed successfully at **13:31 UTC**, September 10. Source: `a026c4922d09588b5a6fe56cc20e89d726c1e2c6`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_c9b581bc9ae0819197dc1665fde3e81b`. Deployment: `appgdep_6aa2b13d492c8191ab1121816c6e5d4c`. The existing owner-only URL is unchanged, and the browser handoff is queued in the established Site tab. The two product-image studies and lacrosse turntable are published. Moka rotation remains pending its external parts or an assembled export.

## Review window

Automation: `portfolio-craft-and-engineering-review`, attached to this task. Every five minutes through **2026-09-10 06:47 UTC / 02:47 AM Eastern**. The final eligible cycle should report and pause during the last five minutes. No edits after the deadline. An active turn should finish its coherent change before another review begins; inspect current task state and this log to avoid duplicate work.

Current direction: **AI Engineer · Human Factors**. The latest user steering supersedes the earlier designer-first positioning while preserving the OpenAI application context and all accuracy constraints. Keep the site restrained, specific, editorial, and professional. The user subsequently removed the game and requested a less preachy, project-led presentation. All game instructions below are historical and superseded. The review window has ended and the automation is paused.

## Direct user revision — September 10, 2026, after the review window

- User steering: remove Three.js entirely; take inspiration from Karolis Kosas, Matt Fredette, and Jastin Design; keep copy professional and cool; use an NFI image with charts or food samples.
- Paused the expired automation and revised its saved prompt to prohibit restoring the game. This pass is directly requested work, not an extension of the review window.
- Removed 46 unreachable game files, Three.js and its types, and the game-only Vitest dependency/config. Retired play URLs prerender the homepage; client recovery clears retired query parameters without discarding unrelated parameters or case-study paths. Updated the build checks for this behavior.
- Rebuilt the homepage around larger project previews and a concise sans-serif introduction. Removed the philosophy section and trimmed About/contact copy. Preserved real experience and project evidence.
- Captured the actual Sensory demo radar chart, intensity bars, and coconut cheddar prototype selector as `nfi-sensory-profile.png`. Used it on the homepage, case-study cover, and first walkthrough step. It remains labelled synthetic demonstration data.
- Typecheck, production build, and static validation pass: 8 pages, 97 internal links, 19 image references, résumé, metadata, sitemap, 404, and retired-route recovery. Production output contains one JS bundle (200.49 KB, 62.99 KB gzip); no Three.js chunks.
- Production browser checks pass at 320, 375, 768, 1024, and 1440 pixels on homepage and About: no horizontal overflow, broken images, canvas, or page errors. Six retired URL/query cases resolve correctly. At 375 pixels, the first NFI image begins at y=614, compared with y=837 in the prior layout.
- Interaction checks pass for all 8 routes at 320px, mobile navigation, all 3 walkthrough images/steps, modal Escape and focus return, and lazy-loaded personal imagery. Nineteen axe-core scans show no automated violations; contrast checks for occluded background content require manual review.
- Additional user request: Red Hat images. Located official OpenShift AI 2.25 workbench and deployment-size screenshots, confirmed the documentation’s CC BY-SA 3.0 license, and included unmodified images with visible credit and source/license links. They are explicitly product context rather than capstone designs. Original concept reconstruction moved into its relevant study section. No original capstone Figma link found in repository or supplied brief; optional link request sent to user.
- The user then supplied the final report, final presentation, and team notebook. Those primary sources supersede the interim documentation screenshots, which were removed. The case study now uses seven actual team artifacts, links both live Figma Make prototypes, and credits Josiah's UX Designer role alongside the other four team members.
- The report supports eight discovery interviews (5 without RHOAI experience, 3 with it), then a four-person concept test and five-person stakeholder review. The revised narrative follows the shift from AI-inferred causes to deterministic diagnostics, reviewable YAML, and editable presets. It distinguishes prototype validation from implementation and preserves newcomer testing as a next step.
- Generalized the NFI screen-tour component for a three-step Red Hat walkthrough without adding dependencies. Original journey-map and annotated first-iteration images replace missing-asset placeholders. All live screenshots are actual, unchanged prototype captures with simulated data; no fabricated product screens or performance results were added.
- Updated both résumé formats to the report's UX Designer title, team-based discovery, actual prototype features, and separate feedback rounds. Regenerated and visually inspected the one-page PDF.
- Final typecheck, build, and static validation pass: 8 pages, 98 internal links, 34 image references. Main JavaScript is 202.54 KB (63.85 KB gzip); CSS is 46.42 KB (9.93 KB gzip). No game bundles remain.
- Browser checks verify the new Red Hat images, both prototype links, all three tour states and previous/next boundaries, enlarged-image Escape dismissal and focus return at 320, 375, and 1440 pixels. No overflow, missing images, or runtime errors were detected. Fixed a missing space in the Red Hat heading when the decorative line break is hidden on mobile.
- The shared NFI tour and mobile navigation still pass, with all eight routes fitting at 320 pixels. Nineteen page/menu/tour/dialog axe scans and three additional Red Hat scans detected no violations. Existing incomplete contrast checks involve background content obscured by the menu or modal; these checks are not a full accessibility certification. Inspected desktop/mobile Red Hat screenshots and the one-page résumé.
- Evidence: `/tmp/portfolio-qa/redhat-primary-review.cjs`, `redhat-primary-results.json`, `redhat-primary-*.png`, `interaction-final.cjs`, and `accessibility-results.json`. Early QA-script errors came from a whitespace expectation and an attempt to scroll a hidden dialog image; corrected the checks to target visible figures and verify meaningful heading spacing.

### Project imagery and Red Hat publication receipt

Version **7** deployed successfully at **13:06 UTC** on September 10, with owner-only access verified before publication. Source: `5b1b62490f4a055399875861dd3c01b3bd78679d`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_b339f11f6b3481919b74571e523c14cc`. Deployment: `appgdep_6aa2ab5a8c0c8191bf6956614fe0d88e`. The existing private URL is unchanged. The original game removal, restrained homepage, chart-led NFI cover, actual Red Hat case study, and aligned résumé are published together. The expired automation remains paused.

## Initial research and implementation pass — September 10, 2026

### Completed

- Focused review of 13 scholarly publications plus W3C, performance guidance, and OpenAI’s role description. Comprehensive report: `docs/ui-ux-research.md`. Distinguishes empirical findings from art direction and notes source-access limits.
- Editorial homepage with serif typography, a restrained oxblood accent, project index, paired project descriptions and real imagery, and personal photography.
- Consistent AI Engineer positioning in the main page, shared profile, metadata, and one-page résumé. NFI uses the actual AI Product Engineer title. Contributions remain qualified by the documented AI-assisted implementation process.
- At-a-glance NFI and Red Hat summaries. Desktop section navigation follows reading position.
- NFI guided screen tour: three actual captured screens, manually controlled steps, explicit demo-data caption, and full-size inspection.
- NFI implementation section grounded in the public Sensory-Platform architecture documentation: React/TypeScript, Supabase, and tenant-scoped retrieval. No unsupported performance claims.
- Locally hosted, licensed fonts. Optional game remains a separate lazy-loaded bundle.
- Three.js postcard camera: actual canvas capture, PNG download, native modal, focus restoration, and clear portfolio return links.
- Game keyboard input ignores paused state; held inputs clear on blur/pause. Hidden tabs skip scene updates. Fixed stale résumé links inside the game.
- Graceful game loading/graphics failure fallback. Isolated prerender dependency cache from the dev server after finding a dynamic-module loading failure during local testing.

### Verified so far

- Typecheck passes; all 22 existing tests pass.
- Build and static checker passed before the final small implementation/fallback additions: eight prerendered pages, 101 internal links, 19 image references. Repeat once after final source changes before publishing.
- Homepage fits 320, 375, 430, 768, 1024, and 1440 CSS pixels with no horizontal document overflow.
- Walkthrough changes actual screen/source and copy; previous/next disable at ends. Image enlargement opens, closes, unlocks body scrolling, and restores trigger focus.
- Game starts after fresh dependency optimization. Postcard contains real PNG data, is centered on desktop, closes with focus restoration, and game controls fit a 320-pixel viewport.
- Updated résumé rendered and visually inspected; one page, no clipping.

### Next review priorities

1. Validate final production build and fresh browser routes, narrow case-study layouts, and active section navigation. Verify console logs from the current navigation, excluding earlier resolved dev-cache errors.
2. Inspect mobile first-scroll composition. Ensure actual work appears promptly without excessive metadata or duplicated summaries.
3. Review NFI walkthrough pacing and whether a fourth report-review step adds useful insight. Do not call screen switching a live application demo.
4. Review game postcard behavior with keyboard, mobile, and repeated open/close. Check graphics fallback and optional-route resource separation. Any added game feature needs a clear benefit and an unobtrusive exit.
5. Add original Red Hat Figma/research artifacts only when available. NFI participant count, protocol, improvement log, and matched before/after remain unavailable. Do not invent them or remove the provenance qualifiers.
6. Evaluate whether more imagery is actually necessary; existing real NFI demo and CAD/lacrosse assets are preferred. A web-focused independent case study is still a possible later addition, not completed work.

### Important constraints for subsequent cycles

- Repo `/Users/josiahdegrasse/Documents/ChatGPT/portfolio`, branch `codex/design-portfolio`. GitHub origin main has not been modified. Sites source is a separate remote.
- Reuse project `appgprj_6aa20d64b7988191b321490d2049b49f`; current site is owner-only. Do not create another Site or widen access. All Sites URLs are production URLs; follow hosting skill and existing authorization.
- `npm run build` must precede static checks; prerender must start from Vite’s blank-root template, not previously rendered HTML. Both clean-route HTML forms are intentional.
- Read `docs/asset-checklist.md` for evidence provenance. Demo sample counts are not usability participant counts.
- Preserve original 3D assets/history and actual professional facts. Do not manufacture project outcomes, credentials, or engineering ownership.
- Native browser QA is through CUA, reusing tab provider ID `613f29f4-2258-4c68-b1ce-d7c224caa668` where available.
- Keep improvements bounded and update this log with actual findings. No speculative praise or “perfect” claims. Do not run repeated unchanged test suites without a new concern.

### Final verification for this pass

The final source passes TypeScript and production build checks. The static checker validates 8 prerendered routes, 101 internal links, and 19 image references, plus résumé, metadata, sitemap, and 404. All 22 existing tests passed during the implementation pass. All eight main pages fit 320 pixels; the homepage additionally passed 375/430/768/1024/1440 widths. Production direct loading of `/work/nfi#walkthrough` settles at the correct anchor with active navigation and no new console warnings/errors. The mobile menu, walkthrough controls, image dialog, and game postcard were exercised in the browser. Core text/background contrast pairs range from 5.14:1 to 14.55:1. These checks do not constitute a complete WCAG audit, a real-user usability study, or Core Web Vitals field measurements.

The share image is now a real 1200×630 homepage capture. New screenshot and browser-check evidence is in `/tmp/portfolio-qa/research-*`. Added `.gitattributes` to treat PDFs/images/fonts as binary; PDF xref padding must not be edited as source whitespace. Final source work is ready to commit and privately publish as the next Sites version. Subsequent cycles should verify the actual deployment before changing it, and start from the evidence priorities above.

### Publication receipt

Version **2** deployed successfully at **2026-09-10 03:10 UTC** to the existing owner-only site: https://josiah-design-portfolio.henrydegrasse.chatgpt.site. Published implementation commit: `cf082780df29aab2b6a053d357ea7b9941e125b3`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_cc73ffdcaea481919d09b3b88c2833db`. Deployment: `appgdep_6aa21f9458d08191927c7afdf63940cb`. Site display title updated to “Josiah deGrasse — AI Engineer · Human Factors.” The review window remains active; inspect this publication before starting the next bounded improvement.

## Mobile project reading order — 03:12–03:19 UTC

- Measured the published homepage at 375 × 900: the first NFI image begins at approximately 1,162 pixels from the document top; the project begins at 670 pixels. The title is followed by substantial copy before the actual artifact appears.
- Prepared a bounded change in `src/design-home.tsx` and `src/design-editorial.css`: project title, media, then supporting copy in the document and mobile layout. The desktop grid keeps title/copy beside the media. Tablet spacing rules were adjusted for the new grid.
- TypeScript, production build, and whitespace checks pass. The static checker validates the eight prerendered pages, internal links, image paths, metadata, résumé, sitemap, and 404.
- **Pending visual verification; not published.** The Mac locked before the updated preview could be inspected; CUA reported that automatic unlock failed and requires the user to unlock it. No after-change position or responsive visual result has been claimed. The live site remains version 2.
- Next cycle: check whether browser access is restored. Reuse the existing preview tab; verify project order, appearance, first-image position, and document overflow at 320/375/430/768/1024/1440 pixels. Publish only after that review. If still locked, avoid repeating the same user notification; independent source or evidence work may continue. Do not create additional unreviewed visual changes.

### Review resumed with a separate local test browser — 03:34–03:38 UTC

- The signed-in desktop browser remains unavailable while the Mac is locked. The bundled Playwright library can run a fresh, headless Chromium process against the local development server without accessing the user's browser profile or unlocking the desktop. Installed its headless browser runtime in the standard Playwright cache; project dependencies and lockfile are unchanged.
- The prepared layout passes browser checks at 320/375/430/768/1024/1440 pixels: no horizontal document overflow, no broken images or uncaught runtime errors, and correct title/media/copy order. Desktop title/copy remain beside the media without overlap. Loaded lazy images before capturing full-page screenshots.
- At 375 × 900 the first NFI image starts at 837 pixels, approximately 325 pixels earlier than the published baseline of 1,162 pixels. This is a layout measurement, not a user-performance result.
- Inspected the mobile first screen and mobile/tablet/desktop full-page screenshots. The project artifact arrives earlier, evidence captions stay attached, and supporting copy remains readable. Local visual verification is complete; the change is ready for private publication.
- Evidence: `/tmp/portfolio-qa/mobile-order-results.json`, `/tmp/portfolio-qa/mobile-order-*.png`, and `/tmp/portfolio-qa/mobile-order-review.cjs`. Future local UI checks may use this isolated test browser while the desktop is locked. Signed-in production UI checks still require the normal browser. Do not access or copy the user's browser profile.

### Mobile layout publication receipt

Version **3** deployed successfully at **03:38 UTC**, preserving owner-only access at the existing URL. Published source: `11d2471884ffeb128f668d7bfd8380dea45e501f`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_0603a61b2f4081919c7a585c764d0ff4`. Deployment: `appgdep_6aa226352f248191bba25f8605cc8fc0`. The normal browser handoff was skipped for this background cycle while the desktop is locked; local visual checks and terminal deployment success are verified. The pending mobile change is now complete. Next priorities are walkthrough usefulness and game keyboard/repeated-dialog behavior, using a fresh local test browser if needed. Avoid repeating completed layout checks without a new change or concern.

## Game postcard keyboard and mobile review — 03:39 UTC

- Reproduced a keyboard bug in the local browser: Space on the focused Postcard button triggered the game's global jump handling and prevented native button activation. The game now respects already-handled key events and ignores keyboard input originating from buttons, links, form fields, and editable content.
- Repeatedly opened the real postcard using Enter and Space, closed it with Escape and its Close button, and checked focus restoration. Escape closes the postcard without opening the game pause menu. Tab reaches Save next; the Pause button also works with Space. Returning to the main portfolio succeeds.
- Captured and downloaded an actual PNG, checking its file signature and dimensions. Desktop and 320-pixel camera captures are valid and the browser reports no uncaught runtime errors.
- The initial 320-pixel screenshot exposed a tall image pushing Save below the visible dialog. Capped the mobile preview height, preserved the whole image with letterboxing, and separated its caption from Save. Both controls fit without scrolling at 320 × 900 and 320 × 568. Inspected the resulting screenshots.
- Corrected a CSS specificity issue that allowed the game's yellow focus ring to override the darker postcard focus color on its pale background. Verified the computed focus outline and visible screenshot.
- TypeScript, all 22 existing tests, the production build, whitespace checks, and the static checker pass. No new main-page feature or factual claim was added.
- Evidence: `/tmp/portfolio-qa/game-keyboard-review.cjs`, `game-keyboard-results.json`, `game-postcard-keyboard-*.png`, and `game-downloaded-postcard.png`. These are local headless browser checks, not a full cross-browser or hardware gamepad audit.

### Game controls publication receipt

Version **4** deployed successfully at **03:48 UTC**, with owner-only access verified before publication. Source: `8ae41e6ac856b395c017ef3500ccc4741b24e7e3`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_70b7207481688191adb92ee908699157`. Deployment: `appgdep_6aa22888ddc0819187a256b1cba42d01`. Background browser handoff skipped; the existing private URL is unchanged. The local server is stopped after publication. Next bounded review should assess the NFI walkthrough's explanatory value before adding more screens or imagery; the camera's tested keyboard/mobile issues are resolved.

## NFI walkthrough narrative review — 03:49 UTC

- Compared the four available real NFI screens. The overview already appears elsewhere in the case study; report review adds a distinct question about approval and release conditions. Kept the tour to three steps: compare evidence, review the decision, check release readiness.
- Replaced generic descriptions with details visible in the captured interface: selected prototype, liking score, response count, evidence status, the missing instrument-QC caveat, review status, disabled approval, and outstanding checks. The report screenshot visibly contains evidence and calculation issues; the copy describes that state without claiming those issues were resolved or that the example was an intentional fault-injection test.
- Captions now explicitly identify separate synthetic demo states whose values differ. They are not presented as a single live session, usability participant counts, or measured project impact. Reused existing assets without creating new product imagery.
- Shortened the first explanation and reserved consistent copy height to avoid moving the image and controls as steps change. Step numbers align at the top on narrow screens.
- Verified all three steps at 320/375/768/1440 pixels: selected-state labels, correct real images, previous/next boundaries, direct step selection, full-size viewing, Escape dismissal, focus return, restored scrolling, and no document overflow or uncaught errors. Inspected desktop and mobile screenshots and checked that mobile navigation is unobscured. TypeScript, production build, static-site validation, and whitespace checks pass. The unchanged game test suite was not rerun in this copy/layout pass.
- Evidence: `/tmp/portfolio-qa/walkthrough-review.cjs`, `walkthrough-review-results*.json`, `walkthrough-release-*.png`, and `walkthrough-mobile-controls.png`. A close-event timing race in the first test assertion was corrected by waiting for the native dialog close handler; it was not recorded as a product defect.

### Walkthrough publication receipt

Version **5** deployed successfully at **03:59 UTC**, preserving verified owner-only access. Source: `7099589c40fd113fb01e85b7b39a0fc6f012d6ba`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_0490ec16794c8191bf7d5d7a74036830`. Deployment: `appgdep_6aa22af6433081919500929eb4ee8066`. Background browser handoff skipped and local server stopped. The tour is complete. Further imagery or extra tour steps should require a specific explanatory gap; do not add them just to fill the review window. A useful next pass is an accessibility/content audit of the existing pages, rather than another visual redesign.

## Accessibility and enlarged-image review — 04:00 UTC

- Used axe-core 4.13.0 in a fresh local Chromium test browser. Its temporary installation is under `/tmp/portfolio-accessibility-check`; project dependencies and lockfile are unchanged. Scanned all eight main routes at 1440 and 375 pixels, plus the mobile menu, final walkthrough step, and open image dialog: 19 states.
- Found and fixed a serious `scrollable-region-focusable` issue in the shared image viewer. The enlarged-image scroll region now has a keyboard stop and accessible name. Actual Tab, ArrowRight, ArrowDown, and Escape interactions verify panning, dismissal, restored body scrolling, and focus return.
- Two generic divs had labels without a supporting role. Added group semantics for the NFI evidence-source list and walkthrough controls; the labels now have a defined accessible context.
- Visual inspection also found the viewer positioned at the top-left and its content vulnerable to overflowing a short screen. Restored modal centering, let the image region shrink while the caption remains visible, and increased the Close target to 44 pixels. Verified centered bounds, visible captions, focus outlines, and keyboard behavior at 320 × 568, 375 × 900, and 1440 × 900.
- The 19-state scan has no detected violations after the semantic fixes. Three additional scans of the final modal layout also detect no violations. Contrast checks for four pieces of background content obscured by the open mobile menu remain incomplete; one short-screen modal contrast check also remains incomplete. Visible controls/text and layout were inspected. Automated checks and these keyboard tests do not establish full WCAG conformance or substitute for screen-reader testing.
- TypeScript, production build, static-site validation, and whitespace checks pass. The unchanged game tests were not rerun. Evidence: `/tmp/portfolio-qa/accessibility-results.json`, `accessibility-review.cjs`, `image-viewer-review.cjs`, `image-viewer-results.json`, and `image-viewer-*.png`.

### Accessibility publication receipt

Version **6** deployed successfully at **04:11 UTC**, preserving verified owner-only access. Source: `bcae7ba819e20ab22892e8478f70c3e90963a211`. Saved version: `appgprj_6aa20d64b7988191b321490d2049b49f~appgver_ba8623dbb11c8191ba98dad50145082a`. Deployment: `appgdep_6aa22ddfd218819183af631e8c0c72f7`. Background browser handoff skipped; local server stopped after publication. Next review may inspect actual page resource loading and the optional game's discoverability. Avoid rerunning the complete accessibility scan without a new concern; its remaining manual-review limitations are documented above.

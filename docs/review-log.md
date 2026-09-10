# Portfolio review log

## Review window

Automation: `portfolio-craft-and-engineering-review`, attached to this task. Every five minutes through **2026-09-10 06:47 UTC / 02:47 AM Eastern**. The final eligible cycle should report and pause during the last five minutes. No edits after the deadline. An active turn should finish its coherent change before another review begins; inspect current task state and this log to avoid duplicate work.

Current direction: **AI Engineer · Human Factors**. The latest user steering supersedes the earlier designer-first positioning while preserving the OpenAI application context and all accuracy constraints. Keep the site restrained, specific, editorial, and professional. Play remains optional at `/play`.

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

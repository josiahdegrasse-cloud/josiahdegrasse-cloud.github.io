# Physical design showcase

## Current selection

The Moka project, route, and published preview were removed at Josiah's request on September 14, 2026. The lacrosse head now has a dedicated feature layout on the homepage. Original files in Downloads remain untouched; Moka provenance below is historical, not pending work.

## Original designs only

Josiah explicitly requested the actual lacrosse head and moka pot, without remaking them. The AI studio interpretations and their prompt files have been removed from the current checkout and publication. Their prior existence is recorded in Git history only. Do not generate replacement product images or approximate the geometry.

The homepage uses the original lacrosse mesh in a compact scroll-controlled viewer. The lacrosse loading/error fallback uses its native PreviewPNG unchanged at its actual 640×480 aspect ratio. The lacrosse page leads with the saved model geometry and its original Nylon 101 base color (RGB 0.79607844, 0.8235294, 0.9372549), read from the native appearance records. Display lighting is provided by the viewer.

## Original CAD material

- `public/images/objects/lacrosse-source.png`: unchanged PreviewPNG extracted from the supplied SolidWorks file, 640×480.
- `public/images/objects/lacrosse-drawing.png`: the supplied one-page PDF rendered at 2400×1698.
- `public/drawings/lacrosse-head.pdf`: unchanged supplied drawing. Its title block identifies Josiah deGrasse and Shooter Head v9, with nylon specified. Dimension labels and the title-block unit statement are not restated as verified measurements because their scale is ambiguous.
- `public/models/lacrosse-head.mesh`: saved SolidWorks DisplayLists geometry, 67,692 vertices and 48,882 triangles. The source positions and normals undergo only a rigid reorientation, centering, uniform normalization, and float32 serialization. It is a display mesh, not a watertight manufacturing export or a new reconstructed design.

`scripts/extract-cad-display.py` reproduces the lacrosse display asset directly from the supplied SLDPRT using the Python standard library. It validates compressed-stream lengths/CRC and descriptor structure, preserves strip winding, and performs no network operations. The source files are never edited.

Format references: [cadmpeg](https://github.com/cadmpeg/cadmpeg), its [SolidWorks format specification](https://github.com/cadmpeg/cadmpeg/blob/main/docs/formats/sldprt.md) (CC BY 4.0), and its tessellation implementation (Apache 2.0). Initial independent inspection used [SWFormat](https://github.com/KenM76/swformat) (Apache 2.0) and cadmpeg v0.6.0. No vendor CAD files or these tooling packages are deployed.

The lacrosse parser output matches cadmpeg's display-mesh vertex and triangle totals. The broader CAD decoder reports incomplete B-rep semantics and some unresolved face/body ownership; the viewer uses the actual standalone display geometry and does not infer those missing relationships. Front, back, side, and angled offline projections were compared with the original preview and drawing. The viewer is a presentation of saved geometry, not geometry validation for fabrication.

## Historical Moka source limitation

The supplied assembly references three external parts, which were not included or found locally:

- `MOKA Bottom.SLDPRT`
- `MOKA Top.SLDPRT`
- `MOKA lid.SLDPRT`

It contains the saved preview, part placements and bounds, but no complete supported standalone mesh. The retired Moka page used only the original assembly view. A future exact 360-degree view would require these parts or an assembled STEP/GLB export. Do not substitute invented geometry or a rotating flat image and call it the original model.

## Interaction

The lacrosse page has a native WebGL2 turntable with a passive scroll listener, manual front/side/back/three-quarter buttons, rotation and tilt sliders, and a scroll-motion toggle. It draws on demand rather than running a continuous animation loop. It loads the mesh only near the viewport, limits pixel ratio to 2, releases GPU resources on unmount, and keeps an original-preview fallback when rendering is unavailable. Reduced-motion preferences disable automatic rotation and sticky scroll height while retaining manual controls. Short-height screens use normal document flow so controls remain reachable. The game remains removed; no Three.js dependency was restored.

The homepage viewer rotates one complete turn over the card’s passage through the viewport, without sticky positioning or extra scroll height. The homepage viewer uses a white background with no visible rotation bar or other controls. Reduced-motion preferences keep the object still. The dedicated lacrosse page retains its existing scroll sequence and full angle controls.

## Field photo — September 15, 2026

Josiah supplied `IMG_6689.HEIC`. Converted to a browser-compatible JPEG with orientation applied, longest edge 1800px, and metadata removed; no retouching. `public/images/lacrosse/lacrosse-field-photo.jpg` appears beside the homepage model and in the lacrosse case study. The photo adds playing context; it is not described as proof of fabrication or testing of the CAD design.

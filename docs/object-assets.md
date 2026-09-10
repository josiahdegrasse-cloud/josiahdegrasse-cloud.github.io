# Physical design showcase

## Studio images

Created with the built-in image-generation tool, one request per object. Each image is an AI studio interpretation of Josiah's supplied CAD work. They are not photographs of manufactured products or exact CAD renders. Captions in the portfolio make this distinction; the original geometry and reference material are shown separately.

| Object        | Original PNG                                | Website image                                | Exact prompt                                |
| ------------- | ------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| Lacrosse head | `output/product-images/lacrosse-studio.png` | `public/images/objects/lacrosse-studio.webp` | `output/product-images/lacrosse-prompt.txt` |
| Moka pot      | `output/product-images/moka-studio.png`     | `public/images/objects/moka-studio.webp`     | `output/product-images/moka-prompt.txt`     |

Both originals are 1536×1024. WebP copies preserve dimensions and use quality 88 compression, reducing page assets to approximately 42 KB and 79 KB. Original PNGs remain available in the workspace and are excluded from the deployed static output.

Lacrosse reference: Josiah's five-view `Lacrosse head.pdf`. Generated hole spacing, strut junctions, and socket-rim details vary from the model. Moka reference: the actual saved 640×480 preview extracted from `MOKA POT.SLDASM`. The generated aluminum finish, handle thickness, attachments, and small seam details are illustrative. No generated dimensions or performance claims are used.

## Original CAD material

- `public/images/objects/lacrosse-source.png` and `moka-source.png`: unchanged PreviewPNG streams extracted from the supplied SolidWorks files, 640×480.
- `public/images/objects/lacrosse-drawing.png`: the supplied one-page PDF rendered at 2400×1698.
- `public/drawings/lacrosse-head.pdf`: unchanged supplied drawing. Its title block identifies Josiah deGrasse and Shooter Head v9, with nylon specified. Dimension labels and the title-block unit statement are not restated as verified measurements because their scale is ambiguous.
- `public/models/lacrosse-head.mesh`: saved SolidWorks DisplayLists geometry, 67,692 vertices and 48,882 triangles. The source positions and normals undergo only a rigid reorientation, centering, uniform normalization, and float32 serialization. It is a display mesh, not a watertight manufacturing export or a new reconstructed design.

`scripts/extract-cad-display.py` reproduces the lacrosse display asset directly from the supplied SLDPRT using the Python standard library. It validates compressed-stream lengths/CRC and descriptor structure, preserves strip winding, and performs no network operations. The source files are never edited.

Format references: [cadmpeg](https://github.com/cadmpeg/cadmpeg), its [SolidWorks format specification](https://github.com/cadmpeg/cadmpeg/blob/main/docs/formats/sldprt.md) (CC BY 4.0), and its tessellation implementation (Apache 2.0). Initial independent inspection used [SWFormat](https://github.com/KenM76/swformat) (Apache 2.0) and cadmpeg v0.6.0. No vendor CAD files or these tooling packages are deployed.

The lacrosse parser output matches cadmpeg's display-mesh vertex and triangle totals. The broader CAD decoder reports incomplete B-rep semantics and some unresolved face/body ownership; the viewer uses the actual standalone display geometry and does not infer those missing relationships. Front, back, side, and angled offline projections were compared with the original preview and drawing. The viewer is a presentation of saved geometry, not geometry validation for fabrication.

## Moka rotation limitation

The supplied assembly references three external parts, which were not included or found locally:

- `MOKA Bottom.SLDPRT`
- `MOKA Top.SLDPRT`
- `MOKA lid.SLDPRT`

It contains the saved preview, part placements and bounds, but no complete supported standalone mesh. The public Moka page therefore uses studio imagery and the original assembly view. Its exact 360-degree view remains dependent on these parts or an assembled STEP/GLB export. Do not substitute invented geometry or a rotating flat image and call it the original model.

## Interaction

The lacrosse page has a native WebGL2 turntable with a passive scroll listener, manual front/side/back/three-quarter buttons, rotation and tilt sliders, and a scroll-motion toggle. It draws on demand rather than running a continuous animation loop. It loads the mesh only near the viewport, limits pixel ratio to 2, releases GPU resources on unmount, and keeps an original-preview fallback when rendering is unavailable. Reduced-motion preferences disable automatic rotation and sticky scroll height while retaining manual controls. Short-height screens use normal document flow so controls remain reachable. The game remains removed; no Three.js dependency was restored.

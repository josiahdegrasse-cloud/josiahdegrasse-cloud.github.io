import { sitePath } from "./site-path";
import {
  Layout,
  ArrowLeft,
  ArrowUpRight,
  ImageFigure,
  NextProject,
} from "./design-components";
import { CadTurntable } from "./cad-turntable";
import "./objects.css";

export const objects = [
  {
    id: "lacrosse",
    name: "Lacrosse head",
    number: "01",
    detail: "Nylon / Form & construction",
    image: "/images/objects/lacrosse-source.png",
    alt: "Original saved SolidWorks view of my lacrosse head, showing its scoop, stringing holes, and sidewall structure.",
  },
  {
    id: "moka-pot",
    name: "Moka pot",
    number: "02",
    detail: "SolidWorks / Assembly study",
    image: "/images/objects/moka-source.png",
    alt: "Original saved SolidWorks view of my moka pot assembly, including its faceted chambers, lid, and handle.",
  },
];

export function ObjectGallery() {
  return (
    <section className="object-gallery" aria-labelledby="objects-heading">
      <div className="work-heading">
        <h2 id="objects-heading">Objects</h2>
        <span className="folio">Form, material & making</span>
      </div>
      <div className="object-gallery-grid">
        {objects.map((object) => (
          <article className="object-card" key={object.id}>
            {object.id === "lacrosse" ? (
              <CadTurntable compact />
            ) : (
              <a
                href={sitePath(`/work/${object.id}`)}
                className="object-card-image"
              >
                <img
                  src={sitePath(object.image)}
                  alt={object.alt}
                  width={640}
                  height={480}
                  loading="lazy"
                />
                <span aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
              </a>
            )}
            <a
              className="object-card-title"
              href={sitePath(`/work/${object.id}`)}
            >
              <h3>{object.name}</h3>
              <ArrowUpRight size={22} />
            </a>
            <p>{object.detail}</p>
          </article>
        ))}
      </div>
      <p className="object-gallery-credit">
        Original SolidWorks models and drawings.
      </p>
    </section>
  );
}

export function ObjectCaseStudy({ id }: { id: "lacrosse" | "moka-pot" }) {
  const lacrosse = id === "lacrosse";
  const object = objects[lacrosse ? 0 : 1];
  return (
    <Layout>
      <article className="container object-case">
        <a className="back-link" href={sitePath("/#objects-heading")}>
          <ArrowLeft size={16} /> All work
        </a>
        <header className="object-hero">
          <p className="eyebrow">Objects / {object.number}</p>
          <div>
            <h1>{object.name}</h1>
            <p>
              {lacrosse
                ? "A nylon head study, shaped by years on the field. Modeled in SolidWorks, from the scoop to the sidewall structure."
                : "A study in facets, proportion, and assembly. A familiar everyday object, modeled in SolidWorks."}
            </p>
          </div>
          <span className="folio">{object.detail}</span>
        </header>
        {lacrosse ? (
          <CadTurntable />
        ) : (
          <div className="object-original-preview">
            <ImageFigure
              src={sitePath(object.image)}
              alt={object.alt}
              width={640}
              height={480}
              priority
              caption="Original saved SolidWorks assembly view. Transparent surfaces are part of the saved CAD display."
            />
          </div>
        )}
        <section className="object-notes" aria-label="Design details">
          {(lacrosse
            ? [
                [
                  "01 / Scoop",
                  "A broad opening.",
                  "The curved scoop meets a narrower throat, with stringing holes following the rim.",
                ],
                [
                  "02 / Sidewall",
                  "Structure in the open.",
                  "Diagonal ribs connect the sidewall rails. The side view makes the depth and changing profile clear.",
                ],
                [
                  "03 / Material",
                  "Designed around nylon.",
                  "The drawing specifies nylon. This is a CAD study; the drawing and saved model document its form.",
                ],
              ]
            : [
                [
                  "01 / Body",
                  "Facets, repeated.",
                  "The upper chamber and lower reservoir share a polygonal form, with a narrower connection between them.",
                ],
                [
                  "02 / Assembly",
                  "Three main parts.",
                  "The assembly brings together the lower body, upper body, and lid.",
                ],
                [
                  "03 / Detail",
                  "A line to hold.",
                  "The handle follows an angular curve beside the chamber. A small central knob finishes the lid.",
                ],
              ]
          ).map(([label, title, body]) => (
            <div key={label}>
              <p className="eyebrow">{label}</p>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </section>
        {lacrosse && (
          <section className="object-source" aria-labelledby="source-title">
            <div className="object-source-heading">
              <p className="eyebrow">From the model</p>
              <h2 id="source-title">The drawing behind the form.</h2>
              <p>
                Isometric, front, side, top, and bottom views from my Shooter
                Head v9 drawing.
              </p>
              <a
                className="text-link"
                href={sitePath("/drawings/lacrosse-head.pdf")}
                target="_blank"
                rel="noreferrer"
              >
                Open the drawing <ArrowUpRight size={18} />
              </a>
            </div>
            <ImageFigure
              src={sitePath("/images/objects/lacrosse-drawing.png")}
              width={2400}
              height={1698}
              alt="Josiah deGrasse’s original Shooter Head v9 engineering drawing showing five views."
              caption="Original drawing · Shooter Head v9 · Josiah deGrasse"
            />
          </section>
        )}
        <NextProject
          href={lacrosse ? "/work/moka-pot" : "/work/lacrosse"}
          title={lacrosse ? "Moka pot" : "Lacrosse head"}
        />
      </article>
    </Layout>
  );
}

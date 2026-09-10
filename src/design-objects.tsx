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
    image: "/images/objects/lacrosse-studio.webp",
    alt: "Studio visualization of an unstrung ivory lacrosse head with diagonal sidewall supports.",
  },
  {
    id: "moka-pot",
    name: "Moka pot",
    number: "02",
    detail: "SolidWorks / Assembly study",
    image: "/images/objects/moka-studio.webp",
    alt: "Studio visualization of a faceted metal moka pot with an angular handle.",
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
          <a
            className="object-card"
            href={`/work/${object.id}`}
            key={object.id}
          >
            <div className="object-card-image">
              <img
                src={object.image}
                alt={object.alt}
                width={1536}
                height={1024}
                loading="lazy"
              />
              <span aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </div>
            <div className="object-card-title">
              <h3>{object.name}</h3>
              <span className="folio">{object.number}</span>
            </div>
            <p>{object.detail}</p>
          </a>
        ))}
      </div>
      <p className="object-gallery-credit">
        AI studio interpretations of my CAD studies. Original geometry and
        source views inside.
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
        <a className="back-link" href="/#objects-heading">
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
        <figure className="object-studio">
          <img
            src={object.image}
            alt={object.alt}
            width={1536}
            height={1024}
            loading="eager"
          />
          <figcaption>
            AI studio interpretation of my CAD study. Lighting, finish, and
            small details are illustrative.
          </figcaption>
        </figure>
        {lacrosse && <CadTurntable />}
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
        <section className="object-source" aria-labelledby="source-title">
          <div className="object-source-heading">
            <p className="eyebrow">From the model</p>
            <h2 id="source-title">
              {lacrosse
                ? "The drawing behind the form."
                : "The original assembly."}
            </h2>
            <p>
              {lacrosse
                ? "Isometric, front, side, top, and bottom views from my Shooter Head v9 drawing."
                : "The saved SolidWorks view shows the assembled form and internal center column. Transparent surfaces belong to the CAD display."}
            </p>
            {lacrosse && (
              <a
                className="text-link"
                href="/drawings/lacrosse-head.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Open the drawing <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          <ImageFigure
            src={
              lacrosse
                ? "/images/objects/lacrosse-drawing.png"
                : "/images/objects/moka-source.png"
            }
            width={lacrosse ? 2400 : 640}
            height={lacrosse ? 1698 : 480}
            alt={
              lacrosse
                ? "Josiah deGrasse’s original Shooter Head v9 engineering drawing showing five views."
                : "Original preview extracted from Josiah’s SolidWorks moka pot assembly."
            }
            caption={
              lacrosse
                ? "Original drawing · Shooter Head v9 · Josiah deGrasse"
                : "Original saved assembly preview · SolidWorks"
            }
          />
        </section>
        <NextProject
          href={lacrosse ? "/work/moka-pot" : "/work/lacrosse"}
          title={lacrosse ? "Moka pot" : "Lacrosse head"}
        />
      </article>
    </Layout>
  );
}

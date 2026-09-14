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

export function ObjectGallery() {
  return (
    <section className="object-gallery" aria-labelledby="objects-heading">
      <div className="work-heading">
        <h2 id="objects-heading">Physical design</h2>
        <span className="folio">SolidWorks / Nylon</span>
      </div>
      <article className="object-card">
        <CadTurntable compact />
        <div className="object-card-copy">
          <a className="object-card-title" href={sitePath("/work/lacrosse")}>
            <h3>Lacrosse head</h3>
            <ArrowUpRight size={22} />
          </a>
          <p>
            A nylon head study, shaped by years on the field. Modeled in
            SolidWorks, from the scoop to the sidewall structure.
          </p>
          <p className="object-gallery-credit">
            Original CAD model and drawing.
          </p>
        </div>
      </article>
    </section>
  );
}

export function ObjectCaseStudy() {
  return (
    <Layout>
      <article className="container object-case">
        <a className="back-link" href={sitePath("/#objects-heading")}>
          <ArrowLeft size={16} /> All work
        </a>
        <header className="object-hero">
          <p className="eyebrow">Physical design</p>
          <div>
            <h1>Lacrosse head</h1>
            <p>
              A nylon head study, shaped by years on the field. Modeled in
              SolidWorks, from the scoop to the sidewall structure.
            </p>
          </div>
          <span className="folio">Nylon / Form & construction</span>
        </header>
        <CadTurntable />
        <section className="object-notes" aria-label="Design details">
          {[
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
          ].map(([label, title, body]) => (
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
            <h2 id="source-title">The drawing behind the form.</h2>
            <p>
              Isometric, front, side, top, and bottom views from my Shooter Head
              v9 drawing.
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
        <NextProject href="/work/helfrich" title="Helfrich Brothers" />
      </article>
    </Layout>
  );
}

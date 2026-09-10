import {
  Layout,
  SectionLabel,
  ArrowDown,
  ArrowUpRight,
  ConceptComparison,
} from "./design-components";
import { selectedWork, secondaryWork } from "./design-content";

export function DesignHome() {
  return (
    <Layout>
      <div className="container editorial-home">
        <section className="catalogue-hero" aria-labelledby="home-title">
          <div className="catalogue-kicker">
            <p className="eyebrow">AI Engineer · Human Factors</p>
            <span className="folio">Selected portfolio / 2026</span>
          </div>
          <div className="catalogue-hero-body">
            <h1 id="home-title">
              AI, built for
              <br />
              <em>human judgment.</em>
            </h1>
            <div className="catalogue-intro">
              <p>
                I build AI-assisted products that connect evidence, explain
                decisions, and keep people in control.
              </p>
              <p className="intro-credit">
                Josiah deGrasse
                <br />
                Human Factors, Tufts University
              </p>
            </div>
          </div>
          <div className="catalogue-hero-bottom">
            <a className="text-link" href="#work">
              Explore the work <ArrowDown size={18} />
            </a>
            <nav className="work-index" aria-label="Featured projects">
              <a href="/work/nfi">
                <span>01</span> New Food Innovation <ArrowUpRight size={16} />
              </a>
              <a href="/work/red-hat">
                <span>02</span> Red Hat OpenShift AI <ArrowUpRight size={16} />
              </a>
            </nav>
          </div>
        </section>
        <section
          id="work"
          className="catalogue-work"
          aria-labelledby="selected-heading"
        >
          <div className="catalogue-section-title">
            <h2 id="selected-heading">Selected work</h2>
            <span className="folio">
              Two studies in making complexity useful
            </span>
          </div>
          {selectedWork.map((project) => (
            <article
              className={`catalogue-project catalogue-${project.id}`}
              key={project.id}
            >
              <div className="catalogue-project-top">
                <span className="folio">
                  {project.number} / {project.category}
                </span>
                <span className="folio">{project.year}</span>
              </div>
              <div className="catalogue-project-body">
                <div className="catalogue-project-copy">
                  <h3>
                    <a href={`/work/${project.id}`}>{project.title}</a>
                  </h3>
                  <p className="catalogue-subtitle">{project.subtitle}</p>
                  <p>{project.description}</p>
                  <dl className="project-evidence">
                    <div>
                      <dt>
                        {project.id === "nfi"
                          ? "Engineering focus"
                          : "Research basis"}
                      </dt>
                      <dd>
                        {project.id === "nfi"
                          ? "Connected evidence. Explicit decisions. Human review."
                          : "8 interviews. 3 validated opportunities. 2 concepts."}
                      </dd>
                    </div>
                  </dl>
                  <a className="text-link" href={`/work/${project.id}`}>
                    Read the case study <ArrowUpRight size={18} />
                  </a>
                </div>
                <div className="catalogue-project-media">
                  <a
                    className="project-visual-link"
                    href={`/work/${project.id}`}
                    aria-label={`View ${project.title} case study`}
                  >
                    {project.image ? (
                      <div className="catalogue-nfi-cover">
                        <div className="catalogue-cover-label">
                          <span>NFI / Sensory Platform</span>
                          <span>Decision review</span>
                        </div>
                        <img
                          src={project.image}
                          alt={project.alt}
                          width={1280}
                          height={720}
                          loading="eager"
                          decoding="async"
                        />
                        <div className="catalogue-cover-bottom">
                          <span>From evidence to a decision.</span>
                          <ArrowUpRight size={22} />
                        </div>
                      </div>
                    ) : (
                      <ConceptComparison compact />
                    )}
                  </a>
                  <p className="catalogue-caption">
                    <span>Fig. {project.number}</span>
                    {project.id === "nfi"
                      ? "Actual product interface. Demonstration data."
                      : "Reconstructed concept comparison. Original Figma artifacts pending."}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
        <section className="practice-note" aria-labelledby="practice-heading">
          <p className="eyebrow">A point of view</p>
          <h2 id="practice-heading">
            The interface should make
            <br />
            <em>the thinking visible.</em>
          </h2>
          <div className="practice-details">
            <p>
              What does the system know? What is it suggesting? What can a
              person change? Those questions shape how I design AI experiences.
            </p>
            <a className="text-link" href="/work/nfi#human-control">
              See it in practice <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="other-work">
          <SectionLabel number="03 — 05">Beyond the interface</SectionLabel>
          <div className="experiments-list">
            {secondaryWork.map((p, i) => (
              <a className="experiment-row" href={`/work/${p.id}`} key={p.id}>
                <span className="experiment-number">0{i + 3}</span>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                </div>
                <span className="experiment-category">{p.category}</span>
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </section>
        <section className="catalogue-about">
          <a
            className="catalogue-portrait"
            href="/about"
            aria-label="Meet Josiah"
          >
            <img
              src="/images/lacrosse/lacrosse-action.webp"
              alt="Josiah playing lacrosse for Tufts."
              width={1600}
              height={882}
              loading="lazy"
              decoding="async"
            />
            <span className="folio">Off screen / On the field</span>
          </a>
          <div>
            <p className="eyebrow">The person behind the work</p>
            <h2>
              A studied approach.
              <br />
              <em>A maker’s instinct.</em>
            </h2>
            <p>
              I studied how people think and make decisions at Tufts. I bring
              that curiosity to AI products, and to the things I make away from
              a screen—from sewing to sourdough.
            </p>
            <a className="text-link" href="/about">
              A little about me <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

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
      <div className="container">
        <section className="home-hero">
          <p className="eyebrow">
            <span className="status-dot" />
            Human Factors + AI Product Designer
          </p>
          <h1>
            Complex systems.
            <br /> <em>Human experiences.</em>
          </h1>
          <div className="hero-bottom">
            <a className="text-link hero-work-link" href="#work">
              View selected work <ArrowDown size={18} />
            </a>
            <div className="hero-description">
              <p>
                I turn complex AI and technical workflows into clear, useful
                experiences.
              </p>
              <a className="quiet-link" href="/about">
                A little about me <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>
        <section id="work" className="selected-work">
          <SectionLabel number="01 — 02">Selected work</SectionLabel>
          {selectedWork.map((project) => (
            <article
              className={`featured-project project-${project.id}`}
              key={project.id}
            >
              <a
                className="project-visual-link"
                href={`/work/${project.id}`}
                aria-label={`View ${project.title} case study`}
              >
                {project.image ? (
                  <div className="nfi-cover">
                    <div className="cover-label">
                      <span>
                        nfi{" "}
                        <span className="cover-label-sub">
                          / sensory platform
                        </span>
                      </span>
                      <span>Evidence → decision</span>
                    </div>
                    <img
                      src={project.image}
                      alt={project.alt}
                      width={1280}
                      height={720}
                      loading="eager"
                      decoding="async"
                    />
                    <span className="visual-caption">
                      Actual product interface · Demonstration data
                    </span>
                  </div>
                ) : (
                  <ConceptComparison compact />
                )}
                <span className="project-open" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
              <div className="project-caption">
                <div>
                  <p className="eyebrow">{project.category}</p>
                  <h2>
                    <a href={`/work/${project.id}`}>{project.title}</a>
                  </h2>
                  <p className="project-subtitle">{project.subtitle}</p>
                </div>
                <div className="project-caption-aside">
                  <p>{project.description}</p>
                  <a className="text-link" href={`/work/${project.id}`}>
                    View case study <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
        <section className="other-work">
          <SectionLabel>Other things I’ve made</SectionLabel>
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
        <section className="about-preview">
          <p className="eyebrow">The person behind the work</p>
          <div>
            <h2>
              A Human Factors foundation.
              <br /> <em>A maker’s curiosity.</em>
            </h2>
            <p>
              I studied how people think, work, and make decisions at Tufts.
              Today, I bring that lens to AI products. Away from the screen, I
              sew, bake sourdough, and make things with my hands.
            </p>
            <a className="text-link" href="/about">
              More about me <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

import { Layout, ArrowUpRight, ArrowDown } from "./design-components";
import { selectedWork, secondaryWork, redHatProject } from "./design-content";
import { ObjectGallery } from "./design-objects";
import "./home.css";

export function DesignHome() {
  return (
    <Layout>
      <div className="container portfolio-home">
        <section className="home-intro" aria-labelledby="home-title">
          <p className="eyebrow">Josiah deGrasse / AI Engineer</p>
          <div className="home-intro-body">
            <h1 id="home-title">
              I design & build
              <br />
              <span>AI products.</span>
            </h1>
            <div className="home-intro-copy">
              <p>
                Currently building research tools at New Food Innovation. Human
                Factors Engineering, Tufts.
              </p>
              <a className="text-link" href="#work">
                Selected work <ArrowDown size={18} />
              </a>
            </div>
          </div>
        </section>
        <section
          id="work"
          className="featured-work"
          aria-labelledby="selected-heading"
        >
          <div className="work-heading">
            <h2 id="selected-heading">Selected work</h2>
            <span className="folio">2025 — 2026</span>
          </div>
          {selectedWork.map((project) => (
            <article
              className={`work-card work-card-${project.id}`}
              key={project.id}
            >
              <header className="work-card-heading">
                <h3>
                  <a href={`/work/${project.id}`}>{project.title}</a>
                </h3>
                <span className="folio">
                  {project.number} / {project.year}
                </span>
              </header>
              <a
                className="work-card-visual"
                href={`/work/${project.id}`}
                aria-label={`View ${project.title} case study`}
              >
                {project.image ? (
                  <div className="nfi-project-stage">
                    <div className="stage-label">
                      <span>NFI / Sensory Platform</span>
                      <span>Sensory analysis</span>
                    </div>
                    <div className="nfi-screen-composition">
                      <img
                        className="nfi-main-screen"
                        src={project.image}
                        alt={project.alt}
                        width={1280}
                        height={720}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <span className="stage-open" aria-hidden="true">
                      <ArrowUpRight size={24} />
                    </span>
                  </div>
                ) : (
                  <div className="redhat-project-stage">
                    <div className="stage-label">
                      <span>Red Hat / OpenShift AI</span>
                      <span>Tufts capstone / 2026</span>
                    </div>
                    <img
                      src={redHatProject.cover}
                      alt="The team’s OpenShift AI capstone prototype showing running, active, and failed model deployments."
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="stage-open" aria-hidden="true">
                      <ArrowUpRight size={24} />
                    </span>
                  </div>
                )}
              </a>
              <div className="work-card-details">
                <div>
                  <p className="work-card-category">{project.category}</p>
                  <p className="work-card-provenance">
                    {project.id === "nfi"
                      ? "Product screens · Synthetic demo data"
                      : "Team’s Figma Make prototype · UX design capstone"}
                  </p>
                </div>
                <div className="work-card-summary">
                  <p>{project.description}</p>
                  <a className="text-link" href={`/work/${project.id}`}>
                    View project <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
        <ObjectGallery />
        <section className="more-work" aria-labelledby="more-heading">
          <div className="work-heading">
            <h2 id="more-heading">More work</h2>
            <span className="folio">Digital & physical</span>
          </div>
          {secondaryWork
            .filter((p) => p.id !== "lacrosse")
            .map((p, i) => (
              <a className="more-work-row" href={`/work/${p.id}`} key={p.id}>
                <span className="folio">0{i + 3}</span>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <ArrowUpRight size={22} />
              </a>
            ))}
        </section>
        <section className="home-about" aria-labelledby="about-heading">
          <a
            className="home-about-photo"
            href="/about"
            aria-label="About Josiah"
          >
            <img
              src="/images/lacrosse/lacrosse-action.webp"
              alt="Josiah playing lacrosse for Tufts."
              width={1600}
              height={882}
              loading="lazy"
              decoding="async"
            />
          </a>
          <div>
            <p className="eyebrow">Off screen</p>
            <h2 id="about-heading">Usually making something.</h2>
            <p>
              I sew, bake sourdough, and design things for the lacrosse field. I
              played at Tufts; now I coach.
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

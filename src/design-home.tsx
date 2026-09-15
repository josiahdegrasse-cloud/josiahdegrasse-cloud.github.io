import { sitePath } from "./site-path";
import { Layout, ArrowUpRight, ArrowDown } from "./design-components";
import { selectedWork, secondaryWork, redHatProject } from "./design-content";
import { ObjectGallery } from "./design-objects";
import { HeadTapCover } from "./headtap-cover";
import "./home.css";
import { ScrollProjectVisual } from "./scroll-project-visual";

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
                  <a href={sitePath(`/work/${project.id}`)}>{project.title}</a>
                </h3>
                <span className="folio">
                  {project.number} / {project.year}
                </span>
              </header>
              <ScrollProjectVisual
                href={sitePath(`/work/${project.id}`)}
                label={`View ${project.title} case study`}
              >
                {project.id === "headtap" ? (
                  <HeadTapCover />
                ) : project.image ? (
                  <div className="nfi-project-stage">
                    <div className="stage-label">
                      <span>NFI / Sensory Platform</span>
                      <span>Sensory analysis</span>
                    </div>
                    <div className="project-screen-pair">
                      <img
                        className="project-screen-primary"
                        src={sitePath(project.image)}
                        alt={project.alt}
                        width={1280}
                        height={720}
                        loading="eager"
                        decoding="async"
                      />
                      <img
                        className="project-screen-detail"
                        src={sitePath("/images/nfi/nfi-sensory-profile.png")}
                        alt="A second NFI screen showing the baseline sample’s sensory radar chart and intensity ratings."
                        width={1280}
                        height={720}
                        loading="lazy"
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
                      src={sitePath(redHatProject.cover)}
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
              </ScrollProjectVisual>
              <div className="work-card-details">
                <div>
                  <p className="work-card-category">{project.category}</p>
                  <p className="work-card-provenance">
                    {project.id === "headtap"
                      ? "Working app · Sample music and concerts"
                      : project.id === "nfi"
                        ? "Product screens · Synthetic demo data"
                        : "Team’s Figma Make prototype · UX design capstone"}
                  </p>
                </div>
                <div className="work-card-summary">
                  <p>{project.description}</p>
                  <a
                    className="text-link"
                    href={sitePath(`/work/${project.id}`)}
                  >
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
            .filter((p) => !["lacrosse", "headtap"].includes(p.id))
            .map((p, i) => (
              <a
                className="more-work-row"
                href={sitePath(`/work/${p.id}`)}
                key={p.id}
              >
                <span className="folio">0{i + 4}</span>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <ArrowUpRight size={22} />
              </a>
            ))}
        </section>
        <section className="home-about" aria-labelledby="about-heading">
          <a
            className="home-about-photo"
            href={sitePath("/about")}
            aria-label="About Josiah"
          >
            <img
              src={sitePath("/images/lacrosse/lacrosse-action.webp")}
              alt="Josiah playing lacrosse for Tufts."
              width={1600}
              height={882}
              loading="lazy"
              decoding="async"
            />
          </a>
          <div>
            <h2 id="about-heading">About me</h2>
            <p>
              I build AI products at New Food Innovation. I studied Human
              Factors Engineering at Tufts, played lacrosse, and now coach.
            </p>
            <p>
              Outside work: coffee, lacrosse, sewing, surfing/snowboarding, and
              cheese.
            </p>
            <a className="text-link" href={sitePath("/about")}>
              More about me <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

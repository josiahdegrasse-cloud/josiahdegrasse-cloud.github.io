import { ArrowLeft, ArrowUpRight, Github, Linkedin, Mail, Play } from "lucide-react";
import { portfolioProjects } from "./portfolio-data";
import { THESIS } from "./portfolio-story";

type PortfolioRecruiterViewProps = {
  projectId?: string;
};

const priority = ["nfi", "red-hat", "headtap", "helfrich", "lacrosse"];

export function PortfolioRecruiterView({ projectId }: PortfolioRecruiterViewProps) {
  const selected = portfolioProjects.find((project) => project.id === projectId);
  const playableMission = selected?.id === "nfi"
    ? "nfi-evidence-review"
    : selected?.id === "red-hat" ? "redhat-trust-review" : null;
  const projects = priority
    .map((id) => portfolioProjects.find((project) => project.id === id))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  if (selected) {
    return (
      <main className={`pqr pqr-project pqr-${selected.color}`}>
        <nav className="pqr-nav" aria-label="Portfolio">
          <a href="/portfolio/case-studies"><ArrowLeft /> All case studies</a>
          <a href="/portfolio/play"><Play /> Explore the world</a>
        </nav>
        <article className="pqr-case">
          <header>
            <p>{selected.role} · {selected.year}</p>
            <h1>{selected.title}</h1>
            <strong>{selected.logline}</strong>
          </header>
          <dl>
            {selected.evidence.map((item) => (
              <div key={item}><dt>Evidence</dt><dd>{item}</dd></div>
            ))}
          </dl>
          <div className="pqr-case-story">
            {selected.story.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
          <footer>
            <span>Outcome</span>
            <p>{selected.outcome}</p>
            {playableMission && (
              <a className="pqr-play-proof" href={`/portfolio/play?mission=${playableMission}`}>
                <Play /> Try the evidence interaction
              </a>
            )}
          </footer>
        </article>
      </main>
    );
  }

  return (
    <main className="pqr">
      <nav className="pqr-nav" aria-label="Portfolio">
        <a className="pqr-name" href="/portfolio">Josiah deGrasse</a>
        <div>
          <a href="/portfolio/play"><Play /> Explore the world</a>
          <a href="/josiah-degrasse-resume.pdf" target="_blank" rel="noreferrer">Résumé <ArrowUpRight /></a>
        </div>
      </nav>

      <header className="pqr-hero">
        <p>AI product engineer</p>
        <h1>I build AI systems people can inspect, correct, and trust.</h1>
        <blockquote>{THESIS}</blockquote>
        <div>
          <a className="pqr-primary" href="/portfolio/projects/nfi">View flagship case study</a>
          <a href="/portfolio/play">Enter the playable world</a>
        </div>
      </header>

      <section className="pqr-projects" aria-labelledby="case-study-heading">
        <header>
          <h2 id="case-study-heading">Selected work</h2>
          <p>Real products, decisions, and evidence. The playable world connects them into one system.</p>
        </header>
        {projects.map((project, index) => (
          <a className="pqr-project-row" href={`/portfolio/projects/${project.id}`} key={project.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <small>{project.subtitle}</small>
              <h3>{project.title}</h3>
              <p>{project.logline}</p>
            </div>
            <strong>{project.role}</strong>
            <ArrowUpRight />
          </a>
        ))}
      </section>

      <footer className="pqr-contact">
        <h2>Bring me the messy system.</h2>
        <div>
          <a href="mailto:Josiah.deGrasse@tufts.edu?subject=AI%20Product%20Engineer%20portfolio"><Mail /> Email</a>
          <a href="https://www.linkedin.com/in/josiahdegrasse" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          <a href="https://github.com/josiahdegrasse-cloud" target="_blank" rel="noreferrer"><Github /> GitHub</a>
        </div>
      </footer>
    </main>
  );
}

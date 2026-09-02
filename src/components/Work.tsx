import { useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Factory, Github, Workflow } from "lucide-react";
import { flagship, lacrosseProject, projects, type WorkProject } from "../data/content";
import { RevealSection } from "./RevealSection";

const projectIndex = [
  {
    href: "#case-nfi",
    code: "NFI-01",
    title: "New Food Innovation",
    label: "Sensory research platform",
    detail: "Study setup, panel testing, concept review, and commercialization reporting in one product.",
    keywords: ["Product engineering", "AI boundary", "Supabase", "Research ops"],
  },
  {
    href: "#case-red-hat",
    code: "RH-02",
    title: "Red Hat OpenShift AI",
    label: "Enterprise GenAI onboarding",
    detail: "User research, concept testing, and validated design opportunities for AI deployment tooling.",
    keywords: ["Research", "Figma", "Enterprise AI", "Onboarding"],
  },
  {
    href: "#case-headtap",
    code: "HT-03",
    title: "HeadTap",
    label: "Concert matching product",
    detail: "Spotify listening history translated into concert recommendations for local shows.",
    keywords: ["Consumer product", "Matching", "Spotify", "Ticketmaster"],
  },
  {
    href: "#case-lacrosse",
    code: "LX-04",
    title: "Custom Lacrosse Head",
    label: "CAD, print, and field test",
    detail: "A physical design loop from SolidWorks drawings to nylon print failure analysis.",
    keywords: ["SolidWorks", "Fabrication", "Testing", "Materials"],
  },
  {
    href: "#case-helfrich",
    code: "HB-05",
    title: "Helfrich Brothers",
    label: "Manufacturing engineering",
    detail: "Fixture design, production documentation, and component modeling for industrial fabrication.",
    keywords: ["Manufacturing", "Fixtures", "CAD", "Operations"],
  },
];

const nfiWorkflow = [
  {
    id: "import",
    label: "Import",
    userProblem: "Research data starts fragmented across files, teams, and study artifacts.",
    built: "A structured intake flow that organizes products, attributes, references, and assets before a study is created.",
    proof: ["PostgreSQL schema", "Supabase storage", "Data import states"],
  },
  {
    id: "study",
    label: "Study setup",
    userProblem: "Study setup has to be fast, but it also has to be auditable.",
    built: "Rule-based food classification and attribute assignment so the platform stays predictable where trust matters.",
    proof: ["Deterministic setup", "Reviewable assumptions", "Typed frontend data"],
  },
  {
    id: "panel",
    label: "Panel testing",
    userProblem: "At-home testing breaks when kit instructions, panelist access, and response capture drift apart.",
    built: "QR-code kit onboarding and panelist-facing flows connected back to the same product record.",
    proof: ["Panel flow", "Auth boundaries", "Operational handoff"],
  },
  {
    id: "concept",
    label: "Concept review",
    userProblem: "Concept work needs speed, but generated outputs cannot become invisible decisions.",
    built: "AI-assisted concept visual generation with provenance and human approval before anything leaves the internal workspace.",
    proof: ["AI draft boundary", "Human approval gate", "Asset review"],
  },
  {
    id: "report",
    label: "Report",
    userProblem: "Commercialization reports take time because evidence, decisions, and narrative sit in different places.",
    built: "AI-assisted report drafting supported by specialized review agents and a human sign-off path.",
    proof: ["Edge Functions", "7 review agents", "Production build checks"],
  },
];

const caseEvidence: Record<
  string,
  {
    role: string;
    did: string[];
    proves: string;
  }
> = {
  "red-hat": {
    role: "Lead researcher and interaction designer for an enterprise AI deployment project.",
    did: [
      "Ran and synthesized 8 user interviews, concept testing, and stakeholder feedback sessions.",
      "Designed two high-fidelity prototype directions: a RAG assistant and a deterministic diagnostic system.",
      "Turned findings into 3 validated opportunities around onboarding, hardware configuration, and YAML diff troubleshooting.",
    ],
    proves: "Ambiguous enterprise AI tools become testable when research, prototypes, and stakeholder feedback stay connected.",
  },
  headtap: {
    role: "Founder-builder for a consumer music discovery tool.",
    did: [
      "Connected Spotify listening history to local concert discovery.",
      "Built a taste-scoring algorithm instead of relying on a generic event list.",
      "Integrated Spotify OAuth and Ticketmaster data around a simple product promise.",
    ],
    proves: "Personal friction became a concrete matching product with a simple reason to exist.",
  },
  helfrich: {
    role: "Engineering intern working inside a real manufacturing environment.",
    did: [
      "Designed production fixtures for robotic welders and CNC machinery.",
      "Modeled 1,000+ components in SolidWorks and supported production documentation.",
      "Worked against industrial constraints where drawings, machines, materials, and operators all matter.",
    ],
    proves: "Physical constraints sharpen product judgment: drawings, operators, materials, and machines all affect the final experience.",
  },
};

type ProjectIndexItem = (typeof projectIndex)[number];

function Tags({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={`border px-2.5 py-1 font-mono text-[11px] font-medium uppercase ${
            muted ? "border-graphite/20 text-graphite" : "border-graphite/25 text-ink"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Metrics({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-px bg-ink/12 font-mono text-[11px] font-medium uppercase leading-5 text-ink sm:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="bg-paper p-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ project, index }: { project: ProjectIndexItem; index: number }) {
  const [active, setActive] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(true);
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handlePointerLeave() {
    setActive(false);
    setSpot({ x: 50, y: 50 });
  }

  const cardStyle = {
    "--spot-x": `${spot.x}%`,
    "--spot-y": `${spot.y}%`,
  } as CSSProperties;

  return (
    <a
      href={project.href}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={cardStyle}
      className="group relative min-h-[17rem] overflow-hidden border-b border-ink/12 bg-paper px-5 py-6 text-ink transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:shadow-focus sm:border-r sm:px-6 sm:py-7"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
        style={{ background: "radial-gradient(circle at var(--spot-x) var(--spot-y), rgba(217, 71, 15, 0.22), transparent 34%)" }}
      />
      <span aria-hidden="true" className="absolute left-0 top-0 h-1 w-0 bg-heat transition-all duration-300 group-hover:w-full" />
      <span className="relative flex h-full flex-col justify-between gap-10">
        <span className="flex items-start justify-between gap-5">
          <span className="font-mono text-[11px] font-medium uppercase text-graphite/55 transition-colors duration-200 group-hover:text-heat">{project.code}</span>
          <ArrowUpRight className="h-4 w-4 text-graphite/45 transition-colors duration-200 group-hover:text-heat" aria-hidden="true" />
        </span>
        <span>
          <span className={`block font-display font-semibold leading-[0.98] ${index === 0 ? "max-w-[14ch] text-4xl sm:text-5xl" : "max-w-[13ch] text-3xl"}`}>
            {project.title}
          </span>
          <span className="mt-5 block font-mono text-[11px] font-medium uppercase leading-5 text-graphite/70 transition-colors duration-200 group-hover:text-paper/70">{project.label}</span>
          <span className="mt-2 block max-w-sm text-sm leading-6 text-graphite transition-colors duration-200 group-hover:text-paper/72">{project.detail}</span>
          <span className="mt-5 flex flex-wrap gap-1.5">
            {project.keywords.slice(0, 3).map((keyword) => (
              <span key={keyword} className="border border-graphite/18 px-2 py-1 font-mono text-[9px] font-medium uppercase transition-colors group-hover:border-paper/25">
                {keyword}
              </span>
            ))}
          </span>
        </span>
      </span>
    </a>
  );
}

function ProjectOverview() {
  return (
    <section className="mb-20 border-t border-ink/10 pt-14 sm:pt-16" aria-labelledby="work-heading">
      <div className="grid gap-12 lg:grid-cols-[0.33fr_1fr]">
        <div className="min-h-40 lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[11px] font-medium uppercase text-heat">01 / Selected work</p>
          <h2 id="work-heading" className="mt-6 max-w-[10ch] break-words font-display text-5xl font-semibold leading-none text-ink sm:text-7xl">
            Selected Work
          </h2>
          <p className="mt-8 max-w-sm text-base leading-7 text-graphite">
            A curated set of projects across shipped software, enterprise research, consumer tools, manufacturing, and physical prototyping.
          </p>
        </div>

        <nav aria-label="Project index" className="grid border-t border-ink/12 sm:grid-cols-2">
          {projectIndex.map((project, index) => (
            <ProjectCard key={project.href} project={project} index={index} />
          ))}
        </nav>
      </div>
    </section>
  );
}

function NfiWorkflowExplainer() {
  const [activeId, setActiveId] = useState(nfiWorkflow[0].id);
  const active = nfiWorkflow.find((step) => step.id === activeId) ?? nfiWorkflow[0];

  return (
    <section className="border border-graphite/20 bg-surface" aria-labelledby="nfi-workflow-heading">
      <div className="grid gap-px bg-graphite/15 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Workflow className="h-5 w-5 text-heat" aria-hidden="true" />
            <p className="font-mono text-[10px] font-medium uppercase text-graphite">Study path</p>
          </div>
          <h4 id="nfi-workflow-heading" className="mt-4 max-w-lg font-display text-3xl font-semibold leading-tight text-ink">
            How the platform moves a study forward.
          </h4>
          <div className="mt-6 grid gap-2" role="list" aria-label="Sensory platform workflow steps">
            {nfiWorkflow.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveId(step.id)}
                className={`grid min-h-12 grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[4px] border px-3 py-2 text-left transition-colors focus-visible:shadow-focus ${
                  active.id === step.id ? "border-ink bg-ink text-paper" : "border-graphite/20 bg-paper text-ink hover:border-heat"
                }`}
                aria-pressed={active.id === step.id}
              >
                <span className="font-mono text-[10px] font-medium">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[11px] font-medium uppercase">{step.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${active.id === step.id ? "-rotate-90 text-heat" : "text-graphite/45"}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-paper p-5 sm:p-6">
          <p className="font-mono text-[10px] font-medium uppercase text-heat">{active.label}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section>
              <p className="font-mono text-[10px] font-medium uppercase text-graphite">User problem</p>
              <p className="mt-2 text-base leading-7 text-ink">{active.userProblem}</p>
            </section>
            <section>
              <p className="font-mono text-[10px] font-medium uppercase text-graphite">What I built</p>
              <p className="mt-2 text-base leading-7 text-ink">{active.built}</p>
            </section>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {active.proof.map((item) => (
              <p key={item} className="border border-graphite/18 bg-surface p-3 font-mono text-[10px] font-medium uppercase leading-5 text-graphite">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-7 h-2 overflow-hidden bg-graphite/15" aria-hidden="true">
            <div
              className="h-full bg-heat transition-all duration-300"
              style={{ width: `${((nfiWorkflow.findIndex((step) => step.id === active.id) + 1) / nfiWorkflow.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FlagshipCase() {
  return (
    <article id="case-nfi" className="section-anchor relative border-y-2 border-ink bg-paper py-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-xs font-medium uppercase text-heat">{flagship.tag}</p>
          <h3 className="mt-5 break-words font-display text-4xl font-semibold leading-[0.98] text-ink sm:text-6xl">{flagship.title}</h3>
          <p className="mt-4 font-mono text-sm uppercase text-graphite">{flagship.subtitle}</p>
          <p className="mt-8 max-w-xl font-display text-2xl font-semibold leading-tight text-ink">{flagship.thesis}</p>
          <div className="mt-8">
            <Tags items={flagship.tags} muted />
          </div>
          <a
            href={flagship.repository.href}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] border border-ink bg-ink px-4 py-2 font-mono text-[11px] font-medium uppercase text-paper transition-colors hover:border-heat hover:bg-heat focus-visible:shadow-focus"
            aria-label={`View ${flagship.repository.label} on GitHub`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            View repository
          </a>
        </div>

        <div className="space-y-7">
          {flagship.body.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-graphite">
              {paragraph}
            </p>
          ))}
          <Metrics items={flagship.metrics} />
        </div>
      </div>

      <div className="mt-10">
        <NfiWorkflowExplainer />
      </div>

      <details className="mt-8 border border-graphite/20 bg-surface">
        <summary className="detail-marker flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-body font-semibold text-ink transition-colors hover:text-heat">
          Read the full case study
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </summary>
        <div className="grid gap-px border-t border-graphite/20 bg-graphite/15 md:grid-cols-2">
          {flagship.caseStudy.map((item) => (
            <section key={item.title} className="bg-surface p-5">
              <h4 className="font-display text-lg font-semibold text-ink">{item.title}</h4>
              <p className="mt-3 text-sm leading-6 text-graphite">{item.body}</p>
            </section>
          ))}
        </div>
      </details>
    </article>
  );
}

function EvidencePanel({ project }: { project: WorkProject }) {
  const evidence = caseEvidence[project.id];

  if (!evidence) {
    return null;
  }

  return (
    <aside className="border border-graphite/20 bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase text-blueprint">Role</p>
      <p className="mt-2 text-sm leading-6 text-ink">{evidence.role}</p>
      <div className="mt-5 grid gap-3">
        {evidence.did.map((item) => (
          <p key={item} className="flex gap-3 text-sm leading-6 text-graphite">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-verdigris" aria-hidden="true" />
            <span>{item}</span>
          </p>
        ))}
      </div>
      <div className="mt-5 border-t border-graphite/15 pt-4">
        <p className="font-mono text-[10px] font-medium uppercase text-heat">Takeaway</p>
        <p className="mt-2 text-sm leading-6 text-ink">{evidence.proves}</p>
      </div>
    </aside>
  );
}

function CaseNote({ project, index }: { project: WorkProject; index: string }) {
  return (
    <article id={`case-${project.id}`} className="section-anchor grid min-w-0 gap-8 border-t border-graphite/20 bg-paper py-10 lg:grid-cols-[8rem_minmax(0,0.78fr)_minmax(18rem,0.62fr)]">
      <div>
        <p className="font-display text-5xl font-semibold text-graphite/30">{index}</p>
        {project.tag ? <p className="mt-4 font-mono text-xs font-medium uppercase text-heat">{project.tag}</p> : null}
      </div>
      <div>
        <h3 className="font-display text-4xl font-semibold leading-tight text-ink">{project.title}</h3>
        {project.oneLine ? <p className="mt-4 font-display text-xl font-semibold leading-snug text-ink">{project.oneLine}</p> : null}
        {project.body.map((paragraph) => (
          <p key={paragraph} className="mt-5 text-base leading-7 text-graphite">
            {paragraph}
          </p>
        ))}
        {project.metrics ? (
          <div className="mt-6">
            <Metrics items={project.metrics} />
          </div>
        ) : null}
        <div className="mt-6">
          <Tags items={project.tags} />
        </div>
      </div>
      <EvidencePanel project={project} />
    </article>
  );
}

function LacrosseCase() {
  return (
    <article id="case-lacrosse" className="section-anchor grid min-w-0 gap-8 border-t border-graphite/20 bg-paper py-10 lg:grid-cols-[8rem_minmax(0,0.78fr)_minmax(18rem,0.62fr)]">
      <div>
        <p className="font-display text-5xl font-semibold text-graphite/30">04</p>
        <p className="mt-4 font-mono text-xs font-medium uppercase text-heat">{lacrosseProject.tag}</p>
      </div>
      <div>
        <h3 className="font-display text-4xl font-semibold leading-tight text-ink">{lacrosseProject.title}</h3>
        <p className="mt-4 font-display text-xl font-semibold leading-snug text-ink">{lacrosseProject.oneLine}</p>
        {lacrosseProject.body.map((paragraph) => (
          <p key={paragraph} className="mt-5 text-base leading-7 text-graphite">
            {paragraph}
          </p>
        ))}
        <div className="mt-6 grid gap-2">
          {lacrosseProject.callouts.map((callout) => (
            <p key={callout} className="border-l-2 border-heat pl-3 font-mono text-xs font-medium uppercase leading-5 text-ink">
              {callout}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <Tags items={lacrosseProject.tags} />
        </div>
      </div>
      <aside className="border border-graphite/20 bg-surface p-4">
        <Factory className="h-5 w-5 text-heat" aria-hidden="true" />
        <p className="mt-4 font-mono text-[10px] font-medium uppercase text-blueprint">Physical product loop</p>
        <div className="mt-4 grid gap-px bg-graphite/15">
          {["SolidWorks model", "Engineering drawing", "Nylon print", "Field test", "Failure analysis"].map((item, index) => (
            <p key={item} className="grid grid-cols-[2rem_1fr] bg-paper p-3 font-mono text-[10px] font-medium uppercase leading-5 text-graphite">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </p>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-ink">
          Takeaway: I test against reality, learn from failure, and understand how material choices change product behavior.
        </p>
      </aside>
    </article>
  );
}

export function Work() {
  const headTap = projects.find((project) => project.id === "headtap")!;
  const redHat = projects.find((project) => project.id === "red-hat")!;
  const helfrich = projects.find((project) => project.id === "helfrich")!;

  return (
    <RevealSection id="work" labelledBy="work-heading" className="border-b border-graphite/15 bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <ProjectOverview />
        <div className="space-y-8">
          <FlagshipCase />
          <div>
            <CaseNote project={redHat} index="02" />
            <CaseNote project={headTap} index="03" />
            <LacrosseCase />
            <CaseNote project={helfrich} index="05" />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

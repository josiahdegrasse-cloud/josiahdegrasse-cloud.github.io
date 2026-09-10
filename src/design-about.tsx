import {
  Layout,
  ArrowUpRight,
  ArrowLeft,
  CaseSection,
  ImageFigure,
  Metadata,
} from "./design-components";
import { profile } from "./design-content";
import resume from "./resume-content.json";

export function AboutPage() {
  return (
    <Layout page="about">
      <div className="container">
        <header className="about-hero">
          <p className="eyebrow">A little about me</p>
          <h1>
            Engineer, designer,
            <br /> <em>and hands-on maker.</em>
          </h1>
          <div className="about-intro">
            <span className="about-signature">Josiah.</span>
            <div>
              <p>
                I’m Josiah, an AI Product Engineer at New Food Innovation and a
                Human Factors Engineering graduate from Tufts University.
              </p>
              <p>
                I work across research, interface design, and implementation.
                Recently, that’s meant building tools for food scientists and
                studying enterprise AI workflows with Red Hat.
              </p>
            </div>
          </div>
        </header>
        <section className="about-background">
          <p className="eyebrow">Background</p>
          <div>
            <div>
              <span>01 / Tufts University</span>
              <h2>Human Factors Engineering</h2>
              <p>
                Research, task analysis, usability testing, and product design.
                My Red Hat capstone explored how AI practitioners work with
                complex tools.
              </p>
            </div>
            <div>
              <span>02 / New Food Innovation</span>
              <h2>AI Product Engineer</h2>
              <p>
                I build research and decision workflows for food scientists,
                working across product design, AI-assisted implementation, and
                testing.
              </p>
            </div>
            <div>
              <span>03 / Tools & practice</span>
              <h2>From prototype to product</h2>
              <p>
                Figma for interfaces and prototypes. React, TypeScript, and AI
                development tools for implementation. CAD for the things that
                need to exist off screen.
              </p>
            </div>
          </div>
        </section>
        <section className="personal-section">
          <figure>
            <img
              src="/images/lacrosse/lacrosse-action.webp"
              width="1600"
              height="882"
              alt="Josiah playing lacrosse for Tufts."
              loading="lazy"
              decoding="async"
            />
            <figcaption>On the field with Tufts lacrosse.</figcaption>
          </figure>
          <div>
            <p className="eyebrow">Away from the screen</p>
            <h2>
              I like making things
              <br /> <em>with my hands, too.</em>
            </h2>
            <p>
              I sew clothing, bake sourdough, and enjoy physical product design.
              I played college lacrosse, helped start a team newspaper, and
              coach younger players.
            </p>
            <a className="text-link" href="/work/lacrosse">
              Made for the field <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

const experiments: Record<
  string,
  {
    title: string;
    subtitle: string;
    category: string;
    role: string;
    date: string;
    sections: { title: string; body: string }[];
    image?: string;
    alt?: string;
    caption?: string;
  }
> = {
  headtap: {
    title: "HeadTap",
    subtitle: "The next show starts with what you already love.",
    category: "Music discovery",
    role: "Founder / Product Design",
    date: "2025",
    sections: [
      {
        title: "Good shows were getting lost in the noise.",
        body: "While living in Madrid, I noticed how difficult it was to discover live music beyond artists people already followed. Venue calendars were fragmented, and recommendations often ignored where someone actually was.",
      },
      {
        title: "Design around taste, time, and place.",
        body: "I designed a discovery flow that considers listening taste, artist similarity, venue, distance, and date. The aim was to make a recommendation feel relevant to someone’s life, rather than simply popular.",
      },
      {
        title: "More data is not always a better decision.",
        body: "This project taught me to think carefully about which signals deserve attention. The product’s job is to turn a large set of possibilities into a choice that still feels personal.",
      },
    ],
  },
  lacrosse: {
    title: "Made for the field",
    subtitle: "A maker’s perspective, shaped by years of playing.",
    category: "Physical design / Lacrosse",
    role: "Designer / Student-athlete",
    date: "Selected personal work",
    image: "/images/lacrosse/lacrosse-head-cad.webp",
    alt: "A CAD view of a lacrosse head from the original portfolio assets.",
    caption:
      "Lacrosse head CAD study, preserved from the original portfolio. Fabrication and testing documentation are still to be added.",
    sections: [
      {
        title: "Start with a feel for the thing.",
        body: "Playing lacrosse gives me a direct relationship with equipment: how it sits in the hand, how it moves, and what happens when it meets real use. This CAD study brings that curiosity into physical form.",
      },
      {
        title: "The team is a system, too.",
        body: "At Tufts, I contributed to three consecutive NCAA Division III national championships while balancing training, travel, and academics. I also founded a weekly team newspaper and helped create peer-support pathways.",
      },
      {
        title: "Make room for the next person.",
        body: "I coach youth athletes in Ridgefield and with Bronx Lacrosse, and fundraise for HEADstrong. The work is about communication, consistency, and making it easier for other people to take part.",
      },
    ],
  },
  helfrich: {
    title: "Helfrich Brothers",
    subtitle: "Precision that works on the factory floor.",
    category: "Manufacturing / Systems thinking",
    role: "Mechanical Engineer",
    date: "June — August 2024",
    sections: [
      {
        title: "A drawing has to survive real use.",
        body: "Industrial boiler work made the consequences of ambiguity clear. Drawings, specifications, and process notes had to communicate correctly to people with different responsibilities and little time for interpretation.",
      },
      {
        title: "Design the work, not just the part.",
        body: "I designed production fixtures for robotic welders and CNC machinery. The documented throughput changed from three boiler heads per three-hour run to eight per 45 minutes.",
      },
      {
        title: "Shared understanding is part of the output.",
        body: "I modeled more than 1,000 SolidWorks components and digital twins to support shop-floor decisions, documentation, and fabrication. The lesson I bring to digital products is simple: a precise system still needs to be understandable to the person using it.",
      },
    ],
  },
};
export function SecondaryProject({ id }: { id: string }) {
  const p = experiments[id];
  if (!p) return <NotFound />;
  return (
    <Layout>
      <article className="container secondary-case">
        <a className="back-link" href="/#work">
          <ArrowLeft size={16} /> All work
        </a>
        <header className="case-hero">
          <p className="eyebrow">Other things I’ve made / {p.category}</p>
          <h1>
            {p.title}
            <br /> <em>{p.subtitle}</em>
          </h1>
          <Metadata
            items={[
              ["Role", p.role],
              ["When", p.date],
            ]}
          />
        </header>
        {p.image && (
          <ImageFigure
            src={p.image}
            alt={p.alt!}
            caption={p.caption!}
            width={1154}
            height={982}
            priority
          />
        )}
        {p.sections.map((s, i) => (
          <CaseSection
            key={s.title}
            id={`story-${i}`}
            number={`0${i + 1}`}
            label={["Context", "The work", "What stayed with me"][i]}
            title={s.title}
          >
            <p>{s.body}</p>
          </CaseSection>
        ))}
        <a className="text-link secondary-back" href="/#work">
          Back to selected work <ArrowUpRight size={18} />
        </a>
      </article>
    </Layout>
  );
}
export function ResumePage() {
  return (
    <Layout page="resume">
      <div className="container resume-page">
        <header>
          <div>
            <p className="eyebrow">Résumé / May 2026 graduate</p>
            <h1>{resume.name}</h1>
            <h2>{resume.title}</h2>
          </div>
          <a
            className="text-link"
            href="/josiah-degrasse-design-resume.pdf"
            download
          >
            Download PDF <ArrowUpRight size={18} />
          </a>
        </header>
        <p className="resume-summary">{resume.summary}</p>
        <div className="resume-contact">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={14} />
          </a>
        </div>
        <section className="resume-section">
          <h2>Experience</h2>
          <div>
            {resume.experience.map((e) => (
              <article key={e.organization}>
                <div className="resume-entry-title">
                  <h3>{e.organization}</h3>
                  <span>{e.dates}</span>
                </div>
                <h4>{e.role}</h4>
                {e.context && <p className="resume-context">{e.context}</p>}
                <ul>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="resume-section">
          <h2>Education</h2>
          <div>
            <h3>{resume.education.school}</h3>
            <p>
              {resume.education.degree} · {resume.education.date}
            </p>
          </div>
        </section>
        <section className="resume-section">
          <h2>Practice</h2>
          <div>
            {resume.skills.map((s) => (
              <div className="resume-skill" key={s.label}>
                <h3>{s.label}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="resume-section">
          <h2>Beyond work</h2>
          <div>
            <p>{resume.community}</p>
            <p className="resume-interests">{resume.interests}</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
export function NotFound() {
  return (
    <Layout page="">
      <div className="container not-found">
        <p className="eyebrow">404 / Page not found</p>
        <h1>A small detour.</h1>
        <p>
          This page isn’t part of the portfolio. The selected work is a good
          place to start.
        </p>
        <a className="text-link" href="/">
          Back to the portfolio <ArrowUpRight size={18} />
        </a>
      </div>
    </Layout>
  );
}

import { sitePath } from "./site-path";
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
          <p className="eyebrow">Josiah deGrasse</p>
          <h1>About me.</h1>
          <div className="about-intro">
            <p>
              I’m an AI Product Engineer at New Food Innovation and a Human
              Factors Engineering graduate from Tufts. I design interfaces,
              write code, and test products with the people who use them.
            </p>
            <p>
              My work includes research tools for food scientists, AI deployment
              workflows with Red Hat, and HeadTap, a music discovery app.
            </p>
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
              <h2>Design & development</h2>
              <p>
                Figma for interfaces and prototypes. React, TypeScript, and AI
                development tools for implementation. SolidWorks for physical
                design.
              </p>
            </div>
          </div>
        </section>
        <section className="personal-section">
          <figure>
            <img
              src={sitePath("/images/lacrosse/lacrosse-action.webp")}
              width="1600"
              height="882"
              alt="Josiah playing lacrosse for Tufts."
              loading="lazy"
              decoding="async"
            />
            <figcaption>On the field with Tufts lacrosse.</figcaption>
          </figure>
          <div>
            <h2>Outside work</h2>
            <p>
              I played lacrosse at Tufts and now coach younger players. I also
              helped start the team newspaper.
            </p>
            <p>
              Interests: coffee, lacrosse, sewing, surfing/snowboarding, and
              cheese.
            </p>
            <a className="text-link" href={sitePath("/work/lacrosse")}>
              Lacrosse head project <ArrowUpRight size={18} />
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
    image: "/images/headtap/headtap-music-dna.jpg",
    alt: "HeadTap’s orange sample music profile, musical DNA, and listening-library statistics.",
    caption:
      "Captured from the working HeadTap app. Sample music and concerts; these are not live event listings.",
    sections: [
      {
        title: "Good shows were getting lost in the noise.",
        body: "While living in Madrid, I noticed how difficult it was to discover live music beyond artists people already followed. Venue calendars were fragmented, and recommendations often ignored where someone actually was.",
      },
      {
        title: "Design around taste, time, and place.",
        body: "HeadTap brings a music profile and concert discovery into one flow. The profile groups listening patterns into artists, genres, and musical traits; the concert view presents matches with venue, date, and price information. Search, sorting, and filters help narrow the shortlist.",
      },
      {
        title: "A working flow, with clear boundaries.",
        body: "The working demo uses sample listening history and concert listings. It lets someone move from their music profile to a practical concert shortlist without treating sample events as live availability. The next step is validating recommendation quality with real listeners and live event data.",
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
        <a className="back-link" href={sitePath("/#work")}>
          <ArrowLeft size={16} /> All work
        </a>
        <header className="case-hero">
          <p className="eyebrow">
            {id === "headtap" ? "Selected work" : "Other things I’ve made"} /{" "}
            {p.category}
          </p>
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
            src={sitePath(p.image)}
            alt={p.alt!}
            caption={p.caption!}
            width={id === "headtap" ? 1280 : 1154}
            height={id === "headtap" ? 720 : 982}
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
            {id === "headtap" && i === 1 && (
              <ImageFigure
                src={sitePath("/images/headtap/headtap-discovery.jpg")}
                alt="HeadTap’s current concert cards with match explanations, saved-concert controls, and artist feedback."
                caption="Actual HeadTap concert discovery · Sample music and events, not live listings."
                width={1280}
                height={720}
              />
            )}
          </CaseSection>
        ))}
        <a className="text-link secondary-back" href={sitePath("/#work")}>
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
            href={sitePath("/josiah-degrasse-design-resume.pdf")}
            download
          >
            Download PDF <ArrowUpRight size={18} />
          </a>
        </header>
        <p className="resume-summary">{resume.summary}</p>
        <div className="resume-contact">
          <a href={sitePath(`mailto:${profile.email}`)}>{profile.email}</a>
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
        <a className="text-link" href={sitePath("/")}>
          Back to the portfolio <ArrowUpRight size={18} />
        </a>
      </div>
    </Layout>
  );
}

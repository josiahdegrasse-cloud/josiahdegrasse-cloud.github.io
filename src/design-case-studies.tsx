import { sitePath } from "./site-path";
import { ProductWalkthrough } from "./product-walkthrough";
import { redHatProject } from "./design-content";
import { useEffect, useState } from "react";
import {
  Layout,
  CaseSection,
  ImageFigure,
  Metadata,
  ProcessFlow,
  AssetPlaceholder,
  NextProject,
  ArrowUpRight,
  ArrowLeft,
} from "./design-components";

function CaseNav({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState("");
  const sectionIds = items.map(([id]) => id).join(",");
  useEffect(() => {
    const sections = sectionIds
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    let frame = 0;
    const update = () => {
      frame = 0;
      const passed = sections.filter(
        (el) => el.getBoundingClientRect().top <= 190,
      );
      const current = passed[passed.length - 1];
      setActive(current?.id ?? "");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sectionIds]);
  return (
    <nav className="case-nav" aria-label="Case study sections">
      <div className="container">
        <a href={sitePath("/#work")}>
          <ArrowLeft size={14} /> All work
        </a>
        <div>
          {items.map(([id, label]) => (
            <a
              key={id}
              href={sitePath(`#${id}`)}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
function CaseBrief({ items }: { items: [string, string][] }) {
  return (
    <section className="case-brief" aria-label="Case study at a glance">
      {items.map(([title, text]) => (
        <div key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      ))}
    </section>
  );
}
function Principle({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="principle">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function Decision({
  number,
  title,
  problem,
  response,
  why,
  result,
}: {
  number: string;
  title: string;
  problem: string;
  response: string;
  why: string;
  result: string;
}) {
  return (
    <div className="design-decision">
      <span className="eyebrow">Decision {number}</span>
      <h3>{title}</h3>
      <dl>
        {[
          ["The problem", problem],
          ["Design response", response],
          ["Why it matters", why],
          ["In the product", result],
        ].map(([term, desc]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function NfiCaseStudy() {
  return (
    <Layout>
      <CaseNav
        items={[
          ["context", "Context"],
          ["walkthrough", "Walkthrough"],
          ["decisions", "Design"],
          ["testing", "Testing"],
          ["reflection", "Reflection"],
        ]}
      />
      <article className="container case-study">
        <header className="case-hero">
          <p className="eyebrow">01 / New Food Innovation · Sensory Platform</p>
          <h1>
            An AI-assisted decision system
            <br /> <em>for food scientists.</em>
          </h1>
          <p className="case-deck">
            Sensory data, scientific research, and consumer feedback each tell
            part of the story. I designed a connected workflow to help teams see
            the evidence and decide what comes next.
          </p>
          <Metadata
            items={[
              ["Role", "AI Product Engineer"],
              ["Context", "New Food Innovation"],
              ["When", "January 2026 — ongoing"],
              ["Focus", "AI workflows · Decision support · UX"],
            ]}
          />
        </header>
        <CaseBrief
          items={[
            [
              "The shift",
              "From disconnected research and sensory data to a shared evidence-to-decision workflow.",
            ],
            [
              "My contribution",
              "Information architecture, decision interfaces, AI review patterns, and iterative product design.",
            ],
            [
              "Current state",
              "Ongoing product work. The screens below show the actual application with demonstration data.",
            ],
          ]}
        />
        <ImageFigure
          priority
          theme="green"
          src={sitePath("/images/nfi/nfi-liking-results.jpg")}
          alt="NFI’s prototype analysis showing five liking dimensions, confidence intervals, and score summaries for Coconut Cheddar v2."
          caption="The Sensory Platform’s liking results and prototype selector. Actual application, synthetic demonstration data."
        />
        <CaseSection
          id="context"
          number="01"
          label="The problem"
          title="Plenty of evidence. No shared picture."
        >
          <p>
            Food teams were moving between instrument exports, panel
            questionnaires, spreadsheets, concept tests, and report documents.
            Each tool answered a question. Connecting those answers into a
            defensible product decision was the harder task.
          </p>
          <p>
            The design challenge was to preserve scientific detail while making
            the next decision clear to the person responsible for it.
          </p>
          <div
            className="fragmented-sources"
            role="group"
            aria-label="Previously disconnected evidence sources"
          >
            {[
              "Instrument data",
              "Scientific research",
              "Sensory panels",
              "Concept tests",
              "Reports",
              "Business decisions",
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <p className="figure-note">
            Workflow summary based on project documentation; reconstructed for
            this case study.
          </p>
        </CaseSection>
        <CaseSection
          id="people"
          number="02"
          label="The people"
          title="A shared project. Different responsibilities."
        >
          <p>
            Rather than inventing personas, I organized the experience around
            the work people need to do.
          </p>
          <div className="people-grid">
            <div>
              <h3>Food scientist</h3>
              <p>
                Compare sensory and instrumental signals. Understand the
                limitations behind a recommendation.
              </p>
            </div>
            <div>
              <h3>Sensory lead</h3>
              <p>
                Configure studies, coordinate panelists, and judge whether the
                evidence is ready for review.
              </p>
            </div>
            <div>
              <h3>Instrument operator</h3>
              <p>
                Import measurements while keeping the sample, batch, and source
                connected.
              </p>
            </div>
            <div>
              <h3>Innovation manager</h3>
              <p>
                Understand the decision, commercial risks, and research needed
                before the next commitment.
              </p>
            </div>
          </div>
          <p className="figure-note">
            Task-based roles synthesized from the product workflow, not a
            research participant roster.
          </p>
        </CaseSection>
        <CaseSection
          id="workflow"
          number="03"
          label="Understanding the work"
          title="Keep the context with the evidence."
        >
          <p>
            The important handoffs happen when information changes form: an
            instrument file becomes an insight, an insight becomes a
            recommendation, and a recommendation becomes a client-facing claim.
          </p>
          <p>
            I structured the journey around a stable project and formulation, so
            each handoff could carry its evidence and limitations forward.
          </p>
        </CaseSection>
        <ProcessFlow
          steps={[
            {
              title: "Collect",
              detail: "Import measurements and preserve their source.",
            },
            {
              title: "Understand",
              detail: "Compare studies, sample sizes, and sensory signals.",
            },
            {
              title: "Decide",
              detail: "Review a recommendation and confirm the outcome.",
            },
            {
              title: "Validate",
              detail: "Test the concept before making broader market claims.",
            },
          ]}
          caption="A reconstructed workflow diagram. AI can assist within the steps; responsibility stays with the reviewer."
        />
        <ImageFigure
          src={sitePath("/images/nfi/nfi-overview-desktop.webp")}
          alt="The live NFI project overview, with stage progress, current position, evidence coverage and a next action."
          caption="Captured from the live synthetic demo. A project path connects stage status with the next action."
        />
        <ProductWalkthrough />
        <CaseSection
          id="principles"
          number="04"
          label="Design principles"
          title="Make judgment easier. Keep it human."
        >
          <div className="principles-grid">
            <Principle number="01" title="Evidence before confidence">
              Connect a recommendation to its source, sample size, and
              limitations.
            </Principle>
            <Principle number="02" title="Approval is a visible step">
              Keep review explicit before important outputs reach panelists or
              clients.
            </Principle>
            <Principle number="03" title="Reveal detail in layers">
              Start with the decision. Let specialists inspect the evidence
              beneath it.
            </Principle>
            <Principle number="04" title="Preserve the next action">
              A result should tell the team what to do next, including when more
              research is needed.
            </Principle>
          </div>
        </CaseSection>
        <CaseSection
          id="architecture"
          number="05"
          label="Information architecture"
          title="Navigation follows the research journey."
        >
          <p>
            The structure follows how a project becomes a decision, rather than
            how its data is stored. Studies and responses stay connected;
            insights lead to a reviewable recommendation; confirmed decisions
            govern concept validation and reporting.
          </p>
          <ol className="architecture-list">
            {[
              ["Data", "Bring evidence into the project."],
              [
                "Studies & responses",
                "Prepare research and collect focused feedback.",
              ],
              ["Insights", "Compare results in context."],
              ["Decision", "Review the reasoning and make the call."],
              ["Concept", "Validate how the product could meet a market need."],
              ["Report", "Communicate the decision, limits, and next actions."],
            ].map(([name, detail], i) => (
              <li key={name}>
                <span>0{i + 1}</span>
                <h3>{name}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
          <p className="figure-note">
            Current product structure, summarized from the live platform
            documentation.
          </p>
        </CaseSection>
        <section
          className="implementation-note"
          id="implementation"
          aria-labelledby="implementation-heading"
        >
          <p className="eyebrow">Under the interface</p>
          <h2 id="implementation-heading">
            A working system, beyond the screen.
          </h2>
          <p>
            The platform connects a typed React client to Supabase-backed
            project data and access controls. Its research layer keeps retrieved
            evidence scoped to the tenant and organized by source sections.
          </p>
          <dl>
            <div>
              <dt>Application</dt>
              <dd>React · TypeScript · TanStack Query</dd>
            </div>
            <div>
              <dt>Data & access</dt>
              <dd>Postgres · Auth · Row Level Security</dd>
            </div>
            <div>
              <dt>Research</dt>
              <dd>Hybrid retrieval · Evidence Assist</dd>
            </div>
          </dl>
          <p>
            I use AI development tools as part of implementation and iteration.
            The product’s documentation describes its architecture, operational
            checks, and current boundaries.
          </p>
          <a
            className="text-link"
            href="https://github.com/josiahdegrasse-cloud/Sensory-Platform"
            target="_blank"
            rel="noreferrer"
          >
            Explore the implementation <ArrowUpRight size={18} />
          </a>
        </section>
        <CaseSection
          id="exploration"
          number="06"
          label="Early exploration"
          title="The path to the interface matters, too."
        >
          <p>
            The final screens show the product’s structure. The original
            sketches and alternate flows are needed to show how that structure
            developed.
          </p>
          <AssetPlaceholder
            name="NFI early wireframes and alternate flows"
            note="Add original, dated exploration artifacts. No reconstructed sketches are presented as historical process."
          />
        </CaseSection>
        <section id="decisions" className="decisions-section">
          <div className="case-section-label">
            <span>07</span>
            <p>Key interaction decisions</p>
          </div>
          <div className="decision-heading">
            <h2>
              Three places where the interface
              <br /> <em>helps people think.</em>
            </h2>
          </div>
          <Decision
            number="01"
            title="Put the decision beside its reasoning."
            problem="A single score can look more certain than the evidence behind it."
            response="Present GO, TWEAK, or STOP with the threshold, evidence details, and the limits of the recommendation."
            why="A reviewer needs to see both the direction and what could change it."
            result="Decision Review connects the recommendation to inspectable sensory and instrumental signals."
          />
        </section>
        <ImageFigure
          src={sitePath("/images/nfi/nfi-decision.webp")}
          alt="Decision Review with a recommendation above a threshold bar and evidence details below it."
          caption="Decision Review: direction first, then evidence. The demo explicitly notes when instrument evidence was not collected."
        />
        <Decision
          number="02"
          title="Let experts compare, then inspect."
          problem="Dense evidence becomes difficult to interpret when every signal has equal visual weight."
          response="Keep prototype comparison, sample coverage, and analysis in one Insights workspace."
          why="Scientists can compare formulations without losing the context needed to interpret a result."
          result="A shared view connects the comparison to the underlying research evidence."
        />
        <ImageFigure
          src={sitePath("/images/nfi/nfi-insights.webp")}
          alt="NFI Insights workspace comparing prototypes and showing sensory evidence with sample context."
          caption="The actual Insights workspace, using demonstration data. Large comparisons provide an entry point to deeper analysis."
        />
        <Decision
          number="03"
          title="Separate a product decision from a market claim."
          problem="A promising sensory result does not establish that consumers will buy a product."
          response="Carry confirmed decisions into concept validation, while keeping response coverage and claim boundaries visible."
          why="Different questions require different evidence. The interface should preserve that distinction."
          result="Concept testing and report review retain the limitations behind the research."
        />
        <ImageFigure
          src={sitePath("/images/nfi/nfi-concepts.webp")}
          alt="NFI concept testing interface displaying a prepared product concept and synthetic response results."
          caption="Concept validation in the working product. Demonstration responses illustrate the workflow, not a measured business outcome."
        />
        <CaseSection
          id="human-control"
          number="08"
          label="AI + human control"
          title="The model helps. The person owns the call."
        >
          <p>
            AI assists with mapping data, drafting questions, and preparing
            report language. It does not become the authority for a product
            decision. Scores and workflow gates follow defined rules, while
            reviewers inspect important outputs before release.
          </p>
          <div className="control-split">
            <div>
              <span className="eyebrow">AI assistance</span>
              <h3>Organize. Suggest. Draft.</h3>
              <p>
                Work from approved evidence and help people make sense of it.
              </p>
            </div>
            <div>
              <span className="eyebrow">Human responsibility</span>
              <h3>Inspect. Correct. Approve.</h3>
              <p>Own the interpretation and decide what can be communicated.</p>
            </div>
          </div>
          <div className="insight-block">
            <span className="eyebrow">When evidence is insufficient</span>
            <p>
              Keep the limitation visible. Restrict the claim. Make the next
              research step clear.
            </p>
          </div>
        </CaseSection>
        <ImageFigure
          src={sitePath("/images/nfi/nfi-report-review.webp")}
          alt="The live report review screen showing review status, disabled approval and the reasons release is blocked."
          caption="A real approval boundary in the synthetic demo: incomplete reviews and demonstration evidence prevent release. This screen is not a client report."
        />
        <CaseSection
          id="testing"
          number="09"
          label="Testing & validation"
          title="Completion is a starting point."
        >
          <p>
            Usability testing reached 100% task completion, as confirmed for
            this portfolio. The useful next layer is the observation behind that
            result: where people hesitated, what needed explanation, and what
            changed afterward.
          </p>
          <div className="research-note">
            <strong>Study documentation pending</strong>
            <p>
              Participant count, task protocol, and the improvement log are
              still needed to put this result in context. It is not a claim
              about every user or every workflow.
            </p>
          </div>
          <AssetPlaceholder
            name="NFI usability findings and changes"
            note="Add the actual task list, participant count, observations, and resulting revisions."
          />
        </CaseSection>
        <CaseSection
          id="before-after"
          number="10"
          label="Before / after"
          title="Show the change, not just the finish."
        >
          <div className="before-after">
            <AssetPlaceholder
              name="NFI earlier interface"
              note="Original screenshot with date and task context."
            />
            <AssetPlaceholder
              name="NFI revised version of the same screen"
              note="Use a matched screen and annotate the actual design change."
            />
          </div>
        </CaseSection>
        <CaseSection
          id="outcome"
          number="11"
          label="Final experience"
          title="One connected lab-to-decision journey."
        >
          <p>
            The deployed platform brings imports, studies, insights, confirmed
            decisions, concept validation, and reports into a traceable
            workspace. My contribution centers on the Human Factors framing,
            workflow design, interface, and reviewable AI experience, using AI
            development tools to turn ideas into working prototypes.
          </p>
          <div className="case-links">
            <a
              className="text-link"
              href="https://sensory-platform.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              Explore the live platform <ArrowUpRight size={18} />
            </a>
            <a
              href="https://github.com/josiahdegrasse-cloud/Sensory-Platform"
              target="_blank"
              rel="noreferrer"
            >
              Supporting product documentation <ArrowUpRight size={16} />
            </a>
          </div>
        </CaseSection>
        <CaseSection
          id="reflection"
          number="12"
          label="What I learned"
          title="Clarity is part of the decision system."
        >
          <ol className="reflection-list">
            <li>
              <h3>Expert users still need hierarchy.</h3>
              <p>
                Deep knowledge does not remove the need for a clear starting
                point.
              </p>
            </li>
            <li>
              <h3>Uncertainty needs an interface.</h3>
              <p>
                A caveat buried in a report cannot help someone at the moment of
                decision.
              </p>
            </li>
            <li>
              <h3>Automation can create work, too.</h3>
              <p>
                The value of an AI draft depends on how easily a person can
                review and correct it.
              </p>
            </li>
          </ol>
        </CaseSection>
        <NextProject
          href={sitePath("/work/red-hat")}
          title="Red Hat OpenShift AI"
        />
      </article>
    </Layout>
  );
}

const redHatWalkthrough = [
  {
    title: "See deployment status",
    image: "capstone-deployments.png",
    alt: "The team’s final prototype showing running, active, and failed model deployments with direct actions.",
    description:
      "The deployment list shows status, elapsed time, and an action for each model. Logs and configuration are available across deployment states, rather than only after a failure.",
    focus: "Start with the model, not another console.",
  },
  {
    title: "Inspect the checks",
    image: "capstone-diagnostics.png",
    alt: "The capstone’s deterministic diagnostics drawer showing a failed memory check alongside passing system checks.",
    description:
      "Version 3.0 replaces inferred causes with a ten-check diagnostic flow. This simulated failure identifies a memory-allocation problem and keeps the underlying logs accessible.",
    focus: "Show the check that failed.",
  },
  {
    title: "Review the YAML",
    image: "capstone-yaml-review.png",
    alt: "The team’s prototype comparing current and proposed YAML, with changed memory values and an explicit apply control.",
    description:
      "Current and proposed configuration sit side by side. The change summary and explicit apply control let the engineer review the fix before redeploying.",
    focus: "Make the proposed change inspectable.",
  },
];

export function RedHatCaseStudy() {
  return (
    <Layout>
      <CaseNav
        items={[
          ["context", "Context"],
          ["research", "Research"],
          ["concepts", "Iterations"],
          ["walkthrough", "Prototype"],
          ["validation", "Feedback"],
        ]}
      />
      <article className="container case-study redhat-case">
        <header className="case-hero">
          <p className="eyebrow">02 / Red Hat OpenShift AI</p>
          <h1>
            Making AI deployments <br />
            <em>easier to debug.</em>
          </h1>
          <p className="case-deck">
            A five-person Tufts capstone with Red Hat. We brought deployment
            status, logs, and suggested fixes into one workflow, then refined it
            with engineers and product leadership.
          </p>
          <Metadata
            items={[
              ["My role", "UX Designer"],
              ["Team", "5-person Tufts capstone"],
              ["When", "January — May 2026"],
              ["Tools", "Figma · Figma Make · User research"],
            ]}
          />
          <div className="case-prototype-links">
            <a
              className="text-link"
              href={redHatProject.prototypeV3}
              target="_blank"
              rel="noreferrer"
            >
              Try the final prototype <ArrowUpRight size={18} />
            </a>
            <a
              className="text-link"
              href={redHatProject.prototypeV2}
              target="_blank"
              rel="noreferrer"
            >
              Explore the AI version <ArrowUpRight size={18} />
            </a>
          </div>
        </header>
        <ImageFigure
          priority
          src={sitePath("/images/red-hat/capstone-yaml-review.png")}
          alt="The team’s OpenShift AI prototype with side-by-side YAML review and an explicit apply-and-redeploy control."
          caption="Our final Figma Make prototype. Simulated deployment data; this is a design prototype, not a shipped Red Hat feature."
        />
        <CaseBrief
          items={[
            [
              "My contribution",
              "UX design and prototype iteration, working with a project manager, two researchers, and a second designer.",
            ],
            [
              "Research",
              "8 discovery interviews, followed by a 4-person concept test and a 5-person stakeholder review.",
            ],
            [
              "Result",
              "A refined prototype and a direction validated with Red Hat product leadership. Implementation planning remained a next step.",
            ],
          ]}
        />
        <CaseSection
          id="context"
          number="01"
          label="The starting point"
          title="A failed deployment shouldn’t mean a second console."
        >
          <p>
            Red Hat’s initial brief asked how model deployment could feel closer
            to one click. Interviews pointed to a more immediate problem:
            engineers were switching between OpenShift AI, the OpenShift
            console, logs, and external assistants just to understand what had
            gone wrong.
          </p>
          <p>
            We focused on three changes: useful deployment feedback,
            explanations beside unfamiliar settings, and hardware presets that
            still allow detailed control.
          </p>
        </CaseSection>
        <CaseSection
          id="research"
          number="02"
          label="Discovery"
          title="Eight interviews narrowed the problem."
        >
          <div className="research-stats">
            <div>
              <strong>5</strong>
              <span>Participants without RHOAI experience</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Red Hat participants with RHOAI experience</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Recurring UX gaps</span>
            </div>
          </div>
          <p>
            We began with students and startup practitioners familiar with model
            deployment, then interviewed three people at Red Hat. The RHOAI
            interviews made the product-specific problems clearer: silent or
            confusing failures, unexplained terminology, and a choice between
            rigid presets and manual setup.
          </p>
          <p>
            Our team used those findings to update the supplied persona and map
            the deployment journey.
          </p>
          <ImageFigure
            src={sitePath("/images/red-hat/capstone-journey.jpg")}
            width={1927}
            height={1522}
            alt="Original team journey artifact for Alex, showing model discovery, registration, system understanding, app configuration, deployment, and the pain points at each stage."
            caption="Original team journey-mapping artifact, extracted from the final capstone report, page 6."
          />
        </CaseSection>
        <CaseSection
          id="concepts"
          number="03"
          label="Iteration"
          title="From likely causes to checks an engineer can inspect."
        >
          <p>
            The first prototype added a troubleshooting drawer beside the
            deployment list. Logs, events, and YAML stayed in the same workflow.
            An AI assistant suggested likely causes and linked the engineer to
            supporting information.
          </p>
          <ImageFigure
            src={sitePath("/images/red-hat/capstone-first-iteration.png")}
            width={2034}
            height={744}
            alt="The team’s original annotated prototype figure connecting the Troubleshoot action to an integrated diagnostics drawer."
            caption="Original annotated prototype figure from the final report, page 8. The callout was part of the team’s submission."
          />
          <p>
            In the first feedback round, four Red Hat engineers and researchers
            walked through the Figma prototype using think-aloud feedback and
            1–7 ratings. They liked the integrated drawer, but wanted actionable
            fixes, logs for every deployment state, and more visible resource
            limits.
          </p>
          <blockquote className="case-quote">
            <p>
              “Would like a suggested fix, something actionable, not just likely
              causes.”
            </p>
            <cite>Concept-test feedback · Final report, page 13</cite>
          </blockquote>
          <div className="redhat-iteration-pair">
            <div>
              <p className="eyebrow">v2.0 / AI-assisted analysis</p>
              <ImageFigure
                src={sitePath("/images/red-hat/capstone-ai-assistant.png")}
                alt="Actual v2.0 capstone prototype with an AI troubleshooting assistant listing likely causes."
                caption="v2.0: likely causes and suggested fixes. Captured from the team’s Figma Make prototype."
              />
            </div>
            <div>
              <p className="eyebrow">v3.0 / Deterministic diagnostics</p>
              <ImageFigure
                src={sitePath("/images/red-hat/capstone-diagnostics.png")}
                alt="Actual v3.0 capstone prototype with explicit system checks and a failed resource-allocation check."
                caption="v3.0: a ten-check diagnostic flow. Captured from the team’s Figma Make prototype."
              />
            </div>
          </div>
          <p>
            The second review brought five Red Hat designers, product managers,
            and leadership stakeholders together. Their feedback led us toward a
            deterministic version that checks common failure patterns. Both
            versions keep the proposed YAML change visible before an engineer
            applies it.
          </p>
        </CaseSection>
        <ProductWalkthrough
          steps={redHatWalkthrough}
          title="Inside the final prototype."
          credit="Team prototype · Simulated data"
          imageDirectory="/images/red-hat"
          imageContext="Captured from the team’s v3.0 Figma Make prototype; deployment behavior is simulated."
        />
        <CaseSection
          id="hardware"
          number="04"
          label="Configuration"
          title="A preset is a starting point."
        >
          <p>
            We kept familiar hardware profiles and added editable CPU and memory
            requests and limits. Feedback on the initial design showed that a
            separate custom option wasn’t enough: engineers also wanted to
            adjust a preset after selecting it.
          </p>
          <ImageFigure
            src={sitePath("/images/red-hat/capstone-hardware.png")}
            alt="Final capstone prototype with a Medium hardware preset selected and editable CPU and memory requests and limits expanded."
            caption="Our final preset-and-override interaction, captured from the v3.0 prototype. Values are illustrative."
          />
          <p>
            We also revised the help popovers so documentation links stayed
            reachable when a user moved from the question mark into the popover.
          </p>
        </CaseSection>
        <CaseSection
          id="validation"
          number="05"
          label="Outcome"
          title="A reviewed direction, with clear next steps."
        >
          <p>
            Red Hat leadership said the findings aligned with their existing
            research. The final direction combined deployment visibility,
            actionable diagnostics, reviewable YAML changes, and customizable
            hardware profiles.
          </p>
          <p>
            The feedback rounds involved people with RHOAI experience. Testing
            the refined design with newcomers, validating the documentation, and
            planning implementation remained next steps.
          </p>
          <div className="redhat-credits">
            <p>
              <strong>Team:</strong> Josiah deGrasse — UX Designer; Nancy Yang —
              Client Liaison & UX Designer; Christie Hao — Project Manager & UX
              Writer; Joey Marmo and Marlon Ward — UX Researchers.
            </p>
            <p>
              Built and iterated in Figma Make, with the team directing and
              reviewing the interface output. Prototype behavior and diagnostic
              examples are simulated.
            </p>
            <a
              className="text-link"
              href={redHatProject.notebook}
              target="_blank"
              rel="noreferrer"
            >
              Project notebook <ArrowUpRight size={18} />
            </a>
          </div>
        </CaseSection>
        <NextProject href={sitePath("/work/nfi")} title="New Food Innovation" />
      </article>
    </Layout>
  );
}

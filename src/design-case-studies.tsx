import {
  Layout,
  CaseSection,
  ImageFigure,
  Metadata,
  ProcessFlow,
  ConceptComparison,
  AssetPlaceholder,
  NextProject,
  ArrowUpRight,
  ArrowLeft,
} from "./design-components";

function CaseNav({ items }: { items: [string, string][] }) {
  return (
    <nav className="case-nav" aria-label="Case study sections">
      <div className="container">
        <a href="/#work">
          <ArrowLeft size={14} /> All work
        </a>
        <div>
          {items.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
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
          ["workflow", "Workflow"],
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
              ["Role", "Human Factors / Product Design"],
              ["Context", "New Food Innovation"],
              ["When", "January 2026 — ongoing"],
              ["Focus", "AI workflows · Decision support · UX"],
            ]}
          />
        </header>
        <ImageFigure
          priority
          theme="green"
          src="/images/nfi/nfi-decision.webp"
          alt="NFI Decision Review, with a GO recommendation, an explicit threshold and the supporting sensory evidence."
          caption="The actual Decision Review interface. Demonstration data; scores describe the sample product, not project impact."
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
          src="/images/nfi/nfi-overview-desktop.webp"
          alt="The live NFI project overview, with stage progress, current position, evidence coverage and a next action."
          caption="Captured from the live synthetic demo. A project path connects stage status with the next action."
        />
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
          src="/images/nfi/nfi-decision.webp"
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
          src="/images/nfi/nfi-insights.webp"
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
          src="/images/nfi/nfi-concepts.webp"
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
          src="/images/nfi/nfi-report-review.webp"
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
        <NextProject href="/work/red-hat" title="Red Hat OpenShift AI" />
      </article>
    </Layout>
  );
}

export function RedHatCaseStudy() {
  return (
    <Layout>
      <CaseNav
        items={[
          ["context", "Context"],
          ["research", "Research"],
          ["concepts", "Concepts"],
          ["validation", "Validation"],
        ]}
      />
      <article className="container case-study redhat-case">
        <header className="case-hero">
          <p className="eyebrow">02 / Red Hat OpenShift AI</p>
          <h1>
            Less friction in AI workflows.
            <br /> <em>More control for people.</em>
          </h1>
          <p className="case-deck">
            How do you make an enterprise AI workflow easier without hiding the
            decisions that matter? We explored two approaches to find out where
            assistance helped—and where people wanted a clearer hand on the
            controls.
          </p>
          <Metadata
            items={[
              ["Role", "Product Designer"],
              ["Context", "Tufts senior capstone · Red Hat"],
              ["When", "January — May 2026"],
              ["Methods", "Interviews · Journey mapping · Figma"],
            ]}
          />
        </header>
        <ConceptComparison />
        <CaseSection
          id="context"
          number="01"
          label="The challenge"
          title="Faster is only useful when it is understandable."
        >
          <p>
            OpenShift AI practitioners work across onboarding, hardware
            configuration, troubleshooting, and deployment handoffs. A simpler
            interface can reduce friction. It can also conceal configuration
            choices that affect the system.
          </p>
          <p>
            The design challenge was to offer help while preserving visibility,
            source grounding, and a way back.
          </p>
        </CaseSection>
        <CaseSection
          id="research"
          number="02"
          label="Research"
          title="Start with where people lose the thread."
        >
          <div className="research-stats">
            <div>
              <strong>8</strong>
              <span>User interviews</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Validated opportunities</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Divergent concepts</span>
            </div>
          </div>
          <p>
            User interviews and stakeholder sessions informed the journey
            mapping and prototype work. We focused on AI practitioners’ real
            workflows: what they needed to understand, where they lost trust,
            and which choices they needed to inspect.
          </p>
          <div className="finding-list">
            <div>
              <span>01</span>
              <h3>Show what the system is doing.</h3>
              <p>
                Configuration and deployment changes need to remain visible.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Make the source inspectable.</h3>
              <p>
                An answer is more useful when people can examine what supports
                it.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Keep control reversible.</h3>
              <p>Review and rollback belong in the workflow, not outside it.</p>
            </div>
          </div>
          <p className="figure-note">
            Themes summarized from the existing project narrative. Counts and
            leadership validation confirmed by Josiah; original research
            artifacts pending.
          </p>
        </CaseSection>
        <CaseSection
          id="journey"
          number="03"
          label="The journey"
          title="A workflow crosses more than one screen."
        >
          <p>
            Mapping the journey made the handoffs visible. Setup is not an
            isolated action: the practitioner needs to understand the
            environment, inspect proposed changes, and know what to do when a
            step fails.
          </p>
        </CaseSection>
        <ProcessFlow
          steps={[
            {
              title: "Orient",
              detail: "Understand the environment and starting requirements.",
            },
            {
              title: "Configure",
              detail: "Inspect hardware and configuration choices.",
            },
            {
              title: "Troubleshoot",
              detail: "Find grounded help and review proposed changes.",
            },
            {
              title: "Hand off",
              detail: "Carry the decision and recovery path into deployment.",
            },
          ]}
          caption="A current reconstruction of the workflow described in project notes, not an original research deliverable."
        />
        <CaseSection
          id="concepts"
          number="04"
          label="Divergent concepts"
          title="Test the interaction model, not just the layout."
        >
          <p>
            I designed and tested a source-grounded AI assistant and a
            rule-based alternative. The comparison explored when people welcomed
            AI help and when a predictable, bounded workflow gave them more
            confidence.
          </p>
          <div className="hypothesis-grid">
            <div>
              <span className="eyebrow">Concept A / AI assistant</span>
              <h3>Help that can explain itself.</h3>
              <p>
                <strong>Hypothesis:</strong> Grounding an answer in sources
                could make troubleshooting more useful without asking people to
                trust an opaque response.
              </p>
            </div>
            <div>
              <span className="eyebrow">
                Concept B / Deterministic workflow
              </span>
              <h3>A path people can predict.</h3>
              <p>
                <strong>Hypothesis:</strong> Explicit checks and a bounded next
                step could provide clearer control when the task has
                well-defined rules.
              </p>
            </div>
          </div>
          <p className="figure-note">
            Hypotheses paraphrase the documented comparison. No preference
            percentages are claimed.
          </p>
        </CaseSection>
        <div className="prototype-pair">
          <AssetPlaceholder
            name="Red Hat concept A Figma prototype"
            note="Original source-grounded assistant screens."
          />
          <AssetPlaceholder
            name="Red Hat concept B Figma prototype"
            note="Original deterministic workflow screens."
          />
        </div>
        <CaseSection
          id="validation"
          number="05"
          label="Validation"
          title="Trust changed the design direction."
        >
          <p>
            Testing showed where users lost trust in the assistant. The
            resulting direction emphasized visibility into changes, source
            grounding, rollback, and clearer human review.
          </p>
          <p>
            The work was validated with Red Hat product leadership. That is
            evidence of a reviewed design direction, not a claim that the
            concept shipped or caused a measured business outcome.
          </p>
          <div className="insight-block">
            <span className="eyebrow">The design takeaway</span>
            <p>
              Make the recommendation easier to understand, and the decision
              easier to own.
            </p>
          </div>
          <AssetPlaceholder
            name="Red Hat validation findings"
            note="Add the original comparison, stakeholder feedback, and decisions made after testing."
          />
        </CaseSection>
        <CaseSection
          id="final"
          number="06"
          label="Final direction"
          title="Visible reasoning. Deliberate action."
        >
          <p>
            The Figma prototype work covered onboarding, hardware setup,
            configuration differences, troubleshooting, and deployment handoffs.
            The revised direction kept review and recovery visible as part of
            the experience.
          </p>
          <AssetPlaceholder
            name="Red Hat final high-fidelity Figma screens"
            note="Add desktop screens and a close-up of the review or rollback interaction."
          />
        </CaseSection>
        <CaseSection
          id="reflection"
          number="07"
          label="What I learned"
          title="The best shortcut still leaves a trail."
        >
          <p>
            I came away thinking less about how many steps an assistant can
            remove, and more about which steps help people understand the
            system. A review step can be valuable when it makes a consequence
            visible and gives someone the chance to change course.
          </p>
        </CaseSection>
        <NextProject href="/work/nfi" title="New Food Innovation" />
      </article>
    </Layout>
  );
}

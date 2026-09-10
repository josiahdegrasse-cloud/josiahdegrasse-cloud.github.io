import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageFigure } from "./design-components";
const steps = [
  {
    title: "Orient the team",
    image: "nfi-overview-desktop.webp",
    alt: "The NFI project overview with project navigation and current evidence context.",
    description:
      "Start with a shared project context. Research, sensory studies, and decisions belong to the same workflow rather than separate documents.",
    focus: "A common starting point for different roles.",
  },
  {
    title: "Inspect the evidence",
    image: "nfi-insights.webp",
    alt: "The actual NFI Insights screen with sensory analysis and supporting evidence.",
    description:
      "Inspect the signals behind a recommendation. Keep the evidence available so a person can question the interpretation before acting on it.",
    focus: "Evidence stays close to the interpretation.",
  },
  {
    title: "Review the decision",
    image: "nfi-decision.webp",
    alt: "The NFI Decision Review screen with a recommendation, threshold, and evidence.",
    description:
      "Bring the recommendation, decision threshold, and supporting evidence together. The interface supports the next judgment without hiding its basis.",
    focus: "A clear next step, with the reasoning in view.",
  },
];
export function ProductWalkthrough() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  return (
    <section
      className="product-walkthrough"
      id="walkthrough"
      aria-labelledby="walkthrough-heading"
    >
      <div className="walkthrough-heading">
        <div>
          <p className="eyebrow">Guided screen tour</p>
          <h2 id="walkthrough-heading">From evidence to a decision.</h2>
        </div>
        <span className="folio">Actual application · Demonstration data</span>
      </div>
      <div className="walkthrough-steps" aria-label="Walkthrough steps">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Step ${index + 1}: ${item.title}`}
            aria-pressed={index === current}
            aria-controls="walkthrough-detail"
            onClick={() => setCurrent(index)}
          >
            <span>0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div id="walkthrough-detail">
        <div className="walkthrough-copy" aria-live="polite" aria-atomic="true">
          <h3>{step.focus}</h3>
          <p>{step.description}</p>
        </div>
        <ImageFigure
          key={step.image}
          src={`/images/nfi/${step.image}`}
          alt={step.alt}
          caption={`Screen ${current + 1} of ${steps.length}: ${step.title}. This is a guided tour of captured product screens, not a live product session.`}
        />
      </div>
      <div className="walkthrough-controls">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          <ArrowLeft size={18} /> Previous
        </button>
        <span aria-hidden="true">
          {current + 1} / {steps.length}
        </span>
        <button
          type="button"
          disabled={current === steps.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

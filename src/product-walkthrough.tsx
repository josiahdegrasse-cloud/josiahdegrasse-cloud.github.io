import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageFigure } from "./design-components";
const steps = [
  {
    title: "Compare the evidence",
    image: "nfi-insights.webp",
    alt: "The actual NFI Insights screen with sensory analysis and supporting evidence.",
    description:
      "Inspect the selected prototype alongside its liking score, response count, and evidence status. Separate tabs keep sensory results and concept feedback distinct.",
    focus: "Read each sample in context.",
  },
  {
    title: "Review the decision",
    image: "nfi-decision.webp",
    alt: "The NFI Decision Review screen with a recommendation, threshold, and evidence.",
    description:
      "The decision screen pairs GO, TWEAK, or STOP with a threshold and evidence detail. In this demo state, the text explicitly says instrument QC evidence was not collected.",
    focus: "Read the limits beside the recommendation.",
  },
  {
    title: "Check release readiness",
    image: "nfi-report-review.webp",
    alt: "NFI report review with a demonstration-data warning, disabled approval control, and outstanding evidence and calculation checks.",
    description:
      "The report exposes its review status, disabled approval control, and outstanding checks. This captured state retains evidence and calculation issues, so the reader can see why approval is blocked.",
    focus: "See what still blocks approval.",
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
          <h2 id="walkthrough-heading">From evidence to release review.</h2>
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
          caption={`Screen ${current + 1} of ${steps.length}: ${step.title}. Captured synthetic demo state; values vary between screens.`}
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

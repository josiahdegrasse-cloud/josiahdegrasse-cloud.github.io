import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageFigure } from "./design-components";
export type WalkthroughStep = {
  title: string;
  image: string;
  alt: string;
  description: string;
  focus: string;
};
const nfiSteps: WalkthroughStep[] = [
  {
    title: "Read the results",
    image: "nfi-liking-results.jpg",
    alt: "NFI’s liking results with five charted dimensions and their scores for the creamier coconut cheddar prototype.",
    description:
      "The prototype selector stays beside the results. Liking scores, response counts, and descriptive confidence intervals let the reader inspect each dimension before reviewing a decision.",
    focus: "See the scores and their context together.",
  },
  {
    title: "Compare the evidence",
    image: "nfi-spider-fresh.jpg",
    alt: "NFI Insights showing a sensory radar chart, five intensity ratings, and two coconut cheddar prototypes.",
    description:
      "The prototype selector sits beside a sensory profile. A radar chart and labeled ratings show firmness, tanginess, cheesiness, creaminess, and graininess for the selected sample.",
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
export function ProductWalkthrough({
  steps = nfiSteps,
  title = "From evidence to release review.",
  credit = "Actual application · Demonstration data",
  imageDirectory = "/images/nfi",
  imageContext = "Captured synthetic demo state; values vary between screens.",
}: {
  steps?: WalkthroughStep[];
  title?: string;
  credit?: string;
  imageDirectory?: string;
  imageContext?: string;
}) {
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
          <h2 id="walkthrough-heading">{title}</h2>
        </div>
        <span className="folio">{credit}</span>
      </div>
      <div
        className="walkthrough-steps"
        data-step-count={steps.length}
        role="group"
        aria-label="Walkthrough steps"
      >
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
          src={`${imageDirectory}/${step.image}`}
          alt={step.alt}
          caption={`Screen ${current + 1} of ${steps.length}: ${step.title}. ${imageContext}`}
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

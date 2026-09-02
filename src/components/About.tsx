import { about } from "../data/content";
import { RevealSection } from "./RevealSection";

const beats = ["Recovery / making", "Human Factors", "AI product systems", "Pressure"];

function ArtifactPanel() {
  return (
    <figure className="relative overflow-hidden border-y border-ink/14 py-8" aria-label="Personal artifact summary">
      <div className="grid min-h-[28rem] content-between gap-12">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase text-heat">Origin Thread</p>
          <p className="mt-6 max-w-[10ch] break-words font-display text-5xl font-semibold leading-[0.92] text-ink sm:text-7xl">
            ACL → sewing → systems
          </p>
        </div>

        <div className="grid gap-px bg-ink/12">
          {about.coordinates.map((coordinate) => (
            <p key={coordinate} className="bg-paper p-4 font-mono text-[10px] font-medium uppercase leading-5 text-graphite">
              {coordinate}
            </p>
          ))}
        </div>
      </div>
      <span aria-hidden="true" className="absolute right-0 top-8 h-3 w-3 bg-heat" />
      <span aria-hidden="true" className="absolute bottom-8 left-0 h-px w-24 bg-heat" />
    </figure>
  );
}

export function About() {
  return (
    <RevealSection id="about" labelledBy="about-heading" className="border-b border-graphite/15 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-24 lg:py-36">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-xs font-medium uppercase text-graphite/58">Personal thread</p>
          <h2 id="about-heading" className="mt-8 max-w-[7ch] break-words font-display text-5xl font-semibold leading-none text-ink sm:text-7xl">
            About
          </h2>
          <p className="mt-8 max-w-md font-display text-3xl font-semibold leading-tight text-ink">{about.headline}</p>
          <p className="mt-6 max-w-md text-base leading-7 text-graphite">{about.thesis}</p>
          <p className="mt-8 border-t border-ink/10 pt-5 font-mono text-[10px] font-medium uppercase leading-5 text-graphite">
            {about.currently}
          </p>
        </div>

        <div className="grid gap-16">
          <ArtifactPanel />

          <div className="grid gap-x-12 gap-y-12 border-t border-ink/10 pt-12 md:grid-cols-2">
            {about.body.map((paragraph, index) => (
              <section key={paragraph} className="max-w-xl">
                <p className="font-mono text-[10px] font-medium uppercase text-heat">
                  {String(index + 1).padStart(2, "0")} / {beats[index]}
                </p>
                <p className="mt-5 text-lg leading-8 text-graphite">{paragraph}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

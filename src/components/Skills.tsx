import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { capabilities, professionalSummary, skills } from "../data/content";
import { RevealSection } from "./RevealSection";

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = capabilities[activeIndex];

  return (
    <RevealSection id="capabilities" labelledBy="capabilities-heading" className="border-b border-graphite/15 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[11px] font-medium uppercase text-blueprint">02 / Capabilities</p>
          <h2 id="capabilities-heading" className="mt-6 max-w-[10ch] break-words font-display text-5xl font-semibold leading-none text-ink sm:text-7xl">
            Capabilities
          </h2>
          <p className="mt-7 max-w-md text-lg leading-8 text-graphite">
            {professionalSummary.body}
          </p>
        </div>

        <div className="grid gap-8">
          <section className="border border-graphite/20 bg-surface" aria-labelledby="capability-matrix-heading">
            <div className="grid gap-px bg-graphite/15 lg:grid-cols-[0.48fr_0.52fr]">
              <div className="bg-paper p-4 sm:p-5">
                <p className="font-mono text-[10px] font-medium uppercase text-heat">What I do</p>
                <h3 id="capability-matrix-heading" className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
                  Useful across the messy middle.
                </h3>
                <div className="mt-6 grid gap-2">
                  {capabilities.map((capability, index) => (
                    <button
                      key={capability.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`grid min-h-14 grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[4px] border px-3 py-2 text-left transition-colors focus-visible:shadow-focus ${
                        activeIndex === index ? "border-ink bg-ink text-paper" : "border-graphite/20 bg-surface text-ink hover:border-blueprint"
                      }`}
                      aria-pressed={activeIndex === index}
                    >
                      <span className="font-mono text-[10px] font-medium">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-body text-sm font-semibold">{capability.title}</span>
                      <ArrowUpRight className={`h-4 w-4 ${activeIndex === index ? "text-heat" : "text-graphite/45"}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>

              <article className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase text-blueprint">Current focus</p>
                <h3 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink">{active.title}</h3>
                <p className="mt-5 text-lg leading-8 text-graphite">{active.description}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {active.evidence.map((item) => (
                    <p key={item} className="border border-graphite/18 bg-paper p-3 font-mono text-[10px] font-medium uppercase leading-5 text-graphite">
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="grid border-y border-graphite/20 lg:grid-cols-3" aria-label="Toolkit">
            {skills.map((group, index) => (
              <section
                key={group.group}
                className={`py-6 lg:px-6 ${index > 0 ? "border-t border-graphite/20 lg:border-l lg:border-t-0" : ""}`}
                aria-labelledby={`skill-${group.group}`}
              >
                <p className="font-mono text-xs font-medium uppercase text-blueprint">{String(index + 1).padStart(2, "0")}</p>
                <h3 id={`skill-${group.group}`} className="mt-3 font-display text-2xl font-semibold text-ink">
                  {group.group}
                </h3>
                <ul className="mt-6 flex flex-wrap content-start gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="border border-graphite/25 bg-surface px-3 py-1.5 font-mono text-xs font-medium uppercase text-graphite">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </section>
        </div>
      </div>
    </RevealSection>
  );
}

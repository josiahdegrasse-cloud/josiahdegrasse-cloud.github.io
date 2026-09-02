import { leadership, offClock } from "../data/content";
import { RevealSection } from "./RevealSection";

const operatingHabits = [
  {
    label: "Behavior first",
    text: "I start by understanding what people actually do, then design the system around the real workflow.",
  },
  {
    label: "Build the spine",
    text: "I care about the architecture underneath the interface: data models, permissions, boundaries, and failure states.",
  },
  {
    label: "Make tradeoffs visible",
    text: "Especially with AI, I separate deterministic logic, generated drafts, and human approval instead of treating everything as magic.",
  },
  {
    label: "Keep standards under pressure",
    text: "Team sport, injuries, and product deadlines have all taught me to stay direct, accountable, and steady.",
  },
];

export function Leadership() {
  return (
    <>
      <RevealSection id="leadership" labelledBy="leadership-heading" className="border-b border-graphite/15 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] font-medium uppercase text-field">Operating habits</p>
            <h2 id="leadership-heading" className="mt-6 max-w-[9ch] break-words font-display text-5xl font-semibold leading-none text-ink sm:text-7xl">
              How I Work
            </h2>
            <p className="mt-7 max-w-md text-lg leading-8 text-graphite">
              The same pattern shows up across product work, research, fabrication, and lacrosse: observe carefully, build deliberately, take feedback, and make the group better.
            </p>
          </div>

          <div className="grid gap-8">
            <section className="grid gap-px bg-graphite/15 md:grid-cols-2" aria-label="Operating habits">
              {operatingHabits.map((habit, index) => (
                <article key={habit.label} className="bg-surface p-5">
                  <p className="font-mono text-[10px] font-medium uppercase text-field">{String(index + 1).padStart(2, "0")} / {habit.label}</p>
                  <p className="mt-4 text-base leading-7 text-ink">{habit.text}</p>
                </article>
              ))}
            </section>

            <div className="border-y border-graphite/20">
              {leadership.map((item, index) => (
                <article key={item.text} className="grid gap-3 border-t border-graphite/15 py-5 first:border-t-0 md:grid-cols-[9rem_1fr]">
                  <p className="font-mono text-xs font-medium uppercase text-field">
                    {String(index + 1).padStart(2, "0")} / {item.label}
                  </p>
                  <p className="max-w-3xl text-lg leading-8 text-ink">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <section aria-label="Off the clock" className="border-b border-graphite/15 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="border-y border-graphite/20 py-5">
            <p className="font-mono text-xs font-medium uppercase text-graphite">Off the clock</p>
            <p className="mt-2 text-lg text-ink">{offClock}</p>
          </div>
        </div>
      </section>
    </>
  );
}

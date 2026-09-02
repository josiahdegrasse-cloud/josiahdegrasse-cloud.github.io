import { ArrowDownRight, ArrowUpRight, Download, Github, Mail, ShieldCheck } from "lucide-react";
import { contact, flagship, hero, professionalSummary } from "../data/content";

function resumeHref() {
  if (contact.resumeUrl) {
    return contact.resumeUrl;
  }

  const subject = encodeURIComponent("Résumé request");
  const body = encodeURIComponent("Hi Josiah, I'd like to see your résumé.");
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-graphite/15 bg-paper">
      <div className="professional-grid absolute inset-0 opacity-80" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 lg:min-h-[calc(100vh-73px)] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-center lg:pb-20 lg:pt-12">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-medium uppercase text-heat">{hero.eyebrow}</p>
          <h1 className="mt-5 max-w-5xl break-words font-display text-5xl font-semibold leading-[0.95] text-ink sm:text-6xl lg:text-[6.8rem]">
            {hero.name}
          </h1>
          <p className="mt-8 max-w-3xl break-words font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {hero.thesis}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">{hero.support}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {professionalSummary.roles.map((role) => (
              <span key={role} className="max-w-full break-words border border-graphite/25 bg-surface px-3 py-1.5 font-mono text-[11px] font-medium uppercase text-graphite">
                {role}
              </span>
            ))}
          </div>

          <div className="mt-9 grid max-w-sm gap-3 sm:flex sm:max-w-none sm:flex-wrap">
            <a
              href="#work"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[4px] border border-ink bg-ink px-5 py-3 font-mono text-[11px] font-medium uppercase text-paper transition-colors hover:border-heat hover:bg-heat focus-visible:shadow-focus sm:w-auto"
            >
              Selected work
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={resumeHref()}
              download={contact.resumeUrl ? true : undefined}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[4px] border border-graphite/30 bg-surface px-5 py-3 font-mono text-[11px] font-medium uppercase text-ink transition-colors hover:border-heat hover:text-heat focus-visible:shadow-focus sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[4px] border border-graphite/30 bg-surface px-5 py-3 font-mono text-[11px] font-medium uppercase text-ink transition-colors hover:border-heat hover:text-heat focus-visible:shadow-focus sm:w-auto"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </a>
          </div>
        </div>

        <aside className="min-w-0 max-w-full overflow-hidden border border-graphite/20 bg-surface shadow-[12px_12px_0_rgba(9,9,11,0.06)]" aria-label="Current flagship project summary">
          <div className="border-b border-graphite/15 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-medium uppercase text-heat">Current flagship</p>
                <h2 className="mt-3 break-words font-display text-3xl font-semibold leading-tight text-ink">{flagship.title}</h2>
              </div>
              <ShieldCheck className="h-6 w-6 shrink-0 text-verdigris" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm leading-6 text-graphite">{flagship.thesis}</p>
          </div>

          <div className="grid gap-px bg-graphite/15">
            {flagship.snapshot.map((item) => (
              <article key={item.label} className="grid gap-3 bg-paper p-4 sm:grid-cols-[6rem_1fr]">
                <p className="font-mono text-[10px] font-medium uppercase text-blueprint">{item.label}</p>
                <div>
                  <p className="font-body text-sm font-semibold text-ink">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-graphite">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-px border-t border-graphite/15 bg-graphite/15 sm:grid-cols-2">
            <a
              href="#case-nfi"
              className="flex min-h-12 items-center justify-between gap-4 bg-surface px-5 py-4 font-mono text-[11px] font-medium uppercase text-ink transition-colors hover:text-heat focus-visible:shadow-focus"
            >
              Read the flagship case
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={flagship.repository.href}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-between gap-4 bg-surface px-5 py-4 font-mono text-[11px] font-medium uppercase text-ink transition-colors hover:text-heat focus-visible:shadow-focus"
            >
              GitHub repository
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-px bg-graphite/15 px-5 sm:grid-cols-3 sm:px-8">
        {hero.stats.map((stat) => (
          <div key={stat.label} className="bg-paper py-5 sm:px-5">
            <p className="font-display text-2xl font-semibold leading-none text-ink">{stat.value}</p>
            <p className="mt-2 max-w-sm font-mono text-[10px] font-medium uppercase leading-5 text-graphite">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { contact, sections, type SectionId } from "../data/content";

type NavProps = {
  activeSection: SectionId | null;
};

function resumeHref() {
  if (contact.resumeUrl) {
    return contact.resumeUrl;
  }

  const subject = encodeURIComponent("Résumé request");
  const body = encodeURIComponent("Hi Josiah, I'd like to see your résumé.");
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

export function Nav({ activeSection }: NavProps) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "HOME", href: "#top" },
    ...sections.map((section) => ({ ...section, href: `#${section.id}` })),
  ];
  const resumeUrl = resumeHref();
  const onHero = activeSection === null;

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${onHero ? "border-graphite/10 bg-paper/95" : "border-graphite/15 bg-paper/95"}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="font-mono text-sm font-medium uppercase text-ink">
          JD
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`border-b py-1 font-mono text-[11px] font-medium uppercase transition-colors ${
                (link.id === "home" && onHero) || activeSection === link.id
                  ? "border-heat text-ink"
                  : onHero
                    ? "border-transparent text-graphite hover:border-heat/70 hover:text-ink"
                    : "border-transparent text-graphite hover:border-heat/70 hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={resumeUrl}
            download={contact.resumeUrl ? true : undefined}
            className={`inline-flex min-h-11 items-center gap-2 rounded-[4px] border px-4 py-2 font-mono text-[11px] font-medium uppercase transition-colors duration-200 hover:border-heat hover:text-heat focus-visible:shadow-focus ${
              onHero ? "border-graphite/35 text-ink" : "border-graphite/35 text-ink"
            }`}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Resume
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-[4px] border transition-colors duration-200 hover:border-heat hover:text-heat md:hidden ${
            onHero ? "border-graphite/25 text-ink" : "border-graphite/25 text-ink"
          }`}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div className={`border-t px-5 py-4 md:hidden ${onHero ? "border-graphite/15 bg-paper" : "border-graphite/15 bg-paper"}`}>
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-mono text-sm font-medium uppercase ${
                  (link.id === "home" && onHero) || activeSection === link.id ? "text-heat" : onHero ? "text-ink" : "text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href={resumeUrl} className={`mt-2 inline-flex items-center gap-2 font-mono text-sm font-medium uppercase ${onHero ? "text-ink" : "text-ink"}`}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

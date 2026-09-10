import { sitePath } from "./site-path";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import { profile } from "./design-content";
export { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight };

export function Navigation({ page = "work" }: { page?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <a
            className="wordmark"
            href={sitePath("/")}
            aria-label="Josiah deGrasse, home"
          >
            Josiah deGrasse
            <span className="wordmark-dot" aria-hidden="true">
              .
            </span>
          </a>
          <button
            className="menu-button"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
            {open ? <X size={18} /> : <Plus size={18} />}
          </button>
          <nav
            id="main-navigation"
            className={open ? "navigation is-open" : "navigation"}
            aria-label="Main navigation"
          >
            <a
              href={sitePath("/#work")}
              aria-current={page === "work" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Work
            </a>
            <a
              href={sitePath("/about")}
              aria-current={page === "about" ? "page" : undefined}
            >
              About
            </a>
            <a
              href={sitePath("/resume")}
              aria-current={page === "resume" ? "page" : undefined}
            >
              Résumé <ArrowUpRight size={14} />
            </a>
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setOpen(false)}
            >
              Let’s talk <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-intro">
          <p className="eyebrow">Contact</p>
          <h2>Have something in mind?</h2>
          <a
            className="contact-link"
            href={sitePath(
              `mailto:${profile.email}?subject=Portfolio%20inquiry`,
            )}
          >
            Get in touch <ArrowUpRight />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Josiah deGrasse</span>
          <div>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight />
            </a>
            <a href={sitePath("/resume")}>
              Résumé <ArrowUpRight />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight />
            </a>
          </div>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
export function Layout({
  children,
  page,
}: {
  children: ReactNode;
  page?: string;
}) {
  return (
    <div className="design-site" id="top">
      <Navigation page={page} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
export function SectionLabel({
  number,
  children,
}: {
  number?: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{children}</span>
      {number && <span>{number}</span>}
    </div>
  );
}
export function Metadata({ items }: { items: [string, string][] }) {
  return (
    <dl className="project-metadata">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function CaseSection({
  id,
  number,
  label,
  title,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-section" id={id}>
      <div className="case-section-label">
        <span>{number}</span>
        <p>{label}</p>
      </div>
      <div className="case-section-body">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
export function AssetPlaceholder({
  name,
  note,
}: {
  name: string;
  note?: string;
}) {
  return (
    <figure className="asset-placeholder">
      <span className="placeholder-cross" aria-hidden="true">
        +
      </span>
      <p>Asset needed: {name}</p>
      {note && <figcaption>{note}</figcaption>}
    </figure>
  );
}
export function ImageFigure({
  src,
  alt,
  caption,
  priority = false,
  theme = "neutral",
  width = 1280,
  height = 720,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  priority?: boolean;
  theme?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    ref.current?.close();
    trigger.current?.focus();
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const restore = () => {
      document.body.style.overflow = "";
    };
    el.addEventListener("close", restore);
    return () => {
      el.removeEventListener("close", restore);
      restore();
    };
  }, []);
  return (
    <figure className={`image-figure ${theme}`}>
      <button
        ref={trigger}
        className="figure-button"
        aria-label={`Enlarge image: ${alt}`}
        onClick={() => {
          ref.current?.showModal();
          document.body.style.overflow = "hidden";
        }}
      >
        <img
          src={sitePath(src)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="figure-enlarge">
          View full size <Plus size={16} />
        </span>
      </button>
      <figcaption>{caption}</figcaption>
      <dialog
        aria-label="Full-size project image"
        className="image-dialog"
        ref={ref}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onCancel={close}
      >
        <button
          className="dialog-close"
          onClick={close}
          aria-label="Close enlarged image"
        >
          <X />
          Close
        </button>
        <div
          className="image-dialog-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable enlarged image"
        >
          <img src={sitePath(src)} alt={alt} loading="lazy" />
        </div>
        <p>{caption}</p>
      </dialog>
    </figure>
  );
}
export function ProcessFlow({
  steps,
  caption,
}: {
  steps: { title: string; detail: string }[];
  caption?: string;
}) {
  return (
    <figure className="process-figure">
      <ol className="process-flow">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="flow-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{s.title}</h3>
            <p>{s.detail}</p>
            {i < steps.length - 1 && (
              <ArrowRight aria-hidden="true" className="flow-arrow" />
            )}
          </li>
        ))}
      </ol>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
export function ConceptComparison({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`concept-comparison ${compact ? "compact" : ""}`}>
      <div className="concept-heading">
        <span>One workflow. Two approaches.</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="concept-columns">
        <div>
          <span className="concept-index">A / AI-assisted</span>
          <h3>
            Ask.
            <br /> Inspect.
            <br /> <em>Decide.</em>
          </h3>
          <p>Source-grounded help, with a person reviewing the next step.</p>
        </div>
        <div>
          <span className="concept-index">B / Rule-based</span>
          <h3>
            Check.
            <br /> Understand.
            <br /> <em>Act.</em>
          </h3>
          <p>A bounded path, with visible rules and predictable behavior.</p>
        </div>
      </div>
      <div className="concept-foot">
        Concept summary reconstructed from project notes · Original Figma assets
        pending
      </div>
    </div>
  );
}
export function NextProject({ href, title }: { href: string; title: string }) {
  return (
    <a className="next-project" href={sitePath(href)}>
      <div>
        <span className="eyebrow">Next case study</span>
        <h2>{title}</h2>
      </div>
      <ArrowUpRight />
    </a>
  );
}

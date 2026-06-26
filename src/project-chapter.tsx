import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { PortfolioProject } from "./portfolio-data";

type ProjectChapterProps = {
  project: PortfolioProject;
  projectIndex: number;
  projectCount: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function ProjectChapter({
  project,
  projectIndex,
  projectCount,
  onClose,
  onPrevious,
  onNext,
}: ProjectChapterProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "Tab") {
        const chapter = closeButtonRef.current?.closest<HTMLElement>(".pq-chapter");
        const focusable = chapter
          ? Array.from(chapter.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"))
          : [];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className={`pq-chapter pq-chapter--reel pq-chapter-${project.color}`} role="dialog" aria-modal="true" aria-labelledby="chapter-title">
      <div className="pq-reel-atmos" aria-hidden="true">
        <span className="pq-reel-beam" />
        <span className="pq-reel-vignette" />
        <span className="pq-reel-grain" />
        <span className="pq-reel-dust" />
      </div>
      <span className="pq-reel-sprockets pq-reel-sprockets-left" aria-hidden="true" />
      <span className="pq-reel-sprockets pq-reel-sprockets-right" aria-hidden="true" />
      <div className="pq-reel-counter" aria-hidden="true">
        <span className="pq-reel-lamp" />
        Reel {String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}
      </div>
      <div className="pq-chapter-film-edge" aria-hidden="true" />
      <header className="pq-chapter-header">
        <div>
          <span>{project.chapter}</span>
          <p>{project.room}</p>
        </div>
        <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close project chapter">
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="pq-chapter-hero">
        <div className="pq-chapter-title-wrap">
          <p>{project.subtitle}</p>
          <h2 id="chapter-title">{project.title}</h2>
          <blockquote>“{project.logline}”</blockquote>
        </div>
        <dl className="pq-chapter-credits">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
      </div>

      <div className="pq-contact-sheet" aria-label="Project evidence">
        {project.evidence.map((item, index) => (
          <div key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      <div className="pq-chapter-story">
        {project.story.map((section, index) => (
          <article key={section.heading}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pq-outcome">
        <span>Final frame</span>
        <p>{project.outcome}</p>
      </div>

      <div className="pq-skill-strip" aria-label="Skills used">
        {project.skills.map((skill) => <span key={skill}>{skill}</span>)}
      </div>

      <footer className="pq-chapter-footer">
        <button type="button" onClick={onPrevious}>
          <ArrowLeft aria-hidden="true" />
          Previous
        </button>
        <span>{projectIndex + 1} / {projectCount}</span>
        <button type="button" onClick={onNext}>
          Next
          <ArrowRight aria-hidden="true" />
        </button>
      </footer>

      <div className="pq-chapter-film-edge pq-chapter-film-edge--bottom" aria-hidden="true" />
    </div>
  );
}

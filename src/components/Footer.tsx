import { Github, Linkedin, Mail } from "lucide-react";
import { contact } from "../data/content";

export function Footer() {
  return (
    <footer className="border-t border-graphite/15 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Josiah deGrasse</p>
          <p className="mt-1 font-mono text-xs uppercase text-graphite">© 2026 Josiah deGrasse</p>
        </div>
        <div className="flex items-center gap-4">
          <a href={`mailto:${contact.email}`} aria-label="Email Josiah deGrasse" className="text-graphite hover:text-heat">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href={contact.linkedin} aria-label="Josiah deGrasse on LinkedIn" className="text-graphite hover:text-heat">
            <Linkedin className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href={contact.github} aria-label="Josiah deGrasse on GitHub" className="text-graphite hover:text-heat">
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

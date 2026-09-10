import { GameErrorBoundary } from "./game-error-boundary";
import { lazy, Suspense, useEffect } from "react";
import { DesignHome } from "./design-home";
import { NfiCaseStudy, RedHatCaseStudy } from "./design-case-studies";
import {
  AboutPage,
  ResumePage,
  SecondaryProject,
  NotFound,
} from "./design-about";
import { profile } from "./design-content";
import "./design-system.css";
import "./design-editorial.css";
const LegacyPortfolioPage = lazy(() =>
  import("./legacy-portfolio-page").then((m) => ({ default: m.PortfolioPage })),
);
const titles: Record<string, [string, string]> = {
  nfi: [
    "Designing an AI-assisted decision system for food scientists",
    "New Food Innovation: Human Factors, AI-assisted workflows, and evidence-based decision support.",
  ],
  "red-hat": [
    "Red Hat OpenShift AI — Less friction, more control",
    "Eight interviews, two competing concepts, and a design direction focused on trust in enterprise AI workflows.",
  ],
  headtap: [
    "HeadTap — Music discovery",
    "Designing discovery around listening taste, time, and place.",
  ],
  lacrosse: [
    "Made for the field — Lacrosse & physical design",
    "A maker’s perspective shaped by physical design, teamwork, and years of playing.",
  ],
  helfrich: [
    "Helfrich Brothers — Manufacturing design",
    "Precision, clear communication, and design for the factory floor.",
  ],
  about: [
    "About Josiah",
    "Human Factors, AI product design, and a maker’s curiosity.",
  ],
  resume: ["Résumé", profile.title],
  home: [
    profile.title,
    "I build AI-assisted products that connect evidence, explain decisions, and keep people in control. Selected work by Josiah deGrasse.",
  ],
  missing: [
    "Page not found",
    "Return to Josiah deGrasse’s selected design work.",
  ],
  play: [
    "Interactive portfolio experiment",
    "An earlier 3D portfolio experiment by Josiah deGrasse.",
  ],
};
export function PortfolioPage() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const query = new URLSearchParams(window.location.search);
  const legacy =
    path === "/play" ||
    path === "/portfolio/play" ||
    query.has("world") ||
    query.has("mission");
  const project = path.match(/^\/(?:work|portfolio\/projects)\/([^/]+)$/)?.[1];
  const home = ["/", "/portfolio", "/portfolio/case-studies", "/work"].includes(
    path,
  );
  const about = path === "/about" || path === "/portfolio/about";
  const resume = path === "/resume";
  const key = legacy
    ? "play"
    : project && titles[project]
      ? project
      : home
        ? "home"
        : about
          ? "about"
          : resume
            ? "resume"
            : "missing";
  useEffect(() => {
    const [title, description] = titles[key];
    document.title =
      key === "home"
        ? `Josiah deGrasse — ${title}`
        : `${title} — Josiah deGrasse`;
    const canonical =
      profile.origin +
      (key === "home"
        ? "/"
        : project && titles[project]
          ? `/work/${project}`
          : key === "missing"
            ? path
            : `/${key}`);
    const setMeta = (attribute: string, name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${name}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", document.title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", document.title);
    setMeta("name", "twitter:description", description);
    const image =
      key === "nfi"
        ? "/images/nfi/nfi-decision.webp"
        : key === "lacrosse"
          ? "/images/lacrosse/lacrosse-head-cad.webp"
          : key === "about"
            ? "/images/lacrosse/lacrosse-action.webp"
            : key === "home"
              ? "/images/portfolio-preview.png"
              : null;
    for (const [attr, name] of [
      ["property", "og:image"],
      ["name", "twitter:image"],
    ]) {
      if (image) setMeta(attr, name, profile.origin + image);
      else document.querySelector(`meta[${attr}="${name}"]`)?.remove();
    }
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
    if (key === "missing" || legacy)
      setMeta("name", "robots", "noindex,follow");
  }, [key, path, project, legacy]);
  if (legacy)
    return (
      <GameErrorBoundary>
        <Suspense
          fallback={
            <div className="loading-experience">
              Loading the interactive experiment…{" "}
              <a href="/">Return to portfolio</a>
            </div>
          }
        >
          <LegacyPortfolioPage />
        </Suspense>
      </GameErrorBoundary>
    );
  if (project === "nfi") return <NfiCaseStudy />;
  if (project === "red-hat") return <RedHatCaseStudy />;
  if (project && ["headtap", "lacrosse", "helfrich"].includes(project))
    return <SecondaryProject id={project} />;
  if (home) return <DesignHome />;
  if (about) return <AboutPage />;
  if (resume) return <ResumePage />;
  return <NotFound />;
}

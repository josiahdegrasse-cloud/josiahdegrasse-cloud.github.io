import { useEffect, useRef, type ReactNode } from "react";

/** Scroll position drives the composition; no timer, scroll capture, or render loop. */
export function ScrollProjectVisual({ href, label, children }: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 800px) and (min-height: 600px)");
    let visible = false;
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (motion.matches || !visible) return;
      const bounds = element.getBoundingClientRect();
      // Face-on at viewport center; reverse naturally when scrolling upward.
      const progress = Math.max(-1, Math.min(1,
        (bounds.top + bounds.height / 2 - window.innerHeight / 2) /
        ((window.innerHeight + bounds.height) / 2),
      ));
      element.style.setProperty("--scroll-position", progress.toFixed(4));
      if (desktop.matches) {
        const travel = bounds.height - element.firstElementChild!.getBoundingClientRect().height;
        const t = Math.max(0, Math.min(1, (100 - bounds.top) / Math.max(1, travel)));
        // Rotate into view, hold still for reading, then gently turn away.
        const turn = t < .46 ? 58 * (1 - t / .46) ** 2 : t > .78 ? -22 * ((t - .78) / .22) ** 2 : 0;
        element.style.setProperty("--scene-turn", `${turn.toFixed(3)}deg`);
        element.style.setProperty("--scene-entry", Math.max(0, 1 - t / .5).toFixed(4));
        element.style.setProperty("--scene-progress", t.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame && visible && !motion.matches) frame = requestAnimationFrame(paint);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      element.style.removeProperty("--scroll-position");
      element.toggleAttribute("data-scroll-scene", !motion.matches && desktop.matches);
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "100px" });
    syncMotion();
    observer.observe(element);
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", syncMotion);
    desktop.addEventListener("change", syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", syncMotion);
      desktop.removeEventListener("change", syncMotion);
    };
  }, []);
  return <div ref={ref} className="project-scroll-track">
    <a className="work-card-visual scroll-project-visual" href={href} aria-label={label}>
      {children}
      <span className="project-scroll-progress" aria-hidden="true"><span /></span>
    </a>
  </div>;
}

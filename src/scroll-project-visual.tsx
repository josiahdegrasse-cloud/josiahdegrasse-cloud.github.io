import { useEffect, useRef, type ReactNode } from "react";

/** Scroll position drives the composition; no timer, scroll capture, or render loop. */
export function ScrollProjectVisual({ href, label, children }: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    };
    const schedule = () => {
      if (!frame && visible && !motion.matches) frame = requestAnimationFrame(paint);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      element.style.removeProperty("--scroll-position");
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "100px" });
    observer.observe(element);
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", syncMotion);
    };
  }, []);
  return <a ref={ref} className="work-card-visual scroll-project-visual" href={href} aria-label={label}>
    {children}
  </a>;
}

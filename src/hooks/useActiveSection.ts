import { useEffect, useState } from "react";
import type { SectionId } from "../data/content";

export function useActiveSection(sectionIds: SectionId[]) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const anchor = window.scrollY + window.innerHeight * 0.32;
      const current = sectionIds.reduce<SectionId | null>((active, id) => {
        const element = document.getElementById(id);
        if (!element) return active;
        return element.offsetTop <= anchor ? id : active;
      }, null);

      setActiveSection(current);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionIds]);

  return activeSection;
}

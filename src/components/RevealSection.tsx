import type { PropsWithChildren } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type RevealSectionProps = PropsWithChildren<{
  id: string;
  className?: string;
  labelledBy?: string;
}>;

export function RevealSection({ id, className = "", labelledBy, children }: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={`section-anchor ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

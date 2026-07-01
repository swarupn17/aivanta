"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` when scrolled into view. `suffix` appends e.g. "+", "%".
 * (Ported from the old wireCounters — Indian number formatting preserved.)
 */
export function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 1400,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.floor(eased * value).toLocaleString("en-IN") + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      setDisplay(value.toLocaleString("en-IN") + suffix);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix, durationMs]);

  return <span ref={ref}>{display}</span>;
}

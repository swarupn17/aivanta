"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeBackdrop } from "@/components/marketing/ThemeBackdrop";

const AUTOPLAY_MS = 9000;

/**
 * Hero carousel — stacked-grid slides (banner is always as tall as the tallest
 * slide, never resizes on rotate). Autoplays, pauses on hover/focus, supports
 * arrows, dots and keyboard focus. (Ported from the old wireCarousel + markup.)
 */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideCount = 2;

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slideCount),
      AUTOPLAY_MS
    );
  }, [stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const go = (n: number) => {
    setIndex((n + slideCount) % slideCount);
    start();
  };

  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
    >
      <div className="carousel-track relative">
        {/* Slide 1 — hero */}
        <div className={cn("carousel-slide", index === 0 && "is-active")}>
          <div className="relative bg-gradient-to-br from-navy via-navy-700 to-navy-900">
            <ThemeBackdrop />
            <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky ring-1 ring-white/20">
                  National Student Awareness Initiative
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] md:text-5xl lg:text-6xl">
                  Empowering today&apos;s students to build{" "}
                  <span className="text-sky">tomorrow&apos;s India</span>
                </h1>
                <p className="mt-5 max-w-xl text-lg text-slate-200">
                  Annual school assessments in Financial Intelligence, Cyber
                  Intelligence and Artificial Intelligence for Classes 1–10 — built
                  on awareness, skills and values, never rote memorisation.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/registration"
                    className="rounded-lg bg-orange px-6 py-3.5 font-bold text-navy transition-colors hover:bg-orange-600"
                  >
                    Register Your School
                  </Link>
                  <Link
                    href="/assessments"
                    className="rounded-lg bg-white/10 px-6 py-3.5 font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/20"
                  >
                    Explore Assessments
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { code: "FIA", label: "Financial Intelligence", offset: "" },
                    { code: "CIA", label: "Cyber Intelligence", offset: "mt-8" },
                    { code: "AIA", label: "Artificial Intelligence", offset: "" },
                  ].map((c) => (
                    <div
                      key={c.code}
                      className={cn(
                        "rounded-2xl bg-white/10 p-6 text-center ring-1 ring-white/15 backdrop-blur",
                        c.offset
                      )}
                    >
                      <p className="font-display text-3xl font-extrabold text-sky">
                        {c.code}
                      </p>
                      <p className="mt-2 text-xs text-slate-200">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 — Viksit Bharat */}
        <div className={cn("carousel-slide", index === 1 && "is-active")}>
          <div className="relative bg-gradient-to-br from-navy-900 via-navy to-navy-800">
            <ThemeBackdrop />
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky ring-1 ring-white/20">
                National Mission · Viksit Bharat 2047
              </span>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
                Not a competition. A{" "}
                <span className="text-sky">nation-building movement.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-200">
                A traditional olympiad asks &ldquo;Who is the best?&rdquo; — we ask
                &ldquo;Is every child ready for the future?&rdquo; Aligned with
                India&rsquo;s Viksit Bharat 2047 vision, we measure readiness, not
                rank.
              </p>
              <Link
                href="/viksit-bharat"
                className="mt-8 inline-block rounded-lg bg-orange px-6 py-3.5 font-bold text-navy transition-colors hover:bg-orange-600"
              >
                Our Viksit Bharat Vision
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2.5">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={cn("carousel-dot", index === i && "is-active")}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={index === i}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/30 sm:left-5"
        >
          <ArrowIcon dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/30 sm:right-5"
        >
          <ArrowIcon dir="right" />
        </button>
      </div>
    </section>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

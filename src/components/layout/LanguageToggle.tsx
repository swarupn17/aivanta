"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "asf-lang";

/**
 * Language switcher. Full translation is a future phase; for now this remembers
 * the visitor's choice and sets <html lang>. (Ported from the old wireLanguage.)
 */
export function LanguageToggle() {
  const { languages } = siteConfig;
  const defaultCode = languages.find((l) => l.active)?.code ?? languages[0].code;
  const [current, setCurrent] = useState<string>(defaultCode);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const code = saved ?? defaultCode;
    setCurrent(code);
    document.documentElement.setAttribute("lang", code);
  }, [defaultCode]);

  const select = (code: string) => {
    setCurrent(code);
    document.documentElement.setAttribute("lang", code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore storage failures (private mode) */
    }
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Choose language">
      {languages.map((lang, i) => {
        const on = lang.code === current;
        return (
          <span key={lang.code} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-white/40" aria-hidden="true">
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => select(lang.code)}
              aria-pressed={on}
              className={cn(
                "px-1 hover:text-sky",
                on && "font-bold text-sky"
              )}
            >
              {lang.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}

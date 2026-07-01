import { siteConfig } from "@/config/site";

/**
 * Announcement ticker (homepage). Renders the list twice so the CSS marquee
 * loops seamlessly (the -50% keyframe assumes a duplicated track).
 */
export function Ticker() {
  const items = siteConfig.announcements;
  if (!items.length) return null;

  const line = (keyPrefix: string) =>
    items.map((text, i) => (
      <span key={`${keyPrefix}-${i}`} className="px-8">
        {text}
      </span>
    ));

  return (
    <div className="border-y border-dusty/40 bg-mist">
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <span className="mr-4 shrink-0 rounded-md bg-navy px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          Notices
        </span>
        <div className="ticker-wrap flex-1 overflow-hidden">
          <div
            className="ticker-track py-2.5 text-sm font-medium text-navy"
            aria-hidden="true"
          >
            {line("a")}
            {line("b")}
          </div>
          <span className="sr-only">Announcements: {items.join(". ")}</span>
        </div>
      </div>
    </div>
  );
}

import {
  IconRupeeCoin,
  IconGrowthChart,
  IconShieldLock,
  IconFingerprint,
  IconChip,
  IconNeuralNet,
  IconSparkleAI,
  IconLockKey,
  IconPiggyBank,
} from "@/components/ui/icons";

/**
 * Faint scattered themed icons (finance / cyber / AI) for dark sections.
 * Purely decorative texture — sits behind content, ignores pointer events,
 * and is hidden from assistive tech.
 */
const GLYPHS = [
  { Icon: IconRupeeCoin, className: "left-[6%] top-[18%] h-14 w-14 rotate-[-12deg]" },
  { Icon: IconShieldLock, className: "left-[20%] bottom-[12%] h-10 w-10 rotate-6" },
  { Icon: IconChip, className: "left-[38%] top-[10%] h-12 w-12 rotate-3" },
  { Icon: IconNeuralNet, className: "right-[30%] bottom-[16%] h-16 w-16 -rotate-6" },
  { Icon: IconGrowthChart, className: "right-[8%] top-[22%] h-14 w-14 rotate-6" },
  { Icon: IconFingerprint, className: "right-[18%] top-[55%] h-11 w-11 rotate-[-8deg]" },
  { Icon: IconSparkleAI, className: "left-[48%] bottom-[8%] h-9 w-9 rotate-6" },
  { Icon: IconLockKey, className: "left-[10%] top-[55%] h-10 w-10 rotate-3" },
  { Icon: IconPiggyBank, className: "right-[44%] top-[14%] h-10 w-10 -rotate-3" },
];

export function ThemeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {GLYPHS.map(({ Icon, className }, i) => (
        <Icon key={i} className={`absolute text-white/[0.06] ${className}`} />
      ))}
    </div>
  );
}

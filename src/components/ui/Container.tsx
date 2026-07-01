import { cn } from "@/lib/utils";

/** Centered max-width wrapper used across sections. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4", className)}>{children}</div>
  );
}

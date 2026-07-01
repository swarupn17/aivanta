import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — merge conditional class names and de-dupe conflicting Tailwind classes.
 * Usage: cn("px-2", isActive && "bg-navy", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

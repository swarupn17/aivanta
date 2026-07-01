import { cn } from "@/lib/utils";

/** Shared input styling so every field looks identical across forms. */
export const fieldClasses =
  "mt-1 w-full rounded-lg px-3 py-2.5 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-dusty-600";

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("block", className)}>
      {children}
    </label>
  );
}

export function LabelText({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-slate-700">{children}</span>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export function FormAlert({
  tone = "success",
  children,
}: {
  tone?: "success" | "error";
  children: React.ReactNode;
}) {
  const styles =
    tone === "success"
      ? "bg-green-50 text-green-800 ring-green-200"
      : "bg-red-50 text-red-800 ring-red-200";
  return (
    <div
      role="status"
      className={cn("rounded-lg px-4 py-3 text-sm ring-1", styles)}
    >
      {children}
    </div>
  );
}

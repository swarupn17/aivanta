import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { listContactMessages, canApprove } from "@/features/schools/queries";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) redirect("/portal");

  const messages = await listContactMessages();

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-navy">
        Contact messages
      </h1>
      <p className="mt-2 text-slate-600">
        Enquiries submitted through the website contact form ({messages.length}).
      </p>

      <section className="mt-8">
        {messages.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            No messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="rounded-xl bg-white p-5 ring-1 ring-slate-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-navy">
                    {m.name}{" "}
                    <span className="font-normal text-slate-500">
                      · {m.role ?? "\u2014"}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 text-sm text-dusty-600">
                    <a className="hover:underline" href={`mailto:${m.email}`}>
                      {m.email}
                    </a>
                    {m.phone && <span className="text-slate-400">{m.phone}</span>}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{m.message}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(m.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

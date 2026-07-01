import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/features/auth/queries";

export const metadata: Metadata = {
  title: "Login",
  description: "Secure login for schools, coordinators and administrators.",
};

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const user = await getCurrentUser();
  if (user) redirect("/portal");

  return <LoginForm />;
}

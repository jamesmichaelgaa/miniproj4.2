import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("profiles").select("display_name,currency").eq("id", user.id).maybeSingle() : { data: null };
  return <div className="grid gap-6"><PageHeader title="Settings" description="Your account and regional preferences."/><section className="grid gap-3 rounded-xl border bg-card p-5 text-sm"><h2 className="text-lg font-semibold">Profile</h2><p><span className="text-muted-foreground">Email: </span>{user?.email ?? "Not signed in"}</p><p><span className="text-muted-foreground">Name: </span>{profile?.display_name ?? "Not set"}</p><p><span className="text-muted-foreground">Currency: </span>{profile?.currency ?? "PHP (Philippine Peso)"}</p></section></div>;
}

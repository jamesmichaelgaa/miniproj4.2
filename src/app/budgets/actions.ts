"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveBudget(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const category_id = String(formData.get("category_id"));
  const month = String(formData.get("month"));
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000 || !/^[0-9a-f-]{36}$/i.test(category_id) || !/^\d{4}-\d{2}$/.test(month)) redirect("/budgets?error=validation");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("budgets").upsert({ user_id: user.id, category_id, month: `${month}-01`, amount: Math.round(amount * 100) }, { onConflict: "user_id,category_id,month" });
  if (error) redirect("/budgets?error=save");
  revalidatePath("/"); revalidatePath("/budgets"); revalidatePath("/reports");
  redirect("/budgets?saved=1");
}

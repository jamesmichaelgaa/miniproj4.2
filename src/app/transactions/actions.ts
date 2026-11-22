"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveTransaction(formData: FormData) {
  const type = String(formData.get("type"));
  const amount = Number(formData.get("amount"));
  const category_id = String(formData.get("category_id"));
  const description = String(formData.get("description") ?? "").trim();
  const transaction_date = String(formData.get("transaction_date"));
  if (!(["income", "expense"].includes(type)) || !Number.isFinite(amount) || amount <= 0 || amount > 10_000_000 || !/^[0-9a-f-]{36}$/i.test(category_id) || description.length < 1 || description.length > 200 || !/^\d{4}-\d{2}-\d{2}$/.test(transaction_date)) redirect("/transactions?error=validation");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("transactions").insert({ user_id: user.id, type, category_id, description, transaction_date, amount: Math.round(amount * 100) });
  if (error) redirect("/transactions?error=save");
  revalidatePath("/"); revalidatePath("/transactions"); revalidatePath("/budgets"); revalidatePath("/reports");
  redirect("/transactions?saved=1");
}

export async function updateTransaction(formData: FormData) {
  const id=String(formData.get("id")??""); const type=String(formData.get("type")); const amount=Number(formData.get("amount")); const category_id=String(formData.get("category_id")); const description=String(formData.get("description")??"").trim(); const transaction_date=String(formData.get("transaction_date"));
  if(!/^[0-9a-f-]{36}$/i.test(id)||!(["income","expense"].includes(type))||!Number.isFinite(amount)||amount<=0||amount>10_000_000||!/^[0-9a-f-]{36}$/i.test(category_id)||description.length<1||description.length>200||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(transaction_date)) redirect("/transactions?error=validation");
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const {error}=await supabase.from("transactions").update({type,amount:Math.round(amount*100),category_id,description,transaction_date}).eq("id",id);
  if(error) redirect("/transactions?error=save");
  revalidatePath("/");revalidatePath("/transactions");revalidatePath("/budgets");revalidatePath("/reports");redirect("/transactions?saved=1");
}

export async function deleteTransaction(formData: FormData) {
  const id=String(formData.get("id")??""); if(!/^[0-9a-f-]{36}$/i.test(id)) redirect("/transactions?error=validation");
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const {error}=await supabase.from("transactions").delete().eq("id",id); if(error) redirect("/transactions?error=delete");
  revalidatePath("/");revalidatePath("/transactions");revalidatePath("/budgets");revalidatePath("/reports");redirect("/transactions?deleted=1");
}

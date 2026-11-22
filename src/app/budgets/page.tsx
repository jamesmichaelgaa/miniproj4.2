import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { saveBudget } from "@/app/budgets/actions";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/money";
import { mockCategories } from "@/data/mock/categories";

export const metadata: Metadata = { title: "Budgets" };

export default async function BudgetsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const month = new Date().toISOString().slice(0,7);
  const nextMonth = new Date(Date.UTC(Number(month.slice(0,4)), Number(month.slice(5,7)), 1)).toISOString().slice(0,10);
  const supabase = await createClient();
  const [{ data: categories }, { data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("id,name,type").eq("type", "expense").order("name"),
    supabase.from("budgets").select("id,category_id,amount,month,categories(name)").eq("month", `${month}-01`),
    supabase.from("transactions").select("category_id,amount").eq("type", "expense").gte("transaction_date", `${month}-01`).lt("transaction_date", nextMonth),
  ]);
  const cats = categories?.length ? categories : mockCategories.filter((c) => c.type === "expense");
  const spend = new Map<string,number>(); transactions?.forEach((t) => spend.set(t.category_id, (spend.get(t.category_id) ?? 0) + t.amount));
  return <div className="grid gap-6"><PageHeader title="Budgets" description="Set monthly limits by spending category and monitor progress." />
    {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm">Could not save the budget. Check the amount and category.</p>}{saved && <p role="status" className="rounded-md bg-secondary p-3 text-sm">Budget saved.</p>}
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Set a monthly budget</h2><form action={saveBudget} className="mt-4 grid gap-4 sm:grid-cols-3"><label className="grid gap-1.5 text-sm">Month<input type="month" name="month" required defaultValue={month} className="h-10 rounded-md border bg-background px-3" /></label><label className="grid gap-1.5 text-sm">Category<select name="category_id" required className="h-10 rounded-md border bg-background px-3">{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="grid gap-1.5 text-sm">Limit (₱)<input name="amount" type="number" min="0.01" max="10000000" step="0.01" required className="h-10 rounded-md border bg-background px-3" /></label><button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground sm:col-span-3 sm:justify-self-end">Save budget</button></form></section>
    <section className="grid gap-4 sm:grid-cols-2">{budgets?.length ? budgets.map((b) => { const used = spend.get(b.category_id) ?? 0; const pct = b.amount ? Math.round(used / b.amount * 100) : 0; const rel=b.categories as unknown as {name:string}|{name:string}[]|null; const name=(Array.isArray(rel)?rel[0]?.name:rel?.name)??"Category"; return <article key={b.id} className="rounded-xl border bg-card p-5"><div className="flex justify-between gap-4"><h2 className="font-semibold">{name}</h2><span className="text-sm tabular-nums">{Math.min(100,pct)}%</span></div><div className="mt-4 h-2 overflow-hidden rounded bg-muted"><div className={`h-full ${pct >= 100 ? "bg-destructive" : "bg-primary"}`} style={{width:`${Math.min(100,pct)}%`}} /></div><p className="mt-3 text-sm text-muted-foreground">{formatCurrency(used)} spent of {formatCurrency(b.amount)}</p></article>; }) : <p className="rounded-xl border bg-card p-5 text-sm text-muted-foreground sm:col-span-2">No budgets for this month yet.</p>}</section>
  </div>;
}

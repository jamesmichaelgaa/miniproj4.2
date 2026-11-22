import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/money";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const supabase = await createClient();
  const now = new Date(); const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)).toISOString().slice(0,10);
  const { data: transactions } = await supabase.from("transactions").select("type,amount,transaction_date,categories(name)").gte("transaction_date", start).order("transaction_date");
  const monthMap = new Map<string,{income:number;expense:number}>();
  transactions?.forEach((t) => { const month=t.transaction_date.slice(0,7); const row=monthMap.get(month) ?? {income:0,expense:0}; const type=t.type as "income"|"expense"; row[type] += t.amount; monthMap.set(month,row); });
  const categoryMap = new Map<string,number>(); transactions?.filter(t=>t.type==="expense").forEach(t=>{const rel=t.categories as unknown as {name:string}|{name:string}[]|null;const name=(Array.isArray(rel)?rel[0]?.name:rel?.name) ?? "Other";categoryMap.set(name,(categoryMap.get(name)??0)+t.amount);});
  const monthKeys=Array.from({length:6},(_,i)=>new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-5+i,1)).toISOString().slice(0,7));
  return <div className="grid gap-6"><PageHeader title="Reports" description="Six-month income, spending, and category summaries." />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Monthly cash flow</h2><div className="mt-4 grid gap-3">{monthKeys.map(month=>{const row=monthMap.get(month)??{income:0,expense:0};return <div key={month} className="grid gap-2 border-b pb-3 last:border-0 sm:grid-cols-[100px_1fr_1fr]"><strong className="text-sm">{month}</strong><span className="text-sm text-emerald-700">Income {formatCurrency(row.income)}</span><span className="text-sm text-rose-700">Expenses {formatCurrency(row.expense)}</span></div>})}</div>{!transactions?.length&&<p className="mt-3 text-sm text-muted-foreground">Add transactions to see your report.</p>}</section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Spending by category</h2><ul className="mt-4 grid gap-3">{Array.from(categoryMap.entries()).sort((a,b)=>b[1]-a[1]).map(([name,amount])=><li key={name} className="flex justify-between border-b pb-2 text-sm last:border-0"><span>{name}</span><strong>{formatCurrency(amount)}</strong></li>)}</ul>{!categoryMap.size&&<p className="mt-3 text-sm text-muted-foreground">No expense data for this period.</p>}</section>
  </div>;
}

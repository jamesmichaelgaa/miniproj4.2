import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Amount } from "@/components/shared/amount";
import { saveTransaction } from "@/app/transactions/actions";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/dates";
import { mockCategories } from "@/data/mock/categories";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionRowActions } from "@/components/transactions/transaction-row-actions";
import { updateTransaction, deleteTransaction } from "@/app/transactions/actions";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; deleted?: string }> }) {
  const { error, saved, deleted } = await searchParams;
  const supabase = await createClient();
  const [{ data: categories }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("id,name,type").order("name"),
    supabase.from("transactions").select("id,type,amount,description,transaction_date,category_id,categories(name)").order("transaction_date", { ascending: false }).limit(100),
  ]);
  const available = categories?.length ? categories : mockCategories;
  return <div className="grid gap-6"><PageHeader title="Transactions" description="Record income and spending, then review your recent activity." />
    {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm">Could not save that transaction. Check the fields and category, then try again.</p>}{saved && <p role="status" className="rounded-md bg-secondary p-3 text-sm">Transaction saved.</p>}{deleted&&<p role="status" className="rounded-md bg-secondary p-3 text-sm">Transaction deleted.</p>}
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Add a transaction</h2><TransactionForm action={saveTransaction} categories={available}/></section>
    <section className="overflow-hidden rounded-xl border bg-card"><h2 className="p-5 text-lg font-semibold">Recent transactions</h2>{transactions?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-y bg-muted/40 text-muted-foreground"><tr><th className="p-3">Date</th><th className="p-3">Description</th><th className="p-3">Category</th><th className="p-3">Type</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{transactions.map((tx) => { const rel=tx.categories as unknown as {name:string}|{name:string}[]|null;const name=(Array.isArray(rel)?rel[0]?.name:rel?.name)??"—";const transaction={id:tx.id,type:tx.type as "income"|"expense",amount:tx.amount,categoryId:tx.category_id,description:tx.description,date:tx.transaction_date};return <tr key={tx.id} className="border-b last:border-0"><td className="p-3">{formatDate(tx.transaction_date)}</td><td className="p-3">{tx.description}</td><td className="p-3">{name}</td><td className="p-3 capitalize">{tx.type}</td><td className="p-3 text-right"><Amount value={tx.amount} /></td><td className="p-3"><TransactionRowActions transaction={transaction} categories={available} updateAction={updateTransaction} deleteAction={deleteTransaction}/></td></tr>;})}</tbody></table></div> : <p className="p-5 text-sm text-muted-foreground">No saved transactions yet. Add your first income or expense above.</p>}</section>
  </div>;
}

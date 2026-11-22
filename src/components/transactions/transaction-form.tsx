"use client";

import { useState } from "react";
import type { Category, TransactionType } from "@/types/finance";

export function TransactionForm({ action, categories }: { action: (formData: FormData) => void | Promise<void>; categories: Pick<Category,"id"|"name"|"type">[] }) {
  const [type,setType]=useState<TransactionType>("expense");
  const filtered=categories.filter(category=>category.type===type);
  return <form action={action} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <label className="grid gap-1.5 text-sm">Type<select name="type" required value={type} onChange={event=>setType(event.target.value as TransactionType)} className="h-10 rounded-md border bg-background px-3"><option value="expense">Expense</option><option value="income">Income</option></select></label>
    <label className="grid gap-1.5 text-sm">Amount (₱)<input name="amount" type="number" min="0.01" max="10000000" step="0.01" required className="h-10 rounded-md border bg-background px-3" /></label>
    <label className="grid gap-1.5 text-sm">Category<select key={type} name="category_id" required className="h-10 rounded-md border bg-background px-3">{filtered.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <label className="grid gap-1.5 text-sm">Date<input name="transaction_date" type="date" required defaultValue={new Date().toISOString().slice(0,10)} className="h-10 rounded-md border bg-background px-3" /></label>
    <label className="grid gap-1.5 text-sm">Description<input name="description" maxLength={200} required className="h-10 rounded-md border bg-background px-3" /></label>
    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground sm:col-span-2 lg:col-span-5 lg:justify-self-end">Save transaction</button>
  </form>;
}

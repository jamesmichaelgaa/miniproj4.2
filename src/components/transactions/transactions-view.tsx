"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Receipt, Trash2 } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { CategoryIcon } from "@/components/shared/category-icon";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { TransactionSheet, type TransactionSheetState } from "@/components/transactions/transaction-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatDate } from "@/lib/dates";
import {
  emptyFormValues,
  formValuesFromTransaction,
  type ValidatedTransactionInput,
} from "@/lib/finance/transaction-form";
import type { Category, IsoDate, Transaction, TransactionType } from "@/types/finance";

type Filter = "all" | TransactionType;

interface TransactionsViewProps {
  initialTransactions: Transaction[];
  categories: Category[];
  today: IsoDate;
}

function sortNewestFirst(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function TransactionsView({ initialTransactions, categories, today }: TransactionsViewProps) {
  const [transactions, setTransactions] = useState(() => sortNewestFirst(initialTransactions));
  const [filter, setFilter] = useState<Filter>("all");
  const [sheet, setSheet] = useState<TransactionSheetState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [notice, setNotice] = useState("");

  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const visible = filter === "all" ? transactions : transactions.filter((transaction) => transaction.type === filter);

  function openAdd(type: TransactionType) {
    setSheet({ mode: "add", formKey: `add-${type}-${Date.now()}`, initialValues: emptyFormValues(type, today) });
  }

  function openEdit(transaction: Transaction) {
    setSheet({
      mode: "edit",
      transactionId: transaction.id,
      formKey: `edit-${transaction.id}`,
      initialValues: formValuesFromTransaction(transaction),
    });
  }

  function closeSheet() {
    setSheet(null);
  }

  function handleSubmit(value: ValidatedTransactionInput) {
    if (sheet?.mode === "edit" && sheet.transactionId) {
      const { transactionId } = sheet;
      setTransactions((current) =>
        sortNewestFirst(current.map((item) => (item.id === transactionId ? { ...item, ...value } : item))),
      );
      setNotice(`Updated "${value.description}".`);
    } else {
      setTransactions((current) => sortNewestFirst([{ id: `local-${crypto.randomUUID()}`, ...value }, ...current]));
      setNotice(`Added ${value.type} "${value.description}".`);
    }
    closeSheet();
  }

  function handleDelete(transaction: Transaction) {
    setTransactions((current) => current.filter((item) => item.id !== transaction.id));
    setNotice(`Deleted "${transaction.description}".`);
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="Record, review and correct your income and spending."
        actions={
          <>
            <Button variant="outline" onClick={() => openAdd("income")}>
              <Plus data-icon="inline-start" />
              Add income
            </Button>
            <Button onClick={() => openAdd("expense")}>
              <Plus data-icon="inline-start" />
              Add expense
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          variant="outline"
          value={filter}
          onValueChange={(next) => next && setFilter(next as Filter)}
          aria-label="Filter transactions"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="income">Income</ToggleGroupItem>
          <ToggleGroupItem value="expense">Expenses</ToggleGroupItem>
        </ToggleGroup>
        <Badge variant="outline" className="w-fit">
          Sample data - edits reset on refresh
        </Badge>
      </div>

      <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {notice}
      </p>

      <Card>
        <CardContent>
          {visible.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt />
                </EmptyMedia>
                <EmptyTitle>No transactions yet</EmptyTitle>
                <EmptyDescription>Add an income or expense to see it listed here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col divide-y">
              {visible.map((transaction) => {
                const category = categoryById.get(transaction.categoryId);
                return (
                  <li key={transaction.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <CategoryIcon name={category?.icon} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{transaction.description}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {category?.name ?? "Uncategorized"} · {formatDate(transaction.date)}
                      </span>
                    </div>
                    <Amount
                      value={transaction.amount}
                      tone={transaction.type}
                      className="shrink-0 text-sm font-medium"
                    />
                    <div className="flex shrink-0 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${transaction.description}`}
                        onClick={() => openEdit(transaction)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${transaction.description}`}
                        onClick={() => setPendingDelete(transaction)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <TransactionSheet
        state={sheet}
        categories={categories}
        today={today}
        onSubmit={handleSubmit}
        onClose={closeSheet}
      />
      <DeleteTransactionDialog
        transaction={pendingDelete}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

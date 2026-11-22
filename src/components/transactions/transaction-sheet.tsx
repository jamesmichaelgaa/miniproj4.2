"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionForm } from "@/components/transactions/transaction-form";
import type { TransactionFormValues, ValidatedTransactionInput } from "@/lib/finance/transaction-form";
import type { Category, IsoDate } from "@/types/finance";

export interface TransactionSheetState {
  mode: "add" | "edit";
  /** Set when editing an existing record. */
  transactionId?: string;
  /** Changes whenever a different record or type is opened, so the form remounts with fresh values. */
  formKey: string;
  initialValues: TransactionFormValues;
}

interface TransactionSheetProps {
  state: TransactionSheetState | null;
  categories: Category[];
  today: IsoDate;
  onSubmit: (value: ValidatedTransactionInput) => void;
  onClose: () => void;
}

export function TransactionSheet({ state, categories, today, onSubmit, onClose }: TransactionSheetProps) {
  const isEdit = state?.mode === "edit";

  return (
    <Sheet open={state !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit transaction" : "Add transaction"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update the details of this record." : "Record money you received or spent."}
          </SheetDescription>
        </SheetHeader>
        {state && (
          <TransactionForm
            key={state.formKey}
            mode={state.mode}
            initialValues={state.initialValues}
            categories={categories}
            today={today}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

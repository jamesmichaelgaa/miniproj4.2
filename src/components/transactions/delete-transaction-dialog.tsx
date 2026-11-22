"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/money";
import type { Transaction } from "@/types/finance";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  onConfirm: (transaction: Transaction) => void;
  onCancel: () => void;
}

export function DeleteTransactionDialog({ transaction, onConfirm, onCancel }: DeleteTransactionDialogProps) {
  return (
    <AlertDialog open={transaction !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {transaction?.type ?? "transaction"}?</AlertDialogTitle>
          <AlertDialogDescription>
            {transaction
              ? `"${transaction.description}" (${formatCurrency(transaction.amount)}) will be removed and your totals will change. This cannot be undone.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => transaction && onConfirm(transaction)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

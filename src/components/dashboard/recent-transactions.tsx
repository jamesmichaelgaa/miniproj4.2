import { Amount } from "@/components/shared/amount";
import { CategoryIcon } from "@/components/shared/category-icon";
import { formatDate } from "@/lib/dates";
import type { TransactionItem } from "@/lib/finance/dashboard";

export function RecentTransactions({ transactions }: { transactions: TransactionItem[] }) {
  return (
    <ul className="flex flex-col divide-y">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <CategoryIcon name={transaction.category?.icon} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{transaction.description}</span>
            <span className="truncate text-xs text-muted-foreground">
              {transaction.category?.name ?? "Uncategorized"} · {formatDate(transaction.date)}
            </span>
          </div>
          <Amount
            value={transaction.amount}
            tone={transaction.type}
            className="shrink-0 text-sm font-medium"
          />
        </li>
      ))}
    </ul>
  );
}

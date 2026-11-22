import { Amount } from "@/components/shared/amount";
import { CategoryIcon } from "@/components/shared/category-icon";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";
import { formatCurrencyWhole } from "@/lib/money";
import type { UpcomingBillItem } from "@/lib/finance/dashboard";
import type { Centavos } from "@/types/finance";

function dueLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  return `In ${daysUntil} days`;
}

interface UpcomingBillsProps {
  bills: UpcomingBillItem[];
  total: Centavos;
}

export function UpcomingBills({ bills, total }: UpcomingBillsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y">
        {bills.map(({ bill, daysUntil, category }) => (
          <li key={bill.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <CategoryIcon name={category?.icon} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{bill.name}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {formatDate(bill.nextDueDate)}
                <Badge variant={daysUntil <= 7 ? "secondary" : "outline"}>{dueLabel(daysUntil)}</Badge>
              </span>
            </div>
            <Amount value={bill.amount} whole className="shrink-0 text-sm font-medium" />
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between border-t pt-3 text-sm">
        <span className="text-muted-foreground">Total due in 30 days</span>
        <span className="font-semibold tabular-nums">{formatCurrencyWhole(total)}</span>
      </p>
    </div>
  );
}

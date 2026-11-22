import { BudgetStatusBadge } from "@/components/shared/budget-status-badge";
import { Amount } from "@/components/shared/amount";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { BudgetProgressItem } from "@/lib/finance/dashboard";

const indicatorClass = {
  "on-track": "[&_[data-slot=progress-indicator]]:bg-success",
  warning: "[&_[data-slot=progress-indicator]]:bg-warning",
  over: "[&_[data-slot=progress-indicator]]:bg-destructive",
} as const;

export function BudgetProgressList({ budgets }: { budgets: BudgetProgressItem[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {budgets.map((budget) => (
        <li key={budget.budgetId} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium">{budget.categoryName}</span>
              <BudgetStatusBadge status={budget.status} />
            </div>
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              <Amount value={budget.spent} whole className="font-medium text-foreground" /> of{" "}
              <Amount value={budget.limit} whole />
            </span>
          </div>
          <Progress
            value={Math.min(budget.percentUsed, 100)}
            aria-label={`${budget.categoryName} budget used`}
            className={cn("h-2", indicatorClass[budget.status])}
          />
        </li>
      ))}
    </ul>
  );
}

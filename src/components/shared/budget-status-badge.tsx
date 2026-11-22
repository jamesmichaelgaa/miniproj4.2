import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BudgetStatus } from "@/lib/finance/calculations";

const statusConfig: Record<BudgetStatus, { label: string; className: string }> = {
  "on-track": { label: "On track", className: "bg-success/10 text-success" },
  warning: { label: "Near limit", className: "bg-warning/20 text-warning-foreground" },
  over: { label: "Over budget", className: "bg-destructive/10 text-destructive" },
};

export function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  const { label, className } = statusConfig[status];
  return <Badge className={cn("border-transparent", className)}>{label}</Badge>;
}

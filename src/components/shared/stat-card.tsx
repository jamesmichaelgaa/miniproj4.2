import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Percentage change versus the previous period; null hides the badge. */
  changePercent?: number | null;
  /** Whether an increase is good news (income) or bad news (expenses). */
  increaseIsGood?: boolean;
  hint?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  changePercent = null,
  increaseIsGood = true,
  hint,
  className,
}: StatCardProps) {
  const isIncrease = (changePercent ?? 0) >= 0;
  const isGood = isIncrease === increaseIsGood;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <div className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
          {changePercent !== null && (
            <Badge variant="outline" className={cn(isGood ? "text-success" : "text-destructive")}>
              {isIncrease ? (
                <ArrowUpRight data-icon="inline-start" />
              ) : (
                <ArrowDownRight data-icon="inline-start" />
              )}
              {Math.abs(changePercent)}%
            </Badge>
          )}
          {hint && <span>{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, formatCurrencyWhole } from "@/lib/money";
import type { BreakdownSlice } from "@/lib/finance/dashboard";

const sliceColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

interface SpendingBreakdownProps {
  breakdown: BreakdownSlice[];
  totalExpenses: number;
}

export function SpendingBreakdown({ breakdown, totalExpenses }: SpendingBreakdownProps) {
  const config: ChartConfig = Object.fromEntries(
    breakdown.map((slice, index) => [slice.id, { label: slice.name, color: sliceColors[index % sliceColors.length] }]),
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative size-48 shrink-0">
        <ChartContainer config={config} className="aspect-square size-48" role="img" aria-label="Spending by category this month">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">{item.payload.name}</span>
                      <span className="font-mono font-medium tabular-nums">{formatCurrency(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={breakdown}
              dataKey="amount"
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              strokeWidth={0}
            >
              {breakdown.map((slice) => (
                <Cell key={slice.id} fill={`var(--color-${slice.id})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Spent</span>
          <span className="text-base font-semibold tabular-nums">{formatCurrencyWhole(totalExpenses)}</span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-3">
        {breakdown.map((slice, index) => (
          <li key={slice.id} className="flex items-center gap-3 text-sm">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: sliceColors[index % sliceColors.length] }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{slice.name}</span>
            <span className="tabular-nums text-muted-foreground">{slice.percent}%</span>
            <span className="w-24 text-right font-medium tabular-nums">{formatCurrencyWhole(slice.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

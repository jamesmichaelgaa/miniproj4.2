"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatMonth } from "@/lib/dates";
import { formatCurrency, formatCurrencyCompact } from "@/lib/money";
import type { MonthlyTotals } from "@/lib/finance/calculations";

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function CashflowChart({ trend }: { trend: MonthlyTotals[] }) {
  const chartData = trend.map(({ month, income, expenses }) => ({
    month: formatMonth(month, "short"),
    income,
    expenses,
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full sm:h-72" role="img" aria-label="Income and expenses for the last six months">
      <BarChart data={chartData} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          width={56}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatCurrencyCompact(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span>
                  <span className="font-mono font-medium tabular-nums">{formatCurrency(Number(value))}</span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

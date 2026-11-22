import { ArrowDownToLine, ArrowUpFromLine, PiggyBank, Scale } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { StatCard } from "@/components/shared/stat-card";
import type { DashboardData } from "@/lib/finance/dashboard";

export function SummaryCards({ data }: { data: DashboardData }) {
  const { summary, incomeChangePercent, expenseChangePercent } = data;

  return (
    <section aria-label="Monthly summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Income"
        icon={ArrowDownToLine}
        value={<Amount value={summary.income} whole />}
        changePercent={incomeChangePercent}
        hint="vs last month"
      />
      <StatCard
        label="Expenses"
        icon={ArrowUpFromLine}
        value={<Amount value={summary.expenses} whole />}
        changePercent={expenseChangePercent}
        increaseIsGood={false}
        hint="vs last month"
      />
      <StatCard
        label="Net balance"
        icon={Scale}
        value={<Amount value={summary.balance} whole className={summary.balance < 0 ? "text-destructive" : undefined} />}
        hint="Income minus expenses"
      />
      <StatCard
        label="Savings rate"
        icon={PiggyBank}
        value={`${summary.savingsRatePercent}%`}
        hint="Share of income kept"
      />
    </section>
  );
}

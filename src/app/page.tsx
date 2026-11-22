import { BudgetProgressList } from "@/components/dashboard/budget-progress-list";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingBreakdown } from "@/components/dashboard/spending-breakdown";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatMonth } from "@/lib/dates";
import { getDashboardData } from "@/lib/finance/dashboard";
import { formatCurrencyWhole } from "@/lib/money";

export default function DashboardPage() {
  return <DashboardContent />;
}

async function DashboardContent() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: categories }, { data: txRows }, { data: budgetRows }, { data: billRows }] = await Promise.all([
    supabase.from("categories").select("id,name,type,icon"),
    supabase.from("transactions").select("id,type,amount,category_id,description,transaction_date"),
    supabase.from("budgets").select("id,category_id,amount,month"),
    supabase.from("recurring_bills").select("id,name,amount,category_id,frequency,next_due_date").eq("active", true),
  ]);
  const finance = {
    categories: (categories ?? []).map((c) => ({ id: c.id, name: c.name, type: c.type as "income" | "expense", icon: c.icon as import("@/types/finance").Category["icon"] })),
    transactions: (txRows ?? []).map((t) => ({ id: t.id, type: t.type as "income" | "expense", amount: t.amount, categoryId: t.category_id, description: t.description, date: t.transaction_date })),
    budgets: (budgetRows ?? []).map((b) => ({ id: b.id, categoryId: b.category_id, limit: b.amount, month: b.month.slice(0,7) })),
    recurringBills: (billRows ?? []).map((b) => ({ id: b.id, name: b.name, amount: b.amount, categoryId: b.category_id, frequency: b.frequency as import("@/types/finance").RecurringFrequency, nextDueDate: b.next_due_date })),
  };
  const data = getDashboardData(finance, today);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Your finances for ${formatMonth(data.month)}`}
        actions={<Badge variant="outline">Live account data</Badge>}
      />

      <SummaryCards data={data} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard
          title="Income vs expenses"
          description="Last 6 months"
          className="lg:col-span-3"
        >
          <CashflowChart trend={data.trend} />
        </SectionCard>
        <SectionCard
          title="Spending by category"
          description={formatMonth(data.month)}
          className="lg:col-span-2"
        >
          <SpendingBreakdown breakdown={data.breakdown} totalExpenses={data.summary.expenses} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="Budgets"
          description={`${formatCurrencyWhole(data.budgetTotals.spent)} of ${formatCurrencyWhole(data.budgetTotals.limit)} used (${data.budgetTotals.percentUsed}%)`}
        >
          <BudgetProgressList budgets={data.budgets} />
        </SectionCard>
        <SectionCard title="Upcoming bills" description="Next 30 days">
          <UpcomingBills bills={data.upcomingBills} total={data.upcomingBillsTotal} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Recent transactions" className="lg:col-span-3">
          <RecentTransactions transactions={data.recentTransactions} />
        </SectionCard>
        <SectionCard
          title="Insights"
          description="Calculated from your sample data"
          className="lg:col-span-2"
          contentClassName="[&_ul]:md:grid-cols-1"
        >
          <InsightsPanel insights={data.insights} />
        </SectionCard>
      </div>
    </div>
  );
}

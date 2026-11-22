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
import { MOCK_TODAY, getFinanceData } from "@/data/mock";
import { formatMonth } from "@/lib/dates";
import { getDashboardData } from "@/lib/finance/dashboard";
import { formatCurrencyWhole } from "@/lib/money";

export default function DashboardPage() {
  const data = getDashboardData(getFinanceData(), MOCK_TODAY);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Your finances for ${formatMonth(data.month)}`}
        actions={<Badge variant="outline">Sample data</Badge>}
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

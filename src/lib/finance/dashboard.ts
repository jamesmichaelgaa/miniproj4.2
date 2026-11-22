import { addMonths, toMonthKey } from "@/lib/dates";
import { formatCurrencyWhole } from "@/lib/money";
import type {
  Category,
  Centavos,
  FinanceData,
  IsoDate,
  Transaction,
} from "@/types/finance";
import {
  getBudgetProgress,
  getCategorySpending,
  getMonthSummary,
  getMonthlyTotals,
  getRecentTransactions,
  getTransactionsForMonth,
  getUpcomingBills,
  percentChange,
  percentOf,
  sumAmounts,
  type BudgetProgress,
  type MonthSummary,
  type MonthlyTotals,
  type UpcomingBill,
} from "./calculations";

const TREND_MONTHS = 6;
const UPCOMING_WINDOW_DAYS = 30;
const RECENT_TRANSACTION_LIMIT = 8;
const BREAKDOWN_NAMED_SLICES = 4;

export interface BreakdownSlice {
  id: string;
  name: string;
  amount: Centavos;
  percent: number;
}

export interface BudgetProgressItem extends BudgetProgress {
  categoryName: string;
}

export interface TransactionItem extends Transaction {
  category: Category | undefined;
}

export interface UpcomingBillItem extends UpcomingBill {
  category: Category | undefined;
}

export type InsightTone = "positive" | "warning" | "info";

export interface Insight {
  id: string;
  tone: InsightTone;
  text: string;
}

export interface DashboardData {
  month: string;
  today: IsoDate;
  summary: MonthSummary;
  incomeChangePercent: number | null;
  expenseChangePercent: number | null;
  trend: MonthlyTotals[];
  breakdown: BreakdownSlice[];
  budgetTotals: { limit: Centavos; spent: Centavos; percentUsed: number };
  budgets: BudgetProgressItem[];
  recentTransactions: TransactionItem[];
  upcomingBills: UpcomingBillItem[];
  upcomingBillsTotal: Centavos;
  insights: Insight[];
}

export function getDashboardData(data: FinanceData, today: IsoDate): DashboardData {
  const month = toMonthKey(today);
  const previousMonth = addMonths(month, -1);
  const categoriesById = new Map(data.categories.map((category) => [category.id, category]));
  const categoryName = (id: string) => categoriesById.get(id)?.name ?? "Uncategorized";

  const summary = getMonthSummary(data.transactions, month);
  const previousSummary = getMonthSummary(data.transactions, previousMonth);

  const spending = getCategorySpending(data.transactions, month);
  const breakdown = buildBreakdown(spending, summary.expenses, categoryName);

  const budgets = getBudgetProgress(data.budgets, data.transactions, month).map((progress) => ({
    ...progress,
    categoryName: categoryName(progress.categoryId),
  }));
  const budgetLimit = sumAmounts(budgets.map((budget) => ({ amount: budget.limit })));
  const budgetSpent = sumAmounts(budgets.map((budget) => ({ amount: budget.spent })));

  const upcomingBills = getUpcomingBills(data.recurringBills, today, UPCOMING_WINDOW_DAYS).map(
    (upcoming) => ({ ...upcoming, category: categoriesById.get(upcoming.bill.categoryId) }),
  );

  return {
    month,
    today,
    summary,
    incomeChangePercent: percentChange(summary.income, previousSummary.income),
    expenseChangePercent: percentChange(summary.expenses, previousSummary.expenses),
    trend: getMonthlyTotals(data.transactions, month, TREND_MONTHS),
    breakdown,
    budgetTotals: {
      limit: budgetLimit,
      spent: budgetSpent,
      percentUsed: percentOf(budgetSpent, budgetLimit),
    },
    budgets,
    recentTransactions: getRecentTransactions(
      getTransactionsForMonth(data.transactions, month),
      RECENT_TRANSACTION_LIMIT,
    ).map((transaction) => ({
      ...transaction,
      category: categoriesById.get(transaction.categoryId),
    })),
    upcomingBills,
    upcomingBillsTotal: sumAmounts(upcomingBills.map(({ bill }) => bill)),
    insights: buildInsights(summary, budgets, breakdown),
  };
}

function buildBreakdown(
  spending: { categoryId: string; amount: Centavos }[],
  totalExpenses: Centavos,
  categoryName: (id: string) => string,
): BreakdownSlice[] {
  const named = spending.slice(0, BREAKDOWN_NAMED_SLICES).map(({ categoryId, amount }) => ({
    id: categoryId,
    name: categoryName(categoryId),
    amount,
    percent: percentOf(amount, totalExpenses),
  }));

  const restAmount = sumAmounts(spending.slice(BREAKDOWN_NAMED_SLICES));
  if (restAmount === 0) return named;

  return [
    ...named,
    { id: "other", name: "Other", amount: restAmount, percent: percentOf(restAmount, totalExpenses) },
  ];
}

/** Rule-based placeholder insights computed from the same data as the dashboard; no AI involved yet. */
function buildInsights(
  summary: MonthSummary,
  budgets: BudgetProgressItem[],
  breakdown: BreakdownSlice[],
): Insight[] {
  const insights: Insight[] = [];

  const overBudget = budgets.filter((budget) => budget.status === "over");
  if (overBudget.length > 0) {
    const worst = [...overBudget].sort((a, b) => a.remaining - b.remaining)[0];
    insights.push({
      id: "over-budget",
      tone: "warning",
      text: `${worst.categoryName} is ${formatCurrencyWhole(Math.abs(worst.remaining))} over its monthly budget.`,
    });
  }

  const nearLimit = budgets.filter((budget) => budget.status === "warning");
  if (nearLimit.length > 0) {
    insights.push({
      id: "near-limit",
      tone: "warning",
      text: `${nearLimit.length} ${nearLimit.length === 1 ? "budget is" : "budgets are"} above 80% used: ${nearLimit
        .map((budget) => budget.categoryName)
        .join(", ")}.`,
    });
  }

  if (summary.income > 0) {
    insights.push({
      id: "savings-rate",
      tone: summary.balance >= 0 ? "positive" : "warning",
      text:
        summary.balance >= 0
          ? `You have kept ${summary.savingsRatePercent}% of this month's income so far.`
          : `Spending is ${formatCurrencyWhole(Math.abs(summary.balance))} above income this month.`,
    });
  }

  const topCategory = breakdown.find((slice) => slice.id !== "other");
  if (topCategory) {
    insights.push({
      id: "top-category",
      tone: "info",
      text: `${topCategory.name} is your largest expense at ${topCategory.percent}% of spending.`,
    });
  }

  return insights;
}

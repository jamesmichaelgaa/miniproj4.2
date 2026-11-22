import { addMonths, daysBetween, toMonthKey } from "@/lib/dates";
import type {
  Budget,
  Centavos,
  IsoDate,
  MonthKey,
  RecurringBill,
  Transaction,
} from "@/types/finance";

export const BUDGET_WARNING_THRESHOLD_PERCENT = 80;

export type BudgetStatus = "on-track" | "warning" | "over";

export interface MonthSummary {
  income: Centavos;
  expenses: Centavos;
  /** Income minus expenses for the month. */
  balance: Centavos;
  /** Whole-number percentage of income kept; 0 when there is no income. */
  savingsRatePercent: number;
}

export interface CategorySpending {
  categoryId: string;
  amount: Centavos;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  limit: Centavos;
  spent: Centavos;
  remaining: Centavos;
  percentUsed: number;
  status: BudgetStatus;
}

export interface MonthlyTotals {
  month: MonthKey;
  income: Centavos;
  expenses: Centavos;
}

export interface UpcomingBill {
  bill: RecurringBill;
  daysUntil: number;
}

export function sumAmounts(items: { amount: Centavos }[]): Centavos {
  return items.reduce((total, item) => total + item.amount, 0);
}

/** Integer percentage of `part` in `total`, rounded; 0 when total is 0. */
export function percentOf(part: Centavos, total: Centavos): number {
  if (total <= 0) return 0;
  return Math.round((part * 100) / total);
}

/** Percentage change from previous to current; null when there is no baseline. */
export function percentChange(current: Centavos, previous: Centavos): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) * 100) / previous);
}

export function getTransactionsForMonth(
  transactions: Transaction[],
  month: MonthKey,
): Transaction[] {
  return transactions.filter((transaction) => toMonthKey(transaction.date) === month);
}

export function getMonthSummary(transactions: Transaction[], month: MonthKey): MonthSummary {
  const inMonth = getTransactionsForMonth(transactions, month);
  const income = sumAmounts(inMonth.filter((transaction) => transaction.type === "income"));
  const expenses = sumAmounts(inMonth.filter((transaction) => transaction.type === "expense"));
  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    savingsRatePercent: income > 0 ? Math.max(0, percentOf(balance, income)) : 0,
  };
}

export function getCategorySpending(
  transactions: Transaction[],
  month: MonthKey,
): CategorySpending[] {
  const totals = new Map<string, Centavos>();

  for (const transaction of getTransactionsForMonth(transactions, month)) {
    if (transaction.type !== "expense") continue;
    totals.set(transaction.categoryId, (totals.get(transaction.categoryId) ?? 0) + transaction.amount);
  }

  return [...totals.entries()]
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBudgetStatus(spent: Centavos, limit: Centavos): BudgetStatus {
  if (spent > limit) return "over";
  if (spent * 100 >= limit * BUDGET_WARNING_THRESHOLD_PERCENT) return "warning";
  return "on-track";
}

export function getBudgetProgress(
  budgets: Budget[],
  transactions: Transaction[],
  month: MonthKey,
): BudgetProgress[] {
  const spendingByCategory = new Map(
    getCategorySpending(transactions, month).map(({ categoryId, amount }) => [categoryId, amount]),
  );

  return budgets
    .filter((budget) => budget.month === month)
    .map((budget) => {
      const spent = spendingByCategory.get(budget.categoryId) ?? 0;
      return {
        budgetId: budget.id,
        categoryId: budget.categoryId,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        percentUsed: percentOf(spent, budget.limit),
        status: getBudgetStatus(spent, budget.limit),
      };
    });
}

export function getMonthlyTotals(
  transactions: Transaction[],
  endMonth: MonthKey,
  monthCount: number,
): MonthlyTotals[] {
  return Array.from({ length: monthCount }, (_, index) => {
    const month = addMonths(endMonth, index - (monthCount - 1));
    const { income, expenses } = getMonthSummary(transactions, month);
    return { month, income, expenses };
  });
}

export function getRecentTransactions(transactions: Transaction[], limit: number): Transaction[] {
  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, limit);
}

export function getUpcomingBills(
  bills: RecurringBill[],
  today: IsoDate,
  windowDays: number,
): UpcomingBill[] {
  return bills
    .map((bill) => ({ bill, daysUntil: daysBetween(today, bill.nextDueDate) }))
    .filter(({ daysUntil }) => daysUntil >= 0 && daysUntil <= windowDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

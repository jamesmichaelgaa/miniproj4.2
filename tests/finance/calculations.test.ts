import { describe, expect, it } from "vitest";
import {
  getBudgetProgress,
  getBudgetStatus,
  getCategorySpending,
  getMonthSummary,
  getMonthlyTotals,
  getUpcomingBills,
  percentChange,
  percentOf,
} from "@/lib/finance/calculations";
import { addMonths } from "@/lib/dates";
import { pesosToCentavos } from "@/lib/money";
import type { Budget, RecurringBill, Transaction } from "@/types/finance";

const tx = (
  id: string,
  type: Transaction["type"],
  pesos: number,
  categoryId: string,
  date: string,
): Transaction => ({
  id,
  type,
  amount: pesosToCentavos(pesos),
  categoryId,
  description: id,
  date,
});

const transactions: Transaction[] = [
  tx("a", "income", 1000, "salary", "2026-11-05"),
  tx("b", "expense", 250, "food", "2026-11-06"),
  tx("c", "expense", 150, "food", "2026-11-07"),
  tx("d", "expense", 100, "transport", "2026-11-08"),
  tx("e", "income", 500, "salary", "2026-10-05"),
  tx("f", "expense", 200, "food", "2026-10-06"),
];

describe("money and percentages", () => {
  it("converts pesos to integer centavos without float drift", () => {
    expect(pesosToCentavos(19.99)).toBe(1999);
    expect(pesosToCentavos(0.1 + 0.2)).toBe(30);
  });

  it("handles zero totals", () => {
    expect(percentOf(100, 0)).toBe(0);
    expect(percentChange(100, 0)).toBeNull();
  });

  it("calculates percentage change", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
  });
});

describe("month summary", () => {
  it("totals income, expenses and balance for a month only", () => {
    const summary = getMonthSummary(transactions, "2026-11");
    expect(summary.income).toBe(pesosToCentavos(1000));
    expect(summary.expenses).toBe(pesosToCentavos(500));
    expect(summary.balance).toBe(pesosToCentavos(500));
    expect(summary.savingsRatePercent).toBe(50);
  });

  it("returns zeros for an empty month", () => {
    expect(getMonthSummary(transactions, "2026-01")).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRatePercent: 0,
    });
  });
});

describe("category spending and budgets", () => {
  it("sums expenses per category, largest first", () => {
    expect(getCategorySpending(transactions, "2026-11")).toEqual([
      { categoryId: "food", amount: pesosToCentavos(400) },
      { categoryId: "transport", amount: pesosToCentavos(100) },
    ]);
  });

  it("classifies budget status", () => {
    const limit = pesosToCentavos(1000);
    expect(getBudgetStatus(pesosToCentavos(799), limit)).toBe("on-track");
    expect(getBudgetStatus(pesosToCentavos(800), limit)).toBe("warning");
    expect(getBudgetStatus(limit, limit)).toBe("warning");
    expect(getBudgetStatus(pesosToCentavos(1001), limit)).toBe("over");
  });

  it("computes budget progress including categories with no spending", () => {
    const budgets: Budget[] = [
      { id: "1", categoryId: "food", month: "2026-11", limit: pesosToCentavos(500) },
      { id: "2", categoryId: "health", month: "2026-11", limit: pesosToCentavos(300) },
    ];
    const [food, health] = getBudgetProgress(budgets, transactions, "2026-11");
    expect(food).toMatchObject({ spent: pesosToCentavos(400), percentUsed: 80, status: "warning" });
    expect(health).toMatchObject({ spent: 0, percentUsed: 0, status: "on-track" });
  });
});

describe("trends and bills", () => {
  it("adds months across year boundaries", () => {
    expect(addMonths("2026-01", -1)).toBe("2025-12");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
  });

  it("returns monthly totals oldest first", () => {
    const totals = getMonthlyTotals(transactions, "2026-11", 2);
    expect(totals.map((entry) => entry.month)).toEqual(["2026-10", "2026-11"]);
    expect(totals[0].expenses).toBe(pesosToCentavos(200));
  });

  it("returns bills due inside the window, soonest first", () => {
    const bills: RecurringBill[] = [
      { id: "later", name: "Later", amount: 100, categoryId: "x", frequency: "monthly", nextDueDate: "2026-12-10" },
      { id: "soon", name: "Soon", amount: 100, categoryId: "x", frequency: "monthly", nextDueDate: "2026-11-25" },
      { id: "past", name: "Past", amount: 100, categoryId: "x", frequency: "monthly", nextDueDate: "2026-11-01" },
      { id: "far", name: "Far", amount: 100, categoryId: "x", frequency: "yearly", nextDueDate: "2027-03-01" },
    ];
    const upcoming = getUpcomingBills(bills, "2026-11-22", 30);
    expect(upcoming.map(({ bill }) => bill.id)).toEqual(["soon", "later"]);
    expect(upcoming[0].daysUntil).toBe(3);
  });
});

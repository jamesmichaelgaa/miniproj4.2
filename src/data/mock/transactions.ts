import { pesosToCentavos } from "@/lib/money";
import type { Transaction } from "@/types/finance";

/** Fixed "today" so mock data and dashboard output stay deterministic. */
export const MOCK_TODAY = "2026-11-22";

interface ExpenseTemplate {
  categoryId: string;
  description: string;
  day: number;
  pesos: number;
  /** Variable lines are scaled by the month multiplier; fixed lines are not. */
  variable?: boolean;
}

const expenseTemplates: ExpenseTemplate[] = [
  { categoryId: "housing", description: "Condo rent", day: 3, pesos: 12000 },
  { categoryId: "family", description: "Padala to family", day: 7, pesos: 5000 },
  { categoryId: "utilities", description: "Meralco electricity", day: 8, pesos: 2400, variable: true },
  { categoryId: "utilities", description: "Maynilad water", day: 9, pesos: 450, variable: true },
  { categoryId: "utilities", description: "Converge internet", day: 12, pesos: 1699 },
  { categoryId: "utilities", description: "Globe postpaid", day: 14, pesos: 999 },
  { categoryId: "food", description: "SM Supermarket groceries", day: 6, pesos: 2300, variable: true },
  { categoryId: "food", description: "Jollibee lunch", day: 9, pesos: 650, variable: true },
  { categoryId: "food", description: "Puregold groceries", day: 13, pesos: 1850, variable: true },
  { categoryId: "food", description: "Dinner with friends", day: 17, pesos: 1200, variable: true },
  { categoryId: "food", description: "Wet market and groceries", day: 20, pesos: 2100, variable: true },
  { categoryId: "food", description: "Coffee run", day: 21, pesos: 380, variable: true },
  { categoryId: "transport", description: "Grab rides", day: 5, pesos: 420, variable: true },
  { categoryId: "transport", description: "Beep card load (MRT/LRT)", day: 11, pesos: 600 },
  { categoryId: "transport", description: "Angkas and fuel", day: 19, pesos: 750, variable: true },
  { categoryId: "health", description: "Mercury Drug", day: 16, pesos: 540, variable: true },
  { categoryId: "entertainment", description: "Netflix", day: 10, pesos: 549 },
  { categoryId: "entertainment", description: "Spotify", day: 18, pesos: 149 },
  { categoryId: "shopping", description: "Shopee order", day: 15, pesos: 1450, variable: true },
];

const months = [
  { key: "2026-06", multiplier: 100, freelancePesos: 0 },
  { key: "2026-07", multiplier: 104, freelancePesos: 8000 },
  { key: "2026-08", multiplier: 97, freelancePesos: 0 },
  { key: "2026-09", multiplier: 110, freelancePesos: 5500 },
  { key: "2026-10", multiplier: 95, freelancePesos: 0 },
  { key: "2026-11", multiplier: 102, freelancePesos: 6500 },
];

function pad(day: number): string {
  return String(day).padStart(2, "0");
}

function buildTransactions(): Transaction[] {
  const result: Transaction[] = [];
  const todayDay = Number(MOCK_TODAY.slice(8, 10));
  const todayMonth = MOCK_TODAY.slice(0, 7);

  for (const month of months) {
    const isCurrentMonth = month.key === todayMonth;
    const isPast = (day: number) => !isCurrentMonth || day <= todayDay;

    for (const day of [5, 20]) {
      if (!isPast(day)) continue;
      result.push({
        id: `${month.key}-salary-${pad(day)}`,
        type: "income",
        amount: pesosToCentavos(24000),
        categoryId: "salary",
        description: day === 5 ? "Salary (first half)" : "Salary (second half)",
        date: `${month.key}-${pad(day)}`,
      });
    }

    if (month.freelancePesos > 0) {
      result.push({
        id: `${month.key}-freelance-10`,
        type: "income",
        amount: pesosToCentavos(month.freelancePesos),
        categoryId: "freelance",
        description: "Freelance design project",
        date: `${month.key}-10`,
      });
    }

    expenseTemplates.forEach((template, index) => {
      if (!isPast(template.day)) return;
      const pesos = template.variable
        ? Math.round((template.pesos * month.multiplier) / 100)
        : template.pesos;
      result.push({
        id: `${month.key}-expense-${pad(index)}`,
        type: "expense",
        amount: pesosToCentavos(pesos),
        categoryId: template.categoryId,
        description: template.description,
        date: `${month.key}-${pad(template.day)}`,
      });
    });
  }

  return result;
}

export const mockTransactions: Transaction[] = buildTransactions();

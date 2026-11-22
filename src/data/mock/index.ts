import type { FinanceData } from "@/types/finance";
import { mockBudgets } from "./budgets";
import { mockCategories } from "./categories";
import { mockRecurringBills } from "./recurring-bills";
import { MOCK_TODAY, mockTransactions } from "./transactions";

export { MOCK_TODAY };

/** Single access point for finance data. Replace with real data access once the backend exists. */
export function getFinanceData(): FinanceData {
  return {
    categories: mockCategories,
    transactions: mockTransactions,
    budgets: mockBudgets,
    recurringBills: mockRecurringBills,
  };
}

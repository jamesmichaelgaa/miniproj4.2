import { pesosToCentavos } from "@/lib/money";
import type { Budget } from "@/types/finance";

const budgetLimitsInPesos: Record<string, number> = {
  housing: 12000,
  food: 9500,
  transport: 2000,
  utilities: 6500,
  health: 1000,
  entertainment: 1500,
  shopping: 1200,
  family: 5000,
};

export const mockBudgets: Budget[] = Object.entries(budgetLimitsInPesos).map(
  ([categoryId, pesos]) => ({
    id: `2026-11-${categoryId}`,
    categoryId,
    month: "2026-11",
    limit: pesosToCentavos(pesos),
  }),
);

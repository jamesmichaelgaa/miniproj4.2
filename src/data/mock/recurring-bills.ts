import { pesosToCentavos } from "@/lib/money";
import type { RecurringBill } from "@/types/finance";

export const mockRecurringBills: RecurringBill[] = [
  { id: "bill-insurance", name: "Sun Life premium", amount: pesosToCentavos(3200), categoryId: "insurance", frequency: "quarterly", nextDueDate: "2026-11-28" },
  { id: "bill-dues", name: "Condo association dues", amount: pesosToCentavos(1800), categoryId: "housing", frequency: "monthly", nextDueDate: "2026-11-30" },
  { id: "bill-rent", name: "Condo rent", amount: pesosToCentavos(12000), categoryId: "housing", frequency: "monthly", nextDueDate: "2026-12-03" },
  { id: "bill-meralco", name: "Meralco electricity", amount: pesosToCentavos(2450), categoryId: "utilities", frequency: "monthly", nextDueDate: "2026-12-08" },
  { id: "bill-maynilad", name: "Maynilad water", amount: pesosToCentavos(460), categoryId: "utilities", frequency: "monthly", nextDueDate: "2026-12-09" },
  { id: "bill-netflix", name: "Netflix", amount: pesosToCentavos(549), categoryId: "entertainment", frequency: "monthly", nextDueDate: "2026-12-10" },
  { id: "bill-converge", name: "Converge internet", amount: pesosToCentavos(1699), categoryId: "utilities", frequency: "monthly", nextDueDate: "2026-12-12" },
  { id: "bill-globe", name: "Globe postpaid", amount: pesosToCentavos(999), categoryId: "utilities", frequency: "monthly", nextDueDate: "2026-12-14" },
];

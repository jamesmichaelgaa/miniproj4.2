import { describe, expect, it } from "vitest";
import {
  formValuesFromTransaction,
  parseAmountToCentavos,
  validateTransactionForm,
  type TransactionFormValues,
} from "@/lib/finance/transaction-form";
import type { Category } from "@/types/finance";

const categories: Category[] = [
  { id: "food", name: "Food", type: "expense", icon: "utensils" },
  { id: "salary", name: "Salary", type: "income", icon: "briefcase" },
];

const today = "2026-11-22";

const validExpense: TransactionFormValues = {
  type: "expense",
  amount: "1,234.5",
  categoryId: "food",
  date: "2026-11-20",
  description: "  Groceries  ",
};

describe("parseAmountToCentavos", () => {
  it("parses whole and decimal peso amounts without float error", () => {
    expect(parseAmountToCentavos("500")).toBe(50000);
    expect(parseAmountToCentavos("₱1,234.5")).toBe(123450);
    expect(parseAmountToCentavos("0.29")).toBe(29);
    expect(parseAmountToCentavos("19.99")).toBe(1999);
  });

  it("rejects malformed amounts", () => {
    expect(parseAmountToCentavos("")).toBeNull();
    expect(parseAmountToCentavos("abc")).toBeNull();
    expect(parseAmountToCentavos("-5")).toBeNull();
    expect(parseAmountToCentavos("1.234")).toBeNull();
    expect(parseAmountToCentavos("1e3")).toBeNull();
  });
});

describe("validateTransactionForm", () => {
  it("returns trimmed, centavo-based input for valid values", () => {
    const result = validateTransactionForm(validExpense, categories, today);
    expect(result).toEqual({
      ok: true,
      value: { type: "expense", amount: 123450, categoryId: "food", date: "2026-11-20", description: "Groceries" },
    });
  });

  it("reports every missing field", () => {
    const result = validateTransactionForm(
      { type: "expense", amount: "", categoryId: "", date: "", description: " " },
      categories,
      today,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["amount", "categoryId", "date", "description"]);
    }
  });

  it("rejects zero amounts, future dates, impossible dates and mismatched categories", () => {
    const zero = validateTransactionForm({ ...validExpense, amount: "0" }, categories, today);
    const future = validateTransactionForm({ ...validExpense, date: "2026-11-23" }, categories, today);
    const impossible = validateTransactionForm({ ...validExpense, date: "2026-02-30" }, categories, today);
    const mismatch = validateTransactionForm({ ...validExpense, categoryId: "salary" }, categories, today);

    expect(zero.ok === false && zero.errors.amount).toBeTruthy();
    expect(future.ok === false && future.errors.date).toBeTruthy();
    expect(impossible.ok === false && impossible.errors.date).toBeTruthy();
    expect(mismatch.ok === false && mismatch.errors.categoryId).toBeTruthy();
  });
});

describe("formValuesFromTransaction", () => {
  it("round-trips centavos into editable text", () => {
    const values = formValuesFromTransaction({
      id: "t1",
      type: "expense",
      amount: 123405,
      categoryId: "food",
      description: "Groceries",
      date: "2026-11-20",
    });
    expect(values.amount).toBe("1234.05");
    expect(parseAmountToCentavos(values.amount)).toBe(123405);
  });
});

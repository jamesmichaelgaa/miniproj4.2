import type { Category, Centavos, IsoDate, Transaction, TransactionType } from "@/types/finance";

/** Raw, user-typed values. Amount stays a string so no float ever touches money. */
export interface TransactionFormValues {
  type: TransactionType;
  amount: string;
  categoryId: string;
  date: IsoDate;
  description: string;
}

export type TransactionFormField = "amount" | "categoryId" | "date" | "description";
export type TransactionFormErrors = Partial<Record<TransactionFormField, string>>;

export interface ValidatedTransactionInput {
  type: TransactionType;
  amount: Centavos;
  categoryId: string;
  date: IsoDate;
  description: string;
}

export type TransactionFormResult =
  | { ok: true; value: ValidatedTransactionInput }
  | { ok: false; errors: TransactionFormErrors };

export const DESCRIPTION_MAX_LENGTH = 80;
/** Upper bound keeps typos (e.g. an extra zero run) from becoming records. */
export const MAX_AMOUNT_CENTAVOS: Centavos = 100_000_000_00;

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses text like "1,234.50" or "₱500" into integer centavos using string math only.
 * Returns null when the text is not a valid peso amount with at most two decimals.
 */
export function parseAmountToCentavos(input: string): Centavos | null {
  const cleaned = input.replace(/[₱,\s]/g, "");
  if (!AMOUNT_PATTERN.test(cleaned)) return null;
  const [whole, fraction = ""] = cleaned.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function isRealCalendarDate(date: IsoDate): boolean {
  if (!ISO_DATE_PATTERN.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function validateTransactionForm(
  values: TransactionFormValues,
  categories: Category[],
  today: IsoDate,
): TransactionFormResult {
  const errors: TransactionFormErrors = {};

  const amount = parseAmountToCentavos(values.amount);
  if (values.amount.trim() === "") {
    errors.amount = "Enter an amount.";
  } else if (amount === null) {
    errors.amount = "Use numbers only, with up to 2 decimal places.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amount > MAX_AMOUNT_CENTAVOS) {
    errors.amount = "Amount is too large.";
  }

  const category = categories.find((item) => item.id === values.categoryId);
  if (!values.categoryId) {
    errors.categoryId = "Choose a category.";
  } else if (!category || category.type !== values.type) {
    errors.categoryId = `Choose a valid ${values.type} category.`;
  }

  if (!values.date) {
    errors.date = "Choose a date.";
  } else if (!isRealCalendarDate(values.date)) {
    errors.date = "Enter a valid date.";
  } else if (values.date > today) {
    errors.date = "Date cannot be in the future.";
  }

  const description = values.description.trim();
  if (description === "") {
    errors.description = "Add a short description.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Keep it under ${DESCRIPTION_MAX_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0 || amount === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { type: values.type, amount, categoryId: values.categoryId, date: values.date, description },
  };
}

export function emptyFormValues(type: TransactionType, today: IsoDate): TransactionFormValues {
  return { type, amount: "", categoryId: "", date: today, description: "" };
}

export function formValuesFromTransaction(transaction: Transaction): TransactionFormValues {
  const pesos = Math.floor(transaction.amount / 100);
  const centavos = String(transaction.amount % 100).padStart(2, "0");
  return {
    type: transaction.type,
    amount: centavos === "00" ? String(pesos) : `${pesos}.${centavos}`,
    categoryId: transaction.categoryId,
    date: transaction.date,
    description: transaction.description,
  };
}

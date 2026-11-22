/** Money is always stored as an integer number of centavos (1 PHP = 100 centavos). */
export type Centavos = number;

/** Calendar date in YYYY-MM-DD form. */
export type IsoDate = string;

/** Calendar month in YYYY-MM form. */
export type MonthKey = string;

export type TransactionType = "income" | "expense";

export type CategoryIconName =
  | "home"
  | "utensils"
  | "car"
  | "zap"
  | "heart-pulse"
  | "clapperboard"
  | "shopping-bag"
  | "users"
  | "briefcase"
  | "laptop"
  | "shield"
  | "wallet";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: CategoryIconName;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: Centavos;
  categoryId: string;
  description: string;
  date: IsoDate;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: MonthKey;
  limit: Centavos;
}

export type RecurringFrequency = "weekly" | "monthly" | "quarterly" | "yearly";

export interface RecurringBill {
  id: string;
  name: string;
  amount: Centavos;
  categoryId: string;
  frequency: RecurringFrequency;
  nextDueDate: IsoDate;
}

export interface FinanceData {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  recurringBills: RecurringBill[];
}

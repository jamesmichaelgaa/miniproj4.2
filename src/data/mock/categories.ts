import type { Category } from "@/types/finance";

export const mockCategories: Category[] = [
  { id: "housing", name: "Housing", type: "expense", icon: "home" },
  { id: "food", name: "Food & Groceries", type: "expense", icon: "utensils" },
  { id: "transport", name: "Transport", type: "expense", icon: "car" },
  { id: "utilities", name: "Utilities & Bills", type: "expense", icon: "zap" },
  { id: "health", name: "Health", type: "expense", icon: "heart-pulse" },
  { id: "entertainment", name: "Entertainment", type: "expense", icon: "clapperboard" },
  { id: "shopping", name: "Shopping", type: "expense", icon: "shopping-bag" },
  { id: "family", name: "Family Support", type: "expense", icon: "users" },
  { id: "insurance", name: "Insurance", type: "expense", icon: "shield" },
  { id: "salary", name: "Salary", type: "income", icon: "briefcase" },
  { id: "freelance", name: "Freelance", type: "income", icon: "laptop" },
];

import type { Metadata } from "next";
import { TransactionsView } from "@/components/transactions/transactions-view";
import { MOCK_TODAY, getFinanceData } from "@/data/mock";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  const { transactions, categories } = getFinanceData();
  return <TransactionsView initialTransactions={transactions} categories={categories} today={MOCK_TODAY} />;
}

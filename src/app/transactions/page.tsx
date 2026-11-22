import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return <ComingSoon title="Transactions" description="Review and categorize your income and spending." icon={Receipt} />;
}

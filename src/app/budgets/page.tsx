import type { Metadata } from "next";
import { PiggyBank } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Budgets" };

export default function BudgetsPage() {
  return <ComingSoon title="Budgets" description="Set monthly limits for each spending category." icon={PiggyBank} />;
}

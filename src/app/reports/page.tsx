import type { Metadata } from "next";
import { ChartColumn } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return <ComingSoon title="Reports" description="Explore trends across months and categories." icon={ChartColumn} />;
}

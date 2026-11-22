import { CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight, InsightTone } from "@/lib/finance/dashboard";

const toneConfig: Record<InsightTone, { icon: LucideIcon; className: string }> = {
  positive: { icon: CircleCheck, className: "bg-success/10 text-success" },
  warning: { icon: TriangleAlert, className: "bg-warning/20 text-warning-foreground" },
  info: { icon: Info, className: "bg-accent text-accent-foreground" },
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {insights.map((insight) => {
        const { icon: Icon, className } = toneConfig[insight.tone];
        return (
          <li key={insight.id} className="flex items-start gap-3 rounded-lg border p-3">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", className)}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <p className="pt-1 text-sm text-pretty">{insight.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

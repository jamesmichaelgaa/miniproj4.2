import { cn } from "@/lib/utils";
import { formatCurrency, formatCurrencyWhole } from "@/lib/money";
import type { Centavos } from "@/types/finance";

interface AmountProps extends React.ComponentProps<"span"> {
  value: Centavos;
  /** "income" and "expense" add a +/- sign and semantic colour; "neutral" shows the plain value. */
  tone?: "income" | "expense" | "neutral";
  whole?: boolean;
}

export function Amount({ value, tone = "neutral", whole = false, className, ...props }: AmountProps) {
  const format = whole ? formatCurrencyWhole : formatCurrency;
  const sign = tone === "income" ? "+" : tone === "expense" ? "-" : "";

  return (
    <span
      className={cn("tabular-nums", tone === "income" && "text-success", className)}
      {...props}
    >
      {sign}
      {format(Math.abs(value))}
    </span>
  );
}

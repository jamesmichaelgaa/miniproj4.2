import { localeConfig } from "@/config/locale";
import type { Centavos } from "@/types/finance";

const { locale, currency, minorUnitsPerMajor } = localeConfig;

const currencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
});

const wholeCurrencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Converts a validated peso amount (e.g. 1234.5) to integer centavos. */
export function pesosToCentavos(pesos: number): Centavos {
  return Math.round(pesos * minorUnitsPerMajor);
}

/** Display-only conversion; never use the result for arithmetic. */
function toMajorUnits(amount: Centavos): number {
  return amount / minorUnitsPerMajor;
}

export function formatCurrency(amount: Centavos): string {
  return currencyFormatter.format(toMajorUnits(amount));
}

export function formatCurrencyWhole(amount: Centavos): string {
  return wholeCurrencyFormatter.format(toMajorUnits(amount));
}

export function formatCurrencyCompact(amount: Centavos): string {
  return compactCurrencyFormatter.format(toMajorUnits(amount));
}

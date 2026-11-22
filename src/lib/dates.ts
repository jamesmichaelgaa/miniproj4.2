import { localeConfig } from "@/config/locale";
import type { IsoDate, MonthKey } from "@/types/finance";

const MS_PER_DAY = 86_400_000;

function parseUtc(date: IsoDate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function toMonthKey(date: IsoDate): MonthKey {
  return date.slice(0, 7);
}

export function addMonths(month: MonthKey, delta: number): MonthKey {
  const [year, monthNumber] = month.split("-").map(Number);
  const index = year * 12 + (monthNumber - 1) + delta;
  const nextYear = Math.floor(index / 12);
  const nextMonth = (index % 12) + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((parseUtc(to).getTime() - parseUtc(from).getTime()) / MS_PER_DAY);
}

export function formatMonth(month: MonthKey, style: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat(localeConfig.locale, {
    month: style,
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(parseUtc(`${month}-01`));
}

export function formatDate(date: IsoDate): string {
  return new Intl.DateTimeFormat(localeConfig.locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseUtc(date));
}

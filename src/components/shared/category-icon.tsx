import {
  Briefcase,
  Car,
  Clapperboard,
  HeartPulse,
  House,
  Laptop,
  ShieldCheck,
  ShoppingBag,
  Users,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryIconName } from "@/types/finance";

const iconMap: Record<CategoryIconName, LucideIcon> = {
  home: House,
  utensils: Utensils,
  car: Car,
  zap: Zap,
  "heart-pulse": HeartPulse,
  clapperboard: Clapperboard,
  "shopping-bag": ShoppingBag,
  users: Users,
  briefcase: Briefcase,
  laptop: Laptop,
  shield: ShieldCheck,
  wallet: Wallet,
};

interface CategoryIconProps {
  name: CategoryIconName | undefined;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = iconMap[name ?? "wallet"];

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

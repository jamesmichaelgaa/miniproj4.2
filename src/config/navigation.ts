import {
  ChartColumn,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const siteConfig = {
  name: "Pesoly",
  description: "Personal budgeting dashboard with a clear view of income, spending and upcoming bills.",
} as const;

export const mainNavigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: Receipt },
  { title: "Budgets", href: "/budgets", icon: PiggyBank },
  { title: "Reports", href: "/reports", icon: ChartColumn },
  { title: "AI Assistant", href: "/assistant", icon: Sparkles },
  { title: "Settings", href: "/settings", icon: Settings },
];

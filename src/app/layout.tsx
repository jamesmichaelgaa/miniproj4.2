import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { siteConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} | Personal budgeting`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#2f6f6b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

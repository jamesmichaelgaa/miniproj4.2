import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <ComingSoon title="Settings" description="Manage your profile and preferences." icon={Settings} />;
}

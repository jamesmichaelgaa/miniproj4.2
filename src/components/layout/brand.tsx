import Link from "next/link";
import { Wallet } from "lucide-react";
import { siteConfig } from "@/config/navigation";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-lg font-semibold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-4" aria-hidden="true" />
      </span>
      {siteConfig.name}
    </Link>
  );
}

import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-sidebar p-4 text-sidebar-foreground lg:flex">
      <div className="px-1 pt-1">
        <Brand />
      </div>
      <NavLinks />
      <p className="mt-auto px-3 text-xs text-muted-foreground">Demo data. Nothing is saved.</p>
    </aside>
  );
}

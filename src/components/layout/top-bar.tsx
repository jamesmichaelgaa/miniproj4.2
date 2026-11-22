import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <MobileNav />
      <div className="lg:hidden">
        <Brand />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">Demo user</span>
        <Avatar>
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

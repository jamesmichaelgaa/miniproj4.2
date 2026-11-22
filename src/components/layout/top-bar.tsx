import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export async function TopBar() {
  let email = "Account";
  try { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user?.email) email = user.email; } catch {}
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <MobileNav />
      <div className="lg:hidden">
        <Brand />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">{email}</span>
        <Avatar>
          <AvatarFallback>{email.slice(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <form action={signOut}><button className="text-sm text-muted-foreground underline">Sign out</button></form>
      </div>
    </header>
  );
}

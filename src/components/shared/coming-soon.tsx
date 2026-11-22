import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <p className="font-medium">This section is coming soon</p>
          <p className="max-w-sm text-sm text-muted-foreground text-pretty">
            The dashboard is the first screen to ship. {title} will be built in a later task.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

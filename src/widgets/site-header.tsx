import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({
  pageName,
  children,
}: {
  pageName: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-5" />
        <h1 className="text-base font-medium">{pageName}</h1>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}

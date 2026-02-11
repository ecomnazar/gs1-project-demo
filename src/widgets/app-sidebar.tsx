"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBarcode,
  IconPackage,
  IconDashboard,
  IconSettings,
  IconBuildingFactory2,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
  {
    title: "Товары",
    url: "/products",
    icon: IconPackage,
  },
  {
    title: "Генерация штрихкодов",
    url: "/products/generate",
    icon: IconBarcode,
  },
  {
    title: "Производители",
    url: "/manufacturers",
    icon: IconBuildingFactory2,
  },
  {
    title: "Настройки",
    url: "/settings",
    icon: IconSettings,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="bg-primary hover:bg-primary/90 py-6">
              <Link href="/">
                <IconBarcode className="text-primary-foreground" />
                <span className="text-base font-semibold text-primary-foreground">
                  GS1 Turkmenistan
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {navItems.map((item) => (
                <Link key={item.title} href={item.url}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          GS1 Turkmenistan v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

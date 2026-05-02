import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Settings2, CalendarRange,
  Wrench, Wallet, FileBarChart, Upload, Receipt, LogOut
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import sa7dLogo from "@/assets/sa7d-logo.png";

const groups = [
  {
    label: "Visão geral",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { title: "Investidores", url: "/investidores", icon: Users },
      { title: "Imóveis", url: "/imoveis", icon: Building2 },
      { title: "Parâmetros", url: "/parametros", icon: Settings2 },
    ],
  },
  {
    label: "Operacional",
    items: [
      { title: "Hospedagens", url: "/hospedagens", icon: CalendarRange },
      { title: "Serviços & Manutenções", url: "/servicos", icon: Wrench },
      { title: "Adiantamentos", url: "/adiantamentos", icon: Wallet },
      { title: "Custos da empresa", url: "/custos", icon: Receipt },
      { title: "Importar Airbnb", url: "/importar", icon: Upload },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { title: "DRE Investidor", url: "/dre/investidor", icon: FileBarChart },
      { title: "DRE Empresa", url: "/dre/empresa", icon: FileBarChart },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (url: string) => url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-gradient-brand shadow-brand">
            <img src={sa7dLogo} alt="SA7D" className="h-9 w-9 object-cover" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-sidebar-foreground">SA7D</div>
              <div className="text-xs text-sidebar-foreground/60">Gestão financeira</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="min-w-0">
              <div className="truncate text-xs text-sidebar-foreground/60">Conectado</div>
              <div className="truncate text-xs font-medium text-sidebar-foreground">{user?.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={signOut} className="mx-auto my-2 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

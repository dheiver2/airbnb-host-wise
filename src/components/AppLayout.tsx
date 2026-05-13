import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AppLayout() {
  const { user, loading, isAdmin, isOperacional, isInvestidor, isStaff, roles } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  // Sem papel atribuído ainda → vai para uma rota neutra (auth volta a renderizar mensagem)
  if (roles.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div className="max-w-md space-y-3">
          <div className="text-lg font-semibold">Sua conta ainda não tem papel atribuído.</div>
          <p className="text-sm text-muted-foreground">
            Solicite ao administrador da operação que defina seu papel (admin, operacional ou investidor) na página <strong>Equipe</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Investidor entrando em rota de staff → manda para /meu-dre
  if (isInvestidor && !isStaff && !pathname.startsWith("/meu-dre")) {
    return <Navigate to="/meu-dre" replace />;
  }
  // Operacional sem admin entrando em /dashboard (admin-only) → manda para /operacional
  if (isOperacional && !isAdmin && pathname === "/dashboard") {
    return <Navigate to="/operacional" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="text-sm text-muted-foreground">Sistema de Administração de Imóveis</div>
          </header>
          <main className="min-w-0 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

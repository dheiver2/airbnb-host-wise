import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import RequireRole from "@/components/RequireRole";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Investidores from "./pages/Investidores";
import Imoveis from "./pages/Imoveis";
import Parametros from "./pages/Parametros";
import Hospedagens from "./pages/Hospedagens";
import Servicos from "./pages/Servicos";
import Adiantamentos from "./pages/Adiantamentos";
import Custos from "./pages/Custos";
import Importar from "./pages/Importar";
import DREInvestidor from "./pages/DREInvestidor";
import DREEmpresa from "./pages/DREEmpresa";
import Equipe from "./pages/Equipe";
import MeuDre from "./pages/MeuDre";
import NotFound from "./pages/NotFound.tsx";
import Usuarios from "./pages/Usuarios";
import { RoleGuard } from "@/components/RoleGuard";

const queryClient = new QueryClient();

const STAFF = ["admin", "operacional"] as const;
const ADMIN = ["admin"] as const;
const INVESTIDOR = ["investidor"] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<AppLayout />}>
<<<<<<< HEAD
              {/* Staff (admin + operacional) */}
              <Route path="/dashboard" element={<RequireRole roles={[...STAFF]}><Dashboard /></RequireRole>} />
              <Route path="/investidores" element={<RequireRole roles={[...STAFF]}><Investidores /></RequireRole>} />
              <Route path="/imoveis" element={<RequireRole roles={[...STAFF]}><Imoveis /></RequireRole>} />
              <Route path="/hospedagens" element={<RequireRole roles={[...STAFF]}><Hospedagens /></RequireRole>} />
              <Route path="/servicos" element={<RequireRole roles={[...STAFF]}><Servicos /></RequireRole>} />
              <Route path="/manutencoes" element={<RequireRole roles={[...STAFF]}><Manutencoes /></RequireRole>} />
              <Route path="/adiantamentos" element={<RequireRole roles={[...STAFF]}><Adiantamentos /></RequireRole>} />
              <Route path="/importar" element={<RequireRole roles={[...STAFF]}><Importar /></RequireRole>} />
              <Route path="/dre/investidor" element={<RequireRole roles={[...STAFF]}><DREInvestidor /></RequireRole>} />

              {/* Admin only */}
              <Route path="/parametros" element={<RequireRole roles={[...ADMIN]}><Parametros /></RequireRole>} />
              <Route path="/custos" element={<RequireRole roles={[...ADMIN]}><Custos /></RequireRole>} />
              <Route path="/dre/empresa" element={<RequireRole roles={[...ADMIN]}><DREEmpresa /></RequireRole>} />
              <Route path="/equipe" element={<RequireRole roles={[...ADMIN]}><Equipe /></RequireRole>} />

              {/* Investidor only */}
              <Route path="/meu-dre" element={<RequireRole roles={[...INVESTIDOR]}><MeuDre /></RequireRole>} />
=======
              <Route path="/dashboard" element={<RoleGuard adminOnly><Dashboard /></RoleGuard>} />
              <Route path="/investidores" element={<RoleGuard adminOnly><Investidores /></RoleGuard>} />
              <Route path="/imoveis" element={<RoleGuard><Imoveis /></RoleGuard>} />
              <Route path="/parametros" element={<RoleGuard adminOnly><Parametros /></RoleGuard>} />
              <Route path="/hospedagens" element={<RoleGuard><Hospedagens /></RoleGuard>} />
              <Route path="/servicos" element={<RoleGuard><Servicos /></RoleGuard>} />
              <Route path="/adiantamentos" element={<RoleGuard adminOnly><Adiantamentos /></RoleGuard>} />
              <Route path="/custos" element={<RoleGuard adminOnly><Custos /></RoleGuard>} />
              <Route path="/importar" element={<RoleGuard><Importar /></RoleGuard>} />
              <Route path="/dre/investidor" element={<RoleGuard adminOnly><DREInvestidor /></RoleGuard>} />
              <Route path="/dre/empresa" element={<RoleGuard adminOnly><DREEmpresa /></RoleGuard>} />
              <Route path="/usuarios" element={<RoleGuard adminOnly><Usuarios /></RoleGuard>} />
>>>>>>> a8603e0acada012d89c36f727530f70e7dcee1d9
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import Manutencoes from "./pages/Manutencoes";
import Adiantamentos from "./pages/Adiantamentos";
import Custos from "./pages/Custos";
import Importar from "./pages/Importar";
import Operacional from "./pages/Operacional";
import DREInvestidor from "./pages/DREInvestidor";
import DREEmpresa from "./pages/DREEmpresa";
import Equipe from "./pages/Equipe";
import MeuDre from "./pages/MeuDre";
import NotFound from "./pages/NotFound.tsx";

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
              {/* Staff operacional (admin + operacional): operação dia a dia */}
              <Route path="/operacional" element={<RequireRole roles={[...STAFF]}><Operacional /></RequireRole>} />
              <Route path="/imoveis" element={<RequireRole roles={[...STAFF]}><Imoveis /></RequireRole>} />
              <Route path="/hospedagens" element={<RequireRole roles={[...STAFF]}><Hospedagens /></RequireRole>} />
              <Route path="/servicos" element={<RequireRole roles={[...STAFF]}><Servicos /></RequireRole>} />
              <Route path="/manutencoes" element={<RequireRole roles={[...STAFF]}><Manutencoes /></RequireRole>} />
              <Route path="/adiantamentos" element={<RequireRole roles={[...STAFF]}><Adiantamentos /></RequireRole>} />
              <Route path="/importar" element={<RequireRole roles={[...STAFF]}><Importar /></RequireRole>} />

              {/* Staff: cadastros e operação */}
              <Route path="/parametros" element={<RequireRole roles={[...STAFF]}><Parametros /></RequireRole>} />
              <Route path="/custos" element={<RequireRole roles={[...STAFF]}><Custos /></RequireRole>} />

              {/* Admin only: relatórios, cadastros financeiros e equipe */}
              <Route path="/dashboard" element={<RequireRole roles={[...ADMIN]}><Dashboard /></RequireRole>} />
              <Route path="/investidores" element={<RequireRole roles={[...ADMIN]}><Investidores /></RequireRole>} />
              <Route path="/dre/investidor" element={<RequireRole roles={[...ADMIN]}><DREInvestidor /></RequireRole>} />
              <Route path="/dre/empresa" element={<RequireRole roles={[...ADMIN]}><DREEmpresa /></RequireRole>} />
              <Route path="/equipe" element={<RequireRole roles={[...ADMIN]}><Equipe /></RequireRole>} />
              {/* Alias retro-compatível (bookmark antigo /usuarios → /equipe) */}
              <Route path="/usuarios" element={<Navigate to="/equipe" replace />} />

              {/* Investidor only */}
              <Route path="/meu-dre" element={<RequireRole roles={[...INVESTIDOR]}><MeuDre /></RequireRole>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

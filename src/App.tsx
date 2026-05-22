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
import Prestadores from "./pages/Prestadores";
import TiposServico from "./pages/TiposServico";
import Hospedagens from "./pages/Hospedagens";
import Servicos from "./pages/Servicos";
import Adiantamentos from "./pages/Adiantamentos";
import Custos from "./pages/Custos";
import Importar from "./pages/Importar";
import Operacional from "./pages/Operacional";
import Escalador from "./pages/Escalador";
import DREInvestidor from "./pages/DREInvestidor";
import DREEmpresa from "./pages/DREEmpresa";
import DREImovel from "./pages/DREImovel";
import RelatorioLavanderia from "./pages/RelatorioLavanderia";
import RelatorioManutencao from "./pages/RelatorioManutencao";
import RelatorioReservas from "./pages/RelatorioReservas";
import RelatorioPessoas from "./pages/RelatorioPessoas";
import RelatorioPagamentos from "./pages/RelatorioPagamentos";
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
              {/* /manutencoes virou aba dentro de /servicos — redirect pra cobrir bookmarks antigos */}
              <Route path="/manutencoes" element={<Navigate to="/servicos" replace />} />
              <Route path="/escalador" element={<RequireRole roles={[...STAFF]}><Escalador /></RequireRole>} />
              <Route path="/adiantamentos" element={<RequireRole roles={[...STAFF]}><Adiantamentos /></RequireRole>} />
              <Route path="/importar" element={<RequireRole roles={[...STAFF]}><Importar /></RequireRole>} />

              {/* Staff: cadastros e operação */}
              <Route path="/parametros" element={<RequireRole roles={[...STAFF]}><Parametros /></RequireRole>} />
              <Route path="/custos" element={<RequireRole roles={[...STAFF]}><Custos /></RequireRole>} />
              <Route path="/prestadores" element={<RequireRole roles={[...STAFF]}><Prestadores /></RequireRole>} />
              <Route path="/tipos-servico" element={<RequireRole roles={[...STAFF]}><TiposServico /></RequireRole>} />


              {/* Admin only: relatórios, cadastros financeiros e equipe */}
              <Route path="/dashboard" element={<RequireRole roles={[...ADMIN]}><Dashboard /></RequireRole>} />
              <Route path="/investidores" element={<RequireRole roles={[...ADMIN]}><Investidores /></RequireRole>} />
              <Route path="/dre/investidor" element={<RequireRole roles={[...ADMIN]}><DREInvestidor /></RequireRole>} />
              <Route path="/dre/imovel" element={<RequireRole roles={[...ADMIN]}><DREImovel /></RequireRole>} />
              <Route path="/dre/sa7d" element={<RequireRole roles={[...ADMIN]}><DREEmpresa /></RequireRole>} />
              {/* /dre/empresa renomeado para /dre/sa7d — redirect cobre bookmarks */}
              <Route path="/dre/empresa" element={<Navigate to="/dre/sa7d" replace />} />
              <Route path="/relatorios/lavanderia" element={<RequireRole roles={[...ADMIN]}><RelatorioLavanderia /></RequireRole>} />
              <Route path="/relatorios/manutencao" element={<RequireRole roles={[...ADMIN]}><RelatorioManutencao /></RequireRole>} />
              <Route path="/relatorios/reservas" element={<RequireRole roles={[...ADMIN]}><RelatorioReservas /></RequireRole>} />
              <Route path="/relatorios/pessoas" element={<RequireRole roles={[...ADMIN]}><RelatorioPessoas /></RequireRole>} />
              <Route path="/relatorios/pagamentos" element={<RequireRole roles={[...ADMIN]}><RelatorioPagamentos /></RequireRole>} />
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

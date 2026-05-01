import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
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
import DREInvestidor from "./pages/DREInvestidor";
import DREEmpresa from "./pages/DREEmpresa";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/investidores" element={<Investidores />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/parametros" element={<Parametros />} />
              <Route path="/hospedagens" element={<Hospedagens />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/manutencoes" element={<Manutencoes />} />
              <Route path="/adiantamentos" element={<Adiantamentos />} />
              <Route path="/custos" element={<Custos />} />
              <Route path="/importar" element={<Importar />} />
              <Route path="/dre/investidor" element={<DREInvestidor />} />
              <Route path="/dre/empresa" element={<DREEmpresa />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

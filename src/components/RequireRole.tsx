import { Navigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

/**
 * Bloqueia o conteúdo se o usuário logado não tiver pelo menos um dos `roles`.
 * Usar dentro de rotas de `<AppLayout>` (que já garante que o usuário está logado).
 */
export default function RequireRole({
  roles,
  children,
}: {
  roles: AppRole[];
  children: React.ReactNode;
}) {
  const { hasAnyRole, loading, isAdmin, isOperacional, isInvestidor } = useAuth();
  if (loading) return null;
  if (!hasAnyRole(roles)) {
    // Redireciona pra rota canônica do papel do usuário
    let fallback = "/dashboard";
    if (isAdmin) fallback = "/dashboard";
    else if (isOperacional) fallback = "/operacional";
    else if (isInvestidor) fallback = "/meu-dre";
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}

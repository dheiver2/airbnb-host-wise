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
  const { hasAnyRole, loading, isInvestidor, isStaff } = useAuth();
  if (loading) return null;
  if (!hasAnyRole(roles)) {
    // Investidor cai no /meu-dre, staff cai no /dashboard
    return <Navigate to={isInvestidor && !isStaff ? "/meu-dre" : "/dashboard"} replace />;
  }
  return <>{children}</>;
}

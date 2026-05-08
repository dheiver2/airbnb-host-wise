import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function RoleGuard({ adminOnly = false, children }: { adminOnly?: boolean; children: React.ReactNode }) {
  const { loading, isAdmin, isStaff } = useAuth();
  if (loading) return <div className="grid min-h-[40vh] place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  if (adminOnly && !isAdmin) return <Navigate to="/hospedagens" replace />;
  if (!isStaff && !isAdmin) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

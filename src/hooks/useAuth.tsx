import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "operacional" | "investidor";

export type AppRole = Role;

interface AuthCtx {
  session: Session | null;
  user: User | null;
  roles: Role[];
  loading: boolean;
  signOut: () => Promise<void>;
  isStaff: boolean;
  isAdmin: boolean;
  isOperacional: boolean;
  isInvestidor: boolean;
  hasAnyRole: (allowed: Role[]) => boolean;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) {
        setRoles([]);
        setLoading(false);
        return;
      }
      // Em login interativo, segura o loading até roles chegarem para
      // não mostrar a tela "sem papel" entre setUser e setRoles.
      // (TOKEN_REFRESHED e USER_UPDATED não mexem nos papéis.)
      const blockingReload = event === "SIGNED_IN";
      if (blockingReload) setLoading(true);
      // setTimeout: evita rodar query supabase de dentro do callback (recomendação supabase-js)
      setTimeout(async () => {
        await loadRoles(s.user.id);
        if (blockingReload) setLoading(false);
      }, 0);
    });

    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await loadRoles(s.user.id);
      setLoading(false);
    })();

    return () => subscription.unsubscribe();
  }, []);

  const loadRoles = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r: any) => r.role));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{
      session, user, roles, loading, signOut,
      isStaff: roles.includes("admin") || roles.includes("operacional"),
      isAdmin: roles.includes("admin"),
      isOperacional: roles.includes("operacional"),
      isInvestidor: roles.includes("investidor"),
      hasAnyRole: (allowed) => allowed.some((r) => roles.includes(r)),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth deve estar dentro de AuthProvider");
  return v;
};

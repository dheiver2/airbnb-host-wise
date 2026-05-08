import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { dateBR } from "@/lib/format";

type Role = "admin" | "operacional" | "investidor";
interface Row { id: string; nome: string | null; email: string | null; created_at: string; roles: Role[]; }

export default function Usuarios() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, nome, email, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const map = new Map<string, Role[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role);
      map.set(r.user_id, arr);
    });
    setRows((profs ?? []).map((p: any) => ({ ...p, roles: map.get(p.id) ?? [] })));
    setLoading(false);
  }

  async function setRole(uid: string, newRole: Role) {
    if (uid === user?.id && newRole !== "admin") {
      if (!confirm("Você está removendo seus próprios privilégios de Admin. Continuar?")) return;
    }
    // Remove all roles, set the new one
    const del = await supabase.from("user_roles").delete().eq("user_id", uid);
    if (del.error) return toast.error(del.error.message);
    const ins = await supabase.from("user_roles").insert({ user_id: uid, role: newRole });
    if (ins.error) return toast.error(ins.error.message);
    toast.success("Perfil atualizado");
    load();
  }

  return (
    <>
      <PageHeader title="Usuários" description="Gerencie quem é Admin ou Colaborador no sistema." />
      <div className="p-6">
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil atual</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="w-[200px]">Alterar perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Carregando…</TableCell></TableRow>}
                {!loading && rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum usuário.</TableCell></TableRow>}
                {rows.map((r) => {
                  const current: Role = r.roles.includes("admin") ? "admin" : r.roles.includes("operacional") ? "operacional" : "investidor";
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.nome ?? "—"}{r.id === user?.id && <Badge variant="outline" className="ml-2">você</Badge>}</TableCell>
                      <TableCell className="text-muted-foreground">{r.email ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant={current === "admin" ? "default" : "secondary"}>
                          {current === "admin" ? "Admin" : current === "operacional" ? "Colaborador" : "Investidor"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{dateBR(r.created_at)}</TableCell>
                      <TableCell>
                        <Select value={current} onValueChange={(v) => setRole(r.id, v as Role)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="operacional">Colaborador</SelectItem>
                            <SelectItem value="investidor">Investidor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="mt-4 text-xs text-muted-foreground">
          <strong>Admin:</strong> acesso total, incluindo DRE, Investidores, Parâmetros, Custos e gestão de usuários.<br />
          <strong>Colaborador:</strong> acesso a Hospedagens, Serviços & Manutenções, Importar Airbnb e Imóveis (somente leitura).
        </p>
      </div>
    </>
  );
}

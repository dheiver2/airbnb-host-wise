import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";

export default function RelatorioPessoas() {
  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [p, inv, prof, roles] = await Promise.all([
      (supabase.from("prestadores" as any) as any).select("*").order("nome"),
      supabase.from("investidores").select("*").order("nome"),
      supabase.from("profiles").select("id, nome, email, created_at"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setPrestadores(p.data ?? []);
    setInvestidores(inv.data ?? []);

    const rolesByUser: Record<string, string[]> = {};
    (roles.data ?? []).forEach((r: any) => {
      (rolesByUser[r.user_id] = rolesByUser[r.user_id] || []).push(r.role);
    });
    setEquipe((prof.data ?? []).map((p: any) => ({ ...p, roles: rolesByUser[p.id] ?? [] })));
  }

  const f = (s?: string | null) => (s ?? "").toLowerCase().includes(busca.toLowerCase());
  const prestF = prestadores.filter((x) => f(x.nome) || f(x.email) || f(x.area));
  const invF = investidores.filter((x) => f(x.nome) || f(x.email) || f(x.documento));
  const eqF = equipe.filter((x) => f(x.nome) || f(x.email));

  return (
    <>
      <PageHeader
        title="Relatório — Pessoas"
        description="Prestadores, equipe interna e investidores."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <Input placeholder="Buscar nome, email..." value={busca} onChange={(e) => setBusca(e.target.value)} className="max-w-[220px]" />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <Tabs defaultValue="prestadores">
          <TabsList>
            <TabsTrigger value="prestadores">Prestadores ({prestF.length})</TabsTrigger>
            <TabsTrigger value="equipe">Equipe ({eqF.length})</TabsTrigger>
            <TabsTrigger value="investidores">Investidores ({invF.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="prestadores">
            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[720px]">
                <TableHeader><TableRow>
                  <TableHead>Nome</TableHead><TableHead>Área</TableHead><TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead><TableHead>PIX</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {prestF.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum prestador.</TableCell></TableRow>
                  )}
                  {prestF.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{x.nome}</TableCell>
                      <TableCell>{x.area ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.telefone ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.email ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.pix ?? "—"}</TableCell>
                      <TableCell><Badge variant={x.ativo ? "default" : "secondary"}>{x.ativo ? "ativo" : "inativo"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="equipe">
            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[560px]">
                <TableHeader><TableRow>
                  <TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Papéis</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {eqF.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhum membro.</TableCell></TableRow>
                  )}
                  {eqF.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{x.nome ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.email ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {x.roles.length === 0
                            ? <span className="text-xs text-muted-foreground">sem papel</span>
                            : x.roles.map((r: string) => <Badge key={r} variant="outline">{r}</Badge>)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="investidores">
            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[720px]">
                <TableHeader><TableRow>
                  <TableHead>Nome</TableHead><TableHead>Documento</TableHead><TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead><TableHead>PIX</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {invF.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum investidor.</TableCell></TableRow>
                  )}
                  {invF.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{x.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{x.documento ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.telefone ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.email ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.pix ?? "—"}</TableCell>
                      <TableCell><Badge variant={x.status === "ativo" ? "default" : "secondary"}>{x.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

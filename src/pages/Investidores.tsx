import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { dateBR } from "@/lib/format";
import { Link } from "react-router-dom";

interface Inv { id: string; nome: string; documento: string | null; email: string | null; telefone: string | null; pix: string | null; status: string; created_at: string; }

export default function Investidores() {
  const [list, setList] = useState<Inv[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Inv> | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("investidores").select("*").order("nome");
    setList((data as any) ?? []);
    const { data: imv } = await supabase.from("imoveis").select("investidor_id");
    const c: Record<string, number> = {};
    (imv ?? []).forEach((i: any) => { c[i.investidor_id] = (c[i.investidor_id] || 0) + 1; });
    setCounts(c);
  }

  async function save() {
    if (!editing?.nome) return toast.error("Nome obrigatório");
    const payload = { nome: editing.nome, documento: editing.documento, email: editing.email, telefone: editing.telefone, pix: editing.pix, status: (editing.status as any) ?? "ativo" };
    const res = editing.id
      ? await supabase.from("investidores").update(payload).eq("id", editing.id)
      : await supabase.from("investidores").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este investidor?")) return;
    const { error } = await supabase.from("investidores").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  const filtered = list.filter((i) => i.nome.toLowerCase().includes(search.toLowerCase()) || (i.documento ?? "").includes(search));

  return (
    <>
      <PageHeader
        title="Investidores"
        description="Gerencie os proprietários dos imóveis administrados."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({})}><Plus className="mr-2 h-4 w-4" />Novo investidor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} investidor</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2"><Label>Nome *</Label><Input value={editing?.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>CPF / CNPJ</Label><Input value={editing?.documento ?? ""} onChange={(e) => setEditing({ ...editing, documento: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Telefone</Label><Input value={editing?.telefone ?? ""} onChange={(e) => setEditing({ ...editing, telefone: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={editing?.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>PIX</Label><Input value={editing?.pix ?? ""} onChange={(e) => setEditing({ ...editing, pix: e.target.value })} /></div>
              </div>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4 p-6">
        <Input placeholder="Buscar por nome ou documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead><TableHead>Documento</TableHead><TableHead>Contato</TableHead>
                  <TableHead>Imóveis</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead><TableHead className="w-[110px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum investidor cadastrado.</TableCell></TableRow>}
                {filtered.map((i) => {
                  const n = counts[i.id] || 0;
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{i.documento ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{i.email}<br />{i.telefone}</TableCell>
                      <TableCell className="num">{n}</TableCell>
                      <TableCell>{n <= 1 ? <Badge variant="secondary">Único imóvel</Badge> : <Badge>Múltiplos</Badge>}</TableCell>
                      <TableCell><Badge variant={i.status === "ativo" ? "default" : "secondary"}>{i.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{dateBR(i.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(i); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

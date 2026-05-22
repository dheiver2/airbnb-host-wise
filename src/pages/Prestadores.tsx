import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AREAS = [
  { v: "atendimento", l: "Atendimento" },
  { v: "escritorio", l: "Escritório" },
  { v: "faxina", l: "Faxina" },
  { v: "lavanderia", l: "Lavanderia" },
  { v: "logistica", l: "Logística" },
  { v: "manutencao", l: "Manutenção" },
];

export default function Prestadores() {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await (supabase.from("prestadores" as any) as any).select("*").order("nome");
    setList(data ?? []);
  }

  async function save() {
    if (!editing?.nome) return toast.error("Nome obrigatório");
    const payload = {
      nome: editing.nome, documento: editing.documento || null, telefone: editing.telefone || null,
      email: editing.email || null, pix: editing.pix || null, area: editing.area || null,
      observacoes: editing.observacoes || null, ativo: editing.ativo ?? true,
    };
    const res = editing.id
      ? await (supabase.from("prestadores" as any) as any).update(payload).eq("id", editing.id)
      : await (supabase.from("prestadores" as any) as any).insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir prestador?")) return;
    const { error } = await (supabase.from("prestadores" as any) as any).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  const filtered = list.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    (p.documento ?? "").includes(search) ||
    (p.area ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Prestadores"
        description="Cadastro de fornecedores e prestadores de serviço."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ativo: true })}><Plus className="mr-2 h-4 w-4" />Novo prestador</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} prestador</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2"><Label>Nome *</Label><Input value={editing?.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>CPF / CNPJ</Label><Input value={editing?.documento ?? ""} onChange={(e) => setEditing({ ...editing, documento: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Área</Label>
                  <Select value={editing?.area ?? ""} onValueChange={(v) => setEditing({ ...editing, area: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{AREAS.map((a) => <SelectItem key={a.v} value={a.v}>{a.l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Telefone</Label><Input value={editing?.telefone ?? ""} onChange={(e) => setEditing({ ...editing, telefone: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" value={editing?.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                <div className="space-y-1.5 sm:col-span-2"><Label>PIX</Label><Input value={editing?.pix ?? ""} onChange={(e) => setEditing({ ...editing, pix: e.target.value })} /></div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Observações</Label><Textarea value={editing?.observacoes ?? ""} onChange={(e) => setEditing({ ...editing, observacoes: e.target.value })} /></div>
              </div>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4 p-6">
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead><TableHead>Documento</TableHead><TableHead>Área</TableHead>
                  <TableHead>Contato</TableHead><TableHead>PIX</TableHead><TableHead>Status</TableHead>
                  <TableHead className="w-[110px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum prestador cadastrado.</TableCell></TableRow>}
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{p.documento ?? "—"}</TableCell>
                    <TableCell>{p.area ? <Badge variant="outline">{AREAS.find((a) => a.v === p.area)?.l ?? p.area}</Badge> : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.email}<br />{p.telefone}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.pix ?? "—"}</TableCell>
                    <TableCell><Badge variant={p.ativo ? "default" : "secondary"}>{p.ativo ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

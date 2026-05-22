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

export default function TiposServico() {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filtroArea, setFiltroArea] = useState<string>("");

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await (supabase.from("tipos_servico" as any) as any).select("*").order("area").order("nome");
    setList(data ?? []);
  }

  async function save() {
    if (!editing?.nome || !editing?.area) return toast.error("Nome e área obrigatórios");
    const payload = { nome: editing.nome, area: editing.area, descricao: editing.descricao || null, ativo: editing.ativo ?? true };
    const res = editing.id
      ? await (supabase.from("tipos_servico" as any) as any).update(payload).eq("id", editing.id)
      : await (supabase.from("tipos_servico" as any) as any).insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir tipo?")) return;
    const { error } = await (supabase.from("tipos_servico" as any) as any).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  const filtered = filtroArea ? list.filter((t) => t.area === filtroArea) : list;

  return (
    <>
      <PageHeader
        title="Tipos de Serviço"
        description="Catálogo de tipos de serviço usados nos lançamentos operacionais."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ativo: true })}><Plus className="mr-2 h-4 w-4" />Novo tipo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} tipo de serviço</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-1.5"><Label>Nome *</Label><Input value={editing?.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Área *</Label>
                  <Select value={editing?.area ?? ""} onValueChange={(v) => setEditing({ ...editing, area: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{AREAS.map((a) => <SelectItem key={a.v} value={a.v}>{a.l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Descrição</Label><Input value={editing?.descricao ?? ""} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} /></div>
              </div>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4 p-6">
        <Select value={filtroArea || "__all"} onValueChange={(v) => setFiltroArea(v === "__all" ? "" : v)}>
          <SelectTrigger className="max-w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Todas as áreas</SelectItem>
            {AREAS.map((a) => <SelectItem key={a.v} value={a.v}>{a.l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Área</TableHead><TableHead>Nome</TableHead><TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead><TableHead className="w-[110px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum tipo cadastrado.</TableCell></TableRow>}
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell><Badge variant="outline">{AREAS.find((a) => a.v === t.area)?.l ?? t.area}</Badge></TableCell>
                    <TableCell className="font-medium">{t.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{t.descricao ?? "—"}</TableCell>
                    <TableCell><Badge variant={t.ativo ? "default" : "secondary"}>{t.ativo ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
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

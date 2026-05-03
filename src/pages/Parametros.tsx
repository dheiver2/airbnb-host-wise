import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/format";
import { Combobox } from "@/components/Combobox";

export default function Parametros() {
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    const [{ data }, { data: im }] = await Promise.all([
      supabase.from("parametros_servico").select("*, imoveis(codigo)").order("nome"),
      supabase.from("imoveis").select("id, codigo, endereco").order("codigo"),
    ]);
    setList(data ?? []);
    setImoveis(im ?? []);
  }

  async function save() {
    if (!editing?.nome) return toast.error("Nome obrigatório");
    const payload: any = {
      nome: editing.nome, categoria: editing.categoria,
      custo: Number(editing.custo ?? 0), valor_cobrado: Number(editing.valor_cobrado ?? 0),
      ativo: editing.ativo ?? true,
      imovel_id: editing.imovel_id || null,
    };
    const res = editing.id ? await supabase.from("parametros_servico").update(payload).eq("id", editing.id) : await supabase.from("parametros_servico").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    const { error } = await supabase.from("parametros_servico").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  return (
    <>
      <PageHeader
        title="Parâmetros de Serviços"
        description="Tabela de preços de manutenção e serviços operacionais."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ativo: true })}><Plus className="mr-2 h-4 w-4" />Novo serviço</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} serviço</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-1.5"><Label>Nome *</Label><Input value={editing?.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Categoria</Label><Input placeholder="ex: Hidráulica, Elétrica..." value={editing?.categoria ?? ""} onChange={(e) => setEditing({ ...editing, categoria: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Imóvel</Label>
                  <Combobox
                    clearable
                    placeholder="Geral (todos)"
                    className="w-full sm:w-full"
                    options={imoveis.map((i) => ({ value: i.id, label: i.codigo, hint: i.endereco }))}
                    value={editing?.imovel_id ?? ""}
                    onChange={(v) => setEditing({ ...editing, imovel_id: v })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Custo</Label><Input type="number" step="0.01" value={editing?.custo ?? 0} onChange={(e) => setEditing({ ...editing, custo: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor cobrado</Label><Input type="number" step="0.01" value={editing?.valor_cobrado ?? 0} onChange={(e) => setEditing({ ...editing, valor_cobrado: e.target.value })} /></div>
                </div>
                <div className="flex items-center gap-2"><Switch checked={editing?.ativo ?? true} onCheckedChange={(v) => setEditing({ ...editing, ativo: v })} /><Label>Ativo</Label></div>
              </div>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-6">
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Nome</TableHead><TableHead>Imóvel</TableHead><TableHead>Categoria</TableHead><TableHead>Custo</TableHead><TableHead>Cobrado</TableHead><TableHead>Margem</TableHead><TableHead>Ativo</TableHead><TableHead className="w-[110px]"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {list.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum parâmetro cadastrado.</TableCell></TableRow>}
                {list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{p.imoveis?.codigo ?? "Geral"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.categoria ?? "—"}</TableCell>
                    <TableCell className="num">{brl(p.custo)}</TableCell>
                    <TableCell className="num">{brl(p.valor_cobrado)}</TableCell>
                    <TableCell className="num">{brl(Number(p.valor_cobrado) - Number(p.custo))}</TableCell>
                    <TableCell>{p.ativo ? "Sim" : "Não"}</TableCell>
                    <TableCell><div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div></TableCell>
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

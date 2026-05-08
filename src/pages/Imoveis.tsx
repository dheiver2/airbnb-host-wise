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
import { brl } from "@/lib/format";
import { Combobox } from "@/components/Combobox";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const TIPOS = ["studio", "1Q", "2Q", "3Q", "cobertura"] as const;

export default function Imoveis() {
  const { isAdmin } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [invFiltro, setInvFiltro] = useState(searchParams.get("investidor") ?? "");

  useEffect(() => { load(); }, []);

  async function load() {
    const [im, iv] = await Promise.all([
      supabase.from("imoveis").select("*, investidores(nome)").order("codigo"),
      supabase.from("investidores").select("id, nome").order("nome"),
    ]);
    setList(im.data ?? []); setInvestidores(iv.data ?? []);
  }

  async function save() {
    if (!editing?.codigo || !editing?.endereco || !editing?.investidor_id) return toast.error("Preencha código, endereço e investidor");
    const payload = {
      codigo: editing.codigo, endereco: editing.endereco, tipo: editing.tipo ?? "studio",
      investidor_id: editing.investidor_id, capacidade: Number(editing.capacidade ?? 2),
      valor_faxina: Number(editing.valor_faxina ?? 0), valor_lavanderia: Number(editing.valor_lavanderia ?? 0),
      custo_faxina: Number(editing.custo_faxina ?? 0), custo_lavanderia: Number(editing.custo_lavanderia ?? 0),
      percentual_comissao: Number(editing.percentual_comissao ?? 20),
      status: editing.status ?? "ativo",
    };
    const res = editing.id ? await supabase.from("imoveis").update(payload).eq("id", editing.id) : await supabase.from("imoveis").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este imóvel?")) return;
    const { error } = await supabase.from("imoveis").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  const filtered = list
    .filter((i) => !invFiltro || i.investidor_id === invFiltro)
    .filter((i) => i.codigo.toLowerCase().includes(search.toLowerCase()) || i.endereco.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Imóveis"
        description={isAdmin ? "Cadastro dos imóveis administrados, com parâmetros financeiros." : "Visualização dos imóveis (somente leitura)."}
        actions={isAdmin ? (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ tipo: "studio", percentual_comissao: 20, capacidade: 2, status: "ativo" })}>
                <Plus className="mr-2 h-4 w-4" />Novo imóvel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} imóvel</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Código *</Label><Input value={editing?.codigo ?? ""} onChange={(e) => setEditing({ ...editing, codigo: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Investidor *</Label>
                  <Combobox
                    options={investidores.map((i) => ({ value: i.id, label: i.nome }))}
                    value={editing?.investidor_id ?? ""}
                    onChange={(v) => setEditing({ ...editing, investidor_id: v })}
                    placeholder="Selecione"
                    searchPlaceholder="Buscar investidor..."
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Endereço *</Label><Input value={editing?.endereco ?? ""} onChange={(e) => setEditing({ ...editing, endereco: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Tipo</Label>
                  <Select value={editing?.tipo ?? "studio"} onValueChange={(v) => setEditing({ ...editing, tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Capacidade (hóspedes)</Label><Input type="number" value={editing?.capacidade ?? 2} onChange={(e) => setEditing({ ...editing, capacidade: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>% Comissão</Label><Input type="number" step="0.5" value={editing?.percentual_comissao ?? 20} onChange={(e) => setEditing({ ...editing, percentual_comissao: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={editing?.status ?? "ativo"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="manutencao">Em manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Valor faxina (cobrado)</Label><Input type="number" step="0.01" value={editing?.valor_faxina ?? 0} onChange={(e) => setEditing({ ...editing, valor_faxina: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Custo faxina (pago ao prestador)</Label><Input type="number" step="0.01" value={editing?.custo_faxina ?? 0} onChange={(e) => setEditing({ ...editing, custo_faxina: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Valor lavanderia (cobrado)</Label><Input type="number" step="0.01" value={editing?.valor_lavanderia ?? 0} onChange={(e) => setEditing({ ...editing, valor_lavanderia: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Custo lavanderia</Label><Input type="number" step="0.01" value={editing?.custo_lavanderia ?? 0} onChange={(e) => setEditing({ ...editing, custo_lavanderia: e.target.value })} /></div>
              </div>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Buscar por código ou endereço..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Combobox
            options={investidores.map((i) => ({ value: i.id, label: i.nome }))}
            value={invFiltro}
            onChange={setInvFiltro}
            placeholder="Todos investidores"
            searchPlaceholder="Filtrar investidor..."
            clearable
            className="w-[220px]"
          />
          <div className="text-xs text-muted-foreground ml-auto">{filtered.length} de {list.length} imóveis</div>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead><TableHead>Endereço</TableHead><TableHead>Tipo</TableHead>
                  <TableHead>Investidor</TableHead><TableHead>Cap.</TableHead><TableHead>Faxina</TableHead>
                  <TableHead>Lavanderia</TableHead><TableHead>Comissão</TableHead><TableHead>Status</TableHead>
                  <TableHead className="w-[110px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">Nenhum imóvel cadastrado.</TableCell></TableRow>}
                {filtered.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.codigo}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[260px] truncate">{i.endereco}</TableCell>
                    <TableCell><Badge variant="outline">{i.tipo}</Badge></TableCell>
                    <TableCell>{i.investidores?.nome ?? "—"}</TableCell>
                    <TableCell className="num">{i.capacidade}</TableCell>
                    <TableCell className="num text-xs">{brl(i.valor_faxina)}<br /><span className="text-muted-foreground">custo {brl(i.custo_faxina)}</span></TableCell>
                    <TableCell className="num text-xs">{brl(i.valor_lavanderia)}<br /><span className="text-muted-foreground">custo {brl(i.custo_lavanderia)}</span></TableCell>
                    <TableCell className="num">{i.percentual_comissao}%</TableCell>
                    <TableCell><Badge variant={i.status === "ativo" ? "default" : "secondary"}>{i.status}</Badge></TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(i); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
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

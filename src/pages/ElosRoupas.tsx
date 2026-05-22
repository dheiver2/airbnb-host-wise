import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/Combobox";
import { Plus, Trash2, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

const ITENS_COMUNS = [
  "Lençol casal", "Lençol solteiro", "Fronha", "Toalha de banho",
  "Toalha de rosto", "Toalha de piso", "Edredom", "Cobre-leito",
  "Protetor de colchão", "Pano de prato", "Cortina",
];
const STATUS = ["aberto", "enviado", "recebido"] as const;
const STATUS_LABEL: Record<string, string> = { aberto: "Aberto", enviado: "Enviado", recebido: "Recebido" };
const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  aberto: "outline", enviado: "secondary", recebido: "default",
};

type ItemElo = { item: string; quantidade: number };

export default function ElosRoupas() {
  const [mes, setMes] = useCompetenciaState();
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ data: new Date().toISOString().slice(0, 10) });
  const [itens, setItens] = useState<ItemElo[]>([{ item: "", quantidade: 1 }]);

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo, endereco").eq("status", "ativo").order("codigo")
      .then(({ data }) => setImoveis(data ?? []));
  }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await (supabase.from("elos_roupas" as any) as any)
      .select("*, imoveis(codigo, endereco)")
      .gte("data", start).lte("data", end)
      .order("data", { ascending: false });
    setList(data ?? []);
  }

  function addItem() { setItens([...itens, { item: "", quantidade: 1 }]); }
  function rmItem(i: number) { setItens(itens.filter((_, j) => j !== i)); }
  function setItem(i: number, campo: keyof ItemElo, valor: any) {
    setItens(itens.map((x, j) => j === i ? { ...x, [campo]: valor } : x));
  }

  async function save() {
    if (!form.imovel_id || !form.data) return toast.error("Preencha imóvel e data");
    const itensLimpos = itens.filter((x) => x.item.trim() && Number(x.quantidade) > 0)
      .map((x) => ({ item: x.item.trim(), quantidade: Number(x.quantidade) }));
    if (itensLimpos.length === 0) return toast.error("Adicione ao menos um item");
    const { error } = await (supabase.from("elos_roupas" as any) as any).insert({
      imovel_id: form.imovel_id, data: form.data, status: "aberto",
      itens: itensLimpos, observacoes: form.observacoes || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Elo de roupas emitido");
    setOpen(false); setForm({ data: new Date().toISOString().slice(0, 10) });
    setItens([{ item: "", quantidade: 1 }]);
    load();
  }

  async function atualizarStatus(id: string, status: string) {
    await (supabase.from("elos_roupas" as any) as any).update({ status }).eq("id", id);
    load();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este elo de roupas?")) return;
    await (supabase.from("elos_roupas" as any) as any).delete().eq("id", id);
    load();
  }

  function imprimir(elo: any) {
    const its: ItemElo[] = Array.isArray(elo.itens) ? elo.itens : [];
    const totalPecas = its.reduce((s, x) => s + Number(x.quantidade || 0), 0);
    const linhas = its.map((x) => `<tr><td>${x.item}</td><td style="text-align:right">${x.quantidade}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Elo de Roupas</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:24px;color:#111}
        h1{font-size:18px;margin:0 0 4px}
        .meta{font-size:13px;color:#555;margin-bottom:16px}
        table{width:100%;border-collapse:collapse;font-size:14px}
        th,td{border-bottom:1px solid #ddd;padding:6px 4px;text-align:left}
        .tot{font-weight:bold;font-size:15px;margin-top:12px}
      </style></head><body>
      <h1>SA7D — Elo de Roupas</h1>
      <div class="meta">
        Imóvel: <b>${elo.imoveis?.codigo ?? "—"}</b><br>
        ${elo.imoveis?.endereco ?? ""}<br>
        Data: ${dateBR(elo.data)} · Status: ${STATUS_LABEL[elo.status] ?? elo.status}
      </div>
      <table><thead><tr><th>Item</th><th style="text-align:right">Qtd</th></tr></thead>
      <tbody>${linhas}</tbody></table>
      <div class="tot">Total de peças: ${totalPecas}</div>
      ${elo.observacoes ? `<p style="font-size:13px;color:#555">Obs: ${elo.observacoes}</p>` : ""}
      <script>window.onload=()=>{window.print();}</script>
      </body></html>`;
    const w = window.open("", "_blank", "width=480,height=640");
    if (w) { w.document.write(html); w.document.close(); }
  }

  const totalElos = list.length;
  const totalPecas = list.reduce((s, e) => {
    const its: ItemElo[] = Array.isArray(e.itens) ? e.itens : [];
    return s + its.reduce((a, x) => a + Number(x.quantidade || 0), 0);
  }, 0);

  const resumoItem = (elo: any) => {
    const its: ItemElo[] = Array.isArray(elo.itens) ? elo.itens : [];
    const n = its.reduce((s, x) => s + Number(x.quantidade || 0), 0);
    return `${its.length} tipo(s) · ${n} peça(s)`;
  };

  const imovelOpts = useMemo(() => imoveis.map((i) => ({ value: i.id, label: i.codigo, hint: i.endereco })), [imoveis]);

  return (
    <>
      <PageHeader
        title="Emissor de Elos de Roupas"
        description="Comandas de roupas enviadas à lavanderia, por imóvel."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Dialog open={open} onOpenChange={(o) => {
              setOpen(o);
              if (!o) { setForm({ data: new Date().toISOString().slice(0, 10) }); setItens([{ item: "", quantidade: 1 }]); }
            }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo elo</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Emitir elo de roupas</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Imóvel *</Label>
                      <Combobox options={imovelOpts} value={form.imovel_id ?? ""}
                        onChange={(v) => setForm({ ...form, imovel_id: v })}
                        placeholder="Selecione" searchPlaceholder="Buscar imóvel..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data *</Label>
                      <Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Itens</Label>
                    <div className="space-y-2">
                      {itens.map((it, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            list="itens-comuns" placeholder="Item (ex: Lençol casal)"
                            value={it.item} onChange={(e) => setItem(i, "item", e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number" min={1} value={it.quantidade}
                            onChange={(e) => setItem(i, "quantidade", e.target.value)}
                            className="w-20"
                          />
                          <Button type="button" size="icon" variant="ghost" onClick={() => rmItem(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <datalist id="itens-comuns">
                        {ITENS_COMUNS.map((x) => <option key={x} value={x} />)}
                      </datalist>
                      <Button type="button" size="sm" variant="outline" onClick={addItem}>
                        <Plus className="mr-1 h-3.5 w-3.5" />Adicionar item
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Observações</Label>
                    <Input value={form.observacoes ?? ""} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter><Button onClick={save}>Emitir</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Elos no mês</div>
            <div className="num mt-1 text-xl font-semibold">{totalElos}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Total de peças</div>
            <div className="num mt-1 text-xl font-semibold">{totalPecas}</div>
          </CardContent></Card>
        </div>

        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[760px]">
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Itens</TableHead>
              <TableHead>Status</TableHead><TableHead className="w-[120px]"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum elo emitido no mês.</TableCell></TableRow>
              )}
              {list.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{dateBR(e.data)}</TableCell>
                  <TableCell className="font-medium">{e.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{resumoItem(e)}</TableCell>
                  <TableCell>
                    <Select value={e.status} onValueChange={(v) => atualizarStatus(e.id, v)}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue><Badge variant={STATUS_VARIANT[e.status]}>{STATUS_LABEL[e.status]}</Badge></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => imprimir(e)} title="Imprimir">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => excluir(e.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
